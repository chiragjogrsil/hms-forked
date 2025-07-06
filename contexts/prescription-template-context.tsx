"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface PrescriptionMedicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  type: "allopathic" | "ayurvedic"
}

export interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  medicines: PrescriptionMedicine[]
  category: "allopathic" | "ayurvedic" | "mixed"
  department?: string
  createdAt: string
  createdBy: string
}

interface PrescriptionTemplateContextType {
  templates: PrescriptionTemplate[]
  saveTemplate: (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => void
  loadTemplate: (templateId: string) => PrescriptionTemplate | null
  deleteTemplate: (templateId: string) => void
  searchTemplates: (query: string) => PrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("prescriptionTemplates")
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    } else {
      // Initialize with sample templates
      const sampleTemplates: PrescriptionTemplate[] = [
        {
          id: "1",
          name: "Common Cold Treatment",
          description: "Standard treatment for common cold symptoms",
          category: "allopathic",
          department: "General Medicine",
          createdAt: new Date().toISOString(),
          createdBy: "Dr. Smith",
          medicines: [
            {
              id: "1",
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Twice daily",
              duration: "5 days",
              instructions: "Take after meals",
              type: "allopathic",
            },
            {
              id: "2",
              name: "Cetirizine",
              dosage: "10mg",
              frequency: "Once daily",
              duration: "3 days",
              instructions: "Take at bedtime",
              type: "allopathic",
            },
          ],
        },
        {
          id: "2",
          name: "Digestive Health",
          description: "Ayurvedic medicines for digestive issues",
          category: "ayurvedic",
          department: "Ayurveda",
          createdAt: new Date().toISOString(),
          createdBy: "Dr. Sharma",
          medicines: [
            {
              id: "3",
              name: "Triphala Churna",
              dosage: "1 tsp",
              frequency: "Twice daily",
              duration: "15 days",
              instructions: "Take with warm water before meals",
              type: "ayurvedic",
            },
            {
              id: "4",
              name: "Hingvastak Churna",
              dosage: "1/2 tsp",
              frequency: "After meals",
              duration: "10 days",
              instructions: "Mix with buttermilk",
              type: "ayurvedic",
            },
          ],
        },
      ]
      setTemplates(sampleTemplates)
      localStorage.setItem("prescriptionTemplates", JSON.stringify(sampleTemplates))
    }
  }, [])

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem("prescriptionTemplates", JSON.stringify(templates))
    }
  }, [templates])

  const saveTemplate = (template: Omit<PrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: PrescriptionTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTemplates((prev) => [...prev, newTemplate])
  }

  const loadTemplate = (templateId: string): PrescriptionTemplate | null => {
    return templates.find((template) => template.id === templateId) || null
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId))
  }

  const searchTemplates = (query: string): PrescriptionTemplate[] => {
    if (!query.trim()) return templates

    const lowercaseQuery = query.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description?.toLowerCase().includes(lowercaseQuery) ||
        template.medicines.some((medicine) => medicine.name.toLowerCase().includes(lowercaseQuery)),
    )
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

export function usePrescriptionTemplates() {
  const context = useContext(PrescriptionTemplateContext)
  if (context === undefined) {
    throw new Error("usePrescriptionTemplates must be used within a PrescriptionTemplateProvider")
  }
  return context
}
