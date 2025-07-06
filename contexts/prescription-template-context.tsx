"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  createdBy: string
  createdAt: string
  category: "allopathic" | "ayurvedic" | "mixed"
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
    department: "General Medicine",
    createdBy: "Dr. Smith",
    createdAt: "2024-01-15T10:00:00Z",
    category: "allopathic",
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
  },
  {
    id: "template-2",
    name: "Digestive Health",
    description: "Ayurvedic treatment for digestive issues",
    department: "Ayurveda",
    createdBy: "Dr. Patel",
    createdAt: "2024-01-10T14:30:00Z",
    category: "ayurvedic",
    allopathicMedicines: [],
    ayurvedicMedicines: [
      {
        name: "Triphala Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "15 days",
        instructions: "Mix with warm water before meals",
      },
      {
        name: "Hingvastak Churna",
        dosage: "1/2 tsp",
        frequency: "After meals",
        duration: "10 days",
        instructions: "Take with buttermilk",
      },
    ],
  },
  {
    id: "template-3",
    name: "Dental Pain Relief",
    description: "Mixed treatment for dental pain and inflammation",
    department: "Dental",
    createdBy: "Dr. Johnson",
    createdAt: "2024-01-12T09:15:00Z",
    category: "mixed",
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
        duration: "Until relief",
        instructions: "Apply directly to affected tooth",
      },
    ],
  },
]

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Load templates from localStorage on mount
    const savedTemplates = localStorage.getItem("prescription-templates")
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates)
        setTemplates([...SAMPLE_TEMPLATES, ...parsed])
      } catch (error) {
        console.error("Error loading templates:", error)
        setTemplates(SAMPLE_TEMPLATES)
      }
    } else {
      setTemplates(SAMPLE_TEMPLATES)
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

    // Save to localStorage (excluding sample templates)
    const customTemplates = updatedTemplates.filter((t) => !SAMPLE_TEMPLATES.find((s) => s.id === t.id))
    localStorage.setItem("prescription-templates", JSON.stringify(customTemplates))

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
    if (!template) return

    // Don't allow deletion of sample templates
    if (SAMPLE_TEMPLATES.find((s) => s.id === templateId)) {
      toast({
        title: "Cannot delete",
        description: "Sample templates cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    const updatedTemplates = templates.filter((t) => t.id !== templateId)
    setTemplates(updatedTemplates)

    // Update localStorage
    const customTemplates = updatedTemplates.filter((t) => !SAMPLE_TEMPLATES.find((s) => s.id === t.id))
    localStorage.setItem("prescription-templates", JSON.stringify(customTemplates))

    toast({
      title: "Template deleted",
      description: `"${template.name}" has been deleted.`,
    })
  }

  const searchTemplates = (query: string, department?: string): PrescriptionTemplate[] => {
    let filtered = templates

    if (department && department !== "all") {
      filtered = filtered.filter((t) => t.department === department)
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm) ||
          t.description?.toLowerCase().includes(searchTerm) ||
          t.allopathicMedicines.some((m) => m.name.toLowerCase().includes(searchTerm)) ||
          t.ayurvedicMedicines.some((m) => m.name.toLowerCase().includes(searchTerm)),
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
