"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface VitalSigns {
  temperature?: string
  bloodPressure?: string
  heartRate?: string
  respiratoryRate?: string
  oxygenSaturation?: string
  weight?: string
  height?: string
  bmi?: string
}

export interface Diagnosis {
  id: string
  name: string
  icd10Code?: string
  notes?: string
}

export interface Prescription {
  id: string
  type: "allopathic" | "ayurvedic"
  medicine: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  beforeFood?: boolean
  afterFood?: boolean
}

export interface LabTest {
  id: string
  name: string
  category: string
  urgency: "routine" | "urgent" | "stat"
  notes?: string
}

export interface RadiologyTest {
  id: string
  name: string
  category: string
  urgency: "routine" | "urgent" | "stat"
  notes?: string
}

export interface Procedure {
  id: string
  name: string
  category: string
  notes?: string
  scheduledDate?: string
}

export interface ConsultationData {
  id: string
  patientId: string
  visitId: string
  department: string
  consultationType: "new" | "followup"
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string
  familyHistory?: string
  socialHistory?: string
  reviewOfSystems?: string
  vitalSigns: VitalSigns
  physicalExamination?: string
  diagnoses: Diagnosis[]
  allopathicPrescriptions: Prescription[]
  ayurvedicPrescriptions: Prescription[]
  labTests: LabTest[]
  radiologyTests: RadiologyTest[]
  procedures: Procedure[]
  followUpInstructions?: string
  nextVisitDate?: string
  doctorNotes?: string
  status: "draft" | "completed"
  createdAt: string
  updatedAt: string
}

interface ConsultationContextType {
  currentConsultation: ConsultationData | null
  consultationHistory: ConsultationData[]
  startNewConsultation: (patientId: string, visitId: string, department: string, type: "new" | "followup") => void
  updateConsultation: (updates: Partial<ConsultationData>) => void
  completeConsultation: () => void
  loadConsultation: (consultationId: string) => void
  saveConsultation: () => void
  isLoading: boolean
  error: string | null
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)

// Mock consultation history data
const mockConsultationHistory: ConsultationData[] = [
  {
    id: "cons-001",
    patientId: "pat-001",
    visitId: "visit-001",
    department: "General Medicine",
    consultationType: "new",
    chiefComplaint: "Fever and headache for 3 days",
    historyOfPresentIllness:
      "Patient reports high-grade fever with chills, severe headache, and body aches starting 3 days ago.",
    vitalSigns: {
      temperature: "101.2°F",
      bloodPressure: "120/80",
      heartRate: "88",
      respiratoryRate: "18",
      oxygenSaturation: "98%",
      weight: "70kg",
      height: "175cm",
      bmi: "22.9",
    },
    physicalExamination: "Patient appears ill, mild dehydration noted. No focal neurological deficits.",
    diagnoses: [
      { id: "diag-001", name: "Viral Fever", icd10Code: "R50.9" },
      { id: "diag-002", name: "Headache", icd10Code: "R51" },
    ],
    allopathicPrescriptions: [
      {
        id: "med-001",
        type: "allopathic",
        medicine: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "TID",
        duration: "5 days",
        instructions: "Take with food",
        afterFood: true,
      },
    ],
    ayurvedicPrescriptions: [],
    labTests: [{ id: "lab-001", name: "Complete Blood Count", category: "Hematology", urgency: "routine" }],
    radiologyTests: [],
    procedures: [],
    followUpInstructions: "Return if fever persists beyond 5 days",
    nextVisitDate: "2024-01-15",
    status: "completed",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T11:30:00Z",
  },
  {
    id: "cons-002",
    patientId: "pat-002",
    visitId: "visit-002",
    department: "Cardiology",
    consultationType: "followup",
    chiefComplaint: "Follow-up for hypertension",
    historyOfPresentIllness: "Patient on antihypertensive medication, reports good compliance.",
    vitalSigns: {
      temperature: "98.6°F",
      bloodPressure: "130/85",
      heartRate: "72",
      respiratoryRate: "16",
      oxygenSaturation: "99%",
      weight: "75kg",
      height: "170cm",
      bmi: "26.0",
    },
    diagnoses: [{ id: "diag-003", name: "Essential Hypertension", icd10Code: "I10" }],
    allopathicPrescriptions: [
      {
        id: "med-002",
        type: "allopathic",
        medicine: "Amlodipine 5mg",
        dosage: "5mg",
        frequency: "OD",
        duration: "30 days",
        instructions: "Take in morning",
        beforeFood: true,
      },
    ],
    ayurvedicPrescriptions: [],
    labTests: [],
    radiologyTests: [],
    procedures: [],
    followUpInstructions: "Continue medication, lifestyle modifications",
    nextVisitDate: "2024-02-10",
    status: "completed",
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-10T14:45:00Z",
  },
]

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [currentConsultation, setCurrentConsultation] = useState<ConsultationData | null>(null)
  const [consultationHistory] = useState<ConsultationData[]>(mockConsultationHistory)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const startNewConsultation = useCallback(
    (patientId: string, visitId: string, department: string, type: "new" | "followup") => {
      const newConsultation: ConsultationData = {
        id: `cons-${Date.now()}`,
        patientId,
        visitId,
        department,
        consultationType: type,
        vitalSigns: {},
        diagnoses: [],
        allopathicPrescriptions: [],
        ayurvedicPrescriptions: [],
        labTests: [],
        radiologyTests: [],
        procedures: [],
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCurrentConsultation(newConsultation)
      setError(null)
    },
    [],
  )

  const updateConsultation = useCallback(
    (updates: Partial<ConsultationData>) => {
      if (!currentConsultation) return

      setCurrentConsultation((prev) => {
        if (!prev) return null
        const updated = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        return updated
      })

      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }

      // Set new timeout for auto-save (2 seconds after last change)
      const newTimeout = setTimeout(() => {
        saveConsultation()
      }, 2000)
      setSaveTimeout(newTimeout)
    },
    [currentConsultation, saveTimeout],
  )

  const saveConsultation = useCallback(() => {
    if (!currentConsultation) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Consultation saved:", currentConsultation)
      setIsLoading(false)
    }, 500)
  }, [currentConsultation])

  const completeConsultation = useCallback(() => {
    if (!currentConsultation) return

    updateConsultation({ status: "completed" })

    // Clear auto-save timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      setSaveTimeout(null)
    }

    // Save immediately
    saveConsultation()
  }, [currentConsultation, updateConsultation, saveConsultation, saveTimeout])

  const loadConsultation = useCallback(
    (consultationId: string) => {
      const consultation = consultationHistory.find((c) => c.id === consultationId)
      if (consultation) {
        setCurrentConsultation(consultation)
        setError(null)
      } else {
        setError("Consultation not found")
      }
    },
    [consultationHistory],
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  const value: ConsultationContextType = {
    currentConsultation,
    consultationHistory,
    startNewConsultation,
    updateConsultation,
    completeConsultation,
    loadConsultation,
    saveConsultation,
    isLoading,
    error,
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
