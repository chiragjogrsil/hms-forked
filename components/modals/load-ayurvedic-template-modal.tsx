"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Leaf, Calendar, Eye } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useState } from "react"
import { AyurvedicTemplatePreviewModal } from "./ayurvedic-template-preview-modal"

interface LoadAyurvedicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (template: any) => void
  department: string
}

export function LoadAyurvedicTemplateModal({ isOpen, onClose, onLoad, department }: LoadAyurvedicTemplateModalProps) {
  const { getAyurvedicTemplatesByDepartment } = usePrescriptionTemplates()
  const templates = getAyurvedicTemplatesByDepartment(department)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const handleLoadTemplate = (template: any) => {
    onLoad({
      prescriptions: template.prescriptions,
      pathya: template.pathya,
      apathya: template.apathya,
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
              <Leaf className="h-5 w-5 text-green-600" />
              Load Ayurvedic Prescription Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Ayurvedic Templates Found</h3>
                <p className="text-gray-600">
                  No Ayurvedic prescription templates available for the {department} department.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="border-green-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Leaf className="h-4 w-4 text-green-600" />
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className="bg-green-100 text-green-800">Ayurvedic</Badge>
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
                                <Leaf className="h-3 w-3" />
                                <span>{template.prescriptions?.length || 0} Medicines</span>
                              </div>
                              <div className="text-green-600">
                                <span>{template.pathya?.length || 0} Pathya</span>
                              </div>
                              <div className="text-red-600">
                                <span>{template.apathya?.length || 0} Apathya</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreviewTemplate(template)}
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleLoadTemplate(template)}
                              className="bg-green-600 hover:bg-green-700"
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

      <AyurvedicTemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onLoad={handleLoadTemplate}
      />
    </>
  )
}
