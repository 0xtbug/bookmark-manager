"use client"

import { useState, useEffect } from "react"
import type { Bookmark } from "@/lib/types"

export function useTagCounts(bookmarks: Bookmark[]): Record<string, number> {
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const counts: Record<string, number> = {}

    bookmarks.forEach((bookmark) => {
      bookmark.tag_names.forEach((tagName) => {
        counts[tagName] = (counts[tagName] || 0) + 1
      })
    })

    setTagCounts(counts)
  }, [bookmarks])

  return tagCounts
}
