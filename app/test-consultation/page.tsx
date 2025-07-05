"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useConsultation } from "@/contexts/consultation-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, Clock, User, FileText } from "lucide-react"

export default function TestConsultationPage() {
  const { activeConsultation, consultationHistory, startConsultation, updateConsultationData, completeVisit } =
    useConsultation()

  const { toast } = useToast()
  const [isCompleting, setIsCompleting] = useState(false)

  // Form state
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")

  const handleStartConsultation = () => {
    const consultation = startConsultation("P12345", "John Doe")
    toast({
      title: "Consultation Started",
      description: `Started consultation for ${consultation.patientName}`,
    })
  }

  const handleUpdateData = () => {
    if (!activeConsultation) return

    updateConsultationData(activeConsultation.id, {
      chiefComplaint,
      clinicalNotes,
      diagnosis,
    })

    toast({
      title: "Data Updated",
      description: "Consultation data has been saved",
    })
  }

  const handleCompleteVisit = async () => {
    if (!activeConsultation) return

    setIsCompleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    completeVisit(activeConsultation.id)

    // Clear form
    setChiefComplaint("")
    setClinicalNotes("")
    setDiagnosis("")

    setIsCompleting(false)

    toast({
      title: "Visit Completed",
      description: "Consultation has been completed successfully",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Consultation System</h1>
          <p className="text-muted-foreground">Test the complete consultation workflow</p>
        </div>
        <Badge variant={activeConsultation ? "default" : "secondary"}>
          {activeConsultation ? "Active Consultation" : "No Active Consultation"}
        </Badge>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{consultationHistory.length}</div>
              <div className="text-sm text-muted-foreground">Total Consultations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeConsultation ? 1 : 0}</div>
              <div className="text-sm text-muted-foreground">Active Consultations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {consultationHistory.filter((c) => c.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Consultation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Active Consultation
            </CardTitle>
            <CardDescription>
              {activeConsultation
                ? `Patient: ${activeConsultation.patientName} (${activeConsultation.patientId})`
                : "No active consultation"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!activeConsultation ? (
              <Button onClick={handleStartConsultation} className="w-full">
                Start Test Consultation
              </Button>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="complaint">Chief Complaint</Label>
                    <Input
                      id="complaint"
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder="Enter patient's main concern..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Clinical Notes</Label>
                    <Textarea
                      id="notes"
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Enter examination findings..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="diagnosis">Preliminary Diagnosis</Label>
                    <Input
                      id="diagnosis"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Enter preliminary diagnosis..."
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUpdateData} variant="outline" className="flex-1">
                    Update Consultation Data
                  </Button>

                  <Button onClick={handleCompleteVisit} disabled={isCompleting} className="flex-1">
                    {isCompleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete Visit
                      </>
                    )}
                  </Button>
                </div>

                {activeConsultation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm">
                      <div>
                        <strong>Started:</strong> {new Date(activeConsultation.startTime).toLocaleString()}
                      </div>
                      <div>
                        <strong>Status:</strong> {activeConsultation.status}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Consultation History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Consultation History
            </CardTitle>
            <CardDescription>Recent consultations and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consultationHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No consultations yet</p>
              ) : (
                consultationHistory.slice(0, 5).map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{consultation.patientName}</div>
                      <div className="text-sm text-muted-foreground">{consultation.patientId}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(consultation.startTime).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant={consultation.status === "completed" ? "default" : "secondary"}>
                      {consultation.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mock Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>System state and mock data for testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Active Consultation ID:</strong> {activeConsultation?.id || "None"}
            </div>
            <div>
              <strong>Total History Items:</strong> {consultationHistory.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
