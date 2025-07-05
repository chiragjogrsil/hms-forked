import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="h-10 border-b px-4 flex items-center">
              <Skeleton className="h-4 w-full" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-b px-4 py-2 flex items-center">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
