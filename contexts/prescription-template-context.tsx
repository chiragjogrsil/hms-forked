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
  type: "tablet" | "syrup" | "injection" | "capsule" | "ointment" | "drops"
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
  loadTemplate: (templateId: string) => PrescriptionTemplate | null
  deleteTemplate: (templateId: string) => void
  searchTemplates: (query: string, department?: string) => PrescriptionTemplate[]
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Sample templates for demonstration
const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "template-1",
    name: "Common Cold Treatment",
    description: "Standard prescription for common cold and flu symptoms",
    department: "General Medicine",
    medicines: [
      {
        id: "med-1",
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "5 days",
        instructions: "Take after meals",
        type: "tablet",
      },
      {
        id: "med-2",
        name: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "3 days",
        instructions: "Take at bedtime",
        type: "tablet",
      },
      {
        id: "med-3",
        name: "Cough Syrup",
        dosage: "10ml",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take after meals",
        type: "syrup",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "template-2",
    name: "Digestive Health Package",
    description: "Treatment for digestive issues and stomach problems",
    department: "Gastroenterology",
    medicines: [
      {
        id: "med-4",
        name: "Omeprazole",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Take before breakfast",
        type: "capsule",
      },
      {
        id: "med-5",
        name: "Domperidone",
        dosage: "10mg",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take before meals",
        type: "tablet",
      },
      {
        id: "med-6",
        name: "Probiotics",
        dosage: "1 sachet",
        frequency: "Once daily",
        duration: "10 days",
        instructions: "Mix with water and take",
        type: "tablet",
      },
    ],
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "template-3",
    name: "Dental Pain Relief",
    description: "Pain management for dental procedures and tooth pain",
    department: "Dentistry",
    medicines: [
      {
        id: "med-7",
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        duration: "3 days",
        instructions: "Take with food",
        type: "tablet",
      },
      {
        id: "med-8",
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Complete the course",
        type: "capsule",
      },
      {
        id: "med-9",
        name: "Chlorhexidine Mouthwash",
        dosage: "15ml",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Rinse for 30 seconds",
        type: "drops",
      },
    ],
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("prescriptionTemplates")
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates)
        setTemplates([...sampleTemplates, ...parsedTemplates])
      } catch (error) {
        console.error("Error parsing saved templates:", error)
        setTemplates(sampleTemplates)
      }
    } else {
      setTemplates(sampleTemplates)
    }
  }, [])

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    const customTemplates = templates.filter((t) => !sampleTemplates.find((st) => st.id === t.id))
    localStorage.setItem("prescriptionTemplates", JSON.stringify(customTemplates))
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

  const loadTemplate = (templateId: string): PrescriptionTemplate | null => {
    return templates.find((t) => t.id === templateId) || null
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  const searchTemplates = (query: string, department?: string): PrescriptionTemplate[] => {
    let filtered = templates

    if (department) {
      filtered = filtered.filter((t) => t.department.toLowerCase() === department.toLowerCase())
    }

    if (query.trim()) {
      const searchQuery = query.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery) ||
          t.description.toLowerCase().includes(searchQuery) ||
          t.medicines.some((m) => m.name.toLowerCase().includes(searchQuery)),
      )
    }

    return filtered
  }

  const getTemplatesByDepartment = (department: string): PrescriptionTemplate[] => {
    return templates.filter((t) => t.department.toLowerCase() === department.toLowerCase())
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        templates,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        searchTemplates,
        getTemplatesByDepartment,
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
