"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { Plus, X, Leaf, Search } from "lucide-react"
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
  anupana?: string // Vehicle for administration
}

interface AyurvedicPrescriptionProps {
  data: AyurvedicMedicine[]
  onChange: (data: AyurvedicMedicine[]) => void
}

// Ayurvedic medicine types
const medicineTypes = [
  { value: "churna", label: "Churna (Powder)" },
  { value: "vati", label: "Vati/Gutika (Tablet)" },
  { value: "kashayam", label: "Kashayam (Decoction)" },
  { value: "ghrita", label: "Ghrita (Medicated Ghee)" },
  { value: "taila", label: "Taila (Medicated Oil)" },
  { value: "asava", label: "Asava (Fermented Medicine)" },
  { value: "aristha", label: "Aristha (Fermented Medicine)" },
  { value: "rasa", label: "Rasa Aushadhi (Mineral Medicine)" },
  { value: "bhasma", label: "Bhasma (Calcined Medicine)" },
  { value: "avaleha", label: "Avaleha/Lehyam (Paste)" },
  { value: "kwatha", label: "Kwatha (Decoction)" },
  { value: "swarasa", label: "Swarasa (Fresh Juice)" },
]

// Comprehensive Ayurvedic component medicines database
const componentMedicines = [
  // Classical Single Herbs (Ekadravya)
  "Ashwagandha",
  "Brahmi",
  "Shankhpushpi",
  "Mandukaparni",
  "Jatamansi",
  "Vacha",
  "Guduchi",
  "Amla",
  "Haritaki",
  "Bibhitaki",
  "Vibhitaki",
  "Triphala",
  "Turmeric",
  "Ginger",
  "Black Pepper",
  "Long Pepper",
  "Cinnamon",
  "Cardamom",
  "Neem",
  "Tulsi",
  "Arjuna",
  "Punarnava",
  "Gokshura",
  "Shatavari",
  "Safed Musli",
  "Kaunch Beej",
  "Vidari Kand",
  "Bala",
  "Atibala",
  "Nagbala",

  // Classical Formulations - Churnas
  "Triphala Churna",
  "Trikatu Churna",
  "Hingvastak Churna",
  "Lavanbhaskar Churna",
  "Sitopaladi Churna",
  "Talishadi Churna",
  "Avipattikara Churna",
  "Gangadhara Churna",
  "Chitrakadi Churna",
  "Jiraka Churna",
  "Panchakola Churna",
  "Vyoshadi Churna",

  // Classical Formulations - Vatis/Tablets
  "Yograj Guggulu",
  "Kanchanar Guggulu",
  "Triphala Guggulu",
  "Medohar Guggulu",
  "Punarnavadi Guggulu",
  "Gokshuradi Guggulu",
  "Chandraprabha Vati",
  "Arogyavardhini Vati",
  "Kutajarishta Vati",
  "Bilwadi Churna",
  "Mahasudarshan Churna",
  "Sanjivani Vati",
  "Laxmivilas Ras",
  "Tribhuvankirti Ras",
  "Godanti Mishran",
  "Praval Pishti",

  // Classical Formulations - Ghrita
  "Brahmi Ghrita",
  "Saraswatarishta",
  "Kalyanaka Ghrita",
  "Panchatikta Ghrita",
  "Triphala Ghrita",
  "Mahatikta Ghrita",
  "Dadimadi Ghrita",
  "Indukanta Ghrita",

  // Classical Formulations - Kashayam/Kwatha
  "Dashamoola Kwatha",
  "Punarnavadi Kwatha",
  "Gokshuradi Kwatha",
  "Pathyadi Kwatha",
  "Sarivadi Kwatha",
  "Chandanadi Kwatha",
  "Usiradi Kwatha",
  "Parpatadi Kwatha",

  // Classical Formulations - Asava/Aristha
  "Dashamoolarishta",
  "Saraswatarishta",
  "Kutajarishta",
  "Jirakadyarishta",
  "Punarnavasava",
  "Drakshasava",
  "Kumaryasava",
  "Lohasava",
  "Abhayarishta",

  // Rasa Aushadhis (Mineral Medicines)
  "Swarna Bhasma",
  "Rajata Bhasma",
  "Tamra Bhasma",
  "Loha Bhasma",
  "Yashada Bhasma",
  "Mandura Bhasma",
  "Pravala Bhasma",
  "Mukta Bhasma",
  "Shankha Bhasma",
  "Kaparda Bhasma",
  "Godanti Bhasma",
  "Shilajatu",
  "Kasturi",
  "Hingula",
  "Gandhaka",

  // Avaleha/Lehyam
  "Chyawanprash",
  "Brahma Rasayana",
  "Medhya Rasayana",
  "Narasimha Rasayana",
  "Agastya Haritaki",
  "Vyaghri Haritaki",
  "Drakshadi Lehyam",
  "Vasavaleha",

  // Modern Ayurvedic Preparations
  "Liv 52",
  "Tentex Forte",
  "Confido",
  "Himcolin",
  "Septilin",
  "Immunol",
  "Diabecon",
  "Karela",
  "Meshashringi",
  "Bitter Gourd",
  "Fenugreek",
  "Jamun",

  // Regional/Traditional Medicines
  "Khadirarishta",
  "Manjisthadi Kwatha",
  "Saribadyasava",
  "Chandanasava",
  "Pippalyasava",
  "Madhumehari Churna",
  "Nishamalaki Churna",
  "Kalmegh",

  // Specialized Preparations
  "Makaradhwaja",
  "Vasant Kusumakar Ras",
  "Hridayarnava Ras",
  "Suvarna Vasant Malati",
  "Brihat Vata Chintamani",
  "Ekangveer Ras",
  "Sameer Pannag Ras",
  "Yogendra Ras",
]

const frequencyOptions = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Before sunrise",
  "After sunset",
  "With meals",
  "Between meals",
  "Empty stomach",
  "As needed",
  "During symptoms",
]

const durationOptions = [
  "3 days",
  "7 days",
  "15 days",
  "21 days",
  "30 days",
  "45 days",
  "2 months",
  "3 months",
  "6 months",
  "Until symptoms resolve",
  "As per Acharya's advice",
  "Continue as tolerated",
]

const beforeAfterFoodOptions = [
  { value: "before", label: "Before food" },
  { value: "after", label: "After food" },
  { value: "with", label: "With food" },
  { value: "empty_stomach", label: "Empty stomach" },
  { value: "anytime", label: "Anytime" },
]

const anupanaOptions = [
  "Warm water",
  "Honey",
  "Ghee",
  "Milk",
  "Buttermilk",
  "Ginger juice",
  "Lemon juice",
  "Rose water",
  "Coconut water",
  "Sesame oil",
  "Castor oil",
]

export function AyurvedicPrescription({ data, onChange }: AyurvedicPrescriptionProps) {
  const [prescriptions, setPrescriptions] = useState<AyurvedicMedicine[]>(data || [])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [newPrescription, setNewPrescription] = useState<Partial<AyurvedicMedicine>>({
    medicineType: "",
    componentMedicines: [],
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    beforeAfterFood: "after",
    anupana: "",
  })

  // Filter component medicines based on search term
  const filteredComponentMedicines = componentMedicines
    .filter((medicine) => medicine.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((medicine) => ({ value: medicine, label: medicine }))

  useEffect(() => {
    setPrescriptions(data || [])
  }, [data])

  useEffect(() => {
    onChange(prescriptions)
  }, [prescriptions, onChange])

  const addPrescription = () => {
    if (
      !newPrescription.medicineType ||
      !newPrescription.componentMedicines?.length ||
      !newPrescription.dosage ||
      !newPrescription.frequency ||
      !newPrescription.duration
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const prescription: AyurvedicMedicine = {
      id: Date.now().toString(),
      medicineType: newPrescription.medicineType!,
      componentMedicines: newPrescription.componentMedicines!,
      dosage: newPrescription.dosage!,
      frequency: newPrescription.frequency!,
      duration: newPrescription.duration!,
      instructions: newPrescription.instructions || "",
      beforeAfterFood: newPrescription.beforeAfterFood || "after",
      anupana: newPrescription.anupana || "",
    }

    setPrescriptions((prev) => [...prev, prescription])
    setNewPrescription({
      medicineType: "",
      componentMedicines: [],
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
      anupana: "",
    })
    setIsAddingNew(false)
    setSearchTerm("")
    toast.success("Ayurvedic medicine added to prescription")
  }

  const removePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id))
    toast.success("Medicine removed from prescription")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Ayurvedic Prescription
          {prescriptions.length > 0 && <Badge variant="secondary">{prescriptions.length} medicines</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Prescriptions */}
        {prescriptions.length > 0 && (
          <div className="space-y-3">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-green-900">
                        {medicineTypes.find((type) => type.value === prescription.medicineType)?.label}
                      </h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {prescription.medicineType}
                      </Badge>
                    </div>

                    {/* Component Medicines */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-green-800 mb-1">Components:</p>
                      <div className="flex flex-wrap gap-1">
                        {prescription.componentMedicines.map((component, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-white border-green-200">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Dosage and Instructions */}
                    <div className="flex flex-wrap gap-2 mb-2">
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
                      {prescription.anupana && (
                        <Badge variant="outline" className="bg-white">
                          With {prescription.anupana}
                        </Badge>
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

                {prescription.instructions && (
                  <div className="text-sm text-green-700 bg-white/60 p-2 rounded border">
                    <strong>Instructions:</strong> {prescription.instructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Prescription */}
        {!isAddingNew ? (
          <Button onClick={() => setIsAddingNew(true)} className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Ayurvedic Medicine
          </Button>
        ) : (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Add New Ayurvedic Medicine</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingNew(false)
                  setSearchTerm("")
                  setNewPrescription({
                    medicineType: "",
                    componentMedicines: [],
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                    beforeAfterFood: "after",
                    anupana: "",
                  })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medicine Type */}
              <div className="space-y-2">
                <Label>Medicine Type *</Label>
                <Select
                  value={newPrescription.medicineType}
                  onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, medicineType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select medicine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicineTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dosage */}
              <div className="space-y-2">
                <Label>Dosage *</Label>
                <Input
                  placeholder="e.g., 1 tsp, 2 tablets, 10ml"
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

              {/* Anupana */}
              <div className="space-y-2">
                <Label>Anupana (Vehicle)</Label>
                <Select
                  value={newPrescription.anupana}
                  onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, anupana: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select anupana" />
                  </SelectTrigger>
                  <SelectContent>
                    {anupanaOptions.map((anupana) => (
                      <SelectItem key={anupana} value={anupana}>
                        {anupana}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Component Medicines Multi-Select */}
            <div className="space-y-2">
              <Label>Component Medicines *</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Ayurvedic medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <MultiSelect
                  options={filteredComponentMedicines}
                  selected={newPrescription.componentMedicines || []}
                  onChange={(selected) => setNewPrescription((prev) => ({ ...prev, componentMedicines: selected }))}
                  placeholder="Select component medicines..."
                  className="w-full"
                />
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
              <Button onClick={addPrescription} className="bg-green-600 hover:bg-green-700">
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
            <Leaf className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No Ayurvedic medicines prescribed yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
