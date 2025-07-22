"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PrescriptionItem {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface AyurvedicPrescriptionItem {
  id: string
  medicine: string
  dosage: string
  timing: string
  duration: string
  instructions: string
  anupana?: string // Vehicle for taking medicine
}

interface PrescriptionTemplate {
  id: string
  name: string
  description: string
  department: string
  type: "allopathic" | "ayurvedic"
  prescriptions: PrescriptionItem[]
  ayurvedicPrescriptions?: AyurvedicPrescriptionItem[]
  pathya?: string[] // Do's
  apathya?: string[] // Don'ts
  dietaryInstructions?: string
  lifestyleRecommendations?: string
  createdAt: Date
  updatedAt: Date
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  addTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => void
  updateTemplate: (id: string, template: Partial<PrescriptionTemplate>) => void
  deleteTemplate: (id: string) => void
  getTemplatesByDepartment: (department: string) => PrescriptionTemplate[]
  getTemplatesByType: (type: "allopathic" | "ayurvedic") => PrescriptionTemplate[]
  searchTemplates: (query: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

// Sample templates
const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "1",
    name: "Hypertension Management",
    description: "Standard treatment for hypertension",
    department: "Cardiology",
    type: "allopathic",
    prescriptions: [
      {
        id: "1",
        medication: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take in the morning with food",
      },
      {
        id: "2",
        medication: "Metoprolol",
        dosage: "25mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Diabetes Type 2 Management",
    description: "Standard treatment for Type 2 diabetes",
    department: "Endocrinology",
    type: "allopathic",
    prescriptions: [
      {
        id: "1",
        medication: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals to reduce GI upset",
      },
      {
        id: "2",
        medication: "Glimepiride",
        dosage: "2mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take before breakfast",
      },
    ],
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Respiratory Wellness",
    description: "Ayurvedic treatment for respiratory health",
    department: "Ayurveda",
    type: "ayurvedic",
    prescriptions: [],
    ayurvedicPrescriptions: [
      {
        id: "1",
        medicine: "Sitopaladi Churna",
        dosage: "3g",
        timing: "Twice daily",
        duration: "15 days",
        instructions: "Mix with honey",
        anupana: "Honey",
      },
      {
        id: "2",
        medicine: "Vasaka Syrup",
        dosage: "10ml",
        timing: "Three times daily",
        duration: "10 days",
        instructions: "Take after meals",
      },
    ],
    pathya: ["Warm water consumption", "Light, easily digestible food", "Steam inhalation", "Adequate rest"],
    apathya: ["Cold drinks and ice cream", "Heavy, oily foods", "Exposure to cold air", "Smoking and alcohol"],
    dietaryInstructions: "Follow a warm, light diet. Avoid cold and heavy foods.",
    lifestyleRecommendations: "Practice pranayama and gentle yoga. Maintain regular sleep schedule.",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
]

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>(sampleTemplates)

  const addTemplate = (templateData: Omit<PrescriptionTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }

  const updateTemplate = (id: string, templateData: Partial<PrescriptionTemplate>) => {
    setTemplates((prev) =>
      prev.map((template) => (template.id === id ? { ...template, ...templateData, updatedAt: new Date() } : template)),
    )
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter((template) => template.department === department)
  }

  const getTemplatesByType = (type: "allopathic" | "ayurvedic") => {
    return templates.filter((template) => template.type === type)
  }

  const searchTemplates = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery),
    )
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplatesByDepartment,
        getTemplatesByType,
        searchTemplates,
      }}
    >
      {children}
    </PrescriptionTemplateContext.Provider>
  )
}

export function usePrescriptionTemplate() {
  const context = useContext(PrescriptionTemplateContext)
  if (context === undefined) {
    throw new Error("usePrescriptionTemplate must be used within a PrescriptionTemplateProvider")
  }
  return context
}
