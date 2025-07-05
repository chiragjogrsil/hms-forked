"use client"

import { useState } from "react"
import { Plus, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConsultation, type Diagnosis } from "@/contexts/consultation-context"
import { useDoctorContext } from "@/contexts/doctor-context"

// Common diagnoses by department
const commonDiagnoses = {
  "General Medicine": [
    { code: "A09", name: "Viral fever" },
    { code: "J00", name: "Common cold" },
    { code: "K59.1", name: "Diarrhea" },
    { code: "G44.2", name: "Tension headache" },
    { code: "M79.3", name: "Body aches" },
    { code: "R50", name: "Fever" },
    { code: "J06.9", name: "Upper respiratory infection" },
    { code: "K30", name: "Gastritis" },
  ],
  Cardiology: [
    { code: "I20.9", name: "Angina pectoris" },
    { code: "I10", name: "Hypertension" },
    { code: "I25.9", name: "Coronary artery disease" },
    { code: "I48", name: "Atrial fibrillation" },
    { code: "I50.9", name: "Heart failure" },
    { code: "I21.9", name: "Myocardial infarction" },
  ],
  Dermatology: [
    { code: "L20.9", name: "Eczema" },
    { code: "L40.9", name: "Psoriasis" },
    { code: "L70.0", name: "Acne vulgaris" },
    { code: "B35.9", name: "Fungal infection" },
    { code: "L30.9", name: "Dermatitis" },
    { code: "L50.9", name: "Urticaria" },
  ],
  Orthopedics: [
    { code: "M54.5", name: "Low back pain" },
    { code: "M25.50", name: "Joint pain" },
    { code: "S72.9", name: "Fracture" },
    { code: "M79.1", name: "Muscle pain" },
    { code: "M17.9", name: "Osteoarthritis of knee" },
    { code: "M75.3", name: "Shoulder impingement" },
  ],
  Pediatrics: [
    { code: "A09", name: "Viral gastroenteritis" },
    { code: "J00", name: "Common cold" },
    { code: "R50", name: "Fever" },
    { code: "L20.9", name: "Atopic dermatitis" },
    { code: "J06.9", name: "Upper respiratory infection" },
    { code: "K59.1", name: "Diarrhea" },
  ],
  Gynecology: [
    { code: "N94.6", name: "Dysmenorrhea" },
    { code: "N39.0", name: "Urinary tract infection" },
    { code: "N76.0", name: "Vaginal infection" },
    { code: "N80.9", name: "Endometriosis" },
    { code: "N92.0", name: "Menorrhagia" },
  ],
  ENT: [
    { code: "H66.9", name: "Otitis media" },
    { code: "J02.9", name: "Pharyngitis" },
    { code: "J32.9", name: "Sinusitis" },
    { code: "H93.1", name: "Tinnitus" },
    { code: "J35.9", name: "Tonsillitis" },
  ],
  Ophthalmology: [
    { code: "H52.4", name: "Refractive error" },
    { code: "H10.9", name: "Conjunctivitis" },
    { code: "H40.9", name: "Glaucoma" },
    { code: "H25.9", name: "Cataract" },
    { code: "H35.9", name: "Retinal disorder" },
  ],
  Ayurveda: [
    { code: "AY001", name: "Vata Dosha Imbalance" },
    { code: "AY002", name: "Pitta Dosha Imbalance" },
    { code: "AY003", name: "Kapha Dosha Imbalance" },
    { code: "AY004", name: "Ama (Toxins)" },
    { code: "AY005", name: "Agni Mandya (Weak Digestion)" },
    { code: "AY006", name: "Ojas Kshaya (Low Immunity)" },
  ],
}

export function DiagnosisSection() {
  const { consultationData, updateConsultationData } = useConsultation()
  const { selectedDoctor } = useDoctorContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [newDiagnosis, setNewDiagnosis] = useState({
    code: "",
    name: "",
    type: "primary" as "primary" | "secondary",
    notes: "",
  })

  const currentDepartment = selectedDoctor?.department || "General Medicine"
  const departmentDiagnoses =
    commonDiagnoses[currentDepartment as keyof typeof commonDiagnoses] || commonDiagnoses["General Medicine"]

  const filteredDiagnoses = departmentDiagnoses.filter(
    (diagnosis) =>
      diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addDiagnosis = (diagnosis: { code?: string; name: string }) => {
    const newDiag: Diagnosis = {
      id: Date.now().toString(),
      code: diagnosis.code,
      name: diagnosis.name,
      type: consultationData.diagnoses.length === 0 ? "primary" : "secondary",
    }

    updateConsultationData({
      diagnoses: [...consultationData.diagnoses, newDiag],
    })
  }

  const addCustomDiagnosis = () => {
    if (!newDiagnosis.name.trim()) return

    const diagnosis: Diagnosis = {
      id: Date.now().toString(),
      code: newDiagnosis.code || undefined,
      name: newDiagnosis.name,
      type: newDiagnosis.type,
      notes: newDiagnosis.notes || undefined,
    }

    updateConsultationData({
      diagnoses: [...consultationData.diagnoses, diagnosis],
    })

    setNewDiagnosis({
      code: "",
      name: "",
      type: "primary",
      notes: "",
    })
  }

  const removeDiagnosis = (id: string) => {
    updateConsultationData({
      diagnoses: consultationData.diagnoses.filter((d) => d.id !== id),
    })
  }

  const updateDiagnosisType = (id: string, type: "primary" | "secondary") => {
    updateConsultationData({
      diagnoses: consultationData.diagnoses.map((d) => (d.id === id ? { ...d, type } : d)),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Diagnoses */}
        {consultationData.diagnoses.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Current Diagnoses</Label>
            <div className="space-y-2">
              {consultationData.diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={diagnosis.type === "primary" ? "default" : "secondary"}>{diagnosis.type}</Badge>
                      <span className="font-medium">{diagnosis.name}</span>
                      {diagnosis.code && <span className="text-sm text-muted-foreground">({diagnosis.code})</span>}
                    </div>
                    {diagnosis.notes && <p className="text-sm text-muted-foreground mt-1">{diagnosis.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={diagnosis.type}
                      onValueChange={(value: "primary" | "secondary") => updateDiagnosisType(diagnosis.id, value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => removeDiagnosis(diagnosis.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Diagnoses for Department */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Common Diagnoses - {currentDepartment}</Label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search diagnoses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {filteredDiagnoses.map((diagnosis) => (
              <Button
                key={`${diagnosis.code}-${diagnosis.name}`}
                variant="outline"
                className="justify-start h-auto p-3 text-left bg-transparent"
                onClick={() => addDiagnosis(diagnosis)}
              >
                <div>
                  <div className="font-medium">{diagnosis.name}</div>
                  <div className="text-sm text-muted-foreground">{diagnosis.code}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Add Custom Diagnosis */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Custom Diagnosis</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis-code">ICD-10 Code (Optional)</Label>
              <Input
                id="diagnosis-code"
                placeholder="e.g., A09"
                value={newDiagnosis.code}
                onChange={(e) => setNewDiagnosis((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis-name">Diagnosis Name *</Label>
              <Input
                id="diagnosis-name"
                placeholder="Enter diagnosis name"
                value={newDiagnosis.name}
                onChange={(e) => setNewDiagnosis((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis-type">Type</Label>
              <Select
                value={newDiagnosis.type}
                onValueChange={(value: "primary" | "secondary") =>
                  setNewDiagnosis((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis-notes">Notes (Optional)</Label>
              <Input
                id="diagnosis-notes"
                placeholder="Additional notes"
                value={newDiagnosis.notes}
                onChange={(e) => setNewDiagnosis((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={addCustomDiagnosis} disabled={!newDiagnosis.name.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Diagnosis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
