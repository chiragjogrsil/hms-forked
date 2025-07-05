"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Printer,
  Search,
  Trash2,
  UserPlus,
  Grid3X3,
  List,
  Phone,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useMediaQuery } from "@/hooks/use-media-query"
import { TooltipProvider } from "@/components/ui/tooltip"

// Mock data for patients
const patients = [
  {
    id: "P12345",
    name: "John Doe",
    age: 45,
    gender: "Male",
    contactNumber: "+91 9876543210",
    category: "General",
    lastVisit: "2023-05-01",
    status: "Active",
  },
  {
    id: "P12346",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    contactNumber: "+91 9876543211",
    category: "General",
    lastVisit: "2023-05-02",
    status: "Active",
  },
  {
    id: "P12347",
    name: "Robert Brown",
    age: 58,
    gender: "Male",
    contactNumber: "+91 9876543212",
    category: "Senior",
    lastVisit: "2023-04-28",
    status: "Active",
  },
  {
    id: "P12348",
    name: "Emily Davis",
    age: 27,
    gender: "Female",
    contactNumber: "+91 9876543213",
    category: "General",
    lastVisit: "2023-04-25",
    status: "Inactive",
  },
  {
    id: "P12349",
    name: "Michael Wilson",
    age: 42,
    gender: "Male",
    contactNumber: "+91 9876543214",
    category: "VIP",
    lastVisit: "2023-05-03",
    status: "Active",
  },
  {
    id: "P12350",
    name: "Sarah Taylor",
    age: 35,
    gender: "Female",
    contactNumber: "+91 9876543215",
    category: "General",
    lastVisit: "2023-04-20",
    status: "Active",
  },
  {
    id: "P12351",
    name: "David Martinez",
    age: 62,
    gender: "Male",
    contactNumber: "+91 9876543216",
    category: "Senior",
    lastVisit: "2023-04-15",
    status: "Inactive",
  },
  {
    id: "P12352",
    name: "Emma Thompson",
    age: 8,
    gender: "Female",
    contactNumber: "+91 9876543217",
    category: "Child",
    lastVisit: "2023-05-04",
    status: "Active",
  },
  {
    id: "P12353",
    name: "Noah Garcia",
    age: 5,
    gender: "Male",
    contactNumber: "+91 9876543218",
    category: "Child",
    lastVisit: "2023-04-30",
    status: "Active",
  },
  {
    id: "P12354",
    name: "Olivia Rodriguez",
    age: 29,
    gender: "Female",
    contactNumber: "+91 9876543219",
    category: "Staff",
    lastVisit: "2023-05-02",
    status: "Active",
  },
]

export default function PatientList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentTab, setCurrentTab] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const router = useRouter()

  // Filter patients based on search query and filters
  const filteredPatients = patients.filter((patient) => {
    // Search filter - expanded to include more fields
    const matchesSearch =
      searchQuery === "" ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contactNumber.includes(searchQuery) ||
      (patient.category && patient.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient.status && patient.status.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    // Category filter
    const matchesCategory = categoryFilter === "all" || patient.category.toLowerCase() === categoryFilter.toLowerCase()

    // Tab filter
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "recent" && new Date(patient.lastVisit) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (currentTab === "inactive" && patient.status.toLowerCase() === "inactive")

    return matchesSearch && matchesStatus && matchesCategory && matchesTab
  })

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Get avatar color based on category
  const getAvatarColor = (category: string) => {
    switch (category) {
      case "VIP":
        return "bg-purple-500"
      case "Staff":
        return "bg-blue-500"
      case "Senior":
        return "bg-orange-500"
      case "Child":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Patients</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button size="sm" onClick={() => alert("Patient registration feature coming soon!")}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>View, search, and manage all patient records in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, contact number, or address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="senior">Senior Citizen</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
                {/* View Mode Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="recent">Recent Visits</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="rounded-md border">
                <TooltipProvider>
                  <Table className="cursor-default">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age/Gender</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No patients found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPatients.map((patient) => (
                          <TableRow
                            key={patient.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => router.push(`/patients/${patient.id}`)}
                          >
                            <TableCell className="font-medium">{patient.id}</TableCell>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>
                              {patient.age} / {patient.gender}
                            </TableCell>
                            <TableCell>{patient.contactNumber}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  patient.category === "VIP"
                                    ? "default"
                                    : patient.category === "Staff"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {patient.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>
                              <Badge variant={patient.status === "Active" ? "outline" : "secondary"}>
                                {patient.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the button
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/patients/${patient.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/patients/${patient.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/appointments/new?patientId=${patient.id}`}>
                                      <Plus className="mr-2 h-4 w-4" />
                                      Book Appointment
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // Handle delete action
                                      alert(`Delete patient ${patient.id}`)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </div>
            )}

            {/* Card View */}
            {viewMode === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPatients.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No patients found.</div>
                ) : (
                  filteredPatients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/patients/${patient.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className={`h-12 w-12 ${getAvatarColor(patient.category)}`}>
                            <AvatarFallback className="text-white font-semibold">
                              {getInitials(patient.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{patient.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{patient.id}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/appointments/new?patientId=${patient.id}`}>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Book Appointment
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  alert(`Delete patient ${patient.id}`)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            {patient.age} years, {patient.gender}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            {patient.contactNumber}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last visit: {patient.lastVisit}
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <Badge
                              variant={
                                patient.category === "VIP"
                                  ? "default"
                                  : patient.category === "Staff"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {patient.category}
                            </Badge>
                            <Badge variant={patient.status === "Active" ? "outline" : "secondary"}>
                              {patient.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patients
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
