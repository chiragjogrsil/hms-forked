"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Stethoscope,
  Pill,
  Leaf,
  TestTube,
  Camera,
  Activity,
  User,
  Calendar,
  Clock,
  Save,
  FileText,
  CheckCircle2,
} from "lucide-react"

import { ClinicalNotesSection } from "./consultation/clinical-notes-section"
import { DiagnosisSection } from "./consultation/diagnosis-section"
import { VitalSignsSection } from "./consultation/vital-signs-section"
import { AllopathicPrescription } from "./consultation/allopathic-prescription"
import { AyurvedicPrescription } from "./consultation/ayurvedic-prescription"
import { LaboratorySection } from "./laboratory-section"
import { RadiologySection } from "./radiology-section"
import { ProceduresSection } from "./procedures-section"
import { PrescriptionTemplateManager } from "./prescription-template-manager"
import { AdvancedAnalysisSection } from "./consultation/advanced-analysis-section"
import { ReferencePanel } from "./consultation/reference-panel"
import { PrescriptionPreview } from "./consultation/prescription-preview"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"

interface IntegratedConsultationProps {
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
  onCompleteVisit?: () => Promise<boolean>
}

export function IntegratedConsultation({
  patientId,
  patientData,
  department,
  doctorName,
  onCompleteVisit,
}: IntegratedConsultationProps) {
  const {
    activeConsultation,
    updateConsultationData,
    saveConsultation,
    completeVisit,
    hasUnsavedChanges,
    isConsultationSaved,
  } = useConsultation()

  // Consultation data state
  const [consultationData, setConsultationData] = useState({
    clinicalNotes: "",
    provisionalDiagnosis: [] as string[],
    vitals: {},
    prescriptions: {
      allopathic: [] as any[],
      ayurvedic: [] as any[],
    },
    labTests: [] as any[],
    radiologyTests: [] as any[],
    procedures: [] as any[],
    advancedAnalysis: {},
  })

  const [showPrescriptionPreview, setShowPrescriptionPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load data from active consultation
  useEffect(() => {
    if (activeConsultation) {
      setConsultationData({
        clinicalNotes: activeConsultation.clinicalNotes || "",
        provisionalDiagnosis: activeConsultation.provisionalDiagnosis || [],
        vitals: activeConsultation.vitals || {},
        prescriptions: {
          allopathic: activeConsultation.prescriptions?.allopathic || [],
          ayurvedic: activeConsultation.prescriptions?.ayurvedic || [],
        },
        labTests: activeConsultation.investigationsOrdered?.filter((i) => i.category === "laboratory") || [],
        radiologyTests: activeConsultation.investigationsOrdered?.filter((i) => i.category === "radiology") || [],
        procedures: activeConsultation.investigationsOrdered?.filter((i) => i.category === "procedure") || [],
        advancedAnalysis: {
          ayurvedicAnalysis: activeConsultation.ayurvedicAnalysis || {},
          ophthalmologyAnalysis: activeConsultation.ophthalmologyAnalysis || {},
        },
      })
    }
  }, [activeConsultation])

  // Update consultation context when local data changes
  const updateConsultation = (updates: any) => {
    const newData = { ...consultationData, ...updates }
    setConsultationData(newData)

    // Update the consultation context
    updateConsultationData({
      clinicalNotes: newData.clinicalNotes,
      provisionalDiagnosis: newData.provisionalDiagnosis,
      vitals: newData.vitals,
      prescriptions: newData.prescriptions,
      investigationsOrdered: [
        ...newData.labTests.map((test: any) => ({ ...test, category: "laboratory" })),
        ...newData.radiologyTests.map((test: any) => ({ ...test, category: "radiology" })),
        ...newData.procedures.map((test: any) => ({ ...test, category: "procedure" })),
      ],
      ayurvedicAnalysis: newData.advancedAnalysis.ayurvedicAnalysis,
      ophthalmologyAnalysis: newData.advancedAnalysis.ophthalmologyAnalysis,
    })
  }

  const handleSaveConsultation = async () => {
    setIsSaving(true)
    try {
      const success = await saveConsultation()
      if (success) {
        toast.success("Consultation saved successfully")
      }
    } catch (error) {
      toast.error("Failed to save consultation")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCompleteVisit = async () => {
    try {
      let success = false
      if (onCompleteVisit) {
        success = await onCompleteVisit()
      } else {
        success = await completeVisit()
      }

      if (success) {
        toast.success("Visit completed successfully!")
      }
    } catch (error) {
      toast.error("Failed to complete visit")
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{patientData.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>
                    {patientData.age} years • {patientData.gender}
                  </span>
                  <Badge variant="outline">{department}</Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Unsaved Changes
                </Badge>
              )}
              {isConsultationSaved && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Saved
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Prescription Template Manager */}
      <PrescriptionTemplateManager
        ayurvedicPrescriptions={consultationData.prescriptions.ayurvedic}
        allopathicPrescriptions={consultationData.prescriptions.allopathic}
        onLoadTemplate={(template) => {
          updateConsultation({
            prescriptions: {
              allopathic: template.allopathicPrescriptions || [],
              ayurvedic: template.ayurvedicPrescriptions || [],
            },
          })
        }}
        department={department}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Clinical Notes and Diagnosis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Clinical Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ClinicalNotesSection
                data={consultationData.clinicalNotes}
                onChange={(data) => updateConsultation({ clinicalNotes: data })}
              />
              <Separator />
              <DiagnosisSection
                department={department}
                data={consultationData.provisionalDiagnosis}
                onChange={(data) => updateConsultation({ provisionalDiagnosis: data })}
              />
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VitalSignsSection
                patientId={patientId}
                onVitalSignsUpdate={(vitals) => {
                  const vitalData = vitals.reduce((acc, vital) => {
                    acc[vital.id] = vital.value
                    return acc
                  }, {} as any)
                  updateConsultation({ vitals: vitalData })
                }}
              />
            </CardContent>
          </Card>

          {/* Advanced Analysis (Department Specific) */}
          <AdvancedAnalysisSection
            department={department}
            data={consultationData.advancedAnalysis}
            onChange={(data) => updateConsultation({ advancedAnalysis: data })}
          />

          {/* Prescriptions */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Allopathic Prescriptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Allopathic Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AllopathicPrescription
                  department={department}
                  data={consultationData.prescriptions.allopathic}
                  onChange={(data) =>
                    updateConsultation({
                      prescriptions: { ...consultationData.prescriptions, allopathic: data },
                    })
                  }
                />
              </CardContent>
            </Card>

            {/* Ayurvedic Prescriptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Ayurvedic Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AyurvedicPrescription
                  data={consultationData.prescriptions.ayurvedic}
                  onChange={(data) =>
                    updateConsultation({
                      prescriptions: { ...consultationData.prescriptions, ayurvedic: data },
                    })
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Tests and Procedures */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Laboratory Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-purple-600" />
                  Laboratory Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LaboratorySection
                  selectedTests={consultationData.labTests}
                  onTestsChange={(tests) => updateConsultation({ labTests: tests })}
                />
              </CardContent>
            </Card>

            {/* Radiology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-indigo-600" />
                  Radiology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadiologySection
                  selectedTests={consultationData.radiologyTests}
                  onTestsChange={(tests) => updateConsultation({ radiologyTests: tests })}
                />
              </CardContent>
            </Card>

            {/* Procedures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-teal-600" />
                  Procedures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProceduresSection
                  selectedProcedures={consultationData.procedures}
                  onProceduresChange={(procedures) => updateConsultation({ procedures })}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reference Panel - 1 column */}
        <div className="lg:col-span-1">
          <ReferencePanel consultationData={consultationData} patientData={patientData} />
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPrescriptionPreview(true)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Preview Prescription
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSaveConsultation}
                disabled={isSaving}
                className="flex items-center gap-2 bg-transparent"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Consultation"}
              </Button>

              <Button onClick={handleCompleteVisit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-4 w-4" />
                Complete Visit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Preview Modal */}
      {showPrescriptionPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Prescription Preview</h2>
              <Button variant="ghost" onClick={() => setShowPrescriptionPreview(false)}>
                ×
              </Button>
            </div>
            <div className="p-6">
              <PrescriptionPreview
                patientData={patientData}
                consultationData={consultationData}
                department={department}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
