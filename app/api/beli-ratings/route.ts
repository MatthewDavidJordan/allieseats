import { bulkUpsertBeliPlaces } from "@/lib/firebase-beli"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return Response.json(
        {
          error: "Expected application/json",
          got: contentType,
          tip: 'Send a JSON body with a "places" array.',
        },
        { status: 400 }
      )
    }

    const body = await req.json()

    // Accept either { places: [...] } or a raw array
    const raw = Array.isArray(body) ? body : body?.places
    if (!Array.isArray(raw) || raw.length === 0) {
      return Response.json(
        {
          error: 'Body must contain a non-empty "places" array.',
          example: {
            places: [
              {
                name: "O-Ku",
                rating: 10,
                price: "$$$",
                cuisine: ["Japanese", "Sushi"],
                location: ["Northeast Washington", "Washington, DC"],
              },
            ],
          },
        },
        { status: 400 }
      )
    }

    // Normalize each entry
    const places = raw.map((p: any) => ({
      name: typeof p?.name === "string" ? p.name : "",
      rating: typeof p?.rating === "number" ? p.rating : Number(p?.rating) || 0,
      price: typeof p?.price === "string" ? p.price : "",
      cuisine: Array.isArray(p?.cuisine) ? p.cuisine : [],
      location: Array.isArray(p?.location) ? p.location : [],
    }))

    // Filter out entries without a name
    const valid = places.filter((p: any) => p.name.trim())

    if (valid.length === 0) {
      return Response.json(
        { error: "No valid places found (each must have a non-empty name)." },
        { status: 400 }
      )
    }

    const saved = await bulkUpsertBeliPlaces(valid)

    return Response.json({
      message: `Upserted ${saved.length} place(s) to Beli pool.`,
      count: saved.length,
      places: saved,
    })
  } catch (err: any) {
    console.error("POST /api/beli-ratings error:", err)
    return Response.json(
      { error: "Server error", details: String(err?.message ?? err) },
      { status: 500 }
    )
  }
}
