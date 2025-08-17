"use client"

import { useState, useEffect, useCallback } from "react"
import type { Bookmark, BookmarksResponse, SearchFilters } from "@/lib/types"
import { buildSearchParams } from "@/lib/query-state"

interface UseBookmarksResult {
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null
  totalCount: number
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export function useBookmarks(filters: SearchFilters, enabled = true): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchBookmarks = useCallback(
    async (page = 1, append = false) => {
      if (!enabled) return

      try {
        if (!append) {
          setLoading(true)
        }
        setError(null)

        const searchParams = buildSearchParams({ ...filters, page })
        const response = await fetch(`/api/bookmarks?${searchParams}`)

        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks")
        }

        const data: BookmarksResponse = await response.json()

        if (append) {
          setBookmarks((prev) => [...prev, ...data.results])
        } else {
          setBookmarks(data.results)
        }

        setTotalCount(data.count || 0)
        setHasMore(!!data.next)
        setCurrentPage(page)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    },
    [filters, enabled],
  )

  // Reset and fetch when filters change
  useEffect(() => {
    if (!enabled) return
    setCurrentPage(1)
    fetchBookmarks(1, false)
  }, [fetchBookmarks, enabled])

  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) {
      fetchBookmarks(currentPage + 1, true)
    }
  }, [loading, hasMore, currentPage, fetchBookmarks, enabled])

  const refresh = useCallback(() => {
    if (!enabled) return
    setCurrentPage(1)
    fetchBookmarks(1, false)
  }, [fetchBookmarks, enabled])

  return {
    bookmarks,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    refresh,
  }
}
