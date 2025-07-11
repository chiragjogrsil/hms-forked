"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  TestTube,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Filter,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Department configuration with detailed information
const departments = {
  laboratory: {
    name: "Laboratory",
    icon: TestTube,
    color: "blue",
    description: "Blood tests, urine analysis, and diagnostic testing",
    services: [
      "Complete Blood Count",
      "Liver Function Test",
      "Kidney Function Test",
      "Lipid Profile",
      "Thyroid Function",
      "Blood Sugar",
      "Urine Analysis",
      "Stool Analysis",
    ],
    staff: 12,
    avgWaitTime: "15 mins",
  },
  radiology: {
    name: "Radiology",
    icon: Camera,
    color: "purple",
    description: "Medical imaging and diagnostic scans",
    services: ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Mammography", "Bone Density", "Nuclear Medicine"],
    staff: 8,
    avgWaitTime: "25 mins",
  },
  cardiology: {
    name: "Cardiology",
    icon: Heart,
    color: "red",
    description: "Heart and cardiovascular system diagnostics",
    services: ["ECG", "Echocardiogram", "Stress Test", "Holter Monitor", "Cardiac Catheterization", "Angiography"],
    staff: 6,
    avgWaitTime: "20 mins",
  },
  neurology: {
    name: "Neurology",
    icon: Brain,
    color: "green",
    description: "Nervous system and brain diagnostics",
    services: ["EEG", "EMG", "Nerve Conduction", "Sleep Study", "Neuropsychological Testing", "Brain Mapping"],
    staff: 4,
    avgWaitTime: "30 mins",
  },
  ophthalmology: {
    name: "Ophthalmology",
    icon: Eye,
    color: "amber",
    description: "Eye examinations and vision testing",
    services: ["Visual Field Test", "OCT", "Fundus Photography", "Tonometry", "Refraction", "Color Vision Test"],
    staff: 5,
    avgWaitTime: "18 mins",
  },
  general: {
    name: "General Services",
    icon: Stethoscope,
    color: "gray",
    description: "General medical procedures and tests",
    services: ["Pulmonary Function", "Audiometry", "Endoscopy", "Biopsy", "Vaccination", "Health Checkup"],
    staff: 10,
    avgWaitTime: "12 mins",
  },
}

// Enhanced mock data with more realistic department distribution
const mockServices = [
  // Laboratory Tests
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P001",
    age: 45,
    serviceName: "Complete Blood Count",
    serviceCode: "CBC",
    department: "laboratory",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "30 mins",
    notes: "Check for anemia and infection markers",
    technician: null,
    room: "Lab-A1",
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P002",
    age: 32,
    serviceName: "Liver Function Test",
    serviceCode: "LFT",
    department: "laboratory",
    prescribedBy: "Dr. Johnson",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "45 mins",
    technician: "Tech. Patel",
    notes: "Elevated enzymes in previous test",
    room: "Lab-B2",
  },
  {
    id: "LAB003",
    patientName: "Michael Brown",
    patientId: "P009",
    age: 28,
    serviceName: "Thyroid Function Test",
    serviceCode: "TFT",
    department: "laboratory",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    dueDate: "2024-01-15",
    completedDate: "2024-01-15",
    estimatedDuration: "25 mins",
    technician: "Tech. Kumar",
    notes: "Follow-up for hyperthyroidism",
    room: "Lab-A1",
  },
  // Radiology Tests
  {
    id: "RAD001",
    patientName: "Mike Wilson",
    patientId: "P003",
    age: 28,
    serviceName: "Chest X-Ray",
    serviceCode: "CXR",
    department: "radiology",
    prescribedBy: "Dr. Brown",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    dueDate: "2024-01-15",
    completedDate: "2024-01-15",
    estimatedDuration: "15 mins",
    technician: "Rad. Tech Kumar",
    notes: "Follow-up for pneumonia",
    room: "X-Ray Room 1",
  },
  {
    id: "RAD002",
    patientName: "Sarah Davis",
    patientId: "P004",
    age: 55,
    serviceName: "Brain MRI",
    serviceCode: "MRI-BRAIN",
    department: "radiology",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "60 mins",
    notes: "Investigate headaches and dizziness",
    room: "MRI Suite 1",
  },
  {
    id: "RAD003",
    patientName: "Emma Johnson",
    patientId: "P010",
    age: 42,
    serviceName: "Abdominal Ultrasound",
    serviceCode: "USG-ABD",
    department: "radiology",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "30 mins",
    technician: "Rad. Tech Singh",
    notes: "Abdominal pain evaluation",
    room: "Ultrasound Room 2",
  },
  // Cardiology Tests
  {
    id: "CAR001",
    patientName: "Robert Brown",
    patientId: "P005",
    age: 38,
    serviceName: "Electrocardiogram",
    serviceCode: "ECG",
    department: "cardiology",
    prescribedBy: "Dr. Davis",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "20 mins",
    technician: "Cardiac Tech Singh",
    notes: "Chest pain evaluation",
    room: "Cardio Room 1",
  },
  {
    id: "CAR002",
    patientName: "Lisa Anderson",
    patientId: "P006",
    age: 42,
    serviceName: "Echocardiogram",
    serviceCode: "ECHO",
    department: "cardiology",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    dueDate: "2024-01-15",
    completedDate: "2024-01-15",
    estimatedDuration: "45 mins",
    technician: "Echo Tech Patel",
    notes: "Routine cardiac assessment",
    room: "Echo Room 1",
  },
  // Neurology Tests
  {
    id: "NEU001",
    patientName: "David Garcia",
    patientId: "P007",
    age: 35,
    serviceName: "Electroencephalogram",
    serviceCode: "EEG",
    department: "neurology",
    prescribedBy: "Dr. Thompson",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "90 mins",
    notes: "Seizure evaluation",
    room: "Neuro Lab 1",
  },
  // Ophthalmology Tests
  {
    id: "OPH001",
    patientName: "Maria Rodriguez",
    patientId: "P008",
    age: 60,
    serviceName: "Optical Coherence Tomography",
    serviceCode: "OCT",
    department: "ophthalmology",
    prescribedBy: "Dr. Lee",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "In Progress",
    dueDate: "2024-01-15",
    estimatedDuration: "30 mins",
    technician: "Ophthalmic Tech Wilson",
    notes: "Diabetic retinopathy screening",
    room: "Eye Exam Room 2",
  },
  // General Services
  {
    id: "GEN001",
    patientName: "Alex Thompson",
    patientId: "P011",
    age: 25,
    serviceName: "Pulmonary Function Test",
    serviceCode: "PFT",
    department: "general",
    prescribedBy: "Dr. Adams",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
    estimatedDuration: "40 mins",
    notes: "Asthma evaluation",
    room: "PFT Room 1",
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Filter services based on search and filters
  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || service.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || service.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesDepartment = selectedDepartment === "all" || service.department === selectedDepartment
    const matchesTab = activeTab === "all" || service.status.toLowerCase().replace(" ", "") === activeTab.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment && matchesTab
  })

  // Get counts for overview cards
  const getStatusCount = (status: string) => {
    const filtered =
      selectedDepartment === "all" ? mockServices : mockServices.filter((s) => s.department === selectedDepartment)
    return filtered.filter((service) => service.status === status).length
  }

  const pendingCount = getStatusCount("Pending")
  const inProgressCount = getStatusCount("In Progress")
  const completedCount = getStatusCount("Completed")
  const totalCount =
    selectedDepartment === "all"
      ? mockServices.length
      : mockServices.filter((s) => s.department === selectedDepartment).length

  // Get department statistics
  const departmentStats = Object.entries(departments).map(([key, dept]) => ({
    key,
    ...dept,
    count: mockServices.filter((service) => service.department === key).length,
    pending: mockServices.filter((service) => service.department === key && service.status === "Pending").length,
    inProgress: mockServices.filter((service) => service.department === key && service.status === "In Progress").length,
    completed: mockServices.filter((service) => service.department === key && service.status === "Completed").length,
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

  const getDepartmentBadge = (departmentKey: string) => {
    const dept = departments[departmentKey as keyof typeof departments]
    if (!dept) return <Badge variant="outline">{departmentKey}</Badge>

    const Icon = dept.icon
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      green: "bg-green-100 text-green-800",
      amber: "bg-amber-100 text-amber-800",
      gray: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge variant="secondary" className={colorClasses[dept.color as keyof typeof colorClasses]}>
        <Icon className="w-3 h-3 mr-1" />
        {dept.name}
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
            View Results
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
    setSelectedDepartment("all")
  }

  const selectedDeptInfo =
    selectedDepartment !== "all" ? departments[selectedDepartment as keyof typeof departments] : null

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medical Services</h2>
          {selectedDeptInfo && (
            <p className="text-muted-foreground mt-1">
              {selectedDeptInfo.name} Department - {selectedDeptInfo.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {selectedDepartment === "all" ? "All Departments" : selectedDeptInfo?.name}
          </span>
        </div>
      </div>

      {/* Department Selection Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${selectedDepartment === "all" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setSelectedDepartment("all")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Departments</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockServices.length}</div>
            <p className="text-xs text-muted-foreground">Total Services</p>
          </CardContent>
        </Card>

        {departmentStats.map((dept) => {
          const Icon = dept.icon
          const isSelected = selectedDepartment === dept.key
          return (
            <Card
              key={dept.key}
              className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedDepartment(dept.key)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dept.count}</div>
                <p className="text-xs text-muted-foreground">
                  {dept.pending}P • {dept.inProgress}IP • {dept.completed}C
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Overview Cards for Selected Department */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
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
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Stethoscope className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              {selectedDepartment === "all" ? "All departments" : selectedDeptInfo?.name}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Department Info Card (when specific department is selected) */}
      {selectedDeptInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedDeptInfo.icon className="h-5 w-5" />
              {selectedDeptInfo.name} Department
            </CardTitle>
            <CardDescription>{selectedDeptInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Staff</div>
                  <div className="text-lg font-bold">{selectedDeptInfo.staff}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Avg Wait Time</div>
                  <div className="text-lg font-bold">{selectedDeptInfo.avgWaitTime}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TestTube className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Services Available</div>
                  <div className="text-lg font-bold">{selectedDeptInfo.services.length}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Available Services:</div>
              <div className="flex flex-wrap gap-1">
                {selectedDeptInfo.services.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Services</CardTitle>
          <CardDescription>
            Search and filter services
            {selectedDepartment !== "all" && ` in ${selectedDeptInfo?.name} department`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
            <Button variant="outline" onClick={clearAllFilters} className="bg-transparent">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDepartment === "all" ? "All Medical Services" : `${selectedDeptInfo?.name} Services`}
          </CardTitle>
          <CardDescription>
            Manage and track service requests
            {selectedDepartment !== "all" && ` for ${selectedDeptInfo?.name} department`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
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
                      <TableHead>Department</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Schedule</TableHead>
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
                              {service.room && (
                                <div className="text-xs text-muted-foreground">Room: {service.room}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getDepartmentBadge(service.department)}
                              {service.technician && (
                                <div className="text-xs text-muted-foreground">Tech: {service.technician}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{service.prescribedBy}</div>
                            <div className="text-xs text-muted-foreground">{service.estimatedDuration}</div>
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
