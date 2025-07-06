"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  FileText,
  TestTube,
  Pill,
  Activity,
  Brain,
  Save,
  Clock,
  User,
  Calendar,
  Phone,
} from "lucide-react"

import { AllopathicPrescription } from "@/components/consultation/allopathic-prescription"
import { AyurvedicPrescription } from "@/components/consultation/ayurvedic-prescription"
import { VitalSignsSection } from "@/components/consultation/vital-signs-section"
import { ClinicalNotesSection } from "@/components/consultation/clinical-notes-section"
import { DiagnosisSection } from "@/components/consultation/diagnosis-section"
import { TestResultsSection } from "@/components/consultation/test-results-section"
import { AyurvedicAnalysis } from "@/components/consultation/ayurvedic-analysis"
import { OphthalmologyAnalysis } from "@/components/consultation/ophthalmology-analysis"
import { AdvancedAnalysisSection } from "@/components/consultation/advanced-analysis-section"
import { PrescriptionTemplateManager } from "@/components/prescription-template-manager"

interface IntegratedConsultationProps {
  patientId: string
  visitId: string
  patientName?: string
  department?: string
}

export function IntegratedConsultation({
  patientId,
  visitId,
  patientName = "John Doe",
  department = "General OPD",
}: IntegratedConsultationProps) {
  // State for prescriptions
  const [allopathicMedicines, setAllopathicMedicines] = useState<
    Array<{
      name: string
      dosage: string
      frequency: string
      duration: string
      instructions?: string
    }>
  >([])

  const [ayurvedicMedicines, setAyurvedicMedicines] = useState<
    Array<{
      name: string
      dosage: string
      frequency: string
      duration: string
      instructions?: string
    }>
  >([])

  // State for other consultation data
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
  })

  const [clinicalNotes, setClinicalNotes] = useState({
    chiefComplaint: "",
    historyOfPresentIllness: "",
    pastMedicalHistory: "",
    familyHistory: "",
    socialHistory: "",
    reviewOfSystems: "",
    physicalExamination: "",
    assessment: "",
    plan: "",
  })

  const [diagnoses, setDiagnoses] = useState<
    Array<{
      code: string
      description: string
      type: "primary" | "secondary"
    }>
  >([])

  // Handle template loading
  const handleLoadTemplate = (templateAllopathic: any[], templateAyurvedic: any[]) => {
    setAllopathicMedicines(templateAllopathic)
    setAyurvedicMedicines(templateAyurvedic)
  }

  // Mock patient data
  const patientData = {
    name: patientName,
    id: patientId,
    age: 35,
    gender: "Male",
    contactNumber: "+91 9876543210",
    visitDate: new Date().toLocaleDateString(),
    visitTime: new Date().toLocaleTimeString(),
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Patient Header */}
      <Card className="mb-6 border-l-4 border-l-teal-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">{patientData.name}</CardTitle>
                <CardDescription className="text-base">
                  Patient ID: {patientData.id} • {patientData.age} years • {patientData.gender}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>{patientData.visitDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span>{patientData.visitTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{patientData.contactNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              {department}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Visit ID: {visitId}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Prescription Template Manager */}
      <PrescriptionTemplateManager
        allopathicMedicines={allopathicMedicines}
        ayurvedicMedicines={ayurvedicMedicines}
        onLoadTemplate={handleLoadTemplate}
        department={department}
      />

      {/* Main Consultation Interface */}
      <Tabs defaultValue="prescriptions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
          <TabsTrigger value="prescriptions" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Prescriptions</span>
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Diagnosis</span>
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Tests</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
        </TabsList>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AllopathicPrescription
              medicines={allopathicMedicines}
              onMedicinesChange={setAllopathicMedicines}
              department={department}
            />
            <AyurvedicPrescription
              medicines={ayurvedicMedicines}
              onMedicinesChange={setAyurvedicMedicines}
              department={department}
            />
          </div>
        </TabsContent>

        {/* Vital Signs Tab */}
        <TabsContent value="vitals">
          <VitalSignsSection vitalSigns={vitalSigns} onVitalSignsChange={setVitalSigns} />
        </TabsContent>

        {/* Clinical Notes Tab */}
        <TabsContent value="notes">
          <ClinicalNotesSection notes={clinicalNotes} onNotesChange={setClinicalNotes} />
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis">
          <DiagnosisSection diagnoses={diagnoses} onDiagnosesChange={setDiagnoses} />
        </TabsContent>

        {/* Test Results Tab */}
        <TabsContent value="tests">
          <TestResultsSection patientId={patientId} visitId={visitId} />
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <AdvancedAnalysisSection />

          {department === "Ayurveda" && <AyurvedicAnalysis />}

          {department === "Ophthalmology" && <OphthalmologyAnalysis />}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
        <Button variant="outline" size="lg">
          Save Draft
        </Button>
        <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
          <Save className="mr-2 h-4 w-4" />
          Complete Consultation
        </Button>
      </div>
    </div>
  )
}
