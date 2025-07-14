"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface SaveAllopathicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  templateData: {
    prescriptions: any[]
    department: string
    dietaryConstraints?: string[]
  }
}

export function SaveAllopathicTemplateModal({ isOpen, onClose, templateData }: SaveAllopathicTemplateModalProps) {
  const { saveAllopathicTemplate } = usePrescriptionTemplates()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!formData.name.trim()) return

    setIsLoading(true)
    try {
      await saveAllopathicTemplate({
        name: formData.name,
        description: formData.description,
        department: templateData.department,
        prescriptions: templateData.prescriptions,
        dietaryConstraints: templateData.dietaryConstraints || [],
      })

      setFormData({ name: "", description: "" })
      onClose()
    } catch (error) {
      console.error("Error saving template:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save Allopathic Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter template description"
              rows={3}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This template will include:</p>
            <ul className="list-disc list-inside mt-1">
              <li>{templateData.prescriptions.length} prescription(s)</li>
              <li>Department: {templateData.department}</li>
              {templateData.dietaryConstraints && templateData.dietaryConstraints.length > 0 && (
                <li>{templateData.dietaryConstraints.length} dietary constraint(s)</li>
              )}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim() || isLoading}>
              {isLoading ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
