"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, TestTube, Zap, FileTextIcon, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"

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
      consultationType: "routine",\
