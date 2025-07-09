"use client"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"

interface BookAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
}

export function BookAppointmentModal({ isOpen, onClose, patientId, patientName }: BookAppointmentModalProps) {
  return (
    <AppointmentBookingDialog open={isOpen} onOpenChange={onClose} patientId={patientId} patientName={patientName} />
  )
}
