"use client"

import { useState } from "react"
import { Share2, Check, Link, X } from "lucide-react"

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    // Use native share sheet on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // User cancelled — ignore
      }
      return
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setShowToast(true)
      setTimeout(() => {
        setCopied(false)
        setShowToast(false)
      }, 2000)
    } catch {
      // Ignore clipboard errors
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm"
        aria-label="Share this review"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>

      {/* Toast */}
      {showToast && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-1.5">
            <Link className="w-3 h-3" />
            Link copied to clipboard
          </div>
        </div>
      )}
    </div>
  )
}
