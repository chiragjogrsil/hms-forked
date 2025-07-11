"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TestTube, Clock, CheckCircle, AlertCircle, Camera, Stethoscope, Heart, Brain, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Service types configuration
const serviceTypes = {
  laboratory: {
    name: "Laboratory Tests",
    icon: TestTube,
    color: "blue",
    departments: ["Hematology", "Biochemistry", "Microbiology", "Pathology", "Immunology"],
  },
  radiology: {
    name: "Imaging Studies",
    icon: Camera,
    color: "purple",
    departments: ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Nuclear Medicine"],
  },
  cardiology: {
    name: "Cardiac Tests",
    icon: Heart,
    color: "red",
    departments: ["ECG", "Echo", "Stress Test", "Holter Monitor", "Cardiac Catheterization"],
  },
  neurology: {
    name: "Neurological Tests",
    icon: Brain,
    color: "green",
    departments: ["EEG", "EMG", "Nerve Conduction", "Sleep Study", "Neuropsychological"],
  },
  ophthalmology: {
    name: "Eye Examinations",
    icon: Eye,
    color: "amber",
    departments: ["Visual Field", "OCT", "Fundus Photography", "Tonometry", "Refraction"],
  },
  general: {
    name: "General Tests",
    icon: Stethoscope,
    color: "gray",
    departments: ["Pulmonary Function", "Audiometry", "Endoscopy", "Biopsy", "Other"],
  },
}

// Mock data for all types of tests/services
const mockServices = [
  // Laboratory Tests
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P001",
    age: 45,
    serviceName: "Complete Blood Count",
    serviceCode: "CBC",
    serviceType: "laboratory",
    department: "Hematology",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "30 mins",
    notes: "Check for anemia and infection markers",
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P002",
    age: 32,
    serviceName: "Liver Function Test",
    serviceCode: "LFT",
    serviceType: "laboratory",
    department: "Biochemistry",
    prescribedBy: "Dr. Johnson",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "45 mins",
    technician: "Tech. Patel",
    notes: "Elevated enzymes in previous test",
  },
  // Radiology Tests
  {
    id: "RAD001",
    patientName: "Mike Wilson",
    patientId: "P003",
    age: 28,
    serviceName: "Chest X-Ray",
    serviceCode: "CXR",
    serviceType: "radiology",
    department: "X-Ray",
    prescribedBy: "Dr. Brown",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    dueDate: "2024-01-15",
    completedDate: "2024-01-15",
    estimatedDuration: "15 mins",
    technician: "Rad. Tech Kumar",
    notes: "Follow-up for pneumonia",
  },
  {
    id: "RAD002",
    patientName: "Sarah Davis",
    patientId: "P004",
    age: 55,
    serviceName: "Brain MRI",
    serviceCode: "MRI-BRAIN",
    serviceType: "radiology",
    department: "MRI",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "60 mins",
    notes: "Investigate headaches and dizziness",
  },
  // Cardiology Tests
  {
    id: "CAR001",
    patientName: "Robert Brown",
    patientId: "P005",
    age: 38,
    serviceName: "Electrocardiogram",
    serviceCode: "ECG",
    serviceType: "cardiology",
    department: "ECG",
    prescribedBy: "Dr. Davis",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "20 mins",
    technician: "Cardiac Tech Singh",
    notes: "Chest pain evaluation",
  },
  {
    id: "CAR002",
    patientName: "Lisa Anderson",
    patientId: "P006",
    age: 42,
    serviceName: "Echocardiogram",
    serviceCode: "ECHO",
    serviceType: "cardiology",
    department: "Echo",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    dueDate: "2024-01-15",
    completedDate: "2024-01-15",
    estimatedDuration: "45 mins",
    technician: "Echo Tech Patel",
    notes: "Routine cardiac assessment",
  },
  // Neurology Tests
  {
    id: "NEU001",
    patientName: "David Garcia",
    patientId: "P007",
    age: 35,
    serviceName: "Electroencephalogram",
    serviceCode: "EEG",
    serviceType: "neurology",
    department: "EEG",
    prescribedBy: "Dr. Thompson",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "90 mins",
    notes: "Seizure evaluation",
  },
  // Ophthalmology Tests
  {
    id: "OPH001",
    patientName: "Maria Rodriguez",
    patientId: "P008",
    age: 60,
    serviceName: "Optical Coherence Tomography",
    serviceCode: "OCT",
    serviceType: "ophthalmology",
    department: "OCT",
    prescribedBy: "Dr. Lee",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "30 mins",
    technician: "Ophthalmic Tech Wilson",
    notes: "Diabetic retinopathy screening",
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Get available departments based on selected service type
  const getAvailableDepartments = () => {
    if (serviceTypeFilter === "all") {
      return Object.values(serviceTypes).flatMap((type) => type.departments)
    }
    return serviceTypes[serviceTypeFilter as keyof typeof serviceTypes]?.departments || []
  }

  // Filter services based on search and filters
  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || service.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || service.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesServiceType = serviceTypeFilter === "all" || service.serviceType === serviceTypeFilter
    const matchesDepartment = departmentFilter === "all" || service.department === departmentFilter
    const matchesTab = activeTab === "all" || service.status.toLowerCase().replace(" ", "") === activeTab.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesServiceType && matchesDepartment && matchesTab
  })

  // Get counts for overview cards
  const pendingCount = mockServices.filter((service) => service.status === "Pending").length
  const inProgressCount = mockServices.filter((service) => service.status === "In Progress").length
  const completedCount = mockServices.filter((service) => service.status === "Completed").length

  // Get service type statistics
  const serviceTypeStats = Object.keys(serviceTypes).map((type) => ({
    type,
    count: mockServices.filter((service) => service.serviceType === type).length,
    ...serviceTypes[type as keyof typeof serviceTypes],
  }))

  const handleStartService = (serviceId: string, serviceName: string, patientName: string) => {
    toast({
      title: "Service Started",
      description: `${serviceName} for ${patientName} has been started.`,
      duration: 4000,
    })
  }

  const handleCompleteService = (serviceId: string, serviceName: string, patientName: string) => {
    toast({
      title: "Service Completed",
      description: `${serviceName} for ${patientName} has been completed. Results can now be entered.`,
      duration: 4000,
    })
  }

  const handleViewResults = (serviceId: string, serviceName: string, patientName: string) => {
    toast({
      title: "View Results",
      description: `Opening results for ${serviceName} - ${patientName}`,
      duration: 3000,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <TestTube className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    return priority === "Urgent" ? (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Urgent
      </Badge>
    ) : (
      <Badge variant="outline">Routine</Badge>
    )
  }

  const getServiceTypeBadge = (serviceType: string) => {
    const type = serviceTypes[serviceType as keyof typeof serviceTypes]
    if (!type) return <Badge variant="outline">{serviceType}</Badge>

    const Icon = type.icon
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      green: "bg-green-100 text-green-800",
      amber: "bg-amber-100 text-amber-800",
      gray: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge variant="secondary" className={colorClasses[type.color as keyof typeof colorClasses]}>
        <Icon className="w-3 h-3 mr-1" />
        {type.name}
      </Badge>
    )
  }

  const getActionButton = (service: any) => {
    switch (service.status) {
      case "Pending":
        return (
          <Button
            size="sm"
            onClick={() => handleStartService(service.id, service.serviceName, service.patientName)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start
          </Button>
        )
      case "In Progress":
        return (
          <Button
            size="sm"
            onClick={() => handleCompleteService(service.id, service.serviceName, service.patientName)}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete
          </Button>
        )
      case "Completed":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewResults(service.id, service.serviceName, service.patientName)}
          >
            View
          </Button>
        )
      default:
        return null
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setServiceTypeFilter("all")
    setDepartmentFilter("all")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Medical Services</h2>
        <div className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Multi-Department Service Dashboard</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Services</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TestTube className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Results available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Stethoscope className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{mockServices.length}</div>
            <p className="text-xs text-muted-foreground">All departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Type Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Service Types Overview</CardTitle>
          <CardDescription>Distribution of services across different departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {serviceTypeStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.type} className="flex items-center space-x-2 p-2 rounded-lg border">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{stat.name}</div>
                    <div className="text-lg font-bold">{stat.count}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Services</CardTitle>
          <CardDescription>Search and filter medical services across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, service, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(serviceTypes).map(([key, type]) => (
                  <SelectItem key={key} value={key}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {getAvailableDepartments().map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={clearAllFilters} className="w-full md:w-auto bg-transparent">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Services</CardTitle>
          <CardDescription>Manage medical services across all departments and specialties</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Services ({mockServices.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="inprogress">In Progress ({inProgressCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Service Details</TableHead>
                      <TableHead>Type & Department</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No services found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.patientId} • Age {service.age}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.serviceName}</div>
                              <div className="text-sm text-muted-foreground">{service.serviceCode}</div>
                              {service.estimatedDuration && (
                                <div className="text-xs text-muted-foreground">
                                  Duration: {service.estimatedDuration}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getServiceTypeBadge(service.serviceType)}
                              <div className="text-sm text-muted-foreground">{service.department}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{service.prescribedBy}</div>
                              {service.technician && (
                                <div className="text-xs text-muted-foreground">Tech: {service.technician}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">Prescribed: {service.prescribedDate}</div>
                              <div className="text-sm text-muted-foreground">Due: {service.dueDate}</div>
                              {service.completedDate && (
                                <div className="text-sm text-green-600">Completed: {service.completedDate}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(service.priority)}</TableCell>
                          <TableCell>{getStatusBadge(service.status)}</TableCell>
                          <TableCell>{getActionButton(service)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
