"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Calendar, Clock, AlertTriangle, Plus } from "lucide-react"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"
import { AddProceduresModal } from "@/components/modals/add-procedures-modal"

// Mock prescribed procedures data
const mockPrescribedProcedures = [
  {
    id: "prescribed-proc-001",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    department: "Orthopedics",
    prescribedBy: "Dr. Anderson",
    prescribedDate: "2024-06-20",
    visitId: "visit-001",
    status: "pending",
    priority: "routine",
    notes: "Post-surgery rehabilitation for left shoulder. Focus on range of motion and strength building.",
    indication: "Left shoulder surgery recovery",
    sessions: 10,
    estimatedDuration: "3 weeks",
  },
  {
    id: "prescribed-proc-002",
    procedureId: "cardio-stress-test",
    procedureName: "Cardiac Stress Test",
    department: "Cardiology",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-06-18",
    visitId: "visit-002",
    status: "pending",
    priority: "urgent",
    notes: "Evaluate cardiac function due to chest pain episodes",
    indication: "Chest pain and shortness of breath",
    sessions: 1,
    estimatedDuration: "1 day",
  },
  {
    id: "prescribed-proc-003",
    procedureId: "derm-phototherapy",
    procedureName: "Phototherapy Treatment",
    department: "Dermatology",
    prescribedBy: "Dr. Clark",
    prescribedDate: "2024-06-15",
    visitId: "visit-003",
    status: "scheduled",
    priority: "routine",
    scheduledDate: "2024-06-25",
    notes: "UV light therapy for psoriasis treatment",
    indication: "Chronic psoriasis on arms and legs",
    sessions: 8,
    estimatedDuration: "4 weeks",
  },
  {
    id: "prescribed-proc-004",
    procedureId: "panchkarma-basic",
    procedureName: "Basic Panchkarma Package",
    department: "Ayurveda",
    prescribedBy: "Dr. Ayurveda Specialist",
    prescribedDate: "2024-06-12",
    visitId: "visit-004",
    status: "pending",
    priority: "routine",
    notes: "Detoxification and rejuvenation therapy for chronic fatigue",
    indication: "Chronic fatigue and digestive issues",
    sessions: 7,
    estimatedDuration: "2 weeks",
  },
  {
    id: "prescribed-proc-005",
    procedureId: "neuro-eeg",
    procedureName: "Electroencephalogram (EEG)",
    department: "Neurology",
    prescribedBy: "Dr. Thompson",
    prescribedDate: "2024-06-10",
    visitId: "visit-005",
    status: "pending",
    priority: "urgent",
    notes: "Investigate seizure-like episodes",
    indication: "Suspected seizure activity",
    sessions: 1,
    estimatedDuration: "1 day",
  },
]

interface ProceduresSectionProps {
  patientId?: string
  patientName?: string
}

export function ProceduresSection({ patientId, patientName }: ProceduresSectionProps) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showAddProceduresModal, setShowAddProceduresModal] = useState(false)
  const [selectedPrescribedProcedure, setSelectedPrescribedProcedure] = useState<
    (typeof mockPrescribedProcedures)[0] | null
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

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Orthopedics: "bg-blue-100 text-blue-800 border-blue-200",
      Cardiology: "bg-red-100 text-red-800 border-red-200",
      Dermatology: "bg-purple-100 text-purple-800 border-purple-200",
      Ayurveda: "bg-green-100 text-green-800 border-green-200",
      Neurology: "bg-indigo-100 text-indigo-800 border-indigo-200",
      "General Medicine": "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[department] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleBookAppointment = (procedure: (typeof mockPrescribedProcedures)[0]) => {
    setSelectedPrescribedProcedure(procedure)
    setShowAppointmentModal(true)
  }

  const handleAppointmentBooked = () => {
    setShowAppointmentModal(false)
    setSelectedPrescribedProcedure(null)
  }

  const handleAddProcedures = () => {
    setShowAddProceduresModal(true)
  }

  const handleProceduresAdded = () => {
    setShowAddProceduresModal(false)
    // In a real app, this would refresh the prescribed procedures list
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Medical Procedures & Treatments</h3>
          <p className="text-sm text-muted-foreground">Manage prescribed procedures and view completed treatments</p>
        </div>
        <Button onClick={handleAddProcedures} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Procedures
        </Button>
      </div>

      {/* Prescribed Procedures */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Prescribed Procedures</CardTitle>
                <CardDescription>Procedures prescribed by doctors that need to be scheduled</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              {mockPrescribedProcedures.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mockPrescribedProcedures.length > 0 ? (
            <div className="space-y-4">
              {mockPrescribedProcedures.map((procedure) => (
                <div key={procedure.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{procedure.procedureName}</h4>
                          <Badge variant="outline" className={getDepartmentColor(procedure.department)}>
                            {procedure.department}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Prescribed: {new Date(procedure.prescribedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>By: {procedure.prescribedBy}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Indication:</strong> {procedure.indication}
                        </p>
                        {procedure.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Notes:</strong> {procedure.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-blue-600 mt-2">
                          <span>Sessions: {procedure.sessions}</span>
                          <span>•</span>
                          <span>Duration: {procedure.estimatedDuration}</span>
                        </div>
                        {procedure.scheduledDate && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>Scheduled: {new Date(procedure.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(procedure.status, procedure.priority)}
                      <Button size="sm" onClick={() => handleBookAppointment(procedure)}>
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
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No prescribed procedures pending</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Booking Modal */}
      <AppointmentBookingDialog
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
        onAppointmentCreated={handleAppointmentBooked}
        prefilledData={{
          appointmentType: "Specialized Procedure",
          serviceDetails: selectedPrescribedProcedure
            ? {
                name: selectedPrescribedProcedure.procedureName,
                notes: selectedPrescribedProcedure.notes,
                prescribedBy: selectedPrescribedProcedure.prescribedBy,
                priority: selectedPrescribedProcedure.priority,
                indication: selectedPrescribedProcedure.indication,
              }
            : undefined,
          department: selectedPrescribedProcedure?.department,
          doctor: selectedPrescribedProcedure?.prescribedBy,
        }}
      />

      {/* Add Procedures Modal */}
      <AddProceduresModal
        isOpen={showAddProceduresModal}
        onClose={() => setShowAddProceduresModal(false)}
        onSuccess={handleProceduresAdded}
        patientId={patientId || ""}
        patientName={patientName || ""}
      />
    </div>
  )
}
