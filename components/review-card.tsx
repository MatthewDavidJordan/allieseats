import Image from "next/image"
import Link from "next/link"

interface ReviewCardProps {
  image: string
  restaurant: string
  headline: string
  rating: number
  slug?: string
}

export function ReviewCard({ image, restaurant, headline, rating, slug }: ReviewCardProps) {
  const content = (
    <article className="group relative overflow-hidden rounded-2xl cursor-pointer">
      {/* Image */}
      <div className="aspect-[4/5] relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={`${restaurant} - ${headline}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

        {/* Rating badge - top right */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
          <span className="font-semibold text-foreground text-sm">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-xs">on Beli</span>
        </div>

        {/* Content overlay - bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider mb-1">
            {restaurant}
          </p>
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-primary-foreground leading-snug text-balance">
            {headline}
          </h3>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/40 transition-colors duration-300 pointer-events-none" />
    </article>
  )

  return slug ? (
    <Link href={`/review/${slug}`}>{content}</Link>
  ) : (
    <div>{content}</div>
  )
}
