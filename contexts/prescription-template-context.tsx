"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  category: "allopathic" | "ayurvedic" | "mixed"
  allopathicPrescriptions: any[]
  ayurvedicPrescriptions: any[]
  createdAt: string
  createdBy: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => void
  deleteTemplate: (id: string) => void
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
  searchTemplates: (query: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold symptoms",
    department: "general",
    category: "allopathic",
    allopathicPrescriptions: [
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
    ayurvedicPrescriptions: [],
    createdAt: "2024-01-15",
    createdBy: "Dr. Smith",
  },
  {
    id: "2",
    name: "Dental Pain Relief",
    description: "For dental procedures and pain management",
    department: "dental",
    category: "allopathic",
    allopathicPrescriptions: [
      {
        id: "1",
        medicine: "Ibuprofen 400mg",
        dosage: "1-1-1",
        timing: "after-food",
        duration: "3",
        quantity: 9,
        instructions: "Take 1 tablet three times daily after food",
      },
      {
        id: "2",
        medicine: "Amoxicillin 500mg",
        dosage: "1-0-1",
        timing: "after-food",
        duration: "5",
        quantity: 10,
        instructions: "Take 1 tablet morning and evening after food",
      },
    ],
    ayurvedicPrescriptions: [],
    createdAt: "2024-01-10",
    createdBy: "Dr. Johnson",
  },
  {
    id: "3",
    name: "Digestive Health",
    description: "Ayurvedic treatment for digestive issues",
    department: "Ayurveda",
    category: "ayurvedic",
    allopathicPrescriptions: [],
    ayurvedicPrescriptions: [
      {
        id: "1",
        medicine: "Triphala Churna",
        dosage: "1 tsp twice daily",
        duration: "15 days",
        instructions: "Mix with warm water, take before meals",
      },
      {
        id: "2",
        medicine: "Hingvastak Churna",
        dosage: "1/2 tsp after meals",
        duration: "10 days",
        instructions: "Take with buttermilk after meals",
      },
    ],
    createdAt: "2024-01-12",
    createdBy: "Dr. Patel",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem("prescriptionTemplates")
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    } else {
      // Initialize with sample templates
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

  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== id)
    setTemplates(updatedTemplates)
    localStorage.setItem("prescriptionTemplates", JSON.stringify(updatedTemplates))
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter(
      (template) => template.department === department || template.department === "general" || department === "general",
    )
  }

  const searchTemplates = (query: string) => {
    if (!query.trim()) return templates

    const lowercaseQuery = query.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description?.toLowerCase().includes(lowercaseQuery) ||
        template.allopathicPrescriptions.some((med) => med.medicine.toLowerCase().includes(lowercaseQuery)) ||
        template.ayurvedicPrescriptions.some((med) => med.medicine.toLowerCase().includes(lowercaseQuery)),
    )
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        templates,
        saveTemplate,
        deleteTemplate,
        getTemplatesByDepartment,
        searchTemplates,
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
