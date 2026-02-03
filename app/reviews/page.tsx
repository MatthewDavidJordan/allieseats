import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReviewsContent } from "@/components/reviews-content"

export const metadata: Metadata = {
  title: "All Reviews | Allie's Eats",
  description: "Browse all restaurant reviews and food experiences from Allie's Eats.",
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ReviewsContent />
      </main>
      <Footer />
    </div>
  )
}
