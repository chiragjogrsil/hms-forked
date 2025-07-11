"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  TestTube,
  Scan,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  Clock,
  Users,
  MapPin,
  User,
  ArrowLeft,
  MoreHorizontal,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Department configuration with icons and colors
const departments = {
  all: {
    id: "all",
    name: "All Departments",
    icon: Stethoscope,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    description: "View services across all departments",
    staff: 45,
    avgWaitTime: "18min",
    services: ["All Services"],
  },
  laboratory: {
    id: "laboratory",
    name: "Laboratory",
    icon: TestTube,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Blood tests, urine analysis, and diagnostic testing",
    staff: 12,
    avgWaitTime: "15min",
    services: ["Blood Test", "Urine Analysis", "Culture", "Biochemistry"],
  },
  radiology: {
    id: "radiology",
    name: "Radiology",
    icon: Scan,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "X-rays, CT scans, MRI, and ultrasound imaging",
    staff: 8,
    avgWaitTime: "25min",
    services: ["X-Ray", "CT Scan", "MRI", "Ultrasound"],
  },
  cardiology: {
    id: "cardiology",
    name: "Cardiology",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Heart diagnostics and cardiovascular testing",
    staff: 6,
    avgWaitTime: "20min",
    services: ["ECG", "Echo", "Stress Test", "Holter Monitor"],
  },
  neurology: {
    id: "neurology",
    name: "Neurology",
    icon: Brain,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Brain and nervous system diagnostics",
    staff: 4,
    avgWaitTime: "30min",
    services: ["EEG", "EMG", "Nerve Conduction", "Brain MRI"],
  },
  ophthalmology: {
    id: "ophthalmology",
    name: "Ophthalmology",
    icon: Eye,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Eye examinations and vision testing",
    staff: 5,
    avgWaitTime: "18min",
    services: ["Eye Exam", "OCT", "Visual Field", "Retinal Scan"],
  },
  general: {
    id: "general",
    name: "General",
    icon: Stethoscope,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    description: "General medical procedures and consultations",
    staff: 10,
    avgWaitTime: "12min",
    services: ["Consultation", "Physical Exam", "Vital Signs", "General Procedure"],
  },
}

// Mock service data
const mockServices = [
  {
    id: "SRV-001",
    patientName: "John Doe",
    patientId: "P12345",
    service: "Blood Test",
    department: "laboratory",
    status: "pending",
    requestTime: "09:30 AM",
    room: "Lab-A",
    technician: "Sarah Johnson",
    priority: "normal",
    estimatedTime: "15min",
  },
  {
    id: "SRV-002",
    patientName: "Jane Smith",
    patientId: "P12346",
    service: "X-Ray",
    department: "radiology",
    status: "in-progress",
    requestTime: "10:15 AM",
    room: "Rad-1",
    technician: "Mike Chen",
    priority: "urgent",
    estimatedTime: "20min",
  },
  {
    id: "SRV-003",
    patientName: "Robert Brown",
    patientId: "P12347",
    service: "ECG",
    department: "cardiology",
    status: "completed",
    requestTime: "08:45 AM",
    room: "Card-2",
    technician: "Lisa Wang",
    priority: "normal",
    estimatedTime: "10min",
  },
  {
    id: "SRV-004",
    patientName: "Emily Davis",
    patientId: "P12348",
    service: "Eye Exam",
    department: "ophthalmology",
    status: "pending",
    requestTime: "11:20 AM",
    room: "Oph-1",
    technician: "Dr. Patel",
    priority: "normal",
    estimatedTime: "25min",
  },
  {
    id: "SRV-005",
    patientName: "Michael Wilson",
    patientId: "P12349",
    service: "CT Scan",
    department: "radiology",
    status: "in-progress",
    requestTime: "09:00 AM",
    room: "Rad-2",
    technician: "Alex Kumar",
    priority: "urgent",
    estimatedTime: "30min",
  },
  {
    id: "SRV-006",
    patientName: "Sarah Taylor",
    patientId: "P12350",
    service: "Urine Analysis",
    department: "laboratory",
    status: "completed",
    requestTime: "08:30 AM",
    room: "Lab-B",
    technician: "Tom Rodriguez",
    priority: "normal",
    estimatedTime: "10min",
  },
]

export default function ServicesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter services based on selected department and other filters
  const filteredServices = mockServices.filter((service) => {
    const matchesDepartment = selectedDepartment === "all" || service.department === selectedDepartment
    const matchesSearch =
      searchQuery === "" ||
      service.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    const matchesPriority = priorityFilter === "all" || service.priority === priorityFilter

    return matchesDepartment && matchesSearch && matchesStatus && matchesPriority
  })

  // Get counts for each status
  const getStatusCounts = (dept: string) => {
    const deptServices = dept === "all" ? mockServices : mockServices.filter((s) => s.department === dept)
    return {
      pending: deptServices.filter((s) => s.status === "pending").length,
      inProgress: deptServices.filter((s) => s.status === "in-progress").length,
      completed: deptServices.filter((s) => s.status === "completed").length,
    }
  }

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
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        )
      case "normal":
        return (
          <Badge variant="secondary" className="text-xs">
            Normal
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {priority}
          </Badge>
        )
    }
  }

  const selectedDeptInfo = departments[selectedDepartment as keyof typeof departments]
  const statusCounts = getStatusCounts(selectedDepartment)

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-1">Manage and track medical services across departments</p>
          </div>
        </div>
      </div>

      {/* Department Selection and Info */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Department:</span>
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(departments).map((dept) => {
                const Icon = dept.icon
                const counts = getStatusCounts(dept.id)
                const totalServices = counts.pending + counts.inProgress + counts.completed

                return (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${dept.color}`} />
                      <span>{dept.name}</span>
                      {totalServices > 0 && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {totalServices}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Department Info */}
        {selectedDepartment !== "all" && (
          <Card className={`${selectedDeptInfo.bgColor} border-l-4 border-l-current ${selectedDeptInfo.color}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <selectedDeptInfo.icon className={`h-5 w-5 ${selectedDeptInfo.color} mt-0.5`} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedDeptInfo.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedDeptInfo.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{selectedDeptInfo.staff} staff</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{selectedDeptInfo.avgWaitTime} avg wait</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {statusCounts.pending} Pending
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {statusCounts.inProgress} Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Services Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <selectedDeptInfo.icon className={`h-5 w-5 ${selectedDeptInfo.color}`} />
                {selectedDepartment === "all" ? "All Services" : `${selectedDeptInfo.name} Services`}
              </CardTitle>
              <CardDescription>
                {selectedDepartment === "all"
                  ? "View and manage services across all departments"
                  : `Manage ${selectedDeptInfo.name.toLowerCase()} services and procedures`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {statusCounts.pending} Pending
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {statusCounts.inProgress} Active
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {statusCounts.completed} Completed
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, ID, or service..."
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
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services List */}
          <div className="space-y-3">
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No services found</p>
                <p className="text-sm">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              filteredServices.map((service) => {
                const deptInfo = departments[service.department as keyof typeof departments]
                const DeptIcon = deptInfo.icon

                return (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${deptInfo.bgColor}`}>
                            <DeptIcon className={`h-5 w-5 ${deptInfo.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{service.patientName}</h3>
                              <Badge variant="outline" className="text-xs">
                                {service.patientId}
                              </Badge>
                              {getPriorityBadge(service.priority)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="font-medium">{service.service}</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{service.room}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{service.technician}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{service.requestTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(service.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Start Service
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
