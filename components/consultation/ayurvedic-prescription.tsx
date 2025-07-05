"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Plus, X, Leaf, Save } from "lucide-react"
import { toast } from "sonner"

interface AyurvedicMedicine {
  id: string
  medicineType: string
  componentMedicines: string[]
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterFood: string
}

interface AyurvedicPrescriptionProps {
  prescriptions: AyurvedicMedicine[]
  onChange: (prescriptions: AyurvedicMedicine[]) => void
}

export function AyurvedicPrescription({ prescriptions = [], onChange }: AyurvedicPrescriptionProps) {
  const [localPrescriptions, setLocalPrescriptions] = useState<AyurvedicMedicine[]>(prescriptions)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newPrescription, setNewPrescription] = useState<Partial<AyurvedicMedicine>>({
    medicineType: "",
    componentMedicines: [],
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    beforeAfterFood: "after",
  })

  // Ayurvedic medicine types
  const medicineTypes = [
    "Churna (Powder)",
    "Vati (Tablet)",
    "Kashayam (Decoction)",
    "Ghrita (Ghee preparation)",
    "Taila (Oil)",
    "Asava/Arishta (Fermented)",
    "Avaleha (Jam/Paste)",
    "Bhasma (Ash)",
    "Rasa (Mercury preparation)",
    "Guggulu (Resin preparation)",
    "Kwatha (Decoction)",
    "Swarasa (Fresh juice)",
    "Kalka (Paste)",
    "Leha (Linctus)",
    "Pishti (Fine powder)",
  ]

  // Comprehensive list of Ayurvedic herbs and medicines
  const ayurvedicHerbs = [
    { label: "Ashwagandha", value: "Ashwagandha" },
    { label: "Brahmi", value: "Brahmi" },
    { label: "Shankhpushpi", value: "Shankhpushpi" },
    { label: "Mandukaparni", value: "Mandukaparni" },
    { label: "Jatamansi", value: "Jatamansi" },
    { label: "Triphala", value: "Triphala" },
    { label: "Amalaki", value: "Amalaki" },
    { label: "Bibhitaki", value: "Bibhitaki" },
    { label: "Haritaki", value: "Haritaki" },
    { label: "Trikatu", value: "Trikatu" },
    { label: "Shunthi", value: "Shunthi" },
    { label: "Maricha", value: "Maricha" },
    { label: "Pippali", value: "Pippali" },
    { label: "Guduchi", value: "Guduchi" },
    { label: "Neem", value: "Neem" },
    { label: "Turmeric", value: "Turmeric" },
    { label: "Arjuna", value: "Arjuna" },
    { label: "Punarnava", value: "Punarnava" },
    { label: "Gokshura", value: "Gokshura" },
    { label: "Shatavari", value: "Shatavari" },
    { label: "Vidari", value: "Vidari" },
    { label: "Bala", value: "Bala" },
    { label: "Atibala", value: "Atibala" },
    { label: "Nagbala", value: "Nagbala" },
    { label: "Dashmool", value: "Dashmool" },
    { label: "Saraswatarishta", value: "Saraswatarishta" },
    { label: "Draksharishta", value: "Draksharishta" },
    { label: "Kumaryasava", value: "Kumaryasava" },
    { label: "Chandanasava", value: "Chandanasava" },
    { label: "Chitrakadi Vati", value: "Chitrakadi Vati" },
    { label: "Hingvastak Churna", value: "Hingvastak Churna" },
    { label: "Avipattikar Churna", value: "Avipattikar Churna" },
    { label: "Sitopaladi Churna", value: "Sitopaladi Churna" },
    { label: "Talisadi Churna", value: "Talisadi Churna" },
    { label: "Lavangadi Vati", value: "Lavangadi Vati" },
    { label: "Khadiradi Vati", value: "Khadiradi Vati" },
    { label: "Vyoshadi Vati", value: "Vyoshadi Vati" },
    { label: "Chandraprabha Vati", value: "Chandraprabha Vati" },
    { label: "Kanchanar Guggulu", value: "Kanchanar Guggulu" },
    { label: "Triphala Guggulu", value: "Triphala Guggulu" },
    { label: "Yograj Guggulu", value: "Yograj Guggulu" },
    { label: "Mahayograj Guggulu", value: "Mahayograj Guggulu" },
    { label: "Punarnavadi Guggulu", value: "Punarnavadi Guggulu" },
    { label: "Gokshuradi Guggulu", value: "Gokshuradi Guggulu" },
    { label: "Brahmi Ghrita", value: "Brahmi Ghrita" },
    { label: "Saraswata Ghrita", value: "Saraswata Ghrita" },
    { label: "Kalyanaka Ghrita", value: "Kalyanaka Ghrita" },
    { label: "Mahanarayan Taila", value: "Mahanarayan Taila" },
    { label: "Ksheerabala Taila", value: "Ksheerabala Taila" },
    { label: "Dhanwantaram Taila", value: "Dhanwantaram Taila" },
    { label: "Chyawanprash", value: "Chyawanprash" },
    { label: "Brahma Rasayana", value: "Brahma Rasayana" },
    { label: "Medhya Rasayana", value: "Medhya Rasayana" },
    { label: "Swarna Bhasma", value: "Swarna Bhasma" },
    { label: "Rajata Bhasma", value: "Rajata Bhasma" },
    { label: "Abhrak Bhasma", value: "Abhrak Bhasma" },
    { label: "Loha Bhasma", value: "Loha Bhasma" },
    { label: "Mandur Bhasma", value: "Mandur Bhasma" },
    { label: "Praval Bhasma", value: "Praval Bhasma" },
    { label: "Mukta Bhasma", value: "Mukta Bhasma" },
    { label: "Kapardika Bhasma", value: "Kapardika Bhasma" },
    { label: "Godanti Bhasma", value: "Godanti Bhasma" },
    { label: "Shankha Bhasma", value: "Shankha Bhasma" },
  ]

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Before sunrise",
    "After sunset",
    "Before meals",
    "After meals",
    "With meals",
    "Empty stomach",
    "At bedtime",
    "As needed",
  ]

  const durations = [
    "7 days",
    "14 days",
    "21 days",
    "30 days",
    "45 days",
    "60 days",
    "90 days",
    "Until symptoms resolve",
    "As prescribed",
    "Continuous",
  ]

  useEffect(() => {
    setLocalPrescriptions(prescriptions)
  }, [prescriptions])

  useEffect(() => {
    onChange(localPrescriptions)
  }, [localPrescriptions, onChange])

  const addPrescription = () => {
    if (
      !newPrescription.medicineType ||
      !newPrescription.componentMedicines?.length ||
      !newPrescription.dosage ||
      !newPrescription.frequency
    ) {
      toast.error("Please fill in required fields")
      return
    }

    const prescription: AyurvedicMedicine = {
      id: Date.now().toString(),
      medicineType: newPrescription.medicineType!,
      componentMedicines: newPrescription.componentMedicines!,
      dosage: newPrescription.dosage!,
      frequency: newPrescription.frequency!,
      duration: newPrescription.duration || "",
      instructions: newPrescription.instructions || "",
      beforeAfterFood: newPrescription.beforeAfterFood || "after",
    }

    setLocalPrescriptions((prev) => [...prev, prescription])
    setNewPrescription({
      medicineType: "",
      componentMedicines: [],
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
    })
    setIsAddingNew(false)
    toast.success("Ayurvedic medicine added to prescription")
  }

  const removePrescription = (id: string) => {
    setLocalPrescriptions((prev) => prev.filter((p) => p.id !== id))
    toast.success("Medicine removed from prescription")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Ayurvedic Prescription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Prescriptions */}
        {localPrescriptions.length > 0 && (
          <div className="space-y-4">
            {localPrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 border rounded-lg bg-green-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {prescription.medicineType}
                      </Badge>
                      <Badge variant="outline">{prescription.dosage}</Badge>
                      <Badge variant="outline">{prescription.frequency}</Badge>
                      {prescription.duration && <Badge variant="outline">{prescription.duration}</Badge>}
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Components: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prescription.componentMedicines.map((component, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                            {component}
                          </Badge>
                        ))}
                      </div>
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicineType">Medicine Type *</Label>
                  <Select
                    value={newPrescription.medicineType}
                    onValueChange={(value) => setNewPrescription({ ...newPrescription, medicineType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicineTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
                    placeholder="e.g., 1 tsp, 2 tablets, 10ml"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="componentMedicines">Component Medicines *</Label>
                <MultiSelect
                  options={ayurvedicHerbs}
                  selected={newPrescription.componentMedicines || []}
                  onChange={(selected) => setNewPrescription({ ...newPrescription, componentMedicines: selected })}
                  placeholder="Select component medicines/herbs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="empty">Empty stomach</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                  placeholder="Any special instructions, anupana (vehicle), or preparation method..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={addPrescription} className="bg-green-600 hover:bg-green-700">
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
            Add Ayurvedic Medicine
          </Button>
        )}

        {localPrescriptions.length === 0 && !isAddingNew && (
          <div className="text-center py-8 text-gray-500">
            <Leaf className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No Ayurvedic medicines prescribed yet</p>
            <p className="text-sm">Click "Add Ayurvedic Medicine" to start prescribing</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
