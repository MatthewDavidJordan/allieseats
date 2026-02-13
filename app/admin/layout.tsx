"use client"

import { type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { AuthProvider, useAuth } from "@/lib/auth-context"

function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading, isAuthorized } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isSignInPage = pathname === "/admin"

  useEffect(() => {
    if (loading) return
    // If not on the sign-in page and not authenticated+authorized, redirect
    if (!isSignInPage && (!user || !isAuthorized)) {
      router.replace("/admin")
    }
  }, [loading, user, isAuthorized, isSignInPage, router])

  // On the sign-in page, always render (it handles its own states)
  if (isSignInPage) return <>{children}</>

  // While loading, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  // Not authorized — don't render children (redirect is in-flight)
  if (!user || !isAuthorized) return null

  return <>{children}</>
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  )
}
