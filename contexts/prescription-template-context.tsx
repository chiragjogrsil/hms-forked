"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  category: "allopathic" | "ayurvedic" | "mixed"
  department: string
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
  createdAt: string
  createdBy: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => void
  loadTemplate: (templateId: string) => PrescriptionTemplate | null
  deleteTemplate: (templateId: string) => void
  searchTemplates: (query: string, department?: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function usePrescriptionTemplates() {
  const context = useContext(PrescriptionTemplateContext)
  if (!context) {
    throw new Error("usePrescriptionTemplates must be used within a PrescriptionTemplateProvider")
  }
  return context
}

const SAMPLE_TEMPLATES: PrescriptionTemplate[] = [
  {
    id: "template-1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold symptoms",
    category: "allopathic",
    department: "General OPD",
    allopathicMedicines: [
      {
        name: "Paracetamol 500mg",
        dosage: "1 tablet",
        frequency: "Twice daily",
        duration: "5 days",
        instructions: "Take after meals",
      },
      {
        name: "Cetirizine 10mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "3 days",
        instructions: "Take at bedtime",
      },
    ],
    ayurvedicMedicines: [],
    createdAt: new Date().toISOString(),
    createdBy: "Dr. Smith",
  },
  {
    id: "template-2",
    name: "Digestive Health",
    description: "Ayurvedic treatment for digestive issues",
    category: "ayurvedic",
    department: "General OPD",
    allopathicMedicines: [],
    ayurvedicMedicines: [
      {
        name: "Triphala Churna",
        dosage: "1 teaspoon",
        frequency: "Twice daily",
        duration: "15 days",
        instructions: "Take with warm water before meals",
      },
      {
        name: "Hingvastak Churna",
        dosage: "1/2 teaspoon",
        frequency: "After meals",
        duration: "10 days",
        instructions: "Mix with buttermilk",
      },
    ],
    createdAt: new Date().toISOString(),
    createdBy: "Dr. Ayurveda",
  },
  {
    id: "template-3",
    name: "Dental Pain Relief",
    description: "Treatment for dental pain and inflammation",
    category: "mixed",
    department: "Dental",
    allopathicMedicines: [
      {
        name: "Ibuprofen 400mg",
        dosage: "1 tablet",
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
        instructions: "Apply directly to affected tooth",
      },
    ],
    createdAt: new Date().toISOString(),
    createdBy: "Dr. Dental",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem("prescriptionTemplates")
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    } else {
      // Initialize with sample templates
      setTemplates(SAMPLE_TEMPLATES)
      localStorage.setItem("prescriptionTemplates", JSON.stringify(SAMPLE_TEMPLATES))
    }
  }, [])

  const saveTemplate = (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    const updatedTemplates = [...templates, newTemplate]
    setTemplates(updatedTemplates)
    localStorage.setItem("prescriptionTemplates", JSON.stringify(updatedTemplates))

    toast({
      title: "Template saved",
      description: `"${template.name}" has been saved successfully.`,
    })
  }

  const loadTemplate = (templateId: string): PrescriptionTemplate | null => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      toast({
        title: "Template loaded",
        description: `"${template.name}" has been loaded successfully.`,
      })
      return template
    }
    return null
  }

  const deleteTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    const updatedTemplates = templates.filter((t) => t.id !== templateId)
    setTemplates(updatedTemplates)
    localStorage.setItem("prescriptionTemplates", JSON.stringify(updatedTemplates))

    if (template) {
      toast({
        title: "Template deleted",
        description: `"${template.name}" has been deleted.`,
      })
    }
  }

  const searchTemplates = (query: string, department?: string): PrescriptionTemplate[] => {
    let filtered = templates

    if (department && department !== "all") {
      filtered = filtered.filter((t) => t.department === department)
    }

    if (query.trim()) {
      const searchQuery = query.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery) ||
          t.description?.toLowerCase().includes(searchQuery) ||
          t.allopathicMedicines.some((m) => m.name.toLowerCase().includes(searchQuery)) ||
          t.ayurvedicMedicines.some((m) => m.name.toLowerCase().includes(searchQuery)),
      )
    }

    return filtered
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        templates,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        searchTemplates,
      }}
    >
      {children}
    </PrescriptionTemplateContext.Provider>
  )
}
