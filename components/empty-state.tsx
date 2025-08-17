"use client"

import { BookmarkIcon, Search, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type?: "no-bookmarks" | "no-results" | "no-tags"
  searchQuery?: string
  hasFilters?: boolean
  onClearFilters?: () => void
}

export function EmptyState({ type = "no-results", searchQuery, hasFilters = false, onClearFilters }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "no-bookmarks":
        return {
          icon: (
            <div className="relative">
              <BookmarkIcon className="w-16 h-16 text-muted-foreground/30" />
              <Sparkles className="w-6 h-6 text-primary/60 absolute -top-1 -right-1 animate-pulse" />
            </div>
          ),
          title: "Your bookmark collection awaits",
          description:
            "Start building your personal library by adding your first bookmark. Organize, search, and never lose track of great content again.",
          action: null,
        }

      case "no-tags":
        return {
          icon: <Filter className="w-16 h-16 text-muted-foreground/30" />,
          title: "No tags available yet",
          description:
            "Tags will automatically appear here as you add bookmarks with tags. Use tags to organize and quickly filter your collection.",
          action: null,
        }

      case "no-results":
      default:
        return {
          icon: <Search className="w-16 h-16 text-muted-foreground/30" />,
          title: searchQuery ? `No results for "${searchQuery}"` : "No bookmarks match your filters",
          description: hasFilters
            ? "Try adjusting your search terms or filters to discover more bookmarks in your collection."
            : "Your search didn't match any bookmarks. Try different keywords or check your spelling.",
          action: hasFilters ? (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="mt-6 bg-background hover:bg-muted transition-all duration-200"
            >
              Clear all filters
            </Button>
          ) : null,
        }
    }
  }

  const content = getContent()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 animate-in fade-in-50 duration-500">{content.icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-3 animate-in fade-in-50 duration-700">{content.title}</h3>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed animate-in fade-in-50 duration-1000">
        {content.description}
      </p>
      {content.action && <div className="animate-in fade-in-50 duration-1000">{content.action}</div>}
    </div>
  )
}
