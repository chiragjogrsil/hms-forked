"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

interface VitalSigns {
  temperature: string
  bloodPressure: string
  heartRate: string
  respiratoryRate: string
  oxygenSaturation: string
  weight: string
  height: string
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface LabTest {
  id: string
  name: string
  category: string
  urgency: "routine" | "urgent" | "stat"
  instructions?: string
}

interface RadiologyTest {
  id: string
  name: string
  category: string
  urgency: "routine" | "urgent" | "stat"
  instructions?: string
}

interface ConsultationData {
  id?: string
  patientId: string
  patientName?: string
  visitDate?: string
  visitTime?: string
  doctorId?: string
  doctorName?: string
  department?: string
  consultationType?: string

  // Clinical Data
  chiefComplaint: string
  historyOfPresentIllness: string
  pastMedicalHistory: string
  familyHistory: string
  socialHistory: string
  reviewOfSystems: string
  vitalSigns: VitalSigns
  physicalExamination: string
  assessment: string
  plan: string
  prescriptions: Prescription[]
  labTests: LabTest[]
  radiologyTests: RadiologyTest[]
  followUpInstructions: string
  nextAppointment?: Date

  // Administrative
  consultationFee?: number
  status?: "in-progress" | "completed" | "cancelled"
  createdAt?: string
  updatedAt?: string

  // Additional Notes
  doctorNotes?: string
  privateNotes?: string

  // Legacy fields for backward compatibility
  clinicalNotes?: string
  diagnosis?: string[]
  ayurvedicAnalysis?: any
  ophthalmologyAnalysis?: any

  // Additional appointment information
  appointmentDate?: string
  appointmentTime?: string

  // Next steps data from complete visit modal
  nextSteps?: {
    labTests?: string[]
    radiology?: string[]
    procedures?: string[]
    followUp?: {
      date: Date
      time: string
      notes: string
    }
    nextStepsNotes?: string
    urgentTests?: string[]
    totalCost?: number
  }
}

interface ConsultationContextType {
  // Current consultation state
  activeConsultation: ConsultationData | null
  isConsultationActive: boolean
  hasUnsavedChanges: boolean
  isConsultationSaved: boolean

  // Consultation management
  startNewConsultation: (patientId: string, patientName: string, visitDate: string, consultationInfo?: any) => void
  updateConsultationData: (updates: Partial<ConsultationData>) => void
  saveConsultation: () => Promise<boolean>
  completeConsultation: (consultationData?: any) => void
  completeVisit: () => Promise<boolean>
  cancelConsultation: () => void
  loadConsultation: (consultationId: string) => Promise<void>

  // History management
  consultationHistory: ConsultationData[]
  getPatientConsultations: (patientId: string) => ConsultationData[]
  getConsultationsByDate: (patientId: string, visitDate: string) => ConsultationData[]
  searchConsultations: (query: string) => ConsultationData[]

  // Utility functions
  resetConsultation: () => void
  validateConsultation: () => { isValid: boolean; errors: string[] }
  getConsultationSummary: () => string

  // Visit management
  hasInProgressConsultation: (patientId: string, visitDate: string) => boolean
  getInProgressConsultation: (patientId: string, visitDate: string) => ConsultationData | null
  loadInProgressConsultation: (patientId: string, visitDate: string) => Promise<void>
  hasIncompleteVisits: (patientId: string) => ConsultationData[]
  completeIncompleteVisit: (consultationId: string) => Promise<boolean>

  // Additional functions for consultation data management
  updateConsultationField: (field: keyof ConsultationData, value: any) => void
  addPrescription: (prescription: Prescription) => void
  removePrescription: (prescriptionId: string) => void
  addLabTest: (test: LabTest) => void
  removeLabTest: (testId: string) => void
  addRadiologyTest: (test: RadiologyTest) => void
  removeRadiologyTest: (testId: string) => void
  clearConsultation: () => void

  debugConsultationHistory: () => ConsultationData[]
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)

// Mock consultation history data
const mockConsultationHistory: ConsultationData[] = [
  {
    id: "CONS-P12345-2024-06-20-1718899200000",
    patientId: "P12345",
    patientName: "John Doe",
    visitDate: "2024-06-20",
    visitTime: "14:30",
    doctorName: "Dr. Sarah Wilson",
    department: "cardiology",
    consultationType: "followup",
    chiefComplaint: "Follow-up for hypertension management",
    clinicalNotes:
      "Patient reports improved blood pressure control with current medication regimen. No chest pain or shortness of breath. Compliance with medication is good.",
    provisionalDiagnosis: ["Essential Hypertension - Well Controlled"],
    vitalSigns: {
      temperature: "98.6",
      bloodPressure: "128/82",
      heartRate: "72",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "75",
      height: "175",
    },
    physicalExamination: "",
    assessment: "",
    plan: "",
    prescriptions: [
      {
        id: "1",
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Continue current dose",
      },
    ],
    labTests: [],
    radiologyTests: [],
    advice: "Continue current medication. Monitor blood pressure at home. Follow low-sodium diet.",
    status: "completed",
    createdAt: "2024-06-20T14:30:00.000Z",
    updatedAt: "2024-06-20T15:15:00.000Z",
  },
  {
    id: "CONS-P12345-2024-06-15-1718467200000",
    patientId: "P12345",
    patientName: "John Doe",
    visitDate: "2024-06-15",
    visitTime: "10:15",
    doctorName: "Dr. Michael Chen",
    department: "general",
    consultationType: "routine",
    chiefComplaint: "Annual health checkup",
    clinicalNotes:
      "Comprehensive health assessment. Patient appears well. No acute complaints. Discussed preventive care measures.",
    provisionalDiagnosis: ["Annual Health Maintenance"],
    vitalSigns: {
      temperature: "98.4",
      bloodPressure: "130/85",
      heartRate: "68",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "74",
      height: "175",
    },
    physicalExamination: "",
    assessment: "",
    plan: "",
    prescriptions: [],
    labTests: [],
    radiologyTests: [],
    advice: "Continue healthy lifestyle. Schedule follow-up in 6 months. Consider flu vaccination.",
    status: "completed",
    createdAt: "2024-06-15T10:15:00.000Z",
    updatedAt: "2024-06-15T11:00:00.000Z",
  },
  {
    id: "CONS-P12345-2024-06-10-1718035200000",
    patientId: "P12345",
    patientName: "John Doe",
    visitDate: "2024-06-10",
    visitTime: "16:45",
    doctorName: "Dr. Priya Sharma",
    department: "ayurveda",
    consultationType: "routine",
    chiefComplaint: "Digestive issues and stress management",
    clinicalNotes:
      "Patient reports occasional indigestion and work-related stress. Seeking natural remedies for overall wellness.",
    provisionalDiagnosis: ["Digestive Imbalance", "Stress-related symptoms"],
    vitalSigns: {
      temperature: "98.2",
      bloodPressure: "125/80",
      heartRate: "70",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "75",
      height: "175",
    },
    physicalExamination: "",
    assessment: "",
    plan: "",
    prescriptions: [
      {
        id: "1",
        medication: "Triphala Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "15 days",
        instructions: "Mix with warm water",
      },
      {
        id: "2",
        medication: "Brahmi Ghrita",
        dosage: "1/2 tsp",
        frequency: "Once daily",
        duration: "21 days",
        instructions: "Take with warm milk",
      },
    ],
    labTests: [],
    radiologyTests: [],
    advice: "Practice pranayama daily. Avoid spicy foods. Follow regular meal timings.",
    status: "completed",
    createdAt: "2024-06-10T16:45:00.000Z",
    updatedAt: "2024-06-10T17:30:00.000Z",
  },
  {
    id: "CONS-P12345-2024-06-05-1717603200000",
    patientId: "P12345",
    patientName: "John Doe",
    visitDate: "2024-06-05",
    visitTime: "11:20",
    doctorName: "Dr. Robert Johnson",
    department: "orthopedics",
    consultationType: "routine",
    chiefComplaint: "Lower back pain after exercise",
    clinicalNotes:
      "Patient reports mild lower back pain after recent gym sessions. No radiation to legs. Pain is mechanical in nature.",
    provisionalDiagnosis: ["Mechanical Lower Back Pain"],
    vitalSigns: {
      temperature: "98.1",
      bloodPressure: "122/78",
      heartRate: "65",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "74",
      height: "175",
    },
    physicalExamination: "",
    assessment: "",
    plan: "",
    prescriptions: [
      {
        id: "1",
        medication: "Ibuprofen",
        dosage: "400mg",
        frequency: "Twice daily",
        duration: "5 days",
        instructions: "Take with food",
      },
    ],
    labTests: [],
    radiologyTests: [],
    advice: "Apply heat therapy. Avoid heavy lifting. Start gentle stretching exercises.",
    status: "completed",
    createdAt: "2024-06-05T11:20:00.000Z",
    updatedAt: "2024-06-05T12:05:00.000Z",
  },
]

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [activeConsultation, setActiveConsultation] = useState<ConsultationData | null>(null)
  const [consultationHistory, setConsultationHistory] = useState<ConsultationData[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isConsultationSaved, setIsConsultationSaved] = useState(false)

  // Load consultation history from localStorage on mount, with fallback to mock data
  useEffect(() => {
    const savedHistory = localStorage.getItem("consultation-history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Merge with mock data if no existing history for this patient
        const hasPatientHistory = parsed.some((c: ConsultationData) => c.patientId === "P12345")
        if (!hasPatientHistory) {
          setConsultationHistory([...mockConsultationHistory, ...parsed])
        } else {
          setConsultationHistory(parsed)
        }
      } catch (error) {
        console.error("Error loading consultation history:", error)
        setConsultationHistory(mockConsultationHistory)
      }
    } else {
      // First time - use mock data
      setConsultationHistory(mockConsultationHistory)
    }
  }, [])

  // Save consultation history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("consultation-history", JSON.stringify(consultationHistory))
  }, [consultationHistory])

  const startNewConsultation = (patientId: string, patientName: string, visitDate: string, consultationInfo?: any) => {
    const now = new Date()
    const consultationDate = visitDate

    // Check for existing in-progress consultation for this date
    const existingConsultation = getInProgressConsultation(patientId, visitDate)
    if (existingConsultation) {
      // Load existing consultation instead of creating new one
      setActiveConsultation({ ...existingConsultation })
      setHasUnsavedChanges(false)
      setIsConsultationSaved(false)

      toast.info("Loaded existing consultation", {
        description: `Continuing consultation for ${new Date(visitDate).toLocaleDateString()}`,
      })
      return
    }

    const newConsultation: ConsultationData = {
      id: `CONS-${patientId}-${visitDate}-${Date.now()}`,
      patientId,
      patientName,
      visitDate: consultationDate,
      visitTime: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      doctorId: consultationInfo?.doctor || "DR001",
      doctorName: consultationInfo?.doctorName || "Dr. Smith",
      department: consultationInfo?.department || "general",
      consultationType: consultationInfo?.consultationType || "routine",

      // Store additional consultation info
      chiefComplaint: consultationInfo?.chiefComplaint || "",
      appointmentDate: consultationInfo?.appointmentDate || visitDate,
      appointmentTime:
        consultationInfo?.appointmentTime ||
        now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),

      // Clinical Data
      historyOfPresentIllness: "",
      pastMedicalHistory: "",
      familyHistory: "",
      socialHistory: "",
      reviewOfSystems: "",
      vitalSigns: {
        temperature: "",
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        weight: "",
        height: "",
      },
      physicalExamination: "",
      assessment: "",
      plan: "",
      prescriptions: [],
      labTests: [],
      radiologyTests: [],
      followUpInstructions: "",

      // Administrative
      consultationFee: 0,
      status: "in-progress",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),

      // Additional Notes
      doctorNotes: "",
      privateNotes: "",

      // Legacy fields for backward compatibility
      clinicalNotes: "",
      diagnosis: [],
      ayurvedicAnalysis: {},
      ophthalmologyAnalysis: {},
    }

    setActiveConsultation(newConsultation)
    setHasUnsavedChanges(false)
    setIsConsultationSaved(false)

    toast.success("New consultation started", {
      description: `Visit consultation for ${patientName} on ${new Date(consultationDate).toLocaleDateString()}`,
    })
  }

  const updateConsultationData = (updates: Partial<ConsultationData>) => {
    if (!activeConsultation) return

    const updatedConsultation = {
      ...activeConsultation,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    setActiveConsultation(updatedConsultation)
    setHasUnsavedChanges(true)
    setIsConsultationSaved(false)
  }

  const saveConsultation = async (): Promise<boolean> => {
    if (!activeConsultation) return false

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedConsultation = {
        ...activeConsultation,
        updatedAt: new Date().toISOString(),
      }

      // Update or add to history (but keep as in-progress)
      const existingIndex = consultationHistory.findIndex((c) => c.id === updatedConsultation.id)
      if (existingIndex >= 0) {
        const newHistory = [...consultationHistory]
        newHistory[existingIndex] = updatedConsultation
        setConsultationHistory(newHistory)
      } else {
        setConsultationHistory((prev) => [updatedConsultation, ...prev])
      }

      setActiveConsultation(updatedConsultation)
      setHasUnsavedChanges(false)
      setIsConsultationSaved(true)

      return true
    } catch (error) {
      toast.error("Failed to save consultation", {
        description: "Please try again",
      })
      return false
    }
  }

  const completeConsultation = (consultationData?: any) => {
    if (!activeConsultation) return

    const completedConsultation = {
      ...activeConsultation,
      ...consultationData,
      status: "completed" as const,
      updatedAt: new Date().toISOString(),
    }

    // Update or add to history
    const existingIndex = consultationHistory.findIndex((c) => c.id === completedConsultation.id)
    if (existingIndex >= 0) {
      const newHistory = [...consultationHistory]
      newHistory[existingIndex] = completedConsultation
      setConsultationHistory(newHistory)
    } else {
      setConsultationHistory((prev) => [completedConsultation, ...prev])
    }

    // Clear active consultation
    setActiveConsultation(null)
    setHasUnsavedChanges(false)
    setIsConsultationSaved(false)
  }

  const completeVisit = async (): Promise<boolean> => {
    if (!activeConsultation) {
      toast.error("No active consultation to complete")
      return false
    }

    // Validate consultation before completing
    const validation = validateConsultation()
    if (!validation.isValid) {
      toast.error("Cannot complete visit", {
        description: validation.errors.join(", "),
      })
      return false
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Completing visit...", {
        description: "Saving consultation data and updating records",
      })

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Ensure the consultation is saved with all current data
      const consultationToComplete = {
        ...activeConsultation,
        status: "completed" as const,
        updatedAt: new Date().toISOString(),
      }

      // Save to history as completed
      const existingIndex = consultationHistory.findIndex((c) => c.id === consultationToComplete.id)
      if (existingIndex >= 0) {
        // Update existing consultation in history
        const newHistory = [...consultationHistory]
        newHistory[existingIndex] = consultationToComplete
        setConsultationHistory(newHistory)
      } else {
        // Add new consultation to history
        setConsultationHistory((prev) => [consultationToComplete, ...prev])
      }

      // Clear active consultation
      setActiveConsultation(null)
      setHasUnsavedChanges(false)
      setIsConsultationSaved(false)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Show success toast with detailed information
      toast.success("🎉 Visit completed successfully!", {
        description: (
          <div className="space-y-1">
            <div className="font-medium">Consultation saved to patient history</div>
            <div className="text-sm opacity-90">
              Patient: {consultationToComplete.patientName}
              <br />
              Date: {new Date(consultationToComplete.visitDate!).toLocaleDateString()}
              <br />
              Department: {consultationToComplete.department}
              <br />
              Doctor: {consultationToComplete.doctorName}
            </div>
          </div>
        ),
        duration: 6000,
      })

      // Show additional info toast
      setTimeout(() => {
        toast.info("📋 Consultation History Updated", {
          description: "The completed visit is now available in the consultation history section",
          duration: 4000,
        })
      }, 1000)

      return true
    } catch (error) {
      console.error("Error completing visit:", error)
      toast.error("Failed to complete visit", {
        description: "Please try again",
      })
      return false
    }
  }

  const cancelConsultation = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to cancel this consultation?")
      if (!confirmed) return
    }

    setActiveConsultation(null)
    setHasUnsavedChanges(false)
    setIsConsultationSaved(false)

    toast.info("Consultation cancelled")
  }

  const loadConsultation = async (consultationId: string) => {
    const consultation = consultationHistory.find((c) => c.id === consultationId)
    if (consultation) {
      if (consultation.status === "completed") {
        toast.error("Cannot edit completed visit", {
          description: "This visit has been completed and moved to history",
        })
        return
      }

      setActiveConsultation({ ...consultation })
      setHasUnsavedChanges(false)
      setIsConsultationSaved(false)

      toast.success("Consultation loaded", {
        description: `Visit from ${new Date(consultation.visitDate!).toLocaleDateString()}`,
      })
    }
  }

  const resetConsultation = () => {
    setActiveConsultation(null)
    setHasUnsavedChanges(false)
    setIsConsultationSaved(false)
  }

  const validateConsultation = () => {
    if (!activeConsultation) {
      return { isValid: false, errors: ["No active consultation"] }
    }

    const errors: string[] = []

    // Make validation less strict - only require basic information
    if (!activeConsultation.chiefComplaint?.trim() && !activeConsultation.clinicalNotes?.trim()) {
      errors.push("Either chief complaint or clinical notes is required")
    }

    // Allow completion even without diagnosis if there are clinical notes
    const hasAnyDiagnosis =
      activeConsultation.provisionalDiagnosis?.length ||
      activeConsultation.diagnosis?.length ||
      activeConsultation.clinicalNotes?.trim()

    if (!hasAnyDiagnosis) {
      errors.push("Please add clinical notes, diagnosis, or consultation details")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const getPatientConsultations = (patientId: string) => {
    return consultationHistory
      .filter((c) => c.patientId === patientId)
      .sort((a, b) => new Date(b.visitDate!).getTime() - new Date(a.visitDate!).getTime())
  }

  const getConsultationsByDate = (patientId: string, visitDate: string) => {
    return consultationHistory
      .filter((c) => c.patientId === patientId && c.visitDate === visitDate)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
  }

  const searchConsultations = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return consultationHistory.filter(
      (c) =>
        c.patientName?.toLowerCase().includes(lowercaseQuery) ||
        c.chiefComplaint?.toLowerCase().includes(lowercaseQuery) ||
        c.provisionalDiagnosis?.some((d) => d.toLowerCase().includes(lowercaseQuery)) ||
        c.diagnosis?.some((d) => d.toLowerCase().includes(lowercaseQuery)) ||
        c.visitDate?.includes(query),
    )
  }

  const getConsultationSummary = () => {
    if (!activeConsultation) return ""

    const { patientName, visitDate, chiefComplaint, provisionalDiagnosis, diagnosis } = activeConsultation
    const diagnosisList = provisionalDiagnosis?.length ? provisionalDiagnosis : diagnosis || []
    return `${patientName} - ${new Date(visitDate!).toLocaleDateString()} - ${chiefComplaint} - ${diagnosisList.join(", ")}`
  }

  const hasInProgressConsultation = (patientId: string, visitDate: string): boolean => {
    return consultationHistory.some(
      (consultation) =>
        consultation.patientId === patientId &&
        consultation.visitDate === visitDate &&
        consultation.status === "in-progress",
    )
  }

  const getInProgressConsultation = (patientId: string, visitDate: string): ConsultationData | null => {
    return (
      consultationHistory.find(
        (consultation) =>
          consultation.patientId === patientId &&
          consultation.visitDate === visitDate &&
          consultation.status === "in-progress",
      ) || null
    )
  }

  const loadInProgressConsultation = async (patientId: string, visitDate: string) => {
    const consultation = getInProgressConsultation(patientId, visitDate)
    if (consultation) {
      setActiveConsultation({ ...consultation })
      setHasUnsavedChanges(false)
      setIsConsultationSaved(false)

      toast.success("Consultation loaded", {
        description: `Continuing visit from ${new Date(consultation.visitDate!).toLocaleDateString()}`,
      })
    } else {
      toast.error("No in-progress consultation found for this date")
    }
  }

  const hasIncompleteVisits = (patientId: string): ConsultationData[] => {
    return consultationHistory.filter(
      (consultation) => consultation.patientId === patientId && consultation.status === "in-progress",
    )
  }

  const completeIncompleteVisit = async (consultationId: string): Promise<boolean> => {
    const consultation = consultationHistory.find((c) => c.id === consultationId)
    if (!consultation) return false

    try {
      const completedConsultation = {
        ...consultation,
        status: "completed" as const,
        updatedAt: new Date().toISOString(),
      }

      const existingIndex = consultationHistory.findIndex((c) => c.id === consultationId)
      if (existingIndex >= 0) {
        const newHistory = [...consultationHistory]
        newHistory[existingIndex] = completedConsultation
        setConsultationHistory(newHistory)
      }

      toast.success("Previous visit completed", {
        description: `Visit from ${new Date(consultation.visitDate!).toLocaleDateString()} has been completed`,
      })

      return true
    } catch (error) {
      toast.error("Failed to complete previous visit")
      return false
    }
  }

  const updateConsultationField = (field: keyof ConsultationData, value: any) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        [field]: value,
      })
    }
  }

  const addPrescription = (prescription: Prescription) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        prescriptions: [...activeConsultation.prescriptions, prescription],
      })
    }
  }

  const removePrescription = (prescriptionId: string) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        prescriptions: activeConsultation.prescriptions.filter((p) => p.id !== prescriptionId),
      })
    }
  }

  const addLabTest = (test: LabTest) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        labTests: [...activeConsultation.labTests, test],
      })
    }
  }

  const removeLabTest = (testId: string) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        labTests: activeConsultation.labTests.filter((t) => t.id !== testId),
      })
    }
  }

  const addRadiologyTest = (test: RadiologyTest) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        radiologyTests: [...activeConsultation.radiologyTests, test],
      })
    }
  }

  const removeRadiologyTest = (testId: string) => {
    if (activeConsultation) {
      setActiveConsultation({
        ...activeConsultation,
        radiologyTests: activeConsultation.radiologyTests.filter((t) => t.id !== testId),
      })
    }
  }

  const clearConsultation = () => {
    setActiveConsultation(null)
  }

  // Add this function to the context value
  const debugConsultationHistory = () => {
    console.log("Current consultation history:", consultationHistory)
    console.log("Active consultation:", activeConsultation)
    return consultationHistory
  }

  // Add it to the return value:
  return (
    <ConsultationContext.Provider
      value={{
        activeConsultation,
        isConsultationActive: !!activeConsultation,
        hasUnsavedChanges,
        isConsultationSaved,
        startNewConsultation,
        updateConsultationData,
        saveConsultation,
        completeConsultation,
        completeVisit,
        cancelConsultation,
        loadConsultation,
        consultationHistory,
        getPatientConsultations,
        getConsultationsByDate,
        searchConsultations,
        resetConsultation,
        validateConsultation,
        getConsultationSummary,
        hasInProgressConsultation,
        getInProgressConsultation,
        loadInProgressConsultation,
        hasIncompleteVisits,
        completeIncompleteVisit,
        updateConsultationField,
        addPrescription,
        removePrescription,
        addLabTest,
        removeLabTest,
        addRadiologyTest,
        removeRadiologyTest,
        clearConsultation,
        debugConsultationHistory,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  )
}

export function useConsultation() {
  const context = useContext(ConsultationContext)
  if (context === undefined) {
    throw new Error("useConsultation must be used within a ConsultationProvider")
  }
  return context
}
