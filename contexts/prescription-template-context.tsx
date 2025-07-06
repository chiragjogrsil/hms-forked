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
  createdAt: string
  updatedAt: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => void
  deleteTemplate: (id: string) => void
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
  searchTemplates: (query: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Sample templates
const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "template-1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold and flu symptoms",
    department: "General Medicine",
    medicines: [
      {
        id: "med-1",
        name: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "5 days",
        instructions: "Take with water",
        beforeAfterFood: "after",
      },
      {
        id: "med-2",
        name: "Cetirizine 10mg",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "7 days",
        instructions: "Take at bedtime",
        beforeAfterFood: "after",
      },
      {
        id: "med-3",
        name: "Cough Syrup",
        dosage: "10ml",
        frequency: "3 times daily",
        duration: "7 days",
        instructions: "Shake well before use",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "template-2",
    name: "Digestive Health Support",
    description: "Treatment for digestive issues and stomach problems",
    department: "Gastroenterology",
    medicines: [
      {
        id: "med-4",
        name: "Omeprazole 20mg",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Take on empty stomach",
        beforeAfterFood: "before",
      },
      {
        id: "med-5",
        name: "Probiotics",
        dosage: "1 capsule",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals",
        beforeAfterFood: "with",
      },
    ],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "template-3",
    name: "Dental Pain Relief",
    description: "Pain management for dental procedures and tooth pain",
    department: "Dentistry",
    medicines: [
      {
        id: "med-6",
        name: "Ibuprofen 400mg",
        dosage: "400mg",
        frequency: "3 times daily",
        duration: "3 days",
        instructions: "Take with food to avoid stomach upset",
        beforeAfterFood: "with",
      },
      {
        id: "med-7",
        name: "Chlorhexidine Mouthwash",
        dosage: "15ml",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Rinse for 30 seconds, do not swallow",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem("prescriptionTemplates")
      if (savedTemplates) {
        const parsedTemplates = JSON.parse(savedTemplates)
        setTemplates([...sampleTemplates, ...parsedTemplates])
      } else {
        setTemplates(sampleTemplates)
      }
    } catch (error) {
      console.error("Error loading prescription templates:", error)
      setTemplates(sampleTemplates)
    }
  }, [])

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    try {
      const customTemplates = templates.filter(
        (template) => !sampleTemplates.some((sample) => sample.id === template.id),
      )
      localStorage.setItem("prescriptionTemplates", JSON.stringify(customTemplates))
    } catch (error) {
      console.error("Error saving prescription templates:", error)
    }
  }, [templates])

  const saveTemplate = (templateData: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTemplates((prev) => [...prev, newTemplate])
  }

  const deleteTemplate = (id: string) => {
    // Don't allow deletion of sample templates
    if (sampleTemplates.some((template) => template.id === id)) {
      return
    }
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getTemplatesByDepartment = (department: string) => {
    if (department === "All Departments") {
      return templates
    }
    return templates.filter((template) => template.department === department)
  }

  const searchTemplates = (query: string) => {
    if (!query.trim()) {
      return templates
    }

    const lowercaseQuery = query.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery) ||
        template.medicines.some(
          (medicine) =>
            medicine.name.toLowerCase().includes(lowercaseQuery) ||
            medicine.instructions.toLowerCase().includes(lowercaseQuery),
        ),
    )
  }

  const value = {
    templates,
    saveTemplate,
    deleteTemplate,
    getTemplatesByDepartment,
    searchTemplates,
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
