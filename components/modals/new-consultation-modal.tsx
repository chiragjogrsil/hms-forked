"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Stethoscope } from "lucide-react"

interface NewConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
}

export function NewConsultationModal({ isOpen, onClose, patientId, patientName }: NewConsultationModalProps) {
  const [formData, setFormData] = useState({
    department: "",
    doctor: "Dr. Smith", // Prepopulated
    consultationType: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle consultation creation here
    console.log("Creating consultation:", formData)
    onClose()
  }

  const departments = [
    { value: "general", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "gynecology", label: "Gynecology" },
    { value: "ayurveda", label: "Ayurveda" },
    { value: "ophthalmology", label: "Ophthalmology" },
  ]

  const consultationTypes = [
    { value: "emergency", label: "Emergency" },
    { value: "follow-up", label: "Follow up" },
    { value: "routine", label: "Routine checkup" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[450px] max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="h-5 w-5" />
            Start New Consultation
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Patient Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="font-medium text-sm">Patient Information</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  <strong>Name:</strong> {patientName}
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Patient ID:</strong> {patientId}
                </p>
              </div>
            </div>

            {/* Department Selection */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Consultation Type */}
            <div className="space-y-2">
              <Label htmlFor="consultationType">Consultation Type *</Label>
              <Select
                value={formData.consultationType}
                onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select consultation type" />
                </SelectTrigger>
                <SelectContent>
                  {consultationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Info (Read-only display) */}
            <div className="space-y-2">
              <Label>Consulting Doctor</Label>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm font-medium">{formData.doctor}</p>
                <p className="text-xs text-gray-600">Current Session Doctor</p>
              </div>
            </div>
          </form>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t bg-white">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={!formData.department || !formData.consultationType}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
