import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Instagram, Mail, Heart, Utensils, Camera, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
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
                  src="/images/profile.jpg"
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
                {"I'm the girl behind the bites"}
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
                  {"If there's one thing you should know about me, it's that I take my food very seriously (and by seriously, I mean I will absolutely make everyone wait to eat while I get the perfect photo)."}
                </p>
                
                <p className="text-foreground leading-relaxed mb-6">
                  {"This blog started as a way to keep track of all the amazing restaurants I've been to—because let's be honest, my notes app was getting out of control. Now it's become my favorite creative outlet where I get to share honest reviews, pretty food pics, and hopefully help you find your next favorite spot."}
                </p>

                <p className="text-foreground leading-relaxed mb-6">
                  {"I'm all about cozy brunch spots, hidden gems, and anywhere with good lighting (for the photos, obviously). I believe every meal is an experience, and I'm here to document the delicious ones."}
                </p>

                <p className="text-foreground leading-relaxed">
                  {"When I'm not eating my way through the city, you can find me planning my next food adventure or convincing my friends to try \"just one more place.\""}
                </p>
              </div>

              {/* Fun Facts */}
              <div className="mt-10 pt-8 border-t border-border">
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
              </div>

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-border text-center">
                <p className="text-muted-foreground mb-6">
                  {"Want to chat about food or share a restaurant rec? I'd love to hear from you!"}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="https://instagram.com/placeholder" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2" />
                      Follow Along
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Link href="mailto:hello@bitesandbliss.com">
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
