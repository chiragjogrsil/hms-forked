"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Heart, Clock, CheckCircle, AlertCircle, Activity, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Cardiology-specific test data
const cardiacTests = [
  {
    id: "CAR001",
    patientName: "Robert Brown",
    patientId: "P005",
    age: 38,
    testName: "Electrocardiogram",
    testCode: "ECG",
    testType: "ECG",
    prescribedBy: "Dr. Davis",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    scheduledDate: "2024-01-15",
    scheduledTime: "2:00 PM",
    estimatedDuration: "20 mins",
    technician: "Cardiac Tech Singh",
    preparation: "No caffeine 2 hours before test",
    notes: "Chest pain evaluation",
  },
  {
    id: "CAR002",
    patientName: "Lisa Anderson",
    patientId: "P006",
    age: 42,
    testName: "Echocardiogram",
    testCode: "ECHO",
    testType: "Echo",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    scheduledDate: "2024-01-15",
    scheduledTime: "10:00 AM",
    completedDate: "2024-01-15",
    completedTime: "10:45 AM",
    estimatedDuration: "45 mins",
    technician: "Echo Tech Patel",
    cardiologist: "Dr. Kumar",
    preparation: "No special preparation required",
    notes: "Routine cardiac assessment",
  },
  {
    id: "CAR003",
    patientName: "David Garcia",
    patientId: "P007",
    age: 35,
    testName: "Stress Test",
    testCode: "STRESS",
    testType: "Stress Test",
    prescribedBy: "Dr. Thompson",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Scheduled",
    scheduledDate: "2024-01-16",
    scheduledTime: "9:00 AM",
    estimatedDuration: "60 mins",
    preparation: "Wear comfortable clothes, no caffeine 3 hours before",
    notes: "Exercise tolerance evaluation",
  },
  {
    id: "CAR004",
    patientName: "Maria Rodriguez",
    patientId: "P008",
    age: 60,
    testName: "Holter Monitor",
    testCode: "HOLTER",
    testType: "Holter Monitor",
    prescribedBy: "Dr. Lee",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Device Attached",
    scheduledDate: "2024-01-15",
    scheduledTime: "11:00 AM",
    estimatedDuration: "24-48 hours",
    technician: "Cardiac Tech Wilson",
    preparation: "Wear loose-fitting shirt",
    notes: "Arrhythmia monitoring",
    returnDate: "2024-01-17",
  },
  {
    id: "CAR005",
    patientName: "John Smith",
    patientId: "P009",
    age: 52,
    testName: "Cardiac Catheterization",
    testCode: "CATH",
    testType: "Catheterization",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-14",
    priority: "Urgent",
    status: "Pre-procedure",
    scheduledDate: "2024-01-16",
    scheduledTime: "8:00 AM",
    estimatedDuration: "90 mins",
    cardiologist: "Dr. Kumar",
    preparation: "NPO after midnight, stop blood thinners",
    notes: "Coronary artery evaluation",
  },
]

export default function CardiologyServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [testTypeFilter, setTestTypeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Filter tests based on search and filters
  const filteredTests = cardiacTests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || test.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || test.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesTestType = testTypeFilter === "all" || test.testType === testTypeFilter
    const matchesTab = activeTab === "all" || test.status.toLowerCase().replace(" ", "") === activeTab.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesTestType && matchesTab
  })

  // Get counts for overview cards
  const scheduledCount = cardiacTests.filter((test) => test.status === "Scheduled").length
  const inProgressCount = cardiacTests.filter((test) => test.status === "In Progress").length
  const completedCount = cardiacTests.filter((test) => test.status === "Completed").length
  const deviceAttachedCount = cardiacTests.filter((test) => test.status === "Device Attached").length
  const preProcedureCount = cardiacTests.filter((test) => test.status === "Pre-procedure").length

  const handleStartTest = (testId: string, testName: string, patientName: string) => {
    toast({
      title: "Test Started",
      description: `${testName} for ${patientName} has been started.`,
      duration: 4000,
    })
  }

  const handleCompleteTest = (testId: string, testName: string, patientName: string) => {
    toast({
      title: "Test Completed",
      description: `${testName} for ${patientName} has been completed. Results are ready for review.`,
      duration: 4000,
    })
  }

  const handleViewResults = (testId: string, testName: string, patientName: string) => {
    toast({
      title: "View Results",
      description: `Opening cardiac results for ${testName} - ${patientName}`,
      duration: 3000,
    })
  }

  const handleAttachDevice = (testId: string, testName: string, patientName: string) => {
    toast({
      title: "Device Attached",
      description: `${testName} device attached to ${patientName}. Monitoring started.`,
      duration: 4000,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Activity className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Device Attached":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Zap className="w-3 h-3 mr-1" />
            Device Attached
          </Badge>
        )
      case "Pre-procedure":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pre-procedure
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

  const getActionButton = (test: any) => {
    switch (test.status) {
      case "Scheduled":
        if (test.testType === "Holter Monitor") {
          return (
            <Button
              size="sm"
              onClick={() => handleAttachDevice(test.id, test.testName, test.patientName)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Attach Device
            </Button>
          )
        }
        return (
          <Button
            size="sm"
            onClick={() => handleStartTest(test.id, test.testName, test.patientName)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Test
          </Button>
        )
      case "In Progress":
      case "Device Attached":
        return (
          <Button
            size="sm"
            onClick={() => handleCompleteTest(test.id, test.testName, test.patientName)}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete
          </Button>
        )
      case "Pre-procedure":
        return (
          <Button
            size="sm"
            onClick={() => handleStartTest(test.id, test.testName, test.patientName)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Begin Procedure
          </Button>
        )
      case "Completed":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewResults(test.id, test.testName, test.patientName)}
          >
            View Results
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cardiology Services</h2>
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Cardiac Technician Dashboard</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Currently testing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Attached</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{deviceAttachedCount}</div>
            <p className="text-xs text-muted-foreground">Monitoring active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pre-procedure</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{preProcedureCount}</div>
            <p className="text-xs text-muted-foreground">Preparing for procedure</p>
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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Cardiac Tests</CardTitle>
          <CardDescription>Search and filter cardiology tests and procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, test name, or patient ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="deviceattached">Device Attached</SelectItem>
                <SelectItem value="pre-procedure">Pre-procedure</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Test Types</SelectItem>
                <SelectItem value="ECG">ECG</SelectItem>
                <SelectItem value="Echo">Echocardiogram</SelectItem>
                <SelectItem value="Stress Test">Stress Test</SelectItem>
                <SelectItem value="Holter Monitor">Holter Monitor</SelectItem>
                <SelectItem value="Catheterization">Catheterization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Cardiac Tests</CardTitle>
          <CardDescription>Manage cardiology workflow from scheduling to results interpretation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({cardiacTests.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledCount})</TabsTrigger>
              <TabsTrigger value="inprogress">In Progress ({inProgressCount})</TabsTrigger>
              <TabsTrigger value="deviceattached">Device ({deviceAttachedCount})</TabsTrigger>
              <TabsTrigger value="pre-procedure">Pre-proc ({preProcedureCount})</TabsTrigger>
              <TabsTrigger value="completed">Complete ({completedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test Details</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Preparation</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No tests found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{test.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {test.patientId} • Age {test.age}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{test.testName}</div>
                              <div className="text-sm text-muted-foreground">{test.testCode}</div>
                              <div className="text-xs text-muted-foreground">Duration: {test.estimatedDuration}</div>
                              {test.notes && <div className="text-xs text-muted-foreground mt-1">{test.notes}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {test.testType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{test.prescribedBy}</div>
                              {test.technician && (
                                <div className="text-xs text-muted-foreground">Tech: {test.technician}</div>
                              )}
                              {test.cardiologist && (
                                <div className="text-xs text-muted-foreground">Card: {test.cardiologist}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{test.scheduledDate}</div>
                              <div className="text-sm text-muted-foreground">{test.scheduledTime}</div>
                              {test.completedDate && (
                                <div className="text-sm text-green-600">
                                  Done: {test.completedDate} {test.completedTime}
                                </div>
                              )}
                              {test.returnDate && (
                                <div className="text-sm text-blue-600">Return: {test.returnDate}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-muted-foreground max-w-[150px]">{test.preparation}</div>
                          </TableCell>
                          <TableCell>{getPriorityBadge(test.priority)}</TableCell>
                          <TableCell>{getStatusBadge(test.status)}</TableCell>
                          <TableCell>{getActionButton(test)}</TableCell>
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
