import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ReviewGrid } from "@/components/review-grid"
import { Footer } from "@/components/footer"
import { getSiteSettings } from "@/lib/firebase-settings"

export const dynamic = "force-dynamic"

export default async function Home() {
  const settings = await getSiteSettings()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero beliLink={settings.beliLink} />
      <ReviewGrid />
      <Footer />
    </main>
  )
}
