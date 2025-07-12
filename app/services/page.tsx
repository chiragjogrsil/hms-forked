"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  TestTube,
  Stethoscope,
  Heart,
  Eye,
  Brain,
  Bone,
  Baby,
  Users,
  Activity,
} from "lucide-react"

// Department data with icons and service counts
const departments = [
  { id: "all", name: "All Departments", icon: Users, serviceCount: 156, color: "bg-gray-100 text-gray-700" },
  { id: "laboratory", name: "Laboratory", icon: TestTube, serviceCount: 45, color: "bg-blue-100 text-blue-700" },
  { id: "radiology", name: "Radiology", icon: Activity, serviceCount: 32, color: "bg-green-100 text-green-700" },
  { id: "cardiology", name: "Cardiology", icon: Heart, serviceCount: 28, color: "bg-red-100 text-red-700" },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, serviceCount: 22, color: "bg-orange-100 text-orange-700" },
  { id: "neurology", name: "Neurology", icon: Brain, serviceCount: 18, color: "bg-purple-100 text-purple-700" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, serviceCount: 15, color: "bg-pink-100 text-pink-700" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, serviceCount: 12, color: "bg-teal-100 text-teal-700" },
  {
    id: "general",
    name: "General Medicine",
    icon: Stethoscope,
    serviceCount: 24,
    color: "bg-indigo-100 text-indigo-700",
  },
]

// Sample services data
const servicesData = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Complete Blood Count",
    department: "laboratory",
    requestedBy: "Dr. Smith",
    priority: "urgent",
    status: "pending",
    requestDate: "2024-01-15",
    scheduledDate: "2024-01-15",
    estimatedTime: "30 mins",
  },
  {
    id: "RAD002",
    patientName: "Jane Smith",
    patientId: "P12346",
    serviceName: "Chest X-Ray",
    department: "radiology",
    requestedBy: "Dr. Johnson",
    priority: "normal",
    status: "in-progress",
    requestDate: "2024-01-15",
    scheduledDate: "2024-01-15",
    estimatedTime: "15 mins",
  },
  {
    id: "CARD003",
    patientName: "Robert Wilson",
    patientId: "P12347",
    serviceName: "ECG",
    department: "cardiology",
    requestedBy: "Dr. Brown",
    priority: "high",
    status: "completed",
    requestDate: "2024-01-14",
    scheduledDate: "2024-01-14",
    estimatedTime: "20 mins",
  },
  {
    id: "ORTH004",
    patientName: "Mary Johnson",
    patientId: "P12348",
    serviceName: "Knee MRI",
    department: "orthopedics",
    requestedBy: "Dr. Davis",
    priority: "normal",
    status: "scheduled",
    requestDate: "2024-01-15",
    scheduledDate: "2024-01-16",
    estimatedTime: "45 mins",
  },
  {
    id: "LAB005",
    patientName: "David Brown",
    patientId: "P12349",
    serviceName: "Liver Function Test",
    department: "laboratory",
    requestedBy: "Dr. Wilson",
    priority: "normal",
    status: "pending",
    requestDate: "2024-01-15",
    scheduledDate: "2024-01-15",
    estimatedTime: "25 mins",
  },
]

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Activity },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  scheduled: { label: "Scheduled", color: "bg-purple-100 text-purple-800", icon: Calendar },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
}

const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800" },
  high: { label: "High", color: "bg-orange-100 text-orange-800" },
  normal: { label: "Normal", color: "bg-green-100 text-green-800" },
  low: { label: "Low", color: "bg-gray-100 text-gray-800" },
}

export default function ServicesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list")

  // Get selected department info
  const selectedDeptInfo = departments.find((dept) => dept.id === selectedDepartment)

  // Filter services based on selected filters
  const filteredServices = servicesData.filter((service) => {
    const matchesDepartment = selectedDepartment === "all" || service.department === selectedDepartment
    const matchesSearch =
      service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    const matchesPriority = priorityFilter === "all" || service.priority === priorityFilter

    return matchesDepartment && matchesSearch && matchesStatus && matchesPriority
  })

  const ServiceCard = ({ service }: { service: any }) => {
    const StatusIcon = statusConfig[service.status as keyof typeof statusConfig]?.icon || Clock

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{service.serviceName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {service.patientName} ({service.patientId})
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
                <DropdownMenuItem>Edit Service</DropdownMenuItem>
                <DropdownMenuItem>Add Results</DropdownMenuItem>
                <DropdownMenuItem>Print Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Requested by:</span>
            <span className="font-medium">{service.requestedBy}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Department:</span>
            <Badge variant="outline" className={departments.find((d) => d.id === service.department)?.color}>
              {departments.find((d) => d.id === service.department)?.name}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <Badge className={statusConfig[service.status as keyof typeof statusConfig]?.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[service.status as keyof typeof statusConfig]?.label}
            </Badge>
            <Badge variant="outline" className={priorityConfig[service.priority as keyof typeof priorityConfig]?.color}>
              {priorityConfig[service.priority as keyof typeof priorityConfig]?.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {service.scheduledDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {service.estimatedTime}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage and track all hospital services</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Department Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Selection</CardTitle>
          <CardDescription>Select a department to view and manage its services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedDeptInfo && (
                      <>
                        <selectedDeptInfo.icon className="h-4 w-4" />
                        <span>{selectedDeptInfo.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {selectedDeptInfo.serviceCount}
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
                      <span className="flex-1">{dept.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {dept.serviceCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDepartment !== "all" && selectedDeptInfo && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                <selectedDeptInfo.icon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedDeptInfo.name}</p>
                  <p className="text-sm text-gray-600">{selectedDeptInfo.serviceCount} active services</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by patient name, ID, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services ({filteredServices.length})</CardTitle>
              <CardDescription>
                {selectedDepartment === "all" ? "All department services" : `${selectedDeptInfo?.name} services`}
              </CardDescription>
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} className="w-full">
            <TabsContent value="list" className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 gap-4 p-4 font-medium text-sm text-gray-600 bg-gray-50 border-b">
                  <div>Service</div>
                  <div>Patient</div>
                  <div>Department</div>
                  <div>Status</div>
                  <div>Priority</div>
                  <div>Scheduled</div>
                  <div>Actions</div>
                </div>
                {filteredServices.map((service) => {
                  const StatusIcon = statusConfig[service.status as keyof typeof statusConfig]?.icon || Clock
                  return (
                    <div key={service.id} className="grid grid-cols-7 gap-4 p-4 border-b hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{service.serviceName}</p>
                        <p className="text-sm text-gray-600">{service.id}</p>
                      </div>
                      <div>
                        <p className="font-medium">{service.patientName}</p>
                        <p className="text-sm text-gray-600">{service.patientId}</p>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={departments.find((d) => d.id === service.department)?.color}
                        >
                          {departments.find((d) => d.id === service.department)?.name}
                        </Badge>
                      </div>
                      <div>
                        <Badge className={statusConfig[service.status as keyof typeof statusConfig]?.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[service.status as keyof typeof statusConfig]?.label}
                        </Badge>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={priorityConfig[service.priority as keyof typeof priorityConfig]?.color}
                        >
                          {priorityConfig[service.priority as keyof typeof priorityConfig]?.label}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <p>{service.scheduledDate}</p>
                        <p className="text-gray-600">{service.estimatedTime}</p>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Service</DropdownMenuItem>
                            <DropdownMenuItem>Add Results</DropdownMenuItem>
                            <DropdownMenuItem>Print Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredServices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No services found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
