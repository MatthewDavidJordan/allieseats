"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { logEvent } from "firebase/analytics"
import { analytics } from "@/lib/firebase"

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    analytics.then((a) => {
      if (a) {
        logEvent(a, "page_view", {
          page_path: pathname,
          page_search: searchParams.toString(),
        })
      }
    })
  }, [pathname, searchParams])

  return null
}

export function FirebaseAnalytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  )
}
