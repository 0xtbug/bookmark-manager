"use client"

import { SearchInput } from "./search-input"
import { FiltersMenu } from "./filters-menu"
import { ThemeToggle } from "./theme-toggle"
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
    <header className="border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="w-full px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-4">
            {/* App title with icon */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-sm">
                <Cat className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Bookmark Manager
                </h1>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-6">
              <SearchInput value={searchQuery} onChange={onSearchChange} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <FiltersMenu filters={filters} onFiltersChange={onFiltersChange} activeFiltersCount={activeFiltersCount} />
              <Button
                variant="outline"
                onClick={onTagsPanelToggle}
                className="gap-2 h-9 px-4 bg-background hover:bg-accent hover:text-accent-foreground border-input transition-colors"
              >
                <Tags className="w-4 h-4" />
                <span className="font-medium">Tags</span>
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top row: Logo + Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center shadow-sm">
                  <Cat className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  Bookmarks
                </h1>
              </div>

              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <FiltersMenu filters={filters} onFiltersChange={onFiltersChange} activeFiltersCount={activeFiltersCount} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTagsPanelToggle}
                  className="h-8 px-2.5 bg-background hover:bg-accent hover:text-accent-foreground border-input transition-colors"
                >
                  <Tags className="w-4 h-4" />
                  <span className="sr-only">Tags</span>
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
