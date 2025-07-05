"use client"

import { useState } from "react"
import { ArrowLeft, Printer, Edit, Activity, FileText, Pill, FlaskRoundIcon as Flask } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VitalSignsModal } from "@/components/modals/vital-signs-modal"
import { OrderLabTestModal } from "@/components/modals/order-lab-test-modal"
import { toast } from "sonner"
import { TestResultsSection } from "@/components/consultation/test-results-section"

// Mock visit data - in a real app, this would be fetched based on the visitId
const getVisitData = (patientId: string, visitId: string) => {
  // This is mock data - in a real app, you would fetch this from an API
  return {
    id: visitId,
    patientId: patientId,
    patientName: "John Doe",
    date: "2023-05-01",
    time: "10:30 AM",
    doctor: "Dr. Smith",
    department: "General Medicine",
    chiefComplaint: "Persistent cough and fever for 5 days",
    diagnosis: "Acute Bronchitis",
    diagnosisNotes:
      "Patient presents with symptoms consistent with acute bronchitis. Chest examination reveals wheezing and rhonchi. No signs of pneumonia on chest X-ray.",
    treatment: "Symptomatic treatment with rest, increased fluid intake, and medications as prescribed.",
    followUpDate: "2023-05-15",
    followUpNotes: "Return for follow-up if symptoms persist beyond 7 days or worsen.",
    prescription: [
      {
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Take with food",
      },
      {
        medication: "Paracetamol",
        dosage: "500mg",
        frequency: "As needed",
        duration: "5 days",
        instructions: "Take for fever above 38°C, not more than 4 times a day",
      },
      {
        medication: "Dextromethorphan",
        dosage: "15mg",
        frequency: "Every 6-8 hours",
        duration: "5 days",
        instructions: "Take for cough",
      },
    ],
    labTests: [
      {
        name: "Complete Blood Count",
        status: "Completed",
        result: "Within normal limits",
      },
      {
        name: "Chest X-Ray",
        status: "Completed",
        result: "No signs of pneumonia or other abnormalities",
      },
    ],
    vitalSigns: {
      temperature: "38.2",
      bodyWeight: "72",
      height: "175",
      bpSystolic: "130",
      bpDiastolic: "85",
      pulse: "88",
      spo2: "96",
      respiratoryRate: "18",
      notes: "Patient complains of persistent cough for 5 days",
    },
    notes:
      "Patient advised to rest and increase fluid intake. Avoid irritants such as smoke and dust. Return if symptoms worsen or new symptoms develop.",
  }
}

export default function VisitDetails({ params }: { params: { id: string; visitId: string } }) {
  const { id, visitId } = params
  const [isVitalSignsModalOpen, setIsVitalSignsModalOpen] = useState(false)
  const [isLabTestModalOpen, setIsLabTestModalOpen] = useState(false)
  const [visitData, setVisitData] = useState(getVisitData(id, visitId))
  const [activeTab, setActiveTab] = useState<"overview" | "results">("overview")

  const handleSaveVitalSigns = (data: any) => {
    // In a real app, this would be an API call to update the vital signs
    console.log("Saving vital signs:", data)
    // You would then update the local state or refetch the data
    setVisitData({
      ...visitData,
      vitalSigns: data,
    })
  }

  const handleOrderTest = (data: any) => {
    // In a real app, this would be an API call to create a lab test order
    console.log("Ordering test:", data)

    // Add the new test to the lab tests array
    const newTest = {
      name: data.testId.includes("-")
        ? data.testId
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : data.testId.toUpperCase(),
      status: "Pending",
      result: "Awaiting results",
    }

    setVisitData({
      ...visitData,
      labTests: [...visitData.labTests, newTest],
    })

    toast.success(`Lab test ordered successfully`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/patients/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Visit Details</h1>
            <p className="text-muted-foreground">
              {visitData.date} • {visitData.time} • {visitData.department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 px-1 ${
              activeTab === "overview" ? "border-b-2 border-primary font-medium text-primary" : "text-muted-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`pb-2 px-1 flex items-center ${
              activeTab === "results" ? "border-b-2 border-primary font-medium text-primary" : "text-muted-foreground"
            }`}
          >
            <Flask className="mr-2 h-4 w-4" />
            Test Results
          </button>
        </div>
      </div>

      {activeTab === "overview" ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Visit Information</CardTitle>
                <CardDescription>Details of the consultation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Patient</h3>
                    <p className="font-medium">{visitData.patientName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Doctor</h3>
                    <p className="font-medium">{visitData.doctor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                    <p className="font-medium">{visitData.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                    <p className="font-medium">
                      {visitData.date} at {visitData.time}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-medium">Chief Complaint</h3>
                  <p className="text-sm">{visitData.chiefComplaint}</p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Diagnosis</h3>
                  <div className="mb-2 flex items-center">
                    <Badge className="mr-2">{visitData.diagnosis}</Badge>
                  </div>
                  <p className="text-sm">{visitData.diagnosisNotes}</p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Treatment Plan</h3>
                  <p className="text-sm">{visitData.treatment}</p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Follow-up</h3>
                  <p className="text-sm">
                    <span className="font-medium">{visitData.followUpDate}</span> - {visitData.followUpNotes}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Additional Notes</h3>
                  <p className="text-sm">{visitData.notes}</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Pill className="mr-2 h-5 w-5" />
                      Prescription
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visitData.prescription.map((med, index) => (
                      <div key={index} className="rounded-lg border p-3">
                        <div className="mb-1 font-medium">{med.medication}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dosage: </span>
                            {med.dosage}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequency: </span>
                            {med.frequency}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            {med.duration}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Instructions: </span>
                            {med.instructions}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Lab Tests
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsLabTestModalOpen(true)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Order New Test
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visitData.labTests.map((test, index) => (
                      <div key={index} className="rounded-lg border p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium">{test.name}</span>
                          <Badge variant={test.status === "Completed" ? "outline" : "secondary"}>{test.status}</Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Result: </span>
                          {test.result}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Vital Signs
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsVitalSignsModalOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {visitData.vitalSigns ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-medium">{visitData.vitalSigns.temperature} °C</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="font-medium">
                          {visitData.vitalSigns.bpSystolic}/{visitData.vitalSigns.bpDiastolic} mmHg
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pulse</p>
                        <p className="font-medium">{visitData.vitalSigns.pulse} bpm</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">SPO2</p>
                        <p className="font-medium">{visitData.vitalSigns.spo2} %</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Respiratory Rate</p>
                        <p className="font-medium">{visitData.vitalSigns.respiratoryRate} breaths/min</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-medium">{visitData.vitalSigns.height} cm</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{visitData.vitalSigns.bodyWeight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">BMI</p>
                        <p className="font-medium">
                          {(
                            Number(visitData.vitalSigns.bodyWeight) /
                            (Number(visitData.vitalSigns.height) / 100) ** 2
                          ).toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {visitData.vitalSigns.notes && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{visitData.vitalSigns.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-center text-muted-foreground">No vital signs recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>View and analyze patient test results</CardDescription>
            </CardHeader>
            <CardContent>
              <TestResultsSection patientId={id} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vital Signs Modal */}
      <VitalSignsModal
        isOpen={isVitalSignsModalOpen}
        onClose={() => setIsVitalSignsModalOpen(false)}
        visitId={visitId}
        visitDate={visitData.date}
        patientName={visitData.patientName}
        onSave={handleSaveVitalSigns}
        initialData={visitData.vitalSigns}
      />

      {/* Order Lab Test Modal */}
      <OrderLabTestModal
        isOpen={isLabTestModalOpen}
        onClose={() => setIsLabTestModalOpen(false)}
        patientId={id}
        patientName={visitData.patientName}
        visitId={visitId}
        onOrderTest={handleOrderTest}
      />
    </div>
  )
}
