"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PatientRegistrationForm } from "./patient-registration-form"
import { AppointmentBookingDialog } from "./appointment-booking-dialog"
import { useToast } from "@/hooks/use-toast"

interface PatientCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientCreated?: (data: any) => void
}

export function PatientCreationDialog({ open, onOpenChange, onPatientCreated }: PatientCreationDialogProps) {
  const { toast } = useToast()
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [newPatientData, setNewPatientData] = useState<any>(null)

  const handlePatientRegistered = (data: any) => {
    // Generate a patient ID (in a real app, this would come from the backend)
    const patientId = `P${Math.floor(10000 + Math.random() * 90000)}`

    // Format the patient name
    const patientName = `${data.firstName} ${data.lastName}`

    // Create the patient data object
    const patientData = {
      id: patientId,
      name: patientName,
      contactNumber: data.mobileNumber,
      ...data,
      patientId,
      registrationTime: new Date(),
    }

    // Call the onPatientCreated callback if provided
    if (onPatientCreated) {
      onPatientCreated(patientData)
    }

    // Close the dialog
    onOpenChange(false)

    // Show a success toast
    toast({
      title: "Patient registered successfully",
      description: `${patientName} has been registered with ID: ${patientId}`,
    })

    // If schedule appointment is checked, open the appointment dialog
    if (data.scheduleAppointment) {
      setNewPatientData(patientData)
      setTimeout(() => {
        setAppointmentDialogOpen(true)
      }, 300)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
            <DialogDescription>
              Add a new patient to the hospital system. Required fields are marked with an asterisk (*).
            </DialogDescription>
          </DialogHeader>

          <PatientRegistrationForm onSubmit={handlePatientRegistered} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Appointment Booking Dialog */}
      {appointmentDialogOpen && newPatientData && (
        <AppointmentBookingDialog
          open={appointmentDialogOpen}
          onOpenChange={setAppointmentDialogOpen}
          initialPatientData={newPatientData}
        />
      )}
    </>
  )
}
