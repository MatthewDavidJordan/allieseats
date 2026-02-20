import Link from "next/link"
import { Mail } from "lucide-react"
import { NewsletterEmbed } from "./newsletter-embed"

export function Footer() {
  return (
    <footer id="contact" className="py-16 px-6 bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
              Allie's Eats
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Exploring delicious food, one restaurant at a time. Honest reviews, beautiful photos, 
              and a whole lot of love for great dining experiences.
            </p>
          </div>

          {/* Email List */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Join My Email List</h4>
            <NewsletterEmbed />
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{"Contact Me"}</h4>
            <a
              href="mailto:hello@allieseats.com"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              hello@allieseats.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Allie's Eats. Made with love.
          </p>
          <div className="flex items-center gap-1 text-primary/50">
            <DoodleHeart className="w-4 h-4" />
            <DoodleFork className="w-4 h-4" />
            <DoodleHeart className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  )
}

function DoodleHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

function DoodleFork({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}
