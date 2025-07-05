"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  type: "allopathic" | "ayurvedic" | "mixed"
  allopathicMedicines: Array<{
    medicine: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
    beforeFood?: boolean
    afterFood?: boolean
  }>
  ayurvedicMedicines: Array<{
    medicine: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
    beforeFood?: boolean
    afterFood?: boolean
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => void
  loadTemplate: (templateId: string) => PrescriptionTemplate | null
  deleteTemplate: (templateId: string) => void
  searchTemplates: (query: string, department?: string, type?: string) => PrescriptionTemplate[]
  isLoading: boolean
  error: string | null
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Mock templates data
const mockTemplates: PrescriptionTemplate[] = [
  {
    id: "template-001",
    name: "Hypertension Management",
    description: "Standard treatment for essential hypertension",
    department: "Cardiology",
    type: "allopathic",
    allopathicMedicines: [
      {
        medicine: "Amlodipine 5mg",
        dosage: "5mg",
        frequency: "OD",
        duration: "30 days",
        instructions: "Take in morning",
        beforeFood: true,
      },
      {
        medicine: "Metoprolol 25mg",
        dosage: "25mg",
        frequency: "BD",
        duration: "30 days",
        instructions: "Monitor heart rate",
        afterFood: true,
      },
    ],
    ayurvedicMedicines: [],
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    createdBy: "Dr. Smith",
  },
  {
    id: "template-002",
    name: "Diabetes Type 2 - Initial",
    description: "Initial management for newly diagnosed Type 2 diabetes",
    department: "General Medicine",
    type: "allopathic",
    allopathicMedicines: [
      {
        medicine: "Metformin 500mg",
        dosage: "500mg",
        frequency: "BD",
        duration: "30 days",
        instructions: "Start with 500mg once daily, increase gradually",
        afterFood: true,
      },
    ],
    ayurvedicMedicines: [],
    createdAt: "2024-01-02T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z",
    createdBy: "Dr. Johnson",
  },
  {
    id: "template-003",
    name: "Vata Dosha Imbalance",
    description: "Ayurvedic treatment for Vata disorders",
    department: "Ayurveda",
    type: "ayurvedic",
    allopathicMedicines: [],
    ayurvedicMedicines: [
      {
        medicine: "Dashamoola Kwath",
        dosage: "20ml",
        frequency: "BD",
        duration: "15 days",
        instructions: "Mix with equal amount of warm water",
        beforeFood: true,
      },
      {
        medicine: "Ashwagandha Churna",
        dosage: "3g",
        frequency: "BD",
        duration: "30 days",
        instructions: "Take with warm milk",
        afterFood: true,
      },
    ],
    createdAt: "2024-01-03T10:00:00Z",
    updatedAt: "2024-01-03T10:00:00Z",
    createdBy: "Dr. Sharma",
  },
  {
    id: "template-004",
    name: "Upper Respiratory Infection",
    description: "Common cold and flu treatment",
    department: "General Medicine",
    type: "mixed",
    allopathicMedicines: [
      {
        medicine: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "TID",
        duration: "5 days",
        instructions: "For fever and body ache",
        afterFood: true,
      },
    ],
    ayurvedicMedicines: [
      {
        medicine: "Sitopaladi Churna",
        dosage: "3g",
        frequency: "TID",
        duration: "7 days",
        instructions: "Mix with honey",
        beforeFood: false,
        afterFood: false,
      },
    ],
    createdAt: "2024-01-04T10:00:00Z",
    updatedAt: "2024-01-04T10:00:00Z",
    createdBy: "Dr. Patel",
  },
  {
    id: "template-005",
    name: "Arthritis Pain Management",
    description: "Joint pain and inflammation treatment",
    department: "Orthopedics",
    type: "allopathic",
    allopathicMedicines: [
      {
        medicine: "Diclofenac 50mg",
        dosage: "50mg",
        frequency: "BD",
        duration: "10 days",
        instructions: "Take with food to avoid gastric irritation",
        afterFood: true,
      },
      {
        medicine: "Pantoprazole 40mg",
        dosage: "40mg",
        frequency: "OD",
        duration: "10 days",
        instructions: "Gastric protection",
        beforeFood: true,
      },
    ],
    ayurvedicMedicines: [],
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
    createdBy: "Dr. Kumar",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem("prescription-templates")
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates))
      } else {
        // Initialize with mock data
        setTemplates(mockTemplates)
        localStorage.setItem("prescription-templates", JSON.stringify(mockTemplates))
      }
    } catch (err) {
      console.error("Error loading templates:", err)
      setTemplates(mockTemplates)
    }
  }, [])

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    if (templates.length > 0) {
      try {
        localStorage.setItem("prescription-templates", JSON.stringify(templates))
      } catch (err) {
        console.error("Error saving templates:", err)
      }
    }
  }, [templates])

  const saveTemplate = useCallback((templateData: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    setError(null)

    try {
      const newTemplate: PrescriptionTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTemplates((prev) => [...prev, newTemplate])
      setIsLoading(false)
    } catch (err) {
      setError("Failed to save template")
      setIsLoading(false)
    }
  }, [])

  const loadTemplate = useCallback(
    (templateId: string): PrescriptionTemplate | null => {
      const template = templates.find((t) => t.id === templateId)
      return template || null
    },
    [templates],
  )

  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }, [])

  const searchTemplates = useCallback(
    (query: string, department?: string, type?: string): PrescriptionTemplate[] => {
      return templates.filter((template) => {
        const matchesQuery =
          !query ||
          template.name.toLowerCase().includes(query.toLowerCase()) ||
          template.description?.toLowerCase().includes(query.toLowerCase())

        const matchesDepartment = !department || template.department === department
        const matchesType = !type || template.type === type

        return matchesQuery && matchesDepartment && matchesType
      })
    },
    [templates],
  )

  const value: PrescriptionTemplateContextType = {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    searchTemplates,
    isLoading,
    error,
  }

  return <PrescriptionTemplateContext.Provider value={value}>{children}</PrescriptionTemplateContext.Provider>
}

export function usePrescriptionTemplate() {
  const context = useContext(PrescriptionTemplateContext)
  if (context === undefined) {
    throw new Error("usePrescriptionTemplate must be used within a PrescriptionTemplateProvider")
  }
  return context
}
