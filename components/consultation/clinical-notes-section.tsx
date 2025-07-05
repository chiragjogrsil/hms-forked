"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Heart, TreesIcon as Lungs, Brain, Eye, Activity } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"

interface ClinicalNotesSectionProps {
  patientId: string
  patientName: string
}

export function ClinicalNotesSection({ patientId, patientName }: ClinicalNotesSectionProps) {
  const { activeConsultation, updateConsultationData } = useConsultation()

  // Clinical notes state
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState("")
  const [pastMedicalHistory, setPastMedicalHistory] = useState<string[]>([])
  const [familyHistory, setFamilyHistory] = useState("")
  const [socialHistory, setSocialHistory] = useState("")
  const [allergies, setAllergies] = useState<string[]>([])
  const [currentMedications, setCurrentMedications] = useState<string[]>([])
  const [clinicalFindings, setClinicalFindings] = useState("")
  const [doctorNotes, setDoctorNotes] = useState("")
  const [privateNotes, setPrivateNotes] = useState("")

  // System review state
  const [systemReview, setSystemReview] = useState({
    cardiovascular: "no_symptoms",
    respiratory: "no_symptoms",
    gastrointestinal: "no_symptoms",
    neurological: "no_symptoms",
    musculoskeletal: "no_symptoms",
    genitourinary: "no_symptoms",
    endocrine: "no_symptoms",
    dermatological: "no_symptoms",
  })

  // Input states for adding items
  const [newMedicalHistory, setNewMedicalHistory] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")

  // Load data from active consultation
  useEffect(() => {
    if (activeConsultation) {
      setChiefComplaint(activeConsultation.chiefComplaint || "")
      setHistoryOfPresentIllness(activeConsultation.historyOfPresentIllness || "")
      setPastMedicalHistory(activeConsultation.pastMedicalHistory || [])
      setFamilyHistory(activeConsultation.familyHistory || "")
      setSocialHistory(activeConsultation.socialHistory || "")
      setAllergies(activeConsultation.allergies || [])
      setCurrentMedications(activeConsultation.currentMedications || [])
      setClinicalFindings(activeConsultation.clinicalFindings || "")
      setDoctorNotes(activeConsultation.doctorNotes || "")
      setPrivateNotes(activeConsultation.privateNotes || "")
      setSystemReview(
        activeConsultation.systemReview || {
          cardiovascular: "no_symptoms",
          respiratory: "no_symptoms",
          gastrointestinal: "no_symptoms",
          neurological: "no_symptoms",
          musculoskeletal: "no_symptoms",
          genitourinary: "no_symptoms",
          endocrine: "no_symptoms",
          dermatological: "no_symptoms",
        },
      )
    }
  }, [activeConsultation])

  // Auto-save function
  const autoSave = () => {
    if (activeConsultation) {
      updateConsultationData({
        chiefComplaint,
        historyOfPresentIllness,
        pastMedicalHistory,
        familyHistory,
        socialHistory,
        allergies,
        currentMedications,
        clinicalFindings,
        doctorNotes,
        privateNotes,
        systemReview,
      })
    }
  }

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(autoSave, 1000)
    return () => clearTimeout(timer)
  }, [
    chiefComplaint,
    historyOfPresentIllness,
    pastMedicalHistory,
    familyHistory,
    socialHistory,
    allergies,
    currentMedications,
    clinicalFindings,
    doctorNotes,
    privateNotes,
    systemReview,
  ])

  const handleAddMedicalHistory = () => {
    if (newMedicalHistory.trim()) {
      setPastMedicalHistory([...pastMedicalHistory, newMedicalHistory.trim()])
      setNewMedicalHistory("")
    }
  }

  const handleRemoveMedicalHistory = (index: number) => {
    setPastMedicalHistory(pastMedicalHistory.filter((_, i) => i !== index))
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()])
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index))
  }

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setCurrentMedications([...currentMedications, newMedication.trim()])
      setNewMedication("")
    }
  }

  const handleRemoveMedication = (index: number) => {
    setCurrentMedications(currentMedications.filter((_, i) => i !== index))
  }

  const handleSystemReviewChange = (system: string, value: string) => {
    setSystemReview((prev) => ({
      ...prev,
      [system]: value,
    }))
  }

  const getSystemIcon = (system: string) => {
    switch (system) {
      case "cardiovascular":
        return Heart
      case "respiratory":
        return Lungs
      case "neurological":
        return Brain
      case "dermatological":
        return Eye
      default:
        return Activity
    }
  }

  const getSystemLabel = (system: string) => {
    const labels: { [key: string]: string } = {
      cardiovascular: "Cardiovascular",
      respiratory: "Respiratory",
      gastrointestinal: "Gastrointestinal",
      neurological: "Neurological",
      musculoskeletal: "Musculoskeletal",
      genitourinary: "Genitourinary",
      endocrine: "Endocrine",
      dermatological: "Dermatological",
    }
    return labels[system] || system
  }

  const systemOptions = [
    { value: "no_symptoms", label: "No symptoms", color: "bg-green-100 text-green-800" },
    { value: "mild_symptoms", label: "Mild symptoms", color: "bg-yellow-100 text-yellow-800" },
    { value: "moderate_symptoms", label: "Moderate symptoms", color: "bg-orange-100 text-orange-800" },
    { value: "severe_symptoms", label: "Severe symptoms", color: "bg-red-100 text-red-800" },
    { value: "not_assessed", label: "Not assessed", color: "bg-gray-100 text-gray-800" },
  ]

  if (!activeConsultation) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Consultation</h3>
          <p className="text-muted-foreground">Start a consultation to begin clinical documentation</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Clinical Notes & History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chief-complaint" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chief-complaint">Chief Complaint</TabsTrigger>
              <TabsTrigger value="history">Medical History</TabsTrigger>
              <TabsTrigger value="system-review">System Review</TabsTrigger>
              <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="chief-complaint" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                  <Textarea
                    id="chiefComplaint"
                    placeholder="Patient's primary concern or reason for visit..."
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="historyOfPresentIllness">History of Present Illness</Label>
                  <Textarea
                    id="historyOfPresentIllness"
                    placeholder="Detailed description of the current illness..."
                    value={historyOfPresentIllness}
                    onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              {/* Past Medical History */}
              <div className="space-y-3">
                <Label>Past Medical History</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add medical condition..."
                    value={newMedicalHistory}
                    onChange={(e) => setNewMedicalHistory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddMedicalHistory()}
                  />
                  <Button onClick={handleAddMedicalHistory} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pastMedicalHistory.map((condition, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => handleRemoveMedicalHistory(index)}
                    >
                      {condition} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-3">
                <Label>Allergies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergy..."
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddAllergy()}
                  />
                  <Button onClick={handleAddAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleRemoveAllergy(index)}
                    >
                      {allergy} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div className="space-y-3">
                <Label>Current Medications</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add medication..."
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddMedication()}
                  />
                  <Button onClick={handleAddMedication} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentMedications.map((medication, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      {medication} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Family & Social History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="familyHistory">Family History</Label>
                  <Textarea
                    id="familyHistory"
                    placeholder="Relevant family medical history..."
                    value={familyHistory}
                    onChange={(e) => setFamilyHistory(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialHistory">Social History</Label>
                  <Textarea
                    id="socialHistory"
                    placeholder="Smoking, alcohol, occupation, lifestyle..."
                    value={socialHistory}
                    onChange={(e) => setSocialHistory(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="system-review" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(systemReview).map(([system, value]) => {
                  const IconComponent = getSystemIcon(system)
                  const selectedOption = systemOptions.find((opt) => opt.value === value)

                  return (
                    <div key={system} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {getSystemLabel(system)}
                      </Label>
                      <Select value={value} onValueChange={(newValue) => handleSystemReviewChange(system, newValue)}>
                        <SelectTrigger>
                          <SelectValue>
                            {selectedOption && (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${selectedOption.color.split(" ")[0]}`} />
                                {selectedOption.label}
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {systemOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${option.color.split(" ")[0]}`} />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="clinical-notes" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicalFindings">Clinical Findings</Label>
                  <Textarea
                    id="clinicalFindings"
                    placeholder="Physical examination findings, observations..."
                    value={clinicalFindings}
                    onChange={(e) => setClinicalFindings(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctorNotes">Doctor's Notes</Label>
                  <Textarea
                    id="doctorNotes"
                    placeholder="Clinical impressions, treatment plan, recommendations..."
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privateNotes">Private Notes</Label>
                  <Textarea
                    id="privateNotes"
                    placeholder="Private notes for internal use only..."
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes are for internal use only and will not be shared with the patient
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
