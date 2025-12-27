"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Tag, TagsResponse } from "@/lib/types"

interface UseTagsResult {
  tags: Tag[]
  loading: boolean
  error: string | null
  refresh: () => void
  searchTags: (query: string) => Tag[]
}

export function useTags(): UseTagsResult {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false)

  const fetchAllTags = useCallback(async (forceRefresh = false) => {
    if (hasFetchedRef.current && !forceRefresh) return

    try {
      setError(null)
      setLoading(true)

      const response = await fetch(`/api/tags?limit=1000`)

      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }

      const data: TagsResponse = await response.json()
      setTags(data.results)
      hasFetchedRef.current = true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllTags()
  }, [fetchAllTags])

  const refresh = useCallback(() => {
    hasFetchedRef.current = false
    fetchAllTags(true)
  }, [fetchAllTags])

  // Client-side tag search
  const searchTags = useCallback(
    (query: string): Tag[] => {
      if (!query.trim()) return tags
      const q = query.toLowerCase()
      return tags.filter((tag) => tag.name.toLowerCase().includes(q))
    },
    [tags],
  )

  return {
    tags,
    loading,
    error,
    refresh,
    searchTags,
  }
}
