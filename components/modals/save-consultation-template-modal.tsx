"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Stethoscope, Pill, Leaf } from "lucide-react"
import { toast } from "sonner"

interface SaveConsultationTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  consultationData: any
  department: string
}

export function SaveConsultationTemplateModal({
  isOpen,
  onClose,
  consultationData,
  department,
}: SaveConsultationTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")
  const [description, setDescription] = useState("")
  const [templateType, setTemplateType] = useState<"routine" | "followup">("routine")
  const [isPublic, setIsPublic] = useState(false)

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (!consultationData) {
      toast.error("No consultation data to save")
      return
    }

    // Create template data
    const templateData = {
      name: templateName.trim(),
      description: description.trim(),
      department,
      type: templateType,
      isPublic,
      chiefComplaint: consultationData.chiefComplaint,
      clinicalNotes: consultationData.clinicalNotes,
      provisionalDiagnosis: consultationData.provisionalDiagnosis || [],
      prescriptions: consultationData.prescriptions || { ayurvedic: [], allopathic: [] },
      vitals: consultationData.vitals || {},
      ayurvedicAnalysis: consultationData.ayurvedicAnalysis,
      ophthalmologyAnalysis: consultationData.ophthalmologyAnalysis,
      createdBy: "Current Doctor", // This would come from auth context
      createdAt: new Date().toISOString(),
    }

    // Here you would save to your backend/storage
    console.log("Saving consultation template:", templateData)

    toast.success("Consultation template saved successfully!", {
      description: `Template "${templateName}" is now available for future use`,
    })

    setTemplateName("")
    setDescription("")
    setTemplateType("routine")
    setIsPublic(false)
    onClose()
  }

  const getConsultationSummary = () => {
    if (!consultationData) return null

    const allopathicCount = consultationData.prescriptions?.allopathic?.length || 0
    const ayurvedicCount = consultationData.prescriptions?.ayurvedic?.length || 0
    const diagnosisCount = consultationData.provisionalDiagnosis?.length || 0
    const hasVitals = Object.keys(consultationData.vitals || {}).length > 0

    return {
      allopathicCount,
      ayurvedicCount,
      diagnosisCount,
      hasVitals,
      hasNotes: !!consultationData.clinicalNotes?.trim(),
      hasChiefComplaint: !!consultationData.chiefComplaint?.trim(),
    }
  }

  const summary = getConsultationSummary()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Consultation Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Consultation Summary */}
          {summary && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Consultation Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <Badge variant="outline">{department}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Chief Complaint:</span>
                      <span className={summary.hasChiefComplaint ? "text-green-600" : "text-gray-400"}>
                        {summary.hasChiefComplaint ? "✓ Included" : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clinical Notes:</span>
                      <span className={summary.hasNotes ? "text-green-600" : "text-gray-400"}>
                        {summary.hasNotes ? "✓ Included" : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vital Signs:</span>
                      <span className={summary.hasVitals ? "text-green-600" : "text-gray-400"}>
                        {summary.hasVitals ? "✓ Included" : "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Diagnoses:</span>
                      <span className={summary.diagnosisCount > 0 ? "text-green-600" : "text-gray-400"}>
                        {summary.diagnosisCount > 0 ? `${summary.diagnosisCount} items` : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Allopathic:</span>
                      <div className="flex items-center gap-1">
                        <Pill className="h-3 w-3 text-blue-600" />
                        <span className={summary.allopathicCount > 0 ? "text-green-600" : "text-gray-400"}>
                          {summary.allopathicCount} medicines
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ayurvedic:</span>
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-green-600" />
                        <span className={summary.ayurvedicCount > 0 ? "text-green-600" : "text-gray-400"}>
                          {summary.ayurvedicCount} medicines
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name *</Label>
                <Input
                  id="templateName"
                  placeholder="e.g., Hypertension Follow-up"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateType">Template Type</Label>
                <Select value={templateType} onValueChange={(value: any) => setTemplateType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine Consultation</SelectItem>
                    <SelectItem value="followup">Follow-up Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPublic" className="text-sm">
                Make this template available to other doctors in the {department} department
              </Label>
            </div>
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
