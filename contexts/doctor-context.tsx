"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Doctor {
  id: string
  name: string
  specialization: string
  department: string
  avatar?: string
}

interface DoctorContextType {
  currentDoctor: Doctor | null
  setCurrentDoctor: (doctor: Doctor) => void
  doctors: Doctor[]
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined)

// Sample doctors data
const sampleDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    department: "Cardiology",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Pediatrician",
    department: "Pediatrics",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    avatar: "/placeholder.svg?height=40&width=40&text=ER",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "General Practitioner",
    department: "General OPD",
    avatar: "/placeholder.svg?height=40&width=40&text=JW",
  },
]

export function DoctorProvider({ children }: { children: ReactNode }) {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(sampleDoctors[0])
  const [doctors] = useState<Doctor[]>(sampleDoctors)

  return (
    <DoctorContext.Provider value={{ currentDoctor, setCurrentDoctor, doctors }}>{children}</DoctorContext.Provider>
  )
}

export function useDoctor() {
  const context = useContext(DoctorContext)
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider")
  }
  return context
}
