"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Package } from "lucide-react"
import { toast } from "sonner"

interface Medicine {
  id: string
  medicine: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  beforeAfterFood: string
}

interface SavePrescriptionTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  prescriptionData: Medicine[]
  prescriptionType: "ayurvedic" | "allopathic"
  department: string
}

export function SavePrescriptionTemplateModal({
  isOpen,
  onClose,
  prescriptionData = [],
  prescriptionType,
  department,
}: SavePrescriptionTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")
  const [description, setDescription] = useState("")

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (!prescriptionData || prescriptionData.length === 0) {
      toast.error("No prescription data to save")
      return
    }

    // Here you would typically save to a backend or local storage
    // For now, we'll just show a success message
    const templateData = {
      id: `template_${Date.now()}`,
      name: templateName.trim(),
      description: description.trim(),
      department,
      type: prescriptionType,
      prescriptionData,
      createdAt: new Date(),
      createdBy: "Current Doctor", // This would come from auth context
    }

    // Save to localStorage for demo purposes
    const existingTemplates = JSON.parse(localStorage.getItem("prescriptionTemplates") || "[]")
    existingTemplates.push(templateData)
    localStorage.setItem("prescriptionTemplates", JSON.stringify(existingTemplates))

    toast.success("Template saved successfully!")
    setTemplateName("")
    setDescription("")
    onClose()
  }

  const totalPrescriptions = prescriptionData?.length || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Save {prescriptionType === "ayurvedic" ? "Ayurvedic" : "Allopathic"} Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Template Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Department: <span className="font-medium">{department}</span>
              </p>
              <p>
                Type: <span className="font-medium capitalize">{prescriptionType}</span>
              </p>
              <p>
                Total Medicines: <span className="font-medium">{totalPrescriptions}</span>
              </p>
            </div>
          </div>

          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              placeholder={`e.g., ${prescriptionType === "ayurvedic" ? "Digestive Health Protocol" : "Diabetes Management Protocol"}`}
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
            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
