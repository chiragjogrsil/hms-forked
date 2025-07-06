"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Calendar,
  Clock,
  FileText,
  Pill,
  TestTube,
  Activity,
  Stethoscope,
  Eye,
  Leaf,
  Save,
  Printer,
  CheckCircle,
  Info,
} from "lucide-react"

// Import all consultation components
import { VitalSignsSection } from "@/components/consultation/vital-signs-section"
import { ClinicalNotesSection } from "@/components/consultation/clinical-notes-section"
import { DiagnosisSection } from "@/components/consultation/diagnosis-section"
import { AyurvedicPrescription } from "@/components/consultation/ayurvedic-prescription"
import { AllopathicPrescription } from "@/components/consultation/allopathic-prescription"
import { LaboratorySection } from "@/components/laboratory-section"
import { RadiologySection } from "@/components/radiology-section"
import { PanchkarmaSection } from "@/components/panchkarma-section"
import { PhysiotherapySection } from "@/components/physiotherapy-section"
import { ProceduresSection } from "@/components/procedures-section"
import { TestResultsSection } from "@/components/consultation/test-results-section"
import { AyurvedicAnalysis } from "@/components/consultation/ayurvedic-analysis"
import { OphthalmologyAnalysis } from "@/components/consultation/ophthalmology-analysis"
import { AdvancedAnalysisSection } from "@/components/consultation/advanced-analysis-section"
import { CombinedPrescriptionTemplateManager } from "@/components/combined-prescription-template-manager"

// Mock patient data
const mockPatient = {
  id: "P001",
  name: "Rajesh Kumar",
  age: 45,
  gender: "Male",
  phone: "+91 9876543210",
  address: "123 MG Road, Bangalore",
  emergencyContact: "+91 9876543211",
  bloodGroup: "B+",
  allergies: ["Penicillin", "Dust"],
  medicalHistory: ["Diabetes", "Hypertension"],
}

const mockVisit = {
  id: "V001",
  date: new Date().toISOString().split("T")[0],
  time: "10:30 AM",
  department: "General Medicine",
  doctor: "Dr. Priya Sharma",
  chiefComplaint: "Fever and body ache for 3 days",
  status: "In Progress",
}

interface IntegratedConsultationProps {
  patientId?: string
  visitId?: string
  department?: string
  readOnly?: boolean
}

export function IntegratedConsultation({
  patientId = "P001",
  visitId = "V001",
  department = "General Medicine",
  readOnly = false,
}: IntegratedConsultationProps) {
  // State for all consultation data
  const [consultationData, setConsultationData] = useState({
    vitalSigns: {},
    clinicalNotes: "",
    diagnosis: [],
    ayurvedicPrescriptions: [],
    allopathicPrescriptions: [],
    labTests: [],
    radiologyTests: [],
    panchkarmaServices: [],
    physiotherapyServices: [],
    procedures: [],
    testResults: [],
    ayurvedicAnalysis: {},
    ophthalmologyAnalysis: {},
    advancedAnalysis: {},
  })

  const [activeTab, setActiveTab] = useState("assessment")
  const [isSaving, setIsSaving] = useState(false)

  // Handle template loading for combined prescriptions
  const handleLoadCombinedTemplate = (template: any) => {
    setConsultationData((prev) => ({
      ...prev,
      ayurvedicPrescriptions: template.ayurvedicPrescriptions || [],
      allopathicPrescriptions: template.allopathicPrescriptions || [],
    }))
  }

  // Save consultation
  const handleSaveConsultation = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Consultation saved:", consultationData)
    } catch (error) {
      console.error("Error saving consultation:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Complete consultation
  const handleCompleteConsultation = async () => {
    await handleSaveConsultation()
    // Navigate to next patient or dashboard
  }

  const getDepartmentSpecificTabs = () => {
    const baseTabs = [
      { id: "assessment", label: "Assessment", icon: Stethoscope },
      { id: "prescriptions", label: "Prescriptions", icon: Pill },
      { id: "investigations", label: "Investigations", icon: TestTube },
      { id: "procedures", label: "Procedures", icon: Activity },
    ]

    if (department === "Ayurveda") {
      baseTabs.push({ id: "ayurvedic", label: "Ayurvedic Analysis", icon: Leaf })
    }

    if (department === "Ophthalmology") {
      baseTabs.push({ id: "ophthalmology", label: "Eye Examination", icon: Eye })
    }

    baseTabs.push({ id: "advanced", label: "Advanced", icon: FileText })

    return baseTabs
  }

  const tabs = getDepartmentSpecificTabs()

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{mockPatient.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {mockPatient.age} years • {mockPatient.gender}
                  </span>
                  <span>ID: {mockPatient.id}</span>
                  <span>Blood Group: {mockPatient.bloodGroup}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{mockVisit.date}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{mockVisit.time}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{mockVisit.department}</Badge>
                <Badge variant="secondary">{mockVisit.status}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Template Manager for Combined Prescriptions */}
      <CombinedPrescriptionTemplateManager
        ayurvedicPrescriptions={consultationData.ayurvedicPrescriptions}
        allopathicPrescriptions={consultationData.allopathicPrescriptions}
        department={department}
        onLoadTemplate={handleLoadCombinedTemplate}
        readOnly={readOnly}
      />

      {/* Main Consultation Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 h-auto p-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              {/* Assessment Tab */}
              <TabsContent value="assessment" className="space-y-6 mt-0">
                <VitalSignsSection
                  data={consultationData.vitalSigns}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, vitalSigns: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <ClinicalNotesSection
                  data={consultationData.clinicalNotes}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, clinicalNotes: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <DiagnosisSection
                  data={consultationData.diagnosis}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, diagnosis: data }))}
                  readOnly={readOnly}
                />
              </TabsContent>

              {/* Prescriptions Tab */}
              <TabsContent value="prescriptions" className="space-y-6 mt-0">
                <AyurvedicPrescription
                  data={consultationData.ayurvedicPrescriptions}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, ayurvedicPrescriptions: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <AllopathicPrescription
                  department={department}
                  data={consultationData.allopathicPrescriptions}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, allopathicPrescriptions: data }))}
                  readOnly={readOnly}
                />
              </TabsContent>

              {/* Investigations Tab */}
              <TabsContent value="investigations" className="space-y-6 mt-0">
                <LaboratorySection
                  data={consultationData.labTests}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, labTests: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <RadiologySection
                  data={consultationData.radiologyTests}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, radiologyTests: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <TestResultsSection
                  data={consultationData.testResults}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, testResults: data }))}
                  readOnly={readOnly}
                />
              </TabsContent>

              {/* Procedures Tab */}
              <TabsContent value="procedures" className="space-y-6 mt-0">
                <ProceduresSection
                  data={consultationData.procedures}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, procedures: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <PanchkarmaSection
                  data={consultationData.panchkarmaServices}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, panchkarmaServices: data }))}
                  readOnly={readOnly}
                />
                <Separator />
                <PhysiotherapySection
                  data={consultationData.physiotherapyServices}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, physiotherapyServices: data }))}
                  readOnly={readOnly}
                />
              </TabsContent>

              {/* Department-specific tabs */}
              {department === "Ayurveda" && (
                <TabsContent value="ayurvedic" className="space-y-6 mt-0">
                  <AyurvedicAnalysis
                    data={consultationData.ayurvedicAnalysis}
                    onChange={(data) => setConsultationData((prev) => ({ ...prev, ayurvedicAnalysis: data }))}
                    readOnly={readOnly}
                  />
                </TabsContent>
              )}

              {department === "Ophthalmology" && (
                <TabsContent value="ophthalmology" className="space-y-6 mt-0">
                  <OphthalmologyAnalysis
                    data={consultationData.ophthalmologyAnalysis}
                    onChange={(data) => setConsultationData((prev) => ({ ...prev, ophthalmologyAnalysis: data }))}
                    readOnly={readOnly}
                  />
                </TabsContent>
              )}

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6 mt-0">
                <AdvancedAnalysisSection
                  data={consultationData.advancedAnalysis}
                  onChange={(data) => setConsultationData((prev) => ({ ...prev, advancedAnalysis: data }))}
                  readOnly={readOnly}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!readOnly && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>All changes are automatically saved</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleSaveConsultation} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleCompleteConsultation} disabled={isSaving}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
