"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Calendar,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  Activity,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

// Import consultation components
import { ClinicalNotesSection } from "@/components/consultation/clinical-notes-section"
import { DiagnosisSection } from "@/components/consultation/diagnosis-section"
import { VitalSignsSection } from "@/components/consultation/vital-signs-section"
import { AyurvedicAnalysis } from "@/components/consultation/ayurvedic-analysis"
import { OphthalmologyAnalysis } from "@/components/consultation/ophthalmology-analysis"
import { AllopathicPrescription } from "@/components/consultation/allopathic-prescription"
import { AyurvedicPrescription } from "@/components/consultation/ayurvedic-prescription"
import { PrescriptionTemplateManager } from "@/components/prescription-template-manager"
import { CompleteVisitModal } from "@/components/modals/complete-visit-modal"

// Import contexts
import { useConsultation } from "@/contexts/consultation-context"
import { useDoctor } from "@/contexts/doctor-context"

interface IntegratedConsultationProps {
  patientId: string
  visitId?: string
  readOnly?: boolean
}

export function IntegratedConsultation({ patientId, visitId, readOnly = false }: IntegratedConsultationProps) {
  const { selectedDoctor } = useDoctor()
  const { consultationData, updateConsultationData, saveConsultation, isLoading } = useConsultation()

  // Local state for UI management
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Default consultation data structure
  const defaultConsultationData = {
    patientId,
    visitId: visitId || `visit-${Date.now()}`,
    doctorId: selectedDoctor?.id || "doctor-1",
    department: selectedDoctor?.department || "General Medicine",
    clinicalNotes: "",
    diagnoses: [],
    vitals: {
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "",
      height: "",
      bmi: "",
    },
    prescriptions: {
      allopathic: [],
      ayurvedic: [],
    },
    ayurvedicAnalysis: {
      prakriti: "",
      vikriti: "",
      agni: "",
      ama: "",
      ojas: "",
      srotas: "",
      recommendations: "",
    },
    ophthalmologyAnalysis: {
      visualAcuity: { right: "", left: "" },
      refraction: { right: "", left: "" },
      intraocularPressure: { right: "", left: "" },
      fundusExamination: "",
      anteriorSegment: "",
      recommendations: "",
    },
    status: "in-progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Use consultation data or fallback to default
  const currentConsultationData = consultationData || defaultConsultationData

  // Mock patient data
  const patientData = {
    id: patientId,
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    phone: "+91 98765 43210",
    address: "123 Main Street, Mumbai, Maharashtra",
    bloodGroup: "B+",
    allergies: ["Penicillin", "Dust"],
    chronicConditions: ["Hypertension", "Diabetes Type 2"],
    lastVisit: "2024-01-15",
    emergencyContact: "+91 98765 43211",
  }

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && !readOnly) {
      const timer = setTimeout(async () => {
        await handleSave(true) // Silent save
      }, 3000) // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, currentConsultationData])

  const handleDataChange = (section: string, data: any) => {
    updateConsultationData({
      ...currentConsultationData,
      [section]: data,
      updatedAt: new Date().toISOString(),
    })
    setHasUnsavedChanges(true)
  }

  const handleSave = async (silent = false) => {
    setIsSaving(true)
    try {
      await saveConsultation(currentConsultationData)
      setHasUnsavedChanges(false)
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

  const handleLoadTemplate = (template: any) => {
    const updatedData = {
      ...currentConsultationData,
      prescriptions: {
        allopathic: template.allopathicMedicines || [],
        ayurvedic: template.ayurvedicMedicines || [],
      },
      updatedAt: new Date().toISOString(),
    }
    updateConsultationData(updatedData)
    setHasUnsavedChanges(true)
  }

  const handleCompleteVisit = () => {
    setShowCompleteModal(true)
  }

  const getSaveStatusIcon = () => {
    if (isSaving) return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
    if (hasUnsavedChanges) return <AlertTriangle className="h-4 w-4 text-amber-600" />
    return <CheckCircle2 className="h-4 w-4 text-green-600" />
  }

  const getSaveStatusText = () => {
    if (isSaving) return "Saving..."
    if (hasUnsavedChanges) return "Unsaved changes"
    if (lastSaved) return `Saved ${lastSaved.toLocaleTimeString()}`
    return "All changes saved"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Patient Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{patientData.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>
                      {patientData.age} years • {patientData.gender}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {patientData.phone}
                    </span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {patientData.bloodGroup}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  {getSaveStatusIcon()}
                  <span>{getSaveStatusText()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => handleSave()} disabled={isSaving || readOnly}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCompleteVisit} disabled={readOnly}>
                    Complete Visit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescription Template Manager */}
        {!readOnly && (
          <PrescriptionTemplateManager
            allopathicMedicines={currentConsultationData.prescriptions?.allopathic || []}
            ayurvedicMedicines={currentConsultationData.prescriptions?.ayurvedic || []}
            onLoadTemplate={handleLoadTemplate}
            department={currentConsultationData.department}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Consultation Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Clinical Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Clinical Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ClinicalNotesSection
                  data={currentConsultationData.clinicalNotes || ""}
                  onChange={(data) => handleDataChange("clinicalNotes", data)}
                  readOnly={readOnly}
                />
                <Separator />
                <DiagnosisSection
                  data={currentConsultationData.diagnoses || []}
                  onChange={(data) => handleDataChange("diagnoses", data)}
                  readOnly={readOnly}
                />
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalSignsSection
                  data={currentConsultationData.vitals || {}}
                  onChange={(data) => handleDataChange("vitals", data)}
                  readOnly={readOnly}
                />
              </CardContent>
            </Card>

            {/* Advanced Analysis - Department Specific */}
            {currentConsultationData.department === "Ayurveda" && (
              <Card>
                <CardHeader>
                  <CardTitle>Ayurvedic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <AyurvedicAnalysis
                    data={currentConsultationData.ayurvedicAnalysis || {}}
                    onChange={(data) => handleDataChange("ayurvedicAnalysis", data)}
                    readOnly={readOnly}
                  />
                </CardContent>
              </Card>
            )}

            {currentConsultationData.department === "Ophthalmology" && (
              <Card>
                <CardHeader>
                  <CardTitle>Ophthalmology Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <OphthalmologyAnalysis
                    data={currentConsultationData.ophthalmologyAnalysis || {}}
                    onChange={(data) => handleDataChange("ophthalmologyAnalysis", data)}
                    readOnly={readOnly}
                  />
                </CardContent>
              </Card>
            )}

            {/* Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <AllopathicPrescription
                    department={currentConsultationData.department}
                    data={currentConsultationData.prescriptions?.allopathic || []}
                    onChange={(data) =>
                      handleDataChange("prescriptions", {
                        ...currentConsultationData.prescriptions,
                        allopathic: data,
                      })
                    }
                    readOnly={readOnly}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <AyurvedicPrescription
                    data={currentConsultationData.prescriptions?.ayurvedic || []}
                    onChange={(data) =>
                      handleDataChange("prescriptions", {
                        ...currentConsultationData.prescriptions,
                        ayurvedic: data,
                      })
                    }
                    readOnly={readOnly}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reference Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {/* Allergies */}
                    <div>
                      <h4 className="font-medium text-sm text-red-600 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Allergies
                      </h4>
                      <div className="space-y-1">
                        {patientData.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                      <h4 className="font-medium text-sm text-amber-600 mb-2">Chronic Conditions</h4>
                      <div className="space-y-1">
                        {patientData.chronicConditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Contact</h4>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{patientData.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 mt-0.5" />
                          <span>{patientData.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Last Visit */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Last Visit</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{patientData.lastVisit}</span>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Emergency Contact</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{patientData.emergencyContact}</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Complete Visit Modal */}
        <CompleteVisitModal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          consultationData={currentConsultationData}
          patientData={patientData}
        />
      </div>
    </div>
  )
}
