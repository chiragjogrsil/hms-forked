"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X, FileText, AlertTriangle, CheckCircle } from "lucide-react"

interface DiagnosisData {
  primaryDiagnosis: string[]
  secondaryDiagnosis: string[]
  differentialDiagnosis: string[]
  clinicalImpression: string
  prognosis: string
  icdCodes: { diagnosis: string; code: string }[]
}

interface DiagnosisSectionProps {
  department: string
  data: DiagnosisData
  onChange: (data: DiagnosisData) => void
}

export function DiagnosisSection({ department, data, onChange }: DiagnosisSectionProps) {
  // Initialize with default empty arrays to prevent undefined errors
  const [localData, setLocalData] = useState<DiagnosisData>({
    primaryDiagnosis: [],
    secondaryDiagnosis: [],
    differentialDiagnosis: [],
    clinicalImpression: "",
    prognosis: "",
    icdCodes: [],
    ...data,
  })

  const [newPrimaryDiagnosis, setNewPrimaryDiagnosis] = useState("")
  const [newSecondaryDiagnosis, setNewSecondaryDiagnosis] = useState("")
  const [newDifferentialDiagnosis, setNewDifferentialDiagnosis] = useState("")

  // Department-specific diagnosis options
  const departmentDiagnoses = {
    general: [
      "Upper Respiratory Tract Infection",
      "Viral Fever",
      "Gastroenteritis",
      "Hypertension",
      "Diabetes Mellitus Type 2",
      "Migraine",
      "Tension Headache",
      "Acid Peptic Disease",
      "Irritable Bowel Syndrome",
      "Urinary Tract Infection",
      "Bronchitis",
      "Pneumonia",
      "Allergic Rhinitis",
      "Sinusitis",
      "Pharyngitis",
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
      "Ventricular Tachycardia",
      "Bradycardia",
      "Aortic Stenosis",
      "Mitral Regurgitation",
      "Pulmonary Embolism",
      "Deep Vein Thrombosis",
    ],
    orthopedics: [
      "Osteoarthritis",
      "Rheumatoid Arthritis",
      "Fracture",
      "Sprain",
      "Strain",
      "Disc Prolapse",
      "Sciatica",
      "Frozen Shoulder",
      "Tennis Elbow",
      "Carpal Tunnel Syndrome",
      "Osteoporosis",
      "Fibromyalgia",
      "Bursitis",
      "Tendinitis",
      "Spondylosis",
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
      "Bell's Palsy",
      "Trigeminal Neuralgia",
      "Vertigo",
      "Seizure Disorder",
      "Dementia",
      "Peripheral Neuropathy",
      "Myasthenia Gravis",
    ],
  }

  const currentDiagnoses =
    departmentDiagnoses[department as keyof typeof departmentDiagnoses] || departmentDiagnoses.general

  const prognosisOptions = [
    "Excellent",
    "Good",
    "Fair",
    "Guarded",
    "Poor",
    "Depends on compliance",
    "Depends on early intervention",
    "Chronic condition - manageable",
    "Progressive condition",
    "Self-limiting condition",
  ]

  useEffect(() => {
    const safeData = {
      primaryDiagnosis: [],
      secondaryDiagnosis: [],
      differentialDiagnosis: [],
      clinicalImpression: "",
      prognosis: "",
      icdCodes: [],
      ...data,
    }
    setLocalData(safeData)
  }, [data])

  useEffect(() => {
    onChange(localData)
  }, [localData, onChange])

  const addPrimaryDiagnosis = () => {
    if (newPrimaryDiagnosis.trim() && !localData.primaryDiagnosis.includes(newPrimaryDiagnosis.trim())) {
      setLocalData((prev) => ({
        ...prev,
        primaryDiagnosis: [...prev.primaryDiagnosis, newPrimaryDiagnosis.trim()],
      }))
      setNewPrimaryDiagnosis("")
    }
  }

  const addSecondaryDiagnosis = () => {
    if (newSecondaryDiagnosis.trim() && !localData.secondaryDiagnosis.includes(newSecondaryDiagnosis.trim())) {
      setLocalData((prev) => ({
        ...prev,
        secondaryDiagnosis: [...prev.secondaryDiagnosis, newSecondaryDiagnosis.trim()],
      }))
      setNewSecondaryDiagnosis("")
    }
  }

  const addDifferentialDiagnosis = () => {
    if (newDifferentialDiagnosis.trim() && !localData.differentialDiagnosis.includes(newDifferentialDiagnosis.trim())) {
      setLocalData((prev) => ({
        ...prev,
        differentialDiagnosis: [...prev.differentialDiagnosis, newDifferentialDiagnosis.trim()],
      }))
      setNewDifferentialDiagnosis("")
    }
  }

  const removePrimaryDiagnosis = (diagnosis: string) => {
    setLocalData((prev) => ({
      ...prev,
      primaryDiagnosis: prev.primaryDiagnosis.filter((d) => d !== diagnosis),
    }))
  }

  const removeSecondaryDiagnosis = (diagnosis: string) => {
    setLocalData((prev) => ({
      ...prev,
      secondaryDiagnosis: prev.secondaryDiagnosis.filter((d) => d !== diagnosis),
    }))
  }

  const removeDifferentialDiagnosis = (diagnosis: string) => {
    setLocalData((prev) => ({
      ...prev,
      differentialDiagnosis: prev.differentialDiagnosis.filter((d) => d !== diagnosis),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Primary Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPrimaryDiagnosis}
              onChange={(e) => setNewPrimaryDiagnosis(e.target.value)}
              placeholder="Enter primary diagnosis"
              onKeyPress={(e) => e.key === "Enter" && addPrimaryDiagnosis()}
            />
            <Select onValueChange={(value) => setNewPrimaryDiagnosis(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {currentDiagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addPrimaryDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {localData.primaryDiagnosis.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.primaryDiagnosis.map((diagnosis) => (
                <Badge key={diagnosis} className="bg-green-100 text-green-800 flex items-center gap-1">
                  {diagnosis}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removePrimaryDiagnosis(diagnosis)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Secondary Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Secondary Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSecondaryDiagnosis}
              onChange={(e) => setNewSecondaryDiagnosis(e.target.value)}
              placeholder="Enter secondary diagnosis"
              onKeyPress={(e) => e.key === "Enter" && addSecondaryDiagnosis()}
            />
            <Select onValueChange={(value) => setNewSecondaryDiagnosis(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {currentDiagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addSecondaryDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {localData.secondaryDiagnosis.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.secondaryDiagnosis.map((diagnosis) => (
                <Badge key={diagnosis} className="bg-blue-100 text-blue-800 flex items-center gap-1">
                  {diagnosis}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSecondaryDiagnosis(diagnosis)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Differential Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Differential Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDifferentialDiagnosis}
              onChange={(e) => setNewDifferentialDiagnosis(e.target.value)}
              placeholder="Enter differential diagnosis"
              onKeyPress={(e) => e.key === "Enter" && addDifferentialDiagnosis()}
            />
            <Select onValueChange={(value) => setNewDifferentialDiagnosis(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {currentDiagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addDifferentialDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {localData.differentialDiagnosis.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.differentialDiagnosis.map((diagnosis) => (
                <Badge key={diagnosis} className="bg-orange-100 text-orange-800 flex items-center gap-1">
                  {diagnosis}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeDifferentialDiagnosis(diagnosis)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clinical Impression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Clinical Impression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localData.clinicalImpression}
            onChange={(e) => setLocalData((prev) => ({ ...prev, clinicalImpression: e.target.value }))}
            placeholder="Describe your clinical impression and assessment..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Prognosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-600" />
            Prognosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prognosis">Expected Outcome</Label>
            <Select
              value={localData.prognosis}
              onValueChange={(value) => setLocalData((prev) => ({ ...prev, prognosis: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select prognosis" />
              </SelectTrigger>
              <SelectContent>
                {prognosisOptions.map((prognosis) => (
                  <SelectItem key={prognosis} value={prognosis}>
                    {prognosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
