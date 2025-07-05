"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter, Plus, Search } from "lucide-react"
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"
import { AppointmentDetailsModal } from "@/components/modals/appointment-details-modal"

// Sample data for appointments
const initialAppointments = [
  {
    id: "1",
    patientName: "Rajesh Kumar",
    patientId: "P12345",
    date: "2025-05-21",
    time: "10:00 AM",
    department: "General Medicine",
    doctor: "Dr. Sharma",
    duration: 30,
    fee: 500,
    status: "scheduled",
    contactNumber: "+91 98765 43210",
    notes: "Follow-up appointment for fever",
  },
  {
    id: "2",
    patientName: "Priya Singh",
    patientId: "P12346",
    date: "2025-05-21",
    time: "11:00 AM",
    department: "Cardiology",
    doctor: "Dr. Patel",
    duration: 45,
    fee: 800,
    status: "in-progress",
    contactNumber: "+91 98765 43211",
    notes: "Routine heart checkup",
  },
  {
    id: "3",
    patientName: "Amit Verma",
    patientId: "P12347",
    date: "2025-05-21",
    time: "2:00 PM",
    department: "Orthopedics",
    doctor: "Dr. Gupta",
    duration: 30,
    fee: 700,
    status: "completed",
    contactNumber: "+91 98765 43212",
    notes: "Post-surgery follow-up",
  },
  {
    id: "4",
    patientName: "Sunita Devi",
    patientId: "P12348",
    date: "2025-05-22",
    time: "9:30 AM",
    department: "Gynecology",
    doctor: "Dr. Reddy",
    duration: 30,
    fee: 600,
    status: "scheduled",
    contactNumber: "+91 98765 43213",
    notes: "Prenatal checkup",
  },
  {
    id: "5",
    patientName: "Rahul Sharma",
    patientId: "P12349",
    date: "2025-05-22",
    time: "3:00 PM",
    department: "Dermatology",
    doctor: "Dr. Khan",
    duration: 20,
    fee: 500,
    status: "scheduled",
    contactNumber: "+91 98765 43214",
    notes: "Skin allergy consultation",
  },
  {
    id: "6",
    patientName: "Meena Kumari",
    patientId: "P12350",
    date: "2025-05-22",
    time: "4:30 PM",
    department: "ENT",
    doctor: "Dr. Joshi",
    duration: 30,
    fee: 550,
    status: "cancelled",
    contactNumber: "+91 98765 43215",
    notes: "Ear infection follow-up",
  },
  {
    id: "7",
    patientName: "Vikram Singh",
    patientId: "P12351",
    date: "2025-05-23",
    time: "10:30 AM",
    department: "Neurology",
    doctor: "Dr. Mehta",
    duration: 45,
    fee: 900,
    status: "scheduled",
    contactNumber: "+91 98765 43216",
    notes: "Headache evaluation",
  },
  {
    id: "8",
    patientName: "Ananya Patel",
    patientId: "P12352",
    date: "2025-05-23",
    time: "1:00 PM",
    department: "Ophthalmology",
    doctor: "Dr. Sharma",
    duration: 30,
    fee: 600,
    status: "scheduled",
    contactNumber: "+91 98765 43217",
    notes: "Annual eye checkup",
  },
]

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list")
  const [date, setDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState(initialAppointments)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
      ),
    )
  }

  const handleAppointmentUpdate = (appointmentId: string, updatedData: any) => {
    setAppointments(
      appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return {
            ...appointment,
            ...updatedData,
            // Format the date as string if it's a Date object
            date: updatedData.date ? format(updatedData.date, "yyyy-MM-dd") : appointment.date,
          }
        }
        return appointment
      }),
    )
  }

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDetailsModalOpen(true)
  }

  const filteredAppointments = appointments.filter((appointment) => {
    // Filter appointments for the selected date in list view
    if (view === "list") {
      return appointment.date === format(date, "yyyy-MM-dd")
    }
    return true
  })

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date, { weekStartsOn: 1 }), i))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            Scheduled
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Appointments & Queue</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setView("list")}
            >
              List
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setView("calendar")}
            >
              Calendar
            </Button>
          </div>
          <Button onClick={() => setIsBookingOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>
      <div className="flex-1 p-6">
        <Tabs defaultValue="all" className="h-full space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="specialist">Specialist</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search appointments..." className="w-[250px] pl-8" />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filter by</h4>
                    <div className="flex flex-col space-y-1 pt-2">
                      <Label htmlFor="status">Status</Label>
                      <select id="status" className="rounded-md border p-2">
                        <option value="all">All</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1 pt-2">
                      <Label htmlFor="department">Department</Label>
                      <select id="department" className="rounded-md border p-2">
                        <option value="all">All</option>
                        <option value="general-medicine">General Medicine</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="orthopedics">Orthopedics</option>
                        <option value="gynecology">Gynecology</option>
                        <option value="dermatology">Dermatology</option>
                      </select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <TabsContent value="all" className="h-full space-y-6">
            {view === "list" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Appointments for {format(date, "MMMM d, yyyy")}</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {filteredAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">No appointments for this day</h3>
                        <p className="text-sm text-muted-foreground">
                          There are no appointments scheduled for {format(date, "MMMM d, yyyy")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredAppointments.map((appointment) => (
                      <Card
                        key={appointment.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          appointment.status === "cancelled" && "opacity-60",
                        )}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">{appointment.patientName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.time} • {appointment.department} • {appointment.doctor}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">{getStatusBadge(appointment.status)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Week of {format(weekDays[0], "MMMM d, yyyy")}</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDate(subWeeks(date, 1))}>
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDate(addWeeks(date, 1))}>
                      Next Week
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4">
                  {weekDays.map((day) => (
                    <Card key={day.toString()} className="overflow-hidden">
                      <CardHeader className="p-3 bg-muted/50">
                        <CardTitle className="text-sm font-medium">{format(day, "EEE")}</CardTitle>
                        <CardDescription className="text-xs">{format(day, "MMM d")}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-2 h-[300px] overflow-y-auto">
                        <div className="space-y-2">
                          {appointments
                            .filter((appointment) => appointment.date === format(day, "yyyy-MM-dd"))
                            .map((appointment) => (
                              <div
                                key={appointment.id}
                                className={cn(
                                  "p-2 rounded-md text-xs cursor-pointer hover:bg-muted",
                                  appointment.status === "scheduled" && "bg-blue-50 border border-blue-200",
                                  appointment.status === "in-progress" && "bg-yellow-50 border border-yellow-200",
                                  appointment.status === "completed" && "bg-green-50 border border-green-200",
                                  appointment.status === "cancelled" && "bg-red-50 border border-red-200 opacity-60",
                                )}
                                onClick={() => handleAppointmentClick(appointment)}
                              >
                                <div className="font-medium">{appointment.time}</div>
                                <div>{appointment.patientName}</div>
                                <div className="text-muted-foreground">{appointment.department}</div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="general" className="h-full">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">General Appointments</h3>
                <p className="text-sm text-muted-foreground">
                  Filter implementation for general appointments would go here
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="specialist" className="h-full">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Specialist Appointments</h3>
                <p className="text-sm text-muted-foreground">
                  Filter implementation for specialist appointments would go here
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="emergency" className="h-full">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium">Emergency Appointments</h3>
                <p className="text-sm text-muted-foreground">
                  Filter implementation for emergency appointments would go here
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AppointmentBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        onAppointmentCreated={(newAppointment) => {
          setAppointments([...appointments, newAppointment])
        }}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onStatusChange={handleStatusChange}
        onAppointmentUpdate={handleAppointmentUpdate}
      />
    </div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
