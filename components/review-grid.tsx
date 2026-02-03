import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ReviewCard } from "./review-card"
import { Button } from "@/components/ui/button"
import { reviews } from "@/lib/reviews-data"

export function ReviewGrid() {
  return (
    <section id="reviews" className="py-16 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Latest Reviews
            </h2>
            <p className="text-muted-foreground">
              My most recent culinary discoveries
            </p>
          </div>
          <DoodleStar className="w-10 h-10 text-primary/40 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild variant="outline" size="lg" className="group bg-transparent">
            <Link href="/reviews">
              See All Reviews
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function DoodleStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
    </svg>
  )
}
