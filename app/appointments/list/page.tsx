"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  CalendarIcon,
  Clock,
  Filter,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  CreditCard,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarDays,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// Get today and tomorrow dates
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

// Format date for display
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

// Format date for calendar display
const formatCalendarDate = (date: Date, view: string) => {
  if (view === "day") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } else if (view === "week") {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    const startMonth = startOfWeek.toLocaleDateString("en-US", { month: "short" })
    const endMonth = endOfWeek.toLocaleDateString("en-US", { month: "short" })
    const startDay = startOfWeek.getDate()
    const endDay = endOfWeek.getDate()
    const year = endOfWeek.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }
}

// Format time for display
const formatTime = (timeString: string) => {
  return timeString
}

// Sample appointment data
const appointmentsData = [
  {
    id: "app-1",
    date: today,
    time: "09:00 AM",
    patient: "John Doe",
    patientName: "John Doe",
    doctor: "Dr. Smith",
    department: "General OPD",
    status: "completed",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 500,
    contactNumber: "+91 9876543210",
    token: "Token #12",
    paymentStatus: "paid",
    paymentMethod: "cash",
    paymentAmount: "500",
  },
  {
    id: "app-2",
    date: today,
    time: "10:30 AM",
    patient: "Jane Smith",
    patientName: "Jane Smith",
    doctor: "Dr. Johnson",
    department: "Cardiology",
    status: "in-progress",
    type: "Follow-up",
    appointmentType: "general",
    duration: 45,
    fee: 800,
    contactNumber: "+91 9876543211",
    token: "Token #8",
  },
  {
    id: "app-3",
    date: today,
    time: "11:45 AM",
    patient: "Robert Brown",
    patientName: "Robert Brown",
    doctor: "Dr. Williams",
    department: "Pediatrics",
    status: "waiting",
    type: "Procedure",
    appointmentType: "general",
    duration: 60,
    fee: 1200,
    contactNumber: "+91 9876543212",
    token: "Token #5",
  },
  {
    id: "app-4",
    date: today,
    time: "02:15 PM",
    patient: "Emily Davis",
    patientName: "Emily Davis",
    doctor: "Dr. Jones",
    department: "Orthopedics",
    status: "scheduled",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 600,
    contactNumber: "+91 9876543213",
    token: "Token #9",
  },
  {
    id: "app-5",
    date: today,
    time: "03:30 PM",
    patient: "Michael Wilson",
    patientName: "Michael Wilson",
    doctor: "Dr. Taylor",
    department: "Ophthalmology",
    status: "scheduled",
    type: "Emergency",
    appointmentType: "general",
    duration: 20,
    fee: 1000,
    contactNumber: "+91 9876543214",
    token: "Token #3",
  },
  // Add a specialized procedure appointment
  {
    id: "app-sp-1",
    date: today,
    time: "01:00 PM",
    patient: "Sarah Johnson",
    patientName: "Sarah Johnson",
    doctor: "Dr. Anderson",
    department: "Orthopedics",
    status: "scheduled",
    type: "Procedure",
    appointmentType: "specialized",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    sessionDay: 1,
    sessionDescription: "Initial assessment and treatment plan development",
    duration: 60,
    fee: 5000,
    contactNumber: "+91 9876543220",
    token: "Token #15",
  },
  // Add a completed specialized procedure appointment with unpaid status
  {
    id: "app-sp-2",
    date: today,
    time: "11:00 AM",
    patient: "Thomas Brown",
    patientName: "Thomas Brown",
    doctor: "Dr. Martinez",
    department: "Cardiology",
    status: "completed",
    type: "Procedure",
    appointmentType: "specialized",
    procedureId: "cardio-stress-test",
    procedureName: "Cardiac Stress Test",
    duration: 60,
    fee: 3500,
    contactNumber: "+91 9876543221",
    token: "Token #16",
    paymentStatus: "unpaid",
  },
  // Add related sessions for the multi-day procedure (ortho-physio-rehab) - FUTURE APPOINTMENTS WITHOUT TOKENS
  {
    id: "app-sp-1-session-3",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), // Day 3
    time: "01:00 PM",
    patient: "Sarah Johnson",
    patientName: "Sarah Johnson",
    doctor: "Dr. Anderson",
    department: "Orthopedics",
    status: "scheduled",
    type: "Procedure",
    appointmentType: "specialized",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    sessionDay: 3,
    sessionDescription: "Guided exercises and mobility training",
    duration: 45,
    fee: 0, // No additional fee for subsequent sessions
    contactNumber: "+91 9876543220",
    // No token for future appointments
  },
  {
    id: "app-sp-1-session-5",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4), // Day 5
    time: "01:00 PM",
    patient: "Sarah Johnson",
    patientName: "Sarah Johnson",
    doctor: "Dr. Anderson",
    department: "Orthopedics",
    status: "scheduled",
    type: "Procedure",
    appointmentType: "specialized",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    sessionDay: 5,
    sessionDescription: "Progress evaluation and advanced exercises",
    duration: 45,
    fee: 0,
    contactNumber: "+91 9876543220",
    // No token for future appointments
  },
  {
    id: "app-sp-1-session-8",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), // Day 8
    time: "01:00 PM",
    patient: "Sarah Johnson",
    patientName: "Sarah Johnson",
    doctor: "Dr. Anderson",
    department: "Orthopedics",
    status: "scheduled",
    type: "Procedure",
    appointmentType: "specialized",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    sessionDay: 8,
    sessionDescription: "Final assessment and home exercise program",
    duration: 30,
    fee: 0,
    contactNumber: "+91 9876543220",
    // No token for future appointments
  },
  {
    id: "app-6",
    date: tomorrow,
    time: "09:30 AM",
    patient: "Sarah Johnson",
    patientName: "Sarah Johnson",
    doctor: "Dr. Smith",
    department: "General OPD",
    status: "scheduled",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 500,
    contactNumber: "+91 9876543215",
    // No token for future appointments
  },
  {
    id: "app-7",
    date: tomorrow,
    time: "11:00 AM",
    patient: "David Lee",
    patientName: "David Lee",
    doctor: "Dr. Johnson",
    department: "Cardiology",
    status: "scheduled",
    type: "Follow-up",
    appointmentType: "general",
    duration: 45,
    fee: 800,
    contactNumber: "+91 9876543216",
    // No token for future appointments
  },
  {
    id: "app-8",
    date: tomorrow,
    time: "01:15 PM",
    patient: "Jennifer White",
    patientName: "Jennifer White",
    doctor: "Dr. Williams",
    department: "Pediatrics",
    status: "scheduled",
    type: "Procedure",
    appointmentType: "general",
    duration: 60,
    fee: 1200,
    contactNumber: "+91 9876543217",
    // No token for future appointments
  },
  {
    id: "app-9",
    date: tomorrow,
    time: "03:00 PM",
    patient: "Thomas Brown",
    patientName: "Thomas Brown",
    doctor: "Dr. Jones",
    department: "Orthopedics",
    status: "scheduled",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 600,
    contactNumber: "+91 9876543218",
    // No token for future appointments
  },
  {
    id: "app-10",
    date: today,
    time: "04:30 PM",
    patient: "Lisa Anderson",
    patientName: "Lisa Anderson",
    doctor: "Dr. Smith",
    department: "General OPD",
    status: "completed",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 500,
    contactNumber: "+91 9876543219",
    token: "Token #17",
    paymentStatus: "unpaid",
  },
  // Add more appointments for the current month
  {
    id: "app-11",
    date: new Date(today.getFullYear(), today.getMonth(), 5),
    time: "10:00 AM",
    patient: "Alex Johnson",
    patientName: "Alex Johnson",
    doctor: "Dr. Smith",
    department: "General OPD",
    status: "completed",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 500,
    contactNumber: "+91 9876543220",
    token: "Token #20",
    paymentStatus: "paid",
    paymentMethod: "card",
    paymentAmount: "500",
  },
  {
    id: "app-12",
    date: new Date(today.getFullYear(), today.getMonth(), 8),
    time: "11:30 AM",
    patient: "Maria Garcia",
    patientName: "Maria Garcia",
    doctor: "Dr. Johnson",
    department: "Cardiology",
    status: "completed",
    type: "Follow-up",
    appointmentType: "general",
    duration: 45,
    fee: 800,
    contactNumber: "+91 9876543221",
    token: "Token #21",
    paymentStatus: "paid",
    paymentMethod: "cash",
    paymentAmount: "800",
  },
  {
    id: "app-13",
    date: new Date(today.getFullYear(), today.getMonth(), 12),
    time: "02:00 PM",
    patient: "James Wilson",
    patientName: "James Wilson",
    doctor: "Dr. Williams",
    department: "Pediatrics",
    status: "completed",
    type: "Procedure",
    appointmentType: "general",
    duration: 60,
    fee: 1200,
    contactNumber: "+91 9876543222",
    token: "Token #22",
    paymentStatus: "paid",
    paymentMethod: "card",
    paymentAmount: "1200",
  },
  {
    id: "app-14",
    date: new Date(today.getFullYear(), today.getMonth(), 15),
    time: "09:15 AM",
    patient: "Patricia Moore",
    patientName: "Patricia Moore",
    doctor: "Dr. Jones",
    department: "Orthopedics",
    status: "completed",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 600,
    contactNumber: "+91 9876543223",
    token: "Token #23",
    paymentStatus: "unpaid",
  },
  {
    id: "app-15",
    date: new Date(today.getFullYear(), today.getMonth(), 18),
    time: "03:45 PM",
    patient: "Robert Taylor",
    patientName: "Robert Taylor",
    doctor: "Dr. Taylor",
    department: "Ophthalmology",
    status: "completed",
    type: "Emergency",
    appointmentType: "general",
    duration: 20,
    fee: 1000,
    contactNumber: "+91 9876543224",
    token: "Token #24",
    paymentStatus: "paid",
    paymentMethod: "cash",
    paymentAmount: "1000",
  },
  {
    id: "app-16",
    date: new Date(today.getFullYear(), today.getMonth(), 22),
    time: "10:45 AM",
    patient: "Linda Martinez",
    patientName: "Linda Martinez",
    doctor: "Dr. Smith",
    department: "General OPD",
    status: "scheduled",
    type: "Consultation",
    appointmentType: "general",
    duration: 30,
    fee: 500,
    contactNumber: "+91 9876543225",
    // No token for future appointments
  },
  {
    id: "app-17",
    date: new Date(today.getFullYear(), today.getMonth(), 25),
    time: "01:30 PM",
    patient: "Charles Anderson",
    patientName: "Charles Anderson",
    doctor: "Dr. Johnson",
    department: "Cardiology",
    status: "scheduled",
    type: "Follow-up",
    appointmentType: "general",
    duration: 45,
    fee: 800,
    contactNumber: "+91 9876543226",
    // No token for future appointments
  },
  {
    id: "app-18",
    date: new Date(today.getFullYear(), today.getMonth(), 28),
    time: "11:15 AM",
    patient: "Elizabeth Thomas",
    patientName: "Elizabeth Thomas",
    doctor: "Dr. Williams",
    department: "Pediatrics",
    status: "scheduled",
    type: "Procedure",
    appointmentType: "general",
    duration: 60,
    fee: 1200,
    contactNumber: "+91 9876543227",
    // No token for future appointments
  },
]

// Time slots for day and week views
const timeSlots = [
  "08:00 AM",
  "08:30 AM",
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
  "05:00 PM",
  "05:30 PM",
]

export default function AppointmentsList() {
  // State for view mode
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("month")

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // State for date range
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // State for dialogs
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [appointmentToComplete, setAppointmentToComplete] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // State for calendar
  const [currentDate, setCurrentDate] = useState(new Date())

  // State for appointments data\
  const [appointments, setAppointments] = useState(appointmentsData)

  // State for booking modal
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle appointment click
  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setAppointmentDetailsOpen(true)
    setIsEditMode(false)
  }

  // Handle edit appointment click
  const handleEditAppointment = (appointment: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setSelectedAppointment(appointment)
    setAppointmentDetailsOpen(true)
    // Set a small timeout to ensure the modal is open before setting edit mode
    setTimeout(() => {
      setIsEditMode(true)
    }, 100)
  }

  // Handle status transition
  const handleStatusTransition = (appointmentId: string, newStatus: string) => {
    // If transitioning to completed, show payment dialog
    if (newStatus === "completed") {
      const appointment = appointments.find((app) => app.id === appointmentId)
      if (appointment) {
        setAppointmentToComplete(appointment)
        setPaymentDialogOpen(true)
      }
      return
    }

    // Otherwise, update the status directly
    handleAppointmentStatusChange(appointmentId, newStatus)
  }

  // Handle appointment status change
  const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
    // Update the appointment status
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
      ),
    )

    // Close the modal if it's open
    setAppointmentDetailsOpen(false)
  }

  // Handle appointment update
  const handleAppointmentUpdate = (appointmentId: string, updatedData: any) => {
    // Update the appointment
    setAppointments(
      appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return {
            ...appointment,
            ...updatedData,
          }
        }
        return appointment
      }),
    )
  }

  // Handle payment completion
  const handlePaymentComplete = (paid: boolean, paymentMethod?: string, amount?: string) => {
    if (!appointmentToComplete) return

    // Update the appointment with payment information
    const updatedAppointment = {
      ...appointmentToComplete,
      status: "completed",
      paymentStatus: paid ? "paid" : "unpaid",
      paymentMethod: paid ? paymentMethod : undefined,
      paymentAmount: paid ? amount : undefined,
    }

    // Update the appointments array
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentToComplete.id ? updatedAppointment : appointment,
      ),
    )

    // Close the payment dialog
    setPaymentDialogOpen(false)
    setAppointmentToComplete(null)
  }

  // Handle appointment creation from booking modal
  const handleAppointmentCreated = (newAppointment: any) => {
    // Add the new appointment to the list
    const appointmentWithId = {
      ...newAppointment,
      id: `app-${Date.now()}`, // Generate a unique ID
      date: new Date(newAppointment.date),
      status: "scheduled",
      paymentStatus: newAppointment.paymentStatus || "pending",
      // Only add token if it's for today or past dates
      ...(new Date(newAppointment.date) <= today && { token: `Token #${Math.floor(Math.random() * 100) + 1}` }),
    }

    setAppointments([...appointments, appointmentWithId])
    setIsBookingOpen(false)
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">
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
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Helper function to get payment status badge
  const getPaymentBadge = (appointment: any) => {
    if (appointment.status !== "completed") return null

    return appointment.paymentStatus === "paid" ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
        Paid
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
        Unpaid
      </Badge>
    )
  }

  // Helper function to check if appointment is editable
  const isAppointmentEditable = (appointment: any) => {
    return appointment.status !== "completed" && appointment.status !== "cancelled"
  }

  // Helper function to get action buttons based on current status
  const getActionButtons = (appointment: any) => {
    const { id, status, date } = appointment

    // Don't show action buttons for future appointments
    if (date > today) {
      return null
    }

    switch (status) {
      case "scheduled":
        return (
          <div className="flex items-center">
            {isAppointmentEditable(appointment) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditAppointment(appointment)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Appointment</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Appointment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-amber-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusTransition(id, "waiting")
                    }}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Mark as Waiting</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as Waiting</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      case "waiting":
        return (
          <div className="flex items-center">
            {isAppointmentEditable(appointment) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditAppointment(appointment)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Appointment</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Appointment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusTransition(id, "in-progress")
                    }}
                  >
                    <Play className="h-4 w-4" />
                    <span className="sr-only">Start Consultation</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start Consultation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      case "in-progress":
        return (
          <div className="flex items-center">
            {isAppointmentEditable(appointment) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditAppointment(appointment)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Appointment</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Appointment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-green-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusTransition(id, "completed")
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Complete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete Appointment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      case "completed":
        if (appointment.paymentStatus === "unpaid") {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-amber-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAppointmentToComplete(appointment)
                      setPaymentDialogOpen(true)
                    }}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="sr-only">Collect Payment</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Collect Payment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-green-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    // View receipt or details
                  }}
                >
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">View Receipt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Receipt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      default:
        return null
    }
  }

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    if (
      searchQuery &&
      !appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(appointment.token && appointment.token.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false
    }

    // Date filter
    if (dateFilter === "today") {
      if (
        appointment.date.getDate() !== today.getDate() ||
        appointment.date.getMonth() !== today.getMonth() ||
        appointment.date.getFullYear() !== today.getFullYear()
      ) {
        return false
      }
    } else if (dateFilter === "upcoming") {
      // If date range is selected, filter by range
      if (dateRange.from && dateRange.to) {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= dateRange.from && appointmentDate <= dateRange.to
      }
      // Otherwise, show all future appointments
      else if (appointment.date < today) {
        return false
      }
    }

    // Department filter
    if (departmentFilter !== "all" && appointment.department !== departmentFilter) {
      return false
    }

    // Payment filter
    if (paymentFilter === "paid" && appointment.paymentStatus !== "paid") {
      return false
    }
    if (paymentFilter === "unpaid" && appointment.paymentStatus !== "unpaid") {
      return false
    }
    if (
      paymentFilter === "pending-payment" &&
      (appointment.status !== "completed" || appointment.paymentStatus === "paid")
    ) {
      return false
    }

    return true
  })

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Sort by selected field
    if (sortField === "date") {
      // Sort by date and then by time
      const dateA = new Date(a.date).setHours(0, 0, 0, 0)
      const dateB = new Date(b.date).setHours(0, 0, 0, 0)

      if (dateA !== dateB) {
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }

      // If dates are the same, sort by time
      const timeA = a.time
      const timeB = b.time
      return sortDirection === "asc" ? timeA.localeCompare(timeB) : timeB.localeCompare(timeA)
    }

    if (sortField === "patient") {
      return sortDirection === "asc" ? a.patient.localeCompare(b.patient) : b.patient.localeCompare(a.patient)
    }

    if (sortField === "doctor") {
      return sortDirection === "asc" ? a.doctor.localeCompare(b.doctor) : b.doctor.localeCompare(a.doctor)
    }

    if (sortField === "status") {
      return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
    }

    return 0
  })

  // Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: 0, date: null })
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({ day: i, date })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return []

    return filteredAppointments.filter(
      (appointment) =>
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear(),
    )
  }

  // Get appointments for a specific week
  const getAppointmentsForWeek = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    return filteredAppointments.filter((appointment) => {
      const appDate = new Date(appointment.date)
      return appDate >= startOfWeek && appDate <= endOfWeek
    })
  }

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const days = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      days.push(date)
    }

    return days
  }

  const weekDays = generateWeekDays()

  // Navigation functions
  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (calendarView === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (calendarView === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (calendarView === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (calendarView === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // Get status color for calendar
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-gray-100 border-gray-300"
      case "waiting":
        return "bg-amber-100 border-amber-300"
      case "in-progress":
        return "bg-blue-100 border-blue-300"
      case "completed":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  // Check if a date is today
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Get appointments for day view
  const dayViewAppointments = useMemo(() => {
    return getAppointmentsForDate(currentDate)
  }, [currentDate, filteredAppointments])

  // Get appointments for week view
  const weekViewAppointments = useMemo(() => {
    return getAppointmentsForWeek()
  }, [currentDate, filteredAppointments])

  // Find appointment at a specific time slot for day view
  const findAppointmentAtTimeSlot = (timeSlot: string) => {
    return dayViewAppointments.find((app) => app.time === timeSlot)
  }

  // Find appointment at a specific time slot for week view
  const findAppointmentAtTimeSlotForDay = (timeSlot: string, date: Date) => {
    return weekViewAppointments.find(
      (app) =>
        app.time === timeSlot &&
        app.date.getDate() === date.getDate() &&
        app.date.getMonth() === date.getMonth() &&
        app.date.getFullYear() === date.getFullYear(),
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Appointments List</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-blue-50 rounded-t-lg pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage all appointments</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsBookingOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              <Tabs defaultValue="list" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list" onClick={() => setViewMode("list")}>
                    <List className="mr-2 h-4 w-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="calendar" onClick={() => setViewMode("calendar")}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by patient, token or doctor..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              {dateFilter === "upcoming" && (
                <div className="ml-2">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select date range"
                    align="start"
                    className="w-[250px]"
                  />
                </div>
              )}

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="General OPD">General OPD</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[150px]">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="pending-payment">Pending Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* List View */}
          {viewMode === "list" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("date")}
                        className="flex items-center gap-1 font-medium"
                      >
                        Date/Time
                        {sortField === "date" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("patient")}
                        className="flex items-center gap-1 font-medium"
                      >
                        Patient
                        {sortField === "patient" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("doctor")}
                        className="flex items-center gap-1 font-medium"
                      >
                        Doctor
                        {sortField === "doctor" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-medium"
                      >
                        Status
                        {sortField === "status" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedAppointments.map((appointment) => (
                      <TableRow
                        key={appointment.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{formatDate(appointment.date)}</span>
                            <span className="text-sm text-muted-foreground">{appointment.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{appointment.patient}</span>
                            <span className="text-sm text-muted-foreground">{appointment.contactNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {appointment.token ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {appointment.token}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{appointment.department}</span>
                            {appointment.appointmentType === "specialized" && (
                              <span className="text-xs text-blue-600 mt-1">
                                {appointment.procedureName}
                                {appointment.sessionDay && ` (Session ${appointment.sessionDay})`}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          {getPaymentBadge(appointment)}
                          {appointment.paymentStatus === "paid" && (
                            <div className="text-xs text-green-600 mt-1">
                              {appointment.paymentMethod?.toUpperCase()} ₹{appointment.paymentAmount || appointment.fee}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            {getActionButtons(appointment)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAppointmentClick(appointment)
                                  }}
                                >
                                  View Details
                                </DropdownMenuItem>
                                {isAppointmentEditable(appointment) && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditAppointment(appointment)
                                    }}
                                  >
                                    Edit Appointment
                                  </DropdownMenuItem>
                                )}
                                {appointment.status === "completed" && appointment.paymentStatus === "paid" && (
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    Print Receipt
                                  </DropdownMenuItem>
                                )}
                                {appointment.status === "completed" && appointment.paymentStatus === "unpaid" && (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setAppointmentToComplete(appointment)
                                      setPaymentDialogOpen(true)
                                    }}
                                  >
                                    Pay Now
                                  </DropdownMenuItem>
                                )}
                                {appointment.status !== "completed" && (
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Reschedule</DropdownMenuItem>
                                )}
                                {appointment.status === "scheduled" && (
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Cancel</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="rounded-md border">
              {/* Calendar View Selector */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold">{formatCalendarDate(currentDate, calendarView)}</h2>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Tabs defaultValue="month" className="w-[250px]">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="day" onClick={() => setCalendarView("day")}>
                        Day
                      </TabsTrigger>
                      <TabsTrigger value="week" onClick={() => setCalendarView("week")}>
                        Week
                      </TabsTrigger>
                      <TabsTrigger value="month" onClick={() => setCalendarView("month")}>
                        Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                </div>
              </div>

              {/* Day View */}
              {calendarView === "day" && (
                <div className="flex flex-col">
                  <div className="text-center py-2 bg-blue-50 font-medium border-b">
                    {currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="overflow-y-auto max-h-[600px]">
                    {timeSlots.map((timeSlot) => {
                      const appointment = findAppointmentAtTimeSlot(timeSlot)

                      return (
                        <div key={timeSlot} className="flex border-b last:border-b-0">
                          <div className="w-24 p-2 border-r bg-gray-50 text-sm font-medium">{timeSlot}</div>
                          <div className="flex-1 p-2 min-h-[60px]">
                            {appointment ? (
                              <div
                                className={`p-2 rounded border ${getStatusColor(appointment.status)} h-full cursor-pointer hover:opacity-90 relative`}
                                onClick={() => handleAppointmentClick(appointment)}
                              >
                                <div className="font-medium">{appointment.patient}</div>
                                <div className="text-sm">{appointment.doctor}</div>
                                <div className="text-sm">{appointment.department}</div>
                                {appointment.appointmentType === "specialized" && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    {appointment.procedureName}
                                    {appointment.sessionDay && ` (Session ${appointment.sessionDay})`}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  {appointment.token && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                    >
                                      {appointment.token}
                                    </Badge>
                                  )}
                                  {getStatusBadge(appointment.status)}
                                  {getPaymentBadge(appointment.status)}
                                </div>

                                {/* Edit button for non-completed appointments */}
                                {isAppointmentEditable(appointment) && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditAppointment(appointment)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                )}

                                {/* Add Pay Now button for unpaid completed appointments */}
                                {appointment.status === "completed" && appointment.paymentStatus === "unpaid" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 h-7 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setAppointmentToComplete(appointment)
                                      setPaymentDialogOpen(true)
                                    }}
                                  >
                                    <CreditCard className="mr-1 h-3 w-3" />
                                    Pay Now
                                  </Button>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Week View */}
              {calendarView === "week" && (
                <div className="flex flex-col">
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-2 border-r bg-gray-50"></div>
                    {weekDays.map((date, index) => (
                      <div
                        key={index}
                        className={`p-2 text-center font-medium text-sm border-r last:border-r-0 ${
                          isToday(date) ? "bg-blue-50" : ""
                        }`}
                      >
                        <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div>{date.getDate()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="overflow-y-auto max-h-[600px]">
                    {timeSlots.map((timeSlot) => (
                      <div key={timeSlot} className="grid grid-cols-8 border-b last:border-b-0">
                        <div className="p-2 border-r bg-gray-50 text-sm font-medium">{timeSlot}</div>
                        {weekDays.map((date, index) => {
                          const appointment = findAppointmentAtTimeSlotForDay(timeSlot, date)

                          return (
                            <div
                              key={index}
                              className={`p-1 border-r last:border-r-0 min-h-[60px] ${
                                isToday(date) ? "bg-blue-50/30" : ""
                              }`}
                            >
                              {appointment ? (
                                <div
                                  className={`p-1 rounded border ${getStatusColor(appointment.status)} h-full text-xs cursor-pointer hover:opacity-90 relative`}
                                  onClick={() => handleAppointmentClick(appointment)}
                                >
                                  <div className="font-medium truncate">{appointment.patient}</div>
                                  <div className="truncate">{appointment.doctor}</div>
                                  <div className="truncate">{appointment.token ? appointment.token : "No Token"}</div>
                                  {appointment.appointmentType === "specialized" && (
                                    <div className="truncate text-[9px] text-blue-600">
                                      {appointment.procedureName?.substring(0, 15)}
                                      {appointment.procedureName?.length > 15 ? "..." : ""}
                                    </div>
                                  )}

                                  {/* Edit button for non-completed appointments */}
                                  {isAppointmentEditable(appointment) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="absolute top-0 right-0 h-5 w-5 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditAppointment(appointment)
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  )}

                                  {/* Add payment status badge */}
                                  {appointment.status === "completed" && (
                                    <div className="mt-1">
                                      {appointment.paymentStatus === "paid" ? (
                                        <span className="text-[10px] px-1 py-0.5 rounded bg-green-100 text-green-700">
                                          Paid
                                        </span>
                                      ) : (
                                        <span className="text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-700">
                                          Unpaid
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Add Pay Now button for unpaid completed appointments */}
                                  {appointment.status === "completed" && appointment.paymentStatus === "unpaid" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="mt-1 h-6 w-full text-[10px] bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setAppointmentToComplete(appointment)
                                        setPaymentDialogOpen(true)
                                      }}
                                    >
                                      <CreditCard className="mr-1 h-3 w-3" />
                                      Pay
                                    </Button>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Month View */}
              {calendarView === "month" && (
                <>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 text-center border-b">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="py-2 font-medium text-sm border-r last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 min-h-[600px]">
                    {calendarDays.map((day, index) => {
                      const isCurrentDay =
                        day.date &&
                        day.date.getDate() === today.getDate() &&
                        day.date.getMonth() === today.getMonth() &&
                        day.date.getFullYear() === today.getFullYear()

                      const dayAppointments = day.date ? getAppointmentsForDate(day.date) : []

                      return (
                        <div
                          key={index}
                          className={`min-h-[100px] p-1 border-r border-b last:border-r-0 ${
                            day.day === 0 ? "bg-gray-50" : ""
                          } ${isCurrentDay ? "bg-blue-50" : ""}`}
                        >
                          {day.day !== 0 && (
                            <>
                              <div className={`text-right p-1 ${isCurrentDay ? "font-bold text-blue-600" : ""}`}>
                                {day.day}
                              </div>
                              <div className="flex flex-col gap-1 max-h-[calc(100%-24px)] overflow-y-auto">
                                {dayAppointments.length > 0 ? (
                                  dayAppointments.map((appointment) => (
                                    <div
                                      key={appointment.id}
                                      className={`p-1 text-xs rounded border ${getStatusColor(
                                        appointment.status,
                                      )} cursor-pointer hover:opacity-80 relative mb-1`}
                                      onClick={() => handleAppointmentClick(appointment)}
                                    >
                                      <div className="font-medium truncate">{appointment.time}</div>
                                      <div className="truncate">{appointment.patient}</div>
                                      <div className="truncate text-[10px]">{appointment.doctor}</div>
                                      {appointment.appointmentType === "specialized" && (
                                        <div className="truncate text-[9px] text-blue-600">
                                          {appointment.procedureName?.substring(0, 12)}
                                          {appointment.procedureName?.length > 12 ? "..." : ""}
                                        </div>
                                      )}

                                      {/* Edit button for non-completed appointments */}
                                      {isAppointmentEditable(appointment) && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="absolute top-0 right-0 h-5 w-5 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditAppointment(appointment)
                                          }}
                                        >
                                          <Edit className="h-3 w-3" />
                                          <span className="sr-only">Edit</span>
                                        </Button>
                                      )}

                                      {/* Add payment status indicator for completed appointments */}
                                      {appointment.status === "completed" && (
                                        <div className="absolute top-1 right-1">
                                          {appointment.paymentStatus === "paid" ? (
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          ) : (
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-400 italic">No appointments</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
