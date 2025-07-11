"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  TestTube,
  Microscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User,
  FileText,
} from "lucide-react"

// Department configuration
const departments = [
  {
    id: "all",
    name: "All Departments",
    icon: TestTube,
    color: "bg-gray-100 text-gray-700",
    services: 45,
  },
  {
    id: "laboratory",
    name: "Laboratory",
    icon: Microscope,
    color: "bg-blue-100 text-blue-700",
    services: 15,
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: TestTube,
    color: "bg-green-100 text-green-700",
    services: 8,
  },
  {
    id: "cardiology",
    name: "Cardiology",
    icon: Heart,
    color: "bg-red-100 text-red-700",
    services: 6,
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: Brain,
    color: "bg-purple-100 text-purple-700",
    services: 4,
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: Bone,
    color: "bg-orange-100 text-orange-700",
    services: 7,
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    icon: Eye,
    color: "bg-teal-100 text-teal-700",
    services: 5,
  },
]

// Sample services data
const servicesData = [
  {
    id: "LAB-001",
    name: "Complete Blood Count (CBC)",
    department: "laboratory",
    patient: "John Doe",
    patientId: "P12345",
    doctor: "Dr. Smith",
    status: "pending",
    priority: "routine",
    orderedDate: "2024-01-15",
    expectedDate: "2024-01-16",
    cost: 500,
    notes: "Fasting required",
  },
  {
    id: "RAD-002",
    name: "Chest X-Ray",
    department: "radiology",
    patient: "Jane Smith",
    patientId: "P12346",
    doctor: "Dr. Johnson",
    status: "in-progress",
    priority: "urgent",
    orderedDate: "2024-01-15",
    expectedDate: "2024-01-15",
    cost: 800,
    notes: "Suspected pneumonia",
  },
  {
    id: "CARD-003",
    name: "ECG",
    department: "cardiology",
    patient: "Robert Brown",
    patientId: "P12347",
    doctor: "Dr. Wilson",
    status: "completed",
    priority: "routine",
    orderedDate: "2024-01-14",
    expectedDate: "2024-01-14",
    cost: 300,
    notes: "Regular checkup",
  },
  {
    id: "LAB-004",
    name: "Liver Function Test",
    department: "laboratory",
    patient: "Emily Davis",
    patientId: "P12348",
    doctor: "Dr. Taylor",
    status: "pending",
    priority: "routine",
    orderedDate: "2024-01-15",
    expectedDate: "2024-01-16",
    cost: 700,
    notes: "Follow-up test",
  },
  {
    id: "NEURO-005",
    name: "MRI Brain",
    department: "neurology",
    patient: "Michael Wilson",
    patientId: "P12349",
    doctor: "Dr. Anderson",
    status: "scheduled",
    priority: "urgent",
    orderedDate: "2024-01-15",
    expectedDate: "2024-01-17",
    cost: 5000,
    notes: "Headache investigation",
  },
  {
    id: "ORTHO-006",
    name: "Knee X-Ray",
    department: "orthopedics",
    patient: "Sarah Johnson",
    patientId: "P12350",
    doctor: "Dr. Martinez",
    status: "in-progress",
    priority: "routine",
    orderedDate: "2024-01-15",
    expectedDate: "2024-01-15",
    cost: 600,
    notes: "Sports injury",
  },
  {
    id: "OPHT-007",
    name: "Visual Field Test",
    department: "ophthalmology",
    patient: "David Lee",
    patientId: "P12351",
    doctor: "Dr. Garcia",
    status: "completed",
    priority: "routine",
    orderedDate: "2024-01-14",
    expectedDate: "2024-01-14",
    cost: 400,
    notes: "Glaucoma screening",
  },
  {
    id: "LAB-008",
    name: "Blood Sugar Test",
    department: "laboratory",
    patient: "Lisa Chen",
    patientId: "P12352",
    doctor: "Dr. Kumar",
    status: "pending",
    priority: "stat",
    orderedDate: "2024-01-15",
    expectedDate: "2024-01-15",
    cost: 200,
    notes: "Emergency - diabetic patient",
  },
]

export default function ServicesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter services based on selected department and other filters
  const filteredServices = servicesData.filter((service) => {
    const matchesDepartment = selectedDepartment === "all" || service.department === selectedDepartment
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    const matchesPriority = priorityFilter === "all" || service.priority === priorityFilter

    return matchesDepartment && matchesSearch && matchesStatus && matchesPriority
  })

  // Get selected department info
  const selectedDeptInfo = departments.find((dept) => dept.id === selectedDepartment)

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Scheduled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "stat":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            STAT
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Urgent
          </Badge>
        )
      case "routine":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Routine
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">Manage laboratory tests, radiology, and other medical services</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Service
          </Button>
          <Button>
            <TestTube className="mr-2 h-4 w-4" />
            Order Service
          </Button>
        </div>
      </div>

      {/* Department Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Department Selection
          </CardTitle>
          <CardDescription>Select a department to view and manage its services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Department Dropdown */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedDeptInfo && (
                      <>
                        <selectedDeptInfo.icon className="h-4 w-4" />
                        <span>{selectedDeptInfo.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {selectedDeptInfo.services} services
                        </Badge>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div className="flex items-center gap-2 w-full">
                      <dept.icon className="h-4 w-4" />
                      <span>{dept.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {dept.services}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Department Info Panel */}
            {selectedDepartment !== "all" && selectedDeptInfo && (
              <div
                className={`p-4 rounded-lg ${selectedDeptInfo.color.replace("text-", "border-").replace("bg-", "bg-")}/20 border`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <selectedDeptInfo.icon className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">{selectedDeptInfo.name}</h3>
                    <p className="text-sm text-gray-600">
                      {filteredServices.length} services •{" "}
                      {filteredServices.filter((s) => s.status === "pending").length} pending
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">
                      {filteredServices.filter((s) => s.status === "pending").length}
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {filteredServices.filter((s) => s.status === "in-progress").length}
                    </div>
                    <div className="text-gray-600">In Progress</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {filteredServices.filter((s) => s.status === "completed").length}
                    </div>
                    <div className="text-gray-600">Completed</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      ₹{filteredServices.reduce((sum, s) => sum + s.cost, 0).toLocaleString()}
                    </div>
                    <div className="text-gray-600">Total Value</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services Queue</CardTitle>
              <CardDescription>
                {filteredServices.length} services found
                {selectedDepartment !== "all" && ` in ${selectedDeptInfo?.name}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services, patients, or IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services Table */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredServices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TestTube className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No services found</p>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{service.name}</span>
                            {getStatusBadge(service.status)}
                            {getPriorityBadge(service.priority)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {service.patient} ({service.patientId})
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {service.doctor}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expected: {new Date(service.expectedDate).toLocaleDateString()}
                            </div>
                          </div>
                          {service.notes && <div className="text-sm text-gray-500 mt-1">Note: {service.notes}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{service.cost}</div>
                          <div className="text-sm text-gray-500">{service.id}</div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Add Results</DropdownMenuItem>
                            <DropdownMenuItem>Print Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {service.patient} • {service.patientId}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Add Results</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(service.status)}
                          {getPriorityBadge(service.priority)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Doctor: {service.doctor}</div>
                          <div>Expected: {new Date(service.expectedDate).toLocaleDateString()}</div>
                          <div className="font-semibold text-gray-900 mt-2">₹{service.cost}</div>
                        </div>
                        {service.notes && (
                          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">{service.notes}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
