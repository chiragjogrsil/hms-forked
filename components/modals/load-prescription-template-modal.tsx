"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Download, Package, Calendar, Pill, Leaf, Search, Trash2, Eye } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { toast } from "sonner"

interface LoadPrescriptionTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (template: any) => void
  department: string
}

export function LoadPrescriptionTemplateModal({
  isOpen,
  onClose,
  onLoad,
  department,
}: LoadPrescriptionTemplateModalProps) {
  const { getTemplatesByDepartment, deleteTemplate } = usePrescriptionTemplates()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  const allTemplates = getTemplatesByDepartment(department)

  // Filter templates based on search term
  const templates = allTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLoadTemplate = (template: any) => {
    onLoad(template)
    onClose()
    toast.success(`Template "${template.name}" loaded successfully!`)
  }

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    deleteTemplate(templateId)
    toast.success(`Template "${templateName}" deleted successfully!`)
  }

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ayurvedic":
        return <Leaf className="h-4 w-4 text-green-600" />
      case "allopathic":
        return <Pill className="h-4 w-4 text-blue-600" />
      case "mixed":
        return <Package className="h-4 w-4 text-purple-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ayurvedic":
        return "bg-green-100 text-green-700"
      case "allopathic":
        return "bg-blue-100 text-blue-700"
      case "mixed":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <>
      <Dialog open={isOpen && !showPreview} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Load Prescription Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No templates found" : "No Templates Found"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `No templates match "${searchTerm}" in the ${department} department.`
                    : `No prescription templates available for the ${department} department.`}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getTypeIcon(template.type)}
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
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
                                <span>{template.ayurvedicPrescriptions?.length || 0} Ayurvedic</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Pill className="h-3 w-3" />
                                <span>{template.allopathicPrescriptions?.length || 0} Allopathic</span>
                              </div>
                              <span>By: {template.createdBy}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(template)}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id, template.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleLoadTemplate(template)}>
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

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.department} • Created by {selectedTemplate.createdBy}
                  </p>
                </div>
                <Badge className={getTypeColor(selectedTemplate.type)}>{selectedTemplate.type}</Badge>
              </div>

              {selectedTemplate.description && <p className="text-sm text-gray-700">{selectedTemplate.description}</p>}

              <div className="space-y-4">
                {/* Allopathic Prescriptions */}
                {selectedTemplate.allopathicPrescriptions?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-blue-600" />
                      Allopathic Medicines ({selectedTemplate.allopathicPrescriptions.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTemplate.allopathicPrescriptions.map((med: any, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 rounded border">
                          <div className="font-medium">{med.medicine}</div>
                          <div className="text-sm text-gray-600">
                            {med.dosage} • {med.timing?.replace("-", " ")} • {med.duration} days
                          </div>
                          {med.instructions && <div className="text-sm text-gray-600 mt-1">{med.instructions}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ayurvedic Prescriptions */}
                {selectedTemplate.ayurvedicPrescriptions?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Ayurvedic Medicines ({selectedTemplate.ayurvedicPrescriptions.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTemplate.ayurvedicPrescriptions.map((med: any, index: number) => (
                        <div key={index} className="p-3 bg-green-50 rounded border">
                          <div className="font-medium">{med.medicine}</div>
                          <div className="text-sm text-gray-600">
                            {med.dosage} • {med.duration}
                          </div>
                          {med.instructions && <div className="text-sm text-gray-600 mt-1">{med.instructions}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleLoadTemplate(selectedTemplate)
                    setShowPreview(false)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Load This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
