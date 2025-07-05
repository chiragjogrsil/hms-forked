"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePrescriptionTemplate } from "@/contexts/prescription-template-context"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"

interface SavePrescriptionTemplateModalProps {
  trigger?: React.ReactNode
}

export function SavePrescriptionTemplateModal({ trigger }: SavePrescriptionTemplateModalProps) {
  const { saveTemplate } = usePrescriptionTemplate()
  const { currentConsultation } = useConsultation()

  const [open, setOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateDepartment, setTemplateDepartment] = useState("")

  const departments = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Ophthalmology",
    "Ayurveda",
  ]

  const handleSave = () => {
    if (!currentConsultation || !templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    const hasAllopathic = currentConsultation.allopathicPrescriptions.length > 0
    const hasAyurvedic = currentConsultation.ayurvedicPrescriptions.length > 0

    if (!hasAllopathic && !hasAyurvedic) {
      toast.error("No prescriptions to save as template")
      return
    }

    const templateType = hasAllopathic && hasAyurvedic ? "mixed" : hasAllopathic ? "allopathic" : "ayurvedic"

    try {
      saveTemplate({
        name: templateName,
        description: templateDescription,
        department: templateDepartment || currentConsultation.department,
        type: templateType,
        allopathicMedicines: currentConsultation.allopathicPrescriptions.map((p) => ({
          medicine: p.medicine,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          instructions: p.instructions,
          beforeFood: p.beforeFood,
          afterFood: p.afterFood,
        })),
        ayurvedicMedicines: currentConsultation.ayurvedicPrescriptions.map((p) => ({
          medicine: p.medicine,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          instructions: p.instructions,
          beforeFood: p.beforeFood,
          afterFood: p.afterFood,
        })),
        createdBy: "Current Doctor", // This would come from auth context
      })

      toast.success("Template saved successfully")

      // Reset form
      setTemplateName("")
      setTemplateDescription("")
      setTemplateDepartment("")
      setOpen(false)
    } catch (error) {
      toast.error("Failed to save template")
    }
  }

  const canSave =
    currentConsultation &&
    (currentConsultation.allopathicPrescriptions.length > 0 || currentConsultation.ayurvedicPrescriptions.length > 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" disabled={!canSave} className="flex items-center gap-2 bg-transparent">
            <Save className="h-4 w-4" />
            Save as Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save Prescription Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              placeholder="Brief description of this template"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-department">Department</Label>
            <Select value={templateDepartment} onValueChange={setTemplateDepartment}>
              <SelectTrigger>
                <SelectValue placeholder={currentConsultation?.department || "Select department"} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentConsultation && (
            <div className="text-sm text-muted-foreground space-y-1">
              <div>This template will include:</div>
              <ul className="list-disc list-inside space-y-1">
                {currentConsultation.allopathicPrescriptions.length > 0 && (
                  <li>{currentConsultation.allopathicPrescriptions.length} Allopathic medicine(s)</li>
                )}
                {currentConsultation.ayurvedicPrescriptions.length > 0 && (
                  <li>{currentConsultation.ayurvedicPrescriptions.length} Ayurvedic medicine(s)</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!templateName.trim() || !canSave}>
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
