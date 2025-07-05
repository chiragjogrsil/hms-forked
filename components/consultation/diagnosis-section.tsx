"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, X, Stethoscope, AlertTriangle } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"

interface DiagnosisSectionProps {
  department?: string
  data?: string[]
  onChange?: (data: string[]) => void
}

// Comprehensive diagnosis database organized by department
const diagnosisDatabase = {
  general: [
    "Upper Respiratory Tract Infection",
    "Viral Fever",
    "Gastroenteritis",
    "Hypertension",
    "Type 2 Diabetes Mellitus",
    "Hyperlipidemia",
    "Anemia",
    "Urinary Tract Infection",
    "Headache",
    "Back Pain",
    "Fatigue Syndrome",
    "Allergic Rhinitis",
    "Bronchitis",
    "Gastroesophageal Reflux Disease",
    "Insomnia",
    "Anxiety Disorder",
    "Depression",
    "Osteoarthritis",
    "Migraine",
    "Constipation",
    "Diarrhea",
    "Abdominal Pain",
    "Chest Pain",
    "Dizziness",
    "Joint Pain",
  ],
  cardiology: [
    "Coronary Artery Disease",
    "Myocardial Infarction",
    "Heart Failure",
    "Atrial Fibrillation",
    "Hypertensive Heart Disease",
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
    "Ventricular Tachycardia",
    "Cardiac Arrest",
    "Endocarditis",
    "Myocarditis",
  ],
  orthopedics: [
    "Fracture",
    "Osteoarthritis",
    "Rheumatoid Arthritis",
    "Lower Back Pain",
    "Cervical Spondylosis",
    "Lumbar Disc Herniation",
    "Rotator Cuff Tear",
    "Tennis Elbow",
    "Carpal Tunnel Syndrome",
    "Plantar Fasciitis",
    "ACL Tear",
    "Meniscus Tear",
    "Osteoporosis",
    "Sciatica",
    "Frozen Shoulder",
    "Bursitis",
    "Tendinitis",
    "Muscle Strain",
    "Ligament Sprain",
    "Joint Dislocation",
  ],
  neurology: [
    "Stroke",
    "Epilepsy",
    "Migraine",
    "Tension Headache",
    "Parkinson's Disease",
    "Alzheimer's Disease",
    "Multiple Sclerosis",
    "Neuropathy",
    "Bell's Palsy",
    "Trigeminal Neuralgia",
    "Seizure Disorder",
    "Dementia",
    "Vertigo",
    "Peripheral Neuropathy",
    "Carpal Tunnel Syndrome",
    "Restless Leg Syndrome",
    "Sleep Apnea",
    "Narcolepsy",
    "Meningitis",
    "Encephalitis",
  ],
  dermatology: [
    "Eczema",
    "Psoriasis",
    "Acne Vulgaris",
    "Dermatitis",
    "Urticaria",
    "Fungal Infection",
    "Bacterial Skin Infection",
    "Viral Skin Infection",
    "Skin Cancer",
    "Melanoma",
    "Basal Cell Carcinoma",
    "Rosacea",
    "Vitiligo",
    "Alopecia",
    "Seborrheic Dermatitis",
    "Contact Dermatitis",
    "Cellulitis",
    "Impetigo",
    "Herpes Simplex",
    "Shingles",
  ],
  ophthalmology: [
    "Refractive Error",
    "Cataract",
    "Glaucoma",
    "Diabetic Retinopathy",
    "Macular Degeneration",
    "Conjunctivitis",
    "Dry Eye Syndrome",
    "Stye",
    "Chalazion",
    "Retinal Detachment",
    "Uveitis",
    "Corneal Ulcer",
    "Pterygium",
    "Floaters",
    "Night Blindness",
    "Color Blindness",
    "Amblyopia",
    "Strabismus",
    "Optic Neuritis",
    "Keratitis",
  ],
  ayurveda: [
    "Vata Dosha Imbalance",
    "Pitta Dosha Imbalance",
    "Kapha Dosha Imbalance",
    "Ama (Toxins) Accumulation",
    "Agni Mandya (Weak Digestion)",
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
    "Atisara (Diarrhea)",
    "Vibandha (Constipation)",
    "Anidra (Insomnia)",
    "Chinta (Anxiety)",
    "Karna Roga (Ear Problems)",
  ],
}

export function DiagnosisSection({ department, data, onChange }: DiagnosisSectionProps) {
  const { activeConsultation, updateConsultationData } = useConsultation()

  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<string[]>([])
  const [differentialDiagnosis, setDifferentialDiagnosis] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("general")
  const [customDiagnosis, setCustomDiagnosis] = useState("")
  const [clinicalImpression, setClinicalImpression] = useState("")

  // Use ref to track if we're loading data to prevent auto-save during load
  const isLoadingRef = useRef(false)
  const consultationIdRef = useRef<string | null>(null)

  // Load data from active consultation only when consultation ID changes
  useEffect(() => {
    if (activeConsultation && activeConsultation.id !== consultationIdRef.current) {
      isLoadingRef.current = true
      consultationIdRef.current = activeConsultation.id || null

      setProvisionalDiagnosis(activeConsultation.provisionalDiagnosis || [])
      setDifferentialDiagnosis(activeConsultation.differentialDiagnosis || [])
      setClinicalImpression(activeConsultation.clinicalFindings || "")

      // Set department based on consultation
      if (activeConsultation.department) {
        setSelectedDepartment(activeConsultation.department)
      }

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
      updateConsultationData({
        provisionalDiagnosis,
        differentialDiagnosis,
        clinicalFindings: clinicalImpression,
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [activeConsultation, provisionalDiagnosis, differentialDiagnosis, clinicalImpression, updateConsultationData])

  // Auto-save when data changes
  useEffect(() => {
    if (!isLoadingRef.current) {
      const cleanup = debouncedSave()
      return cleanup
    }
  }, [debouncedSave])

  // Get filtered diagnoses based on search and department
  const getFilteredDiagnoses = useCallback(() => {
    const departmentDiagnoses =
      diagnosisDatabase[selectedDepartment as keyof typeof diagnosisDatabase] || diagnosisDatabase.general

    if (!searchTerm) return departmentDiagnoses

    return departmentDiagnoses.filter((diagnosis) => diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [selectedDepartment, searchTerm])

  const addProvisionalDiagnosis = useCallback((diagnosis: string) => {
    setProvisionalDiagnosis((prev) => {
      if (!prev.includes(diagnosis)) {
        return [...prev, diagnosis]
      }
      return prev
    })
  }, [])

  const removeProvisionalDiagnosis = useCallback((index: number) => {
    setProvisionalDiagnosis((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addDifferentialDiagnosis = useCallback((diagnosis: string) => {
    setDifferentialDiagnosis((prev) => {
      if (!prev.includes(diagnosis)) {
        return [...prev, diagnosis]
      }
      return prev
    })
  }, [])

  const removeDifferentialDiagnosis = useCallback((index: number) => {
    setDifferentialDiagnosis((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addCustomDiagnosis = useCallback(
    (type: "provisional" | "differential") => {
      if (customDiagnosis.trim()) {
        if (type === "provisional") {
          addProvisionalDiagnosis(customDiagnosis.trim())
        } else {
          addDifferentialDiagnosis(customDiagnosis.trim())
        }
        setCustomDiagnosis("")
      }
    },
    [customDiagnosis, addProvisionalDiagnosis, addDifferentialDiagnosis],
  )

  const departments = [
    { value: "general", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "ayurveda", label: "Ayurveda" },
  ]

  if (!activeConsultation) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Consultation</h3>
          <p className="text-muted-foreground">Start a consultation to add diagnosis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Clinical Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Department and Search */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="search">Search Diagnoses</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Available Diagnoses */}
          <div className="space-y-2">
            <Label>Available Diagnoses</Label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {getFilteredDiagnoses().map((diagnosis, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100 hover:border-blue-300"
                    onClick={() => addProvisionalDiagnosis(diagnosis)}
                  >
                    {diagnosis}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Diagnosis Input */}
          <div className="space-y-2">
            <Label htmlFor="customDiagnosis">Add Custom Diagnosis</Label>
            <div className="flex gap-2">
              <Input
                id="customDiagnosis"
                placeholder="Enter custom diagnosis..."
                value={customDiagnosis}
                onChange={(e) => setCustomDiagnosis(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomDiagnosis("provisional")}
              />
              <Button onClick={() => addCustomDiagnosis("provisional")} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Provisional Diagnosis */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Provisional Diagnosis
            </Label>
            <div className="min-h-[60px] p-3 border-2 border-dashed border-green-200 rounded-lg bg-green-50">
              {provisionalDiagnosis.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {provisionalDiagnosis.map((diagnosis, index) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                      onClick={() => removeProvisionalDiagnosis(index)}
                    >
                      {diagnosis}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 text-sm">Click on diagnoses above to add them here</p>
              )}
            </div>
          </div>

          {/* Differential Diagnosis */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Differential Diagnosis
            </Label>
            <div className="min-h-[60px] p-3 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50">
              {differentialDiagnosis.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {differentialDiagnosis.map((diagnosis, index) => (
                    <Badge
                      key={index}
                      className="bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer"
                      onClick={() => removeDifferentialDiagnosis(index)}
                    >
                      {diagnosis}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-orange-600 text-sm">Add alternative diagnoses to consider</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addCustomDiagnosis("differential")}
              disabled={!customDiagnosis.trim()}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Differential
            </Button>
          </div>

          {/* Clinical Impression */}
          <div className="space-y-2">
            <Label htmlFor="clinicalImpression">Clinical Impression & Assessment</Label>
            <Textarea
              id="clinicalImpression"
              placeholder="Detailed clinical assessment, reasoning for diagnosis, severity, prognosis..."
              value={clinicalImpression}
              onChange={(e) => setClinicalImpression(e.target.value)}
              rows={4}
            />
          </div>

          {/* Summary */}
          {(provisionalDiagnosis.length > 0 || differentialDiagnosis.length > 0) && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Diagnosis Summary</span>
              </div>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Primary:</strong> {provisionalDiagnosis.length} condition(s)
                </p>
                <p>
                  <strong>Differential:</strong> {differentialDiagnosis.length} condition(s)
                </p>
                <p>
                  <strong>Department:</strong> {departments.find((d) => d.value === selectedDepartment)?.label}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
