import Link from "next/link"
import Image from "next/image"
import { MapPin, ChevronRight } from "lucide-react"
import { foodLists } from "@/lib/lists-data"

export function ListsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foodLists.map((list) => (
        <Link
          key={list.id}
          href={`/lists/${list.id}`}
          className="group block"
        >
          <article className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            {/* Cover Image */}
            <div className="aspect-[16/10] relative overflow-hidden">
              <Image
                src={list.coverImage || "/placeholder.svg"}
                alt={list.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
              
              {/* City Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{list.city}</span>
              </div>

              {/* Item Count */}
              <div className="absolute bottom-4 left-4">
                <span className="text-sm text-background/90 font-medium">
                  {list.itemCount} spots
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {list.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {list.description}
              </p>
              
              {/* Preview of items */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {list.items.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-card overflow-hidden relative"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {list.itemCount > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        +{list.itemCount - 4}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-primary text-sm font-medium">
                  View list
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
