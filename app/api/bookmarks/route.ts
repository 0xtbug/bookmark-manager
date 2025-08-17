import { type NextRequest, NextResponse } from "next/server"
import { LinkdingAPI } from "@/lib/linkding-api"
import type { BookmarksResponse, SearchFilters, Bookmark } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const filters: SearchFilters = {
      q: searchParams.get("q") || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      archived: searchParams.get("archived") === "1" ? true : searchParams.get("archived") === "0" ? false : undefined,
      unread: searchParams.get("unread") === "1" ? true : undefined,
      shared: searchParams.get("shared") === "1" ? true : undefined,
      sort: (searchParams.get("sort") as SearchFilters["sort"]) || "new",
      page: Number.parseInt(searchParams.get("page") || "1"),
    }

    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = ((filters.page || 1) - 1) * limit

    const linkdingResponse = await LinkdingAPI.fetchBookmarks({
      q: filters.q,
      limit: 100, // Fetch more to handle client-side filtering
      offset: 0,
      archived: filters.archived,
    })

    // Transform Linkding bookmarks to our format and apply additional filters
    let bookmarks: Bookmark[] = linkdingResponse.results.map((bookmark) => ({
      ...bookmark,
      favicon_url: null, // Linkding doesn't provide favicon URLs in API
      preview_image_url: null, // Linkding doesn't provide preview images in API
    }))

    // Apply client-side filters that Linkding API doesn't support
    bookmarks = bookmarks.filter((bookmark) => {
      // Unread filter
      if (filters.unread === true && !bookmark.unread) return false

      // Shared filter
      if (filters.shared === true && !bookmark.shared) return false

      // Tags filter (AND logic - bookmark must have ALL selected tags)
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) =>
          bookmark.tag_names.some((bookmarkTag) => bookmarkTag.toLowerCase() === tag.toLowerCase()),
        )
        if (!hasAllTags) return false
      }

      return true
    })

    // Apply sorting
    bookmarks.sort((a, b) => {
      switch (filters.sort) {
        case "old":
          return new Date(a.date_added).getTime() - new Date(b.date_added).getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        case "new":
        default:
          return new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
      }
    })

    // Apply pagination
    const paginatedBookmarks = bookmarks.slice(offset, offset + limit)
    const hasNext = offset + limit < bookmarks.length
    const hasPrevious = offset > 0

    const response: BookmarksResponse = {
      results: paginatedBookmarks,
      count: bookmarks.length,
      next: hasNext
        ? `${request.nextUrl.origin}${request.nextUrl.pathname}?${new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: String((filters.page || 1) + 1),
          })}`
        : null,
      previous: hasPrevious
        ? `${request.nextUrl.origin}${request.nextUrl.pathname}?${new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: String((filters.page || 1) - 1),
          })}`
        : null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}
