"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Phone,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  CreditCard,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  UserX,
  Hash,
} from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  phone: string
  date: string
  time: string
  department: string
  doctor: string
  type: string
  duration: string
  status: "scheduled" | "waiting" | "in-progress" | "completed" | "cancelled" | "no-show"
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
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
}: AppointmentDetailsModalProps) {
  const [notes, setNotes] = useState(appointment?.notes || "")
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const { toast } = useToast()

  if (!appointment) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", icon: Calendar },
      waiting: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "in-progress": { color: "bg-green-100 text-green-800", icon: PlayCircle },
      completed: { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
      "no-show": { color: "bg-orange-100 text-orange-800", icon: UserX },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || AlertCircle

    return (
      <Badge className={`${config?.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      failed: { color: "bg-red-100 text-red-800", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || AlertCircle

    return (
      <Badge className={`${config?.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getStatusActions = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleStatusChange("waiting")} className="bg-yellow-600 hover:bg-yellow-700">
              <Clock className="h-4 w-4 mr-2" />
              Mark as Waiting
            </Button>
            <Button variant="destructive" onClick={() => handleStatusChange("cancelled")}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )
      case "waiting":
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleStatusChange("in-progress")} className="bg-green-600 hover:bg-green-700">
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
            <Button variant="outline" onClick={() => handleStatusChange("no-show")}>
              <UserX className="h-4 w-4 mr-2" />
              Mark No Show
            </Button>
          </div>
        )
      case "in-progress":
        return (
          <Button onClick={() => handleStatusChange("completed")} className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Appointment
          </Button>
        )
      case "completed":
        return appointment.paymentStatus === "pending" ? (
          <Button onClick={() => handlePaymentStatusChange("paid")} className="bg-green-600 hover:bg-green-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        ) : null
      default:
        return null
    }
  }

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(appointment.id, newStatus)
      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus.replace("-", " ")}`,
      })
    }
  }

  const handlePaymentStatusChange = (newStatus: string) => {
    // In a real app, this would update the payment status
    toast({
      title: "Payment Status Updated",
      description: `Payment marked as ${newStatus}`,
    })
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would save to backend
    appointment.notes = notes

    setIsSavingNotes(false)
    toast({
      title: "Notes Saved",
      description: "Appointment notes have been updated successfully",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Patient Name</p>
                <p className="font-medium">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium">{appointment.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone Number
                </p>
                <p className="font-medium">{appointment.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Hash className="h-4 w-4 mr-1" />
                  Token Number
                </p>
                <p className="font-medium">{appointment.tokenNumber || "No Token Assigned"}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/patients/${appointment.patientId}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Patient Details
                </Button>
              </Link>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-600" />
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  Department
                </p>
                <p className="font-medium">{appointment.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Doctor
                </p>
                <p className="font-medium">Dr. {appointment.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type & Duration</p>
                <p className="font-medium">
                  {appointment.type} ({appointment.duration})
                </p>
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
            <div className="mt-4">{getStatusActions(appointment.status)}</div>
          </div>

          {/* Payment Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-yellow-600" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Consultation Fee</p>
                <p className="font-bold text-lg text-green-600">₹{appointment.consultationFee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                {getPaymentStatusBadge(appointment.paymentStatus)}
              </div>
              {appointment.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{appointment.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Appointment Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this appointment..."
              className="min-h-[100px] mb-3"
            />
            <Button onClick={handleSaveNotes} disabled={isSavingNotes} size="sm">
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
