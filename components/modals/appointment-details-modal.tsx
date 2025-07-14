"use client"

import { useState, useEffect } from "react"
import {
  CalendarClock,
  Check,
  Clock,
  Edit2,
  IndianRupee,
  MapPin,
  Phone,
  Save,
  User,
  X,
  CreditCard,
  Calendar,
  Info,
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react"
import { format, isValid } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Add these imports for the edit functionality
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getProcedureById } from "@/data/procedures"

// Update the interface to include onAppointmentUpdate
interface AppointmentDetailsModalProps {
  appointment: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (appointmentId: string, newStatus: string) => void
  onAppointmentUpdate?: (appointmentId: string, updatedData: any) => void
}

// Update the component to include the edit functionality
export function AppointmentDetailsModal({
  appointment,
  open,
  onOpenChange,
  onStatusChange,
  onAppointmentUpdate,
}: AppointmentDetailsModalProps) {
  const [status, setStatus] = useState(appointment?.status || "scheduled")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paymentAmount, setPaymentAmount] = useState(appointment?.fee?.toString() || "")
  const [notes, setNotes] = useState(appointment?.notes || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPaymentSection, setShowPaymentSection] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [procedureDetails, setProcedureDetails] = useState<any>(null)
  const [relatedAppointments, setRelatedAppointments] = useState<any[]>([])

  // Add state for editable fields
  const [editableDate, setEditableDate] = useState<Date | undefined>(undefined)
  const [editableTime, setEditableTime] = useState("")
  const [editableDoctor, setEditableDoctor] = useState("")
  const [editableDepartment, setEditableDepartment] = useState("")
  const [editableDuration, setEditableDuration] = useState("")
  const [editableFee, setEditableFee] = useState("")

  // Reset state when appointment changes
  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status || "scheduled")
      setNotes(appointment.notes || "")
      setPaymentAmount(appointment.fee?.toString() || "")

      // Initialize editable fields
      setEditableDate(getAppointmentDate())
      setEditableTime(getFormattedTime())
      setEditableDoctor(appointment.doctor || "")
      setEditableDepartment(appointment.department || "")
      setEditableDuration((appointment.duration || 30).toString())
      setEditableFee((appointment.fee || 0).toString())

      // Reset edit mode
      setIsEditMode(false)

      // Check if this is a procedure appointment
      if (appointment.appointmentType === "specialized" && appointment.procedureId) {
        const procedure = getProcedureById(appointment.procedureId)
        setProcedureDetails(procedure)

        // For multi-day procedures, find related appointments
        if (procedure?.isMultiDay) {
          // In a real app, you would fetch related appointments from the database
          // For now, we'll simulate this with mock data
          const mockRelatedAppointments = []

          if (procedure.sessions) {
            for (const session of procedure.sessions) {
              if (session.day !== appointment.sessionDay) {
                const sessionDate = new Date(getAppointmentDate() || new Date())
                sessionDate.setDate(sessionDate.getDate() + (session.day - appointment.sessionDay))

                mockRelatedAppointments.push({
                  id: `related-${appointment.id}-${session.day}`,
                  patientName: appointment.patientName,
                  date: sessionDate,
                  time: appointment.time,
                  doctor: appointment.doctor,
                  department: appointment.department,
                  procedureName: appointment.procedureName,
                  sessionDay: session.day,
                  sessionDescription: session.description,
                  status: session.day < appointment.sessionDay ? "completed" : "scheduled",
                })
              }
            }
          }

          setRelatedAppointments(mockRelatedAppointments)
        } else {
          setRelatedAppointments([])
        }
      } else {
        setProcedureDetails(null)
        setRelatedAppointments([])
      }
    }
  }, [appointment])

  if (!appointment) return null

  // Helper function to get the appointment date as a Date object
  function getAppointmentDate(): Date | undefined {
    try {
      // Check if date is a string that needs parsing or already a Date object
      const dateToFormat = typeof appointment.date === "string" ? new Date(appointment.date) : appointment.date

      // Check if the date is valid before returning
      if (isValid(dateToFormat)) {
        return dateToFormat
      }

      // If we have an appointmentTime that's a Date object (from queue page)
      if (appointment.appointmentTime && isValid(appointment.appointmentTime)) {
        return appointment.appointmentTime
      }

      // Fallback for invalid dates
      return new Date()
    } catch (error) {
      console.error("Error formatting date:", error)
      return new Date()
    }
  }

  // Safely format the date
  const formatAppointmentDate = () => {
    try {
      // Check if date is a string that needs parsing or already a Date object
      const dateToFormat = typeof appointment.date === "string" ? new Date(appointment.date) : appointment.date

      // Check if the date is valid before formatting
      if (isValid(dateToFormat)) {
        return format(dateToFormat, "PPP")
      }

      // If we have an appointmentTime that's a Date object (from queue page)
      if (appointment.appointmentTime && isValid(appointment.appointmentTime)) {
        return format(appointment.appointmentTime, "PPP")
      }

      // Fallback for invalid dates
      return "Date not available"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date not available"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "completed" && !showPaymentSection) {
      setShowPaymentSection(true)
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the appointment status
      onStatusChange(appointment.id, newStatus)

      // Close the modal after successful update
      if (newStatus === "completed") {
        onOpenChange(false)
      } else {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error("Failed to update appointment status:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSubmit = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to process payment
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the appointment status to completed
      onStatusChange(appointment.id, "completed")

      // Close the modal after successful payment
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to process payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveChanges = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Prepare updated appointment data
      const updatedData = {
        date: editableDate,
        time: editableTime,
        doctor: editableDoctor,
        department: editableDepartment,
        duration: Number.parseInt(editableDuration, 10),
        fee: Number.parseInt(editableFee, 10),
        notes: notes,
      }

      // Call the update function if provided
      if (onAppointmentUpdate) {
        onAppointmentUpdate(appointment.id, updatedData)
      }

      // Exit edit mode
      setIsEditMode(false)
    } catch (error) {
      console.error("Failed to update appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            Scheduled
          </Badge>
        )
      case "waiting":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
            Waiting
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Check if the appointment is completed or cancelled
  const isCompleted = status === "completed"
  const isCancelled = status === "cancelled"
  const isEditable = !isCompleted && !isCancelled

  // Get the formatted time (either from time property or from appointmentTime)
  const getFormattedTime = () => {
    if (appointment.time) {
      return appointment.time
    }

    if (appointment.appointmentTime && isValid(appointment.appointmentTime)) {
      return format(appointment.appointmentTime, "h:mm a")
    }

    return "Time not available"
  }

  // Available time slots for editing
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  // Department to doctors mapping for editing
  const departmentDoctorsMap: Record<string, string[]> = {
    "General Medicine": ["Dr. Smith", "Dr. Johnson", "Dr. Wilson"],
    Cardiology: ["Dr. Johnson", "Dr. Martinez", "Dr. Lee"],
    Orthopedics: ["Dr. Williams", "Dr. Garcia", "Dr. Anderson"],
    Pediatrics: ["Dr. Davis", "Dr. Roberts", "Dr. White"],
    Neurology: ["Dr. Brown", "Dr. Thompson", "Dr. Harris"],
    "General OPD": ["Dr. Smith", "Dr. Johnson", "Dr. Wilson"],
    Dermatology: ["Dr. Miller", "Dr. Clark", "Dr. Lewis"],
  }

  // Get available doctors based on selected department
  const availableDoctors = editableDepartment ? departmentDoctorsMap[editableDepartment] || [] : []

  // Get all sessions for the procedure, including the current one
  const getAllSessions = () => {
    if (!procedureDetails?.isMultiDay || !procedureDetails?.sessions) return []

    const allSessions = [...procedureDetails.sessions]

    // Sort sessions by day
    allSessions.sort((a, b) => a.day - b.day)

    return allSessions
  }

  const allSessions = getAllSessions()

  // Get status icon for session
  const getSessionStatusIcon = (sessionDay: number) => {
    if (sessionDay < appointment.sessionDay) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    } else if (sessionDay === appointment.sessionDay) {
      return <Clock3 className="h-5 w-5 text-blue-500" />
    } else {
      return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto"
        closeButtonClassName="absolute right-4 top-4 z-30"
      >
        <DialogHeader className="sticky top-0 z-20 bg-white pb-2 pt-4 px-6 -mx-6 -mt-4 border-b mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {appointment.appointmentType === "specialized" ? "Procedure" : "Appointment"} Details
              {getStatusBadge(status)}
            </DialogTitle>
            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (isEditMode ? setIsEditMode(false) : setIsEditMode(true))}
                disabled={isSubmitting}
              >
                {isEditMode ? <X className="h-4 w-4 mr-1" /> : <Edit2 className="h-4 w-4 mr-1" />}
                {isEditMode ? "Cancel" : "Edit"}
              </Button>
            )}
          </div>
          <DialogDescription>
            {appointment.appointmentType === "specialized"
              ? `View and manage procedure details for ${appointment.procedureName || "procedure"}`
              : "View and manage appointment details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Specialized procedure multi-day sessions timeline */}
          {appointment.appointmentType === "specialized" && procedureDetails?.isMultiDay && allSessions.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Multi-Day Procedure Timeline
                </CardTitle>
                <CardDescription>
                  This procedure requires {allSessions.length} sessions over multiple days
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-blue-200"></div>

                  {/* Sessions */}
                  <div className="space-y-4">
                    {allSessions.map((session, index) => {
                      // Calculate the date for this session based on the current appointment
                      const sessionDate = new Date(getAppointmentDate() || new Date())
                      sessionDate.setDate(sessionDate.getDate() + (session.day - appointment.sessionDay))

                      return (
                        <div key={session.day} className="flex items-start gap-3 relative">
                          <div className="z-10 mt-0.5">{getSessionStatusIcon(session.day)}</div>
                          <div
                            className={cn(
                              "flex-1 p-4 rounded-md border",
                              session.day === appointment.sessionDay
                                ? "bg-blue-100 border-blue-300"
                                : session.day < appointment.sessionDay
                                  ? "bg-green-50 border-green-200"
                                  : "bg-white border-gray-200",
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium flex items-center gap-2">
                                  Session {session.day}
                                  {session.day === appointment.sessionDay && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">Current</Badge>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                              </div>
                              <div className="text-right">
                                {session.day === appointment.sessionDay ? (
                                  <div className="text-sm">
                                    <div className="font-medium text-blue-700">{formatAppointmentDate()}</div>
                                    <div className="text-blue-600">{getFormattedTime()}</div>
                                  </div>
                                ) : (
                                  <div className="text-sm">
                                    <div
                                      className={cn(
                                        "font-medium",
                                        session.day < appointment.sessionDay ? "text-green-700" : "text-gray-600",
                                      )}
                                    >
                                      {format(sessionDate, "MMM dd, yyyy")}
                                    </div>
                                    <div
                                      className={cn(
                                        "text-xs",
                                        session.day < appointment.sessionDay ? "text-green-600" : "text-gray-500",
                                      )}
                                    >
                                      {session.day < appointment.sessionDay ? "Completed" : "Scheduled"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Duration:</span> {session.duration} minutes
                              </div>
                              <div>
                                <span className="font-medium">Doctor:</span> {appointment.doctor}
                              </div>
                            </div>

                            {session.day === appointment.sessionDay && (
                              <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-200">
                                <span className="font-medium text-blue-800">Current Session Details:</span>
                                <div className="text-blue-700 mt-1">
                                  Patient: {appointment.patientName} • Fee: ₹{appointment.fee}
                                </div>
                              </div>
                            )}

                            {session.preparationRequired && session.preparationInstructions && (
                              <div className="mt-2 text-xs bg-amber-50 p-2 rounded border border-amber-200">
                                <span className="font-medium text-amber-800">Preparation Required:</span>
                                <div className="text-amber-700 mt-1">{session.preparationInstructions}</div>
                              </div>
                            )}

                            {session.day > appointment.sessionDay && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-7"
                                  onClick={() => {
                                    // This would open a reschedule dialog for this specific session
                                    console.log(`Reschedule session ${session.day}`)
                                  }}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Reschedule
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Timeline Summary */}
                  <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Procedure Progress</div>
                      <div className="flex justify-between">
                        <span>
                          Sessions Completed: {allSessions.filter((s) => s.day < appointment.sessionDay).length}
                        </span>
                        <span>Current Session: {appointment.sessionDay}</span>
                        <span>
                          Remaining Sessions: {allSessions.filter((s) => s.day > appointment.sessionDay).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Patient:</span>
                <span>{appointment.patientName}</span>
              </div>

              {/* Specialized procedure details */}
              {appointment.appointmentType === "specialized" && !procedureDetails?.isMultiDay && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Procedure:</span>
                    <span>{appointment.procedureName}</span>
                  </div>

                  {procedureDetails && procedureDetails.preparationInstructions && (
                    <Alert className="mt-2 bg-blue-50 text-blue-800 border-blue-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Preparation Instructions</AlertTitle>
                      <AlertDescription>{procedureDetails.preparationInstructions}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Date:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal h-8 text-sm",
                            !editableDate && "text-muted-foreground",
                          )}
                          size="sm"
                        >
                          {editableDate ? format(editableDate, "MMM dd") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={editableDate}
                          onSelect={setEditableDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Time:</span>
                    <Select value={editableTime} onValueChange={setEditableTime}>
                      <SelectTrigger className="w-[120px] h-8" size="sm">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Department:</span>
                    <Select value={editableDepartment} onValueChange={setEditableDepartment}>
                      <SelectTrigger className="w-[160px] h-8" size="sm">
                        <SelectValue placeholder="Select dept" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Medicine">General Medicine</SelectItem>
                        <SelectItem value="General OPD">General OPD</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Doctor:</span>
                    <Select value={editableDoctor} onValueChange={setEditableDoctor}>
                      <SelectTrigger className="w-[160px] h-8" size="sm">
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors && availableDoctors.length > 0 ? (
                          availableDoctors.map((doc) => (
                            <SelectItem key={doc} value={doc}>
                              {doc}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                            <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                            <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
                            <SelectItem value="Dr. Jones">Dr. Jones</SelectItem>
                            <SelectItem value="Dr. Taylor">Dr. Taylor</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Duration:</span>
                    <Select value={editableDuration} onValueChange={setEditableDuration}>
                      <SelectTrigger className="w-[90px] h-8" size="sm">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">60 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Fee:</span>
                    <Input
                      type="number"
                      value={editableFee}
                      onChange={(e) => setEditableFee(e.target.value)}
                      className="w-[90px] h-8"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date & Time:</span>
                    <span>
                      {formatAppointmentDate()} at {getFormattedTime()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Department:</span>
                    <span>{appointment.department}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Doctor:</span>
                    <span>{appointment.doctor}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Duration:</span>
                    <span>{appointment.duration || 30} minutes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fee:</span>
                    <span>₹{appointment.fee}</span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Contact:</span>
                <span>{appointment.contactNumber}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this appointment"
                className="min-h-[80px] text-sm"
                disabled={isCompleted || isCancelled || isEditMode === false}
              />
            </div>
          </div>
        </div>

        {showPaymentSection ? (
          <div className="space-y-4 border rounded-md p-4 bg-muted/30">
            <h3 className="font-medium text-base">Payment Collection</h3>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="font-normal">
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="font-normal">
                    Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="font-normal">
                    UPI
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setShowPaymentSection(false)}>
                Cancel
              </Button>
              <Button onClick={handlePaymentSubmit} disabled={isSubmitting || !paymentAmount}>
                {isSubmitting ? "Processing..." : "Complete Payment"}
              </Button>
            </div>
          </div>
        ) : isEditMode ? (
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsEditMode(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleSaveChanges} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {/* Only show cancel button if appointment is not completed and not already cancelled */}
            {!isCompleted && !isCancelled && (
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => handleStatusChange("cancelled")}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            )}

            {/* Add payment button for completed but unpaid appointments */}
            {status === "completed" && appointment.paymentStatus === "unpaid" && (
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
                onClick={() => setShowPaymentSection(true)}
                disabled={isSubmitting}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            )}

            {status === "scheduled" && (
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-auto",
                  "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800",
                )}
                onClick={() => handleStatusChange("in-progress")}
                disabled={isSubmitting}
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark In Progress
              </Button>
            )}

            {(status === "scheduled" || status === "in-progress") && (
              <Button
                className={cn(
                  "w-full sm:w-auto",
                  "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800",
                )}
                onClick={() => handleStatusChange("completed")}
                disabled={isSubmitting}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark Completed
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
