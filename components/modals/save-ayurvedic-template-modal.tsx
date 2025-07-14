"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Leaf } from "lucide-react"
import { toast } from "sonner"

interface SaveAyurvedicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateData: any) => void
  prescriptions: any[]
  pathya: string[]
  apathya: string[]
  department: string
}

export function SaveAyurvedicTemplateModal({
  isOpen,
  onClose,
  onSave,
  prescriptions,
  pathya,
  apathya,
  department,
}: SaveAyurvedicTemplateModalProps) {
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
    toast.success("Ayurvedic template saved successfully!")
    setTemplateName("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Save Ayurvedic Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Summary */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-2 text-green-800">Template Summary</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>
                Department: <span className="font-medium capitalize">{department}</span>
              </p>
              <p>
                Ayurvedic Medicines: <span className="font-medium">{prescriptions.length}</span>
              </p>
              <p>
                Pathya Items: <span className="font-medium">{pathya.length}</span>
              </p>
              <p>
                Apathya Items: <span className="font-medium">{apathya.length}</span>
              </p>
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              placeholder="e.g., Common Cold Treatment, Digestive Issues Protocol"
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
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
