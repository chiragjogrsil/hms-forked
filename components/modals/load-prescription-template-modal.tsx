"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Search, Trash2, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

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

  const templates = getTemplatesByDepartment(department)

  const handleLoadTemplate = (template: any) => {
    if (!template.ayurvedicPrescriptions && !template.allopathicPrescriptions) {
      toast.error("This template has no prescription data")
      return
    }

    onLoad({
      ayurvedic: template.ayurvedicPrescriptions || [],
      allopathic: template.allopathicPrescriptions || [],
    })
    toast.success(`Template "${template.name}" loaded successfully`)
    onClose()
  }

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId)
    setSelectedTemplate(null)
    toast.success("Template deleted successfully")
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Load Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Templates</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Templates List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">No templates found</p>
                <p className="text-xs mt-1">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : `No prescription templates available for ${department} department`}
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {(template.ayurvedicPrescriptions?.length || 0) +
                            (template.allopathicPrescriptions?.length || 0)}{" "}
                          medicines
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {template.type}
                        </Badge>
                      </div>

                      {template.description && <p className="text-xs text-gray-600 mb-2">{template.description}</p>}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {template.createdBy}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTemplate(template.id)
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Template Preview */}
          {selectedTemplate && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Template Preview</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedTemplate.ayurvedicPrescriptions?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">Ayurvedic Medicines:</p>
                      {selectedTemplate.ayurvedicPrescriptions.map((medicine: any, index: number) => (
                        <div key={index} className="text-xs p-2 bg-green-50 rounded mb-1">
                          <span className="font-medium">
                            {index + 1}. {medicine.medicineType || medicine.medicine}
                          </span>
                          <span className="text-gray-600 ml-2">
                            {medicine.dosage} - {medicine.frequency} - {medicine.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedTemplate.allopathicPrescriptions?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-blue-700 mb-1">Allopathic Medicines:</p>
                      {selectedTemplate.allopathicPrescriptions.map((medicine: any, index: number) => (
                        <div key={index} className="text-xs p-2 bg-blue-50 rounded mb-1">
                          <span className="font-medium">
                            {index + 1}. {medicine.medicine}
                          </span>
                          <span className="text-gray-600 ml-2">
                            {medicine.dosage} - {medicine.frequency} - {medicine.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!selectedTemplate.ayurvedicPrescriptions?.length &&
                    !selectedTemplate.allopathicPrescriptions?.length && (
                      <p className="text-xs text-gray-500">No medicines in this template</p>
                    )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedTemplate && handleLoadTemplate(selectedTemplate)}
            disabled={!selectedTemplate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Load Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
