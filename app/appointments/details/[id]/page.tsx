"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Stethoscope, CreditCard, Phone } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Mock appointment data - in a real app, this would come from an API
const mockAppointmentDetails = {
  id: "app-123",
  patientName: "John Doe",
  patientId: "P12345",
  doctor: "Dr. Smith",
  department: "General OPD",
  date: "2024-12-21",
  time: "10:00 AM",
  type: "Consultation",
  status: "scheduled",
  fee: 1500,
  paymentStatus: "pending",
  contactNumber: "+91 9876543210",
  token: "Token #45",
  notes: "Regular checkup appointment",
  address: "123 Main Street, City",
  appointmentType: "general",
}

export default function AppointmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const appointmentId = params.id as string

  // In a real app, you would fetch the appointment details using the ID
  const appointment = mockAppointmentDetails

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheduled
          </Badge>
        )
      case "waiting":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Waiting
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentBadge = (paymentStatus: string) => {
    return paymentStatus === "paid" ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Paid
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        Pending
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Appointment Details</h1>
          <p className="text-muted-foreground">View and manage appointment information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Appointment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Information
            </CardTitle>
            <CardDescription>Basic appointment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Appointment ID:</span>
              <span className="text-muted-foreground">{appointment.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Token:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {appointment.token}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Date:</span>
              <span className="text-muted-foreground">{appointment.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Time:</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-muted-foreground">{appointment.time}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Type:</span>
              <span className="text-muted-foreground">{appointment.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {getStatusBadge(appointment.status)}
            </div>
          </CardContent>
        </Card>

        {/* Patient & Doctor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient & Doctor
            </CardTitle>
            <CardDescription>Patient and healthcare provider information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-medium">Patient:</span>
              <div className="mt-1">
                <div className="font-medium">{appointment.patientName}</div>
                <div className="text-sm text-muted-foreground">ID: {appointment.patientId}</div>
              </div>
            </div>
            <Separator />
            <div>
              <span className="font-medium">Doctor:</span>
              <div className="mt-1 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span>{appointment.doctor}</span>
              </div>
            </div>
            <div>
              <span className="font-medium">Department:</span>
              <div className="mt-1 text-muted-foreground">{appointment.department}</div>
            </div>
            <div>
              <span className="font-medium">Contact:</span>
              <div className="mt-1 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-muted-foreground">{appointment.contactNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>Billing and payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Consultation Fee:</span>
              <span className="font-bold">₹{appointment.fee}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Payment Status:</span>
              {getPaymentBadge(appointment.paymentStatus)}
            </div>
            {appointment.paymentStatus === "pending" && (
              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Notes and other details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.notes && (
              <div>
                <span className="font-medium">Notes:</span>
                <div className="mt-1 text-muted-foreground">{appointment.notes}</div>
              </div>
            )}
            <div>
              <span className="font-medium">Appointment Type:</span>
              <div className="mt-1 text-muted-foreground capitalize">{appointment.appointmentType}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={() => router.push("/appointments/list")}>
          View All Appointments
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Dashboard
        </Button>
        {appointment.status === "scheduled" && <Button>Edit Appointment</Button>}
      </div>
    </div>
  )
}
