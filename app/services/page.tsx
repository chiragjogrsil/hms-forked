"use client"

import { useState } from "react"
import {
  Search,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  TestTube,
  Upload,
  Play,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock data for lab test services with 4-stage workflow
const labTestsData = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Complete Blood Count",
    department: "Laboratory",
    requestedBy: "Dr. Smith",
    priority: "High",
    status: "Sample Collected",
    scheduledTime: "10:30 AM",
    collectionTime: "10:35 AM",
    notes: "Fasting required - Patient fasted for 12 hours",
    technician: "Tech. Sarah",
    sampleType: "Blood",
    testCode: "CBC001",
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P12346",
    serviceName: "Lipid Profile",
    department: "Laboratory",
    requestedBy: "Dr. Johnson",
    priority: "Medium",
    status: "Testing Started",
    scheduledTime: "9:00 AM",
    collectionTime: "9:05 AM",
    testingStartTime: "9:30 AM",
    notes: "12-hour fasting confirmed",
    technician: "Tech. Mike",
    sampleType: "Blood",
    testCode: "LIP001",
  },
  {
    id: "LAB003",
    patientName: "Mike Wilson",
    patientId: "P12347",
    serviceName: "Thyroid Function Test",
    department: "Laboratory",
    requestedBy: "Dr. Brown",
    priority: "Low",
    status: "Testing Completed",
    scheduledTime: "8:30 AM",
    collectionTime: "8:35 AM",
    testingStartTime: "9:00 AM",
    testingCompletedTime: "10:15 AM",
    notes: "No special preparation required",
    technician: "Tech. Sarah",
    sampleType: "Blood",
    testCode: "TFT001",
  },
  {
    id: "LAB004",
    patientName: "Sarah Davis",
    patientId: "P12348",
    serviceName: "Liver Function Test",
    department: "Laboratory",
    requestedBy: "Dr. Wilson",
    priority: "High",
    status: "Reports Uploaded",
    scheduledTime: "11:00 AM",
    collectionTime: "11:05 AM",
    testingStartTime: "11:30 AM",
    testingCompletedTime: "12:45 PM",
    reportUploadTime: "1:15 PM",
    notes: "Abnormal values detected - flagged for review",
    technician: "Tech. Mike",
    sampleType: "Blood",
    testCode: "LFT001",
    reportUrl: "/reports/lft-001.pdf",
  },
  {
    id: "LAB005",
    patientName: "Robert Johnson",
    patientId: "P12349",
    serviceName: "Urine Analysis",
    department: "Laboratory",
    requestedBy: "Dr. Lee",
    priority: "Medium",
    status: "Sample Collected",
    scheduledTime: "2:00 PM",
    collectionTime: "2:10 PM",
    notes: "Mid-stream sample collected",
    technician: "Tech. Sarah",
    sampleType: "Urine",
    testCode: "UA001",
  },
  {
    id: "LAB006",
    patientName: "Emily Brown",
    patientId: "P12350",
    serviceName: "Blood Sugar (Random)",
    department: "Laboratory",
    requestedBy: "Dr. Kumar",
    priority: "High",
    status: "Testing Started",
    scheduledTime: "3:30 PM",
    collectionTime: "3:35 PM",
    testingStartTime: "3:45 PM",
    notes: "Patient had lunch 2 hours ago",
    technician: "Tech. Mike",
    sampleType: "Blood",
    testCode: "BSR001",
  },
]

// Other services (non-lab) for comparison
const otherServicesData = [
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
  const [selectedDepartment, setSelectedDepartment] = useState("laboratory") // Default to laboratory
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [viewMode, setViewMode] = useState("cards")

  // State for action dialog
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    service: any
    action: string
    title: string
    description: string
  }>({
    open: false,
    service: null,
    action: "",
    title: "",
    description: "",
  })

  const [actionNotes, setActionNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Combine all services data
  const allServicesData = [...labTestsData, ...otherServicesData]

  const filteredServices = allServicesData.filter((service) => {
    const matchesDepartment = selectedDepartment === "all" || service.department.toLowerCase() === selectedDepartment
    const matchesSearch =
      service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (statusFilter !== "all") {
      if (selectedDepartment === "laboratory") {
        // Lab-specific status filtering
        matchesStatus = service.status.toLowerCase().replace(" ", "-") === statusFilter
      } else {
        // General status filtering for other departments
        matchesStatus = service.status.toLowerCase().replace(" ", "-") === statusFilter
      }
    }

    const matchesPriority = priorityFilter === "all" || service.priority.toLowerCase() === priorityFilter

    return matchesDepartment && matchesSearch && matchesStatus && matchesPriority
  })

  const getLabStatusIcon = (status: string) => {
    switch (status) {
      case "Sample Collected":
        return <TestTube className="h-4 w-4 text-blue-500" />
      case "Testing Started":
        return <Play className="h-4 w-4 text-orange-500" />
      case "Testing Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Reports Uploaded":
        return <Upload className="h-4 w-4 text-purple-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string, department: string) => {
    if (department === "Laboratory") {
      return getLabStatusIcon(status)
    }

    // General status icons for other departments
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

  const getLabStatusColor = (status: string) => {
    switch (status) {
      case "Sample Collected":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Testing Started":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Testing Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Reports Uploaded":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string, department: string) => {
    if (department === "Laboratory") {
      return getLabStatusColor(status)
    }

    // General status colors for other departments
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

  const getNextAction = (status: string) => {
    switch (status) {
      case "Sample Collected":
        return {
          action: "start-testing",
          label: "Start Testing",
          icon: <Play className="h-4 w-4" />,
          color: "bg-orange-500 hover:bg-orange-600",
        }
      case "Testing Started":
        return {
          action: "complete-testing",
          label: "Complete Testing",
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-500 hover:bg-green-600",
        }
      case "Testing Completed":
        return {
          action: "upload-report",
          label: "Upload Report",
          icon: <Upload className="h-4 w-4" />,
          color: "bg-purple-500 hover:bg-purple-600",
        }
      case "Reports Uploaded":
        return null // No further action needed
      default:
        return null
    }
  }

  const handleActionClick = (service: any, actionType: string) => {
    const actionConfig = {
      "start-testing": {
        title: "Start Testing",
        description: `Begin testing process for ${service.serviceName}`,
      },
      "complete-testing": {
        title: "Complete Testing",
        description: `Mark testing as completed for ${service.serviceName}`,
      },
      "upload-report": {
        title: "Upload Report",
        description: `Upload test report for ${service.serviceName}`,
      },
    }

    setActionDialog({
      open: true,
      service,
      action: actionType,
      title: actionConfig[actionType as keyof typeof actionConfig].title,
      description: actionConfig[actionType as keyof typeof actionConfig].description,
    })
    setActionNotes("")
  }

  const handleActionConfirm = async () => {
    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the service status
    const updatedStatus = {
      "start-testing": "Testing Started",
      "complete-testing": "Testing Completed",
      "upload-report": "Reports Uploaded",
    }[actionDialog.action]

    // In a real app, this would update the backend
    const serviceIndex = labTestsData.findIndex((s) => s.id === actionDialog.service.id)
    if (serviceIndex !== -1) {
      labTestsData[serviceIndex] = {
        ...labTestsData[serviceIndex],
        status: updatedStatus || labTestsData[serviceIndex].status,
        [`${actionDialog.action.replace("-", "")}Time`]: new Date().toLocaleTimeString(),
      }
    }

    setIsProcessing(false)
    setActionDialog({ open: false, service: null, action: "", title: "", description: "" })
  }

  const selectedDeptInfo = departments.find((dept) => dept.id === selectedDepartment)

  // Get lab-specific status options for filtering
  const getStatusOptions = () => {
    if (selectedDepartment === "laboratory") {
      return [
        { value: "all", label: "All Status" },
        { value: "sample-collected", label: "Sample Collected" },
        { value: "testing-started", label: "Testing Started" },
        { value: "testing-completed", label: "Testing Completed" },
        { value: "reports-uploaded", label: "Reports Uploaded" },
      ]
    } else {
      return [
        { value: "all", label: "All Status" },
        { value: "pending", label: "Pending" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "scheduled", label: "Scheduled" },
      ]
    }
  }

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
                {selectedDeptInfo.count} active services
                {selectedDepartment === "laboratory" && " • 4-stage workflow: Sample → Testing → Completed → Reports"}
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {getStatusOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {service.patientName} ({service.patientId})
                      </CardDescription>
                      {service.department === "Laboratory" && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div>Test Code: {service.testCode}</div>
                          <div>Sample: {service.sampleType}</div>
                          <div>Technician: {service.technician}</div>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {service.department === "Laboratory" && service.status === "Reports Uploaded" && (
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Add Notes</DropdownMenuItem>
                        <DropdownMenuItem>Print Label</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(service.status, service.department)} border`}>
                      {getStatusIcon(service.status, service.department)}
                      <span className="ml-1">{service.status}</span>
                    </Badge>
                    <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>
                  </div>

                  {/* Lab-specific timeline */}
                  {service.department === "Laboratory" && (
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-muted-foreground">Scheduled:</span>
                          <div className="font-medium">{service.scheduledTime}</div>
                        </div>
                        {service.collectionTime && (
                          <div>
                            <span className="text-muted-foreground">Collected:</span>
                            <div className="font-medium">{service.collectionTime}</div>
                          </div>
                        )}
                        {service.testingStartTime && (
                          <div>
                            <span className="text-muted-foreground">Testing:</span>
                            <div className="font-medium">{service.testingStartTime}</div>
                          </div>
                        )}
                        {service.reportUploadTime && (
                          <div>
                            <span className="text-muted-foreground">Report:</span>
                            <div className="font-medium">{service.reportUploadTime}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{service.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested by:</span>
                      <span className="font-medium">{service.requestedBy}</span>
                    </div>
                    {service.notes && (
                      <div className="pt-2 border-t">
                        <span className="text-muted-foreground text-xs">Notes: </span>
                        <span className="text-xs">{service.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button for Lab Tests */}
                  {service.department === "Laboratory" && getNextAction(service.status) && (
                    <div className="pt-2 border-t">
                      <Button
                        size="sm"
                        className={`w-full ${getNextAction(service.status)?.color} text-white`}
                        onClick={() => handleActionClick(service, getNextAction(service.status)?.action || "")}
                      >
                        {getNextAction(service.status)?.icon}
                        <span className="ml-2">{getNextAction(service.status)?.label}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Completed Lab Test - Show Report Available */}
                  {service.department === "Laboratory" && service.status === "Reports Uploaded" && (
                    <div className="pt-2 border-t">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Upload className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                    </div>
                  )}
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
                          {service.department === "Laboratory" && ` • ${service.testCode}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(service.status, service.department)} border`}>
                        {service.status}
                      </Badge>
                      <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>
                      <span className="text-sm text-muted-foreground">{service.scheduledTime}</span>

                      {/* Action Button for Lab Tests in List View */}
                      {service.department === "Laboratory" && getNextAction(service.status) && (
                        <Button
                          size="sm"
                          className={`${getNextAction(service.status)?.color} text-white`}
                          onClick={() => handleActionClick(service, getNextAction(service.status)?.action || "")}
                        >
                          {getNextAction(service.status)?.icon}
                          <span className="ml-1">{getNextAction(service.status)?.label}</span>
                        </Button>
                      )}

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

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{actionDialog.title}</DialogTitle>
            <DialogDescription>{actionDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or observations..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            {actionDialog.service && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="font-medium">{actionDialog.service.serviceName}</div>
                <div className="text-muted-foreground">
                  Patient: {actionDialog.service.patientName} ({actionDialog.service.patientId})
                </div>
                <div className="text-muted-foreground">Current Status: {actionDialog.service.status}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog((prev) => ({ ...prev, open: false }))}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleActionConfirm} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
