"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, CheckCircle2 } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"
import { ClinicalNotesSection } from "@/components/consultation/clinical-notes-section"
import { VitalSignsSection } from "@/components/consultation/vital-signs-section"
import { DiagnosisSection } from "@/components/consultation/diagnosis-section"
import { AllopathicPrescription } from "@/components/consultation/allopathic-prescription"
import { AyurvedicPrescription } from "@/components/consultation/ayurvedic-prescription"
import { AdvancedAnalysisSection } from "@/components/consultation/advanced-analysis-section"
import { CompleteVisitModal } from "@/components/modals/complete-visit-modal"

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
  onCompleteVisit?: () => void
}

export function IntegratedConsultation({
  patientId,
  patientData,
  department,
  doctorName,
  onCompleteVisit,
}: IntegratedConsultationProps) {
  const { activeConsultation, updateConsultationData, saveConsultation, hasUnsavedChanges, completeConsultation } =
    useConsultation()
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [isCompleteVisitModalOpen, setIsCompleteVisitModalOpen] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && activeConsultation) {
      setIsAutoSaving(true)
      const timer = setTimeout(async () => {
        await saveConsultation()
        setIsAutoSaving(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, activeConsultation, saveConsultation])

  const handleSectionChange = (section: string, data: any) => {
    updateConsultationData({ [section]: data })
  }

  const handleCompleteVisit = () => {
    setIsCompleteVisitModalOpen(true)
  }

  const handleCompleteVisitWithNextSteps = (nextStepsData: any) => {
    // Complete the consultation with next steps data
    completeConsultation({
      nextSteps: nextStepsData,
    })

    // Call the parent callback if provided
    if (onCompleteVisit) {
      onCompleteVisit()
    }
  }

  const hasConsultationData = () => {
    if (!activeConsultation) return false

    return (
      activeConsultation.prescriptions?.ayurvedic?.length > 0 ||
      activeConsultation.prescriptions?.allopathic?.length > 0 ||
      activeConsultation.clinicalNotes ||
      activeConsultation.chiefComplaint ||
      activeConsultation.provisionalDiagnosis?.length > 0 ||
      activeConsultation.diagnosis?.length > 0 ||
      Object.keys(activeConsultation.vitals || {}).length > 0
    )
  }

  if (!activeConsultation) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Consultation</h3>
          <p className="text-muted-foreground">Start a new consultation to begin</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Clinical Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes & History</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicalNotesSection
            data={activeConsultation.clinicalNotes || ""}
            onChange={(data) => handleSectionChange("clinicalNotes", data)}
          />
        </CardContent>
      </Card>

      {/* Vital Signs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <VitalSignsSection
            data={activeConsultation.vitals || {}}
            onChange={(data) => handleSectionChange("vitals", data)}
          />
        </CardContent>
      </Card>

      {/* Diagnosis Section */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <DiagnosisSection
            department={department}
            data={activeConsultation.provisionalDiagnosis || []}
            onChange={(data) => handleSectionChange("provisionalDiagnosis", data)}
          />
        </CardContent>
      </Card>

      {/* Advanced Analysis Section - Only for specific departments */}
      <AdvancedAnalysisSection
        department={department}
        data={activeConsultation.ayurvedicAnalysis || activeConsultation.ophthalmologyAnalysis || {}}
        onChange={(data) => {
          if (department === "ayurveda") {
            handleSectionChange("ayurvedicAnalysis", data)
          } else if (department === "ophthalmology") {
            handleSectionChange("ophthalmologyAnalysis", data)
          }
        }}
      />

      {/* Prescriptions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allopathic Prescriptions */}
        <Card>
          <CardContent className="p-6">
            <AllopathicPrescription
              department={department}
              data={activeConsultation.prescriptions?.allopathic || []}
              onChange={(data) => {
                const currentPrescriptions = activeConsultation.prescriptions || { ayurvedic: [], allopathic: [] }
                handleSectionChange("prescriptions", {
                  ...currentPrescriptions,
                  allopathic: data,
                })
              }}
            />
          </CardContent>
        </Card>

        {/* Ayurvedic Prescriptions */}
        <Card>
          <CardContent className="p-6">
            <AyurvedicPrescription
              data={activeConsultation.prescriptions?.ayurvedic || []}
              onChange={(data) => {
                const currentPrescriptions = activeConsultation.prescriptions || { ayurvedic: [], allopathic: [] }
                handleSectionChange("prescriptions", {
                  ...currentPrescriptions,
                  ayurvedic: data,
                })
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Complete Visit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Complete Visit</h3>
              <p className="text-sm text-muted-foreground">
                Finalize the consultation and plan next steps for the patient
              </p>
            </div>
            <Button onClick={handleCompleteVisit} className="bg-green-600 hover:bg-green-700" size="lg">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Visit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complete Visit Modal */}
      <CompleteVisitModal
        open={isCompleteVisitModalOpen}
        onOpenChange={setIsCompleteVisitModalOpen}
        patientName={patientData.name}
        patientId={patientData.id}
        department={department}
        onComplete={handleCompleteVisitWithNextSteps}
      />
    </div>
  )
}
