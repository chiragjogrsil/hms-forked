"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/data/patients"

const CategoryBadge = ({ category }: { category: Patient["category"] }) => {
  const variant = {
    VIP: "default",
    General: "secondary",
    Pediatric: "outline",
  } as const
  const color = {
    VIP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
    General: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pediatric: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  }
  return (
    <Badge variant={variant[category]} className={color[category]}>
      {category}
    </Badge>
  )
}

const StatusPill = ({ status }: { status: Patient["status"] }) => {
  const color = {
    Active: "bg-emerald-500",
    Recent: "bg-yellow-500",
    Inactive: "bg-gray-400",
  }
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color[status]}`} />
      <span>{status}</span>
    </div>
  )
}

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const patient = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
            <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{patient.name}</div>
            <div className="text-sm text-muted-foreground">{patient.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "age",
    header: "Age / Gender",
    cell: ({ row }) => {
      const patient = row.original
      return (
        <div>
          {patient.age} / {patient.gender.charAt(0)}
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <CategoryBadge category={row.original.category} />,
  },
  {
    accessorKey: "lastVisit",
    header: "Last Visit",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusPill status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.id)}>
              Copy patient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit details</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete patient</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
