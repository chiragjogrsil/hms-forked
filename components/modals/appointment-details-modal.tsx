"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Phone,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  CreditCard,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  UserX,
} from "lucide-react"
import Link from "next/link"

interface AppointmentDetailsModalProps {
  appointment: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (appointmentId: string, newStatus: string) => void
  onAppointmentUpdate: (appointmentId: string, updatedData: any) => void
}

export function AppointmentDetailsModal({
  appointment,
  open,
  onOpenChange,
  onStatusChange,
  onAppointmentUpdate,
}: AppointmentDetailsModalProps) {
  const [notes, setNotes] = useState(appointment?.notes || "")
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const { toast } = useToast()

  if (!appointment) return null

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(appointment.id, newStatus)
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus.replace("-", " ")}`,
    })
  }

  const handleMarkAsPaid = () => {
    onAppointmentUpdate(appointment.id, {
      paymentStatus: "paid",
      paymentMethod: "cash",
    })
    toast({
      title: "Payment Recorded",
      description: "Payment has been marked as received",
    })
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAppointmentUpdate(appointment.id, { notes })
    setIsSavingNotes(false)
    toast({
      title: "Notes Saved",
      description: "Appointment notes have been updated successfully",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "waiting":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Waiting
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Play className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      case "no-show":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            <UserX className="w-3 h-3 mr-1" />
            No Show
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const getActionButtons = () => {
    const { status } = appointment

    switch (status) {
      case "scheduled":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusChange("waiting")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Mark as Waiting
            </Button>
            <Button
              onClick={() => handleStatusChange("cancelled")}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )
      case "waiting":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusChange("in-progress")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
            <Button
              onClick={() => handleStatusChange("no-show")}
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <UserX className="w-4 h-4 mr-2" />
              Mark No Show
            </Button>
          </div>
        )
      case "in-progress":
        return (
          <Button
            onClick={() => handleStatusChange("completed")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Appointment
          </Button>
        )
      case "completed":
        if (appointment.paymentStatus !== "paid") {
          return (
            <Button onClick={handleMarkAsPaid} className="bg-green-600 hover:bg-green-700 text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Mark as Paid
            </Button>
          )
        }
        return null
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Patient Name</p>
                <p className="font-medium">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium">PAT-{appointment.id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Contact Number
                </p>
                <p className="font-medium">{appointment.contactNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Token Number</p>
                <p className="font-medium">{appointment.token || "No Token Assigned"}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href={`/patients/${appointment.id}`} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Patient Details
                </Link>
              </Button>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-600" />
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(appointment.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{appointment.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  Department
                </p>
                <p className="font-medium">{appointment.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Stethoscope className="w-4 h-4 mr-1" />
                  Doctor
                </p>
                <p className="font-medium">{appointment.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{appointment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{appointment.duration} minutes</p>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Status & Actions</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Status</p>
                {getStatusBadge(appointment.status)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">{getActionButtons()}</div>
          </div>

          {/* Payment Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-yellow-600" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Consultation Fee</p>
                <p className="font-bold text-lg">₹{appointment.fee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                {getPaymentStatusBadge(appointment.paymentStatus || "pending")}
              </div>
              {appointment.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">{appointment.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes" className="text-base font-semibold flex items-center mb-3">
              <FileText className="w-5 h-5 mr-2" />
              Appointment Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <Button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
