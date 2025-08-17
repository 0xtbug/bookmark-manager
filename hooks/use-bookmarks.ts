"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Bookmark, BookmarksResponse, SearchFilters } from "@/lib/types"
import { buildSearchParams } from "@/lib/query-state"

// In-memory cache for bookmarks
const bookmarksCache = new Map<string, { data: BookmarksResponse; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache

interface UseBookmarksResult {
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null
  totalCount: number
  loadingTime: number
  refresh: () => void
}

export function useBookmarks(filters: SearchFilters, enabled = true): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [loadingTime, setLoadingTime] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchBookmarks = useCallback(
    async () => {
      if (!enabled) return

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const startTime = performance.now()
      const cacheKey = JSON.stringify(filters)

      try {
        setError(null)

        // Check cache first
        const cached = bookmarksCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          // Use cached data but still set loading for UI feedback
          setBookmarks(cached.data.results)
          setTotalCount(cached.data.count || 0)
          const endTime = performance.now()
          setLoadingTime(Math.round(endTime - startTime))
          setLoading(false)
          return
        }

        setLoading(true)

        const searchParams = buildSearchParams(filters)
        const response = await fetch(`/api/bookmarks?${searchParams}`, {
          signal: abortControllerRef.current.signal,
          // Add performance headers
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks")
        }

        const data: BookmarksResponse = await response.json()

        // Cache the response
        bookmarksCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        })

        setBookmarks(data.results)
        setTotalCount(data.count || 0)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        const endTime = performance.now()
        setLoadingTime(Math.round(endTime - startTime))
        setLoading(false)
      }
    },
    [filters, enabled],
  )

  // Reset and fetch when filters change
  useEffect(() => {
    if (!enabled) return
    fetchBookmarks()
  }, [fetchBookmarks, enabled])

  // Cleanup function to abort requests and clear cache periodically
  useEffect(() => {
    const cleanup = () => {
      // Clear old cache entries (older than TTL)
      const now = Date.now()
      for (const [key, value] of bookmarksCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          bookmarksCache.delete(key)
        }
      }
    }

    const interval = setInterval(cleanup, CACHE_TTL)

    return () => {
      clearInterval(interval)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refresh = useCallback(() => {
    if (!enabled) return
    // Clear cache for this filter set when refreshing
    const cacheKey = JSON.stringify(filters)
    bookmarksCache.delete(cacheKey)
    fetchBookmarks()
  }, [fetchBookmarks, enabled, filters])

  return {
    bookmarks,
    loading,
    error,
    totalCount,
    loadingTime,
    refresh,
  }
}
