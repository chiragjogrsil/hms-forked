"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Leaf, Save, Upload, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SaveAyurvedicTemplateModal } from "@/components/modals/save-ayurvedic-template-modal"
import { LoadAyurvedicTemplateModal } from "@/components/modals/load-ayurvedic-template-modal"
import type {
  AyurvedicPrescription as AyurvedicPrescriptionType,
  AyurvedicTemplate,
} from "@/contexts/prescription-template-context"

interface AyurvedicPrescriptionProps {
  prescriptions: AyurvedicPrescriptionType[]
  setPrescriptions: (prescriptions: AyurvedicPrescriptionType[]) => void
  pathya: string[]
  setPathya: (pathya: string[]) => void
  apathya: string[]
  setApathya: (apathya: string[]) => void
  generalInstructions: string
  setGeneralInstructions: (instructions: string) => void
}

export function AyurvedicPrescriptionComponent({
  prescriptions,
  setPrescriptions,
  pathya,
  setPathya,
  apathya,
  setApathya,
  generalInstructions,
  setGeneralInstructions,
}: AyurvedicPrescriptionProps) {
  const [newPathyaItem, setNewPathyaItem] = useState("")
  const [newApathyaItem, setNewApathyaItem] = useState("")
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [showLoadTemplate, setShowLoadTemplate] = useState(false)
  const { toast } = useToast()

  const addPrescription = () => {
    const newPrescription: AyurvedicPrescriptionType = {
      id: Date.now().toString(),
      medicine: "",
      dosage: "",
      duration: "",
      instructions: "",
      timing: "",
    }
    setPrescriptions([...prescriptions, newPrescription])
  }

  const updatePrescription = (id: string, field: keyof AyurvedicPrescriptionType, value: string) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, [field]: value } : prescription,
      ),
    )
  }

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((prescription) => prescription.id !== id))
  }

  const addPathyaItem = () => {
    if (newPathyaItem.trim()) {
      setPathya([...pathya, newPathyaItem.trim()])
      setNewPathyaItem("")
    }
  }

  const removePathyaItem = (index: number) => {
    setPathya(pathya.filter((_, i) => i !== index))
  }

  const addApathyaItem = () => {
    if (newApathyaItem.trim()) {
      setApathya([...apathya, newApathyaItem.trim()])
      setNewApathyaItem("")
    }
  }

  const removeApathyaItem = (index: number) => {
    setApathya(apathya.filter((_, i) => i !== index))
  }

  const handleLoadTemplate = (template: AyurvedicTemplate) => {
    setPrescriptions(template.prescriptions)
    setPathya(template.pathya)
    setApathya(template.apathya)
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
          <Leaf className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Ayurvedic Prescription</h3>
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
              <CardDescription>Add Ayurvedic medicines and their dosages</CardDescription>
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
                    placeholder="e.g., Triphala Churna"
                  />
                </div>
                <div>
                  <Label htmlFor={`dosage-${prescription.id}`}>Dosage</Label>
                  <Input
                    id={`dosage-${prescription.id}`}
                    value={prescription.dosage}
                    onChange={(e) => updatePrescription(prescription.id, "dosage", e.target.value)}
                    placeholder="e.g., 1 teaspoon"
                  />
                </div>
                <div>
                  <Label htmlFor={`timing-${prescription.id}`}>Timing</Label>
                  <Input
                    id={`timing-${prescription.id}`}
                    value={prescription.timing}
                    onChange={(e) => updatePrescription(prescription.id, "timing", e.target.value)}
                    placeholder="e.g., Before meals"
                  />
                </div>
                <div>
                  <Label htmlFor={`duration-${prescription.id}`}>Duration</Label>
                  <Input
                    id={`duration-${prescription.id}`}
                    value={prescription.duration}
                    onChange={(e) => updatePrescription(prescription.id, "duration", e.target.value)}
                    placeholder="e.g., 15 days"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`instructions-${prescription.id}`}>Special Instructions</Label>
                <Textarea
                  id={`instructions-${prescription.id}`}
                  value={prescription.instructions}
                  onChange={(e) => updatePrescription(prescription.id, "instructions", e.target.value)}
                  placeholder="Any special instructions for this medicine"
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

      {/* Pathya (Do's) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Pathya (Do's)
          </CardTitle>
          <CardDescription>Foods and activities that are beneficial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPathyaItem}
              onChange={(e) => setNewPathyaItem(e.target.value)}
              placeholder="Add a pathya item..."
              onKeyPress={(e) => e.key === "Enter" && addPathyaItem()}
            />
            <Button onClick={addPathyaItem} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {pathya.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{item}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removePathyaItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {pathya.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">No pathya items added yet</div>
          )}
        </CardContent>
      </Card>

      {/* Apathya (Don'ts) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <XCircle className="h-4 w-4 text-red-600" />
            Apathya (Don'ts)
          </CardTitle>
          <CardDescription>Foods and activities to avoid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newApathyaItem}
              onChange={(e) => setNewApathyaItem(e.target.value)}
              placeholder="Add an apathya item..."
              onKeyPress={(e) => e.key === "Enter" && addApathyaItem()}
            />
            <Button onClick={addApathyaItem} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {apathya.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">{item}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeApathyaItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {apathya.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">No apathya items added yet</div>
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
      <SaveAyurvedicTemplateModal
        isOpen={showSaveTemplate}
        onClose={() => setShowSaveTemplate(false)}
        prescriptions={prescriptions}
        pathya={pathya}
        apathya={apathya}
        generalInstructions={generalInstructions}
      />

      <LoadAyurvedicTemplateModal
        isOpen={showLoadTemplate}
        onClose={() => setShowLoadTemplate(false)}
        onLoad={handleLoadTemplate}
      />
    </div>
  )
}
