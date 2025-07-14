"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { usePrescriptionTemplate } from "@/contexts/prescription-template-context"
import { toast } from "sonner"

const departments = [
  { value: "general", label: "General Medicine" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "gynecology", label: "Gynecology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "ent", label: "ENT" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "ayurveda", label: "Ayurveda" },
  { value: "dental", label: "Dental" },
  { value: "emergency", label: "Emergency" },
]

interface SaveAyurvedicTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTemplate?: any
  onTemplateChange?: () => void
}

export function SaveAyurvedicTemplateModal({
  open,
  onOpenChange,
  editingTemplate,
  onTemplateChange,
}: SaveAyurvedicTemplateModalProps) {
  const { saveAyurvedicTemplate, updateAyurvedicTemplate } = usePrescriptionTemplate()

  const [formData, setFormData] = useState({
    name: "",
    department: "general",
    description: "",
    createdBy: "Dr. Current User",
  })

  const [medicines, setMedicines] = useState([
    {
      id: "1",
      formOfMedicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  // Load editing template data
  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        name: editingTemplate.name || "",
        department: editingTemplate.department || "general",
        description: editingTemplate.description || "",
        createdBy: editingTemplate.createdBy || "Dr. Current User",
      })
      setMedicines(
        editingTemplate.medicines || [
          {
            id: "1",
            formOfMedicine: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
            beforeAfterFood: "after",
          },
        ],
      )
    } else {
      // Reset form for new template
      setFormData({
        name: "",
        department: "general",
        description: "",
        createdBy: "Dr. Current User",
      })
      setMedicines([
        {
          id: "1",
          formOfMedicine: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
          beforeAfterFood: "after",
        },
      ])
    }
  }, [editingTemplate, open])

  const addMedicine = () => {
    const newMedicine = {
      id: Date.now().toString(),
      formOfMedicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      beforeAfterFood: "after",
    }
    setMedicines([...medicines, newMedicine])
  }

  const removeMedicine = (id: string) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((med) => med.id !== id))
    }
  }

  const updateMedicine = (id: string, field: string, value: string) => {
    setMedicines(medicines.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Template name is required")
      return
    }

    const validMedicines = medicines.filter((med) => med.formOfMedicine.trim())
    if (validMedicines.length === 0) {
      toast.error("At least one medicine is required")
      return
    }

    setIsLoading(true)

    try {
      const templateData = {
        ...formData,
        medicines: validMedicines,
      }

      let success = false
      if (editingTemplate) {
        success = await updateAyurvedicTemplate(editingTemplate.id, templateData)
      } else {
        success = await saveAyurvedicTemplate(templateData)
      }

      if (success) {
        onOpenChange(false)
        onTemplateChange?.()
      }
    } catch (error) {
      toast.error("Failed to save template")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTemplate ? "Edit Ayurvedic Template" : "Save Ayurvedic Template"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter template description (optional)"
              rows={3}
            />
          </div>

          {/* Medicines */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-medium">Medicines</Label>
              <Button onClick={addMedicine} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>

            <div className="space-y-4">
              {medicines.map((medicine, index) => (
                <Card key={medicine.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Medicine {index + 1}</CardTitle>
                      {medicines.length > 1 && (
                        <Button
                          onClick={() => removeMedicine(medicine.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Form of Medicine *</Label>
                        <Input
                          value={medicine.formOfMedicine}
                          onChange={(e) => updateMedicine(medicine.id, "formOfMedicine", e.target.value)}
                          placeholder="e.g., Triphala Churna"
                        />
                      </div>
                      <div>
                        <Label>Dosage *</Label>
                        <Input
                          value={medicine.dosage}
                          onChange={(e) => updateMedicine(medicine.id, "dosage", e.target.value)}
                          placeholder="e.g., 1 tsp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Frequency *</Label>
                        <Input
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(medicine.id, "frequency", e.target.value)}
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <Label>Duration *</Label>
                        <Input
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(medicine.id, "duration", e.target.value)}
                          placeholder="e.g., 7 days"
                        />
                      </div>
                      <div>
                        <Label>Before/After Food</Label>
                        <Select
                          value={medicine.beforeAfterFood}
                          onValueChange={(value) => updateMedicine(medicine.id, "beforeAfterFood", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="before">Before Food</SelectItem>
                            <SelectItem value="after">After Food</SelectItem>
                            <SelectItem value="with">With Food</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Instructions</Label>
                      <Textarea
                        value={medicine.instructions}
                        onChange={(e) => updateMedicine(medicine.id, "instructions", e.target.value)}
                        placeholder="Special instructions for this medicine"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : editingTemplate ? "Update Template" : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
