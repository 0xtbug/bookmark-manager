import { type NextRequest, NextResponse } from "next/server"
import { LinkdingAPI } from "@/lib/linkding-api"
import type { BookmarksResponse, Bookmark } from "@/lib/types"

// In-memory cache for all bookmarks
let allBookmarksCache: { data: BookmarksResponse; timestamp: number } | null = null
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

export async function GET(request: NextRequest) {
  try {
    // Check cache first - return ALL bookmarks from cache
    if (allBookmarksCache && Date.now() - allBookmarksCache.timestamp < CACHE_TTL) {
      return NextResponse.json(allBookmarksCache.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
          'Content-Type': 'application/json',
        },
      })
    }

    // Fetch ALL bookmarks from Linkding API (no filters - client handles filtering)
    const linkdingResponse = await LinkdingAPI.fetchAllBookmarks({})

    // Transform to our format
    const bookmarks: Bookmark[] = linkdingResponse.results.map((bookmark) => ({
      ...bookmark,
      favicon_url: null,
      preview_image_url: null,
    }))

    // Sort by newest first (default)
    bookmarks.sort((a, b) =>
      new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
    )

    const response: BookmarksResponse = {
      results: bookmarks,
      count: bookmarks.length,
      next: null,
      previous: null,
    }

    // Cache ALL bookmarks
    allBookmarksCache = {
      data: response,
      timestamp: Date.now(),
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}
