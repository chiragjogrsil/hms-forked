"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientEditForm } from "@/components/patient-edit-form"
import { Skeleton } from "@/components/ui/skeleton"

// Mock function to fetch patient data
const fetchPatientData = async (id: string) => {
  // In a real app, this would be an API call
  // For now, we'll simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock patient data
  return {
    id: id,
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: new Date("1978-05-15"),
    gender: "male",
    contactNumber: "+91 9876543210",
    email: "john.doe@example.com",
    address: "123 Main Street, Cityville, State - 123456",
    category: "general",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "+91 9876543211",
    emergencyContactRelationship: "Spouse",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    bloodGroup: "O+",
    allergies: "Penicillin",
  }
}

export default function EditPatient({ params }: { params: { id: string } }) {
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

  const handleSubmit = async (data: any) => {
    // In a real app, this would be an API call to update the patient
    console.log("Updating patient with data:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Navigate back to patient details page
    router.push(`/patients/${id}`)
  }

  const handleCancel = () => {
    router.push(`/patients/${id}`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/patients/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Patient</h1>
        </div>
        <Button onClick={() => document.getElementById("patient-edit-form")?.requestSubmit()}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Update the patient's personal and medical information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
              <Skeleton className="h-20" />
              <Skeleton className="h-10" />
              <Skeleton className="h-20" />
            </div>
          ) : (
            <PatientEditForm patient={patient} onSubmit={handleSubmit} onCancel={handleCancel} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
