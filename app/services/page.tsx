"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TestTube, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for lab tests across all patients
const mockLabTests = [
  {
    id: "LT001",
    patientName: "John Doe",
    patientId: "P001",
    age: 45,
    testName: "Complete Blood Count",
    testCode: "CBC",
    department: "Hematology",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
  },
  {
    id: "LT002",
    patientName: "Jane Smith",
    patientId: "P002",
    age: 32,
    testName: "Liver Function Test",
    testCode: "LFT",
    department: "Biochemistry",
    prescribedBy: "Dr. Johnson",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2024-01-15",
  },
  {
    id: "LT003",
    patientName: "Mike Wilson",
    patientId: "P003",
    age: 28,
    testName: "Thyroid Function Test",
    testCode: "TFT",
    department: "Endocrinology",
    prescribedBy: "Dr. Brown",
    prescribedDate: "2024-01-14",
    priority: "Routine",
    status: "Completed",
    dueDate: "2024-01-15",
    completedDate: "2024-01-15",
  },
  {
    id: "LT004",
    patientName: "Sarah Davis",
    patientId: "P004",
    age: 55,
    testName: "Lipid Profile",
    testCode: "LP",
    department: "Biochemistry",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-15",
    priority: "Routine",
    status: "Pending",
    dueDate: "2024-01-16",
  },
  {
    id: "LT005",
    patientName: "Robert Brown",
    patientId: "P005",
    age: 38,
    testName: "Blood Glucose",
    testCode: "BG",
    department: "Biochemistry",
    prescribedBy: "Dr. Davis",
    prescribedDate: "2024-01-15",
    priority: "Urgent",
    status: "In Progress",
    dueDate: "2024-01-15",
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Filter tests based on search and filters
  const filteredTests = mockLabTests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || test.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || test.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesDepartment =
      departmentFilter === "all" || test.department.toLowerCase() === departmentFilter.toLowerCase()
    const matchesTab = activeTab === "all" || test.status.toLowerCase().replace(" ", "") === activeTab.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment && matchesTab
  })

  // Get counts for overview cards
  const pendingCount = mockLabTests.filter((test) => test.status === "Pending").length
  const inProgressCount = mockLabTests.filter((test) => test.status === "In Progress").length
  const completedCount = mockLabTests.filter((test) => test.status === "Completed").length

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
      description: `${testName} for ${patientName} has been completed. Results can now be entered.`,
      duration: 4000,
    })
  }

  const handleViewResults = (testId: string, testName: string, patientName: string) => {
    toast({
      title: "View Results",
      description: `Opening results for ${testName} - ${patientName}`,
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

  const getActionButton = (test: any) => {
    switch (test.status) {
      case "Pending":
        return (
          <Button
            size="sm"
            onClick={() => handleStartTest(test.id, test.testName, test.patientName)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start
          </Button>
        )
      case "In Progress":
        return (
          <Button
            size="sm"
            onClick={() => handleCompleteTest(test.id, test.testName, test.patientName)}
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
            onClick={() => handleViewResults(test.id, test.testName, test.patientName)}
          >
            View
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Laboratory Services</h2>
        <div className="flex items-center space-x-2">
          <TestTube className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Lab Technician Dashboard</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
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
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Tests</CardTitle>
          <CardDescription>Search and filter laboratory tests across all patients</CardDescription>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
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
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="hematology">Hematology</SelectItem>
                <SelectItem value="biochemistry">Biochemistry</SelectItem>
                <SelectItem value="endocrinology">Endocrinology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratory Tests</CardTitle>
          <CardDescription>Manage laboratory tests across all patients</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Tests ({mockLabTests.length})</TabsTrigger>
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
                      <TableHead>Test Details</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                            </div>
                          </TableCell>
                          <TableCell>{test.department}</TableCell>
                          <TableCell>{test.prescribedBy}</TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">Prescribed: {test.prescribedDate}</div>
                              <div className="text-sm text-muted-foreground">Due: {test.dueDate}</div>
                              {test.completedDate && (
                                <div className="text-sm text-green-600">Completed: {test.completedDate}</div>
                              )}
                            </div>
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
