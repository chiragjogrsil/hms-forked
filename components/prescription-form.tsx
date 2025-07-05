"use client"

import Link from "next/link"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import { Plus, Trash2, CalendarIcon, Calculator } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample medication database - in a real app, this would come from an API
const medicationDatabase = [
  { id: "med-001", name: "Paracetamol 500mg", category: "Analgesic" },
  { id: "med-002", name: "Amoxicillin 500mg", category: "Antibiotic" },
  { id: "med-003", name: "Cetirizine 10mg", category: "Antihistamine" },
  { id: "med-004", name: "Omeprazole 20mg", category: "Proton Pump Inhibitor" },
  { id: "med-005", name: "Amlodipine 5mg", category: "Antihypertensive" },
  { id: "med-006", name: "Atorvastatin 10mg", category: "Statin" },
  { id: "med-007", name: "Metformin 500mg", category: "Antidiabetic" },
  { id: "med-008", name: "Aspirin 75mg", category: "Antiplatelet" },
  { id: "med-009", name: "Diazepam 5mg", category: "Anxiolytic" },
  { id: "med-010", name: "Salbutamol Inhaler", category: "Bronchodilator" },
]

// Sample doctors - in a real app, this would come from an API
const doctors = [
  { id: "doc-001", name: "Dr. Sharma", department: "General Medicine" },
  { id: "doc-002", name: "Dr. Gupta", department: "Cardiology" },
  { id: "doc-003", name: "Dr. Patel", department: "Pediatrics" },
  { id: "doc-004", name: "Dr. Singh", department: "Orthopedics" },
  { id: "doc-005", name: "Dr. Kumar", department: "Neurology" },
]

// Common diagnoses - in a real app, this would come from an API
const diagnoses = [
  { id: "diag-001", name: "Hypertension" },
  { id: "diag-002", name: "Type 2 Diabetes Mellitus" },
  { id: "diag-003", name: "Acute Upper Respiratory Infection" },
  { id: "diag-004", name: "Urinary Tract Infection" },
  { id: "diag-005", name: "Gastroenteritis" },
  { id: "diag-006", name: "Migraine" },
  { id: "diag-007", name: "Osteoarthritis" },
  { id: "diag-008", name: "Bronchial Asthma" },
  { id: "diag-009", name: "Dyslipidemia" },
  { id: "diag-010", name: "Hypothyroidism" },
  { id: "diag-011", name: "Anxiety Disorder" },
  { id: "diag-012", name: "Depression" },
  { id: "diag-013", name: "Gastroesophageal Reflux Disease" },
  { id: "diag-014", name: "Allergic Rhinitis" },
  { id: "diag-015", name: "Anemia" },
]

// Duration options
const durationOptions = [
  { value: "3 days", label: "3 days", days: 3 },
  { value: "5 days", label: "5 days", days: 5 },
  { value: "7 days", label: "7 days", days: 7 },
  { value: "10 days", label: "10 days", days: 10 },
  { value: "14 days", label: "14 days", days: 14 },
  { value: "1 month", label: "1 month", days: 30 },
  { value: "2 months", label: "2 months", days: 60 },
  { value: "3 months", label: "3 months", days: 90 },
  { value: "as needed", label: "As needed", days: 0 },
]

// Helper function to provide clear timing instructions
const getTimingInstructions = (dosage: string): string => {
  const instructions: Record<string, string> = {
    "1-0-0": "Take 1 tablet in the morning after breakfast",
    "0-1-0": "Take 1 tablet in the afternoon after lunch",
    "0-0-1": "Take 1 tablet in the evening after dinner",
    "1-0-1": "Take 1 tablet in the morning after breakfast and 1 tablet in the evening after dinner",
    "1-1-0": "Take 1 tablet in the morning after breakfast and 1 tablet in the afternoon after lunch",
    "0-1-1": "Take 1 tablet in the afternoon after lunch and 1 tablet in the evening after dinner",
    "1-1-1": "Take 1 tablet three times daily after meals (breakfast, lunch, dinner)",
    "1-1-1-1": "Take 1 tablet four times daily after meals and before bedtime",
    "2-0-0": "Take 2 tablets in the morning after breakfast",
    "2-0-2": "Take 2 tablets in the morning after breakfast and 2 tablets in the evening after dinner",
    "1/2-0-1/2": "Take half tablet in the morning after breakfast and half tablet in the evening after dinner",
    SOS: "Take as needed when symptoms occur",
  }
  return instructions[dosage] || "Follow doctor's instructions"
}

// Function to parse dosage and calculate daily count
const calculateDailyDosage = (dosage: string): number => {
  // Handle common formats like "1-0-1", "1-1-1-1", "1", etc.
  if (!dosage) return 0

  // Check if it's a simple number
  if (/^\d+$/.test(dosage)) {
    return Number.parseInt(dosage, 10)
  }

  // Handle formats like "1-0-1" (morning-afternoon-evening)
  if (dosage.includes("-")) {
    return dosage.split("-").reduce((sum, part) => sum + (Number.parseInt(part, 10) || 0), 0)
  }

  // Handle formats like "1 tab TID" (TID = three times a day)
  if (dosage.toLowerCase().includes("tid")) {
    return 3
  }

  // Handle formats like "1 tab BID" (BID = twice a day)
  if (dosage.toLowerCase().includes("bid")) {
    return 2
  }

  // Handle formats like "1 tab QID" (QID = four times a day)
  if (dosage.toLowerCase().includes("qid")) {
    return 4
  }

  // Handle formats like "1 tab OD" (OD = once a day)
  if (dosage.toLowerCase().includes("od")) {
    return 1
  }

  // Default to 1 if we can't parse it
  return 1
}

// Function to calculate quantity based on dosage and duration
const calculateQuantity = (dosage: string, duration: string): number => {
  if (!dosage || !duration) return 0

  const dailyDosage = calculateDailyDosage(dosage)

  // Find the duration in days
  const durationOption = durationOptions.find((option) => option.value === duration)
  if (!durationOption) return 0

  // If "as needed", return a default quantity of 10
  if (duration === "as needed") return 10

  // Calculate total quantity
  return dailyDosage * durationOption.days
}

interface PrescriptionFormProps {
  patient: any
  onSubmit: (data: any) => void
}

export function PrescriptionForm({ patient, onSubmit }: PrescriptionFormProps) {
  const [medications, setMedications] = useState<any[]>([{ id: "", name: "", dosage: "", duration: "", quantity: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(undefined)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  // Set the diagnosis value when selected from dropdown
  useEffect(() => {
    if (selectedDiagnosis) {
      setValue("diagnosis", selectedDiagnosis)
    }
  }, [selectedDiagnosis, setValue])

  // Update quantities whenever dosage or duration changes
  useEffect(() => {
    const updatedMedications = medications.map((med) => ({
      ...med,
      quantity: calculateQuantity(med.dosage, med.duration),
    }))
    setMedications(updatedMedications)
  }, [medications.map((med) => med.dosage + med.duration).join(",")])

  const addMedication = () => {
    setMedications([...medications, { id: "", name: "", dosage: "", duration: "", quantity: 0 }])
  }

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      const updatedMedications = [...medications]
      updatedMedications.splice(index, 1)
      setMedications(updatedMedications)
    }
  }

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...medications]

    if (field === "name") {
      const selectedMed = medicationDatabase.find((med) => med.id === value)
      if (selectedMed) {
        updatedMedications[index] = {
          ...updatedMedications[index],
          id: selectedMed.id,
          name: selectedMed.name,
        }
      }
    } else {
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      }

      // If dosage or duration changed, update quantity
      if (field === "dosage" || field === "duration") {
        const med = updatedMedications[index]
        updatedMedications[index].quantity = calculateQuantity(med.dosage, med.duration)
      }
    }

    setMedications(updatedMedications)
  }

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Combine form data with medications and follow-up date
      const prescriptionData = {
        ...data,
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        medications: medications.filter((med) => med.id),
        followUpDate: followUpDate ? followUpDate.toISOString() : null,
        date: new Date().toISOString(),
      }

      await onSubmit(prescriptionData)
    } catch (error) {
      console.error("Error submitting prescription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="doctor">Doctor</Label>
          <Select {...register("doctor", { required: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.department})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.doctor && <p className="text-sm text-red-500 mt-1">Doctor is required</p>}
        </div>

        <div>
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Select
            value={selectedDiagnosis}
            onValueChange={setSelectedDiagnosis}
            {...register("diagnosis", { required: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select diagnosis" />
            </SelectTrigger>
            <SelectContent>
              {diagnoses.map((diagnosis) => (
                <SelectItem key={diagnosis.id} value={diagnosis.name}>
                  {diagnosis.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.diagnosis && <p className="text-sm text-red-500 mt-1">Diagnosis is required</p>}
        </div>

        <div>
          <Label htmlFor="followUpDate">Follow-up Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !followUpDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {followUpDate ? format(followUpDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={followUpDate}
                onSelect={setFollowUpDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Medications</Label>
          <Button type="button" variant="outline" size="sm" onClick={addMedication}>
            <Plus className="h-4 w-4 mr-1" /> Add Medication
          </Button>
        </div>

        <div className="space-y-3">
          {medications.map((medication, index) => (
            <Card key={index} className="p-3">
              <div className="grid gap-3 md:grid-cols-6">
                <div className="md:col-span-2">
                  <Label htmlFor={`medication-${index}`}>Medication</Label>
                  <Select value={medication.id} onValueChange={(value) => handleMedicationChange(index, "name", value)}>
                    <SelectTrigger id={`medication-${index}`}>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicationDatabase.map((med) => (
                        <SelectItem key={med.id} value={med.id}>
                          {med.name} ({med.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Structured Dosage Input */}
                <div>
                  <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                  <Select
                    value={medication.dosage}
                    onValueChange={(value) => handleMedicationChange(index, "dosage", value)}
                  >
                    <SelectTrigger id={`dosage-${index}`}>
                      <SelectValue placeholder="Select dosage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-0-0">1-0-0 (Once daily - Morning)</SelectItem>
                      <SelectItem value="0-1-0">0-1-0 (Once daily - Afternoon)</SelectItem>
                      <SelectItem value="0-0-1">0-0-1 (Once daily - Evening)</SelectItem>
                      <SelectItem value="1-0-1">1-0-1 (Twice daily - Morning & Evening)</SelectItem>
                      <SelectItem value="1-1-0">1-1-0 (Twice daily - Morning & Afternoon)</SelectItem>
                      <SelectItem value="0-1-1">0-1-1 (Twice daily - Afternoon & Evening)</SelectItem>
                      <SelectItem value="1-1-1">1-1-1 (Three times daily)</SelectItem>
                      <SelectItem value="1-1-1-1">1-1-1-1 (Four times daily)</SelectItem>
                      <SelectItem value="2-0-0">2-0-0 (2 tablets - Morning)</SelectItem>
                      <SelectItem value="2-0-2">2-0-2 (2 tablets - Morning & Evening)</SelectItem>
                      <SelectItem value="1/2-0-1/2">1/2-0-1/2 (Half tablet - Morning & Evening)</SelectItem>
                      <SelectItem value="SOS">SOS (As needed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Route of Administration */}
                <div>
                  <Label htmlFor={`route-${index}`}>Route</Label>
                  <Select
                    value={medication.route || "oral"}
                    onValueChange={(value) => handleMedicationChange(index, "route", value)}
                  >
                    <SelectTrigger id={`route-${index}`}>
                      <SelectValue placeholder="Route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="topical">Topical</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="inhaler">Inhaler</SelectItem>
                      <SelectItem value="drops">Drops</SelectItem>
                      <SelectItem value="sublingual">Sublingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`duration-${index}`}>Duration</Label>
                  <Select
                    value={medication.duration}
                    onValueChange={(value) => handleMedicationChange(index, "duration", value)}
                  >
                    <SelectTrigger id={`duration-${index}`}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Auto-calculated from dosage and duration</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input id={`quantity-${index}`} value={medication.quantity || 0} readOnly className="bg-muted" />
                    {medication.quantity > 0 && (
                      <p className="text-xs text-green-600 mt-1">✓ {medication.quantity} tablets calculated</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-0.5"
                    onClick={() => removeMedication(index)}
                    disabled={medications.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add timing instructions */}
              {medication.dosage && medication.dosage !== "SOS" && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <strong>Instructions:</strong> {getTimingInstructions(medication.dosage)}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="instructions">Special Instructions</Label>
        <Textarea
          id="instructions"
          placeholder="Enter any special instructions for the patient"
          className="h-24"
          {...register("instructions")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link href={`/patients/${patient.id}`}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Prescription"}
        </Button>
      </div>
    </form>
  )
}
