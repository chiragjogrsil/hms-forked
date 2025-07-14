"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PatientRegistrationForm } from "./patient-registration-form"
import { useToast } from "@/hooks/use-toast"

interface PatientCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientCreated?: (patient: any) => void
}

export function PatientCreationDialog({ open, onOpenChange, onPatientCreated }: PatientCreationDialogProps) {
  const { toast } = useToast()

  const handleSubmit = (data: any) => {
    console.log("Patient registration data:", data)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: data.scheduleAppointment
          ? "Patient registered and appointment scheduled successfully!"
          : "Patient registered successfully!",
      })

      onPatientCreated?.(data)
      onOpenChange(false)
    }, 1000)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>Enter patient information and optionally schedule an appointment</DialogDescription>
        </DialogHeader>
        <PatientRegistrationForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
