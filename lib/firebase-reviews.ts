import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"
import { db, storage } from "./firebase"
import type { Review } from "./review-types"

const REVIEWS_COLLECTION = "reviews"

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

export function generateSlug(name: string, location: string[]): string {
  const city = location.length > 0 ? location[location.length - 1] : ""
  const base = slugify(`${name} ${city}`)
  return `${base}-${randomSuffix()}`
}

// ── CRUD operations ──

export async function getReviews(): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    orderBy("date", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review))
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const docRef = doc(db, REVIEWS_COLLECTION, slug)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Review
}

export async function getLatestReviews(count: number = 6): Promise<Review[]> {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    orderBy("date", "desc"),
    limit(count)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review))
}

export async function createReview(data: Omit<Review, "id">): Promise<Review> {
  const slug = data.slug || generateSlug(data.name, data.location)
  const reviewData = { ...data, slug }
  await setDoc(doc(db, REVIEWS_COLLECTION, slug), reviewData)
  return { id: slug, ...reviewData }
}

export async function updateReview(
  slug: string,
  data: Partial<Omit<Review, "id">>
): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, slug)
  await updateDoc(docRef, data)
}

export async function deleteReview(slug: string): Promise<void> {
  await deleteDoc(doc(db, REVIEWS_COLLECTION, slug))
}

// ── Image upload ──

export async function uploadReviewImage(
  file: File,
  slug: string
): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg"
  const path = `reviews/${slug}/cover.${extension}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}
