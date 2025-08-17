// Utilities for managing URL query state

import type { SearchFilters } from "./types"

export function parseSearchParams(searchParams: URLSearchParams): SearchFilters {
  return {
    q: searchParams.get("q") || undefined,
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || undefined,
    archived: searchParams.get("archived") === "1" ? true : searchParams.get("archived") === "0" ? false : undefined,
    unread: searchParams.get("unread") === "1" ? true : undefined,
    shared: searchParams.get("shared") === "1" ? true : undefined,
    sort: (searchParams.get("sort") as SearchFilters["sort"]) || "new"
  }
}

export function buildSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.tags && filters.tags.length > 0) params.set("tags", filters.tags.join(","))
  if (filters.archived === true) params.set("archived", "1")
  if (filters.archived === false) params.set("archived", "0")
  if (filters.unread === true) params.set("unread", "1")
  if (filters.shared === true) params.set("shared", "1")
  if (filters.sort && filters.sort !== "new") params.set("sort", filters.sort)

  return params
}

export function updateSearchParams(currentParams: URLSearchParams, updates: Partial<SearchFilters>): URLSearchParams {
  const currentFilters = parseSearchParams(currentParams)
  const newFilters = { ...currentFilters, ...updates }

  return buildSearchParams(newFilters)
}
