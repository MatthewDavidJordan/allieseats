import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getListById } from "@/lib/firebase-lists"
import { getReviewBySlug } from "@/lib/firebase-reviews"
import type { Review } from "@/lib/review-types"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const list = await getListById(id)

  if (!list) {
    return { title: "List Not Found | Allie's Eats" }
  }

  return {
    title: `${list.title} | Allie's Eats`,
    description: list.description,
  }
}

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const list = await getListById(id)

  if (!list) {
    notFound()
  }

  // Resolve review IDs to full review objects
  const reviews: Review[] = (
    await Promise.all(list.reviewIds.map((rid) => getReviewBySlug(rid)))
  ).filter(Boolean) as Review[]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-8 -ml-2">
            <Link href="/lists">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lists
            </Link>
          </Button>

          {/* List Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
              {list.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl text-pretty">
              {list.description}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {reviews.length} {reviews.length === 1 ? "spot" : "spots"} in this list
            </p>
          </div>

          {/* List Items */}
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <Link key={review.id} href={`/review/${review.slug}`} className="block">
                <article className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border transition-all duration-200 hover:border-primary/40 hover:shadow-md cursor-pointer">
                  {/* Rank Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="font-serif font-semibold text-foreground">{index + 1}</span>
                  </div>

                  {/* Image */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
                    <Image
                      src={review.image || "/placeholder.svg"}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{review.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {review.location[review.location.length - 1] || ""}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex-shrink-0 text-right">
                    <div className="font-semibold text-foreground">{review.rating.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">on Beli</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {reviews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                This list doesn&apos;t have any reviews yet.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
