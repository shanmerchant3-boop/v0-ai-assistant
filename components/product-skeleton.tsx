"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-primary/20 bg-card/30 backdrop-blur-sm">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </Card>
  )
}
