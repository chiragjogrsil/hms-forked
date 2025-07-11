"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Calendar,
  UserPlus,
  CreditCard,
  ArrowRight,
  Filter,
  ChevronRight,
  Clock,
  Play,
  Check,
  Stethoscope,
  Users,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"
import { AppointmentDetailsModal } from "@/components/modals/appointment-details-modal"
import { QuickRegistrationDialog } from "@/components/quick-registration-dialog"
import { PatientCreationDialog } from "@/components/patient-creation-dialog"

// Define the relationship between departments and doctors
const departmentDoctorMap = {
  "all-departments": ["all-doctors"],
  general: ["dr-smith"],
  cardiology: ["dr-johnson"],
  pediatrics: ["dr-williams"],
  orthopedics: ["dr-jones"],
  ophthalmology: ["dr-taylor"],
}

// Reverse mapping for doctor to department
const doctorDepartmentMap = {
  "all-doctors": "all-departments",
  "dr-smith": "general",
  "dr-johnson": "cardiology",
  "dr-williams": "pediatrics",
  "dr-jones": "orthopedics",
  "dr-taylor": "ophthalmology",
}

// Doctor names for display
const doctorNames = {
  "all-doctors": "All Doctors",
  "dr-smith": "Dr. Smith",
  "dr-johnson": "Dr. Johnson",
  "dr-williams": "Dr. Williams",
  "dr-jones": "Dr. Jones",
  "dr-taylor": "Dr. Taylor",
}

// Department names for display
const departmentNames = {
  "all-departments": "All Departments",
  general: "General OPD",
  cardiology: "Cardiology",
  pediatrics: "Pediatrics",
  orthopedics: "Orthopedics",
  ophthalmology: "Ophthalmology",
}

// Helper function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
}

// Get today and tomorrow dates
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

export default function Dashboard() {
  // State for department and doctor filters
  const [selectedDepartment, setSelectedDepartment] = useState("all-departments")
  const [selectedDoctor, setSelectedDoctor] = useState("all-doctors")

  // State for date filter
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">("today")

  // State for status filters
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("all")

  // State for booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // State for appointment details modal
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // State for quick registration modal
  const [isQuickRegistrationOpen, setIsQuickRegistrationOpen] = useState(false)

  // State for patient creation modal
  const [isPatientCreationOpen, setIsPatientCreationOpen] = useState(false)

  // Sample appointment data for today
  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: "app-1",
      time: "09:00 AM",
      patient: "John Doe",
      patientName: "John Doe",
      doctor: "Dr. Smith",
      department: "General OPD",
      status: "completed",
      type: "Consultation",
      date: today.toISOString(),
      duration: 30,
      fee: 500,
      contactNumber: "+91 9876543210",
      token: "Token #12",
      paymentStatus: "paid",
      paymentMethod: "cash",
    },
    {
      id: "app-2",
      time: "10:30 AM",
      patient: "Jane Smith",
      patientName: "Jane Smith",
      doctor: "Dr. Johnson",
      department: "Cardiology",
      status: "in-progress",
      type: "Follow-up",
      date: today.toISOString(),
      duration: 45,
      fee: 800,
      contactNumber: "+91 9876543211",
      token: "Token #8",
    },
    {
      id: "app-3",
      time: "11:45 AM",
      patient: "Robert Brown",
      patientName: "Robert Brown",
      doctor: "Dr. Williams",
      department: "Pediatrics",
      status: "waiting",
      type: "Procedure",
      date: today.toISOString(),
      duration: 60,
      fee: 1200,
      contactNumber: "+91 9876543212",
      token: "Token #5",
    },
    {
      id: "app-4",
      time: "02:15 PM",
      patient: "Emily Davis",
      patientName: "Emily Davis",
      doctor: "Dr. Jones",
      department: "Orthopedics",
      status: "scheduled",
      type: "Consultation",
      date: today.toISOString(),
      duration: 30,
      fee: 600,
      contactNumber: "+91 9876543213",
      token: "Token #9",
    },
    {
      id: "app-5",
      time: "03:30 PM",
      patient: "Michael Wilson",
      patientName: "Michael Wilson",
      doctor: "Dr. Taylor",
      department: "Ophthalmology",
      status: "scheduled",
      type: "Emergency",
      date: today.toISOString(),
      duration: 20,
      fee: 1000,
      contactNumber: "+91 9876543214",
      token: "Token #3",
    },
  ])

  // Sample appointment data for tomorrow
  const [tomorrowAppointments, setTomorrowAppointments] = useState([
    {
      id: "app-6",
      time: "09:30 AM",
      patient: "Sarah Johnson",
      patientName: "Sarah Johnson",
      doctor: "Dr. Smith",
      department: "General OPD",
      status: "scheduled",
      type: "Consultation",
      date: tomorrow.toISOString(),
      duration: 30,
      fee: 500,
      contactNumber: "+91 9876543215",
      token: "Token #4",
    },
    {
      id: "app-7",
      time: "11:00 AM",
      patient: "David Lee",
      patientName: "David Lee",
      doctor: "Dr. Johnson",
      department: "Cardiology",
      status: "scheduled",
      type: "Follow-up",
      date: tomorrow.toISOString(),
      duration: 45,
      fee: 800,
      contactNumber: "+91 9876543216",
      token: "Token #7",
    },
  ])

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    if (value === "all-departments") {
      setSelectedDoctor("all-doctors")
    } else {
      setSelectedDoctor(departmentDoctorMap[value as keyof typeof departmentDoctorMap][0])
    }
  }

  // Handle doctor change
  const handleDoctorChange = (value: string) => {
    setSelectedDoctor(value)
    if (value !== "all-doctors") {
      setSelectedDepartment(doctorDepartmentMap[value as keyof typeof doctorDepartmentMap])
    }
  }

  // Get available doctors for a department
  const getAvailableDoctors = (department: string) => {
    if (department === "all-departments") {
      return Object.keys(doctorNames)
    }
    return ["all-doctors", ...departmentDoctorMap[department as keyof typeof departmentDoctorMap]]
  }

  // Get appointments based on selected date
  const appointments = selectedDate === "today" ? todayAppointments : tomorrowAppointments

  // Filter appointments based on selected department and doctor
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by department
    if (
      selectedDepartment !== "all-departments" &&
      appointment.department !== departmentNames[selectedDepartment as keyof typeof departmentNames]
    ) {
      return false
    }

    // Filter by doctor
    if (
      selectedDoctor !== "all-doctors" &&
      appointment.doctor !== doctorNames[selectedDoctor as keyof typeof doctorNames]
    ) {
      return false
    }

    // Filter by status
    if (appointmentStatusFilter !== "all") {
      if (appointmentStatusFilter === "scheduled" && appointment.status !== "scheduled") return false
      if (appointmentStatusFilter === "waiting" && appointment.status !== "waiting") return false
      if (appointmentStatusFilter === "in-progress" && appointment.status !== "in-progress") return false
      if (appointmentStatusFilter === "completed" && appointment.status !== "completed") return false
    }

    return true
  })

  // Helper function to get status badge with muted colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-hospital-gray-50 text-hospital-gray-700 hover:bg-hospital-gray-50 border-hospital-gray-200 font-medium"
          >
            Scheduled
          </Badge>
        )
      case "waiting":
        return (
          <Badge
            variant="outline"
            className="bg-hospital-warning-50 text-hospital-warning-700 hover:bg-hospital-warning-50 border-hospital-warning-200 font-medium"
          >
            Waiting
          </Badge>
        )
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-hospital-accent-50 text-hospital-accent-700 hover:bg-hospital-accent-50 border-hospital-accent-200 font-medium"
          >
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-hospital-success-50 text-hospital-success-700 hover:bg-hospital-success-50 border-hospital-success-200 font-medium"
          >
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-medium">
            {status}
          </Badge>
        )
    }
  }

  // Helper function to get action buttons based on current status
  const getActionButtons = (appointment: any) => {
    const { status } = appointment

    // Don't show action buttons for tomorrow's appointments
    if (selectedDate === "tomorrow") {
      return null
    }

    const handleQuickAction = (e: React.MouseEvent, newStatus: string) => {
      e.stopPropagation() // Prevent opening the details modal
      handleStatusChange(appointment.id, newStatus)
    }

    switch (status) {
      case "scheduled":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-hospital-warning-600 hover:bg-hospital-warning-50"
                  onClick={(e) => handleQuickAction(e, "waiting")}
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
        )
      case "waiting":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-hospital-accent-600 hover:bg-hospital-accent-50"
                  onClick={(e) => handleQuickAction(e, "in-progress")}
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
        )
      case "in-progress":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-hospital-success-600 hover:bg-hospital-success-50"
                  onClick={(e) => handleQuickAction(e, "completed")}
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
        )
      case "completed":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-hospital-gray-400" disabled>
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Completed</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Appointment Completed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      default:
        return null
    }
  }

  // Handle new appointment creation
  const handleAppointmentCreated = (newAppointment: any) => {
    // Check if appointment is for today
    const today = new Date()
    const appointmentDate = new Date(newAppointment.date)
    const isToday =
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()

    // Add the new appointment to today's appointments if it's for today
    if (isToday) {
      const appointmentWithId = {
        ...newAppointment,
        // Ensure the date is properly formatted for the dashboard
        date: today.toISOString(),
        // Map department names to match existing data structure
        department: newAppointment.department === "General Medicine" ? "General OPD" : newAppointment.department,
        // Ensure all required fields are present
        patient: newAppointment.patientName,
        duration: 30, // Default duration
      }

      console.log("Adding today's appointment:", appointmentWithId) // Debug log

      // Update the appointments list
      setTodayAppointments((prev) => {
        const updated = [...prev, appointmentWithId]
        console.log("Updated today's appointments:", updated) // Debug log
        return updated
      })
    }
    // For future appointments, they will be visible in the appointments list page
    // but we still store them for potential future use
    else {
      console.log("Future appointment booked:", newAppointment) // Debug log
    }
  }

  // Handle appointment card click
  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsModalOpen(true)
  }

  // Handle status change from modal or quick actions
  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    const updateAppointments = (appointments: any[]) =>
      appointments.map((app) =>
        app.id === appointmentId
          ? { ...app, status: newStatus, paymentStatus: newStatus === "completed" ? "paid" : app.paymentStatus }
          : app,
      )

    if (selectedDate === "today") {
      setTodayAppointments(updateAppointments)
    } else {
      setTomorrowAppointments(updateAppointments)
    }

    // Update selected appointment if it's the one being changed
    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment((prev: any) => ({
        ...prev,
        status: newStatus,
        paymentStatus: newStatus === "completed" ? "paid" : prev.paymentStatus,
      }))
    }
  }

  // Handle appointment update from modal
  const handleAppointmentUpdate = (appointmentId: string, updatedData: any) => {
    const updateAppointments = (appointments: any[]) =>
      appointments.map((app) => (app.id === appointmentId ? { ...app, ...updatedData } : app))

    if (selectedDate === "today") {
      setTodayAppointments(updateAppointments)
    } else {
      setTomorrowAppointments(updateAppointments)
    }

    // Update selected appointment if it's the one being changed
    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment((prev: any) => ({ ...prev, ...updatedData }))
    }
  }

  // Handle quick patient registration
  const handleQuickPatientRegistered = (patientData: any) => {
    console.log("Quick patient registered:", patientData)
    // You can add logic here to update any patient lists or show notifications
  }

  // Handle patient creation
  const handlePatientCreated = (patientData: any) => {
    console.log("New patient created:", patientData)
    // Navigate to patient details page with consultation tab pre-selected
    window.location.href = `/patients/${patientData.id}?tab=consultation`
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-hospital-gray-800">Hospital Dashboard</h1>
          <p className="text-hospital-gray-600 mt-1 font-medium">Manage appointments and patient care efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            onClick={() => setIsPatientCreationOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-hospital"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsBookingModalOpen(true)}
            className="border-teal-200 text-teal-600 hover:bg-teal-50 font-medium"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsQuickRegistrationOpen(true)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Quick Registration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <Card className="border-0 shadow-hospital bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-700 text-sm font-medium">Today's Appointments</p>
                <p className="text-2xl font-bold text-teal-800">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-hospital bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-700 text-sm font-medium">Active Patients</p>
                <p className="text-2xl font-bold text-slate-800">
                  {todayAppointments.filter((a) => a.status === "in-progress").length}
                </p>
              </div>
              <Stethoscope className="h-8 w-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-hospital bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-700 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-teal-800">
                  {todayAppointments.filter((a) => a.status === "completed").length}
                </p>
              </div>
              <Check className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-hospital bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-700 text-sm font-medium">Revenue Today</p>
                <p className="text-2xl font-bold text-slate-800">
                  ₹{todayAppointments.reduce((sum, a) => sum + a.fee, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Card */}
      <Card className="border-0 shadow-hospital-lg">
        <CardHeader className="bg-hospital-gray-50 rounded-t-lg pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-hospital-gray-800">Appointments</CardTitle>
                <CardDescription className="font-medium text-hospital-gray-600">
                  View and manage upcoming appointments
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-teal-200 text-teal-600 hover:bg-teal-50 font-medium"
              >
                <Link href="/appointments/list">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Date Selection Tabs */}
        <div className="px-6 py-4 bg-hospital-gray-50/50 border-b">
          <Tabs value={selectedDate} onValueChange={(value) => setSelectedDate(value as "today" | "tomorrow")}>
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger
                value="today"
                className="flex items-center font-medium data-[state=active]:bg-teal-500 data-[state=active]:text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Today ({formatDate(today)})
              </TabsTrigger>
              <TabsTrigger
                value="tomorrow"
                className="flex items-center font-medium data-[state=active]:bg-teal-500 data-[state=active]:text-white"
              >
                <ChevronRight className="mr-2 h-4 w-4" />
                Tomorrow ({formatDate(tomorrow)})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Row */}
        <div className="px-6 py-4 border-b flex flex-wrap gap-3 items-center bg-hospital-gray-50/30">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-hospital-gray-500 mr-2" />
            <span className="text-sm font-semibold mr-3 text-hospital-gray-700">Filters:</span>
          </div>
          <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="h-9 w-[160px] bg-white border-hospital-gray-200 font-medium">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(departmentNames).map(([value, name]) => (
                <SelectItem key={value} value={value} className="font-medium">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
            <SelectTrigger className="h-9 w-[160px] bg-white border-hospital-gray-200 font-medium">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableDoctors(selectedDepartment).map((doctorKey) => (
                <SelectItem key={doctorKey} value={doctorKey} className="font-medium">
                  {doctorNames[doctorKey as keyof typeof doctorNames]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-0">
          {/* Appointments View */}
          <Tabs
            defaultValue="all"
            className="w-full"
            value={appointmentStatusFilter}
            onValueChange={setAppointmentStatusFilter}
          >
            <div className="border-b px-6 pt-3">
              <TabsList className="w-full justify-start bg-hospital-gray-100">
                <TabsTrigger value="all" className="flex-1 sm:flex-none font-medium data-[state=active]:bg-white">
                  All
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="flex-1 sm:flex-none font-medium data-[state=active]:bg-white">
                  Scheduled
                </TabsTrigger>
                <TabsTrigger value="waiting" className="flex-1 sm:flex-none font-medium data-[state=active]:bg-white">
                  Waiting
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="flex-1 sm:flex-none font-medium data-[state=active]:bg-white"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1 sm:flex-none font-medium data-[state=active]:bg-white">
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="space-y-3 p-6">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-hospital-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-hospital-gray-300" />
                  <p className="font-medium">No appointments found for the selected filters</p>
                </div>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-xl border border-hospital-gray-200 p-4 hover:shadow-hospital cursor-pointer transition-all duration-200 bg-white hover:bg-hospital-gray-50"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg text-hospital-gray-800">{appointment.time}</span>
                        <Badge
                          variant="outline"
                          className="bg-hospital-accent-50 text-hospital-accent-700 border-hospital-accent-200 font-medium"
                        >
                          {appointment.token}
                        </Badge>
                        {getStatusBadge(appointment.status)}
                        {appointment.status === "completed" && (
                          <Badge
                            variant="outline"
                            className={
                              appointment.paymentStatus === "paid"
                                ? "bg-hospital-success-50 text-hospital-success-700 border-hospital-success-200 font-medium"
                                : "bg-hospital-error-50 text-hospital-error-700 border-hospital-error-200 font-medium"
                            }
                          >
                            {appointment.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                          </Badge>
                        )}
                      </div>
                      <span className="text-base font-semibold text-hospital-gray-900 mb-1">{appointment.patient}</span>
                      <span className="text-sm text-hospital-gray-600 font-medium">{appointment.department}</span>
                      <span className="text-sm text-hospital-gray-500">{appointment.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end mr-3">
                        <span className="text-sm font-semibold text-hospital-gray-800">{appointment.doctor}</span>
                        {appointment.status === "completed" && appointment.paymentStatus === "paid" && (
                          <span className="text-sm text-hospital-success-600 font-medium">
                            {appointment.paymentMethod?.toUpperCase() || "CASH"} ₹{appointment.fee}
                          </span>
                        )}
                      </div>
                      {appointment.status === "completed" && appointment.paymentStatus === "unpaid" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                className="h-9 px-3 text-sm bg-hospital-success-600 hover:bg-hospital-success-700 text-white font-medium shadow-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAppointmentClick(appointment)
                                }}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay Now
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Collect Payment</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        getActionButtons(appointment)
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-hospital-gray-50/30">
          <div className="text-sm text-hospital-gray-600 font-medium">
            <span>
              {selectedDate === "today" ? "Today's" : "Tomorrow's"} appointments: {filteredAppointments.length}
            </span>
            {selectedDate === "today" && (
              <>
                <span className="mx-2">•</span>
                <span>
                  Pending: {filteredAppointments.filter((a) => a.status.toLowerCase() !== "completed").length}
                </span>
              </>
            )}
          </div>
          {selectedDate === "today" && (
            <div className="flex items-center gap-6 text-sm font-medium">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-hospital-gray-400 mr-2"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-hospital-warning-500 mr-2"></div>
                <span>Waiting</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-hospital-accent-600 mr-2"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-hospital-success-500 mr-2"></div>
                <span>Completed</span>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Appointment Booking Modal */}
      <AppointmentBookingDialog
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          onStatusChange={handleStatusChange}
          onAppointmentUpdate={handleAppointmentUpdate}
        />
      )}

      {/* Quick Registration Modal */}
      <QuickRegistrationDialog
        open={isQuickRegistrationOpen}
        onOpenChange={setIsQuickRegistrationOpen}
        onPatientRegistered={handleQuickPatientRegistered}
      />

      {/* Patient Creation Dialog */}
      <PatientCreationDialog
        open={isPatientCreationOpen}
        onOpenChange={setIsPatientCreationOpen}
        onPatientCreated={handlePatientCreated}
      />
    </div>
  )
}
