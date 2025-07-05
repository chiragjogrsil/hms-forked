"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PrescriptionForm } from "@/components/prescription-form"

interface NewPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientData: any
}

export function NewPrescriptionModal({ isOpen, onClose, patientId, patientData }: NewPrescriptionModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would send the data to an API
      console.log("Prescription data:", data)

      // Check if follow-up date is set
      if (data.followUpDate) {
        console.log("Follow-up appointment scheduled for:", new Date(data.followUpDate).toLocaleDateString())
        // Here you would typically create an appointment for the follow-up date
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close the modal and refresh the page
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error submitting prescription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Prescription</DialogTitle>
          <DialogDescription>
            Create a new prescription for {patientData?.firstName} {patientData?.lastName}
          </DialogDescription>
        </DialogHeader>

        <PrescriptionForm patient={patientData} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
