"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  MoreHorizontal,
  TestTube,
  Heart,
  Eye,
  Brain,
  Zap,
  Activity,
  Microscope,
  Scan,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Department data with icons and service counts
const departments = [
  { id: "all", name: "All Departments", icon: Activity, serviceCount: 156, color: "bg-blue-500" },
  { id: "laboratory", name: "Laboratory", icon: TestTube, serviceCount: 45, color: "bg-green-500" },
  { id: "radiology", name: "Radiology", icon: Scan, serviceCount: 28, color: "bg-purple-500" },
  { id: "cardiology", name: "Cardiology", icon: Heart, serviceCount: 22, color: "bg-red-500" },
  { id: "neurology", name: "Neurology", icon: Brain, serviceCount: 18, color: "bg-indigo-500" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, serviceCount: 15, color: "bg-yellow-500" },
  { id: "physiotherapy", name: "Physiotherapy", icon: Zap, serviceCount: 12, color: "bg-orange-500" },
  { id: "pathology", name: "Pathology", icon: Microscope, serviceCount: 16, color: "bg-pink-500" },
]

// Sample services data
const servicesData = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Complete Blood Count",
    department: "laboratory",
    priority: "normal",
    status: "in-progress",
    assignedTo: "Dr. Smith",
    scheduledTime: "10:30 AM",
    estimatedCompletion: "11:00 AM",
    notes: "Fasting sample required",
  },
  {
    id: "RAD002",
    patientName: "Jane Smith",
    patientId: "P12346",
    serviceName: "Chest X-Ray",
    department: "radiology",
    priority: "urgent",
    status: "pending",
    assignedTo: "Dr. Johnson",
    scheduledTime: "2:00 PM",
    estimatedCompletion: "2:30 PM",
    notes: "Follow-up for pneumonia",
  },
  {
    id: "CARD003",
    patientName: "Robert Wilson",
    patientId: "P12347",
    serviceName: "ECG",
    department: "cardiology",
    priority: "high",
    status: "completed",
    assignedTo: "Dr. Brown",
    scheduledTime: "9:00 AM",
    estimatedCompletion: "9:15 AM",
    notes: "Routine cardiac screening",
  },
  {
    id: "LAB004",
    patientName: "Mary Johnson",
    patientId: "P12348",
    serviceName: "Liver Function Test",
    department: "laboratory",
    priority: "normal",
    status: "in-progress",
    assignedTo: "Dr. Davis",
    scheduledTime: "11:30 AM",
    estimatedCompletion: "12:00 PM",
    notes: "Pre-operative assessment",
  },
  {
    id: "NEUR005",
    patientName: "David Brown",
    patientId: "P12349",
    serviceName: "MRI Brain",
    department: "neurology",
    priority: "urgent",
    status: "scheduled",
    assignedTo: "Dr. Wilson",
    scheduledTime: "3:00 PM",
    estimatedCompletion: "4:00 PM",
    notes: "Headache investigation",
  },
  {
    id: "OPHT006",
    patientName: "Sarah Davis",
    patientId: "P12350",
    serviceName: "Eye Examination",
    department: "ophthalmology",
    priority: "normal",
    status: "completed",
    assignedTo: "Dr. Miller",
    scheduledTime: "1:00 PM",
    estimatedCompletion: "1:30 PM",
    notes: "Annual eye check-up",
  },
]

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-100", label: "Pending" },
  scheduled: { icon: Calendar, color: "text-blue-600 bg-blue-100", label: "Scheduled" },
  "in-progress": { icon: Play, color: "text-orange-600 bg-orange-100", label: "In Progress" },
  completed: { icon: CheckCircle, color: "text-green-600 bg-green-100", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-100", label: "Cancelled" },
  paused: { icon: Pause, color: "text-gray-600 bg-gray-100", label: "Paused" },
}

const priorityConfig = {
  normal: { color: "text-gray-600 bg-gray-100", label: "Normal" },
  urgent: { color: "text-orange-600 bg-orange-100", label: "Urgent" },
  high: { color: "text-red-600 bg-red-100", label: "High" },
}

export default function ServicesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState("cards")

  // Filter services based on selected criteria
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

  const selectedDept = departments.find((dept) => dept.id === selectedDepartment)

  const ServiceCard = ({ service }: { service: any }) => {
    const StatusIcon = statusConfig[service.status as keyof typeof statusConfig]?.icon || Clock
    const departmentInfo = departments.find((dept) => dept.id === service.department)
    const DepartmentIcon = departmentInfo?.icon || Activity

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">{service.serviceName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <DepartmentIcon className="h-4 w-4" />
                {departmentInfo?.name}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{service.patientName}</p>
              <p className="text-xs text-gray-500">ID: {service.patientId}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={priorityConfig[service.priority as keyof typeof priorityConfig]?.color}>
                {priorityConfig[service.priority as keyof typeof priorityConfig]?.label}
              </Badge>
              <Badge className={statusConfig[service.status as keyof typeof statusConfig]?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[service.status as keyof typeof statusConfig]?.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Assigned To</p>
              <p className="font-medium">{service.assignedTo}</p>
            </div>
            <div>
              <p className="text-gray-500">Scheduled</p>
              <p className="font-medium">{service.scheduledTime}</p>
            </div>
          </div>

          {service.notes && (
            <div className="text-sm">
              <p className="text-gray-500">Notes</p>
              <p className="text-gray-700">{service.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all department services</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-teal-600" />
        </div>
      </div>

      {/* Department Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Selection</CardTitle>
          <CardDescription>Choose a department to view and manage its services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-64">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedDept && (
                      <>
                        <div className={`w-3 h-3 rounded-full ${selectedDept.color}`} />
                        <selectedDept.icon className="h-4 w-4" />
                        <span>{selectedDept.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {selectedDept.serviceCount}
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
                      <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                      <dept.icon className="h-4 w-4" />
                      <span>{dept.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {dept.serviceCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDept && selectedDept.id !== "all" && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                <div className={`w-8 h-8 rounded-full ${selectedDept.color} flex items-center justify-center`}>
                  <selectedDept.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{selectedDept.name}</p>
                  <p className="text-sm text-gray-500">{selectedDept.serviceCount} active services</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
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

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Display */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <div className="text-sm text-gray-500">Showing {filteredServices.length} services</div>
        </div>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Service</th>
                      <th className="text-left p-4 font-medium">Patient</th>
                      <th className="text-left p-4 font-medium">Department</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Priority</th>
                      <th className="text-left p-4 font-medium">Assigned To</th>
                      <th className="text-left p-4 font-medium">Time</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => {
                      const StatusIcon = statusConfig[service.status as keyof typeof statusConfig]?.icon || Clock
                      const departmentInfo = departments.find((dept) => dept.id === service.department)
                      const DepartmentIcon = departmentInfo?.icon || Activity

                      return (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{service.serviceName}</p>
                              <p className="text-sm text-gray-500">ID: {service.id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{service.patientName}</p>
                              <p className="text-sm text-gray-500">{service.patientId}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <DepartmentIcon className="h-4 w-4" />
                              {departmentInfo?.name}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={statusConfig[service.status as keyof typeof statusConfig]?.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[service.status as keyof typeof statusConfig]?.label}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={priorityConfig[service.priority as keyof typeof priorityConfig]?.color}>
                              {priorityConfig[service.priority as keyof typeof priorityConfig]?.label}
                            </Badge>
                          </td>
                          <td className="p-4">{service.assignedTo}</td>
                          <td className="p-4">{service.scheduledTime}</td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Service</DropdownMenuItem>
                                <DropdownMenuItem>Add Results</DropdownMenuItem>
                                <DropdownMenuItem>Print Report</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
