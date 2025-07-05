"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Calendar, Clock, Download, Eye, AlertTriangle, FileText, Plus } from "lucide-react"
import { BookAppointmentModal } from "@/components/modals/book-appointment-modal"
import { PrescribeRadiologyModal } from "@/components/modals/prescribe-radiology-modal"

// Mock prescribed radiology data
const mockPrescribedRadiology = [
  {
    id: "prescribed-rad-001",
    serviceId: "mri-knee",
    serviceName: "MRI Knee",
    prescribedBy: "Dr. Sharma",
    prescribedDate: "2024-06-20",
    visitId: "visit-001",
    status: "pending",
    priority: "routine",
    notes: "Assess knee joint damage and cartilage condition",
    indication: "Knee pain and suspected meniscus tear",
  },
  {
    id: "prescribed-rad-002",
    serviceId: "xray-chest",
    serviceName: "X-Ray Chest",
    prescribedBy: "Dr. Patel",
    prescribedDate: "2024-06-18",
    visitId: "visit-002",
    status: "pending",
    priority: "urgent",
    notes: "Rule out pneumonia",
    indication: "Persistent cough and fever",
  },
  {
    id: "prescribed-rad-003",
    serviceId: "ultrasound-abdomen",
    serviceName: "Ultrasound Abdomen",
    prescribedBy: "Dr. Kumar",
    prescribedDate: "2024-06-15",
    visitId: "visit-003",
    status: "scheduled",
    priority: "routine",
    scheduledDate: "2024-06-25",
    notes: "Abdominal pain evaluation",
    indication: "Right upper quadrant pain",
  },
]

// Mock completed radiology data
const mockCompletedRadiology = [
  {
    id: "completed-rad-001",
    serviceId: "ct-head",
    serviceName: "CT Scan Head",
    completedDate: "2024-06-10",
    prescribedBy: "Dr. Neurologist",
    status: "completed",
    result: "Normal",
    reportAvailable: true,
    reportUrl: "/reports/ct-head-001.pdf",
    findings: "No acute intracranial abnormality. Normal brain parenchyma.",
    radiologist: "Dr. Radiology Specialist",
  },
  {
    id: "completed-rad-002",
    serviceId: "xray-spine",
    serviceName: "X-Ray Lumbar Spine",
    completedDate: "2024-06-05",
    prescribedBy: "Dr. Orthopedic",
    status: "completed",
    result: "Abnormal",
    reportAvailable: true,
    reportUrl: "/reports/xray-spine-002.pdf",
    findings: "Mild degenerative changes at L4-L5. No acute fracture.",
    radiologist: "Dr. Radiology Specialist",
    flagged: true,
  },
  {
    id: "completed-rad-003",
    serviceId: "ultrasound-thyroid",
    serviceName: "Ultrasound Thyroid",
    completedDate: "2024-05-28",
    prescribedBy: "Dr. Endocrinologist",
    status: "completed",
    result: "Normal",
    reportAvailable: true,
    reportUrl: "/reports/us-thyroid-003.pdf",
    findings: "Normal thyroid gland size and echogenicity. No nodules detected.",
    radiologist: "Dr. Radiology Specialist",
  },
]

interface RadiologySectionProps {
  patientId?: string
  patientName?: string
}

export function RadiologySection({ patientId, patientName }: RadiologySectionProps) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showPrescribeModal, setShowPrescribeModal] = useState(false)
  const [selectedPrescribedService, setSelectedPrescribedService] = useState<
    (typeof mockPrescribedRadiology)[0] | null
  >(null)

  const getStatusBadge = (status: string, priority?: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            className={`${priority === "urgent" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"} hover:bg-current`}
          >
            {priority === "urgent" ? "Urgent" : "Pending"}
          </Badge>
        )
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getResultBadge = (result: string, flagged?: boolean) => {
    if (flagged) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Abnormal</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
  }

  const handleBookAppointment = (service: (typeof mockPrescribedRadiology)[0]) => {
    setSelectedPrescribedService(service)
    setShowAppointmentModal(true)
  }

  const handleAppointmentBooked = () => {
    setShowAppointmentModal(false)
    setSelectedPrescribedService(null)
  }

  const handlePrescribeRadiology = () => {
    setShowPrescribeModal(true)
  }

  const handleRadiologyPrescribed = () => {
    setShowPrescribeModal(false)
    // In a real app, this would refresh the prescribed radiology list
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Radiology Services</h3>
          <p className="text-sm text-muted-foreground">Manage imaging services and view reports</p>
        </div>
        <Button onClick={handlePrescribeRadiology} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Prescribe Radiology
        </Button>
      </div>

      {/* Prescribed Imaging */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Prescribed Imaging</CardTitle>
                <CardDescription>Radiology services prescribed by doctors that need to be completed</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              {mockPrescribedRadiology.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mockPrescribedRadiology.length > 0 ? (
            <div className="space-y-4">
              {mockPrescribedRadiology.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{service.serviceName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Prescribed: {new Date(service.prescribedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>By: {service.prescribedBy}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Indication:</strong> {service.indication}
                        </p>
                        {service.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Notes:</strong> {service.notes}
                          </p>
                        )}
                        {service.scheduledDate && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>Scheduled: {new Date(service.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(service.status, service.priority)}
                      <Button size="sm" onClick={() => handleBookAppointment(service)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No prescribed imaging services pending</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Imaging Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Recent Imaging Results</CardTitle>
                <CardDescription>Completed radiology services with reports</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              {mockCompletedRadiology.length} completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mockCompletedRadiology.length > 0 ? (
            <div className="space-y-4">
              {mockCompletedRadiology.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{service.serviceName}</h4>
                          {getResultBadge(service.result, service.flagged)}
                          {service.flagged && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Completed: {new Date(service.completedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>By: {service.prescribedBy}</span>
                          <span>•</span>
                          <span>Radiologist: {service.radiologist}</span>
                        </div>
                        {service.findings && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium mb-1">Findings:</div>
                            <p className={service.flagged ? "text-red-700" : "text-gray-700"}>{service.findings}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {service.reportAvailable && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed imaging services yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Booking Modal */}
      <BookAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSuccess={handleAppointmentBooked}
        prefilledData={{
          appointmentType: "Radiology Service",
          serviceDetails: selectedPrescribedService
            ? {
                name: selectedPrescribedService.serviceName,
                notes: selectedPrescribedService.notes,
                prescribedBy: selectedPrescribedService.prescribedBy,
                priority: selectedPrescribedService.priority,
                indication: selectedPrescribedService.indication,
              }
            : undefined,
        }}
      />

      {/* Prescribe Radiology Modal */}
      <PrescribeRadiologyModal
        isOpen={showPrescribeModal}
        onClose={() => setShowPrescribeModal(false)}
        onSuccess={handleRadiologyPrescribed}
        patientId={patientId || ""}
        patientName={patientName || ""}
      />
    </div>
  )
}
