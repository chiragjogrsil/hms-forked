"use client"

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"
import { toast } from "sonner"

interface Consultation {
  id: string
  patientId: string
  patientName: string
  visitDate: string
  visitTime: string
  doctorName: string
  department: string
  consultationType: string
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string[]
  familyHistory?: string
  socialHistory?: string
  allergies?: string[]
  currentMedications?: string[]
  clinicalFindings?: string
  doctorNotes?: string
  privateNotes?: string
  systemReview?: any
  vitals?: any
  provisionalDiagnosis?: string[]
  diagnosis?: string[]
  prescriptions?: {
    ayurvedic: any[]
    allopathic: any[]
  }
  ayurvedicAnalysis?: any
  ophthalmologyAnalysis?: any
  investigationsOrdered?: any[]
  advice?: string
  followUpInstructions?: string
  consultationFee?: number
  status: "in-progress" | "completed"
  createdAt: string
  updatedAt: string
  nextSteps?: any
}

interface ConsultationContextType {
  activeConsultation: Consultation | null
  isConsultationActive: boolean
  hasUnsavedChanges: boolean
  consultationHistory: Consultation[]
  startNewConsultation: (
    patientId: string,
    patientName: string,
    visitDate: string,
    options?: {
      department?: string
      consultationType?: string
      doctorName?: string
      appointmentDate?: string
      appointmentTime?: string
    },
  ) => void
  updateConsultationData: (updates: Partial<Consultation>) => void
  saveConsultation: () => Promise<boolean>
  completeConsultation: (finalData?: any) => Promise<boolean>
  completeVisit: () => Promise<boolean>
  loadConsultation: (consultationId: string) => void
  resetConsultation: () => void
  getPatientConsultations: (patientId: string) => Consultation[]
  debugConsultationHistory: () => Consultation[]
  hasInProgressConsultation: (patientId: string) => boolean
  getInProgressConsultation: (patientId: string) => Consultation | null
  loadInProgressConsultation: (patientId: string) => void
  hasIncompleteVisits: (patientId: string) => Consultation[]
  completeIncompleteVisit: (consultationId: string) => Promise<boolean>
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)

// Mock consultation history with sample data
const mockConsultationHistory: Consultation[] = [
  {
    id: "CONS-001-2024-06-20",
    patientId: "P12345",
    patientName: "John Doe",
    visitDate: "2024-06-20",
    visitTime: "14:30",
    doctorName: "Dr. Sarah Wilson",
    department: "cardiology",
    consultationType: "followup",
    chiefComplaint: "Follow-up for hypertension management and chest discomfort",
    clinicalFindings:
      "Patient reports improved blood pressure control with current medication regimen. Occasional mild chest discomfort on exertion, no chest pain at rest. Compliance with medication is excellent. Patient has been following dietary recommendations and regular exercise routine. No shortness of breath or palpitations reported. Physical examination reveals normal heart sounds, no murmurs. Lungs clear bilaterally. No peripheral edema.",
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
      "Continue current medication. Monitor blood pressure at home twice weekly. Follow low-sodium diet (<2g/day). Regular moderate exercise 30 minutes daily. Return if chest pain worsens.",
    followUpInstructions: "Follow-up in 4 weeks or sooner if symptoms worsen",
    status: "completed",
    createdAt: "2024-06-20T14:30:00.000Z",
    updatedAt: "2024-06-20T15:15:00.000Z",
  },
  {
    id: "CONS-002-2024-06-15",
    patientId: "P12345",
    patientName: "John Doe",
    visitDate: "2024-06-15",
    visitTime: "10:15",
    doctorName: "Dr. Priya Sharma",
    department: "ayurveda",
    consultationType: "routine",
    chiefComplaint: "Digestive issues and stress management consultation",
    clinicalFindings:
      "Patient reports occasional indigestion, bloating after meals, and work-related stress affecting sleep quality. Seeking natural remedies for overall wellness and digestive health. Pulse examination reveals Vata-Pitta imbalance. Tongue examination shows mild coating indicating digestive fire (Agni) imbalance. Patient interested in Panchakarma therapy for detoxification.",
    provisionalDiagnosis: [
      "Ajirna (Digestive Imbalance)",
      "Stress-related Vata Aggravation",
      "Mandagni (Weak Digestive Fire)",
    ],
    vitals: {
      bloodPressure: "125/80",
      pulse: "70",
      temperature: "98.2",
      weight: "74.5",
      height: "175",
    },
    prescriptions: {
      allopathic: [],
      ayurvedic: [
        {
          id: "1",
          medicineType: "churna",
          componentMedicines: ["Triphala"],
          dosage: "1 tsp",
          frequency: "Twice daily",
          duration: "15 days",
          instructions: "Mix with warm water, take on empty stomach",
          beforeAfterFood: "before",
        },
        {
          id: "2",
          medicineType: "ghrita",
          componentMedicines: ["Brahmi Ghrita"],
          dosage: "1/2 tsp",
          frequency: "Once daily",
          duration: "21 days",
          instructions: "Take with warm milk before bedtime for stress relief",
          beforeAfterFood: "before",
        },
        {
          id: "3",
          medicineType: "churna",
          componentMedicines: ["Hingvastak Churna"],
          dosage: "1/4 tsp",
          frequency: "After meals",
          duration: "10 days",
          instructions: "Mix with buttermilk for digestive support",
          beforeAfterFood: "after",
        },
      ],
    },
    ayurvedicAnalysis: {
      constitution: "Vata-Pitta",
      currentImbalance: "Vata aggravated with Pitta secondary",
      pulseFindings: "Vata pulse prominent, irregular rhythm",
      tongueExamination: "Mild white coating, slightly dry",
      digestiveFire: "Mandagni (irregular/weak)",
      recommendations: [
        "Follow Vata-pacifying diet",
        "Regular meal timings",
        "Avoid cold and raw foods",
        "Practice Pranayama daily",
        "Oil massage (Abhyanga) twice weekly",
      ],
    },
    advice:
      "Practice pranayama daily (Anulom-Vilom 10 minutes). Avoid spicy and fried foods. Follow regular meal timings. Warm water intake throughout the day.",
    followUpInstructions: "Follow-up in 2 weeks to assess treatment response",
    status: "completed",
    createdAt: "2024-06-15T10:15:00.000Z",
    updatedAt: "2024-06-15T11:00:00.000Z",
  },
]

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [consultationHistory, setConsultationHistory] = useState<Consultation[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("consultation-history")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return [...mockConsultationHistory, ...parsed]
        } catch {
          return mockConsultationHistory
        }
      }
    }
    return mockConsultationHistory
  })

  // Use ref to prevent infinite loops during updates
  const isUpdatingRef = useRef(false)

  const startNewConsultation = useCallback(
    (
      patientId: string,
      patientName: string,
      visitDate: string,
      options: {
        department?: string
        consultationType?: string
        doctorName?: string
        appointmentDate?: string
        appointmentTime?: string
      } = {},
    ) => {
      const newConsultation: Consultation = {
        id: `CONS-${patientId}-${Date.now()}`,
        patientId,
        patientName,
        visitDate,
        visitTime: options.appointmentTime || new Date().toLocaleTimeString("en-US", { hour12: false }),
        doctorName: options.doctorName || "Dr. Smith",
        department: options.department || "general",
        consultationType: options.consultationType || "routine",
        prescriptions: { ayurvedic: [], allopathic: [] },
        status: "in-progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setActiveConsultation(newConsultation)
      setHasUnsavedChanges(false)

      toast.success("New consultation started", {
        description: `Started consultation for ${patientName}`,
      })
    },
    [],
  )

  const updateConsultationData = useCallback((updates: Partial<Consultation>) => {
    if (isUpdatingRef.current) return

    setActiveConsultation((prev) => {
      if (!prev) return null

      isUpdatingRef.current = true
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 100)

      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    })
    setHasUnsavedChanges(true)
  }, [])

  const saveConsultation = useCallback(async (): Promise<boolean> => {
    if (!activeConsultation) return false

    try {
      const updatedHistory = consultationHistory.map((c) => (c.id === activeConsultation.id ? activeConsultation : c))

      if (!consultationHistory.find((c) => c.id === activeConsultation.id)) {
        updatedHistory.push(activeConsultation)
      }

      setConsultationHistory(updatedHistory)
      localStorage.setItem(
        "consultation-history",
        JSON.stringify(updatedHistory.filter((c) => c.id !== "CONS-001-2024-06-20" && c.id !== "CONS-002-2024-06-15")),
      )
      setHasUnsavedChanges(false)

      return true
    } catch (error) {
      console.error("Error saving consultation:", error)
      toast.error("Failed to save consultation")
      return false
    }
  }, [activeConsultation, consultationHistory])

  const completeConsultation = useCallback(
    async (finalData?: any): Promise<boolean> => {
      if (!activeConsultation) return false

      try {
        const completedConsultation = {
          ...activeConsultation,
          ...finalData,
          status: "completed" as const,
          updatedAt: new Date().toISOString(),
        }

        const updatedHistory = consultationHistory.map((c) =>
          c.id === activeConsultation.id ? completedConsultation : c,
        )

        if (!consultationHistory.find((c) => c.id === activeConsultation.id)) {
          updatedHistory.push(completedConsultation)
        }

        setConsultationHistory(updatedHistory)
        localStorage.setItem(
          "consultation-history",
          JSON.stringify(
            updatedHistory.filter((c) => c.id !== "CONS-001-2024-06-20" && c.id !== "CONS-002-2024-06-15"),
          ),
        )
        setActiveConsultation(null)
        setHasUnsavedChanges(false)

        toast.success("Consultation completed successfully")
        return true
      } catch (error) {
        console.error("Error completing consultation:", error)
        toast.error("Failed to complete consultation")
        return false
      }
    },
    [activeConsultation, consultationHistory],
  )

  const completeVisit = useCallback(async (): Promise<boolean> => {
    return await completeConsultation()
  }, [completeConsultation])

  const loadConsultation = useCallback(
    (consultationId: string) => {
      const consultation = consultationHistory.find((c) => c.id === consultationId)
      if (consultation) {
        setActiveConsultation({ ...consultation })
        setHasUnsavedChanges(false)
        toast.success("Consultation loaded")
      }
    },
    [consultationHistory],
  )

  const resetConsultation = useCallback(() => {
    setActiveConsultation(null)
    setHasUnsavedChanges(false)
  }, [])

  const getPatientConsultations = useCallback(
    (patientId: string) => {
      return consultationHistory.filter((c) => c.patientId === patientId)
    },
    [consultationHistory],
  )

  const debugConsultationHistory = useCallback(() => {
    return consultationHistory
  }, [consultationHistory])

  const hasInProgressConsultation = useCallback(
    (patientId: string) => {
      return consultationHistory.some((c) => c.patientId === patientId && c.status === "in-progress")
    },
    [consultationHistory],
  )

  const getInProgressConsultation = useCallback(
    (patientId: string) => {
      return consultationHistory.find((c) => c.patientId === patientId && c.status === "in-progress") || null
    },
    [consultationHistory],
  )

  const loadInProgressConsultation = useCallback(
    (patientId: string) => {
      const consultation = getInProgressConsultation(patientId)
      if (consultation) {
        setActiveConsultation(consultation)
        setHasUnsavedChanges(false)
      }
    },
    [getInProgressConsultation],
  )

  const hasIncompleteVisits = useCallback(
    (patientId: string) => {
      return consultationHistory.filter((c) => c.patientId === patientId && c.status === "in-progress")
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

        const updatedHistory = consultationHistory.map((c) => (c.id === consultationId ? completedConsultation : c))

        setConsultationHistory(updatedHistory)
        localStorage.setItem(
          "consultation-history",
          JSON.stringify(
            updatedHistory.filter((c) => c.id !== "CONS-001-2024-06-20" && c.id !== "CONS-002-2024-06-15"),
          ),
        )

        toast.success("Visit completed successfully")
        return true
      } catch (error) {
        console.error("Error completing visit:", error)
        toast.error("Failed to complete visit")
        return false
      }
    },
    [consultationHistory],
  )

  const value = {
    activeConsultation,
    isConsultationActive: !!activeConsultation,
    hasUnsavedChanges,
    consultationHistory,
    startNewConsultation,
    updateConsultationData,
    saveConsultation,
    completeConsultation,
    completeVisit,
    loadConsultation,
    resetConsultation,
    getPatientConsultations,
    debugConsultationHistory,
    hasInProgressConsultation,
    getInProgressConsultation,
    loadInProgressConsultation,
    hasIncompleteVisits,
    completeIncompleteVisit,
  }

  return <ConsultationContext.Provider value={value}>{children}</ConsultationContext.Provider>
}

export function useConsultation() {
  const context = useContext(ConsultationContext)
  if (context === undefined) {
    throw new Error("useConsultation must be used within a ConsultationProvider")
  }
  return context
}
