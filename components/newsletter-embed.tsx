"use client"

import { useEffect } from "react"

const SENDER_FORM_ID = "dPNE26"
const SENDER_ACCOUNT_ID = "fc30eb9f060812"

export function NewsletterEmbed() {
  useEffect(() => {
    const w = window as any

    // Reset sender state so the SDK re-initializes cleanly
    delete w.sender

    // Remove any previously loaded sender script
    document.getElementById("sender-net-sdk")?.remove()

    // Set up the sender queue
    w.sender = function (...args: any[]) {
      ;(w.sender.q = w.sender.q || []).push(args)
    }
    w.sender.l = Date.now()
    w.sender(SENDER_ACCOUNT_ID)

    // Load the SDK script
    const script = document.createElement("script")
    script.id = "sender-net-sdk"
    script.src = "https://cdn.sender.net/accounts_resources/universal.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup on unmount
      script.remove()
      delete w.sender
    }
  }, [])

  return (
    <div
      style={{ textAlign: "left" }}
      className="sender-form-field"
      data-sender-form-id={SENDER_FORM_ID}
    />
  )
}
