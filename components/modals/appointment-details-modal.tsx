"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Edit3,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AppointmentDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: any
  onAppointmentUpdate?: (appointment: any) => void
}

export function AppointmentDetailsModal({
  open,
  onOpenChange,
  appointment,
  onAppointmentUpdate,
}: AppointmentDetailsModalProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState(appointment?.status || "scheduled")
  const [paymentStatus, setPaymentStatus] = useState(appointment?.paymentStatus || "pending")
  const [notes, setNotes] = useState(appointment?.notes || "")

  if (!appointment) return null

  // Generate a patient ID from the appointment data
  const getPatientId = () => {
    // In a real app, this would come from the appointment data
    // For demo purposes, we'll generate a consistent ID based on patient name
    const patientName = appointment.patientName || appointment.patient
    return (
      patientName.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Math.abs(
        patientName.split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0)
          return a & a
        }, 0),
      )
        .toString()
        .slice(0, 4)
    )
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedAppointment = {
        ...appointment,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }

      setStatus(newStatus)

      if (onAppointmentUpdate) {
        onAppointmentUpdate(updatedAppointment)
      }

      toast({
        title: "Status updated",
        description: `Appointment status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentUpdate = async (newPaymentStatus: string) => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedAppointment = {
        ...appointment,
        paymentStatus: newPaymentStatus,
        updatedAt: new Date().toISOString(),
      }

      setPaymentStatus(newPaymentStatus)

      if (onAppointmentUpdate) {
        onAppointmentUpdate(updatedAppointment)
      }

      toast({
        title: "Payment status updated",
        description: `Payment status changed to ${newPaymentStatus}`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            Appointment Details
          </DialogTitle>
          <DialogDescription>View and manage appointment information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-teal-600" />
                Patient Information
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="ml-auto border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Link href={`/patients/${getPatientId()}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Patient Details
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Patient Name</Label>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Patient ID</Label>
                  <p className="font-medium">{appointment.patientId || getPatientId()}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contact Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p>{appointment.contactNumber}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Token Number</Label>
                  <Badge variant="outline" className="w-fit">
                    {appointment.token || "No Token"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-teal-600" />
                Appointment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p>{format(new Date(appointment.date), "PPP")}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p>{appointment.time}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Department</Label>
                  <p className="font-medium">{appointment.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Doctor</Label>
                  <p className="font-medium">{appointment.doctor}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Type</Label>
                  <p>{appointment.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Duration</Label>
                  <p>{appointment.duration || 30} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Edit3 className="h-5 w-5 text-teal-600" />
                Status Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Appointment Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                    <Select value={status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Payment Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPaymentStatusColor(paymentStatus)}>
                      {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                    </Badge>
                    <Select value={paymentStatus} onValueChange={handlePaymentUpdate} disabled={isUpdating}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-teal-600" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Consultation Fee</Label>
                  <p className="text-2xl font-bold text-teal-600">₹{appointment.fee || 500}</p>
                </div>
                <div className="text-right">
                  <Label className="text-sm font-medium text-gray-500">Payment Method</Label>
                  <p>{appointment.paymentMethod || "Not specified"}</p>
                </div>
              </div>
              {paymentStatus === "paid" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Payment completed successfully</span>
                </div>
              )}
              {paymentStatus === "failed" && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">Payment failed - please retry</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-teal-600" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this appointment..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {status === "scheduled" && (
              <Button
                onClick={() => handleStatusUpdate("in-progress")}
                disabled={isUpdating}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Start Consultation
              </Button>
            )}
            {status === "in-progress" && (
              <Button
                onClick={() => handleStatusUpdate("completed")}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Appointment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
