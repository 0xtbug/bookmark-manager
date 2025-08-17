import { type NextRequest, NextResponse } from "next/server"
import { LinkdingAPI } from "@/lib/linkding-api"
import type { TagsResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const linkdingResponse = await LinkdingAPI.fetchTags({
      limit: 1000, // Fetch all tags to calculate usage counts
      offset: 0,
    })

    // Get all bookmarks to calculate tag usage counts
    const bookmarksResponse = await LinkdingAPI.fetchBookmarks({
      limit: 1000, // Fetch all bookmarks for accurate counts
      offset: 0,
    })

    // Calculate tag usage counts from bookmarks
    const tagCounts = new Map<string, number>()
    bookmarksResponse.results.forEach((bookmark) => {
      bookmark.tag_names.forEach((tagName) => {
        tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1)
      })
    })

    // Filter tags to only include those that are actually used
    const usedTags = linkdingResponse.results.filter((tag) => tagCounts.has(tag.name))

    // Sort by usage count (descending) then by name
    usedTags.sort((a, b) => {
      const countA = tagCounts.get(a.name) || 0
      const countB = tagCounts.get(b.name) || 0
      if (countA !== countB) return countB - countA
      return a.name.localeCompare(b.name)
    })

    // Apply pagination
    const paginatedTags = usedTags.slice(offset, offset + limit)
    const hasNext = offset + limit < usedTags.length
    const hasPrevious = offset > 0

    const response: TagsResponse = {
      count: usedTags.length,
      next: hasNext
        ? `${request.nextUrl.origin}${request.nextUrl.pathname}?limit=${limit}&offset=${offset + limit}`
        : null,
      previous: hasPrevious
        ? `${request.nextUrl.origin}${request.nextUrl.pathname}?limit=${limit}&offset=${Math.max(0, offset - limit)}`
        : null,
      results: paginatedTags,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
