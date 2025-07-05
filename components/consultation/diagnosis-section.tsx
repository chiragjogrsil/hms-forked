"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Search } from "lucide-react"
import { useConsultation, type Diagnosis } from "@/contexts/consultation-context"
import { Textarea } from "@/components/ui/textarea"

// Department-specific common diagnoses
const commonDiagnoses = {
  "General Medicine": [
    { name: "Viral Fever", icd10Code: "R50.9" },
    { name: "Upper Respiratory Tract Infection", icd10Code: "J06.9" },
    { name: "Gastroenteritis", icd10Code: "K59.1" },
    { name: "Hypertension", icd10Code: "I10" },
    { name: "Diabetes Mellitus Type 2", icd10Code: "E11.9" },
    { name: "Headache", icd10Code: "R51" },
    { name: "Back Pain", icd10Code: "M54.9" },
    { name: "Anxiety Disorder", icd10Code: "F41.9" },
  ],
  Cardiology: [
    { name: "Essential Hypertension", icd10Code: "I10" },
    { name: "Coronary Artery Disease", icd10Code: "I25.9" },
    { name: "Atrial Fibrillation", icd10Code: "I48" },
    { name: "Heart Failure", icd10Code: "I50.9" },
    { name: "Chest Pain", icd10Code: "R06.02" },
    { name: "Dyslipidemia", icd10Code: "E78.5" },
  ],
  Orthopedics: [
    { name: "Osteoarthritis", icd10Code: "M19.9" },
    { name: "Fracture", icd10Code: "S72.9" },
    { name: "Lower Back Pain", icd10Code: "M54.5" },
    { name: "Shoulder Pain", icd10Code: "M25.511" },
    { name: "Knee Pain", icd10Code: "M25.561" },
    { name: "Sprain", icd10Code: "S93.4" },
  ],
  Neurology: [
    { name: "Migraine", icd10Code: "G43.9" },
    { name: "Epilepsy", icd10Code: "G40.9" },
    { name: "Stroke", icd10Code: "I64" },
    { name: "Peripheral Neuropathy", icd10Code: "G62.9" },
    { name: "Parkinson Disease", icd10Code: "G20" },
    { name: "Dementia", icd10Code: "F03.90" },
  ],
  Pediatrics: [
    { name: "Viral Fever", icd10Code: "R50.9" },
    { name: "Acute Bronchitis", icd10Code: "J20.9" },
    { name: "Gastroenteritis", icd10Code: "K59.1" },
    { name: "Asthma", icd10Code: "J45.9" },
    { name: "Allergic Rhinitis", icd10Code: "J30.9" },
    { name: "Growth Delay", icd10Code: "R62.50" },
  ],
  Gynecology: [
    { name: "Menstrual Irregularities", icd10Code: "N92.6" },
    { name: "PCOS", icd10Code: "E28.2" },
    { name: "UTI", icd10Code: "N39.0" },
    { name: "Pregnancy", icd10Code: "Z34.90" },
    { name: "Menopause", icd10Code: "N95.1" },
    { name: "Pelvic Pain", icd10Code: "R10.2" },
  ],
  Dermatology: [
    { name: "Eczema", icd10Code: "L30.9" },
    { name: "Acne", icd10Code: "L70.9" },
    { name: "Psoriasis", icd10Code: "L40.9" },
    { name: "Fungal Infection", icd10Code: "B35.9" },
    { name: "Allergic Dermatitis", icd10Code: "L23.9" },
    { name: "Hair Loss", icd10Code: "L65.9" },
  ],
  Ophthalmology: [
    { name: "Refractive Error", icd10Code: "H52.9" },
    { name: "Conjunctivitis", icd10Code: "H10.9" },
    { name: "Cataract", icd10Code: "H25.9" },
    { name: "Glaucoma", icd10Code: "H40.9" },
    { name: "Dry Eyes", icd10Code: "H04.12" },
    { name: "Diabetic Retinopathy", icd10Code: "E11.319" },
  ],
  Ayurveda: [
    { name: "Vata Dosha Imbalance", icd10Code: "Z51.89" },
    { name: "Pitta Dosha Imbalance", icd10Code: "Z51.89" },
    { name: "Kapha Dosha Imbalance", icd10Code: "Z51.89" },
    { name: "Ama (Toxins)", icd10Code: "Z51.89" },
    { name: "Agni Mandya (Weak Digestion)", icd10Code: "K30" },
    { name: "Stress Related Disorders", icd10Code: "F43.9" },
  ],
}

export function DiagnosisSection() {
  const { currentConsultation, updateConsultation } = useConsultation()
  const [searchTerm, setSearchTerm] = useState("")
  const [customDiagnosis, setCustomDiagnosis] = useState("")
  const [customIcd10, setCustomIcd10] = useState("")
  const [customNotes, setCustomNotes] = useState("")

  if (!currentConsultation) return null

  const department = currentConsultation.department
  const departmentDiagnoses = commonDiagnoses[department as keyof typeof commonDiagnoses] || []

  const filteredDiagnoses = departmentDiagnoses.filter(
    (diagnosis) =>
      diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.icd10Code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addDiagnosis = (diagnosis: { name: string; icd10Code?: string }, notes?: string) => {
    const newDiagnosis: Diagnosis = {
      id: `diag-${Date.now()}`,
      name: diagnosis.name,
      icd10Code: diagnosis.icd10Code,
      notes,
    }

    const updatedDiagnoses = [...currentConsultation.diagnoses, newDiagnosis]
    updateConsultation({ diagnoses: updatedDiagnoses })
  }

  const removeDiagnosis = (diagnosisId: string) => {
    const updatedDiagnoses = currentConsultation.diagnoses.filter((d) => d.id !== diagnosisId)
    updateConsultation({ diagnoses: updatedDiagnoses })
  }

  const addCustomDiagnosis = () => {
    if (!customDiagnosis.trim()) return

    addDiagnosis({ name: customDiagnosis, icd10Code: customIcd10 || undefined }, customNotes || undefined)

    setCustomDiagnosis("")
    setCustomIcd10("")
    setCustomNotes("")
  }

  const isAlreadyAdded = (diagnosisName: string) => {
    return currentConsultation.diagnoses.some((d) => d.name === diagnosisName)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Diagnosis</span>
          <Badge variant="secondary">{currentConsultation.diagnoses.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Diagnoses */}
        {currentConsultation.diagnoses.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Diagnoses</Label>
            <div className="flex flex-wrap gap-2">
              {currentConsultation.diagnoses.map((diagnosis) => (
                <Badge key={diagnosis.id} variant="default" className="flex items-center gap-1">
                  <span>{diagnosis.name}</span>
                  {diagnosis.icd10Code && <span className="text-xs opacity-75">({diagnosis.icd10Code})</span>}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeDiagnosis(diagnosis.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Common Diagnoses for Department */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Common Diagnoses - {department}</Label>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diagnoses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {filteredDiagnoses.map((diagnosis, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`justify-start h-auto p-3 ${
                  isAlreadyAdded(diagnosis.name) ? "bg-green-50 border-green-200 text-green-700" : "hover:bg-muted"
                }`}
                onClick={() => !isAlreadyAdded(diagnosis.name) && addDiagnosis(diagnosis)}
                disabled={isAlreadyAdded(diagnosis.name)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{diagnosis.name}</span>
                  <span className="text-xs text-muted-foreground">{diagnosis.icd10Code}</span>
                </div>
                {!isAlreadyAdded(diagnosis.name) && <Plus className="h-4 w-4 ml-auto" />}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Custom Diagnosis */}
        <div className="space-y-3 border-t pt-4">
          <Label className="text-sm font-medium">Add Custom Diagnosis</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="custom-diagnosis" className="text-xs">
                Diagnosis Name *
              </Label>
              <Input
                id="custom-diagnosis"
                placeholder="Enter diagnosis name"
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-icd10" className="text-xs">
                ICD-10 Code
              </Label>
              <Input
                id="custom-icd10"
                placeholder="Enter ICD-10 code"
                value={customIcd10}
                onChange={(e) => setCustomIcd10(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-notes" className="text-xs">
              Notes
            </Label>
            <Textarea
              id="custom-notes"
              placeholder="Additional notes for this diagnosis"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={2}
            />
          </div>
          <Button onClick={addCustomDiagnosis} disabled={!customDiagnosis.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Diagnosis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
