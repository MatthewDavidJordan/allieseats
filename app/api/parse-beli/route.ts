// app/api/parse-beli/route.ts
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

export const runtime = "nodejs";

// Allow longer execution for video uploads + Gemini processing
export const maxDuration = 120;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const PROMPT =
  "Return a json of the information in this beli screenshot or video. " +
  "If this is a video, extract ALL places visible across every frame (the user may scroll through a list). " +
  "For each place make sure to return name, the rating (the one that is in green in the circle), " +
  "how pricey (the number of dollar signs), the cuisine, and the location. " +
  "Deduplicate places that appear multiple times. " +
  "Cuisine and location will both be lists. " +
  "Return ONLY JSON (no markdown, no code fences). " +
  "Use key 'price' for the dollar signs.";

const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_MIMES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/mov"]);

function guessMime(file: File): string {
  if (file.type && (IMAGE_MIMES.has(file.type) || VIDEO_MIMES.has(file.type))) return file.type;

  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".webm")) return "video/webm";
  return "image/jpeg";
}

function isVideo(mime: string): boolean {
  return mime.startsWith("video/");
}

function extractText(result: any): string | null {
  // Your result shape: { candidates: [...] }
  const fromCandidates =
    result?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
      ?.filter(Boolean)
      ?.join("") || null;

  if (fromCandidates) return fromCandidates;

  // fallback possibilities
  if (result?.response?.text && typeof result.response.text === "function") return result.response.text();
  if (typeof result?.text === "string") return result.text;

  return null;
}

function stripCodeFences(s: string): string {
  const trimmed = s.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch?.[1]) return fenceMatch[1].trim();
  return trimmed;
}

function normalizeOutput(parsed: any): { places: any[] } {
  const toPlace = (p: any) => ({
    name: p?.name ?? "",
    rating: typeof p?.rating === "number" ? p.rating : Number(p?.rating),
    price: p?.price ?? p?.pricey ?? "",
    cuisine: Array.isArray(p?.cuisine) ? p.cuisine : [],
    location: Array.isArray(p?.location) ? p.location : [],
  });

  if (Array.isArray(parsed)) return { places: parsed.map(toPlace) };

  if (parsed && typeof parsed === "object") {
    const places = Array.isArray(parsed.places) ? parsed.places : [];
    return { places: places.map(toPlace) };
  }

  return { places: [] };
}

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return Response.json(
        {
          error: "Missing GEMINI_API_KEY env var",
          tip: 'Add GEMINI_API_KEY=... to .env.local and restart `npm run dev`.',
        },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    console.log("POST /api/parse-beli content-type:", contentType);

    if (!contentType.includes("multipart/form-data")) {
      return Response.json(
        {
          error: "Expected multipart/form-data",
          got: contentType,
          tip: 'In Postman: Body -> form-data, add key "image" as File.',
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    console.log("formData keys:", Array.from(formData.keys()));

    // Accept either "image" or "file" key for backward compat
    const file = formData.get("image") || formData.get("file");
    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: 'Missing file. Use form-data key "image" (or "file") and set it to File.' },
        { status: 400 }
      );
    }

    console.log("file metadata:", { name: file.name, type: file.type, size: file.size });

    if (file.size === 0) {
      return Response.json({ error: "Uploaded file is empty (size 0)" }, { status: 400 });
    }

    const mimeType = guessMime(file);
    console.log("using mimeType for Gemini:", mimeType, isVideo(mimeType) ? "(video)" : "(image)");

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    let mediaPart: any;

    if (isVideo(mimeType)) {
      // Use Gemini File API for videos (supports larger files)
      console.log("Uploading video to Gemini File API...");
      const blob = new Blob([await file.arrayBuffer()], { type: mimeType });
      const uploaded = await ai.files.upload({
        file: blob,
        config: { mimeType },
      });
      console.log("Gemini file upload complete:", uploaded.name, uploaded.uri);

      // Poll until the file is ACTIVE (video processing can take a moment)
      let fileState = uploaded;
      while (fileState.state === "PROCESSING") {
        console.log("Waiting for video processing...");
        await new Promise((r) => setTimeout(r, 2000));
        fileState = await ai.files.get({ name: fileState.name! });
      }
      if (fileState.state === "FAILED") {
        return Response.json(
          { error: "Gemini failed to process the video file" },
          { status: 502 }
        );
      }

      mediaPart = createPartFromUri(fileState.uri!, fileState.mimeType!);
    } else {
      // Use inline base64 for images
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      mediaPart = { inlineData: { mimeType, data: base64 } };
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        PROMPT,
        mediaPart,
      ]),
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    console.log("Gemini result keys:", Object.keys(result ?? {}));

    const rawText = extractText(result);
    if (!rawText) {
      return Response.json(
        { error: "Could not extract text from Gemini response", resultKeys: Object.keys(result ?? {}) },
        { status: 502 }
      );
    }

    const cleaned = stripCodeFences(rawText);
    console.log("gemini raw response (first 200 chars):", cleaned.slice(0, 200));

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json(
        {
          error: "Gemini did not return valid JSON (after stripping fences)",
          raw: rawText,
          cleaned,
        },
        { status: 502 }
      );
    }

    const normalized = normalizeOutput(parsed);

    // Save parsed places to the Beli pool in Firestore
    try {
      const { bulkUpsertBeliPlaces } = await import("@/lib/firebase-beli");
      await bulkUpsertBeliPlaces(
        normalized.places.filter((p: any) => p.name.trim())
      );
    } catch (saveErr) {
      console.error("Failed to save parsed places to Beli pool:", saveErr);
      // Non-fatal — still return the parsed results
    }

    return Response.json(normalized);
  } catch (err: any) {
    console.error("Route error:", err);
    return Response.json(
      { error: "Server error", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
