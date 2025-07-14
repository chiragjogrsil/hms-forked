"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Pill, Calendar, Eye } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useState } from "react"
import { AllopathicTemplatePreviewModal } from "./allopathic-template-preview-modal"

interface LoadAllopathicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (template: any) => void
  department: string
}

export function LoadAllopathicTemplateModal({ isOpen, onClose, onLoad, department }: LoadAllopathicTemplateModalProps) {
  const { getAllopathicTemplatesByDepartment } = usePrescriptionTemplates()
  const templates = getAllopathicTemplatesByDepartment(department)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const handleLoadTemplate = (template: any) => {
    onLoad({
      prescriptions: template.prescriptions,
      dietaryConstraints: template.dietaryConstraints,
    })
    onClose()
  }

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <Pill className="h-5 w-5 text-blue-600" />
              Load Allopathic Prescription Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Allopathic Templates Found</h3>
                <p className="text-gray-600">
                  No Allopathic prescription templates available for the {department} department.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="border-blue-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Pill className="h-4 w-4 text-blue-600" />
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className="bg-blue-100 text-blue-800">Allopathic</Badge>
                            </div>

                            {template.description && (
                              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Pill className="h-3 w-3" />
                                <span>{template.prescriptions?.length || 0} Medicines</span>
                              </div>
                              <div className="text-orange-600">
                                <span>{template.dietaryConstraints?.length || 0} Dietary Guidelines</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreviewTemplate(template)}
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleLoadTemplate(template)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Load
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AllopathicTemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onLoad={handleLoadTemplate}
      />
    </>
  )
}
