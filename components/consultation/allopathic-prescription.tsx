"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X, Pill, Save } from "lucide-react"
import { toast } from "sonner"

interface AllopathicMedicine {
  id: string
  medicine: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterFood: string
}

interface AllopathicPrescriptionProps {
  department: string
  prescriptions: AllopathicMedicine[]
  onChange: (prescriptions: AllopathicMedicine[]) => void
}

export function AllopathicPrescription({ department, prescriptions = [], onChange }: AllopathicPrescriptionProps) {
  const [localPrescriptions, setLocalPrescriptions] = useState<AllopathicMedicine[]>(prescriptions)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newPrescription, setNewPrescription] = useState<Partial<AllopathicMedicine>>({
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    beforeAfterFood: "after",
  })

  // Department-specific medicine lists
  const departmentMedicines = {
    general: [
      "Paracetamol",
      "Ibuprofen",
      "Aspirin",
      "Amoxicillin",
      "Azithromycin",
      "Ciprofloxacin",
      "Omeprazole",
      "Ranitidine",
      "Cetirizine",
      "Loratadine",
      "Salbutamol",
      "Prednisolone",
      "Metformin",
      "Amlodipine",
      "Atenolol",
      "Furosemide",
      "Spironolactone",
      "Simvastatin",
      "Clopidogrel",
      "Warfarin",
    ],
    cardiology: [
      "Atenolol",
      "Metoprolol",
      "Amlodipine",
      "Lisinopril",
      "Losartan",
      "Furosemide",
      "Spironolactone",
      "Digoxin",
      "Warfarin",
      "Clopidogrel",
      "Aspirin",
      "Simvastatin",
      "Atorvastatin",
      "Isosorbide",
      "Nitroglycerin",
      "Carvedilol",
      "Ramipril",
      "Hydrochlorothiazide",
      "Diltiazem",
      "Verapamil",
    ],
    orthopedics: [
      "Ibuprofen",
      "Diclofenac",
      "Naproxen",
      "Celecoxib",
      "Paracetamol",
      "Tramadol",
      "Morphine",
      "Prednisolone",
      "Methylprednisolone",
      "Calcium Carbonate",
      "Vitamin D3",
      "Alendronate",
      "Risedronate",
      "Glucosamine",
      "Chondroitin",
      "Muscle Relaxants",
      "Thiocolchicoside",
      "Baclofen",
      "Tizanidine",
      "Cyclobenzaprine",
    ],
    neurology: [
      "Phenytoin",
      "Carbamazepine",
      "Valproic Acid",
      "Levetiracetam",
      "Gabapentin",
      "Pregabalin",
      "Amitriptyline",
      "Nortriptyline",
      "Fluoxetine",
      "Sertraline",
      "Donepezil",
      "Memantine",
      "Levodopa",
      "Carbidopa",
      "Pramipexole",
      "Ropinirole",
      "Sumatriptan",
      "Propranolol",
      "Topiramate",
      "Lamotrigine",
    ],
  }

  const currentMedicines =
    departmentMedicines[department as keyof typeof departmentMedicines] || departmentMedicines.general

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
  ]

  const durations = [
    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "14 days",
    "21 days",
    "30 days",
    "60 days",
    "90 days",
    "As needed",
    "Until symptoms resolve",
    "Continue as prescribed",
  ]

  useEffect(() => {
    setLocalPrescriptions(prescriptions)
  }, [prescriptions])

  useEffect(() => {
    onChange(localPrescriptions)
  }, [localPrescriptions, onChange])

  const addPrescription = () => {
    if (!newPrescription.medicine || !newPrescription.dosage || !newPrescription.frequency) {
      toast.error("Please fill in required fields")
      return
    }

    const prescription: AllopathicMedicine = {
      id: Date.now().toString(),
      medicine: newPrescription.medicine!,
      dosage: newPrescription.dosage!,
      frequency: newPrescription.frequency!,
      duration: newPrescription.duration || "",
      instructions: newPrescription.instructions || "",
      beforeAfterFood: newPrescription.beforeAfterFood || "after",
    }

    setLocalPrescriptions((prev) => [...prev, prescription])
    setNewPrescription({
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
    })
    setIsAddingNew(false)
    toast.success("Medicine added to prescription")
  }

  const removePrescription = (id: string) => {
    setLocalPrescriptions((prev) => prev.filter((p) => p.id !== id))
    toast.success("Medicine removed from prescription")
  }

  const updatePrescription = (id: string, field: keyof AllopathicMedicine, value: string) => {
    setLocalPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          Allopathic Prescription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Prescriptions */}
        {localPrescriptions.length > 0 && (
          <div className="space-y-4">
            {localPrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 border rounded-lg bg-blue-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {prescription.medicine}
                      </Badge>
                      <Badge variant="outline">{prescription.dosage}</Badge>
                      <Badge variant="outline">{prescription.frequency}</Badge>
                      {prescription.duration && <Badge variant="outline">{prescription.duration}</Badge>}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Take:</strong> {prescription.beforeAfterFood} food
                      </p>
                      {prescription.instructions && (
                        <p>
                          <strong>Instructions:</strong> {prescription.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrescription(prescription.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Prescription Form */}
        {isAddingNew ? (
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicine">Medicine *</Label>
                <Select
                  value={newPrescription.medicine}
                  onValueChange={(value) => setNewPrescription({ ...newPrescription, medicine: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentMedicines.map((medicine) => (
                      <SelectItem key={medicine} value={medicine}>
                        {medicine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                  placeholder="e.g., 500mg, 1 tablet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={newPrescription.frequency}
                  onValueChange={(value) => setNewPrescription({ ...newPrescription, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={newPrescription.duration}
                  onValueChange={(value) => setNewPrescription({ ...newPrescription, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="beforeAfterFood">Take with food</Label>
                <Select
                  value={newPrescription.beforeAfterFood}
                  onValueChange={(value) => setNewPrescription({ ...newPrescription, beforeAfterFood: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before food</SelectItem>
                    <SelectItem value="after">After food</SelectItem>
                    <SelectItem value="with">With food</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                  placeholder="Any special instructions for the patient..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={addPrescription} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAddingNew(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        )}

        {localPrescriptions.length === 0 && !isAddingNew && (
          <div className="text-center py-8 text-gray-500">
            <Pill className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No medicines prescribed yet</p>
            <p className="text-sm">Click "Add Medicine" to start prescribing</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
