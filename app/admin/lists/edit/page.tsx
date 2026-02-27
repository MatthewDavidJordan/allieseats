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
  X,
  UtensilsCrossed,
  Plus,
  Search,
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
import type { ListItem } from "@/lib/firebase-lists"
import { getReviews } from "@/lib/firebase-reviews"
import type { Review } from "@/lib/review-types"
import { searchBeliPlaces } from "@/lib/firebase-beli"
import type { BeliPlace } from "@/lib/beli-types"
import {
  Select,
  SelectContent,
  SelectItem as SelectOption,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [items, setItems] = useState<ListItem[]>([])
  const [restaurantName, setRestaurantName] = useState("")

  // Beli picker state
  const [beliSearch, setBeliSearch] = useState("")
  const [beliResults, setBeliResults] = useState<BeliPlace[]>([])
  const [beliLoading, setBeliLoading] = useState(false)
  const [beliError, setBeliError] = useState<string | null>(null)
  const [beliFilterCuisine, setBeliFilterCuisine] = useState<string>("")
  const [beliFilterLocation, setBeliFilterLocation] = useState<string>("")
  const [beliFilterPrice, setBeliFilterPrice] = useState<string>("")
  const [beliSortBy, setBeliSortBy] = useState<"name" | "rating">("name")

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load all reviews
  useEffect(() => {
    getReviews()
      .then(setAllReviews)
      .catch(console.error)
      .finally(() => setReviewsLoading(false))
  }, [])

  // Load all Beli ratings on mount
  useEffect(() => {
    setBeliLoading(true)
    searchBeliPlaces("")
      .then(setBeliResults)
      .catch(() => setBeliError("Failed to load Beli ratings"))
      .finally(() => setBeliLoading(false))
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
        setItems(list.items)
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

  const selectedReviewIds = items
    .filter((i): i is { type: "review"; reviewId: string } => i.type === "review")
    .map((i) => i.reviewId)

  const toggleReview = (reviewId: string) => {
    const exists = items.some(
      (i) => i.type === "review" && i.reviewId === reviewId
    )
    if (exists) {
      setItems((prev) =>
        prev.filter((i) => !(i.type === "review" && i.reviewId === reviewId))
      )
    } else {
      setItems((prev) => [...prev, { type: "review", reviewId }])
    }
  }

  const addRestaurantName = () => {
    const name = restaurantName.trim()
    if (!name) return
    setItems((prev) => [...prev, { type: "restaurant", name }])
    setRestaurantName("")
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Beli pool search
  const handleBeliSearch = async (term?: string) => {
    const q = term ?? beliSearch
    setBeliLoading(true)
    setBeliError(null)
    try {
      const results = await searchBeliPlaces(q)
      setBeliResults(results)
    } catch {
      setBeliError("Failed to search Beli pool")
    } finally {
      setBeliLoading(false)
    }
  }

  const selectedBeliIds = items
    .filter((i): i is { type: "beli"; beliId: string; name: string; rating: number } => i.type === "beli")
    .map((i) => i.beliId)

  const toggleBeli = (place: BeliPlace) => {
    const exists = items.some(
      (i) => i.type === "beli" && i.beliId === place.id
    )
    if (exists) {
      setItems((prev) =>
        prev.filter((i) => !(i.type === "beli" && (i as any).beliId === place.id))
      )
    } else {
      setItems((prev) => [
        ...prev,
        { type: "beli", beliId: place.id, name: place.name, rating: place.rating },
      ])
    }
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
          items,
        })
      } else {
        // Create first to get the slug, then upload image
        const newList = await createList({
          title: title.trim(),
          description: description.trim(),
          coverImage: "",
          reviewIds: [],
          items,
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

            {/* Add Restaurant Name */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Add a Restaurant</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a restaurant by name without linking to a review.
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g. Joe's Pizza"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addRestaurantName()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRestaurantName}
                  disabled={!restaurantName.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Review Picker */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Add from Reviews</Label>
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

            {/* Beli Picker */}
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <Label className="text-base font-semibold">Add from Beli Ratings</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Search your Beli ratings pool and click to add or remove.
                  {selectedBeliIds.length > 0 && (
                    <span className="text-primary font-medium">
                      {" "}
                      {selectedBeliIds.length} selected
                    </span>
                  )}
                </p>
              </div>

              {/* Search bar */}
              <div className="flex gap-2">
                <Input
                  value={beliSearch}
                  onChange={(e) => setBeliSearch(e.target.value)}
                  placeholder="Search by restaurant name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleBeliSearch()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleBeliSearch()}
                  disabled={beliLoading}
                >
                  {beliLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {beliError && (
                <p className="text-sm text-destructive">{beliError}</p>
              )}

              {/* Filters + results */}
              {beliResults.length > 0 && (() => {
                const allCuisines = Array.from(new Set(beliResults.flatMap((p) => p.cuisine))).sort()
                const allLocations = Array.from(new Set(beliResults.flatMap((p) => p.location))).sort()
                const allPrices = Array.from(new Set(beliResults.map((p) => p.price).filter(Boolean))).sort((a, b) => a.length - b.length)

                const filtered = beliResults
                  .filter((p) => !beliFilterCuisine || p.cuisine.includes(beliFilterCuisine))
                  .filter((p) => !beliFilterLocation || p.location.includes(beliFilterLocation))
                  .filter((p) => !beliFilterPrice || p.price === beliFilterPrice)
                  .sort((a, b) =>
                    beliSortBy === "rating"
                      ? b.rating - a.rating
                      : a.name.localeCompare(b.name)
                  )

                const hasActiveFilter = beliFilterCuisine || beliFilterLocation || beliFilterPrice

                return (
                  <>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center">
                      <Select value={beliFilterCuisine} onValueChange={(v) => setBeliFilterCuisine(v === "__all__" ? "" : v)}>
                        <SelectTrigger className="h-8 text-xs w-full sm:w-[140px]">
                          <SelectValue placeholder="All cuisines" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectOption value="__all__">All cuisines</SelectOption>
                          {allCuisines.map((c) => (
                            <SelectOption key={c} value={c}>{c}</SelectOption>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={beliFilterLocation} onValueChange={(v) => setBeliFilterLocation(v === "__all__" ? "" : v)}>
                        <SelectTrigger className="h-8 text-xs w-full sm:w-[150px]">
                          <SelectValue placeholder="All locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectOption value="__all__">All locations</SelectOption>
                          {allLocations.map((l) => (
                            <SelectOption key={l} value={l}>{l}</SelectOption>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={beliFilterPrice} onValueChange={(v) => setBeliFilterPrice(v === "__all__" ? "" : v)}>
                        <SelectTrigger className="h-8 text-xs w-full sm:w-[110px]">
                          <SelectValue placeholder="All prices" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectOption value="__all__">All prices</SelectOption>
                          {allPrices.map((p) => (
                            <SelectOption key={p} value={p}>{p}</SelectOption>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={beliSortBy} onValueChange={(v) => setBeliSortBy(v as "name" | "rating")}>
                        <SelectTrigger className="h-8 text-xs w-full sm:w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectOption value="name">Sort: A–Z</SelectOption>
                          <SelectOption value="rating">Sort: Rating</SelectOption>
                        </SelectContent>
                      </Select>
                      {hasActiveFilter && (
                        <button
                          type="button"
                          onClick={() => {
                            setBeliFilterCuisine("")
                            setBeliFilterLocation("")
                            setBeliFilterPrice("")
                          }}
                          className="col-span-2 sm:col-span-1 text-xs text-primary hover:underline text-center sm:text-left"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground font-medium">
                      {filtered.length} of {beliResults.length} place{beliResults.length !== 1 && "s"}{hasActiveFilter ? " (filtered)" : ""} — click to toggle
                    </p>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {filtered.map((place, i) => {
                        const isSelected = selectedBeliIds.includes(place.id)
                        return (
                          <button
                            key={place.id || i}
                            type="button"
                            onClick={() => toggleBeli(place)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                              isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:border-primary/30 bg-background"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-medium text-foreground text-sm truncate">
                                    {place.name}
                                  </span>
                                  {place.price && (
                                    <span className="text-xs text-muted-foreground shrink-0">
                                      {place.price}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {place.cuisine.length > 0 && (
                                    <span className="truncate">{place.cuisine.join(", ")}</span>
                                  )}
                                  {place.cuisine.length > 0 && place.location.length > 0 && (
                                    <span>·</span>
                                  )}
                                  {place.location.length > 0 && (
                                    <span className="truncate">{place.location.join(", ")}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                {place.rating > 0 && (
                                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10">
                                    <Star className="w-3 h-3 text-primary fill-primary" />
                                    <span className="text-xs font-semibold text-primary">
                                      {place.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                      {filtered.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-3">
                          No places match the current filters.
                        </p>
                      )}
                    </div>
                  </>
                )
              })()}

              {/* Empty state */}
              {!beliLoading && beliResults.length === 0 && !beliError && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Search to browse your Beli ratings pool.
                </p>
              )}
            </div>

            {/* Current Items Summary */}
            {items.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <div>
                  <Label className="text-base font-semibold">Current Items</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {items.length} {items.length === 1 ? "item" : "items"} in this list. Drag to reorder or click &times; to remove.
                  </p>
                </div>
                <div className="space-y-2">
                  {items.map((item, index) => {
                    if (item.type === "review") {
                      const review = allReviews.find((r) => r.id === item.reviewId)
                      return (
                        <div
                          key={`review-${item.reviewId}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden relative">
                            <Image
                              src={review?.image || "/placeholder.svg"}
                              alt={review?.name || "Review"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {review?.name || item.reviewId}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              <span>{review?.rating.toFixed(1) ?? "—"}</span>
                              <span className="text-primary/60">· Review</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="flex-shrink-0 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    } else if (item.type === "beli") {
                      return (
                        <div
                          key={`beli-${item.beliId}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              <span>{item.rating.toFixed(1)}</span>
                              <span className="text-primary/60">· Beli</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="flex-shrink-0 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    } else {
                      return (
                        <div
                          key={`restaurant-${index}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Restaurant</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="flex-shrink-0 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            )}

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
