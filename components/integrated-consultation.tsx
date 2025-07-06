"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Pill, Leaf, TestTube, Camera, Activity } from "lucide-react"

import { ClinicalNotesSection } from "./consultation/clinical-notes-section"
import { DiagnosisSection } from "./consultation/diagnosis-section"
import { VitalSignsSection } from "./consultation/vital-signs-section"
import { AllopathicPrescription } from "./consultation/allopathic-prescription"
import { AyurvedicPrescription } from "./consultation/ayurvedic-prescription"
import { LaboratorySection } from "./laboratory-section"
import { RadiologySection } from "./radiology-section"
import { ProceduresSection } from "./procedures-section"
import { PrescriptionTemplateManager } from "./prescription-template-manager"

interface IntegratedConsultationProps {
  patientId: string
  visitId: string
  department?: string
}

export function IntegratedConsultation({
  patientId,
  visitId,
  department = "General Medicine",
}: IntegratedConsultationProps) {
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

  const handleLoadTemplate = (template: any) => {
    // Load allopathic medicines
    if (template.allopathicMedicines && template.allopathicMedicines.length > 0) {
      setAllopathicMedicines((prev) => [...prev, ...template.allopathicMedicines])
    }

    // Load ayurvedic medicines
    if (template.ayurvedicMedicines && template.ayurvedicMedicines.length > 0) {
      setAyurvedicMedicines((prev) => [...prev, ...template.ayurvedicMedicines])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Consultation</h1>
          <p className="text-gray-600">Complete consultation workflow</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {department}
        </Badge>
      </div>

      {/* Prescription Template Manager */}
      <PrescriptionTemplateManager
        allopathicMedicines={allopathicMedicines}
        ayurvedicMedicines={ayurvedicMedicines}
        onLoadTemplate={handleLoadTemplate}
        department={department}
      />

      {/* Main Consultation Tabs */}
      <Tabs defaultValue="clinical-notes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="clinical-notes" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Clinical Notes
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="allopathic" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Allopathic
          </TabsTrigger>
          <TabsTrigger value="ayurvedic" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Ayurvedic
          </TabsTrigger>
          <TabsTrigger value="laboratory" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Laboratory
          </TabsTrigger>
          <TabsTrigger value="radiology" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Radiology
          </TabsTrigger>
          <TabsTrigger value="procedures" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Procedures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinical-notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Clinical Assessment
              </CardTitle>
              <CardDescription>
                Document patient symptoms, examination findings, and clinical assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ClinicalNotesSection />
              <DiagnosisSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-6">
          <VitalSignsSection />
        </TabsContent>

        <TabsContent value="allopathic" className="space-y-6">
          <AllopathicPrescription medicines={allopathicMedicines} onMedicinesChange={setAllopathicMedicines} />
        </TabsContent>

        <TabsContent value="ayurvedic" className="space-y-6">
          <AyurvedicPrescription medicines={ayurvedicMedicines} onMedicinesChange={setAyurvedicMedicines} />
        </TabsContent>

        <TabsContent value="laboratory" className="space-y-6">
          <LaboratorySection />
        </TabsContent>

        <TabsContent value="radiology" className="space-y-6">
          <RadiologySection />
        </TabsContent>

        <TabsContent value="procedures" className="space-y-6">
          <ProceduresSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
