"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Search,
  User,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  TestTube,
  Upload,
  Play,
  ArrowRight,
  ClipboardList,
  FileText,
  X,
  CloudUpload,
  Eye,
  Printer,
  QrCode,
  Heart,
  Camera,
  Activity,
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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Mock data for lab test services with 5-stage workflow
const labTestsData = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Complete Blood Count",
    department: "Laboratory",
    requestedBy: "Dr. Smith",
    priority: "High",
    status: "Sample Requested",
    scheduledTime: "10:30 AM",
    requestedTime: "9:45 AM",
    notes: "Fasting required - Patient to fast for 12 hours",
    technician: "Tech. Sarah",
    sampleType: "Blood",
    testCode: "CBC001",
    barcode: "1234567890123",
    allowedRanges: {
      WBC: "4.0-11.0 x10³/μL",
      RBC: "4.2-5.4 x10⁶/μL",
      Hemoglobin: "12.0-16.0 g/dL",
      Hematocrit: "36-46%",
      Platelets: "150-450 x10³/μL",
    },
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P12346",
    serviceName: "Lipid Profile",
    department: "Laboratory",
    requestedBy: "Dr. Johnson",
    priority: "Medium",
    status: "Sample Collected",
    scheduledTime: "9:00 AM",
    requestedTime: "8:30 AM",
    collectionTime: "9:05 AM",
    notes: "12-hour fasting confirmed",
    technician: "Tech. Mike",
    sampleType: "Blood",
    testCode: "LIP001",
    barcode: "1234567890124",
    allowedRanges: {
      "Total Cholesterol": "<200 mg/dL",
      "LDL Cholesterol": "<100 mg/dL",
      "HDL Cholesterol": ">40 mg/dL (M), >50 mg/dL (F)",
      Triglycerides: "<150 mg/dL",
    },
  },
  {
    id: "LAB003",
    patientName: "Mike Wilson",
    patientId: "P12347",
    serviceName: "Thyroid Function Test",
    department: "Laboratory",
    requestedBy: "Dr. Brown",
    priority: "Low",
    status: "Testing Started",
    scheduledTime: "8:30 AM",
    requestedTime: "8:00 AM",
    collectionTime: "8:35 AM",
    testingStartTime: "9:00 AM",
    notes: "No special preparation required",
    technician: "Tech. Sarah",
    sampleType: "Blood",
    testCode: "TFT001",
    barcode: "1234567890125",
    allowedRanges: {
      TSH: "0.4-4.0 mIU/L",
      "Free T4": "0.8-1.8 ng/dL",
      "Free T3": "2.3-4.2 pg/mL",
    },
  },
]

// Other services with 4-stage workflow: Requested → Testing Started → Testing Completed → Reports Uploaded
const otherServicesData = [
  {
    id: "RAD001",
    patientName: "Jane Smith",
    patientId: "P12346",
    serviceName: "Chest X-Ray",
    department: "Radiology",
    requestedBy: "Dr. Johnson",
    priority: "Medium",
    status: "Requested",
    scheduledTime: "2:00 PM",
    requestedTime: "1:30 PM",
    notes: "Remove jewelry and metal objects",
    technician: "Tech. David",
    serviceCode: "CXR001",
    barcode: "9876543210001",
    allowedRanges: {
      "Image Quality": "Clear visualization of lung fields",
      Positioning: "PA and Lateral views",
      Exposure: "Adequate penetration",
    },
  },
  {
    id: "RAD002",
    patientName: "Robert Johnson",
    patientId: "P12349",
    serviceName: "Abdominal Ultrasound",
    department: "Radiology",
    requestedBy: "Dr. Lee",
    priority: "High",
    status: "Testing Started",
    scheduledTime: "3:00 PM",
    requestedTime: "2:30 PM",
    testingStartTime: "3:05 PM",
    notes: "Patient fasting for 8 hours",
    technician: "Tech. Maria",
    serviceCode: "USG001",
    barcode: "9876543210002",
    allowedRanges: {
      "Liver Size": "Normal echogenicity",
      Gallbladder: "No stones or wall thickening",
      Kidneys: "Normal size and echogenicity",
    },
  },
  {
    id: "RAD003",
    patientName: "Emily Brown",
    patientId: "P12350",
    serviceName: "CT Scan Head",
    department: "Radiology",
    requestedBy: "Dr. Kumar",
    priority: "High",
    status: "Testing Completed",
    scheduledTime: "4:00 PM",
    requestedTime: "3:30 PM",
    testingStartTime: "4:10 PM",
    testingCompletedTime: "4:35 PM",
    notes: "Patient has mild claustrophobia - managed well",
    technician: "Tech. David",
    serviceCode: "CTH001",
    barcode: "9876543210003",
    allowedRanges: {
      "Brain Tissue": "Normal density",
      Ventricles: "Normal size",
      "No Mass Effect": "Normal midline",
    },
  },
  {
    id: "CARD001",
    patientName: "Sarah Davis",
    patientId: "P12348",
    serviceName: "ECG",
    department: "Cardiology",
    requestedBy: "Dr. Wilson",
    priority: "High",
    status: "Reports Uploaded",
    scheduledTime: "11:15 AM",
    requestedTime: "10:45 AM",
    testingStartTime: "11:20 AM",
    testingCompletedTime: "11:35 AM",
    reportUploadTime: "11:50 AM",
    notes: "Patient anxious - results show normal sinus rhythm",
    technician: "Tech. Lisa",
    serviceCode: "ECG001",
    reportUrl: "/reports/ecg-001.pdf",
    barcode: "5555666677778",
    allowedRanges: {
      "Heart Rate": "60-100 bpm",
      "PR Interval": "120-200 ms",
      "QRS Duration": "<120 ms",
      "QT Interval": "<440 ms",
    },
  },
  {
    id: "CARD002",
    patientName: "David Wilson",
    patientId: "P12351",
    serviceName: "Echocardiogram",
    department: "Cardiology",
    requestedBy: "Dr. Patel",
    priority: "Medium",
    status: "Requested",
    scheduledTime: "5:00 PM",
    requestedTime: "4:30 PM",
    notes: "Evaluate heart function post-surgery",
    technician: "Tech. Lisa",
    serviceCode: "ECHO001",
    barcode: "5555666677779",
    allowedRanges: {
      "Ejection Fraction": "55-70%",
      "Left Atrium": "2.7-4.0 cm",
      "Aortic Root": "2.0-3.7 cm",
    },
  },
  {
    id: "PHYS001",
    patientName: "Michael Brown",
    patientId: "P12352",
    serviceName: "Physical Therapy Session",
    department: "Physiotherapy",
    requestedBy: "Dr. Anderson",
    priority: "Medium",
    status: "Testing Started",
    scheduledTime: "10:00 AM",
    requestedTime: "9:30 AM",
    testingStartTime: "10:15 AM",
    notes: "Lower back pain rehabilitation",
    technician: "PT. Jennifer",
    serviceCode: "PT001",
    barcode: "3333444455556",
    allowedRanges: {
      "Range of Motion": "Normal flexibility",
      "Pain Level": "0-3/10 scale",
      Strength: "4-5/5 grade",
    },
  },
]

const departments = [
  { id: "all", name: "All Departments", count: 25, icon: "🏥" },
  { id: "laboratory", name: "Laboratory", count: 3, icon: "🔬" },
  { id: "radiology", name: "Radiology", count: 3, icon: "📷" },
  { id: "cardiology", name: "Cardiology", count: 2, icon: "❤️" },
  { id: "physiotherapy", name: "Physiotherapy", count: 1, icon: "🏃" },
]

export default function ServicesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
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

  // State for test details dialog
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean
    service: any
  }>({
    open: false,
    service: null,
  })

  const [actionNotes, setActionNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        // Lab-specific status filtering (5 stages)
        matchesStatus = service.status.toLowerCase().replace(" ", "-") === statusFilter
      } else {
        // Other services status filtering (4 stages)
        matchesStatus = service.status.toLowerCase().replace(" ", "-") === statusFilter
      }
    }

    const matchesPriority = priorityFilter === "all" || service.priority.toLowerCase() === priorityFilter

    return matchesDepartment && matchesSearch && matchesStatus && matchesPriority
  })

  const getLabStatusIcon = (status: string) => {
    switch (status) {
      case "Sample Requested":
        return <ClipboardList className="h-4 w-4 text-gray-500" />
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

  const getOtherServiceStatusIcon = (status: string) => {
    switch (status) {
      case "Requested":
        return <ClipboardList className="h-4 w-4 text-gray-500" />
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
    } else {
      return getOtherServiceStatusIcon(status)
    }
  }

  const getLabStatusColor = (status: string) => {
    switch (status) {
      case "Sample Requested":
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const getOtherServiceStatusColor = (status: string) => {
    switch (status) {
      case "Requested":
        return "bg-gray-100 text-gray-800 border-gray-200"
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
    } else {
      return getOtherServiceStatusColor(status)
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

  const getLabNextAction = (status: string) => {
    switch (status) {
      case "Sample Requested":
        return {
          action: "collect-sample",
          label: "Collect Sample",
          icon: <TestTube className="h-4 w-4" />,
          color: "bg-blue-500 hover:bg-blue-600",
        }
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
        return null
      default:
        return null
    }
  }

  const getOtherServiceNextAction = (status: string) => {
    switch (status) {
      case "Requested":
        return {
          action: "start-service",
          label: "Start Service",
          icon: <Play className="h-4 w-4" />,
          color: "bg-orange-500 hover:bg-orange-600",
        }
      case "Testing Started":
        return {
          action: "complete-service",
          label: "Complete Service",
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
        return null
      default:
        return null
    }
  }

  const getNextAction = (status: string, department: string) => {
    if (department === "Laboratory") {
      return getLabNextAction(status)
    } else {
      return getOtherServiceNextAction(status)
    }
  }

  const handleActionClick = (service: any, actionType: string) => {
    const isLab = service.department === "Laboratory"

    const actionConfig = {
      "collect-sample": {
        title: "Collect Sample",
        description: `Collect ${service.sampleType ? service.sampleType.toLowerCase() : "sample"} for ${service.serviceName}`,
      },
      "start-testing": {
        title: "Start Testing",
        description: `Begin testing process for ${service.serviceName}`,
      },
      "start-service": {
        title: "Start Service",
        description: `Begin ${service.serviceName} procedure`,
      },
      "complete-testing": {
        title: "Complete Testing",
        description: `Mark testing as completed for ${service.serviceName}`,
      },
      "complete-service": {
        title: "Complete Service",
        description: `Mark ${service.serviceName} as completed`,
      },
      "upload-report": {
        title: isLab ? "Upload Test Report" : "Upload Service Report",
        description: `Upload the ${isLab ? "test" : "service"} report file for ${service.serviceName}`,
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
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const handleViewDetails = (service: any) => {
    setDetailsDialog({
      open: true,
      service,
    })
  }

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const validateFile = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PDF, JPEG, or PNG file")
      return false
    }

    if (file.size > maxSize) {
      alert("File size must be less than 10MB")
      return false
    }

    return true
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleActionConfirm = async () => {
    setIsProcessing(true)

    // For upload-report action, simulate file upload
    if (actionDialog.action === "upload-report") {
      if (!selectedFile) {
        alert("Please select a file to upload")
        setIsProcessing(false)
        return
      }

      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } else {
      // Simulate API call for other actions
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    // Update the service status
    const isLab = actionDialog.service.department === "Laboratory"
    const updatedStatus = {
      "collect-sample": "Sample Collected",
      "start-testing": "Testing Started",
      "start-service": "Testing Started",
      "complete-testing": "Testing Completed",
      "complete-service": "Testing Completed",
      "upload-report": "Reports Uploaded",
    }[actionDialog.action]

    // In a real app, this would update the backend
    const allData = [...labTestsData, ...otherServicesData]
    const serviceIndex = allData.findIndex((s) => s.id === actionDialog.service.id)
    if (serviceIndex !== -1) {
      const targetArray = isLab ? labTestsData : otherServicesData
      const targetIndex = targetArray.findIndex((s) => s.id === actionDialog.service.id)

      if (targetIndex !== -1) {
        targetArray[targetIndex] = {
          ...targetArray[targetIndex],
          status: updatedStatus || targetArray[targetIndex].status,
          [`${actionDialog.action.replace("-", "")}Time`]: new Date().toLocaleTimeString(),
          ...(actionDialog.action === "upload-report" &&
            selectedFile && {
              reportUrl: `/reports/${(actionDialog.service.testCode || actionDialog.service.serviceCode).toLowerCase()}-${Date.now()}.pdf`,
              reportFileName: selectedFile.name,
            }),
        }
      }
    }

    setIsProcessing(false)
    setActionDialog({ open: false, service: null, action: "", title: "", description: "" })
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const generateBarcode = (code: string) => {
    // Simple barcode representation using CSS
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex space-x-px">
          {code.split("").map((digit, index) => (
            <div
              key={index}
              className={`h-12 ${Number.parseInt(digit) % 2 === 0 ? "w-1 bg-black" : "w-0.5 bg-black"}`}
            />
          ))}
        </div>
        <div className="text-xs font-mono">{code}</div>
      </div>
    )
  }

  const selectedDeptInfo = departments.find((dept) => dept.id === selectedDepartment)

  // Get status options based on department
  const getStatusOptions = () => {
    if (selectedDepartment === "laboratory") {
      return [
        { value: "all", label: "All Status" },
        { value: "sample-requested", label: "Sample Requested" },
        { value: "sample-collected", label: "Sample Collected" },
        { value: "testing-started", label: "Testing Started" },
        { value: "testing-completed", label: "Testing Completed" },
        { value: "reports-uploaded", label: "Reports Uploaded" },
      ]
    } else {
      return [
        { value: "all", label: "All Status" },
        { value: "requested", label: "Requested" },
        { value: "testing-started", label: "Testing Started" },
        { value: "testing-completed", label: "Testing Completed" },
        { value: "reports-uploaded", label: "Reports Uploaded" },
      ]
    }
  }

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Laboratory":
        return <TestTube className="h-4 w-4" />
      case "Radiology":
        return <Camera className="h-4 w-4" />
      case "Cardiology":
        return <Heart className="h-4 w-4" />
      case "Physiotherapy":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
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
                {selectedDeptInfo.count} active services •{" "}
                {selectedDepartment === "laboratory"
                  ? "5-stage workflow: Requested → Collected → Testing → Completed → Reports"
                  : "4-stage workflow: Requested → Testing → Completed → Reports"}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="grid">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getDepartmentIcon(service.department)}
                        {service.serviceName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {service.patientName} ({service.patientId})
                      </CardDescription>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div>
                          {service.department === "Laboratory" ? "Test" : "Service"} Code:{" "}
                          {service.testCode || service.serviceCode}
                        </div>
                        {service.sampleType && <div>Sample: {service.sampleType}</div>}
                        <div>Technician: {service.technician}</div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(service)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {service.status === "Reports Uploaded" && (
                          <DropdownMenuItem>
                            <Upload className="h-4 w-4 mr-2" />
                            Download Report
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Add Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Label
                        </DropdownMenuItem>
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

                  {/* Timeline */}
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Scheduled:</span>
                        <div className="font-medium">{service.scheduledTime}</div>
                      </div>
                      {service.requestedTime && (
                        <div>
                          <span className="text-muted-foreground">Requested:</span>
                          <div className="font-medium">{service.requestedTime}</div>
                        </div>
                      )}
                      {service.collectionTime && (
                        <div>
                          <span className="text-muted-foreground">Collected:</span>
                          <div className="font-medium">{service.collectionTime}</div>
                        </div>
                      )}
                      {service.testingStartTime && (
                        <div>
                          <span className="text-muted-foreground">
                            {service.department === "Laboratory" ? "Testing:" : "Started:"}
                          </span>
                          <div className="font-medium">{service.testingStartTime}</div>
                        </div>
                      )}
                      {service.testingCompletedTime && (
                        <div>
                          <span className="text-muted-foreground">Completed:</span>
                          <div className="font-medium">{service.testingCompletedTime}</div>
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

                  {/* View Details Button */}
                  <div className="pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mb-2 bg-transparent"
                      onClick={() => handleViewDetails(service)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View {service.department === "Laboratory" ? "Test" : "Service"} Details & Barcode
                    </Button>
                  </div>

                  {/* Action Button */}
                  {getNextAction(service.status, service.department) && (
                    <div>
                      <Button
                        size="sm"
                        className={`w-full ${getNextAction(service.status, service.department)?.color} text-white`}
                        onClick={() =>
                          handleActionClick(service, getNextAction(service.status, service.department)?.action || "")
                        }
                      >
                        {getNextAction(service.status, service.department)?.icon}
                        <span className="ml-2">{getNextAction(service.status, service.department)?.label}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Completed Service - Show Report Available */}
                  {service.status === "Reports Uploaded" && (
                    <div>
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
                        <div className="font-medium flex items-center gap-2">
                          {getDepartmentIcon(service.department)}
                          {service.serviceName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.patientName} ({service.patientId}) • {service.department} •{" "}
                          {service.testCode || service.serviceCode}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(service.status, service.department)} border`}>
                        {service.status}
                      </Badge>
                      <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>
                      <span className="text-sm text-muted-foreground">{service.scheduledTime}</span>

                      {/* View Details Button in List View */}
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(service)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>

                      {/* Action Button in List View */}
                      {getNextAction(service.status, service.department) && (
                        <Button
                          size="sm"
                          className={`${getNextAction(service.status, service.department)?.color} text-white`}
                          onClick={() =>
                            handleActionClick(service, getNextAction(service.status, service.department)?.action || "")
                          }
                        >
                          {getNextAction(service.status, service.department)?.icon}
                          <span className="ml-1">{getNextAction(service.status, service.department)?.label}</span>
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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

      {/* Service Details Dialog - Simplified */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailsDialog.service && getDepartmentIcon(detailsDialog.service.department)}
              {detailsDialog.service?.department === "Laboratory" ? "Test" : "Service"} Details & Barcode
            </DialogTitle>
            <DialogDescription>
              {detailsDialog.service?.serviceName} - {detailsDialog.service?.patientName}
            </DialogDescription>
          </DialogHeader>

          {detailsDialog.service && (
            <div className="space-y-6">
              {/* Service Name */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{detailsDialog.service.serviceName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Code: {detailsDialog.service.testCode || detailsDialog.service.serviceCode}
                </p>
              </div>

              <Separator />

              {/* Barcode Section - For All Services */}
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-600">Service Barcode</Label>
                <div className="mt-4 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                  {generateBarcode(detailsDialog.service.barcode)}
                </div>
                <div className="mt-2 flex justify-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Barcode
                  </Button>
                  <Button size="sm" variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Allowed Ranges */}
              {detailsDialog.service.allowedRanges && (
                <div>
                  <Label className="text-lg font-semibold">Allowed Ranges</Label>
                  <div className="mt-3 space-y-2">
                    {Object.entries(detailsDialog.service.allowedRanges).map(([parameter, range]) => (
                      <div
                        key={parameter}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                      >
                        <span className="font-medium text-sm">{parameter}</span>
                        <span className="text-sm text-gray-600 font-mono">{range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog({ open: false, service: null })}>
              Close
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Print Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{actionDialog.title}</DialogTitle>
            <DialogDescription>{actionDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* File Upload Section - Only for upload-report action */}
            {actionDialog.action === "upload-report" && (
              <div className="space-y-4">
                <Label>Report File *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : selectedFile
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-8 w-8 text-green-500" />
                        <div className="text-left">
                          <div className="font-medium text-green-700">{selectedFile.name}</div>
                          <div className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <CloudUpload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600">Drag and drop your report file here, or</p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2"
                        >
                          Browse Files
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">Supports PDF, JPEG, PNG files up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Upload Progress */}
                {isProcessing && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>
            )}

            {/* Notes Section */}
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

            {/* Service Info */}
            {actionDialog.service && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="font-medium">{actionDialog.service.serviceName}</div>
                <div className="text-muted-foreground">
                  Patient: {actionDialog.service.patientName} ({actionDialog.service.patientId})
                </div>
                <div className="text-muted-foreground">Current Status: {actionDialog.service.status}</div>
                <div className="text-muted-foreground">
                  {actionDialog.service.department === "Laboratory" ? "Test" : "Service"} Code:{" "}
                  {actionDialog.service.testCode || actionDialog.service.serviceCode}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialog((prev) => ({ ...prev, open: false }))
                setSelectedFile(null)
                setUploadProgress(0)
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleActionConfirm} disabled={isProcessing}>
              {isProcessing ? (actionDialog.action === "upload-report" ? "Uploading..." : "Processing...") : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
