"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderOpen, Search, Eye, Trash2, Pill, Leaf, Calendar } from "lucide-react"
import { usePrescriptionTemplates, type PrescriptionTemplate } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"

interface LoadPrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadTemplate: (template: PrescriptionTemplate) => void
  department: string
}

export function LoadPrescriptionTemplateModal({
  open,
  onOpenChange,
  onLoadTemplate,
  department,
}: LoadPrescriptionTemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<PrescriptionTemplate | null>(null)
  const { templates, deleteTemplate, searchTemplates } = usePrescriptionTemplates()
  const { toast } = useToast()

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : templates.filter((t) => t.department === department)

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    onLoadTemplate(template)
    toast({
      title: "Template loaded successfully",
      description: `"${template.name}" has been loaded into your prescription.`,
    })
    onOpenChange(false)
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    deleteTemplate(templateId)
    toast({
      title: "Template deleted",
      description: `"${templateName}" has been removed from your templates.`,
    })
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "allopathic":
        return "bg-green-100 text-green-800"
      case "ayurvedic":
        return "bg-orange-100 text-orange-800"
      case "mixed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Load Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[60vh]">
          {/* Template List */}
          <div className="flex-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-full">
              <div className="space-y-2">
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No templates found</p>
                    <p className="text-sm">Try adjusting your search or create a new template</p>
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                            </div>

                            {template.description && (
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {template.createdAt}
                              </div>
                              <div className="flex items-center gap-1">
                                <Pill className="h-3 w-3" />
                                {template.allopathicMedicines.length}
                              </div>
                              <div className="flex items-center gap-1">
                                <Leaf className="h-3 w-3" />
                                {template.ayurvedicMedicines.length}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTemplate(template)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTemplate(template.id, template.name)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Template Preview */}
          <div className="w-80 border-l pl-6">
            {selectedTemplate ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTemplate.name}</h3>
                  {selectedTemplate.description && (
                    <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(selectedTemplate.category)}>{selectedTemplate.category}</Badge>
                  <Badge variant="outline">{selectedTemplate.department}</Badge>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {selectedTemplate.allopathicMedicines.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Allopathic Medicines
                        </h4>
                        <div className="space-y-2">
                          {selectedTemplate.allopathicMedicines.map((medicine, index) => (
                            <Card key={index} className="p-3">
                              <div className="text-sm">
                                <div className="font-medium">{medicine.name}</div>
                                <div className="text-gray-600">
                                  {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                </div>
                                {medicine.instructions && (
                                  <div className="text-gray-500 text-xs mt-1">{medicine.instructions}</div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTemplate.ayurvedicMedicines.length > 0 && (
                      <div>
                        <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                          <Leaf className="h-4 w-4" />
                          Ayurvedic Medicines
                        </h4>
                        <div className="space-y-2">
                          {selectedTemplate.ayurvedicMedicines.map((medicine, index) => (
                            <Card key={index} className="p-3">
                              <div className="text-sm">
                                <div className="font-medium">{medicine.name}</div>
                                <div className="text-gray-600">
                                  {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                </div>
                                {medicine.instructions && (
                                  <div className="text-gray-500 text-xs mt-1">{medicine.instructions}</div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Button onClick={() => handleLoadTemplate(selectedTemplate)} className="flex-1">
                    Load Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteTemplate(selectedTemplate.id, selectedTemplate.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a template to preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
