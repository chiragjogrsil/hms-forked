import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function TableRowSkeleton({
  columns,
  isAvatar = false,
}: {
  columns: number
  isAvatar?: boolean
}) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          {isAvatar && index === 1 ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : (
            <Skeleton className="h-5 w-full" />
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
