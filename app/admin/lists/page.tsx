"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Pencil, List, Loader2, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getLists } from "@/lib/firebase-lists"
import type { FoodList } from "@/lib/firebase-lists"

export default function AdminListsPage() {
  const router = useRouter()
  const [lists, setLists] = useState<FoodList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLists()
      .then(setLists)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to reviews</span>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20">
                <List className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Admin</span>
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Manage Lists
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create and edit curated collections of your favorite spots.
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading lists...</p>
            </div>
          )}

          {/* Create New List CTA */}
          {!loading && (
            <button
              className="w-full mb-10 group"
              onClick={() => router.push("/admin/lists/edit")}
            >
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 group-hover:border-primary/60 group-hover:bg-accent/30">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
                    Create New List
                  </h2>
                  <p className="text-muted-foreground">
                    Curate a new collection of your favorite restaurants
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Existing Lists */}
          {!loading && lists.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Existing Lists
                </h2>
                <span className="text-muted-foreground text-sm">
                  {lists.length} {lists.length === 1 ? "list" : "lists"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    className="group text-left"
                    onClick={() => router.push(`/admin/lists/edit?id=${list.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
                      {/* Image */}
                      <div className="aspect-[16/10] relative">
                        <Image
                          src={list.coverImage || "/placeholder.svg"}
                          alt={list.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Count badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                          <span className="font-semibold text-foreground text-sm">
                            {list.reviewIds.length} spots
                          </span>
                        </div>
                        {/* Edit overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Pencil className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        <h3 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                          {list.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {list.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && lists.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <List className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No lists yet
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create your first curated list of restaurants above.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
