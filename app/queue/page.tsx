"use client"

import { useState } from "react"
import { CalendarDays, Check, Clock, Filter, IndianRupee, List, MoreHorizontal, Play, Search, User } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentDetailsModal } from "@/components/modals/appointment-details-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PaymentConfirmationDialog } from "@/components/modals/payment-confirmation-dialog"

// Token status types
type TokenStatus = "waiting" | "in-progress" | "completed-paid" | "completed-unpaid"

interface QueueItem {
  id: string
  patientId: string
  patientName: string
  tokenNumber: string
  appointmentTime: Date
  estimatedWaitTime: number
  status: TokenStatus
  doctor: string
  department: string
  contactNumber: string
  email: string
  notes: string
  fee: number
  duration: number
  paymentMethod?: string
  paymentAmount?: string
}

export default function QueueManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [appointmentToComplete, setAppointmentToComplete] = useState<QueueItem | null>(null)
  const [paymentDialogMode, setPaymentDialogMode] = useState<"collect" | "view" | "complete">("complete")

  // Get current date for appointments
  const currentDate = new Date()

  // Sample queue data
  const [queueData, setQueueData] = useState<QueueItem[]>([
    {
      id: "1",
      patientId: "P12345",
      patientName: "Rajesh Kumar",
      tokenNumber: "A001",
      appointmentTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 30),
      estimatedWaitTime: 15,
      status: "waiting",
      doctor: "Dr. Sharma",
      department: "General Medicine",
      contactNumber: "+91 98765 43210",
      email: "rajesh@example.com",
      notes: "",
      fee: 500,
      duration: 30,
    },
    {
      id: "2",
      patientId: "P12346",
      patientName: "Priya Singh",
      tokenNumber: "A002",
      appointmentTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 0),
      estimatedWaitTime: 0,
      status: "in-progress",
      doctor: "Dr. Sharma",
      department: "General Medicine",
      contactNumber: "+91 98765 43211",
      email: "priya@example.com",
      notes: "Follow-up appointment",
      fee: 500,
      duration: 30,
    },
    {
      id: "3",
      patientId: "P12347",
      patientName: "Amit Patel",
      tokenNumber: "A003",
      appointmentTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 30),
      estimatedWaitTime: 30,
      status: "waiting",
      doctor: "Dr. Sharma",
      department: "General Medicine",
      contactNumber: "+91 98765 43212",
      email: "amit@example.com",
      notes: "New patient",
      fee: 700,
      duration: 45,
    },
    {
      id: "4",
      patientId: "P12348",
      patientName: "Sunita Verma",
      tokenNumber: "B001",
      appointmentTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9, 45),
      estimatedWaitTime: 0,
      status: "completed-paid",
      doctor: "Dr. Gupta",
      department: "Orthopedics",
      contactNumber: "+91 98765 43213",
      email: "sunita@example.com",
      notes: "X-ray review",
      fee: 800,
      duration: 30,
      paymentMethod: "cash",
      paymentAmount: "800",
    },
    {
      id: "5",
      patientId: "P12349",
      patientName: "Rahul Sharma",
      tokenNumber: "B002",
      appointmentTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 15),
      estimatedWaitTime: 10,
      status: "waiting",
      doctor: "Dr. Gupta",
      department: "Orthopedics",
      contactNumber: "+91 98765 43214",
      email: "rahul@example.com",
      notes: "",
      fee: 800,
      duration: 30,
    },
    {
      id: "6",
      patientId: "P12350",
      patientName: "Neha Joshi",
      tokenNumber: "C001",
      appointmentTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 11, 0),
      estimatedWaitTime: 45,
      status: "completed-unpaid",
      doctor: "Dr. Patel",
      department: "Dermatology",
      contactNumber: "+91 98765 43215",
      email: "neha@example.com",
      notes: "Skin allergy",
      fee: 900,
      duration: 30,
    },
  ])

  // Filter queue based on search query and selected tab
  const filteredQueue = queueData.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "waiting") return matchesSearch && item.status === "waiting"
    if (selectedTab === "in-progress") return matchesSearch && item.status === "in-progress"
    if (selectedTab === "completed-paid") return matchesSearch && item.status === "completed-paid"
    if (selectedTab === "completed-unpaid") return matchesSearch && item.status === "completed-unpaid"

    return matchesSearch
  })

  const handleAppointmentClick = (appointment: QueueItem) => {
    // Create a properly formatted appointment object for the modal
    const formattedAppointment = {
      ...appointment,
      // Convert appointmentTime to ISO string for consistent handling
      date: appointment.appointmentTime.toISOString(),
      // Keep the original appointmentTime for time formatting
      appointmentTime: appointment.appointmentTime,
      // Map our status to what the modal expects
      status:
        appointment.status === "in-progress"
          ? "in-progress"
          : appointment.status === "completed-paid" || appointment.status === "completed-unpaid"
            ? "completed"
            : "scheduled",
      // Add payment status
      paymentStatus: appointment.status === "completed-paid" ? "paid" : "pending",
    }

    setSelectedAppointment(formattedAppointment)
    setAppointmentDetailsOpen(true)
  }

  const handleAppointmentStatusChange = (appointmentId: string, newStatus: string) => {
    // In a real app, this would update the database
    // For now, we'll update the local state
    setQueueData(
      queueData.map((item) => {
        if (item.id === appointmentId) {
          // Map the status from the modal to our token status
          let tokenStatus: TokenStatus = "waiting"
          if (newStatus === "in-progress") {
            tokenStatus = "in-progress"
          } else if (newStatus === "completed") {
            // Default to unpaid when completing
            tokenStatus = "completed-unpaid"
          }

          return {
            ...item,
            status: tokenStatus,
          }
        }
        return item
      }),
    )

    // Close the modal if it's open
    setAppointmentDetailsOpen(false)
  }

  const handleTokenStatusChange = (appointmentId: string, newStatus: TokenStatus | "complete") => {
    const appointment = queueData.find((item) => item.id === appointmentId)
    if (!appointment) return

    // If the action is to complete the appointment
    if (newStatus === "complete") {
      // Show payment dialog for completion
      setAppointmentToComplete(appointment)
      setPaymentDialogMode("complete")
      setPaymentDialogOpen(true)
      return
    }

    // If viewing payment details for a completed-paid appointment
    if (appointment.status === "completed-paid" && newStatus === "completed-paid") {
      setAppointmentToComplete(appointment)
      setPaymentDialogMode("view")
      setPaymentDialogOpen(true)
      return
    }

    // For other status changes, update directly
    setQueueData(
      queueData.map((item) => {
        if (item.id === appointmentId) {
          return {
            ...item,
            status: newStatus as TokenStatus,
          }
        }
        return item
      }),
    )
  }

  const handleAppointmentUpdate = (appointmentId: string, updatedData: any) => {
    setQueueData(
      queueData.map((item) => {
        if (item.id === appointmentId) {
          return {
            ...item,
            ...updatedData,
            // Update the appointmentTime if date is provided
            appointmentTime: updatedData.date || item.appointmentTime,
          }
        }
        return item
      }),
    )
  }

  const handleCompleteWithPayment = (paid: boolean, paymentMethod?: string, paymentAmount?: string) => {
    if (!appointmentToComplete) return

    // Update the appointment with payment information
    setQueueData(
      queueData.map((item) => {
        if (item.id === appointmentToComplete.id) {
          return {
            ...item,
            status: paid ? "completed-paid" : "completed-unpaid",
            paymentMethod: paid ? paymentMethod : undefined,
            paymentAmount: paid ? paymentAmount : undefined,
          }
        }
        return item
      }),
    )

    // Close the payment dialog
    setPaymentDialogOpen(false)
    setAppointmentToComplete(null)
  }

  const getStatusBadge = (status: TokenStatus) => {
    switch (status) {
      case "waiting":
        return <Badge className="bg-amber-100 text-amber-800">Waiting</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "completed-paid":
        return <Badge className="bg-green-100 text-green-800">Completed & Paid</Badge>
      case "completed-unpaid":
        return <Badge className="bg-red-100 text-red-800">Completed & Unpaid</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get quick actions based on current status
  const getQuickActions = (item: QueueItem) => {
    switch (item.status) {
      case "waiting":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-blue-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTokenStatusChange(item.id, "in-progress")
                }}
              >
                <Play className="h-4 w-4" />
                <span className="sr-only">Start</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start Consultation</p>
            </TooltipContent>
          </Tooltip>
        )
      case "in-progress":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTokenStatusChange(item.id, "complete")
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
        )
      case "completed-unpaid":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTokenStatusChange(item.id, "completed-paid")
                }}
              >
                <IndianRupee className="h-4 w-4" />
                <span className="sr-only">Collect Payment</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Collect Payment</p>
            </TooltipContent>
          </Tooltip>
        )
      case "completed-paid":
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTokenStatusChange(item.id, "completed-paid")
                }}
              >
                <IndianRupee className="h-4 w-4" />
                <span className="sr-only">View Payment</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Payment Details</p>
            </TooltipContent>
          </Tooltip>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Management</h1>
          <p className="text-muted-foreground">Manage patient queue and waiting times</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all-departments">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-departments">All Departments</SelectItem>
              <SelectItem value="general-medicine">General Medicine</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-doctors">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Doctors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-doctors">All Doctors</SelectItem>
              <SelectItem value="dr-sharma">Dr. Sharma</SelectItem>
              <SelectItem value="dr-gupta">Dr. Gupta</SelectItem>
              <SelectItem value="dr-patel">Dr. Patel</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, token or ID..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="waiting">Waiting</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed-paid">Completed & Paid</TabsTrigger>
            <TabsTrigger value="completed-unpaid">Completed & Unpaid</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQueue.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleAppointmentClick(item)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">{item.patientName}</CardTitle>
                  <CardDescription>
                    {item.patientId} • Token: <span className="font-medium">{item.tokenNumber}</span>
                  </CardDescription>
                </div>
                {getStatusBadge(item.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{item.doctor}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{format(item.appointmentTime, "h:mm a, d MMM yyyy")}</span>
                </div>
                {item.status === "waiting" && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Est. wait: {item.estimatedWaitTime} mins</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <IndianRupee className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    Fee: ₹{item.fee}
                    {item.status === "completed-paid" && (
                      <span className="text-green-600 ml-1">(Paid: {item.paymentMethod?.toUpperCase() || "CASH"})</span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-1">
              <TooltipProvider>
                <div className="flex space-x-1">{getQuickActions(item)}</div>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Token Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTokenStatusChange(item.id, "waiting")
                    }}
                    disabled={item.status === "waiting"}
                  >
                    Mark as Waiting
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTokenStatusChange(item.id, "in-progress")
                    }}
                    disabled={item.status === "in-progress"}
                  >
                    Mark as In Progress
                  </DropdownMenuItem>
                  {/* Simplified completion option */}
                  {(item.status === "waiting" || item.status === "in-progress") && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTokenStatusChange(item.id, "complete")
                      }}
                    >
                      Complete Appointment
                    </DropdownMenuItem>
                  )}
                  {/* View payment details for completed-paid appointments */}
                  {item.status === "completed-paid" && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTokenStatusChange(item.id, "completed-paid")
                      }}
                    >
                      View Payment Details
                    </DropdownMenuItem>
                  )}
                  {/* Collect payment for completed-unpaid appointments */}
                  {item.status === "completed-unpaid" && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTokenStatusChange(item.id, "completed-paid")
                      }}
                    >
                      Collect Payment
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredQueue.length === 0 && (
        <div className="text-center py-10">
          <List className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No patients in queue</h3>
          <p className="text-muted-foreground">There are no patients matching your filters in the queue.</p>
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          open={appointmentDetailsOpen}
          onOpenChange={setAppointmentDetailsOpen}
          appointment={selectedAppointment}
          onStatusChange={handleAppointmentStatusChange}
          onAppointmentUpdate={handleAppointmentUpdate}
        />
      )}

      {appointmentToComplete && (
        <PaymentConfirmationDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          appointment={appointmentToComplete}
          onComplete={handleCompleteWithPayment}
          mode={paymentDialogMode}
        />
      )}
    </div>
  )
}
