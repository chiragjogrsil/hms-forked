"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface AyurvedicPrescription {
  id: string
  medicine: string
  dosage: string
  duration: string
  instructions: string
  timing: string
}

export interface AllopathicPrescription {
  id: string
  medicine: string
  strength: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface AyurvedicTemplate {
  id: string
  name: string
  department: string
  prescriptions: AyurvedicPrescription[]
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
  prescriptions: AllopathicPrescription[]
  dietaryConstraints: string[]
  generalInstructions: string
  createdBy: string
  createdAt: string
}

interface PrescriptionTemplateContextType {
  // Ayurvedic Templates
  ayurvedicTemplates: AyurvedicTemplate[]
  saveAyurvedicTemplate: (template: Omit<AyurvedicTemplate, "id" | "createdAt">) => void
  loadAyurvedicTemplate: (id: string) => AyurvedicTemplate | null
  deleteAyurvedicTemplate: (id: string) => void
  getAllAyurvedicTemplates: () => AyurvedicTemplate[]

  // Allopathic Templates
  allopathicTemplates: AllopathicTemplate[]
  saveAllopathicTemplate: (template: Omit<AllopathicTemplate, "id" | "createdAt">) => void
  loadAllopathicTemplate: (id: string) => AllopathicTemplate | null
  deleteAllopathicTemplate: (id: string) => void
  getAllAllopathicTemplates: () => AllopathicTemplate[]
}

const PrescriptionTemplateContext = createContext<PrescriptionTemplateContextType | undefined>(undefined)

export function PrescriptionTemplateProvider({ children }: { children: React.ReactNode }) {
  const [ayurvedicTemplates, setAyurvedicTemplates] = useState<AyurvedicTemplate[]>([])
  const [allopathicTemplates, setAllopathicTemplates] = useState<AllopathicTemplate[]>([])

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedAyurvedicTemplates = localStorage.getItem("ayurvedic-templates")
    const savedAllopathicTemplates = localStorage.getItem("allopathic-templates")

    if (savedAyurvedicTemplates) {
      setAyurvedicTemplates(JSON.parse(savedAyurvedicTemplates))
    }

    if (savedAllopathicTemplates) {
      setAllopathicTemplates(JSON.parse(savedAllopathicTemplates))
    }
  }, [])

  // Save to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem("ayurvedic-templates", JSON.stringify(ayurvedicTemplates))
  }, [ayurvedicTemplates])

  useEffect(() => {
    localStorage.setItem("allopathic-templates", JSON.stringify(allopathicTemplates))
  }, [allopathicTemplates])

  // Ayurvedic Template Functions
  const saveAyurvedicTemplate = (template: Omit<AyurvedicTemplate, "id" | "createdAt">) => {
    const newTemplate: AyurvedicTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAyurvedicTemplates((prev) => [...prev, newTemplate])
  }

  const loadAyurvedicTemplate = (id: string): AyurvedicTemplate | null => {
    return ayurvedicTemplates.find((template) => template.id === id) || null
  }

  const deleteAyurvedicTemplate = (id: string) => {
    setAyurvedicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getAllAyurvedicTemplates = (): AyurvedicTemplate[] => {
    return ayurvedicTemplates
  }

  // Allopathic Template Functions
  const saveAllopathicTemplate = (template: Omit<AllopathicTemplate, "id" | "createdAt">) => {
    const newTemplate: AllopathicTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAllopathicTemplates((prev) => [...prev, newTemplate])
  }

  const loadAllopathicTemplate = (id: string): AllopathicTemplate | null => {
    return allopathicTemplates.find((template) => template.id === id) || null
  }

  const deleteAllopathicTemplate = (id: string) => {
    setAllopathicTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const getAllAllopathicTemplates = (): AllopathicTemplate[] => {
    return allopathicTemplates
  }

  return (
    <PrescriptionTemplateContext.Provider
      value={{
        ayurvedicTemplates,
        saveAyurvedicTemplate,
        loadAyurvedicTemplate,
        deleteAyurvedicTemplate,
        getAllAyurvedicTemplates,
        allopathicTemplates,
        saveAllopathicTemplate,
        loadAllopathicTemplate,
        deleteAllopathicTemplate,
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
