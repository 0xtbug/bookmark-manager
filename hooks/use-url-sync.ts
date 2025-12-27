"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { SearchFilters } from "@/lib/types"
import { parseSearchParams, buildSearchParams } from "@/lib/query-state"

interface UseUrlSyncResult {
  filters: SearchFilters
  searchQuery: string
  updateFilters: (newFilters: Partial<SearchFilters>) => void
  updateSearchQuery: (query: string) => void
  isReady: boolean
}

export function useUrlSync(): UseUrlSyncResult {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isReady, setIsReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    sort: "new",
  })

  const filtersRef = useRef(filters)
  const searchQueryRef = useRef(searchQuery)
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    searchQueryRef.current = searchQuery
  }, [searchQuery])

  // Parse URL on mount
  useEffect(() => {
    if (!isReady) {
      const urlFilters = parseSearchParams(searchParams)
      setFilters(urlFilters)
      setSearchQuery(urlFilters.q || "")
      setIsReady(true)
    }
  }, [searchParams, isReady])

  // Debounced URL update - only update URL after 500ms of no changes
  const updateUrl = useCallback(
    (newFilters: SearchFilters, newSearchQuery: string) => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current)
      }

      urlUpdateTimeoutRef.current = setTimeout(() => {
        const combinedFilters = {
          ...newFilters,
          q: newSearchQuery || undefined,
        }

        const params = buildSearchParams(combinedFilters)
        const url = params.toString() ? `?${params.toString()}` : "/"

        router.replace(url, { scroll: false })
      }, 500)
    },
    [router],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current)
      }
    }
  }, [])

  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const currentFilters = filtersRef.current
      const currentSearchQuery = searchQueryRef.current
      const updatedFilters = { ...currentFilters, ...newFilters }

      setFilters(updatedFilters)
      updateUrl(updatedFilters, currentSearchQuery)
    },
    [updateUrl],
  )

  const updateSearchQuery = useCallback(
    (query: string) => {
      const currentFilters = filtersRef.current
      setSearchQuery(query)
      updateUrl(currentFilters, query)
    },
    [updateUrl],
  )

  return {
    filters,
    searchQuery,
    updateFilters,
    updateSearchQuery,
    isReady,
  }
}
