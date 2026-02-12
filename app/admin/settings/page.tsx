"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, Save, Loader2, ExternalLink, ImageIcon } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getSiteSettings,
  updateSiteSettings,
  uploadProfileImage,
} from "@/lib/firebase-settings"
import type { SiteSettings } from "@/lib/firebase-settings"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [beliLink, setBeliLink] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        setBeliLink(settings.beliLink)
        setProfileImage(settings.profileImage)
      })
      .catch((err) => setError("Failed to load settings"))
      .finally(() => setLoading(false))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      let newImageUrl = profileImage

      if (imageFile) {
        newImageUrl = await uploadProfileImage(imageFile)
      }

      await updateSiteSettings({
        beliLink: beliLink.trim(),
        profileImage: newImageUrl,
      })

      setProfileImage(newImageUrl)
      setImageFile(null)
      setImagePreview(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const displayImage = imagePreview || profileImage

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to admin</span>
          </Link>

          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Site Settings
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage your profile image and Beli link. These are used across the entire site.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Error / Success banners */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 text-sm">
                  Settings saved successfully!
                </div>
              )}

              {/* Profile Image */}
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <div>
                  <Label className="text-base font-semibold">Profile Image</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Used on the About page. Stored in Firebase Storage.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Current image preview */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 flex-shrink-0 bg-muted">
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profileImage ? "Change Image" : "Upload Image"}
                    </Button>
                    {imageFile && (
                      <p className="text-xs text-muted-foreground">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Beli Link */}
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <div>
                  <Label className="text-base font-semibold">Beli Profile Link</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your Beli profile URL. Used in the hero section, review pages, and anywhere
                    &ldquo;Follow me on Beli&rdquo; appears.
                  </p>
                </div>

                <Input
                  value={beliLink}
                  onChange={(e) => setBeliLink(e.target.value)}
                  placeholder="https://beliapp.co/app/yourname"
                />

                {beliLink && (
                  <a
                    href={beliLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    Preview link
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
