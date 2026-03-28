import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExternalLink, Mail, Heart, Utensils, Camera, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSiteSettings } from "@/lib/firebase-settings"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Profile Section */}
          <section className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-16">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              {/* Decorative ring */}
              <div className="absolute -inset-3 rounded-full border-2 border-dashed border-primary/30" />
              <div className="absolute -inset-6 rounded-full border border-primary/10" />
              
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden ring-4 ring-primary/20">
                <Image
                  src={settings.profileImage}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/60 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute -bottom-1 -left-3 w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Intro Text */}
            <div className="text-center md:text-left">
              <p className="text-primary font-medium mb-2">Hey there!</p>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
                {"I'm Allie"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to my little corner of the internet where I share all my favorite food finds.
              </p>
            </div>
          </section>

          {/* About Content */}
          <section className="max-w-2xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-sm">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed mb-6">
                  {"Hi, I’m Allie, and welcome to Allie’s Eats!"}
                </p>
                
                <p className="text-foreground leading-relaxed mb-6">
                  {"One of my favorite questions to be asked is, “Where should I go out to eat?” This blog is my way of answering that question. Going out to eat and trying new foods is one of my favorite things to do, and I love sharing those experiences with my friends and anyone else who’s looking for a good recommendation."}
                </p>

                <p className="text-foreground leading-relaxed mb-6">
                  {"I’m a 22-year-old college student living in Washington, DC, and I’ll be graduating soon and moving to New York City this fall. You’ll probably notice some familiar faces throughout my reviews, so here’s a quick introduction. My most frequent dining partner is my boyfriend, Matt, who’s always down to try something new and is the best restaurant date I could ask for. My love for food comes from my parents, Missy and Luke, and is shared by my sister, Lucy, who will all definitely make appearances here. I also have a few foodie friends you might meet along the way: Jordan, Alice, Beatrice, Margot and more!"}
                </p>

                <p className="text-foreground leading-relaxed">
                  {"Check out my thoughts on restaurants in DC, NYC, and beyond!"}
                </p>
              </div>

              {/* Fun Facts */}
              {/* <div className="mt-10 pt-8 border-t border-border">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-6 text-center">
                  A few fun facts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/50">
                    <Camera className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm font-medium text-foreground">100+ Reviews</span>
                    <span className="text-xs text-muted-foreground">and counting</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/50">
                    <Utensils className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm font-medium text-foreground">Brunch Obsessed</span>
                    <span className="text-xs text-muted-foreground">eggs benny forever</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/50">
                    <MapPin className="w-6 h-6 text-primary mb-2" />
                    <span className="text-sm font-medium text-foreground">City Explorer</span>
                    <span className="text-xs text-muted-foreground">always hunting gems</span>
                  </div>
                </div>
              </div> */}

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-border text-center">
                <p className="text-muted-foreground mb-6">
                  {"Want to chat about food or share a restaurant rec? I'd love to hear from you!"}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={settings.beliLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Follow me on Beli
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Link href="mailto:hello@allieseats.com">
                      <Mail className="w-4 h-4 mr-2" />
                      Say Hello
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Decorative doodles */}
          <div className="relative mt-16">
            <svg className="absolute -top-8 left-1/4 w-12 h-12 text-primary/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4C12 4 8 8 8 12C8 16 12 20 12 20C12 20 16 16 16 12C16 8 12 4 12 4Z" />
              <path d="M12 8V16" />
            </svg>
            <svg className="absolute -top-4 right-1/4 w-8 h-8 text-primary/15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
