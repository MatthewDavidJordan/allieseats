import Link from "next/link"
import Image from "next/image"
import { ChevronRight, UtensilsCrossed } from "lucide-react"
import { getLists } from "@/lib/firebase-lists"
import { getReviews } from "@/lib/firebase-reviews"

export async function ListsGrid() {
  const [lists, reviews] = await Promise.all([getLists(), getReviews()])

  // Build a lookup map: review id → review
  const reviewMap = new Map(reviews.map((r) => [r.id, r]))

  if (lists.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No lists yet — check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => {
        const itemCount = list.items.length
        const previewItems = list.items.slice(0, 4)

        return (
          <Link
            key={list.id}
            href={`/lists/${list.id}`}
            className="group block"
          >
            <article className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              {/* Cover Image */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image
                  src={list.coverImage || "/placeholder.svg"}
                  alt={list.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />

                {/* Item Count */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm text-background/90 font-medium">
                    {itemCount} {itemCount === 1 ? "spot" : "spots"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {list.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {list.description}
                </p>

                {/* Preview of items */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {previewItems.map((item, index) => {
                      if (item.type === "review") {
                        const review = reviewMap.get(item.reviewId)
                        return (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-card overflow-hidden relative"
                          >
                            <Image
                              src={review?.image || "/placeholder.svg"}
                              alt={review?.name || "Review"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )
                      } else {
                        return (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center"
                          >
                            <UtensilsCrossed className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )
                      }
                    })}
                    {itemCount > 4 && (
                      <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          +{itemCount - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-primary text-sm font-medium">
                    View list
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        )
      })}
    </div>
  )
}
