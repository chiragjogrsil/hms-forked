"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PrescriptionTemplate {
  id: string
  name: string
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
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  const saveTemplate = (templateData: Omit<PrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...templateData,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter((template) => template.department === department)
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        templates,
        saveTemplate,
        getTemplatesByDepartment,
        deleteTemplate,
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
