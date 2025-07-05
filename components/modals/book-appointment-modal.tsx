"use client"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"

interface BookAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  onSuccess?: () => void
  prefilledData?: any
}

export function BookAppointmentModal({ isOpen, onClose, patientId, patientName, onSuccess, prefilledData }: BookAppointmentModalProps) {
  const handleAppointmentCreated = (appointment: any) => {
    // Handle the appointment creation
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <AppointmentBookingDialog 
      open={isOpen} 
      onOpenChange={onClose}
      onAppointmentCreated={handleAppointmentCreated}
      initialPatientData={{
        id: patientId,
        name: patientName,
      }}
    />
  )
}
