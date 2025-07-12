import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Skeleton */}
      <div className="w-80 border-r bg-background/50 p-4 space-y-2">
        <div className="mb-4">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-12 w-full" />
              {i < 2 && (
                <div className="ml-6 space-y-1">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>

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
            <div className="space-y-4">
              <div className="flex space-x-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-24" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
