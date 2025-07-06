"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  allopathicMedicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  ayurvedicMedicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  category: "allopathic" | "ayurvedic" | "mixed"
  department: string
  createdAt: string
  createdBy: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => void
  loadTemplate: (templateId: string) => PrescriptionTemplate | null
  deleteTemplate: (templateId: string) => void
  searchTemplates: (query: string) => PrescriptionTemplate[]
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function usePrescriptionTemplates() {
  const context = useContext(PrescriptionTemplateContext)
  if (!context) {
    throw new Error("usePrescriptionTemplates must be used within a PrescriptionTemplateProvider")
  }
  return context
}

const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold symptoms",
    allopathicMedicines: [
      {
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "5 days",
        instructions: "Take after meals",
      },
      {
        name: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "3 days",
        instructions: "Take at bedtime",
      },
    ],
    ayurvedicMedicines: [],
    category: "allopathic",
    department: "General Medicine",
    createdAt: "2024-01-15",
    createdBy: "Dr. Smith",
  },
  {
    id: "2",
    name: "Digestive Health",
    description: "Ayurvedic treatment for digestive issues",
    allopathicMedicines: [],
    ayurvedicMedicines: [
      {
        name: "Triphala Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "15 days",
        instructions: "Take with warm water before meals",
      },
      {
        name: "Hingvastak Churna",
        dosage: "1/2 tsp",
        frequency: "After meals",
        duration: "10 days",
        instructions: "Mix with buttermilk",
      },
    ],
    category: "ayurvedic",
    department: "Ayurveda",
    createdAt: "2024-01-10",
    createdBy: "Dr. Patel",
  },
  {
    id: "3",
    name: "Dental Pain Relief",
    description: "Mixed treatment for dental pain and inflammation",
    allopathicMedicines: [
      {
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Three times daily",
        duration: "3 days",
        instructions: "Take with food",
      },
    ],
    ayurvedicMedicines: [
      {
        name: "Clove Oil",
        dosage: "2-3 drops",
        frequency: "As needed",
        duration: "5 days",
        instructions: "Apply topically to affected area",
      },
    ],
    category: "mixed",
    department: "Dentistry",
    createdAt: "2024-01-12",
    createdBy: "Dr. Johnson",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  useEffect(() => {
    const savedTemplates = localStorage.getItem("prescriptionTemplates")
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    } else {
      setTemplates(sampleTemplates)
      localStorage.setItem("prescriptionTemplates", JSON.stringify(sampleTemplates))
    }
  }, [])

  const saveTemplate = (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }

    const updatedTemplates = [...templates, newTemplate]
    setTemplates(updatedTemplates)
    localStorage.setItem("prescriptionTemplates", JSON.stringify(updatedTemplates))
  }

  const loadTemplate = (templateId: string) => {
    return templates.find((template) => template.id === templateId) || null
  }

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== templateId)
    setTemplates(updatedTemplates)
    localStorage.setItem("prescriptionTemplates", JSON.stringify(updatedTemplates))
  }

  const searchTemplates = (query: string) => {
    if (!query.trim()) return templates

    const lowercaseQuery = query.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description?.toLowerCase().includes(lowercaseQuery) ||
        template.allopathicMedicines.some((med) => med.name.toLowerCase().includes(lowercaseQuery)) ||
        template.ayurvedicMedicines.some((med) => med.name.toLowerCase().includes(lowercaseQuery)),
    )
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter((template) => template.department === department)
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
