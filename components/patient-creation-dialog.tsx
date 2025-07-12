"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PatientRegistrationForm } from "./patient-registration-form"
import { useToast } from "@/hooks/use-toast"

interface PatientCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientCreated?: (data: any) => void
}

export function PatientCreationDialog({ open, onOpenChange, onPatientCreated }: PatientCreationDialogProps) {
  const { toast } = useToast()

  const handlePatientSubmit = (data: any) => {
    console.log("Patient registration data:", data)

    // Show success message
    toast({
      title: "Patient Registered Successfully",
      description: `${data.firstName} ${data.lastName} has been registered with ID: ${data.patientId}`,
    })

    // If appointment is scheduled, show additional message
    if (data.scheduleAppointment) {
      toast({
        title: "Appointment Scheduled",
        description: `Appointment scheduled for ${data.appointmentDate ? new Date(data.appointmentDate).toLocaleDateString() : "selected date"} at ${data.appointmentTime || "selected time"}`,
      })
    }

    // Call the callback if provided
    if (onPatientCreated) {
      onPatientCreated(data)
    }

    // Close the dialog
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Patient Registration</DialogTitle>
          <DialogDescription>
            Register a new patient in the hospital management system. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <PatientRegistrationForm onSubmit={handlePatientSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
