"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

// Types
interface AyurvedicTemplate {
  id: string
  name: string
  department: string
  description?: string
  medicines: Array<{
    id: string
    formOfMedicine: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
    beforeAfterFood: string
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface AllopathicTemplate {
  id: string
  name: string
  department: string
  description?: string
  medicines: Array<{
    id: string
    medicine: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
    beforeAfterFood: string
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface PrescriptionTemplateContextType {
  // Ayurvedic templates
  ayurvedicTemplates: AyurvedicTemplate[]
  saveAyurvedicTemplate: (template: Omit<AyurvedicTemplate, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateAyurvedicTemplate: (id: string, template: Partial<AyurvedicTemplate>) => Promise<boolean>
  deleteAyurvedicTemplate: (id: string) => Promise<boolean>
  getAyurvedicTemplate: (id: string) => AyurvedicTemplate | null
  getAyurvedicTemplatesByDepartment: (department: string) => AyurvedicTemplate[]
  getAllAyurvedicTemplates: () => AyurvedicTemplate[]
  searchAyurvedicTemplates: (query: string) => AyurvedicTemplate[]

  // Allopathic templates
  allopathicTemplates: AllopathicTemplate[]
  saveAllopathicTemplate: (template: Omit<AllopathicTemplate, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateAllopathicTemplate: (id: string, template: Partial<AllopathicTemplate>) => Promise<boolean>
  deleteAllopathicTemplate: (id: string) => Promise<boolean>
  getAllopathicTemplate: (id: string) => AllopathicTemplate | null
  getAllopathicTemplatesByDepartment: (department: string) => AllopathicTemplate[]
  getAllAllopathicTemplates: () => AllopathicTemplate[]
  searchAllopathicTemplates: (query: string) => AllopathicTemplate[]

  // Utility
  isLoading: boolean
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Sample data
const sampleAyurvedicTemplates: AyurvedicTemplate[] = [
  {
    id: "ayur-template-1",
    name: "Common Cold Treatment",
    department: "general",
    description: "Standard Ayurvedic treatment for common cold and flu symptoms",
    medicines: [
      {
        id: "1",
        formOfMedicine: "Sitopaladi Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Mix with honey",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        formOfMedicine: "Tulsi Kwath",
        dosage: "10ml",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Take with warm water",
        beforeAfterFood: "before",
      },
    ],
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    createdBy: "Dr. Priya Sharma",
  },
  {
    id: "ayur-template-2",
    name: "Digestive Issues",
    department: "ayurveda",
    description: "Treatment for indigestion and digestive disorders",
    medicines: [
      {
        id: "1",
        formOfMedicine: "Triphala Churna",
        dosage: "1 tsp",
        frequency: "Once daily",
        duration: "15 days",
        instructions: "Take with warm water at bedtime",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        formOfMedicine: "Hingwashtak Churna",
        dosage: "1/2 tsp",
        frequency: "Twice daily",
        duration: "10 days",
        instructions: "Take with buttermilk",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-20T14:30:00.000Z",
    updatedAt: "2024-01-20T14:30:00.000Z",
    createdBy: "Dr. Rajesh Kumar",
  },
]

const sampleAllopathicTemplates: AllopathicTemplate[] = [
  {
    id: "allo-template-1",
    name: "Hypertension Management",
    department: "cardiology",
    description: "Standard treatment protocol for hypertension",
    medicines: [
      {
        id: "1",
        medicine: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take at the same time each day",
        beforeAfterFood: "before",
      },
      {
        id: "2",
        medicine: "Metoprolol",
        dosage: "25mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Monitor blood pressure regularly",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-10T09:00:00.000Z",
    updatedAt: "2024-01-10T09:00:00.000Z",
    createdBy: "Dr. Sarah Wilson",
  },
  {
    id: "allo-template-2",
    name: "Diabetes Type 2",
    department: "general",
    description: "Standard treatment for Type 2 Diabetes",
    medicines: [
      {
        id: "1",
        medicine: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals to reduce stomach upset",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Glimepiride",
        dosage: "1mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take before breakfast",
        beforeAfterFood: "before",
      },
    ],
    createdAt: "2024-01-12T11:15:00.000Z",
    updatedAt: "2024-01-12T11:15:00.000Z",
    createdBy: "Dr. Michael Chen",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [ayurvedicTemplates, setAyurvedicTemplates] = useState<AyurvedicTemplate[]>([])
  const [allopathicTemplates, setAllopathicTemplates] = useState<AllopathicTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const savedAyurvedic = localStorage.getItem("ayurvedic-templates")
      const savedAllopathic = localStorage.getItem("allopathic-templates")

      if (savedAyurvedic) {
        setAyurvedicTemplates(JSON.parse(savedAyurvedic))
      } else {
        setAyurvedicTemplates(sampleAyurvedicTemplates)
      }

      if (savedAllopathic) {
        setAllopathicTemplates(JSON.parse(savedAllopathic))
      } else {
        setAllopathicTemplates(sampleAllopathicTemplates)
      }
    } catch (error) {
      console.error("Error loading templates:", error)
      setAyurvedicTemplates(sampleAyurvedicTemplates)
      setAllopathicTemplates(sampleAllopathicTemplates)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever templates change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("ayurvedic-templates", JSON.stringify(ayurvedicTemplates))
    }
  }, [ayurvedicTemplates, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("allopathic-templates", JSON.stringify(allopathicTemplates))
    }
  }, [allopathicTemplates, isLoading])

  // Ayurvedic template functions
  const saveAyurvedicTemplate = async (
    template: Omit<AyurvedicTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const newTemplate: AyurvedicTemplate = {
        ...template,
        id: `ayur-template-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAyurvedicTemplates((prev) => [newTemplate, ...prev])
      toast.success("Ayurvedic template saved successfully")
      return true
    } catch (error) {
      toast.error("Failed to save Ayurvedic template")
      return false
    }
  }

  const updateAyurvedicTemplate = async (id: string, updates: Partial<AyurvedicTemplate>): Promise<boolean> => {
    try {
      setAyurvedicTemplates((prev) =>
        prev.map((template) =>
          template.id === id ? { ...template, ...updates, updatedAt: new Date().toISOString() } : template,
        ),
      )
      toast.success("Ayurvedic template updated successfully")
      return true
    } catch (error) {
      toast.error("Failed to update Ayurvedic template")
      return false
    }
  }

  const deleteAyurvedicTemplate = async (id: string): Promise<boolean> => {
    try {
      setAyurvedicTemplates((prev) => prev.filter((template) => template.id !== id))
      toast.success("Ayurvedic template deleted successfully")
      return true
    } catch (error) {
      toast.error("Failed to delete Ayurvedic template")
      return false
    }
  }

  const getAyurvedicTemplate = (id: string): AyurvedicTemplate | null => {
    return ayurvedicTemplates.find((template) => template.id === id) || null
  }

  const getAyurvedicTemplatesByDepartment = (department: string): AyurvedicTemplate[] => {
    return ayurvedicTemplates.filter((template) => template.department === department)
  }

  const getAllAyurvedicTemplates = (): AyurvedicTemplate[] => {
    return ayurvedicTemplates
  }

  const searchAyurvedicTemplates = (query: string): AyurvedicTemplate[] => {
    const lowercaseQuery = query.toLowerCase()
    return ayurvedicTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery) ||
        template.description?.toLowerCase().includes(lowercaseQuery),
    )
  }

  // Allopathic template functions
  const saveAllopathicTemplate = async (
    template: Omit<AllopathicTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const newTemplate: AllopathicTemplate = {
        ...template,
        id: `allo-template-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAllopathicTemplates((prev) => [newTemplate, ...prev])
      toast.success("Allopathic template saved successfully")
      return true
    } catch (error) {
      toast.error("Failed to save Allopathic template")
      return false
    }
  }

  const updateAllopathicTemplate = async (id: string, updates: Partial<AllopathicTemplate>): Promise<boolean> => {
    try {
      setAllopathicTemplates((prev) =>
        prev.map((template) =>
          template.id === id ? { ...template, ...updates, updatedAt: new Date().toISOString() } : template,
        ),
      )
      toast.success("Allopathic template updated successfully")
      return true
    } catch (error) {
      toast.error("Failed to update Allopathic template")
      return false
    }
  }

  const deleteAllopathicTemplate = async (id: string): Promise<boolean> => {
    try {
      setAllopathicTemplates((prev) => prev.filter((template) => template.id !== id))
      toast.success("Allopathic template deleted successfully")
      return true
    } catch (error) {
      toast.error("Failed to delete Allopathic template")
      return false
    }
  }

  const getAllopathicTemplate = (id: string): AllopathicTemplate | null => {
    return allopathicTemplates.find((template) => template.id === id) || null
  }

  const getAllopathicTemplatesByDepartment = (department: string): AllopathicTemplate[] => {
    return allopathicTemplates.filter((template) => template.department === department)
  }

  const getAllAllopathicTemplates = (): AllopathicTemplate[] => {
    return allopathicTemplates
  }

  const searchAllopathicTemplates = (query: string): AllopathicTemplate[] => {
    const lowercaseQuery = query.toLowerCase()
    return allopathicTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery) ||
        template.description?.toLowerCase().includes(lowercaseQuery),
    )
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        // Ayurvedic templates
        ayurvedicTemplates,
        saveAyurvedicTemplate,
        updateAyurvedicTemplate,
        deleteAyurvedicTemplate,
        getAyurvedicTemplate,
        getAyurvedicTemplatesByDepartment,
        getAllAyurvedicTemplates,
        searchAyurvedicTemplates,

        // Allopathic templates
        allopathicTemplates,
        saveAllopathicTemplate,
        updateAllopathicTemplate,
        deleteAllopathicTemplate,
        getAllopathicTemplate,
        getAllopathicTemplatesByDepartment,
        getAllAllopathicTemplates,
        searchAllopathicTemplates,

        // Utility
        isLoading,
      }}
    >
      {children}
    </PrescriptionTemplateContext.Provider>
  )
}

export function usePrescriptionTemplate() {
  const context = useContext(PrescriptionTemplateContext)
  if (context === undefined) {
    throw new Error("usePrescriptionTemplate must be used within a PrescriptionTemplateProvider")
  }
  return context
}
