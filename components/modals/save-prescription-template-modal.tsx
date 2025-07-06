"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { usePrescriptionTemplates, type PrescriptionMedicine } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"

interface SavePrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allopathicMedicines: any[]
  ayurvedicMedicines: any[]
  department?: string
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

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Convert medicines to template format
      const medicines: PrescriptionMedicine[] = [
        ...allopathicMedicines.map((med) => ({
          id: med.id || Date.now().toString(),
          name: med.medicine,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
          type: "allopathic" as const,
        })),
        ...ayurvedicMedicines.map((med) => ({
          id: med.id || Date.now().toString(),
          name: med.medicine,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
          type: "ayurvedic" as const,
        })),
      ]

      // Determine category
      let category: "allopathic" | "ayurvedic" | "mixed" = "mixed"
      if (allopathicMedicines.length > 0 && ayurvedicMedicines.length === 0) {
        category = "allopathic"
      } else if (ayurvedicMedicines.length > 0 && allopathicMedicines.length === 0) {
        category = "ayurvedic"
      }

      saveTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        medicines,
        category,
        department,
        createdBy: "Current Doctor", // In real app, get from auth context
      })

      toast({
        title: "Success",
        description: "Prescription template saved successfully",
      })

      // Reset form
      setName("")
      setDescription("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalMedicines = allopathicMedicines.length + ayurvedicMedicines.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Prescription Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              This template will include {totalMedicines} medicine{totalMedicines !== 1 ? "s" : ""}:
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              {allopathicMedicines.length > 0 && (
                <li>
                  • {allopathicMedicines.length} Allopathic medicine{allopathicMedicines.length !== 1 ? "s" : ""}
                </li>
              )}
              {ayurvedicMedicines.length > 0 && (
                <li>
                  • {ayurvedicMedicines.length} Ayurvedic medicine{ayurvedicMedicines.length !== 1 ? "s" : ""}
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              placeholder="e.g., Common Cold Treatment"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="flex justify-end gap-2 pt-4">
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
