"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Stethoscope } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"

interface DiagnosisSectionProps {
  department: string
  data?: string[]
  onChange?: (data: string[]) => void
}

// Department-specific common diagnoses
const commonDiagnoses = {
  general: [
    "Hypertension",
    "Type 2 Diabetes Mellitus",
    "Upper Respiratory Tract Infection",
    "Gastroenteritis",
    "Migraine",
    "Anxiety Disorder",
    "Depression",
    "Osteoarthritis",
    "Allergic Rhinitis",
    "Urinary Tract Infection",
  ],
  cardiology: [
    "Essential Hypertension",
    "Coronary Artery Disease",
    "Atrial Fibrillation",
    "Heart Failure",
    "Myocardial Infarction",
    "Angina Pectoris",
    "Cardiomyopathy",
    "Valvular Heart Disease",
    "Pericarditis",
    "Arrhythmia",
  ],
  orthopedics: [
    "Osteoarthritis",
    "Rheumatoid Arthritis",
    "Fracture",
    "Sprain",
    "Tendinitis",
    "Bursitis",
    "Herniated Disc",
    "Sciatica",
    "Carpal Tunnel Syndrome",
    "Rotator Cuff Injury",
  ],
  neurology: [
    "Migraine",
    "Tension Headache",
    "Epilepsy",
    "Stroke",
    "Parkinson's Disease",
    "Multiple Sclerosis",
    "Neuropathy",
    "Dementia",
    "Alzheimer's Disease",
    "Seizure Disorder",
  ],
  pediatrics: [
    "Viral Upper Respiratory Infection",
    "Acute Otitis Media",
    "Bronchiolitis",
    "Gastroenteritis",
    "Febrile Seizure",
    "Asthma",
    "Allergic Rhinitis",
    "Eczema",
    "Growth Delay",
    "Developmental Delay",
  ],
  gynecology: [
    "Menstrual Irregularities",
    "Polycystic Ovary Syndrome",
    "Endometriosis",
    "Pelvic Inflammatory Disease",
    "Urinary Tract Infection",
    "Vaginal Infection",
    "Cervical Dysplasia",
    "Menopause",
    "Pregnancy",
    "Infertility",
  ],
  dermatology: [
    "Eczema",
    "Psoriasis",
    "Acne Vulgaris",
    "Contact Dermatitis",
    "Fungal Infection",
    "Bacterial Skin Infection",
    "Skin Cancer",
    "Rosacea",
    "Urticaria",
    "Seborrheic Dermatitis",
  ],
  ophthalmology: [
    "Refractive Error",
    "Cataract",
    "Glaucoma",
    "Diabetic Retinopathy",
    "Macular Degeneration",
    "Conjunctivitis",
    "Dry Eye Syndrome",
    "Retinal Detachment",
    "Stye",
    "Floaters",
  ],
  ayurveda: [
    "Vata Dosha Imbalance",
    "Pitta Dosha Imbalance",
    "Kapha Dosha Imbalance",
    "Ajirna (Indigestion)",
    "Amavata (Rheumatoid Arthritis)",
    "Prameha (Diabetes)",
    "Hridroga (Heart Disease)",
    "Shiroroga (Headache)",
    "Kasa (Cough)",
    "Jwara (Fever)",
  ],
}

export function DiagnosisSection({ department, data, onChange }: DiagnosisSectionProps) {
  const { activeConsultation, updateConsultationData } = useConsultation()

  const [diagnoses, setDiagnoses] = useState<string[]>([])
  const [newDiagnosis, setNewDiagnosis] = useState("")

  // Use ref to track if we're loading data to prevent auto-save during load
  const isLoadingRef = useRef(false)
  const consultationIdRef = useRef<string | null>(null)

  // Load diagnoses from active consultation only when consultation ID changes
  useEffect(() => {
    if (activeConsultation && activeConsultation.id !== consultationIdRef.current) {
      isLoadingRef.current = true
      consultationIdRef.current = activeConsultation.id || null

      setDiagnoses(activeConsultation.provisionalDiagnosis || activeConsultation.diagnosis || [])

      // Reset loading flag after a short delay
      setTimeout(() => {
        isLoadingRef.current = false
      }, 100)
    }
  }, [activeConsultation])

  // Debounced auto-save function
  const debouncedSave = useCallback(() => {
    if (!activeConsultation || isLoadingRef.current) return

    const timer = setTimeout(() => {
      updateConsultationData({ provisionalDiagnosis: diagnoses })
    }, 2000)

    return () => clearTimeout(timer)
  }, [activeConsultation, diagnoses, updateConsultationData])

  // Auto-save when diagnoses change
  useEffect(() => {
    if (!isLoadingRef.current) {
      const cleanup = debouncedSave()
      return cleanup
    }
  }, [debouncedSave])

  const handleAddDiagnosis = useCallback(() => {
    if (newDiagnosis.trim() && !diagnoses.includes(newDiagnosis.trim())) {
      setDiagnoses((prev) => [...prev, newDiagnosis.trim()])
      setNewDiagnosis("")
    }
  }, [newDiagnosis, diagnoses])

  const handleRemoveDiagnosis = useCallback((index: number) => {
    setDiagnoses((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddCommonDiagnosis = useCallback(
    (diagnosis: string) => {
      if (!diagnoses.includes(diagnosis)) {
        setDiagnoses((prev) => [...prev, diagnosis])
      }
    },
    [diagnoses],
  )

  // Get common diagnoses for the department
  const departmentDiagnoses = commonDiagnoses[department as keyof typeof commonDiagnoses] || commonDiagnoses.general

  if (!activeConsultation) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Consultation</h3>
          <p className="text-muted-foreground">Start a consultation to add diagnoses</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Provisional Diagnosis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Diagnosis */}
        <div className="space-y-3">
          <Label>Add Diagnosis</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter diagnosis..."
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddDiagnosis()}
            />
            <Button onClick={handleAddDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Diagnoses */}
        {diagnoses.length > 0 && (
          <div className="space-y-3">
            <Label>Current Diagnoses</Label>
            <div className="flex flex-wrap gap-2">
              {diagnoses.map((diagnosis, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                  onClick={() => handleRemoveDiagnosis(index)}
                >
                  {diagnosis}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Common Diagnoses for Department */}
        <div className="space-y-3">
          <Label>
            Common {department === "general" ? "General" : department.charAt(0).toUpperCase() + department.slice(1)}{" "}
            Diagnoses
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {departmentDiagnoses
              .filter((diagnosis) => !diagnoses.includes(diagnosis))
              .map((diagnosis) => (
                <Button
                  key={diagnosis}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-2 text-left bg-transparent"
                  onClick={() => handleAddCommonDiagnosis(diagnosis)}
                >
                  <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="text-sm">{diagnosis}</span>
                </Button>
              ))}
          </div>
        </div>

        {diagnoses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Stethoscope className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No diagnoses added yet</p>
            <p className="text-sm">Add a diagnosis or select from common options above</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
