import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase"

// ── Types ──

export type ListItem =
  | { type: "review"; reviewId: string }
  | { type: "restaurant"; name: string }

export interface FoodList {
  id: string
  title: string
  description: string
  coverImage: string
  reviewIds: string[] // legacy – kept for backward compat
  items: ListItem[]   // new flexible list of entries
  createdAt: string   // ISO timestamp
}

/**
 * Normalise a Firestore document into a FoodList.
 * Old documents that only have `reviewIds` get an auto-generated `items` array.
 */
function normaliseFoodList(id: string, data: Record<string, any>): FoodList {
  const reviewIds: string[] = data.reviewIds ?? []
  const items: ListItem[] = data.items ?? reviewIds.map((rid: string) => ({ type: "review" as const, reviewId: rid }))
  return { ...data, id, reviewIds, items } as FoodList
}

const LISTS_COLLECTION = "lists"

// ── Slug generation ──

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function randomSuffix(length = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateListSlug(title: string): string {
  const base = slugify(title)
  return `${base}-${randomSuffix()}`
}

// ── CRUD operations ──

export async function getLists(): Promise<FoodList[]> {
  const q = query(
    collection(db, LISTS_COLLECTION),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => normaliseFoodList(d.id, d.data()))
}

export async function getListById(id: string): Promise<FoodList | null> {
  const docRef = doc(db, LISTS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return normaliseFoodList(snapshot.id, snapshot.data())
}

export async function createList(
  data: Omit<FoodList, "id">
): Promise<FoodList> {
  const slug = generateListSlug(data.title)
  // Derive reviewIds from items for backward compat
  const reviewIds = (data.items ?? []).filter((i) => i.type === "review").map((i) => (i as { type: "review"; reviewId: string }).reviewId)
  const listData = { ...data, reviewIds }
  await setDoc(doc(db, LISTS_COLLECTION, slug), listData)
  return { id: slug, ...listData }
}

export async function updateList(
  id: string,
  data: Partial<Omit<FoodList, "id">>
): Promise<void> {
  const docRef = doc(db, LISTS_COLLECTION, id)
  // Keep reviewIds in sync when items are provided
  if (data.items) {
    data.reviewIds = data.items
      .filter((i): i is { type: "review"; reviewId: string } => i.type === "review")
      .map((i) => i.reviewId)
  }
  await updateDoc(docRef, data)
}

export async function deleteList(id: string): Promise<void> {
  await deleteDoc(doc(db, LISTS_COLLECTION, id))
}

// ── Image upload ──

export async function uploadListCoverImage(
  file: File,
  slug: string
): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg"
  const path = `lists/${slug}/cover.${extension}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
