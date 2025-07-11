"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Clock, Download, Eye, AlertTriangle, TestTube, FileText, Plus } from "lucide-react"
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

// Mock completed tests data
const mockCompletedTests = [
  {
    id: "completed-001",
    testId: "cbc",
    testName: "Complete Blood Count",
    completedDate: "2024-06-10",
    prescribedBy: "Dr. Sharma",
    status: "completed",
    result: "Normal",
    reportAvailable: true,
    reportUrl: "/reports/cbc-001.pdf",
    values: {
      Hemoglobin: "14.2 g/dL",
      "WBC Count": "7,200/μL",
      "Platelet Count": "250,000/μL",
    },
  },
  {
    id: "completed-002",
    testId: "liver",
    testName: "Liver Function Test",
    completedDate: "2024-06-05",
    prescribedBy: "Dr. Patel",
    status: "completed",
    result: "Abnormal",
    reportAvailable: true,
    reportUrl: "/reports/lft-002.pdf",
    values: {
      ALT: "45 U/L (High)",
      AST: "38 U/L",
      Bilirubin: "1.2 mg/dL",
    },
    flagged: true,
  },
  {
    id: "completed-003",
    testId: "thyroid",
    testName: "Thyroid Function Test",
    completedDate: "2024-05-28",
    prescribedBy: "Dr. Kumar",
    status: "completed",
    result: "Normal",
    reportAvailable: true,
    reportUrl: "/reports/tft-003.pdf",
    values: {
      TSH: "2.1 mIU/L",
      T3: "1.2 ng/mL",
      T4: "8.5 μg/dL",
    },
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

  const getResultBadge = (result: string, flagged?: boolean) => {
    if (flagged) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Abnormal</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
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

      {/* Recent Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Recent Test Results</CardTitle>
                <CardDescription>Completed tests with results and reports</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              {mockCompletedTests.length} completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {mockCompletedTests.length > 0 ? (
            <div className="space-y-4">
              {mockCompletedTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{test.testName}</h4>
                          {getResultBadge(test.result, test.flagged)}
                          {test.flagged && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Completed: {new Date(test.completedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>By: {test.prescribedBy}</span>
                        </div>
                        {test.values && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium mb-1">Key Values:</div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(test.values).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-muted-foreground">{key}:</span>
                                  <span
                                    className={
                                      value.includes("High") || value.includes("Low") ? "text-red-600 font-medium" : ""
                                    }
                                  >
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {test.reportAvailable && (
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
              <p>No completed tests yet</p>
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
