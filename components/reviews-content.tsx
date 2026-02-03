"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { ReviewCard } from "./review-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reviews, cuisineTypes, neighborhoods, priceRanges } from "@/lib/reviews-data"

export function ReviewsContent() {
  const [cuisineFilter, setCuisineFilter] = useState("All")
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("All")
  const [priceFilter, setPriceFilter] = useState("All")
  const [sortBy, setSortBy] = useState("latest")

  const hasActiveFilters = cuisineFilter !== "All" || neighborhoodFilter !== "All" || priceFilter !== "All"

  const clearFilters = () => {
    setCuisineFilter("All")
    setNeighborhoodFilter("All")
    setPriceFilter("All")
  }

  // Filter logic placeholder - currently shows all reviews
  // You can add actual filtering functionality later
  const filteredReviews = reviews

  return (
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
            All Reviews
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every delicious bite, every memorable meal. Browse through all my restaurant adventures.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Filter Reviews</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cuisine Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Cuisine</label>
              <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Cuisines" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine === "All" ? "All Cuisines" : cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Neighborhood Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Neighborhood</label>
              <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Neighborhoods" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood === "All" ? "All Neighborhoods" : neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Price Range</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((price) => (
                    <SelectItem key={price} value={price}>
                      {price === "All" ? "All Prices" : price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredReviews.length}</span> reviews
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No reviews match your filters.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
