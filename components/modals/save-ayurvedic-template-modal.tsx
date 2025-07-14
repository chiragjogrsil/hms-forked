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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"

interface SaveAyurvedicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateData: { name: string; generalInstructions: string }) => void
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
  const [generalInstructions, setGeneralInstructions] = useState("")

  const handleSave = () => {
    if (!templateName.trim()) return

    onSave({
      name: templateName,
      generalInstructions,
    })

    // Reset form
    setTemplateName("")
    setGeneralInstructions("")
    onClose()
  }

  const handleClose = () => {
    setTemplateName("")
    setGeneralInstructions("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Save Ayurvedic Prescription Template
          </DialogTitle>
          <DialogDescription>
            Save this prescription as a template for future use in the {department} department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="general-instructions">General Instructions</Label>
            <Textarea
              id="general-instructions"
              value={generalInstructions}
              onChange={(e) => setGeneralInstructions(e.target.value)}
              placeholder="Enter general instructions for this template..."
              rows={3}
            />
          </div>

          {/* Preview Section */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold mb-3">Template Preview</h4>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Medicines ({prescriptions.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {prescriptions.slice(0, 3).map((prescription, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prescription.medicine || prescription.name}
                    </Badge>
                  ))}
                  {prescriptions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{prescriptions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Pathya ({pathya.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pathya.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {pathya.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{pathya.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Apathya ({apathya.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {apathya.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {apathya.length > 3 && (
                    <Badge variant="destructive" className="text-xs">
                      +{apathya.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!templateName.trim()}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
