export interface Review {
  image: string
  restaurant: string
  headline: string
  rating: number
  slug: string
  cuisine: string
  neighborhood: string
  priceRange: string
  date: string
}

export const reviews: Review[] = [
  {
    image: "/images/pasta.jpg",
    restaurant: "La Dolce Vita",
    headline: "The Creamiest Truffle Pasta I've Ever Had",
    rating: 9.2,
    slug: "la-dolce-vita-truffle-pasta",
    cuisine: "Italian",
    neighborhood: "Downtown",
    priceRange: "$$$",
    date: "January 2026",
  },
  {
    image: "/images/sushi.jpg",
    restaurant: "Sakura Omakase",
    headline: "A Sushi Experience Worth Every Penny",
    rating: 9.5,
    slug: "sakura-omakase-sushi",
    cuisine: "Japanese",
    neighborhood: "Midtown",
    priceRange: "$$$$",
    date: "January 2026",
  },
  {
    image: "/images/brunch.jpg",
    restaurant: "The Morning Bloom",
    headline: "Weekend Brunch Goals Achieved",
    rating: 8.4,
    slug: "morning-bloom-brunch",
    cuisine: "Brunch",
    neighborhood: "West Village",
    priceRange: "$$",
    date: "December 2025",
  },
  {
    image: "/images/tacos.jpg",
    restaurant: "Casa Del Sol",
    headline: "Street Tacos That Taste Like Sunshine",
    rating: 8.8,
    slug: "casa-del-sol-tacos",
    cuisine: "Mexican",
    neighborhood: "East Side",
    priceRange: "$",
    date: "December 2025",
  },
  {
    image: "/images/dessert.jpg",
    restaurant: "Patisserie Rose",
    headline: "Desserts Almost Too Pretty to Eat",
    rating: 9.0,
    slug: "patisserie-rose-desserts",
    cuisine: "Dessert",
    neighborhood: "SoHo",
    priceRange: "$$",
    date: "November 2025",
  },
  {
    image: "/images/ramen.jpg",
    restaurant: "Tonkotsu Corner",
    headline: "Rich, Silky Ramen on a Rainy Day",
    rating: 8.7,
    slug: "tonkotsu-corner-ramen",
    cuisine: "Japanese",
    neighborhood: "East Village",
    priceRange: "$$",
    date: "November 2025",
  },
]

export const cuisineTypes = ["All", "Italian", "Japanese", "Brunch", "Mexican", "Dessert"]
export const neighborhoods = ["All", "Downtown", "Midtown", "West Village", "East Side", "SoHo", "East Village"]
export const priceRanges = ["All", "$", "$$", "$$$", "$$$$"]
