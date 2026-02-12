import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"
import type { BeliPlace } from "./beli-types"

const BELI_COLLECTION = "beli_ratings"

// ── Key generation ──

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function beliKey(name: string, location: string[]): string {
  const city = location.length > 0 ? location[location.length - 1] : ""
  return slugify(`${name} ${city}`)
}

// ── Normalize for matching ──

export function normalizeForMatch(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "")
}

// ── CRUD ──

export async function getAllBeliPlaces(): Promise<BeliPlace[]> {
  const q = query(
    collection(db, BELI_COLLECTION),
    orderBy("name", "asc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BeliPlace))
}

export async function upsertBeliPlace(
  place: Omit<BeliPlace, "id" | "createdAt">
): Promise<BeliPlace> {
  const id = beliKey(place.name, place.location)
  const data: BeliPlace = {
    ...place,
    id,
    createdAt: new Date().toISOString(),
  }
  await setDoc(doc(db, BELI_COLLECTION, id), data)
  return data
}

export async function bulkUpsertBeliPlaces(
  places: Omit<BeliPlace, "id" | "createdAt">[]
): Promise<BeliPlace[]> {
  const results: BeliPlace[] = []
  for (const place of places) {
    const saved = await upsertBeliPlace(place)
    results.push(saved)
  }
  return results
}

// ── Search / match ──

export async function searchBeliPlaces(searchTerm: string): Promise<BeliPlace[]> {
  const all = await getAllBeliPlaces()
  if (!searchTerm.trim()) return all

  const needle = normalizeForMatch(searchTerm)
  return all.filter((p) => normalizeForMatch(p.name).includes(needle))
}

export async function findBeliMatch(
  name: string,
  location: string[]
): Promise<BeliPlace | null> {
  const all = await getAllBeliPlaces()
  const needle = normalizeForMatch(name)

  // Try name + location match first
  const exactMatch = all.find(
    (p) =>
      normalizeForMatch(p.name) === needle &&
      p.location.some((loc) => location.includes(loc))
  )
  if (exactMatch) return exactMatch

  // Fall back to name-only match
  const nameMatch = all.find((p) => normalizeForMatch(p.name) === needle)
  return nameMatch || null
}
