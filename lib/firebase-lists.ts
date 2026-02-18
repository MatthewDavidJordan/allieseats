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

export interface FoodList {
  id: string
  title: string
  description: string
  coverImage: string
  reviewIds: string[] // document IDs from the reviews collection
  createdAt: string   // ISO timestamp
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
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodList))
}

export async function getListById(id: string): Promise<FoodList | null> {
  const docRef = doc(db, LISTS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as FoodList
}

export async function createList(
  data: Omit<FoodList, "id">
): Promise<FoodList> {
  const slug = generateListSlug(data.title)
  const listData = { ...data }
  await setDoc(doc(db, LISTS_COLLECTION, slug), listData)
  return { id: slug, ...listData }
}

export async function updateList(
  id: string,
  data: Partial<Omit<FoodList, "id">>
): Promise<void> {
  const docRef = doc(db, LISTS_COLLECTION, id)
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
