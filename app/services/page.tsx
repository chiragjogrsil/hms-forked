"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, CheckCircle2, Eye, Plus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

// Mock data for lab tests across all patients
const mockLabTests = [
  {
    id: "test-001",
    patientId: "PAT-001",
    patientName: "John Doe",
    patientAge: 45,
    testName: "Complete Blood Count",
    testCode: "CBC",
    prescribedBy: "Dr. Sharma",
    prescribedDate: "2024-01-15",
    priority: "urgent",
    status: "pending",
    department: "Hematology",
    estimatedTime: "30 mins",
    notes: "Check for anemia and infection markers",
    visitId: "visit-001",
  },
  {
    id: "test-002",
    patientId: "PAT-002",
    patientName: "Jane Smith",
    patientAge: 32,
    testName: "Lipid Profile",
    testCode: "LIPID",
    prescribedBy: "Dr. Gupta",
    prescribedDate: "2024-01-14",
    priority: "routine",
    status: "in-progress",
    department: "Biochemistry",
    estimatedTime: "45 mins",
    notes: "Follow-up for cholesterol management",
    visitId: "visit-002",
    startedAt: "2024-01-15T09:30:00",
    technician: "Tech. Patel",
  },
  {
    id: "test-003",
    patientId: "PAT-003",
    patientName: "Mike Johnson",
    patientAge: 28,
    testName: "HbA1c",
    testCode: "HBA1C",
    prescribedBy: "Dr. Kumar",
    prescribedDate: "2024-01-13",
    priority: "routine",
    status: "completed",
    department: "Biochemistry",
    estimatedTime: "20 mins",
    notes: "Diabetes monitoring",
    visitId: "visit-003",
    completedAt: "2024-01-14T14:20:00",
    technician: "Tech. Singh",
    result: "Normal",
  },
  {
    id: "test-004",
    patientId: "PAT-004",
    patientName: "Sarah Wilson",
    patientAge: 55,
    testName: "Liver Function Test",
    testCode: "LFT",
    prescribedBy: "Dr. Patel",
    prescribedDate: "2024-01-15",
    priority: "urgent",
    status: "pending",
    department: "Biochemistry",
    estimatedTime: "40 mins",
    notes: "Elevated liver enzymes in previous test",
    visitId: "visit-004",
  },
  {
    id: "test-005",
    patientId: "PAT-005",
    patientName: "Robert Brown",
    patientAge: 38,
    testName: "Thyroid Function Test",
    testCode: "TFT",
    prescribedBy: "Dr. Sharma",
    prescribedDate: "2024-01-12",
    priority: "routine",
    status: "completed",
    department: "Endocrinology",
    estimatedTime: "35 mins",
    notes: "Regular thyroid monitoring",
    visitId: "visit-005",
    completedAt: "2024-01-13T11:45:00",
    technician: "Tech. Kumar",
    result: "Abnormal",
  },
]

type LabTest = (typeof mockLabTests)[0]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const getStatusBadge = (status: string, priority?: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            className={`${priority === "urgent" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"} hover:bg-current`}
          >
            {priority === "urgent" ? "Urgent Pending" : "Pending"}
          </Badge>
        )
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    return priority === "urgent" ? (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Routine</Badge>
    )
  }

  const handleStartTest = (testId: string) => {
    console.log("Starting test:", testId)
    // In a real app, this would update the test status to "in-progress"
  }

  const handleCompleteTest = (testId: string) => {
    console.log("Completing test:", testId)
    // In a real app, this would open a modal to enter results and complete the test
  }

  const handleViewResults = (testId: string) => {
    console.log("Viewing results for test:", testId)
    // In a real app, this would open the test results
  }

  const filteredTests = mockLabTests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    const matchesPriority = priorityFilter === "all" || test.priority === priorityFilter
    const matchesDepartment = departmentFilter === "all" || test.department === departmentFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
  })

  const pendingTests = filteredTests.filter((test) => test.status === "pending")
  const inProgressTests = filteredTests.filter((test) => test.status === "in-progress")
  const completedTests = filteredTests.filter((test) => test.status === "completed")

  const columns: ColumnDef<LabTest>[] = [
    {
      accessorKey: "patientName",
      header: "Patient",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.patientName}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.patientId} • Age {row.original.patientAge}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "testName",
      header: "Test",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.testName}</div>
          <div className="text-sm text-muted-foreground">{row.original.testCode}</div>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "prescribedBy",
      header: "Prescribed By",
    },
    {
      accessorKey: "prescribedDate",
      header: "Date",
      cell: ({ row }) => new Date(row.original.prescribedDate).toLocaleDateString(),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status, row.original.priority),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const test = row.original
        return (
          <div className="flex items-center gap-2">
            {test.status === "pending" && (
              <Button size="sm" onClick={() => handleStartTest(test.id)}>
                <Plus className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}
            {test.status === "in-progress" && (
              <Button size="sm" onClick={() => handleCompleteTest(test.id)}>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            {test.status === "completed" && (
              <Button size="sm" variant="outline" onClick={() => handleViewResults(test.id)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laboratory Services</h1>
          <p className="text-muted-foreground">Manage lab tests across all patients</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {pendingTests.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {inProgressTests.length} In Progress
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {completedTests.length} Completed Today
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Hematology">Hematology</SelectItem>
                <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                <SelectItem value="Endocrinology">Endocrinology</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPriorityFilter("all")
                setDepartmentFilter("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tests ({filteredTests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTests.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressTests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Laboratory Tests</CardTitle>
              <CardDescription>Complete list of all lab tests across patients</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={filteredTests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tests</CardTitle>
              <CardDescription>Tests that need to be started</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={pendingTests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card>
            <CardHeader>
              <CardTitle>Tests In Progress</CardTitle>
              <CardDescription>Currently running tests</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={inProgressTests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
              <CardDescription>Tests completed today</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={completedTests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
