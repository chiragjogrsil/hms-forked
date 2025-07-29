"use client"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Activity,
  Plus,
  History,
  TestTube,
  Zap,
  Video,
  FileTextIcon,
  Receipt,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Printer,
  Search,
  MoreHorizontal,
  Play,
  Upload,
  Eye,
  Clock,
  Heart,
  Camera,
} from "lucide-react"
import { IntegratedConsultation } from "@/components/integrated-consultation"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"
import { ConsultationPrintModal } from "@/components/modals/consultation-print-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock patient data
const mockPatient = {
  id: "P12345",
  name: "John Doe",
  age: 45,
  gender: "Male",
  phone: "+1 (555) 123-4567",
  email: "john.doe@email.com",
  address: "123 Main St, City, State 12345",
  bloodGroup: "O+",
  allergies: ["Penicillin", "Shellfish"],
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  medicalHistory: ["Hypertension", "Type 2 Diabetes", "Previous heart surgery (2019)"],
  currentMedications: ["Metformin 500mg twice daily", "Lisinopril 10mg once daily"],
}

// Mock services data - combining all service types
const mockServicesData = [
  // Laboratory Tests
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Complete Blood Count",
    department: "Laboratory",
    serviceType: "laboratory",
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
  },
  {
    id: "LAB002",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Lipid Profile",
    department: "Laboratory",
    serviceType: "laboratory",
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
  },
  {
    id: "LAB003",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Thyroid Function Test",
    department: "Laboratory",
    serviceType: "laboratory",
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
  },
  // Radiology Services
  {
    id: "RAD001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Chest X-Ray",
    department: "Radiology",
    serviceType: "radiology",
    requestedBy: "Dr. Johnson",
    priority: "Medium",
    status: "Requested",
    scheduledTime: "2:00 PM",
    requestedTime: "1:30 PM",
    notes: "Remove jewelry and metal objects",
    technician: "Tech. David",
    serviceCode: "CXR001",
    barcode: "9876543210001",
  },
  {
    id: "RAD002",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Abdominal Ultrasound",
    department: "Radiology",
    serviceType: "radiology",
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
  },
  // Cardiology Services
  {
    id: "CARD001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "ECG",
    department: "Cardiology",
    serviceType: "cardiology",
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
  },
  {
    id: "CARD002",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Echocardiogram",
    department: "Cardiology",
    serviceType: "cardiology",
    requestedBy: "Dr. Patel",
    priority: "Medium",
    status: "Requested",
    scheduledTime: "5:00 PM",
    requestedTime: "4:30 PM",
    notes: "Evaluate heart function post-surgery",
    technician: "Tech. Lisa",
    serviceCode: "ECHO001",
    barcode: "5555666677779",
  },
  // Physiotherapy Services
  {
    id: "PHYS001",
    patientName: "John Doe",
    patientId: "P12345",
    serviceName: "Physical Therapy Session",
    department: "Physiotherapy",
    serviceType: "physiotherapy",
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
  },
]

const serviceTypes = [
  { id: "all", name: "All Services", count: mockServicesData.length, icon: "🏥" },
  {
    id: "laboratory",
    name: "Laboratory",
    count: mockServicesData.filter((s) => s.serviceType === "laboratory").length,
    icon: "🔬",
  },
  {
    id: "radiology",
    name: "Radiology",
    count: mockServicesData.filter((s) => s.serviceType === "radiology").length,
    icon: "📷",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    count: mockServicesData.filter((s) => s.serviceType === "cardiology").length,
    icon: "❤️",
  },
  {
    id: "physiotherapy",
    name: "Physiotherapy",
    count: mockServicesData.filter((s) => s.serviceType === "physiotherapy").length,
    icon: "🏃",
  },
]

const mockInvoices = [
  {
    id: "INV-2024-001",
    date: "2024-05-15",
    amount: 1250.0,
    description: "Consultation and Lab Tests",
    status: "paid",
    items: [
      { name: "General Consultation", amount: 500 },
      { name: "Complete Blood Count", amount: 350 },
      { name: "Lipid Profile", amount: 400 },
    ],
  },
  {
    id: "INV-2024-002",
    date: "2024-04-22",
    amount: 3500.0,
    description: "Physiotherapy Sessions (5)",
    status: "paid",
    items: [
      { name: "Initial Assessment", amount: 700 },
      { name: "Therapy Sessions (4)", amount: 2800 },
    ],
  },
  {
    id: "INV-2024-003",
    date: "2024-06-01",
    amount: 1800.0,
    description: "Radiology Services",
    status: "pending",
    items: [
      { name: "X-Ray (Chest)", amount: 800 },
      { name: "Ultrasound (Abdomen)", amount: 1000 },
    ],
  },
  {
    id: "INV-2024-004",
    date: "2024-06-05",
    amount: 2500.0,
    description: "Panchkarma Treatment",
    status: "overdue",
    items: [
      { name: "Consultation", amount: 500 },
      { name: "Abhyanga", amount: 1200 },
      { name: "Shirodhara", amount: 800 },
    ],
  },
]

// Mock reports data
const mockReports = [
  {
    id: "RPT-2024-001",
    title: "Complete Blood Count (CBC)",
    type: "Laboratory",
    date: "2024-06-15",
    doctor: "Dr. Sarah Johnson",
    department: "Pathology",
    status: "Completed",
    priority: "Normal",
    summary: "All blood parameters within normal limits. Hemoglobin: 14.2 g/dL, WBC: 7,200/μL, Platelets: 285,000/μL",
  },
  {
    id: "RPT-2024-002",
    title: "Chest X-Ray",
    type: "Radiology",
    date: "2024-06-14",
    doctor: "Dr. Michael Chen",
    department: "Radiology",
    status: "Completed",
    priority: "Normal",
    summary: "Clear lung fields bilaterally. No acute cardiopulmonary abnormalities detected. Heart size normal.",
  },
  {
    id: "RPT-2024-003",
    title: "Cardiology Consultation Report",
    type: "Consultation",
    date: "2024-06-12",
    doctor: "Dr. Emily Rodriguez",
    department: "Cardiology",
    status: "Completed",
    priority: "High",
    summary:
      "Patient evaluated for chest pain. ECG shows normal sinus rhythm. Stress test recommended for further evaluation.",
  },
  {
    id: "RPT-2024-004",
    title: "Lipid Profile",
    type: "Laboratory",
    date: "2024-06-10",
    doctor: "Dr. Sarah Johnson",
    department: "Pathology",
    status: "Completed",
    priority: "High",
    summary:
      "Elevated cholesterol levels detected. Total cholesterol: 245 mg/dL, LDL: 165 mg/dL. Dietary modifications recommended.",
  },
  {
    id: "RPT-2024-005",
    title: "Abdominal Ultrasound",
    type: "Radiology",
    date: "2024-06-08",
    doctor: "Dr. Michael Chen",
    department: "Radiology",
    status: "Completed",
    priority: "Normal",
    summary: "Normal liver, gallbladder, pancreas, and kidneys. No abnormal masses or fluid collections identified.",
  },
  {
    id: "RPT-2024-006",
    title: "Discharge Summary - General Medicine",
    type: "Discharge",
    date: "2024-06-05",
    doctor: "Dr. James Wilson",
    department: "General Medicine",
    status: "Completed",
    priority: "Normal",
    summary:
      "Patient admitted for hypertensive crisis, successfully managed with medication adjustment. Discharged in stable condition.",
  },
  {
    id: "RPT-2024-007",
    title: "Thyroid Function Test",
    type: "Laboratory",
    date: "2024-06-03",
    doctor: "Dr. Sarah Johnson",
    department: "Pathology",
    status: "Completed",
    priority: "Normal",
    summary: "Thyroid function within normal limits. TSH: 2.1 mIU/L, T3: 1.2 ng/mL, T4: 8.5 μg/dL",
  },
  {
    id: "RPT-2024-008",
    title: "Orthopedic Consultation Report",
    type: "Consultation",
    date: "2024-05-28",
    doctor: "Dr. Robert Martinez",
    department: "Orthopedics",
    status: "Completed",
    priority: "Normal",
    summary:
      "Patient evaluated for knee pain. Physical examination reveals mild osteoarthritis. Conservative treatment recommended.",
  },
  {
    id: "RPT-2024-009",
    title: "CT Scan - Head",
    type: "Radiology",
    date: "2024-05-25",
    doctor: "Dr. Michael Chen",
    department: "Radiology",
    status: "Completed",
    priority: "Urgent",
    summary: "No acute intracranial abnormalities. No evidence of hemorrhage, mass effect, or midline shift.",
  },
  {
    id: "RPT-2024-010",
    title: "Diabetes Management Report",
    type: "Consultation",
    date: "2024-05-20",
    doctor: "Dr. Lisa Thompson",
    department: "Endocrinology",
    status: "Completed",
    priority: "High",
    summary: "HbA1c improved to 7.2%. Medication adherence good. Continue current regimen with dietary counseling.",
  },
]

// Helper functions for report styling
const getReportTypeColor = (type: string) => {
  switch (type) {
    case "Laboratory":
      return "bg-gradient-to-br from-blue-500 to-blue-600"
    case "Radiology":
      return "bg-gradient-to-br from-purple-500 to-purple-600"
    case "Consultation":
      return "bg-gradient-to-br from-teal-500 to-teal-600"
    case "Discharge":
      return "bg-gradient-to-br from-green-500 to-green-600"
    default:
      return "bg-gradient-to-br from-slate-500 to-slate-600"
  }
}

const getReportTypeIcon = (type: string) => {
  switch (type) {
    case "Laboratory":
      return <TestTube className="h-6 w-6 text-white" />
    case "Radiology":
      return <Zap className="h-6 w-6 text-white" />
    case "Consultation":
      return <Stethoscope className="h-6 w-6 text-white" />
    case "Discharge":
      return <CheckCircle2 className="h-6 w-6 text-white" />
    default:
      return <FileTextIcon className="h-6 w-6 text-white" />
  }
}

const getReportStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-slate-100 text-slate-800 border-slate-200"
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return "bg-red-100 text-red-800 border-red-200"
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Normal":
      return "bg-slate-100 text-slate-800 border-slate-200"
    default:
      return "bg-slate-100 text-slate-800 border-slate-200"
  }
}

// Department mapping for display
const departmentLabels = {
  general: "General Medicine",
  cardiology: "Cardiology",
  neurology: "Neurology",
  orthopedics: "Orthopedics",
  pediatrics: "Pediatrics",
  gynecology: "Gynecology",
  dermatology: "Dermatology",
  ophthalmology: "Ophthalmology",
  ent: "ENT",
  psychiatry: "Psychiatry",
  ayurveda: "Ayurveda",
  dental: "Dental",
  emergency: "Emergency",
}

// Consultation type mapping for display
const consultationTypeLabels = {
  emergency: "Emergency",
  followup: "Follow up",
  routine: "Routine checkup",
}

export default function PatientDetailsPage() {
  const params = useParams()
  const patientId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")
  const [consultationKey, setConsultationKey] = useState(0)

  // Services tab state
  const [selectedServiceType, setSelectedServiceType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const {
    activeConsultation,
    isConsultationActive,
    hasUnsavedChanges,
    startNewConsultation,
    saveConsultation,
    completeVisit,
    getPatientConsultations,
    resetConsultation,
    hasInProgressConsultation,
    getInProgressConsultation,
    loadInProgressConsultation,
    hasIncompleteVisits,
    completeIncompleteVisit,
  } = useConsultation()

  // New consultation modal state
  const [isNewConsultationModalOpen, setIsNewConsultationModalOpen] = useState(false)
  const [newConsultationData, setNewConsultationData] = useState({
    department: "general",
    consultationType: "routine",
    doctorName: "Dr. Smith",
  })

  // Incomplete visits modal state
  const [isIncompleteVisitsModalOpen, setIsIncompleteVisitsModalOpen] = useState(false)
  const [incompleteVisits, setIncompleteVisits] = useState<any[]>([])

  // Visit completion modal state
  const [isVisitCompletionModalOpen, setIsVisitCompletionModalOpen] = useState(false)

  // Print modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [selectedConsultationForPrint, setSelectedConsultationForPrint] = useState<any>(null)

  // Handle URL parameters for tab selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")
    if (
      tabParam &&
      ["overview", "consultation", "services", "telemedicine", "invoices", "reports"].includes(tabParam)
    ) {
      setActiveTab(tabParam)
    }
  }, [])

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("google-meet")
  const [meetingLink, setMeetingLink] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")

  const [isMedicalCertificateOpen, setIsMedicalCertificateOpen] = useState(false)
  const [isConsentFormOpen, setIsConsentFormOpen] = useState(false)
  const [certificateData, setCertificateData] = useState({
    ailment: "",
    duration: "",
    recommendations: "",
    issueDate: new Date().toISOString().split("T")[0],
  })
  const [consentData, setConsentData] = useState({
    procedureName: "",
    procedureDuration: "",
    procedureDate: new Date().toISOString().split("T")[0],
    additionalNotes: "",
  })

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  // Filter services based on selected type and other filters
  const filteredServices = mockServicesData.filter((service) => {
    const matchesServiceType = selectedServiceType === "all" || service.serviceType === selectedServiceType
    const matchesSearch =
      service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (statusFilter !== "all") {
      matchesStatus = service.status.toLowerCase().replace(" ", "-") === statusFilter
    }

    const matchesPriority = priorityFilter === "all" || service.priority.toLowerCase() === priorityFilter

    return matchesServiceType && matchesSearch && matchesStatus && matchesPriority
  })

  // Service helper functions
  const getServiceStatusIcon = (status: string, serviceType: string) => {
    if (serviceType === "laboratory") {
      switch (status) {
        case "Sample Requested":
          return <AlertCircle className="h-4 w-4 text-gray-500" />
        case "Sample Collected":
          return <TestTube className="h-4 w-4 text-blue-500" />
        case "Testing Started":
          return <Play className="h-4 w-4 text-orange-500" />
        case "Testing Completed":
          return <CheckCircle2 className="h-4 w-4 text-green-500" />
        case "Reports Uploaded":
          return <Upload className="h-4 w-4 text-purple-500" />
        default:
          return <AlertCircle className="h-4 w-4 text-gray-500" />
      }
    } else {
      switch (status) {
        case "Requested":
          return <AlertCircle className="h-4 w-4 text-gray-500" />
        case "Testing Started":
          return <Play className="h-4 w-4 text-orange-500" />
        case "Testing Completed":
          return <CheckCircle2 className="h-4 w-4 text-green-500" />
        case "Reports Uploaded":
          return <Upload className="h-4 w-4 text-purple-500" />
        default:
          return <AlertCircle className="h-4 w-4 text-gray-500" />
      }
    }
  }

  const getServiceStatusColor = (status: string, serviceType: string) => {
    if (serviceType === "laboratory") {
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
    } else {
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

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case "laboratory":
        return <TestTube className="h-4 w-4" />
      case "radiology":
        return <Camera className="h-4 w-4" />
      case "cardiology":
        return <Heart className="h-4 w-4" />
      case "physiotherapy":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Get status options based on service type
  const getStatusOptions = () => {
    if (selectedServiceType === "laboratory") {
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

  const handleScheduleMeeting = () => {
    const generatedLink =
      selectedPlatform === "google-meet" ? `https://meet.google.com/abc-defg-hij` : `https://zoom.us/j/1234567890`

    setMeetingLink(generatedLink)
    toast.success("Telemedicine appointment scheduled successfully", {
      description: `${meetingDate} at ${meetingTime} via ${selectedPlatform === "google-meet" ? "Google Meet" : "Zoom"}`,
    })
    setIsScheduleModalOpen(false)
  }

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success("Meeting link copied to clipboard")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const handleNewConsultation = () => {
    // Check for incomplete visits first
    const incomplete = hasIncompleteVisits(patientId)
    if (incomplete.length > 0) {
      setIncompleteVisits(incomplete)
      setIsIncompleteVisitsModalOpen(true)
      return
    }

    // Check if there's an active consultation that would be overridden
    if (isConsultationActive) {
      const confirmed = window.confirm(
        "You have an active consultation in progress. Starting a new consultation will override the current one. Do you want to continue?",
      )
      if (!confirmed) return
    }

    setIsNewConsultationModalOpen(true)
  }

  const handleCreateConsultation = () => {
    const currentDate = new Date().toISOString().split("T")[0]

    // Start new consultation with specified data
    startNewConsultation(patientId, mockPatient.name, currentDate, {
      department: newConsultationData.department,
      consultationType: newConsultationData.consultationType,
      doctorName: newConsultationData.doctorName,
      appointmentDate: currentDate,
      appointmentTime: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    })

    // Force re-render of consultation component by changing key
    setConsultationKey((prev) => prev + 1)

    // Switch to consultation tab
    setActiveTab("consultation")

    // Close modal and reset form
    setIsNewConsultationModalOpen(false)
    setNewConsultationData({
      department: "general",
      consultationType: "routine",
      doctorName: "Dr. Smith",
    })

    toast.success("New consultation started successfully")
  }

  const handleCompleteIncompleteVisit = (visitId: string) => {
    completeIncompleteVisit(visitId)
    setIsIncompleteVisitsModalOpen(false)
    toast.success("Visit completed successfully")
  }

  const handleContinueIncompleteVisit = (visitId: string) => {
    loadInProgressConsultation(visitId)
    setIsIncompleteVisitsModalOpen(false)
    setActiveTab("consultation")
    toast.success("Resumed incomplete consultation")
  }

  const handleCompleteVisit = () => {
    if (activeConsultation) {
      setIsVisitCompletionModalOpen(true)
    }
  }

  const handleVisitCompletion = () => {
    completeVisit()
    setIsVisitCompletionModalOpen(false)
    setConsultationKey((prev) => prev + 1)
    toast.success("Visit completed successfully")
  }

  const handlePrintConsultation = (consultation: any) => {
    setSelectedConsultationForPrint(consultation)
    setIsPrintModalOpen(true)
  }

  const handlePrintCurrentConsultation = () => {
    if (activeConsultation) {
      setSelectedConsultationForPrint(activeConsultation)
      setIsPrintModalOpen(true)
    }
  }

  // Get patient consultations for history
  const patientConsultations = getPatientConsultations(patientId)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Patient Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{mockPatient.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {mockPatient.age} years, {mockPatient.gender}
                  </span>
                  <span className="flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    {mockPatient.bloodGroup}
                  </span>
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {mockPatient.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Patient ID</p>
              <p className="text-lg font-semibold text-gray-900">{mockPatient.id}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Consultation
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="telemedicine" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Telemedicine
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-xl font-semibold">Patient Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Contact Information</p>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {mockPatient.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {mockPatient.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {mockPatient.address}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{mockPatient.emergencyContact.name}</p>
                      <p className="text-sm text-gray-600">{mockPatient.emergencyContact.relationship}</p>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {mockPatient.emergencyContact.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleNewConsultation} className="w-full justify-start" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Consultation
                </Button>
                <Button
                  onClick={() => setActiveTab("services")}
                  variant="outline"
                  className="w-full justify-start"
                  size="lg"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Order Tests
                </Button>
                <Button
                  onClick={() => setActiveTab("telemedicine")}
                  variant="outline"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Telemedicine
                </Button>
                {activeConsultation && (
                  <Button
                    onClick={handlePrintCurrentConsultation}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    size="lg"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Current Consultation
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Medical History and Allergies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Medical History</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockPatient.medicalHistory.map((condition, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">{condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Allergies & Current Medications</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {mockPatient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Current Medications</p>
                  <div className="space-y-1">
                    {mockPatient.currentMedications.map((medication, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">{medication}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Consultations History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Recent Consultations</h3>
                <Button
                  onClick={() => setActiveTab("consultation")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {patientConsultations.length > 0 ? (
                <div className="space-y-4">
                  {patientConsultations.slice(0, 3).map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {departmentLabels[consultation.department as keyof typeof departmentLabels] ||
                              consultation.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            {consultation.visitDate} • {consultation.doctorName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={consultation.status === "completed" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {consultation.status}
                        </Badge>
                        <Button
                          onClick={() => handlePrintConsultation(consultation)}
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Printer className="h-4 w-4" />
                          Print
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No consultations found</p>
                  <Button onClick={handleNewConsultation} className="mt-4">
                    Start First Consultation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultation Tab */}
        <TabsContent value="consultation" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Patient Consultation</h2>
              <p className="text-gray-600">Manage ongoing and historical consultations</p>
            </div>
            <div className="flex gap-3">
              {activeConsultation && (
                <Button
                  onClick={handlePrintCurrentConsultation}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Printer className="h-4 w-4" />
                  Print Current
                </Button>
              )}
              <Button onClick={handleNewConsultation} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Consultation
              </Button>
            </div>
          </div>

          {/* Active Consultation */}
          {isConsultationActive && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-semibold text-green-800">Active Consultation</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {departmentLabels[activeConsultation?.department as keyof typeof departmentLabels] ||
                        activeConsultation?.department}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUnsavedChanges && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Unsaved Changes
                      </Badge>
                    )}
                    <Button onClick={handleCompleteVisit} variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Visit
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Consultation Interface */}
          <IntegratedConsultation
            key={consultationKey}
            patientId={patientId}
            patientData={mockPatient}
            department={activeConsultation?.department || "general"}
            doctorName={activeConsultation?.doctorName || "Dr. Smith"}
            onCompleteVisit={handleCompleteVisit}
          />

          {/* Historical Consultations */}
          {patientConsultations.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Consultation History</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientConsultations.map((consultation, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="font-medium">
                                {departmentLabels[consultation.department as keyof typeof departmentLabels] ||
                                  consultation.department}
                              </p>
                              <Badge
                                variant={consultation.status === "completed" ? "default" : "secondary"}
                                className="capitalize"
                              >
                                {consultation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {consultation.visitDate} at {consultation.visitTime} • {consultation.doctorName}
                            </p>
                            {consultation.chiefComplaint && (
                              <p className="text-sm text-gray-700 mt-1">
                                <strong>Chief Complaint:</strong> {consultation.chiefComplaint}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handlePrintConsultation(consultation)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Printer className="h-4 w-4" />
                            Print
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Show prescription summary if available */}
                      {((consultation.prescriptions?.allopathic && consultation.prescriptions.allopathic.length > 0) ||
                        (consultation.prescriptions?.ayurvedic && consultation.prescriptions.ayurvedic.length > 0)) && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-gray-600 mb-2">Prescriptions:</p>
                          <div className="flex flex-wrap gap-2">
                            {consultation.prescriptions?.allopathic?.map((prescription: any, idx: number) => (
                              <Badge key={`allo-${idx}`} variant="outline" className="text-xs">
                                {prescription.medicine || prescription.name || "Medicine"}
                              </Badge>
                            ))}
                            {consultation.prescriptions?.ayurvedic?.map((prescription: any, idx: number) => (
                              <Badge key={`ayur-${idx}`} variant="outline" className="text-xs bg-green-50">
                                {prescription.medicine || prescription.formOfMedicine || "Ayurvedic Medicine"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Services Tab - Updated to match Services navigation */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Patient Services</h2>
              <p className="text-gray-600">Manage prescribed tests and services for this patient</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Service
            </Button>
          </div>

          {/* Service Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Service Type Selection</CardTitle>
              <CardDescription>Select a service type to view and manage prescribed services</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {type.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedServiceType !== "all" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{serviceTypes.find((t) => t.id === selectedServiceType)?.icon}</span>
                    <h3 className="font-semibold text-blue-900">
                      {serviceTypes.find((t) => t.id === selectedServiceType)?.name}
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    {serviceTypes.find((t) => t.id === selectedServiceType)?.count} prescribed services •{" "}
                    {selectedServiceType === "laboratory"
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
                  placeholder="Search services..."
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
          </div>

          {/* Services List */}
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Services</CardTitle>
              <CardDescription>
                {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredServices.length > 0 ? (
                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getServiceTypeIcon(service.serviceType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{service.serviceName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {service.department}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Scheduled: {service.scheduledTime}</span>
                            </div>
                            <span>•</span>
                            <span>By: {service.requestedBy}</span>
                            <span>•</span>
                            <span>Tech: {service.technician}</span>
                          </div>
                          {service.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Notes:</strong> {service.notes}
                            </p>
                          )}

                          {/* Timeline */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            {service.requestedTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Requested: {service.requestedTime}</span>
                              </div>
                            )}
                            {service.collectionTime && (
                              <div className="flex items-center gap-1">
                                <TestTube className="h-3 w-3" />
                                <span>Collected: {service.collectionTime}</span>
                              </div>
                            )}
                            {service.testingStartTime && (
                              <div className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                <span>Started: {service.testingStartTime}</span>
                              </div>
                            )}
                            {service.testingCompletedTime && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Completed: {service.testingCompletedTime}</span>
                              </div>
                            )}
                            {service.reportUploadTime && (
                              <div className="flex items-center gap-1">
                                <Upload className="h-3 w-3" />
                                <span>Report: {service.reportUploadTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={`${getServiceStatusColor(service.status, service.serviceType)} border`}>
                          {getServiceStatusIcon(service.status, service.serviceType)}
                          <span className="ml-1">{service.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(service.priority)}>{service.priority}</Badge>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>

                          {service.status === "Reports Uploaded" && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Report
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print Label
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileTextIcon className="h-4 w-4 mr-2" />
                                Add Notes
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">
                    No services match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Service
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Telemedicine Tab */}
        <TabsContent value="telemedicine" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule New Meeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Schedule Telemedicine Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Schedule a virtual consultation with the patient using your preferred platform.
                </p>
                <Button onClick={() => setIsScheduleModalOpen(true)} className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Meeting
                </Button>
              </CardContent>
            </Card>

            {/* Active Meeting */}
            {meetingLink && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Video className="h-5 w-5" />
                    Scheduled Meeting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Date:</strong> {meetingDate}
                    </p>
                    <p className="text-sm">
                      <strong>Time:</strong> {meetingTime}
                    </p>
                    <p className="text-sm">
                      <strong>Platform:</strong> {selectedPlatform === "google-meet" ? "Google Meet" : "Zoom"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsJoinModalOpen(true)} className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                    <Button onClick={() => copyMeetingLink(meetingLink)} variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Meeting History */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Video className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Follow-up Consultation</p>
                      <p className="text-sm text-gray-600">June 10, 2024 at 2:00 PM • 45 minutes</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Video className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Initial Consultation</p>
                      <p className="text-sm text-gray-600">May 28, 2024 at 10:30 AM • 60 minutes</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Patient Invoices</h2>
              <p className="text-gray-600">View and manage billing information</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          </div>

          {/* Invoice Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">₹9,050</p>
                  </div>
                  <Receipt className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid</p>
                    <p className="text-2xl font-bold text-green-600">₹4,750</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">₹1,800</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">₹2,500</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices List */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                          {getStatusIcon(invoice.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{invoice.id}</p>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.date).toLocaleDateString()} • {invoice.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">₹{invoice.amount.toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {invoice.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name}</span>
                            <span className="font-medium">₹{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Medical Reports</h2>
              <p className="text-gray-600">View all medical reports and test results</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export All
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Upload Report
              </Button>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${getReportTypeColor(report.type)}`}>
                      {getReportTypeIcon(report.type)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getReportStatusBadge(report.status)} variant="outline">
                        {report.status}
                      </Badge>
                      <Badge className={getPriorityBadge(report.priority)} variant="outline">
                        {report.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.type}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {report.doctor}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="h-4 w-4 mr-2" />
                      {report.department}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-700 line-clamp-3">{report.summary}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <FileTextIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Create a mock consultation object for printing
                        const mockConsultationForReport = {
                          visitDate: report.date,
                          visitTime: "N/A",
                          doctorName: report.doctor,
                          department: report.department.toLowerCase(),
                          consultationType: "report",
                          clinicalNotes: report.summary,
                          chiefComplaint: `Report: ${report.title}`,
                          status: report.status.toLowerCase(),
                          reportType: report.type,
                          reportTitle: report.title,
                          reportPriority: report.priority,
                        }
                        handlePrintConsultation(mockConsultationForReport)
                      }}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Consultation Modal */}
      <Dialog open={isNewConsultationModalOpen} onOpenChange={setIsNewConsultationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Consultation</DialogTitle>
            <DialogDescription>Configure the consultation details before starting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={newConsultationData.department}
                onValueChange={(value) =>
                  setNewConsultationData((prev) => ({
                    ...prev,
                    department: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(departmentLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="consultationType">Consultation Type</Label>
              <Select
                value={newConsultationData.consultationType}
                onValueChange={(value) =>
                  setNewConsultationData((prev) => ({
                    ...prev,
                    consultationType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select consultation type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(consultationTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Select
                value={newConsultationData.doctorName}
                onValueChange={(value) =>
                  setNewConsultationData((prev) => ({
                    ...prev,
                    doctorName: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                  <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                  <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
                  <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                  <SelectItem value="Dr. Davis">Dr. Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConsultationModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateConsultation}>Start Consultation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Incomplete Visits Modal */}
      <Dialog open={isIncompleteVisitsModalOpen} onOpenChange={setIsIncompleteVisitsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Incomplete Visits Found</DialogTitle>
            <DialogDescription>
              There are incomplete visits for this patient. Please complete them before starting a new consultation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {incompleteVisits.map((visit, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{visit.department}</p>
                  <p className="text-sm text-gray-600">{visit.visitDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleContinueIncompleteVisit(visit.id)} variant="outline" size="sm">
                    Continue
                  </Button>
                  <Button onClick={() => handleCompleteIncompleteVisit(visit.id)} variant="outline" size="sm">
                    Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIncompleteVisitsModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visit Completion Modal */}
      <Dialog open={isVisitCompletionModalOpen} onOpenChange={setIsVisitCompletionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Visit</DialogTitle>
            <DialogDescription>Are you sure you want to complete this visit?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVisitCompletionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVisitCompletion}>Complete Visit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      {selectedConsultationForPrint && (
        <ConsultationPrintModal
          open={isPrintModalOpen}
          onOpenChange={setIsPrintModalOpen}
          patientData={mockPatient}
          consultationData={selectedConsultationForPrint}
          department={selectedConsultationForPrint.department || "general"}
        />
      )}

      {/* Schedule Meeting Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Telemedicine Appointment</DialogTitle>
            <DialogDescription>Set up a virtual consultation with the patient.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google-meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Meeting Modal */}
      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Telemedicine Meeting</DialogTitle>
            <DialogDescription>Click the link below to join the scheduled meeting.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Meeting Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={meetingLink}
                  readOnly
                  className="flex-1 p-2 text-sm border rounded bg-white"
                />
                <Button onClick={() => copyMeetingLink(meetingLink)} variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
            <div className="text-center">
              <Button
                onClick={() => {
                  window.open(meetingLink, "_blank")
                  setIsJoinModalOpen(false)
                }}
                className="w-full"
                size="lg"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Meeting Now
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoinModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
