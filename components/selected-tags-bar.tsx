"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SelectedTagsBarProps {
  selectedTags: string[]
  onTagRemove: (tag: string) => void
  onClearAll: () => void
}

export function SelectedTagsBar({ selectedTags, onTagRemove, onClearAll }: SelectedTagsBarProps) {
  if (selectedTags.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-muted/30 to-muted/50 border-b border-border/50 px-4 py-3 animate-in slide-in-from-top-2 duration-300">
      <div className="container mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Filtered by:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedTags.map((tag, index) => (
              <Badge
                key={tag}
                variant="default"
                className="gap-1.5 bg-primary/90 hover:bg-primary transition-all duration-200 animate-in fade-in-50 slide-in-from-left-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {tag}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-3 w-3 p-0 hover:bg-primary-foreground/20 transition-all duration-200"
                  onClick={() => onTagRemove(tag)}
                  aria-label={`Remove ${tag} filter`}
                >
                  <X className="w-2.5 h-2.5" />
                </Button>
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs h-6 hover:bg-background/50 transition-all duration-200"
          >
            Clear all
          </Button>
        </div>
      </div>
    </div>
  )
}
