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
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("prescription-templates")
      if (saved) {
        try {
          return JSON.parse(saved).map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }))
        } catch {
          return []
        }
      }
    }
    return []
  })

  const saveTemplate = (templateData: Omit<PrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...templateData,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
    }

    const updatedTemplates = [...templates, newTemplate]
    setTemplates(updatedTemplates)

    if (typeof window !== "undefined") {
      localStorage.setItem("prescription-templates", JSON.stringify(updatedTemplates))
    }
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter((template) => template.department === department)
  }

  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== id)
    setTemplates(updatedTemplates)

    if (typeof window !== "undefined") {
      localStorage.setItem("prescription-templates", JSON.stringify(updatedTemplates))
    }
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
