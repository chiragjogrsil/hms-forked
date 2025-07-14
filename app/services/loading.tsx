import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServicesLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Department Selection Loading */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-96" />
          </div>
        </CardContent>
      </Card>

      {/* Filters Loading */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Services Cards Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-48" />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-40" />
                  </CardDescription>
                  <div className="mt-2 space-y-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>

              {/* Timeline Loading */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16 mt-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="pt-2 border-t">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4 mt-1" />
                </div>
              </div>

              {/* Action Buttons Loading */}
              <div className="pt-2 border-t space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
