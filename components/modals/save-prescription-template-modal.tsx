"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useDoctorContext } from "@/contexts/doctor-context"
import type { Prescription } from "@/contexts/consultation-context"

interface SavePrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescriptions: Prescription[]
  defaultDepartment?: string
}

export function SavePrescriptionTemplateModal({
  open,
  onOpenChange,
  prescriptions,
  defaultDepartment,
}: SavePrescriptionTemplateModalProps) {
  const { saveTemplate, isLoading } = usePrescriptionTemplates()
  const { selectedDoctor } = useDoctorContext()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: defaultDepartment || "General Medicine",
    tags: "",
  })

  const departments = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "ENT",
    "Ophthalmology",
    "Ayurveda",
    "Endocrinology",
    "Pain Management",
  ]

  // Determine template type based on prescriptions
  const getTemplateType = (): "allopathic" | "ayurvedic" | "mixed" => {
    const hasAllopathic = prescriptions.some((p) => p.type === "allopathic")
    const hasAyurvedic = prescriptions.some((p) => p.type === "ayurvedic")

    if (hasAllopathic && hasAyurvedic) return "mixed"
    if (hasAyurvedic) return "ayurvedic"
    return "allopathic"
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await saveTemplate({
        name: formData.name,
        description: formData.description || undefined,
        department: formData.department,
        type: getTemplateType(),
        prescriptions: prescriptions,
        createdBy: selectedDoctor?.name || "Unknown Doctor",
        tags: tags.length > 0 ? tags : undefined,
      })

      // Reset form and close modal
      setFormData({
        name: "",
        description: "",
        department: defaultDepartment || "General Medicine",
        tags: "",
      })
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the context
    }
  }

  const templateType = getTemplateType()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Save Prescription Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                placeholder="e.g., Common Cold Treatment"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              placeholder="Brief description of when to use this template..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-tags">Tags (comma-separated)</Label>
            <Input
              id="template-tags"
              placeholder="e.g., fever, viral, common"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          {/* Template Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Template Preview</Label>
              <Badge
                variant={templateType === "mixed" ? "default" : templateType === "ayurvedic" ? "secondary" : "outline"}
              >
                {templateType.charAt(0).toUpperCase() + templateType.slice(1)}
              </Badge>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {prescriptions.map((prescription, index) => (
                    <div key={prescription.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={prescription.type === "allopathic" ? "default" : "secondary"}>
                            {prescription.type}
                          </Badge>
                          <span className="font-medium">{prescription.medication}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                        </div>
                        {prescription.instructions && (
                          <div className="text-sm text-muted-foreground mt-1">{prescription.instructions}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim() || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
