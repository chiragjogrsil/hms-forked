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
  Calendar,
  Clock,
  User,
  Phone,
  CreditCard,
  FileText,
  UserCheck,
  Building2,
  Stethoscope,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock3,
  PlayCircle,
  UserX,
  DollarSign,
} from "lucide-react"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  date: string
  time: string
  department: string
  doctorName: string
  type: string
  status: "scheduled" | "waiting" | "in-progress" | "completed" | "cancelled" | "no-show"
  duration: string
  consultationFee: number
  paymentStatus: "paid" | "pending" | "failed"
  paymentMethod?: string
  tokenNumber?: string
  notes?: string
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (appointmentId: string, newStatus: string) => void
  onPaymentStatusChange?: (appointmentId: string, newStatus: string) => void
}

const statusConfig = {
  scheduled: { color: "bg-blue-100 text-blue-800", icon: Calendar },
  waiting: { color: "bg-yellow-100 text-yellow-800", icon: Clock3 },
  "in-progress": { color: "bg-green-100 text-green-800", icon: PlayCircle },
  completed: { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
  "no-show": { color: "bg-orange-100 text-orange-800", icon: UserX },
}

const paymentStatusConfig = {
  paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  failed: { color: "bg-red-100 text-red-800", icon: XCircle },
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  onPaymentStatusChange,
}: AppointmentDetailsModalProps) {
  const [notes, setNotes] = useState(appointment?.notes || "")
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false)
  const { toast } = useToast()

  if (!appointment) return null

  const StatusIcon = statusConfig[appointment.status]?.icon || Calendar
  const PaymentIcon = paymentStatusConfig[appointment.paymentStatus]?.icon || Clock

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(appointment.id, newStatus)
    toast({
      title: "Status Updated",
      description: `Appointment status changed to ${newStatus.replace("-", " ")}`,
    })
  }

  const handlePaymentStatusChange = (newStatus: string) => {
    onPaymentStatusChange?.(appointment.id, newStatus)
    toast({
      title: "Payment Status Updated",
      description: `Payment status changed to ${newStatus}`,
    })
  }

  const handleSaveNotes = async () => {
    setIsUpdatingNotes(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdatingNotes(false)
    toast({
      title: "Notes Saved",
      description: "Appointment notes have been updated successfully.",
    })
  }

  const getStatusActions = () => {
    switch (appointment.status) {
      case "scheduled":
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleStatusChange("waiting")}>
              <Clock3 className="h-4 w-4 mr-1" />
              Mark as Waiting
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleStatusChange("cancelled")}>
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )
      case "waiting":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleStatusChange("in-progress")}>
              <PlayCircle className="h-4 w-4 mr-1" />
              Start Consultation
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleStatusChange("no-show")}>
              <UserX className="h-4 w-4 mr-1" />
              Mark No Show
            </Button>
          </div>
        )
      case "in-progress":
        return (
          <Button size="sm" onClick={() => handleStatusChange("completed")}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete Appointment
          </Button>
        )
      case "completed":
        return appointment.paymentStatus === "pending" ? (
          <Button size="sm" variant="outline" onClick={() => handlePaymentStatusChange("paid")}>
            <DollarSign className="h-4 w-4 mr-1" />
            Mark as Paid
          </Button>
        ) : null
      default:
        return null
    }
  }

  const openPatientDetails = () => {
    window.open(`/patients/${appointment.patientId}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{appointment.patientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{appointment.patientPhone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {appointment.tokenNumber ? `Token: ${appointment.tokenNumber}` : "No Token Assigned"}
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={openPatientDetails} className="w-full bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Patient Details
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Date & Time</span>
                </div>
                <div className="pl-6 text-sm text-gray-600">
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="pl-6 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{appointment.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Department</span>
                </div>
                <div className="pl-6 text-sm text-gray-600">{appointment.department}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Doctor</span>
                </div>
                <div className="pl-6 text-sm text-gray-600">{appointment.doctorName}</div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Type & Duration</span>
                </div>
                <div className="pl-6 text-sm text-gray-600">
                  {appointment.type} • {appointment.duration}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status and Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Status & Actions
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <Badge className={statusConfig[appointment.status]?.color}>
                  {appointment.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
              {getStatusActions()}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Consultation Fee</span>
                  <span className="text-lg font-bold">₹{appointment.consultationFee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PaymentIcon className="h-4 w-4" />
                  <Badge className={paymentStatusConfig[appointment.paymentStatus]?.color}>
                    {appointment.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {appointment.paymentMethod && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Method</span>
                    <span className="text-sm font-medium">{appointment.paymentMethod}</span>
                  </div>
                )}
                {appointment.status === "completed" && appointment.paymentStatus === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePaymentStatusChange("paid")}
                    className="w-full"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Appointment Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this appointment..."
              className="min-h-[100px]"
            />
            <Button onClick={handleSaveNotes} disabled={isUpdatingNotes || notes === appointment.notes} size="sm">
              {isUpdatingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
