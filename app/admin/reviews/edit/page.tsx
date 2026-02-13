"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Star,
  UtensilsCrossed,
  ImageIcon,
  Save,
  Trash2,
  Loader2,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getReviewBySlug,
  createReview,
  updateReview,
  uploadReviewImage,
  uploadGalleryImage,
  generateSlug,
} from "@/lib/firebase-reviews"
import { searchBeliPlaces } from "@/lib/firebase-beli"
import type { BeliPlace } from "@/lib/beli-types"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

function EditReviewPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editSlug = searchParams.get("slug")
  const isEditMode = Boolean(editSlug)

  // Loading / saving state
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [headline, setHeadline] = useState("")
  const [rating, setRating] = useState("")
  const [price, setPrice] = useState("")
  const [date, setDate] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Tags-style inputs
  const [cuisineInput, setCuisineInput] = useState("")
  const [cuisines, setCuisines] = useState<string[]>([])
  const [locationInput, setLocationInput] = useState("")
  const [locations, setLocations] = useState<string[]>([])
  const [orderInput, setOrderInput] = useState("")
  const [orderHighlights, setOrderHighlights] = useState<string[]>([])

  // Content paragraphs
  const [paragraphs, setParagraphs] = useState<string[]>([""])

  // Gallery state
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [existingGallery, setExistingGallery] = useState<string[]>([])

  // Hidden file input refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const beliFileInputRef = useRef<HTMLInputElement>(null)

  // Beli import state
  const [beliOpen, setBeliOpen] = useState(false)
  const [beliSearch, setBeliSearch] = useState("")
  const [beliResults, setBeliResults] = useState<BeliPlace[]>([])
  const [beliLoading, setBeliLoading] = useState(false)
  const [beliParsing, setBeliParsing] = useState(false)
  const [beliError, setBeliError] = useState<string | null>(null)

  // Beli filter state
  const [beliFilterCuisine, setBeliFilterCuisine] = useState<string>("")
  const [beliFilterLocation, setBeliFilterLocation] = useState<string>("")
  const [beliFilterPrice, setBeliFilterPrice] = useState<string>("")
  const [beliSortBy, setBeliSortBy] = useState<"name" | "rating">("name")

  // Load existing review when editing
  useEffect(() => {
    if (!editSlug) return
    setLoading(true)
    getReviewBySlug(editSlug)
      .then((review) => {
        if (!review) {
          setError("Review not found")
          return
        }
        setName(review.name)
        setHeadline(review.headline)
        setRating(String(review.rating))
        setPrice(review.price)
        setDate(review.date)
        setImagePreview(review.image)
        setCuisines(review.cuisine)
        setLocations(review.location)
        setOrderHighlights(review.orderHighlights)
        setParagraphs(review.content.length > 0 ? review.content : [""])
        setExistingGallery(review.gallery || [])
      })
      .catch(() => setError("Failed to load review"))
      .finally(() => setLoading(false))
  }, [editSlug])

  const addTag = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void
  ) => {
    const trimmed = value.trim()
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed])
    }
    setInput("")
  }

  const removeTag = (index: number, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((_, i) => i !== index))
  }

  const addParagraph = () => {
    setParagraphs([...paragraphs, ""])
  }

  const updateParagraph = (index: number, value: string) => {
    const updated = [...paragraphs]
    updated[index] = value
    setParagraphs(updated)
  }

  const removeParagraph = (index: number) => {
    if (paragraphs.length > 1) {
      setParagraphs(paragraphs.filter((_, i) => i !== index))
    }
  }

  // Image file selection handler
  const handleImageSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)
  }

  // Save handler
  const handleSave = async () => {
    if (!name.trim() || !headline.trim()) {
      setError("Restaurant name and headline are required.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const slug = editSlug || generateSlug(name, locations)

      // Upload image if a new file was selected
      let imageUrl = imagePreview || ""
      if (imageFile) {
        imageUrl = await uploadReviewImage(imageFile, slug)
      }

      // Upload new gallery images
      const newGalleryUrls = await Promise.all(
        galleryFiles.map((file, i) => uploadGalleryImage(file, slug, i))
      )
      const gallery = [...existingGallery, ...newGalleryUrls]

      const reviewData = {
        name,
        headline,
        rating: parseFloat(rating) || 0,
        price,
        cuisine: cuisines,
        location: locations,
        date,
        image: imageUrl,
        gallery,
        content: paragraphs.filter((p) => p.trim()),
        orderHighlights,
        slug,
      }

      if (isEditMode && editSlug) {
        await updateReview(editSlug, reviewData)
      } else {
        await createReview(reviewData)
      }

      router.push("/admin/reviews")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review")
    } finally {
      setSaving(false)
    }
  }

  // Beli pool search handler
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

  // Beli screenshot/video parse handler — uploads to Firebase Storage first
  const handleBeliScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBeliParsing(true)
    setBeliError(null)
    try {
      // Upload to Firebase Storage
      const ext = file.name.split(".").pop() || "bin"
      const storagePath = `beli-uploads/${Date.now()}.${ext}`
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, file)
      const fileUrl = await getDownloadURL(storageRef)

      // Send the URL to the parse API
      const res = await fetch("/api/parse-beli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, mimeType: file.type || undefined }),
      })
      let data: any
      try {
        data = await res.json()
      } catch {
        throw new Error("Server returned an invalid response.")
      }
      if (!res.ok) throw new Error(data.error || "Parse failed")
      const places: BeliPlace[] = (data.places || []).map((p: any) => ({
        id: "",
        name: p.name || "",
        rating: p.rating || 0,
        price: p.price || "",
        cuisine: p.cuisine || [],
        location: p.location || [],
        createdAt: "",
      }))
      setBeliResults(places)
    } catch (err) {
      setBeliError(err instanceof Error ? err.message : "Failed to parse file")
    } finally {
      setBeliParsing(false)
      if (beliFileInputRef.current) beliFileInputRef.current.value = ""
    }
  }

  // Apply a Beli place to the form
  const applyBeliPlace = (place: BeliPlace) => {
    if (place.name) setName(place.name)
    if (place.rating) setRating(String(place.rating))
    if (place.price) setPrice(place.price)
    if (place.cuisine.length > 0) setCuisines(place.cuisine)
    if (place.location.length > 0) setLocations(place.location)
    setBeliOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Hidden file input for Beli screenshot or video */}
      <input
        ref={beliFileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleBeliScreenshot}
      />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to all reviews</span>
          </Link>

          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-primary/20">
                <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {isEditMode ? "Edit Review" : "New Review"}
                </span>
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
              {isEditMode ? "Edit Review" : "Create a Review"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Update the details for this review."
                : "Fill in the details below to add a new restaurant review."}
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading review...</p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* ── Import from Beli ── */}
          {!loading && (
            <div className="mb-8">
              <button
                type="button"
                onClick={() => {
                  setBeliOpen(!beliOpen)
                  if (!beliOpen && beliResults.length === 0) handleBeliSearch("")
                }}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">Import from Beli</p>
                    <p className="text-xs text-muted-foreground">
                      Search your saved ratings or parse a screenshot/video
                    </p>
                  </div>
                </div>
                {beliOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {beliOpen && (
                <div className="mt-3 p-5 rounded-xl border border-border bg-card space-y-4">
                  {/* Search + Screenshot row */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search saved Beli ratings..."
                        className="pl-10"
                        value={beliSearch}
                        onChange={(e) => setBeliSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleBeliSearch()
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleBeliSearch()}
                      disabled={beliLoading}
                    >
                      {beliLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => beliFileInputRef.current?.click()}
                      disabled={beliParsing}
                      className="gap-2"
                    >
                      {beliParsing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {beliParsing ? "Parsing..." : "Upload"}
                    </Button>
                  </div>

                  {/* Error */}
                  {beliError && (
                    <p className="text-sm text-destructive">{beliError}</p>
                  )}

                  {/* Filters */}
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
                              <SelectItem value="__all__">All cuisines</SelectItem>
                              {allCuisines.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={beliFilterLocation} onValueChange={(v) => setBeliFilterLocation(v === "__all__" ? "" : v)}>
                            <SelectTrigger className="h-8 text-xs w-full sm:w-[150px]">
                              <SelectValue placeholder="All locations" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__all__">All locations</SelectItem>
                              {allLocations.map((l) => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={beliFilterPrice} onValueChange={(v) => setBeliFilterPrice(v === "__all__" ? "" : v)}>
                            <SelectTrigger className="h-8 text-xs w-full sm:w-[110px]">
                              <SelectValue placeholder="All prices" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__all__">All prices</SelectItem>
                              {allPrices.map((p) => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={beliSortBy} onValueChange={(v) => setBeliSortBy(v as "name" | "rating")}>
                            <SelectTrigger className="h-8 text-xs w-full sm:w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">Sort: A–Z</SelectItem>
                              <SelectItem value="rating">Sort: Rating</SelectItem>
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

                        {/* Results */}
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                          <p className="text-xs text-muted-foreground font-medium">
                            {filtered.length} of {beliResults.length} place{beliResults.length !== 1 && "s"}{hasActiveFilter ? " (filtered)" : ""} — click to apply
                          </p>
                          {filtered.map((place, i) => (
                        <button
                          key={place.id || i}
                          type="button"
                          onClick={() => applyBeliPlace(place)}
                          className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/30 transition-all group"
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
                                  <span>{place.cuisine.join(", ")}</span>
                                )}
                                {place.cuisine.length > 0 && place.location.length > 0 && (
                                  <span>·</span>
                                )}
                                {place.location.length > 0 && (
                                  <span>{place.location.join(", ")}</span>
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
                              <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </button>
                          ))}
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
                  {!beliLoading && !beliParsing && beliResults.length === 0 && !beliError && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No saved ratings yet. Upload a Beli screenshot or video to get started.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form */}
          {!loading && (
          <div className="space-y-10">
            {/* ── Cover Image ── */}
            <section>
              <Label className="text-base font-semibold text-foreground mb-3 block">
                Cover Image
              </Label>
              <button
                type="button"
                onClick={handleImageSelect}
                className="w-full group"
              >
                {imagePreview ? (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border">
                    <Image
                      src={imagePreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                      <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <Upload className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Change image</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] rounded-2xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 transition-all group-hover:border-primary/60 group-hover:bg-accent/20">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ImageIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground text-sm">
                        Click to upload a cover image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, or WebP — recommended 1600×900
                      </p>
                    </div>
                  </div>
                )}
              </button>
            </section>

            {/* ── Gallery Images ── */}
            <section>
              <Label className="text-base font-semibold text-foreground mb-1 block">
                Gallery Images
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                Add extra photos for the review carousel. They&apos;ll auto-scroll on the review page.
              </p>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length === 0) return
                  setGalleryFiles((prev) => [...prev, ...files])
                  const newPreviews = files.map((f) => URL.createObjectURL(f))
                  setGalleryPreviews((prev) => [...prev, ...newPreviews])
                  if (galleryInputRef.current) galleryInputRef.current.value = ""
                }}
              />

              {/* Thumbnails grid */}
              {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {existingGallery.map((url, i) => (
                    <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                      <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5 text-destructive" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
                        <span className="text-[10px] font-medium text-muted-foreground">Saved</span>
                      </div>
                    </div>
                  ))}
                  {galleryPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-primary/30 group">
                      <Image src={url} alt={`New ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))
                          setGalleryPreviews((prev) => prev.filter((_, idx) => idx !== i))
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5 text-destructive" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary/80 backdrop-blur-sm">
                        <span className="text-[10px] font-medium text-white">New</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => galleryInputRef.current?.click()}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Gallery Images
              </Button>
            </section>

            <Separator />

            {/* ── Basic Info ── */}
            <section className="space-y-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Basic Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Restaurant Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. O-Ku"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date Visited</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <Label htmlFor="headline">Review Headline</Label>
                <Input
                  id="headline"
                  placeholder="e.g. The Creamiest Truffle Pasta I've Ever Had"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0–10)</Label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="e.g. 9.5"
                      className="pl-10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Select value={price} onValueChange={setPrice}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ — Budget-friendly</SelectItem>
                      <SelectItem value="$$">$$ — Moderate</SelectItem>
                      <SelectItem value="$$$">$$$ — Upscale</SelectItem>
                      <SelectItem value="$$$$">$$$$ — Fine dining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            {/* ── Cuisine Tags ── */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Cuisine
              </h2>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {cuisines.map((c, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="gap-1.5 pl-3 pr-2 py-1.5 text-sm"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeTag(i, cuisines, setCuisines)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Japanese, Sushi, Italian..."
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(cuisineInput, cuisines, setCuisines, setCuisineInput)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() =>
                    addTag(cuisineInput, cuisines, setCuisines, setCuisineInput)
                  }
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </section>

            <Separator />

            {/* ── Location Tags ── */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Location
              </h2>
              <p className="text-sm text-muted-foreground">
                Add neighborhood and city, e.g. "Northeast Washington" then "Washington, DC"
              </p>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {locations.map((l, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="gap-1.5 pl-3 pr-2 py-1.5 text-sm"
                  >
                    {l}
                    <button
                      type="button"
                      onClick={() => removeTag(i, locations, setLocations)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Northeast Washington"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(locationInput, locations, setLocations, setLocationInput)
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() =>
                    addTag(locationInput, locations, setLocations, setLocationInput)
                  }
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </section>

            <Separator />

            {/* ── Review Content ── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Review Content
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addParagraph}
                >
                  <Plus className="w-4 h-4" />
                  Add Paragraph
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Write your review as separate paragraphs. Each text area is one paragraph.
              </p>
              <div className="space-y-4">
                {paragraphs.map((p, i) => (
                  <div key={i} className="relative group">
                    <div className="flex items-start gap-3">
                      <span className="mt-2.5 text-xs font-medium text-muted-foreground w-6 text-right shrink-0">
                        {i + 1}.
                      </span>
                      <Textarea
                        placeholder={
                          i === 0
                            ? "Start your review here..."
                            : "Continue your thoughts..."
                        }
                        value={p}
                        onChange={(e) => updateParagraph(i, e.target.value)}
                        className="min-h-[100px] resize-y"
                      />
                      {paragraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(i)}
                          className="mt-2 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* ── Order Highlights ── */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                What I Ordered
              </h2>
              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                {orderHighlights.map((item, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="gap-1.5 pl-3 pr-2 py-1.5 text-sm"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        removeTag(i, orderHighlights, setOrderHighlights)
                      }
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Black Truffle Tagliatelle"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(
                        orderInput,
                        orderHighlights,
                        setOrderHighlights,
                        setOrderInput
                      )
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() =>
                    addTag(
                      orderInput,
                      orderHighlights,
                      setOrderHighlights,
                      setOrderInput
                    )
                  }
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </section>

            <Separator />

            {/* ── Live Preview ── */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Preview
              </h2>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Preview image */}
                <div className="aspect-[16/9] relative bg-secondary">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {rating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="font-semibold text-foreground text-sm">
                        {parseFloat(rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Preview content */}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {cuisines.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium text-primary uppercase tracking-wider"
                      >
                        {c}
                        {i < cuisines.length - 1 && (
                          <span className="ml-2">·</span>
                        )}
                      </span>
                    ))}
                    {price && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">
                        {cuisines.length > 0 && "· "}
                        {price}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-foreground leading-snug mb-2">
                    {headline || (
                      <span className="text-muted-foreground/40 italic">
                        Your headline here...
                      </span>
                    )}
                  </h3>

                  <p className="font-serif text-lg text-primary italic mb-4">
                    {name || (
                      <span className="text-muted-foreground/40">
                        Restaurant name
                      </span>
                    )}
                  </p>

                  {locations.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {locations.join(", ")}
                    </p>
                  )}

                  {paragraphs.some((p) => p.trim()) && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      {paragraphs
                        .filter((p) => p.trim())
                        .map((p, i) => (
                          <p
                            key={i}
                            className="text-foreground/80 text-sm leading-relaxed line-clamp-3"
                          >
                            {p}
                          </p>
                        ))}
                    </div>
                  )}

                  {orderHighlights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                        What I Ordered
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {orderHighlights.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── Action Buttons ── */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" asChild>
                <Link href="/admin/reviews">Cancel</Link>
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : isEditMode ? "Update Review" : "Save Review"}
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

export default function EditReviewPage() {
  return (
    <Suspense>
      <EditReviewPageContent />
    </Suspense>
  )
}
