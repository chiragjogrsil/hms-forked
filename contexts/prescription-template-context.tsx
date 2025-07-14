"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

interface AllopathicTemplate {
  id: string
  name: string
  description: string
  department: string
  prescriptions: Array<{
    id: string
    medicine: string
    dosage: string
    timing: string
    duration: string
    quantity: number
    instructions: string
  }>
  dietaryConstraints?: string[]
  createdAt: string
  updatedAt: string
}

interface AyurvedicTemplate {
  id: string
  name: string
  description: string
  department: string
  prescriptions: Array<{
    id: string
    formOfMedicine: string
    constituents: string[]
    preparationInstructions: string
    toBeHadWith: string
    dosage: string
    beforeAfterFood: string
    duration: string
  }>
  pathya?: string[]
  apathya?: string[]
  createdAt: string
  updatedAt: string
}

interface PrescriptionTemplateContextType {
  // Allopathic Templates
  allopathicTemplates: AllopathicTemplate[]
  saveAllopathicTemplate: (template: Omit<AllopathicTemplate, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateAllopathicTemplate: (id: string, template: Partial<AllopathicTemplate>) => Promise<boolean>
  deleteAllopathicTemplate: (id: string) => Promise<boolean>
  getAllopathicTemplatesByDepartment: (department: string) => AllopathicTemplate[]
  searchAllopathicTemplates: (query: string) => AllopathicTemplate[]

  // Ayurvedic Templates
  ayurvedicTemplates: AyurvedicTemplate[]
  saveAyurvedicTemplate: (template: Omit<AyurvedicTemplate, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateAyurvedicTemplate: (id: string, template: Partial<AyurvedicTemplate>) => Promise<boolean>
  deleteAyurvedicTemplate: (id: string) => Promise<boolean>
  getAyurvedicTemplatesByDepartment: (department: string) => AyurvedicTemplate[]
  searchAyurvedicTemplates: (query: string) => AyurvedicTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Sample templates for initial data
const sampleAllopathicTemplates: AllopathicTemplate[] = [
  {
    id: "allopathic-1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold symptoms",
    department: "general",
    prescriptions: [
      {
        id: "1",
        medicine: "Paracetamol 500mg",
        dosage: "1-0-1",
        timing: "after-food",
        duration: "5",
        quantity: 10,
        instructions: "Take 1 tablet morning and evening after food",
      },
      {
        id: "2",
        medicine: "Cetirizine 10mg",
        dosage: "0-0-1",
        timing: "after-food",
        duration: "3",
        quantity: 3,
        instructions: "Take 1 tablet in the evening after food",
      },
    ],
    dietaryConstraints: ["Avoid cold drinks", "Drink warm water"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "allopathic-2",
    name: "Dental Pain Relief",
    description: "Pain management for dental procedures",
    department: "dental",
    prescriptions: [
      {
        id: "1",
        medicine: "Ibuprofen 400mg",
        dosage: "1-0-1",
        timing: "after-food",
        duration: "3",
        quantity: 6,
        instructions: "Take 1 tablet morning and evening after food",
      },
      {
        id: "2",
        medicine: "Amoxicillin 500mg",
        dosage: "1-1-1",
        timing: "after-food",
        duration: "5",
        quantity: 15,
        instructions: "Take 1 tablet three times daily after food",
      },
    ],
    dietaryConstraints: ["Avoid hard foods", "Rinse with warm salt water"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
]

const sampleAyurvedicTemplates: AyurvedicTemplate[] = [
  {
    id: "ayurvedic-1",
    name: "Digestive Health",
    description: "Ayurvedic treatment for digestive issues",
    department: "ayurveda",
    prescriptions: [
      {
        id: "1",
        formOfMedicine: "Churna",
        constituents: ["Triphala", "Ajwain"],
        preparationInstructions: "Mix with warm water",
        toBeHadWith: "Warm Water",
        dosage: "1-0-1",
        beforeAfterFood: "before",
        duration: "15 days",
      },
    ],
    pathya: ["Light food", "Warm water", "Fruits"],
    apathya: ["Cold food", "Heavy meals", "Spicy food"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [allopathicTemplates, setAllopathicTemplates] = useState<AllopathicTemplate[]>([])
  const [ayurvedicTemplates, setAyurvedicTemplates] = useState<AyurvedicTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedAllopathic = localStorage.getItem("allopathic-templates")
    const savedAyurvedic = localStorage.getItem("ayurvedic-templates")

    if (savedAllopathic) {
      try {
        setAllopathicTemplates(JSON.parse(savedAllopathic))
      } catch (error) {
        console.error("Error loading allopathic templates:", error)
        setAllopathicTemplates(sampleAllopathicTemplates)
      }
    } else {
      setAllopathicTemplates(sampleAllopathicTemplates)
    }

    if (savedAyurvedic) {
      try {
        setAyurvedicTemplates(JSON.parse(savedAyurvedic))
      } catch (error) {
        console.error("Error loading ayurvedic templates:", error)
        setAyurvedicTemplates(sampleAyurvedicTemplates)
      }
    } else {
      setAyurvedicTemplates(sampleAyurvedicTemplates)
    }
  }, [])

  // Save to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem("allopathic-templates", JSON.stringify(allopathicTemplates))
  }, [allopathicTemplates])

  useEffect(() => {
    localStorage.setItem("ayurvedic-templates", JSON.stringify(ayurvedicTemplates))
  }, [ayurvedicTemplates])

  // Allopathic template functions
  const saveAllopathicTemplate = async (
    template: Omit<AllopathicTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const newTemplate: AllopathicTemplate = {
        ...template,
        id: `allopathic-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAllopathicTemplates((prev) => [newTemplate, ...prev])
      toast.success("Template saved successfully")
      return true
    } catch (error) {
      toast.error("Failed to save template")
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
      toast.success("Template updated successfully")
      return true
    } catch (error) {
      toast.error("Failed to update template")
      return false
    }
  }

  const deleteAllopathicTemplate = async (id: string): Promise<boolean> => {
    try {
      setAllopathicTemplates((prev) => prev.filter((template) => template.id !== id))
      toast.success("Template deleted successfully")
      return true
    } catch (error) {
      toast.error("Failed to delete template")
      return false
    }
  }

  const getAllopathicTemplatesByDepartment = (department: string): AllopathicTemplate[] => {
    return allopathicTemplates.filter((template) => template.department === department)
  }

  const searchAllopathicTemplates = (query: string): AllopathicTemplate[] => {
    const lowercaseQuery = query.toLowerCase()
    return allopathicTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery),
    )
  }

  // Ayurvedic template functions
  const saveAyurvedicTemplate = async (
    template: Omit<AyurvedicTemplate, "id" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    try {
      const newTemplate: AyurvedicTemplate = {
        ...template,
        id: `ayurvedic-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAyurvedicTemplates((prev) => [newTemplate, ...prev])
      toast.success("Template saved successfully")
      return true
    } catch (error) {
      toast.error("Failed to save template")
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
      toast.success("Template updated successfully")
      return true
    } catch (error) {
      toast.error("Failed to update template")
      return false
    }
  }

  const deleteAyurvedicTemplate = async (id: string): Promise<boolean> => {
    try {
      setAyurvedicTemplates((prev) => prev.filter((template) => template.id !== id))
      toast.success("Template deleted successfully")
      return true
    } catch (error) {
      toast.error("Failed to delete template")
      return false
    }
  }

  const getAyurvedicTemplatesByDepartment = (department: string): AyurvedicTemplate[] => {
    return ayurvedicTemplates.filter((template) => template.department === department)
  }

  const searchAyurvedicTemplates = (query: string): AyurvedicTemplate[] => {
    const lowercaseQuery = query.toLowerCase()
    return ayurvedicTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery),
    )
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        allopathicTemplates,
        saveAllopathicTemplate,
        updateAllopathicTemplate,
        deleteAllopathicTemplate,
        getAllopathicTemplatesByDepartment,
        searchAllopathicTemplates,
        ayurvedicTemplates,
        saveAyurvedicTemplate,
        updateAyurvedicTemplate,
        deleteAyurvedicTemplate,
        getAyurvedicTemplatesByDepartment,
        searchAyurvedicTemplates,
      }}
    >
      {children}
    </PrescriptionTemplateContext.Provider>
  )
}

export function usePrescriptionTemplates() {
  const context = useContext(PrescriptionTemplateContext)
  if (context === undefined) {
    throw new Error("usePrescriptionTemplates must be used within a PrescriptionTemplateProvider")
  }
  return context
}
