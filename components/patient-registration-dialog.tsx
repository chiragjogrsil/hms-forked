"use client"

import { useState } from "react"
import { PatientRegistrationDialogWrapper } from "./patient-registration-dialog-wrapper"
import { AppointmentBookingDialog } from "./appointment-booking-dialog"

interface PatientRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientRegistered?: (data: any) => void
}

export function PatientRegistrationDialog({ open, onOpenChange, onPatientRegistered }: PatientRegistrationDialogProps) {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [newPatientData, setNewPatientData] = useState<any>(null)

  const handlePatientRegistered = (data: any) => {
    // Create a properly formatted patient data object for the appointment dialog
    const patientData = {
      id: data.id,
      name: data.name,
      contactNumber: data.contactNumber,
    }

    // Store the patient data for the appointment dialog
    setNewPatientData(patientData)

    // If the onPatientRegistered callback is provided, call it
    if (onPatientRegistered) {
      onPatientRegistered(data)
    }

    // If schedule appointment is checked, open the appointment dialog
    if (data.scheduleAppointment) {
      // Use a timeout to ensure the first dialog is fully closed
      setTimeout(() => {
        setAppointmentDialogOpen(true)
      }, 300)
    }
  }

  return (
    <>
      <PatientRegistrationDialogWrapper
        open={open}
        onOpenChange={onOpenChange}
        onPatientRegistered={handlePatientRegistered}
      />

      {/* Appointment Booking Dialog - Only render when needed */}
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
