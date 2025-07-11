"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Calendar } from "lucide-react"
import Link from "next/link"
import { PatientRegistrationForm } from "@/components/patient-registration-form"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function PatientRegistrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [scheduleAppointment, setScheduleAppointment] = useState(true)
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [newPatientData, setNewPatientData] = useState<any>(null)

  const handleSubmit = (data: any) => {
    console.log("New patient data:", data)

    // Generate a patient ID (in a real app, this would come from the backend)
    const patientId = `P${Math.floor(10000 + Math.random() * 90000)}`

    // Format the patient name
    const patientName = `${data.firstName} ${data.lastName}`

    // Store the new patient data
    const patientData = {
      id: patientId,
      name: patientName,
      contactNumber: data.mobileNumber,
      careOf: data.careOf || "",
      mobileNumber: data.mobileNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address || "",
      category: data.category,
      email: data.email || "",
      aadhaarId: data.aadhaarId || "",
      dateOfAdmission: data.dateOfAdmission,
      admissionExpiry: data.admissionExpiry,
      bloodGroup: data.bloodGroup || "",
      referredBy: data.referredBy || "",
      referrerPhoneNumber: data.referrerPhoneNumber || "",
      fileNumber: data.fileNumber || "",
      occupation: data.occupation || "",
      formData: data,
    }

    // Show success toast
    toast({
      title: "Patient registered successfully",
      description: `${patientName} has been registered with ID: ${patientId}`,
    })

    // If schedule appointment is checked, open the appointment dialog
    if (scheduleAppointment) {
      setNewPatientData(patientData)
      setAppointmentDialogOpen(true)
    } else {
      // Navigate back to dashboard or patients list
      router.push("/patients")
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleAppointmentCreated = (appointmentData: any) => {
    toast({
      title: "Appointment scheduled successfully",
      description: `Appointment has been booked for ${newPatientData?.name}`,
    })

    // Navigate to dashboard after successful appointment booking
    router.push("/")
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-hospital-gray-100">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-hospital-gray-800">Register New Patient</h1>
            <p className="text-hospital-gray-600 mt-1">Add a new patient to the hospital system</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserPlus className="h-8 w-8 text-teal-600" />
        </div>
      </div>

      {/* Registration Card */}
      <Card className="border-0 shadow-hospital-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-hospital-gray-800">Patient Information</CardTitle>
              <CardDescription className="font-medium text-hospital-gray-600">
                Fill in the patient details below. Required fields are marked with an asterisk (*).
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Schedule Appointment Toggle */}
          <div className="flex items-center space-x-3 mb-6 p-4 bg-hospital-gray-50 rounded-lg border border-hospital-gray-200">
            <Switch
              id="schedule-appointment"
              checked={scheduleAppointment}
              onCheckedChange={setScheduleAppointment}
              className="data-[state=checked]:bg-teal-500"
            />
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-hospital-gray-600" />
              <Label htmlFor="schedule-appointment" className="font-medium text-hospital-gray-700">
                Schedule appointment after registration
              </Label>
            </div>
          </div>

          {/* Registration Form */}
          <PatientRegistrationForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>

      {/* Appointment Booking Dialog */}
      {appointmentDialogOpen && newPatientData && (
        <AppointmentBookingDialog
          open={appointmentDialogOpen}
          onOpenChange={setAppointmentDialogOpen}
          initialPatientData={newPatientData}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}
    </div>
  )
}
