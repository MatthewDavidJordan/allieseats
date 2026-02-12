export interface BeliPlace {
  id: string              // firebase doc ID (slugified name+location)
  name: string            // restaurant name
  rating: number          // 0-10 scale
  price: string           // "$", "$$", "$$$", "$$$$"
  cuisine: string[]       // e.g. ["Japanese", "Sushi"]
  location: string[]      // e.g. ["Northeast Washington", "Washington, DC"]
  createdAt: string       // ISO timestamp
}
