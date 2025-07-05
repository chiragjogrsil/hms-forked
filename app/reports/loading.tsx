import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main content skeleton */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-[150px]" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-[250px]" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Skeleton className="h-4 w-[200px]" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[130px]" />
                <Skeleton className="h-10 w-[100px]" />
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar skeletons */}
        <div className="space-y-6">
          {/* Recent Reports skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-4 w-[100px] mt-1" />
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[220px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-[150px]" />
                        <Skeleton className="h-5 w-[80px]" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          {/* Quick Actions skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[120px]" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
