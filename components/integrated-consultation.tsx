"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Calendar,
  Clock,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  Activity,
  Save,
  Printer,
  FileText,
  Stethoscope,
  TestTube,
  Pill,
  Eye,
  Brain,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

// Import all consultation components
import { ClinicalNotesSection } from "./consultation/clinical-notes-section"
import { DiagnosisSection } from "./consultation/diagnosis-section"
import { VitalSignsSection } from "./consultation/vital-signs-section"
import { AdvancedAnalysisSection } from "./consultation/advanced-analysis-section"
import { AllopathicPrescription } from "./consultation/allopathic-prescription"
import { AyurvedicPrescription } from "./consultation/ayurvedic-prescription"
import { LaboratorySection } from "./laboratory-section"
import { RadiologySection } from "./radiology-section"
import { ProceduresSection } from "./procedures-section"
import { PrescriptionPreview } from "./consultation/prescription-preview"
import { PrescriptionTemplateManager } from "./prescription-template-manager"
import { CompleteVisitModal } from "./modals/complete-visit-modal"

// Import contexts
import { useConsultation } from "@/contexts/consultation-context"
import { useDoctor } from "@/contexts/doctor-context"

interface IntegratedConsultationProps {
  patientId: string
  visitId: string
}

export function IntegratedConsultation({ patientId, visitId }: IntegratedConsultationProps) {
  const { consultationData, updateConsultationData, saveConsultation, hasUnsavedChanges } = useConsultation()
  const { currentDoctor } = useDoctor()

  const [showPreview, setShowPreview] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Mock patient data - in real app, this would come from props or API
  const patientData = {
    id: patientId,
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    phone: "+91 98765 43210",
    address: "123 MG Road, Bangalore",
    bloodGroup: "B+",
    allergies: ["Penicillin", "Dust"],
    chronicConditions: ["Hypertension", "Diabetes Type 2"],
    lastVisit: "2024-01-10",
    visitType: "Follow-up",
    chiefComplaint: "Chest pain and shortness of breath",
    department: currentDoctor?.department || "General Medicine",
  }

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(async () => {
        await handleSave(true) // Silent save
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer)
    }
  }, [hasUnsavedChanges, consultationData])

  const handleSave = async (silent = false) => {
    setIsSaving(true)
    try {
      await saveConsultation()
      setLastSaved(new Date())
      if (!silent) {
        toast.success("Consultation saved successfully")
      }
    } catch (error) {
      if (!silent) {
        toast.error("Failed to save consultation")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrint = () => {
    setShowPreview(true)
  }

  const handleCompleteVisit = () => {
    if (hasUnsavedChanges) {
      toast.error("Please save your changes before completing the visit")
      return
    }
    setShowCompleteModal(true)
  }

  const getSaveStatusText = () => {
    if (isSaving) return "Saving..."
    if (hasUnsavedChanges) return "Unsaved changes"
    if (lastSaved) return `Last saved: ${lastSaved.toLocaleTimeString()}`
    return "All changes saved"
  }

  const getSaveStatusColor = () => {
    if (isSaving) return "text-blue-600"
    if (hasUnsavedChanges) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{patientData.name}</h1>
                <p className="text-sm text-gray-500">
                  {patientData.age} years • {patientData.gender} • {patientData.bloodGroup}
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Stethoscope className="h-4 w-4" />
                <span>{patientData.department}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`text-sm ${getSaveStatusColor()}`}>{getSaveStatusText()}</span>
            <Button variant="outline" size="sm" onClick={() => handleSave()} disabled={isSaving || !hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button onClick={handleCompleteVisit} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-4 gap-6 max-w-full">
          {/* Main Consultation Area - 3 columns */}
          <div className="col-span-3 space-y-6">
            {/* Prescription Template Manager */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Prescription Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PrescriptionTemplateManager
                  allopathicMedicines={consultationData.prescriptions.allopathic || []}
                  ayurvedicMedicines={consultationData.prescriptions.ayurvedic || []}
                  onLoadTemplate={(template) => {
                    updateConsultationData({
                      prescriptions: {
                        allopathic: template.allopathicMedicines || [],
                        ayurvedic: template.ayurvedicMedicines || [],
                      },
                    })
                    toast.success("Template loaded successfully")
                  }}
                />
              </CardContent>
            </Card>

            {/* Clinical Assessment */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Clinical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClinicalNotesSection
                    notes={consultationData.clinicalNotes || ""}
                    onNotesChange={(notes) => updateConsultationData({ clinicalNotes: notes })}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DiagnosisSection
                    diagnoses={consultationData.diagnoses || []}
                    onDiagnosesChange={(diagnoses) => updateConsultationData({ diagnoses })}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalSignsSection
                  vitals={consultationData.vitals || {}}
                  onVitalsChange={(vitals) => updateConsultationData({ vitals })}
                />
              </CardContent>
            </Card>

            {/* Advanced Analysis */}
            {(patientData.department === "Ayurveda" || patientData.department === "Ophthalmology") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Advanced Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedAnalysisSection
                    department={patientData.department}
                    analysisData={consultationData.advancedAnalysis || {}}
                    onAnalysisChange={(analysisData) => updateConsultationData({ advancedAnalysis: analysisData })}
                  />
                </CardContent>
              </Card>
            )}

            {/* Prescriptions */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Allopathic Prescription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AllopathicPrescription
                    medicines={consultationData.prescriptions.allopathic || []}
                    onMedicinesChange={(medicines) =>
                      updateConsultationData({
                        prescriptions: {
                          ...consultationData.prescriptions,
                          allopathic: medicines,
                        },
                      })
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-green-600" />
                    Ayurvedic Prescription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AyurvedicPrescription
                    medicines={consultationData.prescriptions.ayurvedic || []}
                    onMedicinesChange={(medicines) =>
                      updateConsultationData({
                        prescriptions: {
                          ...consultationData.prescriptions,
                          ayurvedic: medicines,
                        },
                      })
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Tests and Procedures */}
            <div className="grid grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Laboratory Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LaboratorySection
                    prescribedTests={consultationData.labTests || []}
                    onTestsChange={(tests) => updateConsultationData({ labTests: tests })}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Radiology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadiologySection
                    prescribedScans={consultationData.radiologyTests || []}
                    onScansChange={(scans) => updateConsultationData({ radiologyTests: scans })}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Procedures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProceduresSection
                    prescribedProcedures={consultationData.procedures || []}
                    onProceduresChange={(procedures) => updateConsultationData({ procedures })}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reference Panel - 1 column */}
          <div className="col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Patient Quick Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Patient Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{patientData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-xs">{patientData.address}</span>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Chief Complaint</p>
                    <p className="text-xs text-gray-600">{patientData.chiefComplaint}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <Badge variant="destructive" className="text-xs">
                      Allergic to Penicillin
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Dust Allergy
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Chronic Conditions</p>
                    <div className="space-y-1">
                      {patientData.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Vitals */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Quick Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">BP</p>
                      <p className="font-medium">120/80</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pulse</p>
                      <p className="font-medium">72 bpm</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Temp</p>
                      <p className="font-medium">98.6°F</p>
                    </div>
                    <div>
                      <p className="text-gray-500">SpO2</p>
                      <p className="font-medium">98%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrescriptionPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        patientData={patientData}
        consultationData={consultationData}
        doctorData={currentDoctor}
      />

      <CompleteVisitModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        patientId={patientId}
        visitId={visitId}
        consultationData={consultationData}
      />
    </div>
  )
}
