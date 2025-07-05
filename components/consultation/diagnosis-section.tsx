"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, FileText, Search, Stethoscope } from "lucide-react"
import { toast } from "sonner"

interface DiagnosisData {
  primaryDiagnosis?: string
  secondaryDiagnoses?: string[]
  differentialDiagnoses?: string[]
  icdCodes?: { diagnosis: string; code: string }[]
  clinicalNotes?: string
  prognosis?: string
  severity?: string
}

interface DiagnosisSectionProps {
  department: string
  data: DiagnosisData
  onChange: (data: DiagnosisData) => void
}

// Department-specific diagnosis databases
const diagnosisDatabase = {
  general: [
    "Upper Respiratory Tract Infection",
    "Viral Fever",
    "Gastroenteritis",
    "Hypertension",
    "Type 2 Diabetes Mellitus",
    "Migraine",
    "Tension Headache",
    "Acid Peptic Disease",
    "Irritable Bowel Syndrome",
    "Urinary Tract Infection",
    "Bronchitis",
    "Pneumonia",
    "Allergic Rhinitis",
    "Dermatitis",
    "Anxiety Disorder",
    "Depression",
    "Insomnia",
    "Vitamin D Deficiency",
    "Iron Deficiency Anemia",
    "Hypothyroidism",
  ],
  cardiology: [
    "Coronary Artery Disease",
    "Myocardial Infarction",
    "Heart Failure",
    "Atrial Fibrillation",
    "Hypertension",
    "Valvular Heart Disease",
    "Cardiomyopathy",
    "Pericarditis",
    "Angina Pectoris",
    "Arrhythmia",
    "Pulmonary Embolism",
    "Deep Vein Thrombosis",
    "Aortic Stenosis",
    "Mitral Regurgitation",
    "Bradycardia",
    "Tachycardia",
    "Syncope",
    "Chest Pain",
    "Dyspnea",
    "Peripheral Artery Disease",
  ],
  orthopedics: [
    "Osteoarthritis",
    "Rheumatoid Arthritis",
    "Fracture",
    "Sprain",
    "Strain",
    "Disc Herniation",
    "Sciatica",
    "Frozen Shoulder",
    "Tennis Elbow",
    "Carpal Tunnel Syndrome",
    "Osteoporosis",
    "Scoliosis",
    "Plantar Fasciitis",
    "ACL Tear",
    "Meniscus Tear",
    "Rotator Cuff Tear",
    "Bursitis",
    "Tendinitis",
    "Fibromyalgia",
    "Back Pain",
  ],
  neurology: [
    "Migraine",
    "Tension Headache",
    "Epilepsy",
    "Stroke",
    "Parkinson's Disease",
    "Alzheimer's Disease",
    "Multiple Sclerosis",
    "Neuropathy",
    "Seizure Disorder",
    "Vertigo",
    "Bell's Palsy",
    "Trigeminal Neuralgia",
    "Restless Leg Syndrome",
    "Sleep Apnea",
    "Dementia",
    "Memory Loss",
    "Tremor",
    "Weakness",
    "Numbness",
    "Headache",
  ],
  dermatology: [
    "Eczema",
    "Psoriasis",
    "Acne Vulgaris",
    "Dermatitis",
    "Urticaria",
    "Fungal Infection",
    "Bacterial Infection",
    "Viral Infection",
    "Skin Cancer",
    "Melanoma",
    "Basal Cell Carcinoma",
    "Squamous Cell Carcinoma",
    "Rosacea",
    "Vitiligo",
    "Alopecia",
    "Seborrheic Dermatitis",
    "Contact Dermatitis",
    "Cellulitis",
    "Impetigo",
    "Herpes Simplex",
  ],
  ophthalmology: [
    "Refractive Error",
    "Cataract",
    "Glaucoma",
    "Diabetic Retinopathy",
    "Macular Degeneration",
    "Dry Eye Syndrome",
    "Conjunctivitis",
    "Stye",
    "Chalazion",
    "Retinal Detachment",
    "Floaters",
    "Flashes",
    "Double Vision",
    "Blurred Vision",
    "Eye Pain",
    "Red Eye",
    "Ptosis",
    "Amblyopia",
    "Strabismus",
    "Uveitis",
  ],
  pediatrics: [
    "Upper Respiratory Infection",
    "Gastroenteritis",
    "Fever",
    "Asthma",
    "Allergic Rhinitis",
    "Otitis Media",
    "Pharyngitis",
    "Bronchiolitis",
    "Pneumonia",
    "Urinary Tract Infection",
    "Constipation",
    "Diarrhea",
    "Eczema",
    "Diaper Rash",
    "Growth Delay",
    "Developmental Delay",
    "ADHD",
    "Autism Spectrum Disorder",
    "Seizure Disorder",
    "Anemia",
  ],
  gynecology: [
    "Menstrual Irregularities",
    "PCOS",
    "Endometriosis",
    "Fibroids",
    "Ovarian Cysts",
    "Pelvic Inflammatory Disease",
    "Urinary Tract Infection",
    "Vaginal Infection",
    "Cervical Dysplasia",
    "Menopause",
    "Infertility",
    "Pregnancy",
    "Miscarriage",
    "Ectopic Pregnancy",
    "Gestational Diabetes",
    "Preeclampsia",
    "Postpartum Depression",
    "Breast Cancer",
    "Cervical Cancer",
    "Ovarian Cancer",
  ],
}

const severityOptions = ["Mild", "Moderate", "Severe", "Critical", "Stable", "Unstable", "Acute", "Chronic", "Resolved"]

const prognosisOptions = [
  "Excellent",
  "Good",
  "Fair",
  "Guarded",
  "Poor",
  "Complete recovery expected",
  "Partial recovery expected",
  "Chronic condition",
  "Progressive condition",
  "Terminal",
]

export function DiagnosisSection({ department, data, onChange }: DiagnosisSectionProps) {
  const [localData, setLocalData] = useState<DiagnosisData>(data || {})
  const [searchTerm, setSearchTerm] = useState("")
  const [newSecondaryDiagnosis, setNewSecondaryDiagnosis] = useState("")
  const [newDifferentialDiagnosis, setNewDifferentialDiagnosis] = useState("")

  // Get diagnoses for current department
  const availableDiagnoses =
    diagnosisDatabase[department as keyof typeof diagnosisDatabase] || diagnosisDatabase.general

  // Filter diagnoses based on search term
  const filteredDiagnoses = availableDiagnoses.filter((diagnosis) =>
    diagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    setLocalData(data || {})
  }, [data])

  useEffect(() => {
    onChange(localData)
  }, [localData, onChange])

  const updateField = (field: keyof DiagnosisData, value: any) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addSecondaryDiagnosis = () => {
    if (newSecondaryDiagnosis && newSecondaryDiagnosis !== "default") {
      const currentDiagnoses = localData.secondaryDiagnoses || []
      if (!currentDiagnoses.includes(newSecondaryDiagnosis)) {
        updateField("secondaryDiagnoses", [...currentDiagnoses, newSecondaryDiagnosis])
        setNewSecondaryDiagnosis("")
        toast.success("Secondary diagnosis added")
      }
    }
  }

  const removeSecondaryDiagnosis = (index: number) => {
    const currentDiagnoses = localData.secondaryDiagnoses || []
    updateField(
      "secondaryDiagnoses",
      currentDiagnoses.filter((_, i) => i !== index),
    )
    toast.success("Secondary diagnosis removed")
  }

  const addDifferentialDiagnosis = () => {
    if (newDifferentialDiagnosis && newDifferentialDiagnosis !== "default") {
      const currentDiagnoses = localData.differentialDiagnoses || []
      if (!currentDiagnoses.includes(newDifferentialDiagnosis)) {
        updateField("differentialDiagnoses", [...currentDiagnoses, newDifferentialDiagnosis])
        setNewDifferentialDiagnosis("")
        toast.success("Differential diagnosis added")
      }
    }
  }

  const removeDifferentialDiagnosis = (index: number) => {
    const currentDiagnoses = localData.differentialDiagnoses || []
    updateField(
      "differentialDiagnoses",
      currentDiagnoses.filter((_, i) => i !== index),
    )
    toast.success("Differential diagnosis removed")
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Primary Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Search and Select Primary Diagnosis</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search diagnoses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={localData.primaryDiagnosis || "default"}
                onValueChange={(value) => updateField("primaryDiagnosis", value === "default" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary diagnosis" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="default" disabled>
                    Select a diagnosis...
                  </SelectItem>
                  {filteredDiagnoses.map((diagnosis) => (
                    <SelectItem key={diagnosis} value={diagnosis}>
                      {diagnosis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {localData.primaryDiagnosis && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-600 text-white">Primary</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateField("primaryDiagnosis", "")}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium text-blue-900 mt-2">{localData.primaryDiagnosis}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={localData.severity || "default"}
                onValueChange={(value) => updateField("severity", value === "default" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" disabled>
                    Select severity...
                  </SelectItem>
                  {severityOptions.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prognosis</Label>
              <Select
                value={localData.prognosis || "default"}
                onValueChange={(value) => updateField("prognosis", value === "default" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select prognosis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" disabled>
                    Select prognosis...
                  </SelectItem>
                  {prognosisOptions.map((prognosis) => (
                    <SelectItem key={prognosis} value={prognosis}>
                      {prognosis}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Diagnoses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Secondary Diagnoses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newSecondaryDiagnosis || "default"} onValueChange={setNewSecondaryDiagnosis}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select secondary diagnosis" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="default" disabled>
                  Select a diagnosis...
                </SelectItem>
                {filteredDiagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type custom diagnosis..."
              value={newSecondaryDiagnosis === "default" ? "" : newSecondaryDiagnosis}
              onChange={(e) => setNewSecondaryDiagnosis(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addSecondaryDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {(localData.secondaryDiagnoses || []).map((diagnosis, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Secondary
                  </Badge>
                  <span className="font-medium text-green-900">{diagnosis}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSecondaryDiagnosis(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Differential Diagnoses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            Differential Diagnoses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newDifferentialDiagnosis || "default"} onValueChange={setNewDifferentialDiagnosis}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select differential diagnosis" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="default" disabled>
                  Select a diagnosis...
                </SelectItem>
                {filteredDiagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type custom diagnosis..."
              value={newDifferentialDiagnosis === "default" ? "" : newDifferentialDiagnosis}
              onChange={(e) => setNewDifferentialDiagnosis(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addDifferentialDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {(localData.differentialDiagnoses || []).map((diagnosis, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Differential
                  </Badge>
                  <span className="font-medium text-orange-900">{diagnosis}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDifferentialDiagnosis(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter detailed clinical notes, reasoning for diagnosis, and any additional observations..."
            value={localData.clinicalNotes || ""}
            onChange={(e) => updateField("clinicalNotes", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  )
}
