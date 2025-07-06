"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface PrescriptionTemplate {
  id: string
  name: string
  description: string
  department: string
  ayurvedicPrescriptions: Array<{
    id: string
    medicine: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
    beforeAfterFood: string
  }>
  allopathicPrescriptions: Array<{
    id: string
    medicine: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
    beforeAfterFood: string
  }>
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

// Sample templates for demonstration
const sampleTemplates: PrescriptionTemplate[] = [
  {
    id: "template-1",
    name: "Common Cold Treatment",
    description: "Standard treatment for common cold and flu symptoms",
    department: "General Medicine",
    ayurvedicPrescriptions: [
      {
        id: "1",
        medicine: "Sitopaladi Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Mix with honey",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Tulsi Drops",
        dosage: "5 drops",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Mix in warm water",
        beforeAfterFood: "anytime",
      },
    ],
    allopathicPrescriptions: [
      {
        id: "1",
        medicine: "Paracetamol 500mg",
        dosage: "1 tablet",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Take for fever",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Cetirizine 10mg",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "7 days",
        instructions: "Take at bedtime",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "template-2",
    name: "Digestive Health Package",
    description: "Comprehensive treatment for digestive issues and acidity",
    department: "Gastroenterology",
    ayurvedicPrescriptions: [
      {
        id: "1",
        medicine: "Triphala Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "15 days",
        instructions: "Take with warm water",
        beforeAfterFood: "before",
      },
      {
        id: "2",
        medicine: "Avipattikar Churna",
        dosage: "1/2 tsp",
        frequency: "After meals",
        duration: "10 days",
        instructions: "Mix with water",
        beforeAfterFood: "after",
      },
    ],
    allopathicPrescriptions: [
      {
        id: "1",
        medicine: "Omeprazole 20mg",
        dosage: "1 capsule",
        frequency: "Once daily",
        duration: "14 days",
        instructions: "Take before breakfast",
        beforeAfterFood: "before",
      },
      {
        id: "2",
        medicine: "Domperidone 10mg",
        dosage: "1 tablet",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take before meals",
        beforeAfterFood: "before",
      },
    ],
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "template-3",
    name: "Dental Pain Relief",
    description: "Treatment for dental pain and oral infections",
    department: "Dental",
    ayurvedicPrescriptions: [
      {
        id: "1",
        medicine: "Clove Oil",
        dosage: "2-3 drops",
        frequency: "As needed",
        duration: "5 days",
        instructions: "Apply directly to affected tooth",
        beforeAfterFood: "anytime",
      },
    ],
    allopathicPrescriptions: [
      {
        id: "1",
        medicine: "Ibuprofen 400mg",
        dosage: "1 tablet",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "Take for pain relief",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Amoxicillin 500mg",
        dosage: "1 capsule",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Complete the course",
        beforeAfterFood: "after",
      },
      {
        id: "3",
        medicine: "Chlorhexidine Mouthwash",
        dosage: "10ml",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Rinse for 30 seconds",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
  },
]

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem("prescription-templates")
      if (savedTemplates) {
        const parsed = JSON.parse(savedTemplates)
        // Merge with sample templates if no saved templates exist
        if (parsed.length === 0) {
          setTemplates(sampleTemplates)
        } else {
          // Check if sample templates exist, if not add them
          const existingSampleIds = parsed
            .filter((t: PrescriptionTemplate) => sampleTemplates.some((sample) => sample.id === t.id))
            .map((t: PrescriptionTemplate) => t.id)

          const newSampleTemplates = sampleTemplates.filter((sample) => !existingSampleIds.includes(sample.id))

          setTemplates([...parsed, ...newSampleTemplates])
        }
      } else {
        // First time - use sample templates
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
      localStorage.setItem("prescription-templates", JSON.stringify(templates))
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

    setTemplates((prev) => [newTemplate, ...prev])
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getTemplatesByDepartment = (department: string) => {
    return templates.filter(
      (template) =>
        template.department.toLowerCase() === department.toLowerCase() ||
        template.department.toLowerCase() === "general medicine" ||
        department.toLowerCase() === "general medicine",
    )
  }

  const searchTemplates = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.department.toLowerCase().includes(lowercaseQuery) ||
        template.ayurvedicPrescriptions.some((med) => med.medicine.toLowerCase().includes(lowercaseQuery)) ||
        template.allopathicPrescriptions.some((med) => med.medicine.toLowerCase().includes(lowercaseQuery)),
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
