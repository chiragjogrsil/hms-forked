import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r bg-background/50 p-4 space-y-4">
        <div className="mb-4">
          <Skeleton className="h-6 w-20 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Section skeletons */}
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <Skeleton className="h-4 w-32 mb-3" />
            {Array.from({ length: 2 }).map((_, categoryIndex) => (
              <div key={categoryIndex} className="space-y-1">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 space-y-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Table Skeleton */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-10 w-64" />
          </div>

          <div className="p-6">
            {/* Table Header */}
            <div className="flex gap-4 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-4 flex-1" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-4 mb-3">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-8 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
