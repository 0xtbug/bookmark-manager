"use client"

import type React from "react"
import { ExternalLink, Globe, Archive, EyeOff, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Bookmark } from "@/lib/types"
import { formatRelativeTime, getHostname, truncateText } from "@/lib/format"

interface BookmarkCardProps {
  bookmark: Bookmark
  onTagClick?: (tag: string) => void
}

export function BookmarkCard({ bookmark, onTagClick }: BookmarkCardProps) {
  const displayTitle = bookmark.title || getHostname(bookmark.url)
  const displayDescription =
    bookmark.description || bookmark.website_description || bookmark.notes || "No description available"

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      window.open(bookmark.url, "_blank", "noopener,noreferrer")
    } else if (event.key === "a" && bookmark.web_archive_snapshot_url) {
      window.open(bookmark.web_archive_snapshot_url, "_blank", "noopener,noreferrer")
    }
  }

  const handleOpenLink = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer")
  }

  const handleOpenArchive = () => {
    if (bookmark.web_archive_snapshot_url) {
      window.open(bookmark.web_archive_snapshot_url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <TooltipProvider>
      <Card
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-card/50 backdrop-blur-sm border-border/50 hover:border-border h-full"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="article"
        aria-label={`Bookmark: ${displayTitle}`}
      >
        <CardContent className="p-4 h-full flex flex-col">
          {/* Status indicators */}
          <div className="flex justify-end gap-1 mb-3">
            {bookmark.is_archived && (
              <div className="bg-muted/50 rounded-full p-1.5">
                <Archive className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
            {bookmark.unread && (
              <div className="bg-muted/50 rounded-full p-1.5">
                <EyeOff className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
            {bookmark.shared && (
              <div className="bg-muted/50 rounded-full p-1.5">
                <Share2 className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1 flex flex-col">
            {/* Header with favicon and title */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {bookmark.favicon_url ? (
                  <img src={bookmark.favicon_url || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-sm" />
                ) : (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {displayTitle}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{getHostname(bookmark.url)}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
              {truncateText(displayDescription, 150)}
            </p>

            {/* Tags */}
            {bookmark.tag_names.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {bookmark.tag_names.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105 bg-secondary/60"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTagClick?.(tag)
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
                {bookmark.tag_names.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-background/50">
                    +{bookmark.tag_names.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta information and actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{formatRelativeTime(bookmark.date_added)}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenLink()
                      }}
                      aria-label={`Open ${displayTitle} in new tab`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open link</p>
                  </TooltipContent>
                </Tooltip>

                {bookmark.web_archive_snapshot_url && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-secondary transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenArchive()
                        }}
                        aria-label={`View archived version of ${displayTitle}`}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View archive</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
