"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PatientRegistrationForm } from "@/components/patient-registration-form"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PatientRegistrationDialogWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientRegistered?: (data: any) => void
  openAppointmentAfter?: boolean
}

export function PatientRegistrationDialogWrapper({
  open,
  onOpenChange,
  onPatientRegistered,
  openAppointmentAfter = false,
}: PatientRegistrationDialogWrapperProps) {
  const { toast } = useToast()
  const [scheduleAppointment, setScheduleAppointment] = useState(true)

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setScheduleAppointment(true)
    }
  }, [open])

  // Update the handleSubmit function to handle the new fields
  const handleSubmit = (data: any) => {
    console.log("New patient data:", data)
    // In a real application, you would send this data to your backend

    // Generate a patient ID (in a real app, this would come from the backend)
    const patientId = `P${Math.floor(10000 + Math.random() * 90000)}`

    // Format the patient name
    const patientName = `${data.firstName} ${data.lastName}`

    // Store the new patient data
    const patientData = {
      id: patientId,
      name: patientName,
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
      scheduleAppointment: scheduleAppointment,
      // Include the original form data for completeness
      formData: data,
    }

    // If the onPatientRegistered callback is provided, call it
    if (onPatientRegistered) {
      onPatientRegistered(patientData)
    }

    // Close the dialog after submission
    onOpenChange(false)

    // Show success toast
    toast({
      title: "Patient registered successfully",
      description: `${patientName} has been registered with the system.`,
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Fill in the patient details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mb-6">
          <Switch id="schedule-appointment" checked={scheduleAppointment} onCheckedChange={setScheduleAppointment} />
          <Label htmlFor="schedule-appointment" className="font-medium">
            Schedule appointment after registration
          </Label>
        </div>

        <PatientRegistrationForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
