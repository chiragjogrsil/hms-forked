"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pill, Leaf, Save } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface SavePrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allopathicMedicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  ayurvedicMedicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  department: string
}

export function SavePrescriptionTemplateModal({
  open,
  onOpenChange,
  allopathicMedicines,
  ayurvedicMedicines,
  department,
}: SavePrescriptionTemplateModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { saveTemplate } = usePrescriptionTemplates()

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSaving(true)

    try {
      const category =
        allopathicMedicines.length > 0 && ayurvedicMedicines.length > 0
          ? "mixed"
          : allopathicMedicines.length > 0
            ? "allopathic"
            : "ayurvedic"

      await saveTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        department,
        createdBy: "Current Doctor", // In real app, get from auth context
        category,
        allopathicMedicines,
        ayurvedicMedicines,
      })

      // Reset form and close modal
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving template:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const totalMedicines = allopathicMedicines.length + ayurvedicMedicines.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-blue-600" />
            Save Prescription Template
          </DialogTitle>
          <DialogDescription>
            Save this prescription as a template for future use. You can load it later to quickly prescribe the same
            medicines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Template Preview</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {department}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {totalMedicines} Total Medicines
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {allopathicMedicines.length > 0 && (
                <div className="flex items-center gap-1">
                  <Pill className="w-4 h-4 text-green-600" />
                  <span>{allopathicMedicines.length} Allopathic</span>
                </div>
              )}
              {ayurvedicMedicines.length > 0 && (
                <div className="flex items-center gap-1">
                  <Leaf className="w-4 h-4 text-amber-600" />
                  <span>{ayurvedicMedicines.length} Ayurvedic</span>
                </div>
              )}
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              placeholder="e.g., Common Cold Treatment, Post-Surgery Care"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Template Description */}
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (Optional)</Label>
            <Textarea
              id="template-description"
              placeholder="Brief description of when to use this template..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
