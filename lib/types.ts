// Core data types for the bookmark manager application

export interface Bookmark {
  id: number
  url: string
  title: string
  description: string
  notes: string
  web_archive_snapshot_url: string | null
  favicon_url: string | null
  preview_image_url: string | null
  is_archived: boolean
  unread: boolean
  shared: boolean
  tag_names: string[]
  date_added: string
  date_modified: string
  website_title: string | null
  website_description: string | null
}

export interface Tag {
  id: number
  name: string
  date_added: string
}

export interface BookmarksResponse {
  results: Bookmark[]
  count?: number
  next?: string | null
  previous?: string | null
}

export interface TagsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Tag[]
}

export interface SearchFilters {
  q?: string
  tags?: string[]
  archived?: boolean
  unread?: boolean
  shared?: boolean
  sort?: "new" | "old" | "title-asc" | "title-desc"
  page?: number
}
