"use client"

import { Filter, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { SearchFilters } from "@/lib/types"

interface FiltersMenuProps {
  filters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  activeFiltersCount?: number
}

export function FiltersMenu({ filters, onFiltersChange, activeFiltersCount = 0 }: FiltersMenuProps) {
  const sortOptions = [
    { value: "new", label: "Newest first" },
    { value: "old", label: "Oldest first" },
    { value: "title-asc", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
  ] as const

//   const currentSortLabel = sortOptions.find((option) => option.value === filters.sort)?.label || "Newest first"

  const handleToggleFilter = (key: keyof SearchFilters, value: boolean) => {
    onFiltersChange({ [key]: value ? true : undefined })
  }

  const handleSortChange = (sort: SearchFilters["sort"]) => {
    onFiltersChange({ sort })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      archived: undefined,
      unread: undefined,
      shared: undefined,
      sort: "new",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 md:h-9 w-8 md:w-auto px-0 md:px-3 bg-background hover:bg-accent hover:text-accent-foreground border-input transition-colors relative"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="hidden md:flex h-5 min-w-5 text-xs px-1.5">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className="hidden md:block w-4 h-4" />
          </div>
          {/* Mobile dot indicator */}
          {activeFiltersCount > 0 && (
            <div className="md:hidden absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
          )}
          <span className="sr-only">Open filters menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-sm font-semibold">Quick Filters</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={filters.archived === true}
          onCheckedChange={(checked) => handleToggleFilter("archived", checked)}
        >
          Archived only
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.unread === true}
          onCheckedChange={(checked) => handleToggleFilter("unread", checked)}
        >
          Unread only
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filters.shared === true}
          onCheckedChange={(checked) => handleToggleFilter("shared", checked)}
        >
          Shared only
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-sm font-semibold">Sort by</DropdownMenuLabel>
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{option.label}</span>
            {filters.sort === option.value && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}

        {activeFiltersCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAllFilters} className="text-destructive hover:text-destructive cursor-pointer">
              Clear all filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
