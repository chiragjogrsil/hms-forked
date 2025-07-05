"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface DiagnosisSectionProps {
  department: string
  data: string[]
  onChange: (data: string[]) => void
}

export function DiagnosisSection({ department, data, onChange }: DiagnosisSectionProps) {
  const [customDiagnosis, setCustomDiagnosis] = useState("")
  const [isDataPrefilled, setIsDataPrefilled] = useState(false)

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : []

  // Log when data is received for debugging - only when data actually changes
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setIsDataPrefilled(true)
      console.log("🔄 DiagnosisSection: Data prefilled:", data)
    }
  }, [data])

  const getCommonDiagnoses = () => {
    const diagnoses = {
      general: [
        "Upper Respiratory Tract Infection",
        "Hypertension",
        "Type 2 Diabetes Mellitus",
        "Gastroenteritis",
        "Migraine",
        "Anxiety Disorder",
        "Bronchitis",
        "Urinary Tract Infection",
      ],
      ayurveda: [
        "Vata Dosha Imbalance",
        "Pitta Dosha Imbalance",
        "Kapha Dosha Imbalance",
        "Agnimandya (Digestive Fire Weakness)",
        "Ama (Toxin Accumulation)",
        "Vata-Pitta Prakopa",
        "Kapha-Vata Prakopa",
        "Ojas Kshaya (Immunity Depletion)",
      ],
      dental: [
        "Dental Caries",
        "Gingivitis",
        "Periodontitis",
        "Tooth Abscess",
        "Oral Thrush",
        "Temporomandibular Joint Disorder",
        "Tooth Sensitivity",
        "Malocclusion",
      ],
      ophthalmology: [
        "Myopia",
        "Hyperopia",
        "Astigmatism",
        "Glaucoma",
        "Cataract",
        "Diabetic Retinopathy",
        "Dry Eye Syndrome",
        "Conjunctivitis",
      ],
      cardiology: [
        "Essential Hypertension",
        "Atypical Chest Pain",
        "Coronary Artery Disease",
        "Heart Failure",
        "Arrhythmia",
        "Myocardial Infarction",
        "Angina Pectoris",
        "Valvular Heart Disease",
      ],
      orthopedics: [
        "Mechanical Lower Back Pain",
        "Lumbar Muscle Strain",
        "Osteoarthritis",
        "Rheumatoid Arthritis",
        "Fracture",
        "Sprain",
        "Tendinitis",
        "Bursitis",
      ],
    }
    return diagnoses[department as keyof typeof diagnoses] || diagnoses.general
  }

  const addDiagnosis = (diagnosis: string) => {
    if (!safeData.includes(diagnosis)) {
      onChange([...safeData, diagnosis])
    }
  }

  const removeDiagnosis = (diagnosis: string) => {
    onChange(safeData.filter((d) => d !== diagnosis))
  }

  const addCustomDiagnosis = () => {
    if (customDiagnosis.trim() && !safeData.includes(customDiagnosis.trim())) {
      onChange([...safeData, customDiagnosis.trim()])
      setCustomDiagnosis("")
    }
  }

  return (
    <div className="space-y-4">
      {isDataPrefilled && safeData.length > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            ✅ {safeData.length} diagnosis(es) loaded from previous consultation
          </p>
        </div>
      )}

      <div>
        <Label>Common Diagnoses</Label>
        <Select onValueChange={addDiagnosis}>
          <SelectTrigger>
            <SelectValue placeholder="Select a diagnosis" />
          </SelectTrigger>
          <SelectContent>
            {getCommonDiagnoses()
              .filter((diagnosis) => !safeData.includes(diagnosis))
              .map((diagnosis) => (
                <SelectItem key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Custom Diagnosis</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom diagnosis"
            value={customDiagnosis}
            onChange={(e) => setCustomDiagnosis(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomDiagnosis()}
          />
          <Button onClick={addCustomDiagnosis} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {safeData.length > 0 && (
        <div>
          <Label>Selected Diagnoses</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {safeData.map((diagnosis, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {diagnosis}
                <button
                  onClick={() => removeDiagnosis(diagnosis)}
                  className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
