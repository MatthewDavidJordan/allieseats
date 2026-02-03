import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ReviewGrid } from "@/components/review-grid"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ReviewGrid />
      <Footer />
    </main>
  )
}
