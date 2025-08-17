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
    page: 1,
  })

  const filtersRef = useRef(filters)
  const searchQueryRef = useRef(searchQuery)
  const isUpdatingRef = useRef(false)

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    searchQueryRef.current = searchQuery
  }, [searchQuery])

  useEffect(() => {
    if (!isReady && !isUpdatingRef.current) {
      const urlFilters = parseSearchParams(searchParams)
      setFilters(urlFilters)
      setSearchQuery(urlFilters.q || "")
      setIsReady(true)
    }
  }, [searchParams, isReady])

  const updateUrl = useCallback(
    (newFilters: SearchFilters, newSearchQuery: string) => {
      isUpdatingRef.current = true

      const combinedFilters = {
        ...newFilters,
        q: newSearchQuery || undefined,
      }

      const params = buildSearchParams(combinedFilters)
      const url = params.toString() ? `?${params.toString()}` : "/"

      // Use replace for same-page updates to avoid cluttering browser history
      router.replace(url, { scroll: false })

      // Reset the updating flag after a brief delay
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 100)
    },
    [router],
  )

  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const currentFilters = filtersRef.current
      const currentSearchQuery = searchQueryRef.current
      const updatedFilters = { ...currentFilters, ...newFilters }

      // Reset page when filters change (except when explicitly updating page)
      if (!("page" in newFilters)) {
        updatedFilters.page = 1
      }

      setFilters(updatedFilters)
      updateUrl(updatedFilters, currentSearchQuery)
    },
    [updateUrl],
  )

  const updateSearchQuery = useCallback(
    (query: string) => {
      const currentFilters = filtersRef.current
      setSearchQuery(query)
      // Reset page when search changes
      const updatedFilters = { ...currentFilters, page: 1 }
      setFilters(updatedFilters)
      updateUrl(updatedFilters, query)
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
