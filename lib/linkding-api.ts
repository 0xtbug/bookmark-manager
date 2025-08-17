const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

if (!API_BASE_URL || !API_TOKEN) {
  throw new Error("Missing required environment variables: NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_TOKEN")
}

const headers = {
  Authorization: `Token ${API_TOKEN}`,
  "Content-Type": "application/json",
}

export interface LinkdingBookmarksResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    id: number
    url: string
    title: string
    description: string
    notes: string
    website_title: string | null
    website_description: string | null
    web_archive_snapshot_url: string | null
    is_archived: boolean
    unread: boolean
    shared: boolean
    tag_names: string[]
    date_added: string
    date_modified: string
  }>
}

export interface LinkdingTagsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{
    id: number
    name: string
    date_added: string
  }>
}

export class LinkdingAPI {
  static async fetchBookmarks(
    params: {
      q?: string
      limit?: number
      offset?: number
      archived?: boolean
    } = {},
  ): Promise<LinkdingBookmarksResponse> {
    const searchParams = new URLSearchParams()

    if (params.q) searchParams.set("q", params.q)
    if (params.limit) searchParams.set("limit", params.limit.toString())
    if (params.offset) searchParams.set("offset", params.offset.toString())

    const endpoint = params.archived ? "/bookmarks/archived/" : "/bookmarks/"
    const url = `${API_BASE_URL}${endpoint}?${searchParams.toString()}`

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`Failed to fetch bookmarks: ${response.statusText}`)
    }

    return response.json()
  }

  static async fetchAllBookmarks(
    params: {
      q?: string
      archived?: boolean
    } = {},
  ): Promise<LinkdingBookmarksResponse> {
    // Try to fetch a large batch first to minimize API calls
    const initialLimit = 500
    const firstResponse = await this.fetchBookmarks({
      ...params,
      limit: initialLimit,
      offset: 0,
    })

    // If we got less than the limit, we have all bookmarks
    if (firstResponse.results.length < initialLimit) {
      return {
        count: firstResponse.results.length,
        next: null,
        previous: null,
        results: firstResponse.results,
      }
    }

    // Otherwise, we need to fetch more in parallel
    const allBookmarks = [...firstResponse.results]
    const totalExpected = firstResponse.count || firstResponse.results.length
    const remainingCount = totalExpected - firstResponse.results.length

    if (remainingCount <= 0) {
      return {
        count: allBookmarks.length,
        next: null,
        previous: null,
        results: allBookmarks,
      }
    }

    // Fetch remaining bookmarks in parallel batches
    const batchSize = 200
    const batches = Math.ceil(remainingCount / batchSize)
    const promises: Promise<LinkdingBookmarksResponse>[] = []

    for (let i = 0; i < batches; i++) {
      const offset = initialLimit + (i * batchSize)
      promises.push(
        this.fetchBookmarks({
          ...params,
          limit: batchSize,
          offset,
        })
      )
    }

    try {
      const responses = await Promise.all(promises)

      for (const response of responses) {
        allBookmarks.push(...response.results)
      }
    } catch (error) {
      console.warn("Some parallel bookmark fetches failed, using partial data:", error)
    }

    return {
      count: allBookmarks.length,
      next: null,
      previous: null,
      results: allBookmarks,
    }
  }  static async fetchTags(
    params: {
      limit?: number
      offset?: number
    } = {},
  ): Promise<LinkdingTagsResponse> {
    const searchParams = new URLSearchParams()

    if (params.limit) searchParams.set("limit", params.limit.toString())
    if (params.offset) searchParams.set("offset", params.offset.toString())

    const url = `${API_BASE_URL}/tags/?${searchParams.toString()}`

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`)
    }

    return response.json()
  }
}
