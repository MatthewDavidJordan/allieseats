"use client"

import { useEffect, useRef } from "react"

/**
 * Sender.net embedded newsletter form.
 *
 * To set up:
 * 1. Create an embedded form in your Sender.net dashboard (Forms → Create Form → Embedded)
 * 2. Copy the two <script> tags from the embed code
 * 3. Paste them below, replacing the placeholder comments
 *
 * The embed code looks something like:
 *   <script>/* sender.net script 1 *​/</script>
 *   <script>/* sender.net script 2 *​/</script>
 *
 * Until configured, a fallback mailto link is shown.
 */

const SENDER_FORM_HTML = ``
// ↑ Paste your Sender.net embed code (both <script> tags) as a string above.
// Example:
// const SENDER_FORM_HTML = `
//   <div class="sender-form-field" data-sender-form-id="XXXXXX"></div>
//   <script>/* first script */</script>
//   <script>/* second script */</script>
// `

export function NewsletterEmbed() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!SENDER_FORM_HTML || !containerRef.current) return

    // Inject the raw HTML
    containerRef.current.innerHTML = SENDER_FORM_HTML

    // Execute any <script> tags within the injected HTML
    const scripts = containerRef.current.querySelectorAll("script")
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script")
      if (oldScript.src) {
        newScript.src = oldScript.src
      } else {
        newScript.textContent = oldScript.textContent
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [])

  // If no embed code is configured yet, show a simple fallback
  if (!SENDER_FORM_HTML) {
    return (
      <a
        href="mailto:hello@allieseats.com?subject=Subscribe%20me!"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Subscribe via Email
      </a>
    )
  }

  return <div ref={containerRef} />
}
