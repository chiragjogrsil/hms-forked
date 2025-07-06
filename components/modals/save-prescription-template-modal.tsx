"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(false)
  const { saveTemplate } = usePrescriptionTemplates()

  const getCategory = () => {
    const hasAllopathic = allopathicMedicines.length > 0
    const hasAyurvedic = ayurvedicMedicines.length > 0

    if (hasAllopathic && hasAyurvedic) return "mixed"
    if (hasAyurvedic) return "ayurvedic"
    return "allopathic"
  }

  const handleSave = async () => {
    if (!name.trim()) return

    setIsLoading(true)

    try {
      await saveTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        category: getCategory(),
        department,
        allopathicMedicines,
        ayurvedicMedicines,
        createdBy: "Current Doctor", // In real app, get from auth context
      })

      // Reset form
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving template:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setName("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-green-600" />
            Save Prescription Template
          </DialogTitle>
          <DialogDescription>Save this prescription as a template for future use</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Template Preview</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {getCategory()}
              </Badge>
              <Badge variant="outline">{department}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {allopathicMedicines.length > 0 && <span>{allopathicMedicines.length} Allopathic medicines</span>}
              {ayurvedicMedicines.length > 0 && <span>{ayurvedicMedicines.length} Ayurvedic medicines</span>}
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              placeholder="e.g., Common Cold Treatment"
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
