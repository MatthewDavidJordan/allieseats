"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Upload,
  Save,
  Trash2,
  Loader2,
  ImageIcon,
  Check,
  Star,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  getListById,
  createList,
  updateList,
  deleteList,
  uploadListCoverImage,
} from "@/lib/firebase-lists"
import { getReviews } from "@/lib/firebase-reviews"
import type { Review } from "@/lib/review-types"

function EditListPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get("id")
  const isEditMode = Boolean(editId)

  // Loading / saving state
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // All reviews for the picker
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImage, setExistingImage] = useState("")
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load all reviews
  useEffect(() => {
    getReviews()
      .then(setAllReviews)
      .catch(console.error)
      .finally(() => setReviewsLoading(false))
  }, [])

  // Load existing list if editing
  useEffect(() => {
    if (!editId) return
    getListById(editId)
      .then((list) => {
        if (!list) {
          setError("List not found")
          return
        }
        setTitle(list.title)
        setDescription(list.description)
        setExistingImage(list.coverImage)
        setSelectedReviewIds(list.reviewIds)
      })
      .catch(() => setError("Failed to load list"))
      .finally(() => setLoading(false))
  }, [editId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const toggleReview = (reviewId: string) => {
    setSelectedReviewIds((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setSaving(true)
    setError(null)

    try {
      let coverImage = existingImage

      if (isEditMode && editId) {
        if (imageFile) {
          coverImage = await uploadListCoverImage(imageFile, editId)
        }
        await updateList(editId, {
          title: title.trim(),
          description: description.trim(),
          coverImage,
          reviewIds: selectedReviewIds,
        })
      } else {
        // Create first to get the slug, then upload image
        const newList = await createList({
          title: title.trim(),
          description: description.trim(),
          coverImage: "",
          reviewIds: selectedReviewIds,
          createdAt: new Date().toISOString(),
        })

        if (imageFile) {
          coverImage = await uploadListCoverImage(imageFile, newList.id)
          await updateList(newList.id, { coverImage })
        }
      }

      router.push("/admin/lists")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save list")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editId) return
    if (!confirm("Are you sure you want to delete this list?")) return

    setDeleting(true)
    try {
      await deleteList(editId)
      router.push("/admin/lists")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete list")
      setDeleting(false)
    }
  }

  const displayImage = imagePreview || existingImage

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/admin/lists"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to lists</span>
          </Link>

          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            {isEditMode ? "Edit List" : "Create New List"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isEditMode
              ? "Update this curated collection."
              : "Curate a new collection of your favorite spots."}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Title */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Title</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  The name of your list.
                </p>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Favorite Bars in DC"
              />
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  A short description of what this list is about.
                </p>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="The coziest spots for cocktails and good vibes..."
                rows={3}
              />
            </div>

            {/* Cover Image */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Cover Image</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  A thumbnail photo for the list card.
                </p>
              </div>

              {displayImage ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <Image
                    src={displayImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-xl bg-muted flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {displayImage ? "Change Image" : "Upload Image"}
              </Button>
              {imageFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {imageFile.name}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Review Picker */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Reviews</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Click reviews to add or remove them from this list.
                  {selectedReviewIds.length > 0 && (
                    <span className="text-primary font-medium">
                      {" "}
                      {selectedReviewIds.length} selected
                    </span>
                  )}
                </p>
              </div>

              {reviewsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : allReviews.length === 0 ? (
                <p className="text-muted-foreground text-sm py-6 text-center">
                  No reviews found. Create some reviews first.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {allReviews.map((review) => {
                    const isSelected = selectedReviewIds.includes(review.id)
                    return (
                      <button
                        key={review.id}
                        type="button"
                        onClick={() => toggleReview(review.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border hover:border-primary/30 bg-background"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden relative">
                          <Image
                            src={review.image || "/placeholder.svg"}
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {review.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span>{review.rating.toFixed(1)}</span>
                            <span>·</span>
                            <span className="truncate">
                              {review.location[review.location.length - 1] || ""}
                            </span>
                          </div>
                        </div>

                        {/* Check indicator */}
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {isEditMode ? (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete List
                    </>
                  )}
                </Button>
              ) : (
                <div />
              )}

              <Button onClick={handleSave} disabled={saving || deleting} size="lg">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? "Save Changes" : "Create List"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function EditListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditListPageContent />
    </Suspense>
  )
}
