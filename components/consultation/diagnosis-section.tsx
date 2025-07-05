"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Stethoscope, AlertTriangle, Search } from "lucide-react"
import { toast } from "sonner"

interface DiagnosisSectionProps {
  department: string
  data: string[]
  onChange: (data: string[]) => void
}

// Department-specific common diagnoses
const commonDiagnoses = {
  general: [
    "Upper Respiratory Tract Infection",
    "Viral Fever",
    "Gastroenteritis",
    "Hypertension",
    "Type 2 Diabetes Mellitus",
    "Hyperlipidemia",
    "Migraine",
    "Tension Headache",
    "Allergic Rhinitis",
    "Urinary Tract Infection",
    "Gastroesophageal Reflux Disease",
    "Irritable Bowel Syndrome",
    "Anxiety Disorder",
    "Depression",
    "Insomnia",
  ],
  cardiology: [
    "Essential Hypertension",
    "Coronary Artery Disease",
    "Myocardial Infarction",
    "Atrial Fibrillation",
    "Heart Failure",
    "Angina Pectoris",
    "Arrhythmia",
    "Valvular Heart Disease",
    "Cardiomyopathy",
    "Pericarditis",
    "Deep Vein Thrombosis",
    "Pulmonary Embolism",
    "Hyperlipidemia",
    "Peripheral Artery Disease",
  ],
  orthopedics: [
    "Osteoarthritis",
    "Rheumatoid Arthritis",
    "Lower Back Pain",
    "Cervical Spondylosis",
    "Lumbar Spondylosis",
    "Frozen Shoulder",
    "Tennis Elbow",
    "Carpal Tunnel Syndrome",
    "Fracture",
    "Sprain",
    "Strain",
    "Osteoporosis",
    "Sciatica",
    "Herniated Disc",
    "Plantar Fasciitis",
    "Rotator Cuff Injury",
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
    "Vertigo",
    "Bell's Palsy",
    "Trigeminal Neuralgia",
    "Seizure Disorder",
    "Memory Loss",
    "Dementia",
    "Peripheral Neuropathy",
  ],
  dermatology: [
    "Atopic Dermatitis",
    "Psoriasis",
    "Acne Vulgaris",
    "Urticaria",
    "Contact Dermatitis",
    "Seborrheic Dermatitis",
    "Fungal Infection",
    "Bacterial Skin Infection",
    "Viral Skin Infection",
    "Skin Cancer",
    "Melanoma",
    "Vitiligo",
    "Alopecia",
    "Rosacea",
    "Eczema",
  ],
  ophthalmology: [
    "Refractive Error",
    "Cataract",
    "Glaucoma",
    "Diabetic Retinopathy",
    "Dry Eye Syndrome",
    "Conjunctivitis",
    "Stye",
    "Chalazion",
    "Macular Degeneration",
    "Retinal Detachment",
    "Uveitis",
    "Corneal Ulcer",
    "Pterygium",
    "Floaters",
    "Night Blindness",
  ],
  pediatrics: [
    "Upper Respiratory Infection",
    "Gastroenteritis",
    "Fever of Unknown Origin",
    "Asthma",
    "Allergic Rhinitis",
    "Otitis Media",
    "Pneumonia",
    "Bronchiolitis",
    "Hand, Foot and Mouth Disease",
    "Chickenpox",
    "Measles",
    "Growth Retardation",
    "Nutritional Deficiency",
    "Developmental Delay",
  ],
  gynecology: [
    "Menstrual Irregularities",
    "PCOS",
    "Endometriosis",
    "Uterine Fibroids",
    "Ovarian Cysts",
    "Pelvic Inflammatory Disease",
    "Urinary Tract Infection",
    "Vaginal Infection",
    "Cervical Dysplasia",
    "Menopause",
    "Infertility",
    "Pregnancy",
    "Gestational Diabetes",
    "Preeclampsia",
  ],
  ayurveda: [
    "Vata Dosha Imbalance",
    "Pitta Dosha Imbalance",
    "Kapha Dosha Imbalance",
    "Ajirna (Indigestion)",
    "Amlapitta (Hyperacidity)",
    "Grahani (IBS)",
    "Arsha (Hemorrhoids)",
    "Prameha (Diabetes)",
    "Hridroga (Heart Disease)",
    "Sandhivata (Arthritis)",
    "Kasa (Cough)",
    "Swasa (Asthma)",
    "Jwara (Fever)",
    "Shirahshula (Headache)",
    "Anidra (Insomnia)",
    "Chinta (Anxiety)",
  ],
}

export function DiagnosisSection({ department, data, onChange }: DiagnosisSectionProps) {
  const [diagnoses, setDiagnoses] = useState<string[]>(data || [])
  const [newDiagnosis, setNewDiagnosis] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [diagnosisType, setDiagnosisType] = useState<"primary" | "secondary" | "differential">("primary")

  // Get diagnoses for current department
  const availableDiagnoses = commonDiagnoses[department as keyof typeof commonDiagnoses] || commonDiagnoses.general

  // Filter diagnoses based on search term
  const filteredDiagnoses = availableDiagnoses.filter((diagnosis) =>
    diagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    setDiagnoses(data || [])
  }, [data])

  useEffect(() => {
    onChange(diagnoses)
  }, [diagnoses, onChange])

  const addDiagnosis = () => {
    if (!newDiagnosis.trim()) {
      toast.error("Please enter a diagnosis")
      return
    }

    if (diagnoses.includes(newDiagnosis.trim())) {
      toast.error("This diagnosis is already added")
      return
    }

    setDiagnoses((prev) => [...prev, newDiagnosis.trim()])
    setNewDiagnosis("")
    setSearchTerm("")
    toast.success("Diagnosis added successfully")
  }

  const removeDiagnosis = (index: number) => {
    setDiagnoses((prev) => prev.filter((_, i) => i !== index))
    toast.success("Diagnosis removed")
  }

  const addFromCommon = (diagnosis: string) => {
    if (diagnoses.includes(diagnosis)) {
      toast.error("This diagnosis is already added")
      return
    }

    setDiagnoses((prev) => [...prev, diagnosis])
    toast.success("Diagnosis added successfully")
  }

  return (
    <div className="space-y-6">
      {/* Current Diagnoses */}
      {diagnoses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Current Diagnoses
              <Badge variant="secondary">{diagnoses.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((diagnosis, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-2 p-2 bg-blue-50 border-blue-200 text-blue-800"
                >
                  <span>{diagnosis}</span>
                  <button onClick={() => removeDiagnosis(index)} className="hover:text-red-600 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Diagnosis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Add Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Add Custom */}
          <div className="space-y-2">
            <Label>Search or Add Custom Diagnosis</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search diagnoses or type custom..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setNewDiagnosis(e.target.value)
                  }}
                  className="pl-10"
                />
              </div>
              <Button onClick={addDiagnosis} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Common Diagnoses for Department */}
          <div className="space-y-2">
            <Label>Common {department.charAt(0).toUpperCase() + department.slice(1)} Diagnoses</Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-1 gap-1">
                {filteredDiagnoses.map((diagnosis, index) => (
                  <button
                    key={index}
                    onClick={() => addFromCommon(diagnosis)}
                    className="text-left p-2 hover:bg-white hover:shadow-sm rounded border-transparent border hover:border-gray-200 transition-all text-sm"
                    disabled={diagnoses.includes(diagnosis)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={diagnoses.includes(diagnosis) ? "text-gray-400" : "text-gray-700"}>
                        {diagnosis}
                      </span>
                      {diagnoses.includes(diagnosis) && (
                        <Badge variant="secondary" className="text-xs">
                          Added
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Add Buttons for Most Common */}
          <div className="space-y-2">
            <Label>Quick Add (Most Common)</Label>
            <div className="flex flex-wrap gap-2">
              {availableDiagnoses.slice(0, 6).map((diagnosis, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addFromCommon(diagnosis)}
                  disabled={diagnoses.includes(diagnosis)}
                  className="text-xs"
                >
                  {diagnosis}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Guidelines */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Diagnosis Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-700">
          <ul className="space-y-1">
            <li>• List primary diagnosis first, followed by secondary conditions</li>
            <li>• Use specific ICD-10 codes when available</li>
            <li>• Include differential diagnoses when uncertain</li>
            <li>• Document severity and stage when applicable</li>
            <li>• Consider comorbidities and their interactions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
