"use client"

import { useState, useEffect, useCallback } from "react"
import type { Tag, TagsResponse } from "@/lib/types"

interface UseTagsResult {
  tags: Tag[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  searchTags: (query: string) => Tag[]
}

export function useTags(): UseTagsResult {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [currentOffset, setCurrentOffset] = useState(0)

  const fetchTags = useCallback(async (offset = 0, append = false) => {
    try {
      if (!append) {
        setLoading(true)
      }
      setError(null)

      const response = await fetch(`/api/tags?limit=100&offset=${offset}`)

      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }

      const data: TagsResponse = await response.json()

      if (append) {
        setTags((prev) => [...prev, ...data.results])
      } else {
        setTags(data.results)
      }

      setHasMore(!!data.next)
      setCurrentOffset(offset)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchTags(0, false)
  }, [fetchTags])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchTags(currentOffset + 100, true)
    }
  }, [loading, hasMore, currentOffset, fetchTags])

  const refresh = useCallback(() => {
    setCurrentOffset(0)
    fetchTags(0, false)
  }, [fetchTags])

  const searchTags = useCallback(
    (query: string): Tag[] => {
      if (!query.trim()) return tags
      const lowercaseQuery = query.toLowerCase()
      return tags.filter((tag) => tag.name.toLowerCase().includes(lowercaseQuery))
    },
    [tags],
  )

  return {
    tags,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    searchTags,
  }
}
