"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrescriptionTemplates, type AyurvedicPrescription } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"

interface SaveAyurvedicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  prescriptions: AyurvedicPrescription[]
  pathya: string[]
  apathya: string[]
  generalInstructions: string
}

export function SaveAyurvedicTemplateModal({
  isOpen,
  onClose,
  prescriptions,
  pathya,
  apathya,
  generalInstructions,
}: SaveAyurvedicTemplateModalProps) {
  const [templateName, setTemplateName] = useState("")
  const [department, setDepartment] = useState("")
  const { saveAyurvedicTemplate } = usePrescriptionTemplates()
  const { toast } = useToast()

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      })
      return
    }

    saveAyurvedicTemplate({
      name: templateName,
      department: department || "General",
      prescriptions,
      pathya,
      apathya,
      generalInstructions,
      createdBy: "Dr. Current User", // This should come from auth context
    })

    toast({
      title: "Template Saved",
      description: `Ayurvedic template "${templateName}" has been saved successfully`,
    })

    setTemplateName("")
    setDepartment("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Ayurvedic Prescription Template</DialogTitle>
          <DialogDescription>Save this prescription as a template for future use</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-name" className="text-right">
              Name *
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Common Cold Treatment"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Ayurveda"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>This template will include:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}
            </li>
            <li>
              {pathya.length} pathya item{pathya.length !== 1 ? "s" : ""}
            </li>
            <li>
              {apathya.length} apathya item{apathya.length !== 1 ? "s" : ""}
            </li>
            {generalInstructions && <li>General instructions</li>}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
