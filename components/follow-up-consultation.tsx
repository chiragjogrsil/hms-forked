"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  History,
  Download,
  Save,
  Copy,
  Calendar,
  Stethoscope,
  TestTube,
  Scan,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react"
import { TestResultsSection } from "@/components/consultation/test-results-section"
import { useConsultation } from "@/contexts/consultation-context"
import { IntegratedConsultation } from "@/components/integrated-consultation"
import { LoadConsultationTemplateModal } from "@/components/modals/load-consultation-template-modal"
import { SaveConsultationTemplateModal } from "@/components/modals/save-consultation-template-modal"
import { toast } from "sonner"

interface FollowUpConsultationProps {
  patientId: string
  patientData: {
    id: string
    name: string
    age: number
    gender: string
    bloodGroup: string
    allergies: string[]
    medicalHistory: string[]
  }
  department: string
  doctorName: string
  visitDate: string
}

export function FollowUpConsultation({
  patientId,
  patientData,
  department,
  doctorName,
  visitDate,
}: FollowUpConsultationProps) {
  const {
    activeConsultation,
    getPatientConsultations,
    loadConsultation,
    updateConsultationData,
    startNewConsultation,
  } = useConsultation()

  const [activeTab, setActiveTab] = useState("reports")
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [showLoadTemplateModal, setShowLoadTemplateModal] = useState(false)
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false)

  const consultationHistory = getPatientConsultations(patientId)

  // Mock recent reports data
  const recentReports = [
    {
      id: "RPT-001",
      type: "lab",
      name: "Complete Blood Count",
      date: "2024-06-25",
      status: "completed",
      abnormal: false,
      summary: "All parameters within normal range",
      urgency: "routine",
    },
    {
      id: "RPT-002",
      type: "radiology",
      name: "Chest X-Ray",
      date: "2024-06-24",
      status: "completed",
      abnormal: true,
      summary: "Mild consolidation in right lower lobe",
      urgency: "urgent",
    },
    {
      id: "RPT-003",
      type: "lab",
      name: "Lipid Profile",
      date: "2024-06-23",
      status: "completed",
      abnormal: true,
      summary: "Elevated cholesterol levels",
      urgency: "routine",
    },
  ]

  const handleLoadPreviousConsultation = (consultation: any) => {
    setSelectedConsultation(consultation)

    // Start a new consultation but pre-populate with previous data
    startNewConsultation(patientId, patientData.name, visitDate, {
      department,
      doctorName,
      consultationType: "followup",
    })

    // Update with previous consultation data for amendment
    updateConsultationData({
      chiefComplaint: `Follow-up: ${consultation.chiefComplaint}`,
      clinicalNotes: consultation.clinicalNotes,
      provisionalDiagnosis: consultation.provisionalDiagnosis || [],
      prescriptions: consultation.prescriptions || { ayurvedic: [], allopathic: [] },
      vitals: consultation.vitals || {},
      // Mark as follow-up with reference to previous consultation
      previousConsultationId: consultation.id,
      consultationType: "followup",
    })

    setActiveTab("consultation")
    toast.success("Previous consultation loaded for amendment", {
      description: `Loaded consultation from ${new Date(consultation.visitDate).toLocaleDateString()}`,
    })
  }

  const handleLoadConsultationTemplate = (template: any) => {
    if (!activeConsultation) {
      startNewConsultation(patientId, patientData.name, visitDate, {
        department,
        doctorName,
        consultationType: "followup",
      })
    }

    updateConsultationData({
      chiefComplaint: template.chiefComplaint,
      clinicalNotes: template.clinicalNotes,
      provisionalDiagnosis: template.provisionalDiagnosis || [],
      prescriptions: template.prescriptions || { ayurvedic: [], allopathic: [] },
      vitals: template.vitals || {},
    })

    setActiveTab("consultation")
    toast.success("Consultation template loaded")
  }

  const handleSaveAsTemplate = () => {
    if (!activeConsultation) {
      toast.error("No active consultation to save as template")
      return
    }
    setShowSaveTemplateModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Follow-up Consultation
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review reports and update consultation for {patientData.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLoadTemplateModal(true)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Load Template
              </Button>
              {activeConsultation && (
                <Button
                  variant="outline"
                  onClick={handleSaveAsTemplate}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Review Reports
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Consultation History
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Current Consultation
            {activeConsultation && (
              <Badge variant="secondary" className="ml-1">
                Active
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Reports Review Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-blue-600" />
                Recent Test Results & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TestTube className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Lab Tests</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-blue-700">
                          {recentReports.filter((r) => r.type === "lab").length}
                        </span>
                        <span className="text-sm text-blue-600 ml-1">recent</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Scan className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Radiology</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-green-700">
                          {recentReports.filter((r) => r.type === "radiology").length}
                        </span>
                        <span className="text-sm text-green-600 ml-1">recent</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Abnormal</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-orange-700">
                          {recentReports.filter((r) => r.abnormal).length}
                        </span>
                        <span className="text-sm text-orange-600 ml-1">findings</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Reports List */}
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Reports Requiring Review</h4>
                  {recentReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${report.type === "lab" ? "bg-blue-100" : "bg-green-100"}`}
                            >
                              {report.type === "lab" ? (
                                <TestTube
                                  className={`h-4 w-4 ${report.type === "lab" ? "text-blue-600" : "text-green-600"}`}
                                />
                              ) : (
                                <Scan className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium">{report.name}</h5>
                              <p className="text-sm text-muted-foreground">{report.summary}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(report.date).toLocaleDateString()}
                                </span>
                                <Badge variant={report.abnormal ? "destructive" : "secondary"} className="text-xs">
                                  {report.abnormal ? "Abnormal" : "Normal"}
                                </Badge>
                                <Badge
                                  variant={report.urgency === "urgent" ? "destructive" : "outline"}
                                  className="text-xs"
                                >
                                  {report.urgency}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Test Results Component */}
                <Separator />
                <TestResultsSection patientId={patientId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultation History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-purple-600" />
                Previous Consultations
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Load a previous consultation to make amendments based on new reports
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {consultationHistory.map((consultation) => (
                    <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{consultation.chiefComplaint}</h5>
                              <Badge
                                variant={consultation.status === "completed" ? "secondary" : "default"}
                                className="text-xs"
                              >
                                {consultation.status === "completed" ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                ) : (
                                  <Clock className="h-3 w-3 mr-1" />
                                )}
                                {consultation.status}
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(consultation.visitDate!).toLocaleDateString()}
                                </span>
                                <span>{consultation.doctorName}</span>
                                <span className="capitalize">{consultation.department}</span>
                              </div>

                              {consultation.provisionalDiagnosis?.length > 0 && (
                                <div>
                                  <strong>Diagnosis:</strong> {consultation.provisionalDiagnosis.join(", ")}
                                </div>
                              )}

                              {consultation.prescriptions && (
                                <div>
                                  <strong>Prescriptions:</strong>{" "}
                                  {(consultation.prescriptions.ayurvedic?.length || 0) +
                                    (consultation.prescriptions.allopathic?.length || 0)}{" "}
                                  medicines prescribed
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoadPreviousConsultation(consultation)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Load & Amend
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {consultationHistory.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No previous consultations found for this patient</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Consultation Tab */}
        <TabsContent value="consultation" className="space-y-4">
          {activeConsultation ? (
            <IntegratedConsultation
              patientId={patientId}
              patientData={patientData}
              department={department}
              doctorName={doctorName}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Consultation</h3>
                <p className="text-muted-foreground mb-6">
                  Start a new consultation or load a previous one to make amendments
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() =>
                      startNewConsultation(patientId, patientData.name, visitDate, {
                        department,
                        doctorName,
                        consultationType: "followup",
                      })
                    }
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Consultation
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("history")}>
                    <History className="h-4 w-4 mr-2" />
                    Load Previous Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LoadConsultationTemplateModal
        isOpen={showLoadTemplateModal}
        onClose={() => setShowLoadTemplateModal(false)}
        onLoad={handleLoadConsultationTemplate}
        department={department}
      />

      <SaveConsultationTemplateModal
        isOpen={showSaveTemplateModal}
        onClose={() => setShowSaveTemplateModal(false)}
        consultationData={activeConsultation}
        department={department}
      />
    </div>
  )
}
