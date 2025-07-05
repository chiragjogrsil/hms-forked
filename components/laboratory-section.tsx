"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, AlertTriangle, TestTube, Plus } from "lucide-react"
import { BookAppointmentModal } from "@/components/modals/book-appointment-modal"
import { PrescribeTestsModal } from "@/components/modals/prescribe-tests-modal"

// Mock prescribed tests data
const mockPrescribedTests = [
  {
    id: "prescribed-001",
    testId: "cbc",
    testName: "Complete Blood Count",
    prescribedBy: "Dr. Sharma",
    prescribedDate: "2024-06-20",
    visitId: "visit-001",
    status: "pending",
    priority: "routine",
    notes: "Check for anemia and infection markers",
  },
  {
    id: "prescribed-002",
    testId: "lipid",
    testName: "Lipid Profile",
    prescribedBy: "Dr. Gupta",
    prescribedDate: "2024-06-18",
    visitId: "visit-002",
    status: "pending",
    priority: "urgent",
    notes: "Follow-up for cholesterol management",
  },
  {
    id: "prescribed-003",
    testId: "hba1c",
    testName: "HbA1c",
    prescribedBy: "Dr. Sharma",
    prescribedDate: "2024-06-15",
    visitId: "visit-003",
    status: "scheduled",
    priority: "routine",
    scheduledDate: "2024-06-25",
    notes: "Diabetes monitoring",
  },
]

interface LaboratorySectionProps {
  patientId?: string
  patientName?: string
}

export function LaboratorySection({ patientId, patientName }: LaboratorySectionProps) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showPrescribeModal, setShowPrescribeModal] = useState(false)
  const [selectedPrescribedTest, setSelectedPrescribedTest] = useState<(typeof mockPrescribedTests)[0] | null>(null)

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

  const handleBookAppointment = (test: (typeof mockPrescribedTests)[0]) => {
    setSelectedPrescribedTest(test)
    setShowAppointmentModal(true)
  }

  const handleAppointmentBooked = () => {
    setShowAppointmentModal(false)
    setSelectedPrescribedTest(null)
  }

  const handlePrescribeTests = () => {
    setShowPrescribeModal(true)
  }

  const handleTestsPrescribed = () => {
    setShowPrescribeModal(false)
    // In a real app, this would refresh the prescribed tests list
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Laboratory Tests</h3>
          <p className="text-sm text-muted-foreground">Manage lab tests and view results</p>
        </div>
        <Button onClick={handlePrescribeTests} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Prescribe Tests
        </Button>
      </div>

      {/* Prescribed Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Prescribed Tests</CardTitle>
                <CardDescription>Tests prescribed by doctors that need to be completed</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              {mockPrescribedTests.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mockPrescribedTests.length > 0 ? (
            <div className="space-y-4">
              {mockPrescribedTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TestTube className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{test.testName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Prescribed: {new Date(test.prescribedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>By: {test.prescribedBy}</span>
                        </div>
                        {test.notes && <p className="text-sm text-muted-foreground mt-1">{test.notes}</p>}
                        {test.scheduledDate && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>Scheduled: {new Date(test.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(test.status, test.priority)}
                      <Button size="sm" onClick={() => handleBookAppointment(test)}>
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
              <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No prescribed tests pending</p>
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
          appointmentType: "Laboratory Test",
          serviceDetails: selectedPrescribedTest
            ? {
                name: selectedPrescribedTest.testName,
                notes: selectedPrescribedTest.notes,
                prescribedBy: selectedPrescribedTest.prescribedBy,
                priority: selectedPrescribedTest.priority,
              }
            : undefined,
        }}
      />

      {/* Prescribe Tests Modal */}
      <PrescribeTestsModal
        isOpen={showPrescribeModal}
        onClose={() => setShowPrescribeModal(false)}
        onSuccess={handleTestsPrescribed}
        patientId={patientId || ""}
        patientName={patientName || ""}
      />
    </div>
  )
}

export default LaboratorySection
