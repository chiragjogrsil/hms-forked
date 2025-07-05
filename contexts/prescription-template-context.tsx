"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import type { Prescription } from "@/contexts/consultation-context"

export interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  type: "allopathic" | "ayurvedic" | "mixed"
  prescriptions: Prescription[]
  createdAt: string
  updatedAt: string
  createdBy: string
  tags?: string[]
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => Promise<void>
  loadTemplate: (templateId: string) => Promise<PrescriptionTemplate | null>
  deleteTemplate: (templateId: string) => Promise<void>
  searchTemplates: (query: string, filters?: { department?: string; type?: string }) => PrescriptionTemplate[]
  isLoading: boolean
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Mock templates data
const mockTemplates: PrescriptionTemplate[] = [
  {
    id: "1",
    name: "Common Cold Treatment",
    description: "Standard treatment for viral upper respiratory infections",
    department: "General Medicine",
    type: "allopathic",
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
      {
        id: "2",
        type: "allopathic",
        medication: "Cetirizine",
        dosage: "10mg",
        frequency: "OD",
        duration: "5 days",
        instructions: "Take at bedtime",
        afterFood: false,
      },
    ],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
    createdBy: "Dr. Smith",
    tags: ["viral", "fever", "cold"],
  },
  {
    id: "2",
    name: "Hypertension Management",
    description: "Standard antihypertensive therapy",
    department: "Cardiology",
    type: "allopathic",
    prescriptions: [
      {
        id: "3",
        type: "allopathic",
        medication: "Amlodipine",
        dosage: "5mg",
        frequency: "OD",
        duration: "30 days",
        instructions: "Take in the morning",
        beforeFood: true,
      },
      {
        id: "4",
        type: "allopathic",
        medication: "Metoprolol",
        dosage: "25mg",
        frequency: "BD",
        duration: "30 days",
        instructions: "Take with meals",
        afterFood: true,
      },
    ],
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
    createdBy: "Dr. Johnson",
    tags: ["hypertension", "cardiovascular"],
  },
  {
    id: "3",
    name: "Vata Dosha Balance",
    description: "Ayurvedic treatment for Vata imbalance",
    department: "Ayurveda",
    type: "ayurvedic",
    prescriptions: [
      {
        id: "5",
        type: "ayurvedic",
        medication: "Ashwagandha Churna",
        dosage: "3g",
        frequency: "BD",
        duration: "30 days",
        instructions: "Mix with warm milk",
        afterFood: true,
      },
      {
        id: "6",
        type: "ayurvedic",
        medication: "Dashamoola Kwath",
        dosage: "15ml",
        frequency: "BD",
        duration: "15 days",
        instructions: "Mix with equal amount of water",
        beforeFood: true,
      },
    ],
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    createdBy: "Dr. Sharma",
    tags: ["vata", "dosha", "nervousness"],
  },
  {
    id: "4",
    name: "Diabetes Management",
    description: "Comprehensive diabetes treatment plan",
    department: "Endocrinology",
    type: "allopathic",
    prescriptions: [
      {
        id: "7",
        type: "allopathic",
        medication: "Metformin",
        dosage: "500mg",
        frequency: "BD",
        duration: "30 days",
        instructions: "Take with meals",
        afterFood: true,
      },
      {
        id: "8",
        type: "allopathic",
        medication: "Glimepiride",
        dosage: "1mg",
        frequency: "OD",
        duration: "30 days",
        instructions: "Take before breakfast",
        beforeFood: true,
      },
    ],
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    createdBy: "Dr. Patel",
    tags: ["diabetes", "blood sugar", "endocrine"],
  },
  {
    id: "5",
    name: "Integrated Pain Management",
    description: "Combined allopathic and ayurvedic approach for chronic pain",
    department: "Pain Management",
    type: "mixed",
    prescriptions: [
      {
        id: "9",
        type: "allopathic",
        medication: "Diclofenac",
        dosage: "50mg",
        frequency: "BD",
        duration: "7 days",
        instructions: "Take after meals",
        afterFood: true,
      },
      {
        id: "10",
        type: "ayurvedic",
        medication: "Mahanarayana Taila",
        dosage: "5ml",
        frequency: "BD",
        duration: "21 days",
        instructions: "Apply externally and massage gently",
        afterFood: false,
      },
    ],
    createdAt: "2024-01-11T11:20:00Z",
    updatedAt: "2024-01-11T11:20:00Z",
    createdBy: "Dr. Kumar",
    tags: ["pain", "inflammation", "integrated"],
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("prescription-templates")
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates)
        setTemplates([...mockTemplates, ...parsed])
      } catch (error) {
        console.error("Failed to parse saved templates:", error)
        setTemplates(mockTemplates)
      }
    } else {
      setTemplates(mockTemplates)
    }
  }, [])

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    if (templates.length > 0) {
      const customTemplates = templates.filter((t) => !mockTemplates.find((mt) => mt.id === t.id))
      localStorage.setItem("prescription-templates", JSON.stringify(customTemplates))
    }
  }, [templates])

  const saveTemplate = async (templateData: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTemplate: PrescriptionTemplate = {
        ...templateData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTemplates((prev) => [...prev, newTemplate])
      toast.success("Prescription template saved successfully")
    } catch (error) {
      toast.error("Failed to save prescription template")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loadTemplate = async (templateId: string): Promise<PrescriptionTemplate | null> => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const template = templates.find((t) => t.id === templateId)
      if (!template) {
        toast.error("Template not found")
        return null
      }

      return template
    } catch (error) {
      toast.error("Failed to load prescription template")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTemplate = async (templateId: string) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      setTemplates((prev) => prev.filter((t) => t.id !== templateId))
      toast.success("Template deleted successfully")
    } catch (error) {
      toast.error("Failed to delete template")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const searchTemplates = (query: string, filters?: { department?: string; type?: string }): PrescriptionTemplate[] => {
    let filtered = templates

    // Apply text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm) ||
          template.description?.toLowerCase().includes(searchTerm) ||
          template.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          template.prescriptions.some((p) => p.medication.toLowerCase().includes(searchTerm)),
      )
    }

    // Apply filters
    if (filters?.department) {
      filtered = filtered.filter((template) => template.department === filters.department)
    }

    if (filters?.type) {
      filtered = filtered.filter((template) => template.type === filters.type)
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  const value: PrescriptionTemplateContextType = {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    searchTemplates,
    isLoading,
  }

  return <PrescriptionTemplateContext.Provider value={value}>{children}</PrescriptionTemplateContext.Provider>
}

export function usePrescriptionTemplates() {
  const context = useContext(PrescriptionTemplateContext)
  if (context === undefined) {
    throw new Error("usePrescriptionTemplates must be used within a PrescriptionTemplateProvider")
  }
  return context
}
