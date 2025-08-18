"use client"

import { SearchInput } from "./search-input"
import { FiltersMenu } from "./filters-menu"
import { Button } from "@/components/ui/button"
import { Tags, Cat } from "lucide-react"
import type { SearchFilters } from "@/lib/types"

interface HeaderBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onTagsPanelToggle: () => void
  activeFiltersCount?: number
}

export function HeaderBar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onTagsPanelToggle,
  activeFiltersCount = 0,
}: HeaderBarProps) {
  return (
    <header className="border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center gap-4">
            {/* App title with icon */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Cat className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text mystyle">
                  Bookmark Manager
                </h1>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-4">
              <SearchInput value={searchQuery} onChange={onSearchChange} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <FiltersMenu filters={filters} onFiltersChange={onFiltersChange} activeFiltersCount={activeFiltersCount} />

              <Button
                variant="outline"
                onClick={onTagsPanelToggle}
                className="gap-2 bg-background/50 hover:bg-background transition-all duration-200 px-4 py-2"
              >
                <Tags className="w-4 h-4" />
                <span>Tags</span>
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            {/* Top row: Logo + Actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Cat className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text mystyle">
                  Bookmarks
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <FiltersMenu filters={filters} onFiltersChange={onFiltersChange} activeFiltersCount={activeFiltersCount} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTagsPanelToggle}
                  className="gap-1.5 bg-background/50 hover:bg-background transition-all duration-200 px-3 py-1.5"
                >
                  <Tags className="w-4 h-4" />
                  <span className="text-sm">Tags</span>
                </Button>
              </div>
            </div>

            {/* Bottom row: Search */}
            <div className="w-full">
              <SearchInput value={searchQuery} onChange={onSearchChange} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
