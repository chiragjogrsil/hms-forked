"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, User, Stethoscope } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AppointmentBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAppointmentCreated?: (appointment: any) => void
  prefilledData?: {
    patientId?: string
    patientName?: string
    appointmentType?: string
    serviceDetails?: {
      name: string
      notes?: string
      prescribedBy?: string
      priority?: string
      indication?: string
    }
    department?: string
    doctor?: string
  }
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const departments = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
  "Ayurveda",
  "Dental",
  "Emergency",
]

const doctors = {
  "General Medicine": ["Dr. Smith", "Dr. Johnson", "Dr. Williams"],
  Cardiology: ["Dr. Martinez", "Dr. Garcia", "Dr. Rodriguez"],
  Neurology: ["Dr. Thompson", "Dr. Anderson", "Dr. Taylor"],
  Orthopedics: ["Dr. Brown", "Dr. Davis", "Dr. Miller"],
  Pediatrics: ["Dr. Wilson", "Dr. Moore", "Dr. Jackson"],
  Gynecology: ["Dr. White", "Dr. Harris", "Dr. Martin"],
  Dermatology: ["Dr. Clark", "Dr. Lewis", "Dr. Walker"],
  Ophthalmology: ["Dr. Vision", "Dr. Eye", "Dr. Sight"],
  ENT: ["Dr. Ear", "Dr. Nose", "Dr. Throat"],
  Psychiatry: ["Dr. Mind", "Dr. Soul", "Dr. Brain"],
  Ayurveda: ["Dr. Ayurveda", "Dr. Herbal", "Dr. Natural"],
  Dental: ["Dr. Tooth", "Dr. Smile", "Dr. Dental"],
  Emergency: ["Dr. Emergency", "Dr. Urgent", "Dr. Critical"],
}

export function AppointmentBookingDialog({
  open,
  onOpenChange,
  onAppointmentCreated,
  prefilledData,
}: AppointmentBookingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(prefilledData?.department || "")
  const [selectedDoctor, setSelectedDoctor] = useState(prefilledData?.doctor || "")
  const [appointmentType, setAppointmentType] = useState(prefilledData?.appointmentType || "consultation")
  const [patientName, setPatientName] = useState(prefilledData?.patientName || "")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [notes, setNotes] = useState(prefilledData?.serviceDetails?.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDoctors = selectedDepartment ? doctors[selectedDepartment as keyof typeof doctors] || [] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !selectedDepartment || !selectedDoctor || !patientName) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const appointmentData = {
        id: `apt-${Date.now()}`,
        patientId: prefilledData?.patientId || `patient-${Date.now()}`,
        patientName,
        patientPhone,
        patientEmail,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        department: selectedDepartment,
        doctor: selectedDoctor,
        type: appointmentType,
        notes,
        serviceDetails: prefilledData?.serviceDetails,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      }

      console.log("Appointment created:", appointmentData)

      toast.success("Appointment booked successfully!", {
        description: `${format(selectedDate, "MMM dd, yyyy")} at ${selectedTime} with ${selectedDoctor}`,
      })

      onAppointmentCreated?.(appointmentData)
      onOpenChange(false)

      // Reset form
      setSelectedDate(undefined)
      setSelectedTime("")
      setSelectedDepartment(prefilledData?.department || "")
      setSelectedDoctor(prefilledData?.doctor || "")
      setAppointmentType(prefilledData?.appointmentType || "consultation")
      setPatientName(prefilledData?.patientName || "")
      setPatientPhone("")
      setPatientEmail("")
      setNotes(prefilledData?.serviceDetails?.notes || "")
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book New Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Details (if prefilled) */}
          {prefilledData?.serviceDetails && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Service Details</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Service:</span> {prefilledData.serviceDetails.name}
                </div>
                {prefilledData.serviceDetails.prescribedBy && (
                  <div>
                    <span className="font-medium">Prescribed by:</span> {prefilledData.serviceDetails.prescribedBy}
                  </div>
                )}
                {prefilledData.serviceDetails.priority && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Priority:</span>
                    <Badge
                      variant={prefilledData.serviceDetails.priority === "urgent" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {prefilledData.serviceDetails.priority}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone Number</Label>
              <Input
                id="patientPhone"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email Address</Label>
            <Input
              id="patientEmail"
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Appointment Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department and Doctor Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor *</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor} disabled={!selectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedDepartment ? "Select doctor" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {doctor}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
                <SelectItem value="test">Test/Investigation</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information or special requirements..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !selectedDate || !selectedTime || !selectedDepartment || !selectedDoctor || !patientName
              }
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Booking...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Book Appointment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
