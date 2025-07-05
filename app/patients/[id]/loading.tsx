import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>

                <div className="rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Skeleton className="mb-2 h-5 w-36" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Skeleton className="mb-2 h-5 w-36" />
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Skeleton className="mb-2 h-5 w-36" />
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Skeleton className="mb-4 h-10 w-full" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
