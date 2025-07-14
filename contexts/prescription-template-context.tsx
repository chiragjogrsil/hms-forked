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
  ayurvedicTemplates: AyurvedicTemplate[]
  allopathicTemplates: AllopathicTemplate[]
  saveAyurvedicTemplate: (template: Omit<AyurvedicTemplate, "id" | "createdAt">) => void
  saveAllopathicTemplate: (template: Omit<AllopathicTemplate, "id" | "createdAt">) => void
  deleteAyurvedicTemplate: (id: string) => void
  deleteAllopathicTemplate: (id: string) => void
  getAyurvedicTemplate: (id: string) => AyurvedicTemplate | undefined
  getAllopathicTemplate: (id: string) => AllopathicTemplate | undefined
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [ayurvedicTemplates, setAyurvedicTemplates] = useState<AyurvedicTemplate[]>([])
  const [allopathicTemplates, setAllopathicTemplates] = useState<AllopathicTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedAyurvedic = localStorage.getItem("ayurvedic-templates")
    const savedAllopathic = localStorage.getItem("allopathic-templates")

    if (savedAyurvedic) {
      try {
        setAyurvedicTemplates(JSON.parse(savedAyurvedic))
      } catch (error) {
        console.error("Error loading ayurvedic templates:", error)
      }
    }

    if (savedAllopathic) {
      try {
        setAllopathicTemplates(JSON.parse(savedAllopathic))
      } catch (error) {
        console.error("Error loading allopathic templates:", error)
      }
    }
  }, [])

  // Save ayurvedic templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ayurvedic-templates", JSON.stringify(ayurvedicTemplates))
  }, [ayurvedicTemplates])

  // Save allopathic templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("allopathic-templates", JSON.stringify(allopathicTemplates))
  }, [allopathicTemplates])

  const saveAyurvedicTemplate = (template: Omit<AyurvedicTemplate, "id" | "createdAt">) => {
    const newTemplate: AyurvedicTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAyurvedicTemplates((prev) => [...prev, newTemplate])
  }

  const saveAllopathicTemplate = (template: Omit<AllopathicTemplate, "id" | "createdAt">) => {
    const newTemplate: AllopathicTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAllopathicTemplates((prev) => [...prev, newTemplate])
  }

  const deleteAyurvedicTemplate = (id: string) => {
    setAyurvedicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const deleteAllopathicTemplate = (id: string) => {
    setAllopathicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getAyurvedicTemplate = (id: string) => {
    return ayurvedicTemplates.find((template) => template.id === id)
  }

  const getAllopathicTemplate = (id: string) => {
    return allopathicTemplates.find((template) => template.id === id)
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        ayurvedicTemplates,
        allopathicTemplates,
        saveAyurvedicTemplate,
        saveAllopathicTemplate,
        deleteAyurvedicTemplate,
        deleteAllopathicTemplate,
        getAyurvedicTemplate,
        getAllopathicTemplate,
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
