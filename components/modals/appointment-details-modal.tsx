"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Phone,
  Calendar,
  Clock,
  Building,
  Stethoscope,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Play,
  UserX,
  X,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

interface AppointmentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
    id: string
    patientName: string
    patientId: string
    phone: string
    date: string
    time: string
    department: string
    doctorName: string
    type: string
    duration: string
    status: "scheduled" | "waiting" | "in-progress" | "completed" | "cancelled" | "no-show"
    consultationFee: number
    paymentStatus: "paid" | "pending" | "failed"
    paymentMethod?: string
    tokenNumber?: string
    notes?: string
  }
  onStatusChange?: (appointmentId: string, newStatus: string) => void
  onNotesUpdate?: (appointmentId: string, notes: string) => void
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onStatusChange,
  onNotesUpdate,
}: AppointmentDetailsModalProps) {
  const [notes, setNotes] = useState(appointment.notes || "")
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "waiting":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Play className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      case "no-show":
        return <UserX className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status) {
      case "scheduled":
        return "bg-gray-100 text-gray-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatusText = (status: string) => {
    if (!status) return "Unknown"
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")
  }

  const formatPaymentStatusText = (status: string) => {
    if (!status) return "Unknown"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(appointment.id, newStatus)
      toast.success(`Appointment status updated to ${newStatus}`)
    }
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (onNotesUpdate) {
        onNotesUpdate(appointment.id, notes)
      }

      toast.success("Notes saved successfully")
    } catch (error) {
      toast.error("Failed to save notes")
    } finally {
      setIsSavingNotes(false)
    }
  }

  const handleViewPatientDetails = () => {
    // Open patient details in new tab
    window.open(`/patients/${appointment.patientId}`, "_blank")
  }

  const getStatusActions = () => {
    switch (appointment.status) {
      case "scheduled":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleStatusChange("waiting")}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Mark as Waiting
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleStatusChange("cancelled")}>
              Cancel
            </Button>
          </div>
        )
      case "waiting":
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleStatusChange("in-progress")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Consultation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange("no-show")}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Mark No Show
            </Button>
          </div>
        )
      case "in-progress":
        return (
          <Button size="sm" onClick={() => handleStatusChange("completed")} className="bg-green-600 hover:bg-green-700">
            Complete Appointment
          </Button>
        )
      case "completed":
        return appointment.paymentStatus === "pending" ? (
          <Button
            size="sm"
            onClick={() => toast.success("Payment marked as paid")}
            className="bg-green-600 hover:bg-green-700"
          >
            Mark as Paid
          </Button>
        ) : null
      default:
        return null
    }
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">Name</p>
                <p className="font-medium text-blue-900">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Patient ID</p>
                <p className="font-medium text-blue-900">{appointment.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </p>
                <p className="font-medium text-blue-900">{appointment.phone}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Token Number</p>
                <p className="font-medium text-blue-900">{appointment.tokenNumber || "No Token Assigned"}</p>
              </div>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewPatientDetails}
                className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Patient Details
              </Button>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{appointment.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  Department
                </p>
                <p className="font-medium">{appointment.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  Doctor
                </p>
                <p className="font-medium">{appointment.doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{appointment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{appointment.duration}</p>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">Status & Actions</h3>
              <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                {getStatusIcon(appointment.status)}
                {formatStatusText(appointment.status)}
              </Badge>
            </div>
            <div className="flex justify-end">{getStatusActions()}</div>
          </div>

          {/* Payment Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-yellow-700">Consultation Fee</p>
                <p className="font-bold text-lg text-yellow-900">₹{appointment.consultationFee}</p>
              </div>
              <div>
                <p className="text-sm text-yellow-700">Payment Status</p>
                <Badge className={`${getPaymentStatusColor(appointment.paymentStatus)} mt-1`}>
                  {formatPaymentStatusText(appointment.paymentStatus)}
                </Badge>
              </div>
              {appointment.paymentMethod && (
                <div className="col-span-2">
                  <p className="text-sm text-yellow-700">Payment Method</p>
                  <p className="font-medium text-yellow-900">{appointment.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              Appointment Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this appointment..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={handleSaveNotes} disabled={isSavingNotes || notes === appointment.notes}>
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
