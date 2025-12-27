"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TagBadges } from "./tag-badges"
import { TagsSkeleton } from "./skeletons"
import { useTags } from "@/hooks/use-tags"
import { useTagCounts } from "@/hooks/use-tag-counts"
import type { Bookmark } from "@/lib/types"

interface TagsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTags: string[]
  onTagClick: (tag: string) => void
  onTagRemove: (tag: string) => void
  bookmarks: Bookmark[]
}

export function TagsPanel({ open, onOpenChange, selectedTags, onTagClick, onTagRemove, bookmarks }: TagsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { tags, loading, error } = useTags()
  const tagCounts = useTagCounts(bookmarks)

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags
    const lowercaseQuery = searchQuery.toLowerCase()
    return tags.filter((tag) => tag.name.toLowerCase().includes(lowercaseQuery))
  }, [tags, searchQuery])

  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => {
      const countA = tagCounts[a.name] || 0
      const countB = tagCounts[b.name] || 0
      if (countA !== countB) return countB - countA
      return a.name.localeCompare(b.name)
    })
  }, [filteredTags, tagCounts])

  const clearSearch = () => {
    setSearchQuery("")
  }

  const clearAllTags = () => {
    selectedTags.forEach((tag) => onTagRemove(tag))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle>Tags</SheetTitle>
            <p className="text-sm text-muted-foreground">Filter bookmarks by tags</p>
          </SheetHeader>

          {/* Selected tags section */}
          {selectedTags.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Selected Tags</h4>
                <Button variant="ghost" size="sm" onClick={clearAllTags} className="h-auto p-1 text-xs">
                  Clear all
                </Button>
              </div>
              <TagBadges
                tags={selectedTags}
                selectedTags={selectedTags}
                onTagClick={onTagClick}
                onTagRemove={onTagRemove}
                showCounts={true}
                tagCounts={tagCounts}
              />
              <Separator className="mt-4" />
            </div>
          )}

          {/* Search input */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={clearSearch}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Tags list */}
          <div className="flex-1 px-6">
            <ScrollArea className="h-full">
              {loading && tags.length === 0 ? (
                <TagsSkeleton count={20} />
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive text-sm mb-2">Error loading tags</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              ) : sortedTags.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? `No tags found for "${searchQuery}"` : "No tags available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pb-6">
                  <TagBadges
                    tags={sortedTags.map((tag) => tag.name)}
                    selectedTags={selectedTags}
                    onTagClick={onTagClick}
                    showCounts={true}
                    tagCounts={tagCounts}
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
