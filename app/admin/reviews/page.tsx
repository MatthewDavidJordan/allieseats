"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Calendar, Star, UtensilsCrossed, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getReviews } from "@/lib/firebase-reviews"
import type { Review } from "@/lib/review-types"

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Admin</span>
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Manage Reviews
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create new reviews or edit existing ones. Your culinary diary, all in one place.
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          )}

          {/* Create New Review CTA */}
          <button
            className="w-full mb-10 group"
            onClick={() => router.push("/admin/reviews/edit")}
          >
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:border-primary/60 group-hover:bg-accent/30">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
                  Create New Review
                </h2>
                <p className="text-muted-foreground">
                  Add a new restaurant review with photos, ratings, and your thoughts
                </p>
              </div>
            </div>
          </button>

          {/* Existing Reviews Section */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Existing Reviews
            </h2>
            <span className="text-muted-foreground text-sm">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <button
                key={review.slug}
                className="group text-left"
                onClick={() => router.push(`/admin/reviews/edit?slug=${review.slug}`)}
              >
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
                  {/* Image */}
                  <div className="aspect-[16/10] relative">
                    <Image
                      src={review.image || "/placeholder.svg"}
                      alt={review.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="font-semibold text-foreground text-sm">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    {/* Edit overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Pencil className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                      {review.cuisine.join(", ")} · {review.price}
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                      {review.headline}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {review.name}
                      </p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Empty State (shown when no reviews exist) */}
          {reviews.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No reviews yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start your food diary by creating your first review above.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
