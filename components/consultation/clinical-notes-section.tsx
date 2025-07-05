"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, FileText, AlertCircle, History, User } from "lucide-react"

interface ClinicalNotesData {
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string[]
  familyHistory?: string
  socialHistory?: string
  allergies?: string[]
  currentMedications?: string[]
  systemReview?: {
    cardiovascular?: string
    respiratory?: string
    gastrointestinal?: string
    neurological?: string
    musculoskeletal?: string
    genitourinary?: string
    endocrine?: string
    dermatological?: string
  }
  clinicalFindings?: string
  additionalNotes?: string
}

interface ClinicalNotesSectionProps {
  data: string | ClinicalNotesData
  onChange: (data: ClinicalNotesData) => void
}

// Common medical history options
const commonMedicalHistory = [
  "Hypertension",
  "Diabetes Mellitus Type 2",
  "Diabetes Mellitus Type 1",
  "Hyperlipidemia",
  "Coronary Artery Disease",
  "Myocardial Infarction",
  "Stroke",
  "Asthma",
  "COPD",
  "Chronic Kidney Disease",
  "Thyroid Disorders",
  "Depression",
  "Anxiety",
  "Arthritis",
  "Osteoporosis",
  "Cancer History",
  "Surgical History",
]

const commonAllergies = [
  "Penicillin",
  "Sulfa drugs",
  "Aspirin",
  "NSAIDs",
  "Shellfish",
  "Nuts",
  "Eggs",
  "Milk",
  "Latex",
  "Dust",
  "Pollen",
  "Pet dander",
  "No known allergies",
]

const systemReviewOptions = {
  cardiovascular: ["Chest pain", "Palpitations", "Shortness of breath", "Edema", "Syncope"],
  respiratory: ["Cough", "Shortness of breath", "Wheezing", "Chest pain", "Sputum production"],
  gastrointestinal: ["Nausea", "Vomiting", "Diarrhea", "Constipation", "Abdominal pain", "Heartburn"],
  neurological: ["Headache", "Dizziness", "Weakness", "Numbness", "Memory problems", "Seizures"],
  musculoskeletal: ["Joint pain", "Muscle pain", "Stiffness", "Swelling", "Limited mobility"],
  genitourinary: ["Urinary frequency", "Urgency", "Burning", "Blood in urine", "Incontinence"],
  endocrine: ["Weight changes", "Heat/cold intolerance", "Excessive thirst", "Frequent urination"],
  dermatological: ["Rash", "Itching", "Skin changes", "Hair loss", "Nail changes"],
}

export function ClinicalNotesSection({ data, onChange }: ClinicalNotesSectionProps) {
  // Initialize local data with proper defaults
  const [localData, setLocalData] = useState<ClinicalNotesData>(() => {
    if (typeof data === "string") {
      // If data is a string (legacy format), convert to new format
      return {
        chiefComplaint: data || "",
        historyOfPresentIllness: "",
        pastMedicalHistory: [],
        familyHistory: "",
        socialHistory: "",
        allergies: [],
        currentMedications: [],
        systemReview: {
          cardiovascular: "",
          respiratory: "",
          gastrointestinal: "",
          neurological: "",
          musculoskeletal: "",
          genitourinary: "",
          endocrine: "",
          dermatological: "",
        },
        clinicalFindings: "",
        additionalNotes: "",
      }
    } else {
      // Ensure all required properties exist with proper defaults
      return {
        chiefComplaint: data?.chiefComplaint || "",
        historyOfPresentIllness: data?.historyOfPresentIllness || "",
        pastMedicalHistory: data?.pastMedicalHistory || [],
        familyHistory: data?.familyHistory || "",
        socialHistory: data?.socialHistory || "",
        allergies: data?.allergies || [],
        currentMedications: data?.currentMedications || [],
        systemReview: {
          cardiovascular: data?.systemReview?.cardiovascular || "",
          respiratory: data?.systemReview?.respiratory || "",
          gastrointestinal: data?.systemReview?.gastrointestinal || "",
          neurological: data?.systemReview?.neurological || "",
          musculoskeletal: data?.systemReview?.musculoskeletal || "",
          genitourinary: data?.systemReview?.genitourinary || "",
          endocrine: data?.systemReview?.endocrine || "",
          dermatological: data?.systemReview?.dermatological || "",
        },
        clinicalFindings: data?.clinicalFindings || "",
        additionalNotes: data?.additionalNotes || "",
      }
    }
  })

  const [newMedicalHistory, setNewMedicalHistory] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")

  // Update parent when local data changes
  useEffect(() => {
    onChange(localData)
  }, [localData, onChange])

  const updateField = (field: keyof ClinicalNotesData, value: any) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateSystemReview = (system: string, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      systemReview: {
        ...prev.systemReview,
        [system]: value,
      },
    }))
  }

  const addToArray = (field: keyof ClinicalNotesData, value: string) => {
    if (!value.trim()) return

    setLocalData((prev) => {
      const currentArray = (prev[field] as string[]) || []
      if (!currentArray.includes(value.trim())) {
        return {
          ...prev,
          [field]: [...currentArray, value.trim()],
        }
      }
      return prev
    })
  }

  const removeFromArray = (field: keyof ClinicalNotesData, index: number) => {
    setLocalData((prev) => {
      const currentArray = (prev[field] as string[]) || []
      return {
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index),
      }
    })
  }

  const addMedicalHistory = () => {
    if (newMedicalHistory && newMedicalHistory !== "default") {
      addToArray("pastMedicalHistory", newMedicalHistory)
      setNewMedicalHistory("")
    }
  }

  const addAllergy = () => {
    if (newAllergy && newAllergy !== "default") {
      addToArray("allergies", newAllergy)
      setNewAllergy("")
    }
  }

  const addMedication = () => {
    if (newMedication) {
      addToArray("currentMedications", newMedication)
      setNewMedication("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Chief Complaint */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Chief Complaint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter the patient's primary concern or reason for visit..."
            value={localData.chiefComplaint || ""}
            onChange={(e) => updateField("chiefComplaint", e.target.value)}
            rows={3}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* History of Present Illness */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-500" />
            History of Present Illness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe the current illness, symptoms, timeline, and relevant details..."
            value={localData.historyOfPresentIllness || ""}
            onChange={(e) => updateField("historyOfPresentIllness", e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Past Medical History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-green-500" />
            Past Medical History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newMedicalHistory || "default"} onValueChange={setNewMedicalHistory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select common condition or type custom..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select a condition...
                </SelectItem>
                {commonMedicalHistory.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type custom condition..."
              value={newMedicalHistory === "default" ? "" : newMedicalHistory}
              onChange={(e) => setNewMedicalHistory(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addMedicalHistory} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(localData.pastMedicalHistory || []).map((condition, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {condition}
                <button
                  onClick={() => removeFromArray("pastMedicalHistory", index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newAllergy || "default"} onValueChange={setNewAllergy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select common allergy or type custom..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Select an allergy...
                </SelectItem>
                {commonAllergies.map((allergy) => (
                  <SelectItem key={allergy} value={allergy}>
                    {allergy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type custom allergy..."
              value={newAllergy === "default" ? "" : newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addAllergy} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(localData.allergies || []).map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {allergy}
                <button onClick={() => removeFromArray("allergies", index)} className="ml-1 hover:text-red-200">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-purple-500" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter medication name and dosage..."
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addMedication} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(localData.currentMedications || []).map((medication, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {medication}
                <button
                  onClick={() => removeFromArray("currentMedications", index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Review */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">System Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(systemReviewOptions).map(([system, symptoms]) => (
              <div key={system} className="space-y-2">
                <Label className="capitalize font-medium">{system.replace(/([A-Z])/g, " $1").trim()}</Label>
                <Select
                  value={localData.systemReview?.[system as keyof typeof localData.systemReview] || "no_symptoms"}
                  onValueChange={(value) => updateSystemReview(system, value === "no_symptoms" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select symptoms..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_symptoms">No symptoms</SelectItem>
                    {symptoms.map((symptom) => (
                      <SelectItem key={symptom} value={symptom}>
                        {symptom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Family History</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter relevant family medical history..."
            value={localData.familyHistory || ""}
            onChange={(e) => updateField("familyHistory", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Social History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Social History</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter social history (smoking, alcohol, occupation, lifestyle)..."
            value={localData.socialHistory || ""}
            onChange={(e) => updateField("socialHistory", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Clinical Findings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Clinical Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter physical examination findings and clinical observations..."
            value={localData.clinicalFindings || ""}
            onChange={(e) => updateField("clinicalFindings", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional notes or observations..."
            value={localData.additionalNotes || ""}
            onChange={(e) => updateField("additionalNotes", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  )
}
