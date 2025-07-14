"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, CreditCard, Search, User, Phone, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import type { Procedure } from "@/data/procedures"

interface AppointmentBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: Date
  initialTime?: string
  onAppointmentCreated?: (appointment: any) => void
}

// Mock prescription data - in a real app, this would come from an API
const mockPrescriptions = [
  {
    id: "RX-2024-001",
    patientId: "P12345", // John Doe - easy to find
    patientName: "John Doe",
    doctorName: "Dr. Anderson",
    date: "2024-12-18",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    prescribedTreatments: [
      {
        sessionDay: 1,
        description: "Initial assessment and treatment plan development",
        duration: 60,
        required: true,
        notes: "Comprehensive evaluation of mobility and pain levels. Focus on left shoulder injury.",
      },
      {
        sessionDay: 3,
        description: "Guided exercises and mobility training",
        duration: 45,
        required: true,
        notes: "Range of motion exercises for shoulder. Start with gentle movements.",
      },
      {
        sessionDay: 5,
        description: "Progress evaluation and advanced exercises",
        duration: 45,
        required: true,
        notes: "Assess improvement and introduce strengthening exercises if pain allows.",
      },
      {
        sessionDay: 8,
        description: "Final assessment and home exercise program",
        duration: 30,
        required: false,
        notes: "Optional - only if patient shows good progress. Provide home exercise plan.",
      },
    ],
    specialInstructions:
      "Patient has limited mobility in left shoulder due to sports injury. Start with gentle exercises and gradually increase intensity based on pain tolerance. Avoid overhead movements in first 2 sessions.",
    totalSessions: 3, // Required sessions
    estimatedDuration: "2 weeks",
  },
]

export function AppointmentBookingDialog({
  open,
  onOpenChange,
  initialDate,
  initialTime,
  onAppointmentCreated,
}: AppointmentBookingDialogProps) {
  const [appointmentType, setAppointmentType] = useState<"general" | "specialized">("general")
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date())
  const [patientId, setPatientId] = useState("")
  const [patientName, setPatientName] = useState("")
  const [department, setDepartment] = useState("")
  const [doctor, setDoctor] = useState("")
  const [consultationType, setConsultationType] = useState("")
  const [time, setTime] = useState(initialTime || "")
  const [paymentMethod, setPaymentMethod] = useState("later")
  const [amount, setAmount] = useState("1500")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [sendReminder, setSendReminder] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("id")
  const [selectedProcedure, setSelectedProcedure] = useState<string>("")
  const [procedureDetails, setProcedureDetails] = useState<Procedure | null>(null)
  const [selectedSessions, setSelectedSessions] = useState<number[]>([])
  const [sessionDates, setSessionDates] = useState<Record<number, Date>>({})
  const [sessionTimes, setSessionTimes] = useState<Record<number, string>>({})

  // New states for prescription workflow
  const [prescriptionMode, setPrescriptionMode] = useState<"upload" | "reference" | "manual">("reference")
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [prescriptionReference, setPrescriptionReference] = useState("")
  const [uploadedPrescription, setUploadedPrescription] = useState<File | null>(null)
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const [availablePrescriptions, setAvailablePrescriptions] = useState<any[]>([])

  const { toast } = useToast()

  // Available time slots
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

  // Find the closest available time slot to the current time
  const findClosestTimeSlot = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // If current time is after the last slot (4:30 PM), return the first slot for tomorrow
    if (currentHour > 16 || (currentHour === 16 && currentMinute > 30)) {
      return "09:00 AM"
    }

    // If current time is before the first slot (9:00 AM), return the first slot
    if (currentHour < 9) {
      return "09:00 AM"
    }

    // Convert current time to minutes since midnight
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    // Find the next available 30-minute slot
    // Round up to the next 30-minute interval
    const nextSlotMinutes = Math.ceil(currentTimeInMinutes / 30) * 30

    // Convert back to hours and minutes
    const nextHour = Math.floor(nextSlotMinutes / 60)
    const nextMinute = nextSlotMinutes % 60

    // Format the time
    const period = nextHour >= 12 ? "PM" : "AM"
    const hour12 = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour
    const formattedHour = hour12.toString().padStart(2, "0")
    const formattedMinute = nextMinute.toString().padStart(2, "0")

    return `${formattedHour}:${formattedMinute} ${period}`
  }

  useEffect(() => {
    if (open) {
      // Set current date as default
      setDate(initialDate || new Date())

      // Set closest available time slot as default
      const closestTimeSlot = findClosestTimeSlot()
      setTime(initialTime || closestTimeSlot)
    }
  }, [open, initialDate, initialTime])

  // Mock patient search
  const handlePatientSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      // Simulate API call
      setTimeout(() => {
        // Different mock results based on search type
        if (searchType === "id") {
          setSearchResults(
            [
              { id: "P12345", name: "John Doe", age: 45, gender: "Male", mobile: "9876543210" },
              { id: "P12346", name: "Jane Smith", age: 32, gender: "Female", mobile: "9876543211" },
              { id: "P12347", name: "Robert Johnson", age: 58, gender: "Male", mobile: "9876543212" },
              { id: "P12349", name: "Rahul Sharma", age: 35, gender: "Male", mobile: "9876543214" },
            ].filter((patient) => patient.id.toLowerCase().includes(query.toLowerCase())),
          )
        } else if (searchType === "name") {
          setSearchResults(
            [
              { id: "P12345", name: "John Doe", age: 45, gender: "Male", mobile: "9876543210" },
              { id: "P12346", name: "Jane Smith", age: 32, gender: "Female", mobile: "9876543211" },
              { id: "P12347", name: "Robert Johnson", age: 58, gender: "Male", mobile: "9876543212" },
              { id: "P12348", name: "John Smith", age: 28, gender: "Male", mobile: "9876543213" },
              { id: "P12349", name: "Rahul Sharma", age: 35, gender: "Male", mobile: "9876543214" },
            ].filter((patient) => patient.name.toLowerCase().includes(query.toLowerCase())),
          )
        } else if (searchType === "mobile") {
          setSearchResults(
            [
              { id: "P12345", name: "John Doe", age: 45, gender: "Male", mobile: "9876543210" },
              { id: "P12346", name: "Jane Smith", age: 32, gender: "Female", mobile: "9876543211" },
              { id: "P12347", name: "Robert Johnson", age: 58, gender: "Male", mobile: "9876543212" },
              { id: "P12348", name: "John Smith", age: 28, gender: "Male", mobile: "9876543213" },
              { id: "P12349", name: "Rahul Sharma", age: 35, gender: "Male", mobile: "9876543214" },
            ].filter((patient) => patient.mobile.includes(query)),
          )
        }
        setIsSearching(false)
      }, 500)
    } else {
      setSearchResults([])
    }
  }

  const selectPatient = (patient: any) => {
    setPatientId(patient.id)
    setPatientName(patient.name)
    setSearchResults([])
    setSearchQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form based on appointment type
    if (!patientId || !patientName || !department || !doctor || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (appointmentType === "general" && (!consultationType || !time)) {
      toast({
        title: "Missing Information",
        description: "Please select consultation type and time.",
        variant: "destructive",
      })
      return
    }

    // Check if appointment is for today
    const today = new Date()
    const isToday =
      date &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    // Process appointment booking
    if (appointmentType === "general") {
      // Book a single general appointment
      const appointmentData = {
        patientId,
        patientName,
        department,
        doctor,
        date: date, // Keep as Date object
        time,
        type: consultationType,
        appointmentType: "general",
        fee: Number.parseInt(amount),
        paymentStatus: paymentMethod === "now" ? "paid" : "pending",
        paymentMethod: paymentMethod === "now" ? "cash" : undefined,
        status: "scheduled",
        contactNumber: "+91 9876543210",
        token: `Token #${Math.floor(Math.random() * 100)}`,
        // Generate a unique ID that we can use to navigate to the appointment
        id: `app-${Date.now()}`,
      }

      // Always call onAppointmentCreated first
      if (onAppointmentCreated) {
        onAppointmentCreated(appointmentData)
      }

      if (isToday) {
        toast({
          title: "Same-Day Appointment Booked!",
          description: `Appointment for ${patientName} with ${doctor} at ${time} has been added to today's appointments.`,
          duration: 5000,
          action: (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Navigate to appointment details - you can implement this based on your routing
                  window.location.href = `/appointments/details/${appointmentData.id}`
                }}
              >
                View Appointment
              </Button>
            </div>
          ),
        })
      } else {
        toast({
          title: "Future Appointment Booked Successfully!",
          description: `Appointment for ${patientName} with ${doctor} on ${format(date, "PPP")} at ${time} has been scheduled.`,
          duration: 10000,
          action: (
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  // Navigate to the specific appointment details
                  window.location.href = `/appointments/details/${appointmentData.id}`
                }}
              >
                View Appointment
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Navigate to all appointments list
                  window.location.href = "/appointments/list"
                }}
              >
                View All Appointments
              </Button>
            </div>
          ),
        })
      }

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setAppointmentType("general")
    setDate(initialDate || new Date())
    setPatientId("")
    setPatientName("")
    setDepartment("")
    setDoctor("")
    setConsultationType("")
    setTime(initialTime || "")
    setPaymentMethod("later")
    setAmount("1500")
    setIsSearching(false)
    setSearchResults([])
    setSendReminder(true)
    setSearchQuery("")
    setSearchType("id")
    setSelectedProcedure("")
    setProcedureDetails(null)
    setSelectedSessions([])
    setSessionDates({})
    setSessionTimes({})
    setPrescriptionMode("reference")
    setSelectedPrescription(null)
    setPrescriptionReference("")
    setUploadedPrescription(null)
    setPrescriptionNotes("")
    setAvailablePrescriptions([])
  }

  // Department to doctors mapping
  const departmentDoctorsMap: Record<string, string[]> = {
    "General Medicine": ["Dr. Smith", "Dr. Johnson", "Dr. Wilson"],
    Cardiology: ["Dr. Johnson", "Dr. Martinez", "Dr. Lee"],
    Orthopedics: ["Dr. Williams", "Dr. Garcia", "Dr. Anderson"],
    Pediatrics: ["Dr. Davis", "Dr. Roberts", "Dr. White"],
    Neurology: ["Dr. Brown", "Dr. Thompson", "Dr. Harris"],
    Dermatology: ["Dr. Miller", "Dr. Clark", "Dr. Lewis"],
  }

  // Department to fee mapping
  const departmentFeeMap: Record<string, Record<string, string>> = {
    "General Medicine": { Consultation: "1500", "Follow-up": "1000", Procedure: "2500", Test: "800" },
    Cardiology: { Consultation: "2000", "Follow-up": "1500", Procedure: "3500", Test: "1200" },
    Orthopedics: { Consultation: "1800", "Follow-up": "1200", Procedure: "3000", Test: "1000" },
    Pediatrics: { Consultation: "1600", "Follow-up": "1100", Procedure: "2800", Test: "900" },
    Neurology: { Consultation: "2200", "Follow-up": "1600", Procedure: "3800", Test: "1300" },
    Dermatology: { Consultation: "1800", "Follow-up": "1200", Procedure: "2500", Test: "1000" },
  }

  // Get available doctors based on selected department
  const availableDoctors = department ? departmentDoctorsMap[department] || [] : []

  // Update fee when department or appointment type changes
  useEffect(() => {
    if (
      appointmentType === "general" &&
      department &&
      consultationType &&
      departmentFeeMap[department]?.[consultationType]
    ) {
      setAmount(departmentFeeMap[department][consultationType])
    }
  }, [department, consultationType, appointmentType])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>Fill in the details below to book a new appointment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Tabs
              defaultValue="general"
              value={appointmentType}
              onValueChange={(value) => setAppointmentType(value as "general" | "specialized")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="general">General OPD</TabsTrigger>
                <TabsTrigger value="specialized">Specialized Procedure</TabsTrigger>
              </TabsList>

              <div className="grid gap-4">
                {/* Patient Search - Common for both types */}
                <div className="grid gap-2">
                  <Label>Search Patient</Label>
                  <Tabs defaultValue="id" value={searchType} onValueChange={setSearchType} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="id" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>ID</span>
                      </TabsTrigger>
                      <TabsTrigger value="name" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Name</span>
                      </TabsTrigger>
                      <TabsTrigger value="mobile" className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>Mobile</span>
                      </TabsTrigger>
                    </TabsList>
                    <div className="mt-2 relative">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => handlePatientSearch(e.target.value)}
                          placeholder={
                            searchType === "id"
                              ? "Enter patient ID"
                              : searchType === "name"
                                ? "Enter patient name"
                                : "Enter mobile number"
                          }
                          className="pl-8"
                        />
                      </div>
                      {isSearching && <div className="text-sm text-muted-foreground mt-1">Searching...</div>}
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          {searchResults.map((patient) => (
                            <div
                              key={patient.id}
                              className="p-2 hover:bg-accent cursor-pointer"
                              onClick={() => selectPatient(patient)}
                            >
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {patient.id} | {patient.age} yrs | {patient.gender} | {patient.mobile}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Tabs>
                </div>

                {patientName && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Selected Patient</Label>
                    <div className="col-span-3">
                      <div className="font-medium">{patientName}</div>
                      <div className="text-sm text-muted-foreground">ID: {patientId}</div>
                    </div>
                  </div>
                )}

                {/* Department Selection - Common for both types */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department" className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Dermatology">Dermatology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor Selection - Common for both types */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctor" className="text-right">
                    Doctor
                  </Label>
                  <Select value={doctor} onValueChange={setDoctor} disabled={!department}>
                    <SelectTrigger id="doctor" className="col-span-3">
                      <SelectValue placeholder={department ? "Select doctor" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors.map((doc) => (
                        <SelectItem key={doc} value={doc}>
                          {doc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Appointment Type Specific Content */}
                <TabsContent value="general" className="mt-0 border-0 p-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="consultationType" className="text-right">
                        Type
                      </Label>
                      <Select value={consultationType} onValueChange={setConsultationType}>
                        <SelectTrigger id="consultationType" className="col-span-3">
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Procedure">Procedure</SelectItem>
                          <SelectItem value="Test">Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "col-span-3 justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger id="time" className="col-span-3">
                          <SelectValue placeholder="Select time">
                            {time ? (
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {time}
                              </div>
                            ) : (
                              "Select time"
                            )}
                          </SelectValue>
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
                  </div>
                </TabsContent>

                <TabsContent value="specialized" className="mt-0 border-0 p-0">
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Specialized Procedures</AlertTitle>
                      <AlertDescription>
                        Specialized procedures require additional setup and may have multiple sessions. Please select
                        the appropriate procedure below.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                {/* Payment Section - Common for both types */}
                <Separator />
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Payment</Label>
                  <div className="col-span-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="font-medium">₹{amount}</span>
                    </div>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="now" id="payment-now" />
                        <Label htmlFor="payment-now" className="font-normal">
                          Pay now
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="later" id="payment-later" />
                        <Label htmlFor="payment-later" className="font-normal">
                          Pay later
                        </Label>
                      </div>
                    </RadioGroup>
                    {paymentMethod === "now" && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center space-x-2 mb-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Payment Method</span>
                        </div>
                        <RadioGroup defaultValue="card" className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="payment-card" />
                            <Label htmlFor="payment-card" className="font-normal">
                              Card
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="payment-cash" />
                            <Label htmlFor="payment-cash" className="font-normal">
                              Cash
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="upi" id="payment-upi" />
                            <Label htmlFor="payment-upi" className="font-normal">
                              UPI
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input id="notes" className="col-span-3" placeholder="Optional notes" />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="col-span-1"></div>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Checkbox
                      id="send-reminder"
                      checked={sendReminder}
                      onCheckedChange={(checked) => setSendReminder(checked as boolean)}
                    />
                    <Label htmlFor="send-reminder" className="font-normal">
                      Send appointment reminder to patient
                    </Label>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Book Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
