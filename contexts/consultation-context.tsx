"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

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
  code?: string
  name: string
  type: "primary" | "secondary"
  notes?: string
}

export interface Prescription {
  id: string
  type: "allopathic" | "ayurvedic"
  medication: string
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
  instructions?: string
}

export interface RadiologyTest {
  id: string
  name: string
  category: string
  urgency: "routine" | "urgent" | "stat"
  instructions?: string
}

export interface Procedure {
  id: string
  name: string
  category: string
  notes?: string
}

export interface ConsultationData {
  patientId?: string
  visitId?: string
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string
  familyHistory?: string
  socialHistory?: string
  reviewOfSystems?: string
  vitalSigns: VitalSigns
  physicalExamination?: string
  diagnoses: Diagnosis[]
  prescriptions: Prescription[]
  labTests: LabTest[]
  radiologyTests: RadiologyTest[]
  procedures: Procedure[]
  followUpInstructions?: string
  nextVisitDate?: string
  clinicalNotes?: string
  ayurvedicAnalysis?: {
    prakriti?: string
    vikriti?: string
    agni?: string
    ama?: string
    ojas?: string
    recommendations?: string
  }
  ophthalmologyAnalysis?: {
    visualAcuity?: string
    intraocularPressure?: string
    fundusExamination?: string
    slitLampExamination?: string
    recommendations?: string
  }
}

interface ConsultationHistory {
  id: string
  patientId: string
  patientName: string
  date: string
  department: string
  doctor: string
  chiefComplaint: string
  diagnoses: string[]
  status: "completed" | "in-progress" | "cancelled"
}

interface ConsultationContextType {
  consultationData: ConsultationData
  updateConsultationData: (data: Partial<ConsultationData>) => void
  saveConsultation: () => Promise<void>
  loadConsultation: (consultationId: string) => Promise<void>
  clearConsultation: () => void
  isLoading: boolean
  isSaving: boolean
  consultationHistory: ConsultationHistory[]
  loadConsultationHistory: (patientId: string) => Promise<void>
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined)

const initialConsultationData: ConsultationData = {
  vitalSigns: {},
  diagnoses: [],
  prescriptions: [],
  labTests: [],
  radiologyTests: [],
  procedures: [],
}

// Mock consultation history data
const mockConsultationHistory: ConsultationHistory[] = [
  {
    id: "1",
    patientId: "P001",
    patientName: "John Doe",
    date: "2024-01-15",
    department: "General Medicine",
    doctor: "Dr. Smith",
    chiefComplaint: "Fever and headache",
    diagnoses: ["Viral fever", "Tension headache"],
    status: "completed",
  },
  {
    id: "2",
    patientId: "P001",
    patientName: "John Doe",
    date: "2024-01-10",
    department: "Cardiology",
    doctor: "Dr. Johnson",
    chiefComplaint: "Chest pain",
    diagnoses: ["Angina pectoris"],
    status: "completed",
  },
  {
    id: "3",
    patientId: "P002",
    patientName: "Jane Smith",
    date: "2024-01-12",
    department: "Dermatology",
    doctor: "Dr. Brown",
    chiefComplaint: "Skin rash",
    diagnoses: ["Eczema"],
    status: "completed",
  },
]

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [consultationData, setConsultationData] = useState<ConsultationData>(initialConsultationData)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [consultationHistory, setConsultationHistory] = useState<ConsultationHistory[]>([])
  const [lastSaved, setLastSaved] = useState<string>("")

  // Auto-save functionality
  useEffect(() => {
    const dataString = JSON.stringify(consultationData)
    if (dataString !== lastSaved && dataString !== JSON.stringify(initialConsultationData)) {
      const timeoutId = setTimeout(() => {
        autoSave()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [consultationData, lastSaved])

  const autoSave = async () => {
    try {
      setIsSaving(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setLastSaved(JSON.stringify(consultationData))
      toast.success("Consultation auto-saved")
    } catch (error) {
      toast.error("Failed to auto-save consultation")
    } finally {
      setIsSaving(false)
    }
  }

  const updateConsultationData = useCallback((data: Partial<ConsultationData>) => {
    setConsultationData((prev) => ({
      ...prev,
      ...data,
      vitalSigns: data.vitalSigns ? { ...prev.vitalSigns, ...data.vitalSigns } : prev.vitalSigns,
      ayurvedicAnalysis: data.ayurvedicAnalysis
        ? { ...prev.ayurvedicAnalysis, ...data.ayurvedicAnalysis }
        : prev.ayurvedicAnalysis,
      ophthalmologyAnalysis: data.ophthalmologyAnalysis
        ? { ...prev.ophthalmologyAnalysis, ...data.ophthalmologyAnalysis }
        : prev.ophthalmologyAnalysis,
    }))
  }, [])

  const saveConsultation = async () => {
    try {
      setIsSaving(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLastSaved(JSON.stringify(consultationData))
      toast.success("Consultation saved successfully")
    } catch (error) {
      toast.error("Failed to save consultation")
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const loadConsultation = async (consultationId: string) => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock loading consultation data
      const mockData: ConsultationData = {
        patientId: "P001",
        visitId: "V001",
        chiefComplaint: "Fever and headache for 3 days",
        historyOfPresentIllness: "Patient reports onset of fever 3 days ago, accompanied by headache and body aches.",
        vitalSigns: {
          temperature: "101.2°F",
          bloodPressure: "120/80",
          heartRate: "88",
          respiratoryRate: "18",
          oxygenSaturation: "98%",
          weight: "70",
          height: "175",
          bmi: "22.9",
        },
        diagnoses: [
          { id: "1", code: "A09", name: "Viral fever", type: "primary" },
          { id: "2", code: "G44.2", name: "Tension headache", type: "secondary" },
        ],
        prescriptions: [
          {
            id: "1",
            type: "allopathic",
            medication: "Paracetamol",
            dosage: "500mg",
            frequency: "TID",
            duration: "5 days",
            instructions: "Take after meals",
            afterFood: true,
          },
        ],
        labTests: [],
        radiologyTests: [],
        procedures: [],
        followUpInstructions: "Return if symptoms worsen or persist beyond 5 days",
        clinicalNotes: "Patient appears stable, no signs of complications",
      }

      setConsultationData(mockData)
      setLastSaved(JSON.stringify(mockData))
      toast.success("Consultation loaded successfully")
    } catch (error) {
      toast.error("Failed to load consultation")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loadConsultationHistory = async (patientId: string) => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const patientHistory = mockConsultationHistory.filter((consultation) => consultation.patientId === patientId)

      setConsultationHistory(patientHistory)
    } catch (error) {
      toast.error("Failed to load consultation history")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearConsultation = () => {
    setConsultationData(initialConsultationData)
    setLastSaved("")
    setConsultationHistory([])
  }

  const value: ConsultationContextType = {
    consultationData,
    updateConsultationData,
    saveConsultation,
    loadConsultation,
    clearConsultation,
    isLoading,
    isSaving,
    consultationHistory,
    loadConsultationHistory,
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
