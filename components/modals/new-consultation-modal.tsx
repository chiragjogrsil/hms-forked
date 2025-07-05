"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stethoscope } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"

interface NewConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  visitDate: string
  department?: string
  doctorName?: string
}

export function NewConsultationModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  visitDate,
  department = "general",
  doctorName = "Dr. Smith",
}: NewConsultationModalProps) {
  const { startNewConsultation } = useConsultation()
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(department)
  const [selectedDoctor, setSelectedDoctor] = useState(doctorName)
  const [appointmentTime, setAppointmentTime] = useState("")
  const [consultationType, setConsultationType] = useState("routine")

  const departments = [
    { value: "general", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "ayurveda", label: "Ayurveda" },
    { value: "dental", label: "Dental" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "gynecology", label: "Gynecology" },
  ]

  const consultationTypes = [
    { value: "routine", label: "Routine Consultation" },
    { value: "followup", label: "Follow-up" },
    { value: "emergency", label: "Emergency" },
    { value: "second_opinion", label: "Second Opinion" },
  ]

  const handleStartConsultation = () => {
    if (!chiefComplaint.trim()) {
      toast.error("Please enter the chief complaint")
      return
    }

    const consultationInfo = {
      department: selectedDepartment,
      doctorName: selectedDoctor,
      chiefComplaint: chiefComplaint.trim(),
      appointmentTime: appointmentTime || new Date().toLocaleTimeString("en-US", { hour12: false }),
      consultationType,
    }

    startNewConsultation(patientId, patientName, visitDate, consultationInfo)

    // Reset form
    setChiefComplaint("")
    setAppointmentTime("")
    setConsultationType("routine")

    onClose()

    toast.success("New consultation started", {
      description: `Consultation for ${patientName} has been initiated`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Start New Consultation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Patient Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Name:</span>
                <p className="font-semibold">{patientName}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Visit Date:</span>
                <p className="font-semibold">{new Date(visitDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
            <Textarea
              id="chiefComplaint"
              placeholder="Enter the patient's primary concern or reason for visit..."
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              rows={3}
            />
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
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

          {/* Doctor Name */}
          <div className="space-y-2">
            <Label htmlFor="doctorName">Consulting Doctor</Label>
            <Input
              id="doctorName"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              placeholder="Enter doctor name"
            />
          </div>

          {/* Consultation Type */}
          <div className="space-y-2">
            <Label htmlFor="consultationType">Consultation Type</Label>
            <Select value={consultationType} onValueChange={setConsultationType}>
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

          {/* Appointment Time */}
          <div className="space-y-2">
            <Label htmlFor="appointmentTime">Appointment Time (Optional)</Label>
            <Input
              id="appointmentTime"
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleStartConsultation} className="bg-blue-600 hover:bg-blue-700">
              <Stethoscope className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
