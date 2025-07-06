"use client"

import { useState } from "react"
import { Save, Pill, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"

interface SavePrescriptionTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  ayurvedicPrescriptions: any[]
  allopathicPrescriptions: any[]
  department: string
}

export function SavePrescriptionTemplateModal({
  isOpen,
  onClose,
  ayurvedicPrescriptions,
  allopathicPrescriptions,
  department,
}: SavePrescriptionTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { saveTemplate } = usePrescriptionTemplates()
  const { toast } = useToast()

  const totalMedicines = ayurvedicPrescriptions.length + allopathicPrescriptions.length

  const getCategory = () => {
    if (ayurvedicPrescriptions.length > 0 && allopathicPrescriptions.length > 0) {
      return "mixed"
    } else if (ayurvedicPrescriptions.length > 0) {
      return "ayurvedic"
    } else {
      return "allopathic"
    }
  }

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      saveTemplate({
        name: templateName.trim(),
        description: description.trim(),
        department,
        category: getCategory(),
        allopathicPrescriptions,
        ayurvedicPrescriptions,
        createdBy: "Current Doctor", // In real app, get from auth context
      })

      toast({
        title: "Template saved successfully",
        description: `"${templateName}" has been saved to your templates`,
      })

      // Reset form
      setTemplateName("")
      setDescription("")
      onClose()
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-green-600" />
            Save Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Preview */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Template Preview</span>
                <Badge variant="outline" className="capitalize">
                  {getCategory()}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {allopathicPrescriptions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Pill className="h-3 w-3 text-blue-600" />
                    <span>{allopathicPrescriptions.length} Allopathic</span>
                  </div>
                )}
                {ayurvedicPrescriptions.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Leaf className="h-3 w-3 text-green-600" />
                    <span>{ayurvedicPrescriptions.length} Ayurvedic</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template Name */}
          <div>
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Common Cold Treatment"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of when to use this template..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
