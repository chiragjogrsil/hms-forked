import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function VisitDetailsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="mb-2 h-4 w-24" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
              </div>

              <Separator />

              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-2 h-5 w-32" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array(3)
                        .fill(0)
                        .map((_, j) => (
                          <Skeleton key={j} className="h-24 w-full" />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="mb-2 h-4 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
