"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PatientRegistrationForm } from "./patient-registration-form"
import { useToast } from "@/hooks/use-toast"

interface PatientRegistrationDialogWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientRegistered: (data: any) => void
}

export function PatientRegistrationDialogWrapper({
  open,
  onOpenChange,
  onPatientRegistered,
}: PatientRegistrationDialogWrapperProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Generate a patient ID
      const patientId = `P${Date.now().toString().slice(-6)}`

      // Format the patient data
      const patientData = {
        id: patientId,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        careOf: data.careOf || "",
        age: calculateAge(data.dateOfBirth),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address || "",
        category: data.category,
        phone: data.mobileNumber,
        contactNumber: data.mobileNumber,
        email: data.email || "",
        aadhaarId: data.aadhaarId || "",
        bloodGroup: data.bloodGroup || "",
        referredBy: data.referredBy || "",
        referrerPhoneNumber: data.referrerPhoneNumber || "",
        fileNumber: data.fileNumber || "",
        occupation: data.occupation || "",
        scheduleAppointment: data.scheduleAppointment || false,
        createdAt: new Date().toISOString(),
        status: "Active",
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success toast
      toast({
        title: "Patient registered successfully",
        description: `${patientData.name} has been registered with ID: ${patientId}`,
      })

      // Call the callback
      onPatientRegistered(patientData)

      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Fill in the patient details below. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <PatientRegistrationForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}
