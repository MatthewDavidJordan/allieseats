"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogIn, ShieldAlert, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"

export default function AdminSignInPage() {
  const { user, loading, isAuthorized, signIn, signOut } = useAuth()
  const router = useRouter()

  // If already authenticated + authorized, redirect to admin reviews
  useEffect(() => {
    if (!loading && user && isAuthorized) {
      router.replace("/admin/reviews")
    }
  }, [loading, user, isAuthorized, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Admin Sign In
          </h1>
          <p className="text-muted-foreground mb-10">
            Sign in with your Google account to manage the site.
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Checking authentication...</p>
            </div>
          ) : user && !isAuthorized ? (
            /* Authenticated but NOT authorized */
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
              <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-4" />
              <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-muted-foreground mb-1">
                Signed in as <span className="font-medium text-foreground">{user.email}</span>
              </p>
              <p className="text-muted-foreground mb-6">
                This account does not have admin access. Please sign in with an authorized account.
              </p>
              <Button variant="outline" onClick={signOut}>
                Sign out
              </Button>
            </div>
          ) : !user ? (
            /* Not authenticated */
            <Button size="lg" onClick={signIn} className="gap-2">
              <LogIn className="w-5 h-5" />
              Sign in with Google
            </Button>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  )
}
