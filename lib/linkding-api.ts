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

  static async fetchTags(
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
