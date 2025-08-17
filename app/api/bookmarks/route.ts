import { type NextRequest, NextResponse } from "next/server"
import { LinkdingAPI } from "@/lib/linkding-api"
import type { BookmarksResponse, SearchFilters, Bookmark } from "@/lib/types"

// In-memory cache for API responses
const apiCache = new Map<string, { data: BookmarksResponse; timestamp: number }>()
const API_CACHE_TTL = 2 * 60 * 1000 // 2 minutes cache for API

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cacheKey = searchParams.toString()

    // Check cache first
    const cached = apiCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < API_CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
          'Content-Type': 'application/json',
        },
      })
    }

    // Parse query parameters
    const filters: SearchFilters = {
      q: searchParams.get("q") || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      archived: searchParams.get("archived") === "1" ? true : searchParams.get("archived") === "0" ? false : undefined,
      unread: searchParams.get("unread") === "1" ? true : undefined,
      shared: searchParams.get("shared") === "1" ? true : undefined,
      sort: (searchParams.get("sort") as SearchFilters["sort"]) || "new",
    }

    // Fetch all bookmarks from Linkding API
    const linkdingResponse = await LinkdingAPI.fetchAllBookmarks({
      q: filters.q,
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

    // Apply sorting with optimized comparison
    const sortFunctions = {
      old: (a: Bookmark, b: Bookmark) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime(),
      "title-asc": (a: Bookmark, b: Bookmark) => a.title.localeCompare(b.title),
      "title-desc": (a: Bookmark, b: Bookmark) => b.title.localeCompare(a.title),
      new: (a: Bookmark, b: Bookmark) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime(),
    }

    const sortFunction = sortFunctions[filters.sort || "new"]
    bookmarks.sort(sortFunction)

    // Return all bookmarks without pagination
    const response: BookmarksResponse = {
      results: bookmarks,
      count: bookmarks.length,
      next: null,
      previous: null,
    }

    // Cache the response
    apiCache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    })

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        'Content-Type': 'application/json',
        'X-Response-Time': Date.now().toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}
