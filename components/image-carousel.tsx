"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  alt?: string
  autoScrollInterval?: number
}

export function ImageCarousel({
  images,
  alt = "Gallery image",
  autoScrollInterval = 4000,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const count = images.length

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % count) + count) % count)
    },
    [count]
  )

  // Auto-scroll
  useEffect(() => {
    if (paused || count <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count)
    }, autoScrollInterval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, count, autoScrollInterval])

  // Touch / swipe support
  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1))
    }
    setPaused(false)
  }

  if (count === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative aspect-[16/9] w-full flex-shrink-0">
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Arrow navigation — hidden on mobile, visible on md+ */}
      {count > 1 && (
        <>
          <button
            onClick={() => {
              goTo(current - 1)
              setPaused(true)
              setTimeout(() => setPaused(false), autoScrollInterval)
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              goTo(current + 1)
              setPaused(true)
              setTimeout(() => setPaused(false), autoScrollInterval)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i)
                setPaused(true)
                setTimeout(() => setPaused(false), autoScrollInterval)
              }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
