export default function ServicesLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Department Selection Skeleton */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-6 pt-0">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="h-10 w-80 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
