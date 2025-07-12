"use client"

import { useState } from "react"
import { Search, Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for services
const servicesData = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Complete Blood Count",
    department: "Laboratory",
    requestedBy: "Dr. Smith",
    priority: "High",
    status: "In Progress",
    scheduledTime: "10:30 AM",
    estimatedCompletion: "11:00 AM",
    notes: "Fasting required",
  },
  {
    id: "RAD002",
    patientName: "Jane Smith",
    patientId: "P12346",
    serviceName: "Chest X-Ray",
    department: "Radiology",
    requestedBy: "Dr. Johnson",
    priority: "Medium",
    status: "Pending",
    scheduledTime: "2:00 PM",
    estimatedCompletion: "2:30 PM",
    notes: "Remove jewelry",
  },
  {
    id: "LAB003",
    patientName: "Mike Wilson",
    patientId: "P12347",
    serviceName: "Lipid Profile",
    department: "Laboratory",
    requestedBy: "Dr. Brown",
    priority: "Low",
    status: "Completed",
    scheduledTime: "9:00 AM",
    estimatedCompletion: "9:30 AM",
    notes: "12-hour fasting",
  },
  {
    id: "CARD004",
    patientName: "Sarah Davis",
    patientId: "P12348",
    serviceName: "ECG",
    department: "Cardiology",
    requestedBy: "Dr. Wilson",
    priority: "High",
    status: "In Progress",
    scheduledTime: "11:15 AM",
    estimatedCompletion: "11:45 AM",
    notes: "Patient anxious",
  },
  {
    id: "PHYS005",
    patientName: "Robert Johnson",
    patientId: "P12349",
    serviceName: "Physical Therapy Session",
    department: "Physiotherapy",
    requestedBy: "Dr. Lee",
    priority: "Medium",
    status: "Scheduled",
    scheduledTime: "3:30 PM",
    estimatedCompletion: "4:30 PM",
    notes: "Lower back pain",
  },
]

const departments = [
  { id: "all", name: "All Departments", count: 25, icon: "🏥" },
  { id: "laboratory", name: "Laboratory", count: 8, icon: "🔬" },
  { id: "radiology", name: "Radiology", count: 6, icon: "📷" },
  { id: "cardiology", name: "Cardiology", count: 4, icon: "❤️" },
  { id: "physiotherapy", name: "Physiotherapy", count: 3, icon: "🏃" },
  { id: "pharmacy", name: "Pharmacy", count: 4, icon: "💊" },
]

export default function ServicesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState("cards")

  const filteredServices = servicesData.filter((service) => {
    const matchesDepartment = selectedDepartment === "all" || service.department.toLowerCase() === selectedDepartment
    const matchesSearch =
      service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status.toLowerCase().replace(" ", "-") === statusFilter
    const matchesPriority = priorityFilter === "all" || service.priority.toLowerCase() === priorityFilter

    return matchesDepartment && matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "Scheduled":
        return <Calendar className="h-4 w-4 text-purple-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Scheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedDeptInfo = departments.find((dept) => dept.id === selectedDepartment)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Services Management</h2>
        <div className="flex items-center space-x-2">
          <Button>Add New Service</Button>
        </div>
      </div>

      {/* Department Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Department Selection</CardTitle>
          <CardDescription>Select a department to view and manage services</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  <div className="flex items-center gap-2">
                    <span>{dept.icon}</span>
                    <span>{dept.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {dept.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDeptInfo && selectedDepartment !== "all" && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedDeptInfo.icon}</span>
                <h3 className="font-semibold text-blue-900">{selectedDeptInfo.name}</h3>
              </div>
              <p className="text-sm text-blue-700">
                {selectedDeptInfo.count} active services • Specialized department workflows
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
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
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}>
            {viewMode === "cards" ? "List View" : "Card View"}
          </Button>
        </div>
      </div>

      {/* Services Display */}
      <div className="space-y-4">
        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {service.patientName} ({service.patientId})
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
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
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1">{service.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{service.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested by:</span>
                      <span className="font-medium">{service.requestedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="font-medium">{service.scheduledTime}</span>
                    </div>
                    {service.notes && (
                      <div className="pt-2 border-t">
                        <span className="text-muted-foreground text-xs">Notes: </span>
                        <span className="text-xs">{service.notes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Services List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{service.serviceName}</div>
                        <div className="text-sm text-muted-foreground">
                          {service.patientName} ({service.patientId}) • {service.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                      <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>
                      <span className="text-sm text-muted-foreground">{service.scheduledTime}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
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
            </CardContent>
          </Card>
        )}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground text-center">
              No services match your current filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
