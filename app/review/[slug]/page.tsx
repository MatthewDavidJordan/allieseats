import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const reviews: Record<string, {
  image: string
  restaurant: string
  headline: string
  rating: number
  location: string
  date: string
  cuisine: string
  priceRange: string
  content: string[]
  orderHighlights: string[]
}> = {
  "la-dolce-vita-truffle-pasta": {
    image: "/images/pasta.jpg",
    restaurant: "La Dolce Vita",
    headline: "The Creamiest Truffle Pasta I've Ever Had",
    rating: 9.2,
    location: "West Village, NYC",
    date: "January 15, 2026",
    cuisine: "Italian",
    priceRange: "$$$",
    content: [
      "Let me start by saying I am a sucker for truffle anything, but this pasta absolutely blew my mind. The moment it arrived at our table, the aroma hit me and I knew we were in for something special.",
      "The tagliatelle was perfectly al dente with that slight bite that makes you feel like you're actually in Italy. The cream sauce was rich without being heavy, which is honestly so rare. You know when truffle pasta can sometimes feel like too much? This wasn't that. Every bite was balanced and I found myself scraping the plate (elegantly, of course).",
      "The shaved black truffles on top were generous and fresh. Our server mentioned they source them from Alba, and you could really tell the difference. The parmesan added just the right amount of saltiness to cut through the cream.",
      "The ambiance was equally lovely - dim lighting, exposed brick, and that kind of romantic Italian playlist that makes you want to book a trip to Rome immediately. Service was attentive but not hovering, which I really appreciated.",
      "My only tiny critique? I wish the portion was just a little bigger because I definitely could have eaten more. But maybe that's the sign of a great dish - always leave them wanting more, right?"
    ],
    orderHighlights: [
      "Black Truffle Tagliatelle",
      "Burrata with Heirloom Tomatoes",
      "Tiramisu (share with the table!)"
    ]
  },
  "sakura-omakase-sushi": {
    image: "/images/sushi.jpg",
    restaurant: "Sakura Omakase",
    headline: "A Sushi Experience Worth Every Penny",
    rating: 9.5,
    location: "Tribeca, NYC",
    date: "January 22, 2026",
    cuisine: "Japanese",
    priceRange: "$$$$",
    content: [
      "Okay, this is going to be a long one because I have SO many feelings. Sakura Omakase has been on my list for months and it absolutely lived up to the hype.",
      "The 18-course omakase was a journey. Each piece was presented with such care, and Chef Tanaka explained every single item - where it was sourced, why he prepared it a certain way. It felt like a masterclass in sushi appreciation.",
      "Standouts included the otoro (fatty tuna) that literally melted on my tongue, and a uni from Hokkaido that was creamy and sweet without any of that fishy aftertaste. The seasonal kinmedai was also incredible - lightly torched with a hint of yuzu.",
      "What really set this apart was the rice. I know that sounds basic, but the shari (seasoned rice) was perfectly warm and seasoned. You could tell they take it seriously here.",
      "Yes, it's a splurge. But for special occasions or when you just want to treat yourself to something exceptional, this is the spot. Already planning my return visit."
    ],
    orderHighlights: [
      "18-Course Omakase",
      "Premium Sake Pairing",
      "Wagyu Nigiri (chef's special)"
    ]
  },
  "morning-bloom-brunch": {
    image: "/images/brunch.jpg",
    restaurant: "The Morning Bloom",
    headline: "Weekend Brunch Goals Achieved",
    rating: 8.4,
    location: "Brooklyn Heights, NYC",
    date: "January 28, 2026",
    cuisine: "American Brunch",
    priceRange: "$$",
    content: [
      "Sometimes you just need a classic, no-frills brunch spot that does everything well. The Morning Bloom is exactly that.",
      "The space is bright and airy with lots of plants (very on brand for the name), and the natural light is *chef's kiss* for photos. We snagged a window seat and honestly could have stayed all afternoon.",
      "I went for the ricotta pancakes and they were fluffy clouds of happiness. Topped with fresh berries, a drizzle of real maple syrup, and a little dusting of powdered sugar. Not too sweet, which I loved.",
      "My friend got the eggs benedict and said the hollandaise was spot-on. The mimosa was strong and bubbly - none of that watered-down nonsense. They also have a great coffee program if you're more of a latte person.",
      "The only reason I'm not giving this a higher rating is the wait time on weekends can be brutal. Get there early or be prepared to put your name in and explore the neighborhood for a bit."
    ],
    orderHighlights: [
      "Ricotta Pancakes",
      "Classic Eggs Benedict",
      "Bottomless Mimosas"
    ]
  },
  "casa-del-sol-tacos": {
    image: "/images/tacos.jpg",
    restaurant: "Casa Del Sol",
    headline: "Street Tacos That Taste Like Sunshine",
    rating: 8.8,
    location: "East Village, NYC",
    date: "February 1, 2026",
    cuisine: "Mexican",
    priceRange: "$",
    content: [
      "I've been searching for authentic street tacos in the city and Casa Del Sol just ended my quest. This tiny spot with maybe 10 seats is an absolute gem.",
      "The carnitas tacos are the star of the show. Slow-cooked pork that's crispy on the edges but meltingly tender inside. Topped simply with fresh cilantro, diced onions, and a squeeze of lime on handmade corn tortillas. No fancy additions needed.",
      "I also tried the al pastor and the birria (with the consommé for dipping). Both were incredible, but those carnitas will live in my head rent-free. The salsas are made fresh and have actual heat - the habanero one is no joke!",
      "The vibe is casual and unpretentious. You order at the counter, grab a seat if you can find one, and enjoy. Prices are super reasonable - you can get full for under $15.",
      "This is the kind of place I want to tell everyone about but also keep secret so it never changes. If you're in the area, please go."
    ],
    orderHighlights: [
      "Carnitas Tacos (x3)",
      "Birria Tacos with Consommé",
      "Horchata"
    ]
  },
  "patisserie-rose-desserts": {
    image: "/images/dessert.jpg",
    restaurant: "Patisserie Rose",
    headline: "Desserts Almost Too Pretty to Eat",
    rating: 9.0,
    location: "SoHo, NYC",
    date: "January 18, 2026",
    cuisine: "French Patisserie",
    priceRange: "$$",
    content: [
      "Walking into Patisserie Rose feels like stepping into a Parisian dream. Pink velvet chairs, gold accents, and a display case full of the most beautiful pastries you've ever seen.",
      "I tried the raspberry rose tart and it was as delicious as it was gorgeous. The shell was perfectly crisp, the rose-scented cream was delicate (not perfume-y), and the fresh raspberries were bright and tart. It's the kind of dessert that makes you slow down and savor every bite.",
      "Also sampled the pistachio financier and a classic pain au chocolat. Both were executed flawlessly. You can tell the pastry chef knows what they're doing - everything had that level of precision you'd expect from French pastry.",
      "They also do a lovely afternoon tea service that I'm dying to try next time. The space would be perfect for a girls' day or celebrating something special.",
      "My only note is that it's quite small, so it can get crowded on weekends. Weekday afternoons are the sweet spot for a more relaxed visit."
    ],
    orderHighlights: [
      "Raspberry Rose Tart",
      "Pistachio Financier",
      "Lavender Latte"
    ]
  },
  "tonkotsu-corner-ramen": {
    image: "/images/ramen.jpg",
    restaurant: "Tonkotsu Corner",
    headline: "Rich, Silky Ramen on a Rainy Day",
    rating: 8.7,
    location: "Lower East Side, NYC",
    date: "January 25, 2026",
    cuisine: "Japanese",
    priceRange: "$$",
    content: [
      "There's nothing better than a steaming bowl of ramen on a cold, rainy day, and Tonkotsu Corner delivered exactly what I needed.",
      "Their signature tonkotsu is rich and silky - you can tell the pork bone broth has been simmering for hours. It coats your lips in the best way possible. The noodles have that perfect chew and held up well in the broth.",
      "The chashu pork was melt-in-your-mouth tender with beautiful char on the edges. The soft-boiled egg was jammy and seasoned just right. Toppings were generous and everything felt intentional.",
      "I appreciated that you can customize your bowl - I went for extra garlic and a little more spice. They also have a great selection of appetizers; the gyoza are crispy-bottomed and delicious.",
      "The space is cozy (read: small), so there might be a short wait during peak hours. But it moves fast, and slurping ramen at the counter has its own kind of charm."
    ],
    orderHighlights: [
      "Original Tonkotsu Ramen",
      "Spicy Miso Ramen",
      "Pork Gyoza"
    ]
  }
}

export function generateStaticParams() {
  return Object.keys(reviews).map((slug) => ({ slug }))
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const review = reviews[slug]
  
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
              {review.cuisine} · {review.priceRange}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4 text-balance">
              {review.headline}
            </h1>
            <p className="font-serif text-2xl text-primary italic mb-6">
              {review.restaurant}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{review.location}</span>
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
