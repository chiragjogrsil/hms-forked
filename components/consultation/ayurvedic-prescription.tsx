"use client"

import { useState, useEffect } from "react"
import { Plus, X, Save, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SavePrescriptionTemplateModal } from "@/components/modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "@/components/modals/load-prescription-template-modal"

interface AyurvedicMedicine {
  id: string
  medicine: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterFood: string
}

interface AyurvedicPrescriptionProps {
  data: AyurvedicMedicine[]
  onChange: (data: AyurvedicMedicine[]) => void
}

export function AyurvedicPrescription({ data = [], onChange }: AyurvedicPrescriptionProps) {
  const [medicines, setMedicines] = useState<AyurvedicMedicine[]>(data)
  const [newMedicine, setNewMedicine] = useState<Partial<AyurvedicMedicine>>({
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    beforeAfterFood: "after",
  })
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false)
  const [isLoadTemplateModalOpen, setIsLoadTemplateModalOpen] = useState(false)
  const [isDataPrefilled, setIsDataPrefilled] = useState(false)

  // Update local state when data prop changes, but prevent infinite loops
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // Only update if the data is actually different
      const dataString = JSON.stringify(data)
      const medicinesString = JSON.stringify(medicines)

      if (dataString !== medicinesString) {
        setMedicines(data)
        setIsDataPrefilled(true)
        console.log("🔄 AyurvedicPrescription: Data prefilled:", data)
      }
    } else if (data && Array.isArray(data) && data.length === 0 && medicines.length > 0) {
      // Clear medicines if data is explicitly empty
      setMedicines([])
      setIsDataPrefilled(false)
    }
  }, [data]) // Remove medicines from dependencies to prevent infinite loop

  // Update parent when medicines change
  useEffect(() => {
    // Only call onChange if medicines is different from data prop
    const dataString = JSON.stringify(data)
    const medicinesString = JSON.stringify(medicines)

    if (dataString !== medicinesString) {
      onChange(medicines)
    }
  }, [medicines]) // Remove data and onChange from dependencies

  const addMedicine = () => {
    if (!newMedicine.medicine?.trim()) return

    const medicine: AyurvedicMedicine = {
      id: Date.now().toString(),
      medicine: newMedicine.medicine || "",
      dosage: newMedicine.dosage || "",
      frequency: newMedicine.frequency || "",
      duration: newMedicine.duration || "",
      instructions: newMedicine.instructions || "",
      beforeAfterFood: newMedicine.beforeAfterFood || "after",
    }

    const updatedMedicines = [...medicines, medicine]
    setMedicines(updatedMedicines)

    // Reset form
    setNewMedicine({
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
    })
  }

  const removeMedicine = (id: string) => {
    const updatedMedicines = medicines.filter((med) => med.id !== id)
    setMedicines(updatedMedicines)
  }

  const handleSaveAsTemplate = () => {
    if (medicines.length === 0) {
      alert("Please add some medicines before saving as template")
      return
    }
    setIsSaveTemplateModalOpen(true)
  }

  const handleLoadTemplate = (templateMedicines: AyurvedicMedicine[]) => {
    setMedicines(templateMedicines)
    setIsLoadTemplateModalOpen(false)
  }

  const commonAyurvedicMedicines = [
    "Triphala Churna",
    "Ashwagandha Churna",
    "Brahmi Vati",
    "Arjuna Churna",
    "Giloy Satva",
    "Neem Churna",
    "Tulsi Ark",
    "Chyawanprash",
    "Saraswatarishta",
    "Punarnavadi Mandur",
    "Hingvastak Churna",
    "Avipattikar Churna",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Ayurvedic Prescription
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsLoadTemplateModalOpen(true)} className="text-xs">
              <FolderOpen className="h-3 w-3 mr-1" />
              Load Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveAsTemplate}
              disabled={medicines.length === 0}
              className="text-xs bg-transparent"
            >
              <Save className="h-3 w-3 mr-1" />
              Save as Template
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDataPrefilled && medicines.length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              ✅ {medicines.length} ayurvedic medicine(s) loaded from previous consultation
            </p>
          </div>
        )}

        {/* Add New Medicine Form */}
        <div className="space-y-3 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-sm">Add New Ayurvedic Medicine</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Medicine Name *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ayurvedic medicine name"
                  value={newMedicine.medicine || ""}
                  onChange={(e) => setNewMedicine({ ...newMedicine, medicine: e.target.value })}
                  className="text-sm"
                />
                <Select onValueChange={(value) => setNewMedicine({ ...newMedicine, medicine: value })}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Quick" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonAyurvedicMedicines.map((med) => (
                      <SelectItem key={med} value={med} className="text-xs">
                        {med}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Dosage</Label>
              <Select
                value={newMedicine.dosage || ""}
                onValueChange={(value) => setNewMedicine({ ...newMedicine, dosage: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dosage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/4 tsp">1/4 tsp</SelectItem>
                  <SelectItem value="1/2 tsp">1/2 tsp</SelectItem>
                  <SelectItem value="1 tsp">1 tsp</SelectItem>
                  <SelectItem value="1 tbsp">1 tbsp</SelectItem>
                  <SelectItem value="1 tablet">1 tablet</SelectItem>
                  <SelectItem value="2 tablets">2 tablets</SelectItem>
                  <SelectItem value="5ml">5ml</SelectItem>
                  <SelectItem value="10ml">10ml</SelectItem>
                  <SelectItem value="15ml">15ml</SelectItem>
                  <SelectItem value="30ml">30ml</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Frequency</Label>
              <Select
                value={newMedicine.frequency || ""}
                onValueChange={(value) => setNewMedicine({ ...newMedicine, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="Before meals">Before meals</SelectItem>
                  <SelectItem value="After meals">After meals</SelectItem>
                  <SelectItem value="At bedtime">At bedtime</SelectItem>
                  <SelectItem value="Empty stomach">Empty stomach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Duration</Label>
              <Select
                value={newMedicine.duration || ""}
                onValueChange={(value) => setNewMedicine({ ...newMedicine, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7 days">7 days</SelectItem>
                  <SelectItem value="15 days">15 days</SelectItem>
                  <SelectItem value="21 days">21 days</SelectItem>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="45 days">45 days</SelectItem>
                  <SelectItem value="60 days">60 days</SelectItem>
                  <SelectItem value="90 days">90 days</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Before/After Food</Label>
              <Select
                value={newMedicine.beforeAfterFood || "after"}
                onValueChange={(value) => setNewMedicine({ ...newMedicine, beforeAfterFood: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Before food</SelectItem>
                  <SelectItem value="after">After food</SelectItem>
                  <SelectItem value="with">With food</SelectItem>
                  <SelectItem value="empty_stomach">Empty stomach</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Instructions</Label>
              <Input
                placeholder="Special instructions (e.g., with honey, warm water)"
                value={newMedicine.instructions || ""}
                onChange={(e) => setNewMedicine({ ...newMedicine, instructions: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          <Button onClick={addMedicine} size="sm" className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Ayurvedic Medicine
          </Button>
        </div>

        {/* Medicine List */}
        {medicines.length > 0 && (
          <div className="space-y-3">
            <Separator />
            <h4 className="font-medium text-sm">Prescribed Ayurvedic Medicines ({medicines.length})</h4>
            <div className="space-y-2">
              {medicines.map((medicine, index) => (
                <div key={medicine.id} className="p-3 bg-white border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                          {index + 1}
                        </Badge>
                        <h5 className="font-medium text-sm">{medicine.medicine}</h5>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span> {medicine.dosage || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span> {medicine.frequency || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {medicine.duration || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Timing:</span> {medicine.beforeAfterFood || "After food"}
                        </div>
                      </div>
                      {medicine.instructions && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">Instructions:</span> {medicine.instructions}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedicine(medicine.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {medicines.length === 0 && !isDataPrefilled && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-sm font-medium">No ayurvedic medicines prescribed</p>
            <p className="text-xs mt-1">Add medicines using the form above</p>
          </div>
        )}

        {/* Save Template Modal */}
        <SavePrescriptionTemplateModal
          isOpen={isSaveTemplateModalOpen}
          onClose={() => setIsSaveTemplateModalOpen(false)}
          prescriptionData={medicines}
          prescriptionType="ayurvedic"
          department="ayurveda"
        />

        {/* Load Template Modal */}
        <LoadPrescriptionTemplateModal
          isOpen={isLoadTemplateModalOpen}
          onClose={() => setIsLoadTemplateModalOpen(false)}
          prescriptionType="ayurvedic"
          department="ayurveda"
          onLoadTemplate={handleLoadTemplate}
        />
      </CardContent>
    </Card>
  )
}
