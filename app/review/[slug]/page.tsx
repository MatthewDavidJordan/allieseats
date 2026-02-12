import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getReviewBySlug } from "@/lib/firebase-reviews"

export const dynamic = "force-dynamic"

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const review = await getReviewBySlug(slug)

  if (!review) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Back link */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <Link 
            href="/#reviews" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to all reviews</span>
          </Link>
        </div>

        {/* Hero image */}
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src={review.image || "/placeholder.svg"}
              alt={review.headline}
              fill
              className="object-cover"
              priority
            />
            {/* Rating badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm">
              <span className="font-semibold text-foreground text-lg">{review.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">on Beli</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6">
          {/* Header info */}
          <div className="mb-8">
            <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
              {review.cuisine.join(", ")} · {review.price}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4 text-balance">
              {review.headline}
            </h1>
            <p className="font-serif text-2xl text-primary italic mb-6">
              {review.name}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{review.location.join(", ")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{review.date}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-border" />
            <DoodleHeart className="w-5 h-5 text-primary/50" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Review content */}
          <div className="space-y-6">
            {review.content.map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* What I ordered */}
          <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              What I Ordered
            </h2>
            <ul className="space-y-2">
              {review.orderHighlights.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-foreground/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Want to see more of my food adventures?
            </p>
            <a
              href="https://beli.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Follow me on Beli
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

function DoodleHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}
