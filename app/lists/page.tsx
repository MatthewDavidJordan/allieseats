import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListsGrid } from "@/components/lists-grid"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Lists | Allie's Eats",
  description: "Curated lists of my favorite restaurants, bars, and food spots by city and category.",
}

export default function ListsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
              My Lists
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Curated collections of my favorite spots, organized by city and vibe. 
              Perfect for when you need a rec!
            </p>
          </div>

          <ListsGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}
