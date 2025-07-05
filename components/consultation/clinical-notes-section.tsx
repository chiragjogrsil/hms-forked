"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Plus, X, FileText, Stethoscope, ClipboardList, Eye } from "lucide-react"

interface ClinicalNotes {
  chiefComplaints: string[]
  historyOfPresentIllness: string
  pastMedicalHistory: string[]
  familyHistory: string
  socialHistory: string
  reviewOfSystems: string[]
  physicalExamination: string
  clinicalFindings: string[]
  provisionalDiagnosis: string[]
  differentialDiagnosis: string[]
  investigations: string[]
  treatmentPlan: string
  followUpInstructions: string
  doctorNotes: string
}

interface ClinicalNotesSectionProps {
  department: string
  data: ClinicalNotes
  onChange: (data: ClinicalNotes) => void
}

export function ClinicalNotesSection({ department, data, onChange }: ClinicalNotesSectionProps) {
  // Initialize with default empty arrays to prevent undefined errors
  const [localData, setLocalData] = useState<ClinicalNotes>({
    chiefComplaints: [],
    historyOfPresentIllness: "",
    pastMedicalHistory: [],
    familyHistory: "",
    socialHistory: "",
    reviewOfSystems: [],
    physicalExamination: "",
    clinicalFindings: [],
    provisionalDiagnosis: [],
    differentialDiagnosis: [],
    investigations: [],
    treatmentPlan: "",
    followUpInstructions: "",
    doctorNotes: "",
    ...data, // Override with actual data
  })

  const [newComplaint, setNewComplaint] = useState("")
  const [newDiagnosis, setNewDiagnosis] = useState("")

  useEffect(() => {
    // Ensure all array properties are initialized
    const safeData = {
      chiefComplaints: [],
      historyOfPresentIllness: "",
      pastMedicalHistory: [],
      familyHistory: "",
      socialHistory: "",
      reviewOfSystems: [],
      physicalExamination: "",
      clinicalFindings: [],
      provisionalDiagnosis: [],
      differentialDiagnosis: [],
      investigations: [],
      treatmentPlan: "",
      followUpInstructions: "",
      doctorNotes: "",
      ...data,
    }
    setLocalData(safeData)
  }, [data])

  useEffect(() => {
    onChange(localData)
  }, [localData, onChange])

  // Department-specific options
  const departmentOptions = {
    general: {
      complaints: [
        "Fever",
        "Headache",
        "Cough",
        "Cold",
        "Body ache",
        "Fatigue",
        "Nausea",
        "Vomiting",
        "Diarrhea",
        "Constipation",
        "Abdominal pain",
        "Loss of appetite",
        "Weight loss",
        "Weight gain",
      ],
      diagnoses: [
        "Upper Respiratory Tract Infection",
        "Viral Fever",
        "Gastroenteritis",
        "Hypertension",
        "Diabetes Mellitus",
        "Migraine",
        "Tension Headache",
        "Acid Peptic Disease",
        "IBS",
        "UTI",
      ],
      investigations: [
        "Complete Blood Count",
        "ESR",
        "CRP",
        "Blood Sugar",
        "HbA1c",
        "Lipid Profile",
        "Liver Function Test",
        "Kidney Function Test",
        "Urine Analysis",
        "Chest X-ray",
      ],
    },
    cardiology: {
      complaints: [
        "Chest pain",
        "Shortness of breath",
        "Palpitations",
        "Dizziness",
        "Syncope",
        "Leg swelling",
        "Fatigue",
        "Exercise intolerance",
        "Orthopnea",
        "PND",
      ],
      diagnoses: [
        "Coronary Artery Disease",
        "Myocardial Infarction",
        "Heart Failure",
        "Arrhythmia",
        "Hypertension",
        "Valvular Heart Disease",
        "Cardiomyopathy",
        "Pericarditis",
        "Angina",
      ],
      investigations: [
        "ECG",
        "Echocardiography",
        "Stress Test",
        "Holter Monitor",
        "Cardiac Enzymes",
        "Lipid Profile",
        "BNP/NT-proBNP",
        "Coronary Angiography",
        "CT Angiography",
      ],
    },
    orthopedics: {
      complaints: [
        "Joint pain",
        "Back pain",
        "Neck pain",
        "Muscle pain",
        "Stiffness",
        "Swelling",
        "Limited mobility",
        "Numbness",
        "Tingling",
        "Weakness",
        "Trauma",
        "Fracture pain",
      ],
      diagnoses: [
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
      ],
      investigations: [
        "X-ray",
        "MRI",
        "CT Scan",
        "Bone Scan",
        "Arthroscopy",
        "EMG",
        "NCV",
        "Bone Density",
        "ESR",
        "CRP",
        "Rheumatoid Factor",
        "Anti-CCP",
      ],
    },
  }

  const currentOptions = departmentOptions[department as keyof typeof departmentOptions] || departmentOptions.general

  const addComplaint = () => {
    if (newComplaint.trim() && !localData.chiefComplaints.includes(newComplaint.trim())) {
      setLocalData((prev) => ({
        ...prev,
        chiefComplaints: [...prev.chiefComplaints, newComplaint.trim()],
      }))
      setNewComplaint("")
    }
  }

  const removeComplaint = (complaint: string) => {
    setLocalData((prev) => ({
      ...prev,
      chiefComplaints: prev.chiefComplaints.filter((c) => c !== complaint),
    }))
  }

  const addDiagnosis = () => {
    if (newDiagnosis.trim() && !localData.provisionalDiagnosis.includes(newDiagnosis.trim())) {
      setLocalData((prev) => ({
        ...prev,
        provisionalDiagnosis: [...prev.provisionalDiagnosis, newDiagnosis.trim()],
      }))
      setNewDiagnosis("")
    }
  }

  const removeDiagnosis = (diagnosis: string) => {
    setLocalData((prev) => ({
      ...prev,
      provisionalDiagnosis: prev.provisionalDiagnosis.filter((d) => d !== diagnosis),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Chief Complaints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Chief Complaints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newComplaint}
              onChange={(e) => setNewComplaint(e.target.value)}
              placeholder="Enter chief complaint"
              onKeyPress={(e) => e.key === "Enter" && addComplaint()}
            />
            <Select onValueChange={(value) => setNewComplaint(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {currentOptions.complaints.map((complaint) => (
                  <SelectItem key={complaint} value={complaint}>
                    {complaint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addComplaint} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {localData.chiefComplaints.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.chiefComplaints.map((complaint) => (
                <Badge key={complaint} variant="secondary" className="flex items-center gap-1">
                  {complaint}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeComplaint(complaint)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History of Present Illness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            History of Present Illness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localData.historyOfPresentIllness}
            onChange={(e) => setLocalData((prev) => ({ ...prev, historyOfPresentIllness: e.target.value }))}
            placeholder="Describe the history of present illness..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Past Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-purple-600" />
            Past Medical History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiSelect
            options={[
              { label: "Diabetes", value: "Diabetes" },
              { label: "Hypertension", value: "Hypertension" },
              { label: "Heart Disease", value: "Heart Disease" },
              { label: "Kidney Disease", value: "Kidney Disease" },
              { label: "Liver Disease", value: "Liver Disease" },
              { label: "Cancer", value: "Cancer" },
              { label: "Stroke", value: "Stroke" },
              { label: "Asthma", value: "Asthma" },
              { label: "COPD", value: "COPD" },
              { label: "Thyroid Disease", value: "Thyroid Disease" },
            ]}
            selected={localData.pastMedicalHistory}
            onChange={(selected) => setLocalData((prev) => ({ ...prev, pastMedicalHistory: selected }))}
            placeholder="Select past medical history"
          />
        </CardContent>
      </Card>

      {/* Physical Examination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-600" />
            Physical Examination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localData.physicalExamination}
            onChange={(e) => setLocalData((prev) => ({ ...prev, physicalExamination: e.target.value }))}
            placeholder="Document physical examination findings..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Clinical Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-red-600" />
            Clinical Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiSelect
            options={[
              { label: "Normal", value: "Normal" },
              { label: "Abnormal heart sounds", value: "Abnormal heart sounds" },
              { label: "Abnormal lung sounds", value: "Abnormal lung sounds" },
              { label: "Lymphadenopathy", value: "Lymphadenopathy" },
              { label: "Organomegaly", value: "Organomegaly" },
              { label: "Edema", value: "Edema" },
              { label: "Cyanosis", value: "Cyanosis" },
              { label: "Jaundice", value: "Jaundice" },
              { label: "Pallor", value: "Pallor" },
              { label: "Dehydration", value: "Dehydration" },
            ]}
            selected={localData.clinicalFindings}
            onChange={(selected) => setLocalData((prev) => ({ ...prev, clinicalFindings: selected }))}
            placeholder="Select clinical findings"
          />
        </CardContent>
      </Card>

      {/* Provisional Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Provisional Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              placeholder="Enter diagnosis"
              onKeyPress={(e) => e.key === "Enter" && addDiagnosis()}
            />
            <Select onValueChange={(value) => setNewDiagnosis(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {currentOptions.diagnoses.map((diagnosis) => (
                  <SelectItem key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addDiagnosis} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {localData.provisionalDiagnosis.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {localData.provisionalDiagnosis.map((diagnosis) => (
                <Badge key={diagnosis} variant="secondary" className="flex items-center gap-1">
                  {diagnosis}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeDiagnosis(diagnosis)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investigations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-teal-600" />
            Investigations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiSelect
            options={currentOptions.investigations.map((inv) => ({ label: inv, value: inv }))}
            selected={localData.investigations}
            onChange={(selected) => setLocalData((prev) => ({ ...prev, investigations: selected }))}
            placeholder="Select investigations"
          />
        </CardContent>
      </Card>

      {/* Treatment Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Treatment Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localData.treatmentPlan}
            onChange={(e) => setLocalData((prev) => ({ ...prev, treatmentPlan: e.target.value }))}
            placeholder="Outline the treatment plan..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Doctor's Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            Doctor's Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localData.doctorNotes}
            onChange={(e) => setLocalData((prev) => ({ ...prev, doctorNotes: e.target.value }))}
            placeholder="Additional notes and observations..."
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  )
}
