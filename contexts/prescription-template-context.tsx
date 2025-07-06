"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterFood: "before" | "after" | "with"
}

export interface PrescriptionTemplate {
  id: string
  name: string
  description: string
  department: string
  medicines: Medicine[]
  createdAt: Date
  updatedAt: Date
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => void
  loadTemplate: (templateId: string) => PrescriptionTemplate | null
  deleteTemplate: (templateId: string) => void
  searchTemplates: (query: string, department?: string) => PrescriptionTemplate[]
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Sample templates
const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold and flu symptoms",
    department: "General Medicine",
    medicines: [
      {
        id: "1",
        name: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "5 days",
        instructions: "Take with water",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        name: "Cetirizine 10mg",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "3 days",
        instructions: "Take at bedtime",
        beforeAfterFood: "after",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Digestive Health",
    description: "Treatment for digestive issues and stomach problems",
    department: "Gastroenterology",
    medicines: [
      {
        id: "3",
        name: "Omeprazole 20mg",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "7 days",
        instructions: "Take before breakfast",
        beforeAfterFood: "before",
      },
      {
        id: "4",
        name: "Domperidone 10mg",
        dosage: "10mg",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Take 30 minutes before meals",
        beforeAfterFood: "before",
      },
    ],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Dental Pain Relief",
    description: "Pain management for dental procedures and tooth pain",
    department: "Dentistry",
    medicines: [
      {
        id: "5",
        name: "Ibuprofen 400mg",
        dosage: "400mg",
        frequency: "Three times daily",
        duration: "3 days",
        instructions: "Take with food to avoid stomach upset",
        beforeAfterFood: "with",
      },
      {
        id: "6",
        name: "Amoxicillin 500mg",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Complete the full course",
        beforeAfterFood: "after",
      },
    ],
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  useEffect(() => {
    // Load templates from localStorage or use sample templates
    const savedTemplates = localStorage.getItem("prescriptionTemplates")
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates)
        setTemplates(
          parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })),
        )
      } catch (error) {
        console.error("Error loading templates:", error)
        setTemplates(sampleTemplates)
      }
    } else {
      setTemplates(sampleTemplates)
    }
  }, [])

  useEffect(() => {
    // Save templates to localStorage whenever they change
    if (templates.length > 0) {
      localStorage.setItem("prescriptionTemplates", JSON.stringify(templates))
    }
  }, [templates])

  const saveTemplate = (templateData: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }

  const loadTemplate = (templateId: string): PrescriptionTemplate | null => {
    return templates.find((template) => template.id === templateId) || null
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId))
  }

  const searchTemplates = (query: string, department?: string): PrescriptionTemplate[] => {
    return templates.filter((template) => {
      const matchesQuery =
        query === "" ||
        template.name.toLowerCase().includes(query.toLowerCase()) ||
        template.description.toLowerCase().includes(query.toLowerCase()) ||
        template.medicines.some((medicine) => medicine.name.toLowerCase().includes(query.toLowerCase()))

      const matchesDepartment = !department || template.department === department

      return matchesQuery && matchesDepartment
    })
  }

  const getTemplatesByDepartment = (department: string): PrescriptionTemplate[] => {
    return templates.filter((template) => template.department === department)
  }

  const value: PrescriptionTemplateContextType = {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    searchTemplates,
    getTemplatesByDepartment,
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
