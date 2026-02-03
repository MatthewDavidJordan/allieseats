"use client"

export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-6">
      {/* Animated doodle utensils */}
      <div className="flex items-end gap-3">
        <DoodleForkAnimated className="w-10 h-10 text-primary animate-wiggle-left" />
        <DoodlePlateAnimated className="w-14 h-14 text-primary/80" />
        <DoodleSpoonAnimated className="w-10 h-10 text-primary animate-wiggle-right" />
      </div>
      
      {/* Floating hearts */}
      <div className="flex items-center gap-2">
        <DoodleHeartAnimated className="w-4 h-4 text-primary/60 animate-float-1" />
        <DoodleHeartAnimated className="w-5 h-5 text-primary/80 animate-float-2" />
        <DoodleHeartAnimated className="w-4 h-4 text-primary/60 animate-float-3" />
      </div>

      {/* Loading text */}
      <p className="text-muted-foreground font-medium text-sm tracking-wide">
        {text}
      </p>
    </div>
  )
}

export function LoadingFullPage({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loading text={text} />
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <DoodlePlateAnimated className="w-8 h-8 text-primary" />
    </div>
  )
}

function DoodleForkAnimated({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" className="origin-bottom" />
      <path d="M7 2v20" />
      <path d="M5 2v5" />
      <path d="M9 2v5" />
    </svg>
  )
}

function DoodleSpoonAnimated({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 13v9" />
      <ellipse cx="12" cy="7" rx="5" ry="5" />
    </svg>
  )
}

function DoodlePlateAnimated({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Plate base */}
      <ellipse cx="12" cy="14" rx="10" ry="4" className="animate-plate-wobble" />
      <ellipse cx="12" cy="14" rx="6" ry="2.5" className="animate-plate-wobble" />
      {/* Steam lines */}
      <path d="M8 8 Q8.5 6 8 4" className="animate-steam-1" />
      <path d="M12 7 Q12.5 5 12 3" className="animate-steam-2" />
      <path d="M16 8 Q16.5 6 16 4" className="animate-steam-3" />
    </svg>
  )
}

function DoodleHeartAnimated({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}
