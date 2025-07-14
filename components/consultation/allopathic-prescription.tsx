"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Pill, Save, Upload, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SaveAllopathicTemplateModal } from "@/components/modals/save-allopathic-template-modal"
import { LoadAllopathicTemplateModal } from "@/components/modals/load-allopathic-template-modal"
import type {
  AllopathicPrescription as AllopathicPrescriptionType,
  AllopathicTemplate,
} from "@/contexts/prescription-template-context"

interface AllopathicPrescriptionProps {
  prescriptions: AllopathicPrescriptionType[]
  setPrescriptions: (prescriptions: AllopathicPrescriptionType[]) => void
  dietaryConstraints: string[]
  setDietaryConstraints: (constraints: string[]) => void
  generalInstructions: string
  setGeneralInstructions: (instructions: string) => void
}

export function AllopathicPrescriptionComponent({
  prescriptions,
  setPrescriptions,
  dietaryConstraints,
  setDietaryConstraints,
  generalInstructions,
  setGeneralInstructions,
}: AllopathicPrescriptionProps) {
  const [newDietaryConstraint, setNewDietaryConstraint] = useState("")
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [showLoadTemplate, setShowLoadTemplate] = useState(false)
  const { toast } = useToast()

  const addPrescription = () => {
    const newPrescription: AllopathicPrescriptionType = {
      id: Date.now().toString(),
      medicine: "",
      strength: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    }
    setPrescriptions([...prescriptions, newPrescription])
  }

  const updatePrescription = (id: string, field: keyof AllopathicPrescriptionType, value: string) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, [field]: value } : prescription,
      ),
    )
  }

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((prescription) => prescription.id !== id))
  }

  const addDietaryConstraint = () => {
    if (newDietaryConstraint.trim()) {
      setDietaryConstraints([...dietaryConstraints, newDietaryConstraint.trim()])
      setNewDietaryConstraint("")
    }
  }

  const removeDietaryConstraint = (index: number) => {
    setDietaryConstraints(dietaryConstraints.filter((_, i) => i !== index))
  }

  const handleLoadTemplate = (template: AllopathicTemplate) => {
    setPrescriptions(template.prescriptions)
    setDietaryConstraints(template.dietaryConstraints)
    setGeneralInstructions(template.generalInstructions)

    toast({
      title: "Template Loaded",
      description: `Loaded template: ${template.name}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Template Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Allopathic Prescription</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLoadTemplate(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Load Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSaveTemplate(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
        </div>
      </div>

      {/* Medicines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Medicines</CardTitle>
              <CardDescription>Add allopathic medicines and their dosages</CardDescription>
            </div>
            <Button size="sm" onClick={addPrescription}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptions.map((prescription, index) => (
            <div key={prescription.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Medicine {index + 1}</Badge>
                <Button variant="ghost" size="sm" onClick={() => removePrescription(prescription.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`medicine-${prescription.id}`}>Medicine Name</Label>
                  <Input
                    id={`medicine-${prescription.id}`}
                    value={prescription.medicine}
                    onChange={(e) => updatePrescription(prescription.id, "medicine", e.target.value)}
                    placeholder="e.g., Paracetamol"
                  />
                </div>
                <div>
                  <Label htmlFor={`strength-${prescription.id}`}>Strength</Label>
                  <Input
                    id={`strength-${prescription.id}`}
                    value={prescription.strength}
                    onChange={(e) => updatePrescription(prescription.id, "strength", e.target.value)}
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <Label htmlFor={`dosage-${prescription.id}`}>Dosage</Label>
                  <Input
                    id={`dosage-${prescription.id}`}
                    value={prescription.dosage}
                    onChange={(e) => updatePrescription(prescription.id, "dosage", e.target.value)}
                    placeholder="e.g., 1 tablet"
                  />
                </div>
                <div>
                  <Label htmlFor={`frequency-${prescription.id}`}>Frequency</Label>
                  <Input
                    id={`frequency-${prescription.id}`}
                    value={prescription.frequency}
                    onChange={(e) => updatePrescription(prescription.id, "frequency", e.target.value)}
                    placeholder="e.g., Twice daily"
                  />
                </div>
                <div>
                  <Label htmlFor={`duration-${prescription.id}`}>Duration</Label>
                  <Input
                    id={`duration-${prescription.id}`}
                    value={prescription.duration}
                    onChange={(e) => updatePrescription(prescription.id, "duration", e.target.value)}
                    placeholder="e.g., 7 days"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`instructions-${prescription.id}`}>Instructions</Label>
                <Textarea
                  id={`instructions-${prescription.id}`}
                  value={prescription.instructions}
                  onChange={(e) => updatePrescription(prescription.id, "instructions", e.target.value)}
                  placeholder="e.g., Take after meals"
                  rows={2}
                />
              </div>
            </div>
          ))}

          {prescriptions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No medicines added yet. Click "Add Medicine" to start.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dietary Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Utensils className="h-4 w-4 text-blue-600" />
            Dietary Guidelines
          </CardTitle>
          <CardDescription>Dietary recommendations and restrictions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDietaryConstraint}
              onChange={(e) => setNewDietaryConstraint(e.target.value)}
              placeholder="Add a dietary guideline..."
              onKeyPress={(e) => e.key === "Enter" && addDietaryConstraint()}
            />
            <Button onClick={addDietaryConstraint} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {dietaryConstraints.map((constraint, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{constraint}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeDietaryConstraint(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {dietaryConstraints.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">No dietary guidelines added yet</div>
          )}
        </CardContent>
      </Card>

      {/* General Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General Instructions</CardTitle>
          <CardDescription>Additional instructions for the patient</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={generalInstructions}
            onChange={(e) => setGeneralInstructions(e.target.value)}
            placeholder="Enter general instructions for the patient..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Template Modals */}
      <SaveAllopathicTemplateModal
        isOpen={showSaveTemplate}
        onClose={() => setShowSaveTemplate(false)}
        prescriptions={prescriptions}
        dietaryConstraints={dietaryConstraints}
        generalInstructions={generalInstructions}
      />

      <LoadAllopathicTemplateModal
        isOpen={showLoadTemplate}
        onClose={() => setShowLoadTemplate(false)}
        onLoad={handleLoadTemplate}
      />
    </div>
  )
}
