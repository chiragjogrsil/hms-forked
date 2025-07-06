"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  type: "ayurvedic" | "allopathic" | "mixed"
  ayurvedicPrescriptions: any[]
  allopathicPrescriptions: any[]
  createdAt: Date
  createdBy: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => void
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
  deleteTemplate: (id: string) => void
  loadTemplate: (id: string) => PrescriptionTemplate | null
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Mock initial templates for demonstration
const initialTemplates: PrescriptionTemplate[] = [
  {
    id: "template_1",
    name: "Common Cold Treatment",
    description: "Standard treatment for viral infections",
    department: "General Medicine",
    type: "mixed",
    ayurvedicPrescriptions: [
      {
        id: "ayur_1",
        medicine: "Sitopaladi Churna",
        dosage: "3g",
        duration: "7 days",
        instructions: "Mix with honey, take twice daily",
      },
    ],
    allopathicPrescriptions: [
      {
        id: "allo_1",
        medicine: "Paracetamol 500mg",
        dosage: "1-0-1",
        timing: "after-food",
        duration: "5",
        quantity: 10,
        instructions: "Take 1 tablet morning and evening after food",
      },
    ],
    createdAt: new Date("2024-01-15"),
    createdBy: "Dr. Smith",
  },
  {
    id: "template_2",
    name: "Hypertension Management",
    description: "Standard BP control medication",
    department: "Cardiology",
    type: "allopathic",
    ayurvedicPrescriptions: [],
    allopathicPrescriptions: [
      {
        id: "allo_2",
        medicine: "Amlodipine 5mg",
        dosage: "1-0-0",
        timing: "after-food",
        duration: "30",
        quantity: 30,
        instructions: "Take 1 tablet in the morning after food",
      },
    ],
    createdAt: new Date("2024-01-10"),
    createdBy: "Dr. Johnson",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("prescription-templates")
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates)
        setTemplates([...initialTemplates, ...parsed])
      } catch (error) {
        console.error("Error loading templates:", error)
        setTemplates(initialTemplates)
      }
    } else {
      setTemplates(initialTemplates)
    }
  }, [])

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    if (templates.length > 0) {
      const customTemplates = templates.filter((t) => !initialTemplates.find((it) => it.id === t.id))
      localStorage.setItem("prescription-templates", JSON.stringify(customTemplates))
    }
  }, [templates])

  const saveTemplate = (templateData: Omit<PrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...templateData,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
    toast.success("Prescription template saved successfully!")
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter((template) => template.department === department)
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
    toast.success("Template deleted successfully!")
  }

  const loadTemplate = (id: string) => {
    return templates.find((template) => template.id === id) || null
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        templates,
        saveTemplate,
        getTemplatesByDepartment,
        deleteTemplate,
        loadTemplate,
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
