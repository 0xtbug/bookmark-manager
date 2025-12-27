"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import type { Bookmark, BookmarksResponse, SearchFilters } from "@/lib/types"

interface UseBookmarksResult {
  bookmarks: Bookmark[]
  allBookmarks: Bookmark[]
  loading: boolean
  error: string | null
  totalCount: number
  refresh: () => void
}

export function useBookmarks(
  filters: SearchFilters,
  enabled = true
): UseBookmarksResult {
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const hasFetchedRef = useRef(false)

  const fetchAllBookmarks = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) return
      if (hasFetchedRef.current && !forceRefresh) return

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      try {
        setError(null)
        setLoading(true)

        const response = await fetch(`/api/bookmarks`, {
          signal: abortControllerRef.current.signal,
          headers: { 'Accept': 'application/json' },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks")
        }

        const data: BookmarksResponse = await response.json()
        setAllBookmarks(data.results)
        hasFetchedRef.current = true
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    },
    [enabled],
  )

  useEffect(() => {
    if (!enabled) return
    fetchAllBookmarks()
  }, [fetchAllBookmarks, enabled])

  const bookmarks = useMemo(() => {
    let result = allBookmarks

    // Filter by search query
    const searchQuery = filters.q?.toLowerCase() || ""
    if (searchQuery) {
      result = result.filter(bookmark =>
        bookmark.title?.toLowerCase().includes(searchQuery) ||
        bookmark.url?.toLowerCase().includes(searchQuery) ||
        bookmark.description?.toLowerCase().includes(searchQuery) ||
        bookmark.tag_names?.some(tag => tag.toLowerCase().includes(searchQuery))
      )
    }

    // Filter by tags (AND logic)
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(bookmark =>
        filters.tags!.every(tag => bookmark.tag_names?.includes(tag))
      )
    }

    // Filter by archived/unread/shared
    if (filters.archived === true) {
      result = result.filter(b => b.is_archived === true)
    } else if (filters.archived === false) {
      result = result.filter(b => b.is_archived === false)
    }
    if (filters.unread === true) {
      result = result.filter(b => b.unread === true)
    }
    if (filters.shared === true) {
      result = result.filter(b => b.shared === true)
    }

    // Sort
    if (filters.sort === "old") {
      result = [...result].sort((a, b) =>
        new Date(a.date_added).getTime() - new Date(b.date_added).getTime()
      )
    } else {
      result = [...result].sort((a, b) =>
        new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
      )
    }

    return result
  }, [allBookmarks, filters.q, filters.tags, filters.archived, filters.unread, filters.shared, filters.sort])

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refresh = useCallback(() => {
    if (!enabled) return
    hasFetchedRef.current = false
    fetchAllBookmarks(true)
  }, [fetchAllBookmarks, enabled])

  return {
    bookmarks,
    allBookmarks,
    loading,
    error,
    totalCount: bookmarks.length,
    refresh,
  }
}
