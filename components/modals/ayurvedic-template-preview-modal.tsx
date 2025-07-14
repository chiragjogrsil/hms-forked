"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AyurvedicTemplate } from "@/contexts/prescription-template-context"
import { Leaf, Calendar, User, Pill, CheckCircle, XCircle, FileText } from "lucide-react"

interface AyurvedicTemplatePreviewModalProps {
  template: AyurvedicTemplate | null
  isOpen: boolean
  onClose: () => void
  onLoad: (template: AyurvedicTemplate) => void
}

export function AyurvedicTemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onLoad,
}: AyurvedicTemplatePreviewModalProps) {
  if (!template) return null

  const handleLoad = () => {
    onLoad(template)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            {template.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {template.createdBy}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(template.createdAt).toLocaleDateString()}
            </span>
            <Badge variant="outline" className="capitalize">
              {template.department}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {/* Prescriptions */}
          {template.prescriptions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Pill className="h-4 w-4" />
                  Medicines ({template.prescriptions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {template.prescriptions.map((prescription, index) => (
                  <div key={prescription.id} className="border rounded-lg p-3">
                    <div className="font-medium">{prescription.medicine}</div>
                    <div className="text-sm text-muted-foreground mt-1 space-y-1">
                      <div>Dosage: {prescription.dosage}</div>
                      <div>Duration: {prescription.duration}</div>
                      <div>Timing: {prescription.timing}</div>
                      {prescription.instructions && <div>Instructions: {prescription.instructions}</div>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Pathya */}
          {template.pathya.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Pathya - Do's ({template.pathya.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {template.pathya.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Apathya */}
          {template.apathya.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Apathya - Don'ts ({template.apathya.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {template.apathya.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* General Instructions */}
          {template.generalInstructions && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  General Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{template.generalInstructions}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleLoad}>Load Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
