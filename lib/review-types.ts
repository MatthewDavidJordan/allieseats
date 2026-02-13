export interface Review {
  id: string                  // firebase doc ID
  name: string                // restaurant name
  headline: string            // review title
  rating: number              // 0-10 scale (Beli rating)
  price: string               // "$", "$$", "$$$", "$$$$"
  cuisine: string[]           // e.g. ["Japanese", "Sushi"]
  location: string[]          // e.g. ["Northeast Washington", "Washington, DC"]
  date: string                // visit date
  image: string               // hero/cover image URL
  gallery?: string[]          // additional gallery image URLs
  content: string[]           // review paragraphs
  orderHighlights: string[]   // what was ordered
  slug: string                // URL-friendly identifier
}
