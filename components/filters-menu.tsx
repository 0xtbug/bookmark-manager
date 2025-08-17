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
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
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

        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className="flex items-center justify-between"
          >
            {option.label}
            {filters.sort === option.value && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}

        {activeFiltersCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAllFilters} className="text-destructive focus:text-destructive">
              Clear all filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
