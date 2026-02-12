import { doc, getDoc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase"

export interface SiteSettings {
  profileImage: string
  beliLink: string
}

const SETTINGS_DOC = "site_settings"
const SETTINGS_ID = "main"

const DEFAULTS: SiteSettings = {
  profileImage: "/images/profile.jpg",
  beliLink: "https://beliapp.co/app/alliestevens",
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const docRef = doc(db, SETTINGS_DOC, SETTINGS_ID)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return DEFAULTS
  const data = snapshot.data()
  return {
    profileImage: data.profileImage || DEFAULTS.profileImage,
    beliLink: data.beliLink || DEFAULTS.beliLink,
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  const docRef = doc(db, SETTINGS_DOC, SETTINGS_ID)
  await setDoc(docRef, data, { merge: true })
}

export async function uploadProfileImage(file: File): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg"
  const path = `site/profile.${extension}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
