"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MultiSelect, type Option } from "@/components/ui/multi-select"

// Define options for each dropdown
const chiefComplaintOptions: Option[] = [
  { value: "fever", label: "Fever" },
  { value: "headache", label: "Headache" },
  { value: "cough", label: "Cough" },
  { value: "cold", label: "Cold" },
  { value: "bodyache", label: "Body ache" },
  { value: "fatigue", label: "Fatigue" },
  { value: "nausea", label: "Nausea" },
  { value: "vomiting", label: "Vomiting" },
  { value: "diarrhea", label: "Diarrhea" },
  { value: "constipation", label: "Constipation" },
  { value: "chestpain", label: "Chest pain" },
  { value: "shortnessofbreath", label: "Shortness of breath" },
  { value: "dizziness", label: "Dizziness" },
  { value: "jointpain", label: "Joint pain" },
  { value: "backpain", label: "Back pain" },
  { value: "abdominalpain", label: "Abdominal pain" },
  { value: "lossofappetite", label: "Loss of appetite" },
  { value: "sleepdisturbance", label: "Sleep disturbance" },
  { value: "anxiety", label: "Anxiety" },
  { value: "depression", label: "Depression" },
]

const medicalHistoryOptions: Option[] = [
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "heartdisease", label: "Heart disease" },
  { value: "asthma", label: "Asthma" },
  { value: "allergies", label: "Allergies" },
  { value: "kidneydisease", label: "Kidney disease" },
  { value: "liverdisease", label: "Liver disease" },
  { value: "thyroiddisorder", label: "Thyroid disorder" },
  { value: "cancer", label: "Cancer" },
  { value: "stroke", label: "Stroke" },
  { value: "arthritis", label: "Arthritis" },
  { value: "osteoporosis", label: "Osteoporosis" },
  { value: "mentalhealthissues", label: "Mental health issues" },
  { value: "previoussurgeries", label: "Previous surgeries" },
  { value: "familyhistorydiabetes", label: "Family history of diabetes" },
  { value: "familyhistoryheartdisease", label: "Family history of heart disease" },
  { value: "smokinghistory", label: "Smoking history" },
  { value: "alcoholconsumption", label: "Alcohol consumption" },
  { value: "drugallergies", label: "Drug allergies" },
  { value: "previoushospitalizations", label: "Previous hospitalizations" },
]

const investigationOptions: Option[] = [
  { value: "bloodtest", label: "Blood test" },
  { value: "urinetest", label: "Urine test" },
  { value: "xray", label: "X-ray" },
  { value: "ctscan", label: "CT scan" },
  { value: "mri", label: "MRI" },
  { value: "ultrasound", label: "Ultrasound" },
  { value: "ecg", label: "ECG" },
  { value: "echo", label: "Echo" },
  { value: "endoscopy", label: "Endoscopy" },
  { value: "colonoscopy", label: "Colonoscopy" },
  { value: "biopsy", label: "Biopsy" },
  { value: "mammography", label: "Mammography" },
  { value: "bonedensityscan", label: "Bone density scan" },
  { value: "stresstest", label: "Stress test" },
  { value: "pulmonaryfunctiontest", label: "Pulmonary function test" },
  { value: "thyroidfunctiontest", label: "Thyroid function test" },
  { value: "liverfunctiontest", label: "Liver function test" },
  { value: "kidneyfunctiontest", label: "Kidney function test" },
  { value: "lipidprofile", label: "Lipid profile" },
  { value: "hba1c", label: "HbA1c" },
]

const observationOptions: Option[] = [
  { value: "normalvitalsigns", label: "Normal vital signs" },
  { value: "elevatedbp", label: "Elevated BP" },
  { value: "rapidpulse", label: "Rapid pulse" },
  { value: "feverpresent", label: "Fever present" },
  { value: "alertandoriented", label: "Alert and oriented" },
  { value: "cooperativepatient", label: "Cooperative patient" },
  { value: "anxious", label: "Anxious" },
  { value: "restless", label: "Restless" },
  { value: "pallor", label: "Pallor" },
  { value: "jaundice", label: "Jaundice" },
  { value: "cyanosis", label: "Cyanosis" },
  { value: "edema", label: "Edema" },
  { value: "dehydration", label: "Dehydration" },
  { value: "normalhearthsounds", label: "Normal heart sounds" },
  { value: "abnormallungsounds", label: "Abnormal lung sounds" },
  { value: "tenderabdomen", label: "Tender abdomen" },
  { value: "swollenjoints", label: "Swollen joints" },
  { value: "normalreflexes", label: "Normal reflexes" },
  { value: "abnormalgait", label: "Abnormal gait" },
  { value: "goodgeneralcondition", label: "Good general condition" },
]

interface ClinicalNotesSectionProps {
  data: string
  onChange: (data: string) => void
}

export function ClinicalNotesSection({ data, onChange }: ClinicalNotesSectionProps) {
  const [chiefComplaints, setChiefComplaints] = useState<string[]>([])
  const [medicalHistory, setMedicalHistory] = useState<string[]>([])
  const [investigations, setInvestigations] = useState<string[]>([])
  const [observations, setObservations] = useState<string[]>([])
  const [additionalNotes, setAdditionalNotes] = useState("")

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="chief-complaints" className="mb-1 block">
          Chief Complaints
        </Label>
        <MultiSelect
          options={chiefComplaintOptions}
          selected={chiefComplaints}
          onChange={setChiefComplaints}
          placeholder="Select chief complaints..."
        />
      </div>

      <div>
        <Label htmlFor="medical-history" className="mb-1 block">
          Detailed Medical History
        </Label>
        <MultiSelect
          options={medicalHistoryOptions}
          selected={medicalHistory}
          onChange={setMedicalHistory}
          placeholder="Select medical history items..."
        />
      </div>

      <div>
        <Label htmlFor="investigations" className="mb-1 block">
          Investigation
        </Label>
        <MultiSelect
          options={investigationOptions}
          selected={investigations}
          onChange={setInvestigations}
          placeholder="Select investigations..."
        />
      </div>

      <div>
        <Label htmlFor="observations" className="mb-1 block">
          Observations
        </Label>
        <MultiSelect
          options={observationOptions}
          selected={observations}
          onChange={setObservations}
          placeholder="Select observations..."
        />
      </div>

      <div>
        <Label htmlFor="additional-notes" className="mb-1 block">
          Additional Notes
        </Label>
        <Textarea
          id="additional-notes"
          placeholder="Enter any additional notes here..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
