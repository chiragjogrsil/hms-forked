"use client"

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
  Clock,
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
} from "lucide-react"
import { IntegratedConsultation } from "@/components/integrated-consultation"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"
import { LaboratorySection } from "@/components/laboratory-section"
import { RadiologySection } from "@/components/radiology-section"
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
  }

  const handleCompleteVisit = async () => {
    if (!activeConsultation) {
      toast.error("No active consultation to complete")
      return
    }

    try {
      // First ensure current data is saved
      if (hasUnsavedChanges) {
        const saveSuccess = await saveConsultation()
        if (!saveSuccess) {
          toast.error("Failed to save consultation data")
          return
        }
      }

      // Then complete the visit
      const success = await completeVisit()
      if (success) {
        // Force refresh of consultation key to clear any cached data
        setConsultationKey((prev) => prev + 1)

        // Automatically switch to consultation tab to show updated history
        setTimeout(() => {
          setActiveTab("consultation")
        }, 2000)
      }
    } catch (error) {
      console.error("Error in handleCompleteVisit:", error)
      toast.error("Failed to complete visit")
    }
  }

  const handleStartNewConsultation = () => {
    setIsVisitCompletionModalOpen(false)
    setIsNewConsultationModalOpen(true)
  }

  const handleViewHistory = () => {
    setIsVisitCompletionModalOpen(false)
    // Stay on consultation tab to show history
    setActiveTab("consultation")
  }

  const handleCompleteIncompleteVisit = async (consultationId: string) => {
    const success = await completeIncompleteVisit(consultationId)
    if (success) {
      // Update the incomplete visits list
      const updatedIncomplete = hasIncompleteVisits(patientId)
      setIncompleteVisits(updatedIncomplete)

      // If no more incomplete visits, close the modal
      if (updatedIncomplete.length === 0) {
        setIsIncompleteVisitsModalOpen(false)
        setIsNewConsultationModalOpen(true)
      }
    }
  }

  const hasConsultationData = () => {
    if (!activeConsultation) return false

    return (
      activeConsultation.prescriptions?.ayurvedic?.length > 0 ||
      activeConsultation.prescriptions?.allopathic?.length > 0 ||
      activeConsultation.clinicalNotes ||
      activeConsultation.chiefComplaint ||
      activeConsultation.provisionalDiagnosis?.length > 0 ||
      activeConsultation.diagnosis?.length > 0 ||
      Object.keys(activeConsultation.vitals || {}).length > 0
    )
  }

  const getConsultationSummary = () => {
    if (!activeConsultation) return null

    const department =
      departmentLabels[activeConsultation.department as keyof typeof departmentLabels] || activeConsultation.department
    const type =
      consultationTypeLabels[activeConsultation.consultationType as keyof typeof consultationTypeLabels] ||
      activeConsultation.consultationType

    return {
      department,
      type,
      visitDate: activeConsultation.visitDate,
      hasData: hasConsultationData(),
    }
  }

  const summary = getConsultationSummary()

  const handleGenerateCertificate = () => {
    toast.success("Medical certificate generated successfully", {
      description: "Certificate is ready for download and printing",
    })
    setIsMedicalCertificateOpen(false)
    setCertificateData({
      ailment: "",
      duration: "",
      recommendations: "",
      issueDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleGenerateConsentForm = () => {
    toast.success("Consent form generated successfully", {
      description: "Consent form is ready for patient signature",
    })
    setIsConsentFormOpen(false)
    setConsentData({
      procedureName: "",
      procedureDuration: "",
      procedureDate: new Date().toISOString().split("T")[0],
      additionalNotes: "",
    })
  }

  // Get patient's consultation history (completed visits only)
  const patientConsultations = getPatientConsultations(patientId).filter((c) => c.status === "completed")
  const inProgressConsultations = getPatientConsultations(patientId).filter((c) => c.status === "in-progress")

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockPatient.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{mockPatient.age} years old</span>
                  <span>•</span>
                  <span>{mockPatient.gender}</span>
                  <span>•</span>
                  <span>Blood Group: {mockPatient.bloodGroup}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleNewConsultation} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultation">
            Consultation & History
            {isConsultationActive && <div className="ml-2 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />}
            {patientConsultations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {patientConsultations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview content - keeping the existing overview content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal & Contact Information */}
            <div className="space-y-6">
              {/* Personal Information Card */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-teal-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                    <p className="text-sm text-slate-600">Basic patient details</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-600">Age</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800 ml-4">{mockPatient.age} years</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-600">Gender</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800 ml-4">{mockPatient.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-600">Blood Group</span>
                    </div>
                    <p className="text-lg font-semibold text-red-600 ml-4">{mockPatient.bloodGroup}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-600">Patient ID</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800 ml-4">{mockPatient.id}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>
                    <p className="text-sm text-slate-600">Communication details</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white/60 rounded-lg border border-slate-100">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600">Phone Number</p>
                      <p className="text-base font-semibold text-slate-800">{mockPatient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/60 rounded-lg border border-slate-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600">Email Address</p>
                      <p className="text-base font-semibold text-slate-800">{mockPatient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 bg-white/60 rounded-lg border border-slate-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600">Address</p>
                      <p className="text-base font-semibold text-slate-800">{mockPatient.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="bg-gradient-to-br from-orange-50 via-white to-red-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-sm">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Emergency Contact</h3>
                    <p className="text-sm text-slate-600">In case of emergency</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Contact Person</p>
                      <p className="text-lg font-semibold text-slate-800">{mockPatient.emergencyContact.name}</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                      {mockPatient.emergencyContact.relationship}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-slate-100">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">{mockPatient.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Medical Information & Actions */}
            <div className="space-y-6">
              {/* Medical Information Card */}
              <div className="bg-gradient-to-br from-green-50 via-white to-teal-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Medical Information</h3>
                    <p className="text-sm text-slate-600">Health records & history</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Allergies Section */}
                  <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-semibold text-red-800">Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockPatient.allergies.map((allergy, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Medical History Section */}
                  <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <History className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">Medical History</span>
                    </div>
                    <div className="space-y-2">
                      {mockPatient.medicalHistory.map((condition, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-white/60 rounded-md">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-slate-700">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Medications Section */}
                  <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <TestTube className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Current Medications</span>
                    </div>
                    <div className="space-y-2">
                      {mockPatient.currentMedications.map((medication, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-white/60 rounded-md">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-slate-700">{medication}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Documents Card */}
              <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FileTextIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Medical Documents</h3>
                    <p className="text-sm text-slate-600">Generate certificates & forms</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={() => setIsMedicalCertificateOpen(true)}
                    className="justify-start h-auto p-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-white">Medical Certificate</p>
                        <p className="text-sm text-slate-200">Generate medical certificate for patient</p>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => setIsConsentFormOpen(true)}
                    className="justify-start h-auto p-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-white">Consent Form</p>
                        <p className="text-sm text-slate-200">Generate consent form for procedures</p>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Patient Summary</h3>
                    <p className="text-sm text-slate-600">Quick overview stats</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <div className="text-2xl font-bold text-teal-600">{patientConsultations.length}</div>
                    <div className="text-sm text-teal-700 font-medium">Completed Visits</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="text-2xl font-bold text-orange-600">{inProgressConsultations.length}</div>
                    <div className="text-sm text-orange-700 font-medium">In Progress</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-600">{mockPatient.currentMedications.length}</div>
                    <div className="text-sm text-green-700 font-medium">Active Medications</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">{mockPatient.allergies.length}</div>
                    <div className="text-sm text-blue-700 font-medium">Known Allergies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="consultation" className="space-y-6">
          {isConsultationActive && summary && (
            <Card className="border-teal-200 bg-gradient-to-r from-slate-50 to-teal-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100/70 rounded-full">
                      <Stethoscope className="h-5 w-5 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-800">Active Consultation</h3>
                      <p className="text-sm text-teal-600">
                        {summary.department} {summary.type} for visit on{" "}
                        {new Date(summary.visitDate!).toLocaleDateString()}
                        {hasUnsavedChanges && " - Auto-saving changes"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                      In Progress
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {isConsultationActive ? (
            <div className="space-y-6">
              <IntegratedConsultation
                key={consultationKey}
                patientId={patientId}
                patientData={mockPatient}
                department={activeConsultation?.department || "general"}
                doctorName={activeConsultation?.doctorName || "Dr. Smith"}
                onCompleteVisit={handleCompleteVisit}
              />

              {/* History Section */}
              {patientConsultations.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <History className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">Previous Visits</h3>
                        <p className="text-sm text-slate-600">Completed consultation history</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      {patientConsultations.length} completed visits
                    </Badge>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {patientConsultations.map((consultation, index) => (
                      <div
                        key={consultation.id}
                        className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                              <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {consultation.chiefComplaint || "General Consultation"}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(consultation.visitDate!).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{consultation.visitTime}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                  {consultation.doctorName}
                                </Badge>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  {departmentLabels[consultation.department as keyof typeof departmentLabels] ||
                                    consultation.department}
                                </Badge>
                              </div>
                              {(consultation.provisionalDiagnosis?.length || consultation.diagnosis?.length) && (
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-slate-600">Diagnosis: </span>
                                  <span className="text-sm text-slate-700">
                                    {(consultation.provisionalDiagnosis || consultation.diagnosis || []).join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* No Active Consultation */}
              <Card>
                <CardContent className="text-center py-12">
                  <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Consultation</h3>
                  <p className="text-muted-foreground mb-6">
                    Start a new consultation to begin documenting the patient visit
                  </p>
                  <Button onClick={handleNewConsultation} className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Consultation
                  </Button>
                </CardContent>
              </Card>

              {/* History Section */}
              <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                      <History className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">Consultation History</h3>
                      <p className="text-sm text-slate-600">Complete medical consultation records</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {patientConsultations.length} consultations
                  </Badge>
                </div>

                <div className="space-y-4">
                  {patientConsultations.length > 0 ? (
                    patientConsultations.map((consultation, index) => (
                      <div
                        key={consultation.id}
                        className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                              <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {consultation.chiefComplaint || "General Consultation"}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(consultation.visitDate!).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{consultation.visitTime}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                  {consultation.doctorName}
                                </Badge>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  {departmentLabels[consultation.department as keyof typeof departmentLabels] ||
                                    consultation.department}
                                </Badge>
                                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                  {consultationTypeLabels[
                                    consultation.consultationType as keyof typeof consultationTypeLabels
                                  ] || consultation.consultationType}
                                </Badge>
                              </div>
                              {(consultation.provisionalDiagnosis?.length || consultation.diagnosis?.length) && (
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-slate-600">Diagnosis: </span>
                                  <span className="text-sm text-slate-700">
                                    {(consultation.provisionalDiagnosis || consultation.diagnosis || []).join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="text-slate-600 font-medium">No consultation history yet</p>
                      <p className="text-sm text-slate-500 mt-1">Completed consultations will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="bg-gradient-to-br from-teal-50 via-white to-blue-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Medical Services</h3>
                <p className="text-sm text-slate-600">Laboratory tests and radiology services</p>
              </div>
            </div>
            <Tabs defaultValue="laboratory" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1 rounded-lg">
                <TabsTrigger
                  value="laboratory"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TestTube className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:inline">Laboratory</span>
                </TabsTrigger>
                <TabsTrigger
                  value="radiology"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="hidden sm:inline">Radiology</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="laboratory" className="mt-6">
                <LaboratorySection />
              </TabsContent>

              <TabsContent value="radiology" className="mt-6">
                <RadiologySection patientId={patientId} patientName={mockPatient.name} />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="telemedicine" className="space-y-6">
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Telemedicine</h3>
            <p className="text-muted-foreground">Virtual consultation features coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Invoices</h3>
            <p className="text-muted-foreground">Billing and payment records coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50/30 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FileTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Medical Reports</h3>
                  <p className="text-sm text-slate-600">All completed service reports for {mockPatient.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-100/50 p-1 rounded-lg">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  All Reports
                </TabsTrigger>
                <TabsTrigger value="laboratory" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Laboratory
                </TabsTrigger>
                <TabsTrigger value="radiology" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Radiology
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Consultation
                </TabsTrigger>
                <TabsTrigger value="discharge" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Discharge
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {mockReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${getReportTypeColor(report.type)}`}
                          >
                            {getReportTypeIcon(report.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{report.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(report.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{report.doctor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="h-4 w-4" />
                                <span>{report.department}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={getReportStatusBadge(report.status)}>
                                {report.status}
                              </Badge>
                              <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                                {report.type}
                              </Badge>
                              {report.priority && (
                                <Badge variant="outline" className={getPriorityBadge(report.priority)}>
                                  {report.priority}
                                </Badge>
                              )}
                            </div>
                            {report.summary && (
                              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{report.summary}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-300 hover:bg-slate-50 bg-transparent"
                          >
                            <FileTextIcon className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-300 hover:bg-slate-50 bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-300 hover:bg-slate-50 bg-transparent"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="laboratory" className="mt-6">
                <div className="space-y-4">
                  {mockReports
                    .filter((report) => report.type === "Laboratory")
                    .map((report) => (
                      <div
                        key={report.id}
                        className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                              <TestTube className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{report.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{report.doctor}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={getReportStatusBadge(report.status)}>
                                  {report.status}
                                </Badge>
                                {report.priority && (
                                  <Badge variant="outline" className={getPriorityBadge(report.priority)}>
                                    {report.priority}
                                  </Badge>
                                )}
                              </div>
                              {report.summary && <p className="text-sm text-slate-600 mt-2">{report.summary}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="radiology" className="mt-6">
                <div className="space-y-4">
                  {mockReports
                    .filter((report) => report.type === "Radiology")
                    .map((report) => (
                      <div
                        key={report.id}
                        className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                              <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{report.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{report.doctor}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={getReportStatusBadge(report.status)}>
                                  {report.status}
                                </Badge>
                                {report.priority && (
                                  <Badge variant="outline" className={getPriorityBadge(report.priority)}>
                                    {report.priority}
                                  </Badge>
                                )}
                              </div>
                              {report.summary && <p className="text-sm text-slate-600 mt-2">{report.summary}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Images
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="consultation" className="mt-6">
                <div className="space-y-4">
                  {mockReports
                    .filter((report) => report.type === "Consultation")
                    .map((report) => (
                      <div
                        key={report.id}
                        className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                              <Stethoscope className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{report.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{report.doctor}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={getReportStatusBadge(report.status)}>
                                  {report.status}
                                </Badge>
                                {report.priority && (
                                  <Badge variant="outline" className={getPriorityBadge(report.priority)}>
                                    {report.priority}
                                  </Badge>
                                )}
                              </div>
                              {report.summary && <p className="text-sm text-slate-600 mt-2">{report.summary}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Report
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="discharge" className="mt-6">
                <div className="space-y-4">
                  {mockReports
                    .filter((report) => report.type === "Discharge")
                    .map((report) => (
                      <div
                        key={report.id}
                        className="bg-white/60 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{report.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{report.doctor}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={getReportStatusBadge(report.status)}>
                                  {report.status}
                                </Badge>
                                {report.priority && (
                                  <Badge variant="outline" className={getPriorityBadge(report.priority)}>
                                    {report.priority}
                                  </Badge>
                                )}
                              </div>
                              {report.summary && <p className="text-sm text-slate-600 mt-2">{report.summary}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View Summary
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-300 hover:bg-slate-50 bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            {mockReports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileTextIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No Reports Available</h3>
                <p className="text-slate-600">Medical reports will appear here once services are completed</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Consultation Modal */}
      <Dialog open={isNewConsultationModalOpen} onOpenChange={setIsNewConsultationModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              New Consultation
            </DialogTitle>
            <DialogDescription>Start a new consultation for {mockPatient.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Patient Information</span>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {mockPatient.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Patient ID:</strong> {mockPatient.id}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Doctor</span>
              </div>
              <p className="text-sm text-blue-700">
                <strong>{newConsultationData.doctorName}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={newConsultationData.department}
                onValueChange={(value) => setNewConsultationData({ ...newConsultationData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(departmentLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationType">Consultation Type *</Label>
              <Select
                value={newConsultationData.consultationType}
                onValueChange={(value) => setNewConsultationData({ ...newConsultationData, consultationType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select consultation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="followup">Follow up</SelectItem>
                  <SelectItem value="routine">Routine checkup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConsultationModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateConsultation}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={!newConsultationData.department || !newConsultationData.consultationType}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Incomplete Visits Modal */}
      <Dialog open={isIncompleteVisitsModalOpen} onOpenChange={setIsIncompleteVisitsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Incomplete Visits Found
            </DialogTitle>
            <DialogDescription>
              This patient has incomplete visits that need to be completed before starting a new consultation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-60 overflow-y-auto">
            {incompleteVisits.map((visit) => (
              <div key={visit.id} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-orange-800">{visit.chiefComplaint || "General Consultation"}</p>
                    <p className="text-sm text-orange-600">
                      {new Date(visit.visitDate).toLocaleDateString()} - {visit.doctorName}
                    </p>
                    <p className="text-sm text-orange-600">
                      Department:{" "}
                      {departmentLabels[visit.department as keyof typeof departmentLabels] || visit.department}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteIncompleteVisit(visit.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Complete Visit
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

      {/* Medical Certificate Modal */}
      <Dialog open={isMedicalCertificateOpen} onOpenChange={setIsMedicalCertificateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Medical Certificate</DialogTitle>
            <DialogDescription>Create a medical certificate for {mockPatient.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ailment">Medical Condition/Ailment *</Label>
              <input
                id="ailment"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={certificateData.ailment}
                onChange={(e) => setCertificateData({ ...certificateData, ailment: e.target.value })}
                placeholder="e.g., Acute respiratory infection"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Rest Duration *</Label>
              <input
                id="duration"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={certificateData.duration}
                onChange={(e) => setCertificateData({ ...certificateData, duration: e.target.value })}
                placeholder="e.g., 3 days"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendations">Medical Recommendations</Label>
              <textarea
                id="recommendations"
                className="w-full p-2 border border-gray-300 rounded-md h-20"
                value={certificateData.recommendations}
                onChange={(e) => setCertificateData({ ...certificateData, recommendations: e.target.value })}
                placeholder="Additional medical recommendations..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <input
                id="issueDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={certificateData.issueDate}
                onChange={(e) => setCertificateData({ ...certificateData, issueDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMedicalCertificateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateCertificate}
              disabled={!certificateData.ailment || !certificateData.duration}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Generate Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consent Form Modal */}
      <Dialog open={isConsentFormOpen} onOpenChange={setIsConsentFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Consent Form</DialogTitle>
            <DialogDescription>Create a consent form for medical procedure</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="procedureName">Procedure Name *</Label>
              <input
                id="procedureName"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={consentData.procedureName}
                onChange={(e) => setConsentData({ ...consentData, procedureName: e.target.value })}
                placeholder="e.g., Minor surgical procedure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedureDuration">Expected Duration *</Label>
              <input
                id="procedureDuration"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={consentData.procedureDuration}
                onChange={(e) => setConsentData({ ...consentData, procedureDuration: e.target.value })}
                placeholder="e.g., 30-45 minutes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedureDate">Procedure Date *</Label>
              <input
                id="procedureDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={consentData.procedureDate}
                onChange={(e) => setConsentData({ ...consentData, procedureDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <textarea
                id="additionalNotes"
                className="w-full p-2 border border-gray-300 rounded-md h-20"
                value={consentData.additionalNotes}
                onChange={(e) => setConsentData({ ...consentData, additionalNotes: e.target.value })}
                placeholder="Any additional information or special instructions..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsentFormOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateConsentForm}
              disabled={!consentData.procedureName || !consentData.procedureDuration}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Generate Consent Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
