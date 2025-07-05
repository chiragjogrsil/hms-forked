"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientRegistrationForm } from "@/components/patient-registration-form"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"

// Define the type for form data based on the form's schema
type PatientFormData = {
  firstName: string
  lastName: string
  scheduleAppointment: boolean
  // Add other fields as necessary for type safety
  [key: string]: any
}

export default function PatientRegistrationPage() {
  const router = useRouter()
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [registeredPatient, setRegisteredPatient] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegistrationSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    console.log("Registering patient:", data)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const patientData = { ...data, id: `PAT${Date.now()}`, name: `${data.firstName} ${data.lastName}` }
    setRegisteredPatient(patientData)
    setIsSubmitting(false)

    if (data.scheduleAppointment) {
      setShowAppointmentDialog(true)
    } else {
      // Navigate directly to patient details page with consultation tab
      router.push(`/patients/${patientData.id}?tab=consultation`)
    }
  }

  const handleAppointmentSuccess = () => {
    setShowAppointmentDialog(false)
    // Navigate to patient details page with consultation tab after appointment booking
    if (registeredPatient) {
      router.push(`/patients/${registeredPatient.id}?tab=consultation`)
    }
  }

  const handleAppointmentCancel = () => {
    setShowAppointmentDialog(false)
    // Navigate to patient details page with consultation tab even if appointment is cancelled
    if (registeredPatient) {
      router.push(`/patients/${registeredPatient.id}?tab=consultation`)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Registration</h1>
          <p className="text-muted-foreground">Register a new patient in the system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            New Patient Registration
          </CardTitle>
          <CardDescription>
            Fill in the patient details below to register them in the hospital management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientRegistrationForm
            onSubmit={handleRegistrationSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Appointment Booking Dialog */}
      {showAppointmentDialog && registeredPatient && (
        <AppointmentBookingDialog
          isOpen={showAppointmentDialog}
          onClose={handleAppointmentCancel}
          onSuccess={handleAppointmentSuccess}
          patientId={registeredPatient.id}
          patientName={registeredPatient.name}
        />
      )}
    </div>
  )
}
