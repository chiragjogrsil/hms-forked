"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, MapPin, Stethoscope, FileText, Edit3, Save, X } from "lucide-react"
import { toast } from "sonner"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  age: number
  gender: string
  phone: string
  address: string
  appointmentDate: string
  appointmentTime: string
  department: string
  doctorName: string
  appointmentType: string
  status: string
  paymentStatus: string
  consultationFee: number
  chiefComplaint: string
  notes?: string
  priority: string
  createdAt: string
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (appointment: Appointment) => void
}

export function AppointmentDetailsModal({ appointment, isOpen, onClose, onUpdate }: AppointmentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAppointment, setEditedAppointment] = useState<Appointment | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (!appointment) return null

  const handleEdit = () => {
    setEditedAppointment({ ...appointment })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editedAppointment) return

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onUpdate) {
        onUpdate(editedAppointment)
      }

      setIsEditing(false)
      toast.success("Appointment updated successfully")
    } catch (error) {
      toast.error("Failed to update appointment")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedAppointment(null)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status.toLowerCase()) {
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

  const getPriorityColor = (priority: string) => {
    if (!priority) return "bg-gray-100 text-gray-800"

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
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

  const currentAppointment = isEditing ? editedAppointment : appointment

  if (!currentAppointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Appointment Details</DialogTitle>
              <DialogDescription>Appointment ID: {currentAppointment.id}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm">{currentAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient ID</p>
                  <p className="text-sm">{currentAppointment.patientId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Age & Gender</p>
                  <p className="text-sm">
                    {currentAppointment.age} years, {currentAppointment.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <p className="text-sm">{currentAppointment.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <p className="text-sm">{currentAppointment.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <p className="text-sm">{new Date(currentAppointment.appointmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <p className="text-sm">{currentAppointment.appointmentTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Department</p>
                  <div className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-gray-500" />
                    <p className="text-sm">{currentAppointment.department}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Doctor</p>
                  <p className="text-sm">{currentAppointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <p className="text-sm">{currentAppointment.appointmentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Fee</p>
                  <p className="text-sm">₹{currentAppointment.consultationFee}</p>
                </div>
              </div>

              <Separator />

              {/* Status Information */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                  {isEditing ? (
                    <Select
                      value={currentAppointment.status}
                      onValueChange={(value) =>
                        setEditedAppointment((prev) => (prev ? { ...prev, status: value } : null))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(currentAppointment.status)}>
                      {formatStatusText(currentAppointment.status)}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Payment</p>
                  {isEditing ? (
                    <Select
                      value={currentAppointment.paymentStatus}
                      onValueChange={(value) =>
                        setEditedAppointment((prev) => (prev ? { ...prev, paymentStatus: value } : null))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getPaymentStatusColor(currentAppointment.paymentStatus)}>
                      {formatPaymentStatusText(currentAppointment.paymentStatus)}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Priority</p>
                  {isEditing ? (
                    <Select
                      value={currentAppointment.priority}
                      onValueChange={(value) =>
                        setEditedAppointment((prev) => (prev ? { ...prev, priority: value } : null))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getPriorityColor(currentAppointment.priority)}>
                      {formatStatusText(currentAppointment.priority)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chief Complaint */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chief Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{currentAppointment.chiefComplaint}</p>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Appointment Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={currentAppointment.notes || ""}
                    onChange={(e) => setEditedAppointment((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                    placeholder="Add notes about this appointment..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-700">{currentAppointment.notes || "No notes added"}</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500">
                <p>Created: {new Date(currentAppointment.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
