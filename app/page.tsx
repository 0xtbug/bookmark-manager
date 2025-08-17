"use client"

import { useCallback, useMemo, Suspense } from "react"
import { HeaderBar } from "@/components/header-bar"
import { BookmarkCard } from "@/components/bookmark-card"
import { EmptyState } from "@/components/empty-state"
import { BookmarkGridSkeleton } from "@/components/skeletons"
import { TagsPanel } from "@/components/tags-panel"
import { SelectedTagsBar } from "@/components/selected-tags-bar"
import { Button } from "@/components/ui/button"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { useUrlSync } from "@/hooks/use-url-sync"
import { useState } from "react"
import type { Bookmark } from "@/lib/types"

function BookmarkManagerContent() {
  const [showTagsPanel, setShowTagsPanel] = useState(false)
  const { filters, searchQuery, updateFilters, updateSearchQuery, isReady } = useUrlSync()

  // Combine search query with filters for API calls
  const combinedFilters = useMemo(
    () => ({
      ...filters,
      q: searchQuery || undefined,
    }),
    [filters, searchQuery],
  )

  const { bookmarks, loading, error, totalCount, hasMore, loadMore, refresh } = useBookmarks(
    combinedFilters,
    isReady, // Only fetch when URL sync is ready
  )

  const groupedBookmarks = useMemo(() => {
    if (bookmarks.length === 0) return {}

    const groups: Record<string, Bookmark[]> = {}

    bookmarks.forEach((bookmark) => {
      if (bookmark.tag_names.length === 0) {
        // Bookmarks without tags go to "Untagged" group
        if (!groups["Untagged"]) groups["Untagged"] = []
        groups["Untagged"].push(bookmark)
      } else {
        // Add bookmark to each of its tag groups
        bookmark.tag_names.forEach((tag) => {
          if (!groups[tag]) groups[tag] = []
          groups[tag].push(bookmark)
        })
      }
    })

    return groups
  }, [bookmarks])

  const handleTagClick = useCallback(
    (tag: string) => {
      const currentTags = filters.tags || []
      const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag]
      updateFilters({ tags: newTags })
    },
    [filters.tags, updateFilters],
  )

  const handleTagRemove = useCallback(
    (tag: string) => {
      const newTags = (filters.tags || []).filter((t) => t !== tag)
      updateFilters({ tags: newTags.length > 0 ? newTags : undefined })
    },
    [filters.tags, updateFilters],
  )

  const handleClearAllTags = useCallback(() => {
    updateFilters({ tags: undefined })
  }, [updateFilters])

  const handleClearFilters = useCallback(() => {
    updateSearchQuery("")
    updateFilters({
      tags: undefined,
      archived: undefined,
      unread: undefined,
      shared: undefined,
      sort: "new",
    })
  }, [updateSearchQuery, updateFilters])

  const handleLoadMore = useCallback(() => {
    const nextPage = (filters.page || 1) + 1
    updateFilters({ page: nextPage })
    loadMore()
  }, [filters.page, updateFilters, loadMore])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.archived === true) count++
    if (filters.unread === true) count++
    if (filters.shared === true) count++
    if (filters.tags && filters.tags.length > 0) count += filters.tags.length
    return count
  }, [filters])

  const hasActiveFilters = activeFiltersCount > 0 || searchQuery.length > 0

  // Show loading skeleton while URL sync is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <HeaderBar
          searchQuery=""
          onSearchChange={() => {}}
          filters={{ sort: "new", page: 1 }}
          onFiltersChange={() => {}}
          onTagsPanelToggle={() => {}}
          activeFiltersCount={0}
        />
        <main className="container mx-auto px-4 py-8">
          <BookmarkGridSkeleton />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <HeaderBar
          searchQuery={searchQuery}
          onSearchChange={updateSearchQuery}
          filters={filters}
          onFiltersChange={updateFilters}
          onTagsPanelToggle={() => setShowTagsPanel(!showTagsPanel)}
          activeFiltersCount={activeFiltersCount}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error: {error}</p>
            <Button onClick={refresh} variant="outline">
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <HeaderBar
        searchQuery={searchQuery}
        onSearchChange={updateSearchQuery}
        filters={filters}
        onFiltersChange={updateFilters}
        onTagsPanelToggle={() => setShowTagsPanel(!showTagsPanel)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Selected tags bar */}
      <SelectedTagsBar
        selectedTags={filters.tags || []}
        onTagRemove={handleTagRemove}
        onClearAll={handleClearAllTags}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Results summary */}
        {!loading && (
          <div className="mb-8 flex items-center justify-between animate-in fade-in-50 duration-500">
            <div>
              <p className="text-sm text-muted-foreground">
                {totalCount === 0 ? "No bookmarks found" : `${totalCount} bookmark${totalCount === 1 ? "" : "s"} found`}
              </p>
              {hasActiveFilters && (
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {searchQuery && `Searching for "${searchQuery}"`}
                  {searchQuery && (filters.tags?.length || 0) > 0 && " • "}
                  {(filters.tags?.length || 0) > 0 &&
                    `${filters.tags?.length} tag filter${(filters.tags?.length || 0) > 1 ? "s" : ""} active`}
                </p>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="hover:bg-muted transition-all duration-200"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        {loading && bookmarks.length === 0 ? (
          <BookmarkGridSkeleton />
        ) : bookmarks.length === 0 ? (
          <EmptyState
            type={totalCount === 0 && !hasActiveFilters ? "no-bookmarks" : "no-results"}
            searchQuery={searchQuery}
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <>
            <div className="space-y-8 animate-in fade-in-50 duration-700">
              {Object.entries(groupedBookmarks).map(([tagName, tagBookmarks]) => (
                <div key={tagName} className="space-y-4">
                  {/* Tag header */}
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{tagName}</h2>
                    <span className="text-sm text-muted-foreground">({tagBookmarks.length})</span>
                  </div>

                  {/* Bookmarks grid for this tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tagBookmarks.map((bookmark, index) => (
                      <div
                        key={`${tagName}-${bookmark.id}`}
                        className="animate-in fade-in-50 slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <BookmarkCard bookmark={bookmark} onTagClick={handleTagClick} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Load more button */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-12 animate-in fade-in-50 duration-500">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="bg-background hover:bg-muted transition-all duration-200 px-8 py-2"
                >
                  Load more bookmarks
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Tags panel */}
      <TagsPanel
        open={showTagsPanel}
        onOpenChange={setShowTagsPanel}
        selectedTags={filters.tags || []}
        onTagClick={handleTagClick}
        onTagRemove={handleTagRemove}
        bookmarks={bookmarks}
      />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <BookmarkGridSkeleton />
          </div>
        </div>
      }
    >
      <BookmarkManagerContent />
    </Suspense>
  )
}
