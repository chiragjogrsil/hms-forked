"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TestDetailModal } from "@/components/modals/test-detail-modal"
import {
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  Play,
  CheckCircle,
  MoreHorizontal,
  TestTube,
  Scan,
  Activity,
  Leaf,
  Download,
  Eye,
  CreditCard,
  AlertCircle,
} from "lucide-react"

// Mock data for demonstration
const mockPathologyTests = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P001",
    age: 45,
    gender: "Male",
    phone: "+91 9876543210",
    testName: "Complete Blood Count",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2024-01-15",
    status: "pending",
    priority: "routine",
    indication: "Routine checkup",
    sampleType: "Blood",
    paymentStatus: "paid",
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P002",
    age: 32,
    gender: "Female",
    phone: "+91 9876543211",
    testName: "Liver Function Test",
    prescribedBy: "Dr. Johnson",
    prescribedDate: "2024-01-15",
    status: "in-progress",
    priority: "urgent",
    indication: "Elevated enzymes",
    sampleType: "Blood",
    paymentStatus: "pending",
  },
  {
    id: "LAB003",
    patientName: "Mike Wilson",
    patientId: "P003",
    age: 28,
    gender: "Male",
    phone: "+91 9876543212",
    testName: "Thyroid Profile",
    prescribedBy: "Dr. Brown",
    prescribedDate: "2024-01-14",
    status: "completed",
    priority: "routine",
    indication: "Fatigue symptoms",
    sampleType: "Blood",
    paymentStatus: "paid",
  },
]

const mockRadiologyTests = [
  {
    id: "RAD001",
    patientName: "Sarah Johnson",
    patientId: "P004",
    age: 55,
    gender: "Female",
    phone: "+91 9876543213",
    testName: "Chest X-Ray",
    prescribedBy: "Dr. Davis",
    prescribedDate: "2024-01-15",
    status: "pending",
    priority: "urgent",
    indication: "Chest pain",
    duration: "15 mins",
    paymentStatus: "partial",
  },
  {
    id: "RAD002",
    patientName: "Robert Brown",
    patientId: "P005",
    age: 42,
    gender: "Male",
    phone: "+91 9876543214",
    testName: "MRI Brain",
    prescribedBy: "Dr. Wilson",
    prescribedDate: "2024-01-15",
    status: "scheduled",
    priority: "emergency",
    indication: "Severe headache",
    duration: "45 mins",
    paymentStatus: "paid",
  },
]

const mockProcedures = [
  {
    id: "PROC001",
    patientName: "Lisa Anderson",
    patientId: "P006",
    age: 38,
    gender: "Female",
    phone: "+91 9876543215",
    testName: "Physiotherapy Session",
    prescribedBy: "Dr. Taylor",
    prescribedDate: "2024-01-15",
    status: "in-progress",
    priority: "routine",
    indication: "Lower back pain",
    sessions: "5/10",
    paymentStatus: "partial",
  },
]

const mockPanchkarma = [
  {
    id: "PAN001",
    patientName: "David Kumar",
    patientId: "P007",
    age: 50,
    gender: "Male",
    phone: "+91 9876543216",
    testName: "Abhyanga Massage",
    prescribedBy: "Dr. Sharma",
    prescribedDate: "2024-01-15",
    status: "pending",
    priority: "routine",
    indication: "Stress relief",
    sessions: "0/7",
    paymentStatus: "overdue",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    case "in-progress":
      return "bg-orange-100 text-orange-800"
    case "completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "emergency":
      return "bg-red-100 text-red-800"
    case "urgent":
      return "bg-orange-100 text-orange-800"
    case "routine":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "partial":
      return "bg-orange-100 text-orange-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"pathology" | "radiology" | "procedures" | "panchkarma">("pathology")

  const handleStartProcessing = (id: string) => {
    console.log("Starting processing for:", id)
  }

  const handleMarkComplete = (id: string) => {
    console.log("Marking complete:", id)
  }

  const handleCardClick = (test: any, type: "pathology" | "radiology" | "procedures" | "panchkarma") => {
    setSelectedTest(test)
    setModalType(type)
    setModalOpen(true)
  }

  const renderTestCard = (test: any, type: string) => (
    <Card
      key={test.id}
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleCardClick(test, type as any)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{test.testName}</h3>
              <Badge className={getPriorityColor(test.priority)}>{test.priority}</Badge>
              <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
              <Badge className={getPaymentStatusColor(test.paymentStatus)} variant="outline">
                <CreditCard className="h-3 w-3 mr-1" />
                {test.paymentStatus}
              </Badge>
              {test.paymentStatus === "overdue" && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{test.patientName}</p>
                  <p className="text-sm text-muted-foreground">ID: {test.patientId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">{test.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {test.age}Y, {test.gender}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Prescribed: {test.prescribedDate}</p>
                  <p className="text-sm text-muted-foreground">By: {test.prescribedBy}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Indication: {test.indication}</span>
              </div>
              {test.sampleType && (
                <div className="flex items-center gap-1">
                  <TestTube className="h-4 w-4" />
                  <span>Sample: {test.sampleType}</span>
                </div>
              )}
              {test.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {test.duration}</span>
                </div>
              )}
              {test.sessions && (
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>Sessions: {test.sessions}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {test.status === "pending" && test.paymentStatus !== "overdue" && (
              <Button
                size="sm"
                onClick={() => handleStartProcessing(test.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}

            {test.status === "in-progress" && (
              <Button size="sm" onClick={() => handleMarkComplete(test.id)} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}

            {test.paymentStatus === "overdue" && (
              <Button size="sm" variant="destructive">
                Payment Required
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCardClick(test, type as any)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Patient
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Details
                </DropdownMenuItem>
                {test.status === "completed" && (
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Services & Procedures</h1>
        <p className="text-muted-foreground">
          Manage all prescribed tests, procedures, and services across departments
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, test name, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Department Tabs */}
      <Tabs defaultValue="pathology" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pathology" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Pathology ({mockPathologyTests.length})
          </TabsTrigger>
          <TabsTrigger value="radiology" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Radiology ({mockRadiologyTests.length})
          </TabsTrigger>
          <TabsTrigger value="procedures" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Procedures ({mockProcedures.length})
          </TabsTrigger>
          <TabsTrigger value="panchkarma" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Panchkarma ({mockPanchkarma.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pathology" className="mt-6">
          <div className="space-y-4">{mockPathologyTests.map((test) => renderTestCard(test, "pathology"))}</div>
        </TabsContent>

        <TabsContent value="radiology" className="mt-6">
          <div className="space-y-4">{mockRadiologyTests.map((test) => renderTestCard(test, "radiology"))}</div>
        </TabsContent>

        <TabsContent value="procedures" className="mt-6">
          <div className="space-y-4">{mockProcedures.map((test) => renderTestCard(test, "procedures"))}</div>
        </TabsContent>

        <TabsContent value="panchkarma" className="mt-6">
          <div className="space-y-4">{mockPanchkarma.map((test) => renderTestCard(test, "panchkarma"))}</div>
        </TabsContent>
      </Tabs>

      {/* Test Detail Modal */}
      <TestDetailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} test={selectedTest} type={modalType} />
    </div>
  )
}
