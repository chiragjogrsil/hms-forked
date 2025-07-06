"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Save, Pill, Leaf } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const getCategory = () => {
    if (allopathicMedicines.length > 0 && ayurvedicMedicines.length > 0) return "mixed"
    if (allopathicMedicines.length > 0) return "allopathic"
    return "ayurvedic"
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      saveTemplate({
        name: name.trim(),
        description: description.trim(),
        allopathicMedicines,
        ayurvedicMedicines,
        category: getCategory(),
        department,
        createdBy: "Current Doctor", // This would come from auth context
      })

      toast({
        title: "Template saved successfully",
        description: `"${name}" has been saved to your templates.`,
      })

      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Common Cold Treatment"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of when to use this template..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Template Preview</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {getCategory()} Template
                  </Badge>
                  <Badge variant="secondary">{department}</Badge>
                </div>

                {allopathicMedicines.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      {allopathicMedicines.length} Allopathic medicine{allopathicMedicines.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {ayurvedicMedicines.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-gray-600">
                      {ayurvedicMedicines.length} Ayurvedic medicine{ayurvedicMedicines.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
              {isLoading ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
