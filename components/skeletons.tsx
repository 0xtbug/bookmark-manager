import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function BookmarkCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Skeleton className="w-4 h-4 rounded-sm flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        {/* Preview image */}
        {/* <Skeleton className="aspect-video w-full rounded-md" /> */}

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Tags */}
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BookmarkGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookmarkCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TagsSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-16 rounded-full" />
      ))}
    </div>
  )
}

export function LoadingMoreSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <BookmarkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
