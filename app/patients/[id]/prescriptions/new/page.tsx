"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrescriptionForm } from "@/components/prescription-form"

// Sample patient data - in a real app, this would come from an API
const fetchPatientData = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id,
    firstName: "John",
    lastName: "Doe",
    age: 42,
    gender: "Male",
    dateOfBirth: "15 May 1981",
    contactNumber: "+91 9876543210",
    email: "john.doe@example.com",
    address: "123 Main Street, Cityville, State - 123456",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Dust"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    registrationDate: "10 Jan 2023",
    lastVisit: "22 Mar 2024",
    uhid: "HOSP-12345",
  }
}

export default function NewPrescriptionPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPatientData = async () => {
      try {
        const data = await fetchPatientData(id)
        setPatient(data)
      } catch (error) {
        console.error("Failed to fetch patient data:", error)
      } finally {
        setLoading(false)
      }
    }

    getPatientData()
  }, [id])

  const handlePrescriptionSubmit = async (data: any) => {
    // In a real app, this would send the data to an API
    console.log("Prescription data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Navigate back to patient details
    router.push(`/patients/${id}`)
  }

  if (loading) {
    return null // Loading state is handled by loading.tsx
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load patient data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Could not find patient with ID: {id}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/patients/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Prescription</CardTitle>
          <CardDescription>
            Create a new prescription for {patient.firstName} {patient.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrescriptionForm patient={patient} onSubmit={handlePrescriptionSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
