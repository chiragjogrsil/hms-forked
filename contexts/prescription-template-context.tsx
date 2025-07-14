"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AyurvedicPrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  type: "ayurvedic"
  prescriptions: any[]
  pathya: string[]
  apathya: string[]
  createdAt: Date
  createdBy: string
}

interface AllopathicPrescriptionTemplate {
  id: string
  name: string
  description?: string
  department: string
  type: "allopathic"
  prescriptions: any[]
  dietaryConstraints: string[]
  createdAt: Date
  createdBy: string
}

type PrescriptionTemplate = AyurvedicPrescriptionTemplate | AllopathicPrescriptionTemplate

interface PrescriptionTemplateContextType {
  ayurvedicTemplates: AyurvedicPrescriptionTemplate[]
  allopathicTemplates: AllopathicPrescriptionTemplate[]
  saveAyurvedicTemplate: (template: Omit<AyurvedicPrescriptionTemplate, "id" | "createdAt">) => void
  saveAllopathicTemplate: (template: Omit<AllopathicPrescriptionTemplate, "id" | "createdAt">) => void
  getAyurvedicTemplatesByDepartment: (department: string) => AyurvedicPrescriptionTemplate[]
  getAllopathicTemplatesByDepartment: (department: string) => AllopathicPrescriptionTemplate[]
  deleteAyurvedicTemplate: (id: string) => void
  deleteAllopathicTemplate: (id: string) => void
  getAllAyurvedicTemplates: () => AyurvedicPrescriptionTemplate[]
  getAllAllopathicTemplates: () => AllopathicPrescriptionTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function PrescriptionTemplateProvider({ children }: { children: ReactNode }) {
  const [ayurvedicTemplates, setAyurvedicTemplates] = useState<AyurvedicPrescriptionTemplate[]>([
    // Sample Ayurvedic templates
    {
      id: "ayur_template_1",
      name: "Common Cold & Cough",
      description: "Standard treatment for viral upper respiratory infections",
      department: "general",
      type: "ayurvedic",
      prescriptions: [
        {
          id: "1",
          medicine: "Sitopaladi Churna",
          dosage: "1 tsp",
          duration: "7 days",
          instructions: "Mix with honey, take twice daily after meals",
          constituents: ["Sitopala", "Pippali", "Ela", "Twak"],
        },
        {
          id: "2",
          medicine: "Tulsi Drops",
          dosage: "5 drops",
          duration: "5 days",
          instructions: "Mix in warm water, take thrice daily",
          constituents: ["Tulsi extract"],
        },
      ],
      pathya: ["Warm water", "Light food", "Rest", "Ginger tea"],
      apathya: ["Cold food", "Ice cream", "Cold drinks", "Heavy meals"],
      createdAt: new Date("2024-01-15"),
      createdBy: "Dr. Sharma",
    },
    {
      id: "ayur_template_2",
      name: "Digestive Issues",
      description: "For indigestion, acidity, and gastric problems",
      department: "general",
      type: "ayurvedic",
      prescriptions: [
        {
          id: "1",
          medicine: "Hingwashtak Churna",
          dosage: "1/2 tsp",
          duration: "10 days",
          instructions: "Take with warm water before meals",
          constituents: ["Hing", "Jeera", "Dhania", "Ajwain"],
        },
        {
          id: "2",
          medicine: "Avipattikar Churna",
          dosage: "1 tsp",
          duration: "15 days",
          instructions: "Take with lukewarm water at bedtime",
          constituents: ["Amla", "Haritaki", "Vibhitaki", "Pippali"],
        },
      ],
      pathya: ["Buttermilk", "Light meals", "Fruits", "Vegetables"],
      apathya: ["Spicy food", "Fried food", "Late night meals", "Alcohol"],
      createdAt: new Date("2024-01-20"),
      createdBy: "Dr. Patel",
    },
  ])

  const [allopathicTemplates, setAllopathicTemplates] = useState<AllopathicPrescriptionTemplate[]>([
    // Sample Allopathic templates
    {
      id: "allo_template_1",
      name: "Hypertension Management",
      description: "Standard protocol for managing high blood pressure",
      department: "general",
      type: "allopathic",
      prescriptions: [
        {
          id: "1",
          medicine: "Amlodipine 5mg",
          dosage: "1-0-0",
          timing: "after-food",
          duration: "30",
          quantity: 30,
          instructions: "Take 1 tablet in the morning after food",
        },
        {
          id: "2",
          medicine: "Metoprolol 25mg",
          dosage: "1-0-1",
          timing: "after-food",
          duration: "30",
          quantity: 60,
          instructions: "Take 1 tablet morning and evening after food",
        },
      ],
      dietaryConstraints: ["Avoid alcohol", "Low salt diet", "Avoid smoking", "Regular exercise"],
      createdAt: new Date("2024-01-10"),
      createdBy: "Dr. Kumar",
    },
    {
      id: "allo_template_2",
      name: "Diabetes Type 2",
      description: "Initial management for Type 2 Diabetes Mellitus",
      department: "general",
      type: "allopathic",
      prescriptions: [
        {
          id: "1",
          medicine: "Metformin 500mg",
          dosage: "1-0-1",
          timing: "after-food",
          duration: "30",
          quantity: 60,
          instructions: "Take 1 tablet morning and evening after food",
        },
        {
          id: "2",
          medicine: "Glimepiride 1mg",
          dosage: "1-0-0",
          timing: "before-food",
          duration: "30",
          quantity: 30,
          instructions: "Take 1 tablet in the morning before food",
        },
      ],
      dietaryConstraints: ["Avoid sugar", "Low carb diet", "Regular meals", "Avoid alcohol"],
      createdAt: new Date("2024-01-12"),
      createdBy: "Dr. Singh",
    },
    {
      id: "allo_template_3",
      name: "Dental Pain Relief",
      description: "Post-extraction pain and infection management",
      department: "dental",
      type: "allopathic",
      prescriptions: [
        {
          id: "1",
          medicine: "Amoxicillin 500mg",
          dosage: "1-1-1",
          timing: "after-food",
          duration: "5",
          quantity: 15,
          instructions: "Take 1 tablet three times daily after food",
        },
        {
          id: "2",
          medicine: "Ibuprofen 400mg",
          dosage: "SOS",
          timing: "after-food",
          duration: "3",
          quantity: 6,
          instructions: "Take as needed when symptoms occur after food",
        },
      ],
      dietaryConstraints: ["Avoid hot food", "Soft diet", "Avoid smoking", "Rinse with warm salt water"],
      createdAt: new Date("2024-01-18"),
      createdBy: "Dr. Dental",
    },
  ])

  const saveAyurvedicTemplate = (templateData: Omit<AyurvedicPrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: AyurvedicPrescriptionTemplate = {
      ...templateData,
      id: `ayur_template_${Date.now()}`,
      createdAt: new Date(),
    }
    setAyurvedicTemplates((prev) => [...prev, newTemplate])
  }

  const saveAllopathicTemplate = (templateData: Omit<AllopathicPrescriptionTemplate, "id" | "createdAt">) => {
    const newTemplate: AllopathicPrescriptionTemplate = {
      ...templateData,
      id: `allo_template_${Date.now()}`,
      createdAt: new Date(),
    }
    setAllopathicTemplates((prev) => [...prev, newTemplate])
  }

  const getAyurvedicTemplatesByDepartment = (department: string) => {
    return ayurvedicTemplates.filter((template) => template.department === department)
  }

  const getAllopathicTemplatesByDepartment = (department: string) => {
    return allopathicTemplates.filter((template) => template.department === department)
  }

  const deleteAyurvedicTemplate = (id: string) => {
    setAyurvedicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const deleteAllopathicTemplate = (id: string) => {
    setAllopathicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getAllAyurvedicTemplates = () => ayurvedicTemplates

  const getAllAllopathicTemplates = () => allopathicTemplates

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        ayurvedicTemplates,
        allopathicTemplates,
        saveAyurvedicTemplate,
        saveAllopathicTemplate,
        getAyurvedicTemplatesByDepartment,
        getAllopathicTemplatesByDepartment,
        deleteAyurvedicTemplate,
        deleteAllopathicTemplate,
        getAllAyurvedicTemplates,
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
