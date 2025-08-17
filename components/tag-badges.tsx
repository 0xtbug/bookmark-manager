"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TagBadgesProps {
  tags: string[]
  selectedTags?: string[]
  onTagClick?: (tag: string) => void
  onTagRemove?: (tag: string) => void
  showCounts?: boolean
  tagCounts?: Record<string, number>
}

export function TagBadges({
  tags,
  selectedTags = [],
  onTagClick,
  onTagRemove,
  showCounts = false,
  tagCounts = {},
}: TagBadgesProps) {
  if (tags.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4">No tags available</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag)
        const count = tagCounts[tag] || 0

        return (
          <div key={tag} className="flex items-center">
            <Badge
              variant={isSelected ? "default" : "secondary"}
              className={`cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-primary hover:text-primary-foreground"
              }`}
              onClick={() => onTagClick?.(tag)}
            >
              {tag}
              {showCounts && count > 0 && <span className="ml-1 text-xs opacity-75">{count}</span>}
            </Badge>
            {isSelected && onTagRemove && (
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onTagRemove(tag)
                }}
                aria-label={`Remove ${tag} filter`}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
