"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  ClipboardList,
  FileText,
  X,
  CloudUpload,
  Eye,
  Printer,
  QrCode,
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
    testDetails: {
      description: "Complete Blood Count with Differential",
      methodology: "Flow Cytometry",
      sampleVolume: "3-5 mL",
      container: "EDTA Tube (Purple Top)",
      fastingRequired: true,
      fastingHours: 12,
      turnaroundTime: "2-4 hours",
      normalRanges: {
        WBC: "4.0-11.0 x10³/μL",
        RBC: "4.2-5.4 x10⁶/μL",
        Hemoglobin: "12.0-16.0 g/dL",
        Hematocrit: "36-46%",
        Platelets: "150-450 x10³/μL",
      },
      clinicalSignificance:
        "Used to evaluate overall health and detect various disorders including anemia, infection, and leukemia.",
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
    testDetails: {
      description: "Comprehensive Lipid Panel",
      methodology: "Enzymatic Colorimetric",
      sampleVolume: "2-3 mL",
      container: "SST Tube (Gold Top)",
      fastingRequired: true,
      fastingHours: 12,
      turnaroundTime: "1-2 hours",
      normalRanges: {
        "Total Cholesterol": "<200 mg/dL",
        "LDL Cholesterol": "<100 mg/dL",
        "HDL Cholesterol": ">40 mg/dL (M), >50 mg/dL (F)",
        Triglycerides: "<150 mg/dL",
      },
      clinicalSignificance: "Assesses cardiovascular disease risk and monitors lipid-lowering therapy effectiveness.",
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
    testDetails: {
      description: "Thyroid Stimulating Hormone and Free T4",
      methodology: "Chemiluminescent Immunoassay",
      sampleVolume: "2-3 mL",
      container: "SST Tube (Gold Top)",
      fastingRequired: false,
      fastingHours: 0,
      turnaroundTime: "3-4 hours",
      normalRanges: {
        TSH: "0.4-4.0 mIU/L",
        "Free T4": "0.8-1.8 ng/dL",
        "Free T3": "2.3-4.2 pg/mL",
      },
      clinicalSignificance: "Evaluates thyroid gland function and diagnoses hyperthyroidism or hypothyroidism.",
    },
  },
  {
    id: "LAB004",
    patientName: "Sarah Davis",
    patientId: "P12348",
    serviceName: "Liver Function Test",
    department: "Laboratory",
    requestedBy: "Dr. Wilson",
    priority: "High",
    status: "Testing Completed",
    scheduledTime: "11:00 AM",
    requestedTime: "10:30 AM",
    collectionTime: "11:05 AM",
    testingStartTime: "11:30 AM",
    testingCompletedTime: "12:45 PM",
    notes: "Patient appears healthy, routine checkup",
    technician: "Tech. Mike",
    sampleType: "Blood",
    testCode: "LFT001",
    barcode: "1234567890126",
    testDetails: {
      description: "Comprehensive Liver Function Panel",
      methodology: "Enzymatic/Colorimetric",
      sampleVolume: "3-4 mL",
      container: "SST Tube (Gold Top)",
      fastingRequired: false,
      fastingHours: 0,
      turnaroundTime: "2-3 hours",
      normalRanges: {
        ALT: "7-56 U/L",
        AST: "10-40 U/L",
        "Bilirubin Total": "0.2-1.2 mg/dL",
        "Alkaline Phosphatase": "44-147 U/L",
        Albumin: "3.5-5.0 g/dL",
      },
      clinicalSignificance: "Assesses liver health, detects liver disease, and monitors treatment effectiveness.",
    },
  },
  {
    id: "LAB005",
    patientName: "Robert Johnson",
    patientId: "P12349",
    serviceName: "Urine Analysis",
    department: "Laboratory",
    requestedBy: "Dr. Lee",
    priority: "Medium",
    status: "Reports Uploaded",
    scheduledTime: "2:00 PM",
    requestedTime: "1:30 PM",
    collectionTime: "2:10 PM",
    testingStartTime: "2:30 PM",
    testingCompletedTime: "3:15 PM",
    reportUploadTime: "3:45 PM",
    notes: "Mid-stream sample collected - Results normal",
    technician: "Tech. Sarah",
    sampleType: "Urine",
    testCode: "UA001",
    barcode: "1234567890127",
    reportUrl: "/reports/ua-001.pdf",
    testDetails: {
      description: "Complete Urinalysis with Microscopy",
      methodology: "Dipstick and Microscopic Examination",
      sampleVolume: "10-15 mL",
      container: "Sterile Urine Container",
      fastingRequired: false,
      fastingHours: 0,
      turnaroundTime: "1-2 hours",
      normalRanges: {
        "Specific Gravity": "1.003-1.030",
        pH: "4.6-8.0",
        Protein: "Negative",
        Glucose: "Negative",
        Ketones: "Negative",
        Blood: "Negative",
      },
      clinicalSignificance:
        "Detects urinary tract infections, kidney disease, diabetes, and other metabolic disorders.",
    },
  },
  {
    id: "LAB006",
    patientName: "Emily Brown",
    patientId: "P12350",
    serviceName: "Blood Sugar (Random)",
    department: "Laboratory",
    requestedBy: "Dr. Kumar",
    priority: "High",
    status: "Sample Requested",
    scheduledTime: "3:30 PM",
    requestedTime: "3:00 PM",
    notes: "Patient had lunch 2 hours ago - Random glucose test",
    technician: "Tech. Mike",
    sampleType: "Blood",
    testCode: "BSR001",
    barcode: "1234567890128",
    testDetails: {
      description: "Random Blood Glucose",
      methodology: "Glucose Oxidase Method",
      sampleVolume: "1-2 mL",
      container: "Fluoride Tube (Gray Top)",
      fastingRequired: false,
      fastingHours: 0,
      turnaroundTime: "30 minutes",
      normalRanges: {
        "Random Glucose": "<200 mg/dL",
      },
      clinicalSignificance: "Screens for diabetes mellitus and monitors blood glucose levels.",
    },
  },
  {
    id: "LAB007",
    patientName: "David Wilson",
    patientId: "P12351",
    serviceName: "Hemoglobin A1C",
    department: "Laboratory",
    requestedBy: "Dr. Patel",
    priority: "Medium",
    status: "Sample Collected",
    scheduledTime: "4:00 PM",
    requestedTime: "3:30 PM",
    collectionTime: "4:05 PM",
    notes: "Diabetes monitoring - 3-month average",
    technician: "Tech. Sarah",
    sampleType: "Blood",
    testCode: "HBA1C001",
    barcode: "1234567890129",
    testDetails: {
      description: "Glycated Hemoglobin A1C",
      methodology: "High Performance Liquid Chromatography",
      sampleVolume: "2-3 mL",
      container: "EDTA Tube (Purple Top)",
      fastingRequired: false,
      fastingHours: 0,
      turnaroundTime: "2-3 hours",
      normalRanges: {
        HbA1c: "<5.7% (Normal), 5.7-6.4% (Prediabetes), ≥6.5% (Diabetes)",
      },
      clinicalSignificance: "Provides average blood glucose control over the past 2-3 months for diabetes management.",
    },
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
        return null // No further action needed
      default:
        return null
    }
  }

  const handleActionClick = (service: any, actionType: string) => {
    const actionConfig = {
      "collect-sample": {
        title: "Collect Sample",
        description: `Collect ${service.sampleType.toLowerCase()} sample for ${service.serviceName}`,
      },
      "start-testing": {
        title: "Start Testing",
        description: `Begin testing process for ${service.serviceName}`,
      },
      "complete-testing": {
        title: "Complete Testing",
        description: `Mark testing as completed for ${service.serviceName}`,
      },
      "upload-report": {
        title: "Upload Test Report",
        description: `Upload the test report file for ${service.serviceName}`,
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
    const updatedStatus = {
      "collect-sample": "Sample Collected",
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
        ...(actionDialog.action === "upload-report" &&
          selectedFile && {
            reportUrl: `/reports/${actionDialog.service.testCode.toLowerCase()}-${Date.now()}.pdf`,
            reportFileName: selectedFile.name,
          }),
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

  // Get lab-specific status options for filtering
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
                {selectedDepartment === "laboratory" &&
                  " • 5-stage workflow: Requested → Collected → Testing → Completed → Reports"}
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
                        {service.department === "Laboratory" && (
                          <DropdownMenuItem onClick={() => handleViewDetails(service)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Test Details
                          </DropdownMenuItem>
                        )}
                        {service.department === "Laboratory" && service.status === "Reports Uploaded" && (
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

                  {/* Lab-specific timeline */}
                  {service.department === "Laboratory" && (
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
                            <span className="text-muted-foreground">Testing:</span>
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

                  {/* View Details Button for Lab Tests */}
                  {service.department === "Laboratory" && (
                    <div className="pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mb-2 bg-transparent"
                        onClick={() => handleViewDetails(service)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Test Details & Barcode
                      </Button>
                    </div>
                  )}

                  {/* Action Button for Lab Tests */}
                  {service.department === "Laboratory" && getNextAction(service.status) && (
                    <div>
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

                      {/* View Details Button for Lab Tests in List View */}
                      {service.department === "Laboratory" && (
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(service)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      )}

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

      {/* Test Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Details & Barcode
            </DialogTitle>
            <DialogDescription>Complete information for {detailsDialog.service?.serviceName}</DialogDescription>
          </DialogHeader>

          {detailsDialog.service && (
            <div className="space-y-6">
              {/* Patient & Test Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Patient Information</Label>
                  <div className="mt-1">
                    <div className="font-medium">{detailsDialog.service.patientName}</div>
                    <div className="text-sm text-gray-600">ID: {detailsDialog.service.patientId}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Test Information</Label>
                  <div className="mt-1">
                    <div className="font-medium">{detailsDialog.service.serviceName}</div>
                    <div className="text-sm text-gray-600">Code: {detailsDialog.service.testCode}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Barcode Section */}
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-600">Test Barcode</Label>
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

              {/* Test Details */}
              {detailsDialog.service.testDetails && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Test Specifications</Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Description</Label>
                      <p className="text-sm mt-1">{detailsDialog.service.testDetails.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Methodology</Label>
                      <p className="text-sm mt-1">{detailsDialog.service.testDetails.methodology}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Sample Volume</Label>
                      <p className="text-sm mt-1">{detailsDialog.service.testDetails.sampleVolume}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Container</Label>
                      <p className="text-sm mt-1">{detailsDialog.service.testDetails.container}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Turnaround Time</Label>
                      <p className="text-sm mt-1">{detailsDialog.service.testDetails.turnaroundTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Fasting Required</Label>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant={detailsDialog.service.testDetails.fastingRequired ? "destructive" : "secondary"}
                        >
                          {detailsDialog.service.testDetails.fastingRequired ? "Yes" : "No"}
                        </Badge>
                        {detailsDialog.service.testDetails.fastingRequired && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({detailsDialog.service.testDetails.fastingHours} hours)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Priority</Label>
                      <div className="mt-1">
                        <Badge className={getPriorityColor(detailsDialog.service.priority)}>
                          {detailsDialog.service.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Normal Ranges */}
                  <div>
                    <Label className="text-lg font-semibold">Normal Reference Ranges</Label>
                    <div className="mt-3 space-y-2">
                      {Object.entries(detailsDialog.service.testDetails.normalRanges).map(([parameter, range]) => (
                        <div key={parameter} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium text-sm">{parameter}</span>
                          <span className="text-sm text-gray-600">{range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Clinical Significance */}
                  <div>
                    <Label className="text-lg font-semibold">Clinical Significance</Label>
                    <p className="text-sm mt-2 text-gray-700 leading-relaxed">
                      {detailsDialog.service.testDetails.clinicalSignificance}
                    </p>
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
                {actionDialog.service.testCode && (
                  <div className="text-muted-foreground">Test Code: {actionDialog.service.testCode}</div>
                )}
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
