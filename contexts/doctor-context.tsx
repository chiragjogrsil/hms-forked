"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Doctor {
  id: string
  name: string
  department: string
  specialization: string
}

interface DoctorContextType {
  currentDoctor: Doctor
  setCurrentDoctor: (doctor: Doctor) => void
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined)

export function DoctorProvider({ children }: { children: ReactNode }) {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>({
    id: "doc-001",
    name: "Dr. Sharma",
    department: "general",
    specialization: "General Medicine",
  })

  return <DoctorContext.Provider value={{ currentDoctor, setCurrentDoctor }}>{children}</DoctorContext.Provider>
}

export function useDoctor() {
  const context = useContext(DoctorContext)
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider")
  }
  return context
}
