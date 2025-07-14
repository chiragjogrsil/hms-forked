"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Pill } from "lucide-react"
import { toast } from "sonner"

interface SaveAllopathicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateData: any) => void
  prescriptions: any[]
  dietaryConstraints: string[]
  department: string
}

export function SaveAllopathicTemplateModal({
  isOpen,
  onClose,
  onSave,
  prescriptions,
  dietaryConstraints,
  department,
}: SaveAllopathicTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")
  const [description, setDescription] = useState("")

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    const templateData = {
      name: templateName.trim(),
      description: description.trim(),
    }

    onSave(templateData)
    toast.success("Allopathic template saved successfully!")
    setTemplateName("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Save Allopathic Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Summary */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2 text-blue-800">Template Summary</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                Department: <span className="font-medium capitalize">{department}</span>
              </p>
              <p>
                Allopathic Medicines: <span className="font-medium">{prescriptions.length}</span>
              </p>
              <p>
                Dietary Constraints: <span className="font-medium">{dietaryConstraints.length}</span>
              </p>
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              placeholder="e.g., Hypertension Management, Diabetes Protocol"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of when to use this template..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
