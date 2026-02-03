import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-32 pb-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative elements */}
        <div className="flex justify-center mb-6">
          <a 
            href="https://beliapp.co/alliestevens" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 hover:bg-accent/70 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">My Beli</span>
          </a>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6 text-balance">
          Savoring Every Bite,
          <br />
          <span className="text-primary italic">One Review at a Time</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          Join me on my culinary adventures as I explore restaurants, share honest reviews, 
          and capture the beauty of delicious food through my lens.
        </p>

        {/* Decorative doodle-style elements */}
        <div className="flex justify-center items-center gap-6 text-primary/60">
          <DoodleFork className="w-8 h-8" />
          <DoodleHeart className="w-6 h-6" />
          <DoodleSpoon className="w-8 h-8" />
        </div>
      </div>
    </section>
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

function DoodleHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

function DoodleSpoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a4 4 0 0 0-4 4c0 2.5 1.5 4.5 4 5.5V22" />
      <ellipse cx="12" cy="6" rx="4" ry="4" />
    </svg>
  )
}
