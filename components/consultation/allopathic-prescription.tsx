"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Pill, Search } from "lucide-react"
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
  data: AllopathicMedicine[]
  onChange: (data: AllopathicMedicine[]) => void
}

// Medicine database organized by department
const medicineDatabase = {
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
    "Dextromethorphan",
    "Guaifenesin",
    "Metformin",
    "Glimepiride",
    "Insulin",
    "Atorvastatin",
    "Simvastatin",
    "Amlodipine",
    "Losartan",
    "Enalapril",
    "Hydrochlorothiazide",
    "Furosemide",
    "Prednisolone",
    "Dexamethasone",
  ],
  cardiology: [
    "Atorvastatin",
    "Simvastatin",
    "Rosuvastatin",
    "Amlodipine",
    "Nifedipine",
    "Diltiazem",
    "Metoprolol",
    "Atenolol",
    "Propranolol",
    "Carvedilol",
    "Losartan",
    "Valsartan",
    "Enalapril",
    "Lisinopril",
    "Ramipril",
    "Furosemide",
    "Spironolactone",
    "Digoxin",
    "Warfarin",
    "Aspirin",
    "Clopidogrel",
    "Ticagrelor",
    "Isosorbide Mononitrate",
    "Nitroglycerin",
    "Amiodarone",
  ],
  orthopedics: [
    "Ibuprofen",
    "Diclofenac",
    "Naproxen",
    "Celecoxib",
    "Etoricoxib",
    "Paracetamol",
    "Tramadol",
    "Morphine",
    "Codeine",
    "Prednisolone",
    "Methylprednisolone",
    "Hydrocortisone",
    "Calcium Carbonate",
    "Vitamin D3",
    "Alendronate",
    "Risedronate",
    "Teriparatide",
    "Glucosamine",
    "Chondroitin",
    "Methocarbamol",
    "Cyclobenzaprine",
    "Baclofen",
  ],
  neurology: [
    "Phenytoin",
    "Carbamazepine",
    "Valproic Acid",
    "Levetiracetam",
    "Lamotrigine",
    "Gabapentin",
    "Pregabalin",
    "Topiramate",
    "Sumatriptan",
    "Rizatriptan",
    "Propranolol",
    "Amitriptyline",
    "Fluoxetine",
    "Sertraline",
    "Donepezil",
    "Rivastigmine",
    "Memantine",
    "Levodopa",
    "Carbidopa",
    "Pramipexole",
    "Ropinirole",
    "Baclofen",
    "Tizanidine",
  ],
  dermatology: [
    "Hydrocortisone",
    "Betamethasone",
    "Clobetasol",
    "Tacrolimus",
    "Pimecrolimus",
    "Tretinoin",
    "Adapalene",
    "Benzoyl Peroxide",
    "Clindamycin",
    "Erythromycin",
    "Fluconazole",
    "Ketoconazole",
    "Terbinafine",
    "Acyclovir",
    "Valacyclovir",
    "Cetirizine",
    "Loratadine",
    "Hydroxyzine",
    "Doxycycline",
    "Minocycline",
  ],
  ophthalmology: [
    "Timolol",
    "Latanoprost",
    "Brimonidine",
    "Dorzolamide",
    "Brinzolamide",
    "Prednisolone Acetate",
    "Dexamethasone",
    "Fluorometholone",
    "Tobramycin",
    "Ciprofloxacin",
    "Ofloxacin",
    "Moxifloxacin",
    "Artificial Tears",
    "Cyclopentolate",
    "Tropicamide",
    "Atropine",
    "Pilocarpine",
    "Bevacizumab",
    "Ranibizumab",
    "Aflibercept",
  ],
  pediatrics: [
    "Paracetamol (Pediatric)",
    "Ibuprofen (Pediatric)",
    "Amoxicillin (Pediatric)",
    "Azithromycin (Pediatric)",
    "Cefixime (Pediatric)",
    "ORS",
    "Zinc Sulfate",
    "Iron Drops",
    "Vitamin D Drops",
    "Multivitamin Drops",
    "Salbutamol (Pediatric)",
    "Prednisolone (Pediatric)",
    "Cetirizine (Pediatric)",
    "Domperidone (Pediatric)",
  ],
  gynecology: [
    "Ethinyl Estradiol",
    "Levonorgestrel",
    "Norethindrone",
    "Medroxyprogesterone",
    "Clomiphene",
    "Metformin",
    "Folic Acid",
    "Iron Supplements",
    "Calcium",
    "Fluconazole",
    "Metronidazole",
    "Clindamycin",
    "Doxycycline",
    "Norfloxacin",
    "Mefenamic Acid",
    "Tranexamic Acid",
    "Progesterone",
    "Estradiol",
  ],
}

const frequencyOptions = [
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
  "On empty stomach",
]

const durationOptions = [
  "3 days",
  "5 days",
  "7 days",
  "10 days",
  "14 days",
  "21 days",
  "30 days",
  "2 months",
  "3 months",
  "6 months",
  "As needed",
  "Until symptoms resolve",
  "Continue current dose",
  "Taper as directed",
]

const beforeAfterFoodOptions = [
  { value: "before", label: "Before food" },
  { value: "after", label: "After food" },
  { value: "with", label: "With food" },
  { value: "anytime", label: "Anytime" },
  { value: "empty_stomach", label: "Empty stomach" },
]

export function AllopathicPrescription({ department, data, onChange }: AllopathicPrescriptionProps) {
  const [prescriptions, setPrescriptions] = useState<AllopathicMedicine[]>(data || [])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newPrescription, setNewPrescription] = useState<Partial<AllopathicMedicine>>({
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    beforeAfterFood: "after",
  })

  // Get medicines for current department
  const availableMedicines = medicineDatabase[department as keyof typeof medicineDatabase] || medicineDatabase.general

  // Filter medicines based on search term
  const filteredMedicines = availableMedicines.filter((medicine) =>
    medicine.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    setPrescriptions(data || [])
  }, [data])

  useEffect(() => {
    onChange(prescriptions)
  }, [prescriptions, onChange])

  const addPrescription = () => {
    if (
      !newPrescription.medicine ||
      !newPrescription.dosage ||
      !newPrescription.frequency ||
      !newPrescription.duration
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const prescription: AllopathicMedicine = {
      id: Date.now().toString(),
      medicine: newPrescription.medicine!,
      dosage: newPrescription.dosage!,
      frequency: newPrescription.frequency!,
      duration: newPrescription.duration!,
      instructions: newPrescription.instructions || "",
      beforeAfterFood: newPrescription.beforeAfterFood || "after",
    }

    setPrescriptions((prev) => [...prev, prescription])
    setNewPrescription({
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
    })
    setIsAddingNew(false)
    setSearchTerm("")
    toast.success("Allopathic medicine added to prescription")
  }

  const removePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id))
    toast.success("Medicine removed from prescription")
  }

  const updatePrescription = (id: string, field: keyof AllopathicMedicine, value: string) => {
    setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          Allopathic Prescription
          {prescriptions.length > 0 && <Badge variant="secondary">{prescriptions.length} medicines</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Prescriptions */}
        {prescriptions.length > 0 && (
          <div className="space-y-3">
            {prescriptions.map((prescription, index) => (
              <div key={prescription.id} className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">{prescription.medicine}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-white">
                        {prescription.dosage}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        {prescription.frequency}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        {prescription.duration}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        {beforeAfterFoodOptions.find((opt) => opt.value === prescription.beforeAfterFood)?.label}
                      </Badge>
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
                {prescription.instructions && (
                  <div className="text-sm text-blue-700 bg-white/60 p-2 rounded border">
                    <strong>Instructions:</strong> {prescription.instructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Prescription */}
        {!isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Allopathic Medicine
          </Button>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Add New Allopathic Medicine</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNew(false)
                  setSearchTerm("")
                  setNewPrescription({
                    medicine: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                    beforeAfterFood: "after",
                  })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medicine Selection */}
              <div className="space-y-2">
                <Label>Medicine Name *</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={newPrescription.medicine}
                    onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, medicine: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {filteredMedicines.map((medicine) => (
                        <SelectItem key={medicine} value={medicine}>
                          {medicine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dosage */}
              <div className="space-y-2">
                <Label>Dosage *</Label>
                <Input
                  placeholder="e.g., 500mg, 1 tablet, 5ml"
                  value={newPrescription.dosage}
                  onChange={(e) => setNewPrescription((prev) => ({ ...prev, dosage: e.target.value }))}
                />
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label>Frequency *</Label>
                <Select
                  value={newPrescription.frequency}
                  onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select
                  value={newPrescription.duration}
                  onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Before/After Food */}
              <div className="space-y-2">
                <Label>Food Timing</Label>
                <Select
                  value={newPrescription.beforeAfterFood}
                  onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, beforeAfterFood: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    {beforeAfterFoodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                placeholder="Any special instructions for the patient..."
                value={newPrescription.instructions}
                onChange={(e) => setNewPrescription((prev) => ({ ...prev, instructions: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={addPrescription} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false)
                  setSearchTerm("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {prescriptions.length === 0 && !isAddingNew && (
          <div className="text-center py-8 text-gray-500">
            <Pill className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No allopathic medicines prescribed yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
