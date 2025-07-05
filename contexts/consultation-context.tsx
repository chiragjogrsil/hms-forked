"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { toast } from "sonner"

interface ConsultationData {
  id?: string
  patientId?: string
  patientName?: string
  visitDate?: string
  visitTime?: string
  doctorId?: string
  doctorName?: string
  department?: string
  consultationType?: string

  // Clinical Data
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string[]
  familyHistory?: string
  socialHistory?: string
  allergies?: string[]
  currentMedications?: string[]

  // Physical Examination
  vitals?: {
    bloodPressure?: string
    pulse?: string
    temperature?: string
    respiratoryRate?: string
    spo2?: string
    weight?: string
    height?: string
    bmi?: string
  }

  // System Review
  systemReview?: {
    cardiovascular?: string
    respiratory?: string
    gastrointestinal?: string
    neurological?: string
    musculoskeletal?: string
    genitourinary?: string
    endocrine?: string
    dermatological?: string
  }

  // Clinical Assessment
  clinicalFindings?: string
  provisionalDiagnosis?: string[]
  differentialDiagnosis?: string[]

  // Investigations
  investigationsOrdered?: Array<{
    id: string
    category: string
    test: string
    urgency: string
    notes?: string
  }>

  // Treatment Plan
  prescriptions?: {
    ayurvedic?: Array<{
      id: string
      medicine: string
      dosage: string
      frequency: string
      duration: string
      instructions: string
      beforeAfterFood: string
    }>
    allopathic?: Array<{
      id: string
      medicine: string
      dosage: string
      frequency: string
      duration: string
      instructions: string
      beforeAfterFood: string
    }>
  }

  // Follow-up and Advice
  advice?: string
  followUpDate?: string
  followUpInstructions?: string

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

  debugConsultationHistory: () => ConsultationData[]
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)

// Enhanced mock consultation history data with comprehensive test scenarios
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
    chiefComplaint: "Follow-up for hypertension management and chest discomfort",
    clinicalNotes:
      "Patient reports improved blood pressure control with current medication regimen. Occasional mild chest discomfort on exertion, no chest pain at rest. Compliance with medication is excellent. Patient has been following dietary recommendations and regular exercise routine. No shortness of breath or palpitations reported.",
    provisionalDiagnosis: ["Essential Hypertension - Well Controlled", "Atypical Chest Pain - Stable"],
    vitals: {
      bloodPressure: "128/82",
      pulse: "72",
      temperature: "98.6",
      respiratoryRate: "16",
      spo2: "98",
      weight: "75",
      height: "175",
      bmi: "24.5",
    },
    prescriptions: {
      allopathic: [
        {
          id: "1",
          medicine: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Continue current dose, monitor BP at home",
          beforeAfterFood: "before",
        },
        {
          id: "2",
          medicine: "Aspirin",
          dosage: "75mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take with food to prevent gastric irritation",
          beforeAfterFood: "after",
        },
      ],
      ayurvedic: [],
    },
    advice:
      "Continue current medication. Monitor blood pressure at home twice weekly. Follow low-sodium diet (<2g/day). Regular moderate exercise 30 minutes daily. Return if chest pain worsens or becomes frequent.",
    followUpInstructions: "Follow-up in 4 weeks or sooner if symptoms worsen",
    status: "completed",
    createdAt: "2024-06-20T14:30:00.000Z",
    updatedAt: "2024-06-20T15:15:00.000Z",
  },
]

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [activeConsultation, setActiveConsultation] = useState<ConsultationData | null>(null)
  const [consultationHistory, setConsultationHistory] = useState<ConsultationData[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isConsultationSaved, setIsConsultationSaved] = useState(false)

  // Use ref to prevent infinite loops during updates
  const isUpdatingRef = useRef(false)

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
    if (consultationHistory.length > 0) {
      localStorage.setItem("consultation-history", JSON.stringify(consultationHistory))
    }
  }, [consultationHistory])

  const startNewConsultation = useCallback(
    (patientId: string, patientName: string, visitDate: string, consultationInfo?: any) => {
      const now = new Date()
      const consultationDate = visitDate

      // Check for existing in-progress consultation for this date
      const existingConsultation = consultationHistory.find(
        (consultation) =>
          consultation.patientId === patientId &&
          consultation.visitDate === visitDate &&
          consultation.status === "in-progress",
      )

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
        pastMedicalHistory: [],
        familyHistory: "",
        socialHistory: "",
        allergies: [],
        currentMedications: [],

        // Physical Examination
        vitals: {},

        // System Review
        systemReview: {},

        // Clinical Assessment
        clinicalFindings: "",
        provisionalDiagnosis: [],
        differentialDiagnosis: [],

        // Investigations
        investigationsOrdered: [],

        // Treatment Plan
        prescriptions: {
          ayurvedic: [],
          allopathic: [],
        },

        // Follow-up and Advice
        advice: "",
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
    },
    [consultationHistory],
  )

  const updateConsultationData = useCallback((updates: Partial<ConsultationData>) => {
    // Prevent infinite loops during updates
    if (isUpdatingRef.current) return

    setActiveConsultation((prev) => {
      if (!prev) return null

      isUpdatingRef.current = true

      const updated = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 100)

      return updated
    })

    setHasUnsavedChanges(true)
    setIsConsultationSaved(false)
  }, [])

  const saveConsultation = useCallback(async (): Promise<boolean> => {
    if (!activeConsultation) return false

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedConsultation = {
        ...activeConsultation,
        updatedAt: new Date().toISOString(),
      }

      // Update or add to history (but keep as in-progress)
      setConsultationHistory((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === updatedConsultation.id)
        if (existingIndex >= 0) {
          const newHistory = [...prev]
          newHistory[existingIndex] = updatedConsultation
          return newHistory
        } else {
          return [updatedConsultation, ...prev]
        }
      })

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
  }, [activeConsultation])

  const completeConsultation = useCallback(
    (consultationData?: any) => {
      if (!activeConsultation) return

      const completedConsultation = {
        ...activeConsultation,
        ...consultationData,
        status: "completed" as const,
        updatedAt: new Date().toISOString(),
      }

      // Update or add to history
      setConsultationHistory((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === completedConsultation.id)
        if (existingIndex >= 0) {
          const newHistory = [...prev]
          newHistory[existingIndex] = completedConsultation
          return newHistory
        } else {
          return [completedConsultation, ...prev]
        }
      })

      // Clear active consultation
      setActiveConsultation(null)
      setHasUnsavedChanges(false)
      setIsConsultationSaved(false)
    },
    [activeConsultation],
  )

  const completeVisit = useCallback(async (): Promise<boolean> => {
    if (!activeConsultation) {
      toast.error("No active consultation to complete")
      return false
    }

    // Simple validation - just check if there's some content
    const hasContent =
      activeConsultation.chiefComplaint?.trim() ||
      activeConsultation.clinicalNotes?.trim() ||
      activeConsultation.provisionalDiagnosis?.length ||
      activeConsultation.diagnosis?.length

    if (!hasContent) {
      toast.error("Cannot complete visit", {
        description: "Please add some consultation details before completing",
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
      setConsultationHistory((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === consultationToComplete.id)
        if (existingIndex >= 0) {
          // Update existing consultation in history
          const newHistory = [...prev]
          newHistory[existingIndex] = consultationToComplete
          return newHistory
        } else {
          // Add new consultation to history
          return [consultationToComplete, ...prev]
        }
      })

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

      return true
    } catch (error) {
      console.error("Error completing visit:", error)
      toast.error("Failed to complete visit", {
        description: "Please try again",
      })
      return false
    }
  }, [activeConsultation])

  const cancelConsultation = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to cancel this consultation?")
      if (!confirmed) return
    }

    setActiveConsultation(null)
    setHasUnsavedChanges(false)
    setIsConsultationSaved(false)

    toast.info("Consultation cancelled")
  }, [hasUnsavedChanges])

  const loadConsultation = useCallback(
    async (consultationId: string) => {
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
    },
    [consultationHistory],
  )

  const resetConsultation = useCallback(() => {
    setActiveConsultation(null)
    setHasUnsavedChanges(false)
    setIsConsultationSaved(false)
  }, [])

  const validateConsultation = useCallback(() => {
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
  }, [activeConsultation])

  const getPatientConsultations = useCallback(
    (patientId: string) => {
      return consultationHistory
        .filter((c) => c.patientId === patientId)
        .sort((a, b) => new Date(b.visitDate!).getTime() - new Date(a.visitDate!).getTime())
    },
    [consultationHistory],
  )

  const getConsultationsByDate = useCallback(
    (patientId: string, visitDate: string) => {
      return consultationHistory
        .filter((c) => c.patientId === patientId && c.visitDate === visitDate)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    },
    [consultationHistory],
  )

  const searchConsultations = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase()
      return consultationHistory.filter(
        (c) =>
          c.patientName?.toLowerCase().includes(lowercaseQuery) ||
          c.chiefComplaint?.toLowerCase().includes(lowercaseQuery) ||
          c.provisionalDiagnosis?.some((d) => d.toLowerCase().includes(lowercaseQuery)) ||
          c.diagnosis?.some((d) => d.toLowerCase().includes(lowercaseQuery)) ||
          c.visitDate?.includes(query),
      )
    },
    [consultationHistory],
  )

  const getConsultationSummary = useCallback(() => {
    if (!activeConsultation) return ""

    const { patientName, visitDate, chiefComplaint, provisionalDiagnosis, diagnosis } = activeConsultation
    const diagnosisList = provisionalDiagnosis?.length ? provisionalDiagnosis : diagnosis || []
    return `${patientName} - ${new Date(visitDate!).toLocaleDateString()} - ${chiefComplaint} - ${diagnosisList.join(", ")}`
  }, [activeConsultation])

  const hasInProgressConsultation = useCallback(
    (patientId: string, visitDate: string): boolean => {
      return consultationHistory.some(
        (consultation) =>
          consultation.patientId === patientId &&
          consultation.visitDate === visitDate &&
          consultation.status === "in-progress",
      )
    },
    [consultationHistory],
  )

  const getInProgressConsultation = useCallback(
    (patientId: string, visitDate: string): ConsultationData | null => {
      return (
        consultationHistory.find(
          (consultation) =>
            consultation.patientId === patientId &&
            consultation.visitDate === visitDate &&
            consultation.status === "in-progress",
        ) || null
      )
    },
    [consultationHistory],
  )

  const loadInProgressConsultation = useCallback(
    async (patientId: string, visitDate: string) => {
      const consultation = consultationHistory.find(
        (consultation) =>
          consultation.patientId === patientId &&
          consultation.visitDate === visitDate &&
          consultation.status === "in-progress",
      )

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
    },
    [consultationHistory],
  )

  const hasIncompleteVisits = useCallback(
    (patientId: string): ConsultationData[] => {
      return consultationHistory.filter(
        (consultation) => consultation.patientId === patientId && consultation.status === "in-progress",
      )
    },
    [consultationHistory],
  )

  const completeIncompleteVisit = useCallback(
    async (consultationId: string): Promise<boolean> => {
      const consultation = consultationHistory.find((c) => c.id === consultationId)
      if (!consultation) return false

      try {
        const completedConsultation = {
          ...consultation,
          status: "completed" as const,
          updatedAt: new Date().toISOString(),
        }

        setConsultationHistory((prev) => {
          const existingIndex = prev.findIndex((c) => c.id === consultationId)
          if (existingIndex >= 0) {
            const newHistory = [...prev]
            newHistory[existingIndex] = completedConsultation
            return newHistory
          }
          return prev
        })

        toast.success("Previous visit completed", {
          description: `Visit from ${new Date(consultation.visitDate!).toLocaleDateString()} has been completed`,
        })

        return true
      } catch (error) {
        toast.error("Failed to complete previous visit")
        return false
      }
    },
    [consultationHistory],
  )

  const debugConsultationHistory = useCallback(() => {
    console.log("Current consultation history:", consultationHistory)
    console.log("Active consultation:", activeConsultation)
    return consultationHistory
  }, [consultationHistory, activeConsultation])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useCallback(
    () => ({
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
      debugConsultationHistory,
    }),
    [
      activeConsultation,
      hasUnsavedChanges,
      isConsultationSaved,
      consultationHistory,
      startNewConsultation,
      updateConsultationData,
      saveConsultation,
      completeConsultation,
      completeVisit,
      cancelConsultation,
      loadConsultation,
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
      debugConsultationHistory,
    ],
  )

  return <ConsultationContext.Provider value={contextValue()}>{children}</ConsultationContext.Provider>
}

export function useConsultation() {
  const context = useContext(ConsultationContext)
  if (context === undefined) {
    throw new Error("useConsultation must be used within a ConsultationProvider")
  }
  return context
}
