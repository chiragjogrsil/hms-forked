"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface AyurvedicMedicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface AllopathicMedicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface AyurvedicTemplate {
  id: string
  name: string
  department: string
  medicines: AyurvedicMedicine[]
  pathya: string[]
  apathya: string[]
  generalInstructions: string
  createdBy: string
  createdAt: string
}

export interface AllopathicTemplate {
  id: string
  name: string
  department: string
  medicines: AllopathicMedicine[]
  dietaryConstraints: string[]
  generalInstructions: string
  createdBy: string
  createdAt: string
}

interface PrescriptionTemplateContextType {
  // Ayurvedic Templates
  ayurvedicTemplates: AyurvedicTemplate[]
  saveAyurvedicTemplate: (template: Omit<AyurvedicTemplate, "id" | "createdAt">) => void
  deleteAyurvedicTemplate: (id: string) => void
  getAyurvedicTemplate: (id: string) => AyurvedicTemplate | undefined
  getAyurvedicTemplatesByDepartment: (department: string) => AyurvedicTemplate[]
  getAllAyurvedicTemplates: () => AyurvedicTemplate[]

  // Allopathic Templates
  allopathicTemplates: AllopathicTemplate[]
  saveAllopathicTemplate: (template: Omit<AllopathicTemplate, "id" | "createdAt">) => void
  deleteAllopathicTemplate: (id: string) => void
  getAllopathicTemplate: (id: string) => AllopathicTemplate | undefined
  getAllopathicTemplatesByDepartment: (department: string) => AllopathicTemplate[]
  getAllAllopathicTemplates: () => AllopathicTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [ayurvedicTemplates, setAyurvedicTemplates] = useState<AyurvedicTemplate[]>([
    // Sample Ayurvedic templates
    {
      id: "ayur_template_1",
      name: "Common Cold & Cough",
      department: "general",
      medicines: [
        {
          id: "1",
          name: "Sitopaladi Churna",
          dosage: "1 tsp",
          frequency: "Twice daily",
          duration: "7 days",
          instructions: "Mix with honey, take after meals",
        },
        {
          id: "2",
          name: "Tulsi Drops",
          dosage: "5 drops",
          frequency: "Thrice daily",
          duration: "5 days",
          instructions: "Mix in warm water",
        },
      ],
      pathya: ["Warm water", "Light food", "Rest", "Ginger tea"],
      apathya: ["Cold food", "Ice cream", "Cold drinks", "Heavy meals"],
      generalInstructions: "Take rest and avoid cold exposure",
      createdBy: "Dr. Sharma",
      createdAt: "2024-01-15T00:00:00.000Z",
    },
    {
      id: "ayur_template_2",
      name: "Digestive Issues",
      department: "general",
      medicines: [
        {
          id: "1",
          name: "Hingwashtak Churna",
          dosage: "1/2 tsp",
          frequency: "Before meals",
          duration: "10 days",
          instructions: "Take with warm water",
        },
        {
          id: "2",
          name: "Avipattikar Churna",
          dosage: "1 tsp",
          frequency: "At bedtime",
          duration: "15 days",
          instructions: "Take with lukewarm water",
        },
      ],
      pathya: ["Buttermilk", "Light meals", "Fruits", "Vegetables"],
      apathya: ["Spicy food", "Fried food", "Late night meals", "Alcohol"],
      generalInstructions: "Follow proper meal timings and avoid heavy foods",
      createdBy: "Dr. Patel",
      createdAt: "2024-01-20T00:00:00.000Z",
    },
  ])

  const [allopathicTemplates, setAllopathicTemplates] = useState<AllopathicTemplate[]>([
    // Sample Allopathic templates
    {
      id: "allo_template_1",
      name: "Hypertension Management",
      department: "general",
      medicines: [
        {
          id: "1",
          name: "Amlodipine 5mg",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in the morning after food",
        },
        {
          id: "2",
          name: "Metoprolol 25mg",
          dosage: "1 tablet",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take morning and evening after food",
        },
      ],
      dietaryConstraints: ["Avoid alcohol", "Low salt diet", "Avoid smoking", "Regular exercise"],
      generalInstructions: "Monitor blood pressure regularly and follow up in 2 weeks",
      createdBy: "Dr. Kumar",
      createdAt: "2024-01-10T00:00:00.000Z",
    },
    {
      id: "allo_template_2",
      name: "Diabetes Type 2",
      department: "general",
      medicines: [
        {
          id: "1",
          name: "Metformin 500mg",
          dosage: "1 tablet",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take morning and evening after food",
        },
        {
          id: "2",
          name: "Glimepiride 1mg",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in the morning before food",
        },
      ],
      dietaryConstraints: ["Avoid sugar", "Low carb diet", "Regular meals", "Avoid alcohol"],
      generalInstructions: "Monitor blood sugar levels and maintain diet chart",
      createdBy: "Dr. Singh",
      createdAt: "2024-01-12T00:00:00.000Z",
    },
    {
      id: "allo_template_3",
      name: "Dental Pain Relief",
      department: "dental",
      medicines: [
        {
          id: "1",
          name: "Amoxicillin 500mg",
          dosage: "1 tablet",
          frequency: "Three times daily",
          duration: "5 days",
          instructions: "Take after food",
        },
        {
          id: "2",
          name: "Ibuprofen 400mg",
          dosage: "1 tablet",
          frequency: "As needed",
          duration: "3 days",
          instructions: "Take when symptoms occur after food",
        },
      ],
      dietaryConstraints: ["Avoid hot food", "Soft diet", "Avoid smoking", "Rinse with warm salt water"],
      generalInstructions: "Apply cold compress and avoid hard foods",
      createdBy: "Dr. Dental",
      createdAt: "2024-01-18T00:00:00.000Z",
    },
  ])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedAyurvedicTemplates = localStorage.getItem("ayurvedic-templates")
    const savedAllopathicTemplates = localStorage.getItem("allopathic-templates")

    if (savedAyurvedicTemplates) {
      try {
        const parsed = JSON.parse(savedAyurvedicTemplates)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAyurvedicTemplates(parsed)
        }
      } catch (error) {
        console.error("Error parsing saved ayurvedic templates:", error)
      }
    }

    if (savedAllopathicTemplates) {
      try {
        const parsed = JSON.parse(savedAllopathicTemplates)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllopathicTemplates(parsed)
        }
      } catch (error) {
        console.error("Error parsing saved allopathic templates:", error)
      }
    }
  }, [])

  // Save ayurvedic templates to localStorage whenever they change
  useEffect(() => {
    if (ayurvedicTemplates.length > 0) {
      localStorage.setItem("ayurvedic-templates", JSON.stringify(ayurvedicTemplates))
    }
  }, [ayurvedicTemplates])

  // Save allopathic templates to localStorage whenever they change
  useEffect(() => {
    if (allopathicTemplates.length > 0) {
      localStorage.setItem("allopathic-templates", JSON.stringify(allopathicTemplates))
    }
  }, [allopathicTemplates])

  const saveAyurvedicTemplate = (template: Omit<AyurvedicTemplate, "id" | "createdAt">) => {
    const newTemplate: AyurvedicTemplate = {
      ...template,
      id: `ayur_template_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setAyurvedicTemplates((prev) => [...prev, newTemplate])
  }

  const deleteAyurvedicTemplate = (id: string) => {
    setAyurvedicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getAyurvedicTemplate = (id: string) => {
    return ayurvedicTemplates.find((template) => template.id === id)
  }

  const getAyurvedicTemplatesByDepartment = (department: string) => {
    return ayurvedicTemplates.filter((template) => template.department === department)
  }

  const getAllAyurvedicTemplates = () => {
    return ayurvedicTemplates
  }

  const saveAllopathicTemplate = (template: Omit<AllopathicTemplate, "id" | "createdAt">) => {
    const newTemplate: AllopathicTemplate = {
      ...template,
      id: `allo_template_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setAllopathicTemplates((prev) => [...prev, newTemplate])
  }

  const deleteAllopathicTemplate = (id: string) => {
    setAllopathicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getAllopathicTemplate = (id: string) => {
    return allopathicTemplates.find((template) => template.id === id)
  }

  const getAllopathicTemplatesByDepartment = (department: string) => {
    return allopathicTemplates.filter((template) => template.department === department)
  }

  const getAllAllopathicTemplates = () => {
    return allopathicTemplates
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        ayurvedicTemplates,
        saveAyurvedicTemplate,
        deleteAyurvedicTemplate,
        getAyurvedicTemplate,
        getAyurvedicTemplatesByDepartment,
        getAllAyurvedicTemplates,
        allopathicTemplates,
        saveAllopathicTemplate,
        deleteAllopathicTemplate,
        getAllopathicTemplate,
        getAllopathicTemplatesByDepartment,
        getAllAllopathicTemplates,
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
