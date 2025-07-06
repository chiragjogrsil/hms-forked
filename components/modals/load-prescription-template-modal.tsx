"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Search, Eye, Trash2, Calendar } from "lucide-react"
import { usePrescriptionTemplates, type PrescriptionTemplate } from "@/contexts/prescription-template-context"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface LoadPrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadTemplate: (allopathicMedicines: any[], ayurvedicMedicines: any[]) => void
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
  const [previewOpen, setPreviewOpen] = useState<string | null>(null)
  const { searchTemplates, loadTemplate, deleteTemplate } = usePrescriptionTemplates()

  const filteredTemplates = searchTemplates(searchQuery, department)

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    onLoadTemplate(template.allopathicMedicines, template.ayurvedicMedicines)
    loadTemplate(template.id)
    onOpenChange(false)
    setSearchQuery("")
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTemplate(templateId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "allopathic":
        return "bg-green-50 text-green-700 border-green-200"
      case "ayurvedic":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "mixed":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-600" />
            Load Prescription Template
          </DialogTitle>
          <DialogDescription>Choose a template to load into your current prescription</DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates by name, description, or medicine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No templates found</p>
              <p className="text-sm">Try adjusting your search or create a new template</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.description && (
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewOpen(previewOpen === template.id ? null : template.id)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <Badge variant="outline">{template.department}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {formatDate(template.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    {template.allopathicMedicines.length > 0 && (
                      <span>{template.allopathicMedicines.length} Allopathic</span>
                    )}
                    {template.ayurvedicMedicines.length > 0 && (
                      <span>{template.ayurvedicMedicines.length} Ayurvedic</span>
                    )}
                    <span className="text-xs text-gray-400">by {template.createdBy}</span>
                  </div>
                </CardHeader>

                <Collapsible open={previewOpen === template.id}>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        {template.allopathicMedicines.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Allopathic Medicines</h4>
                            <div className="space-y-2">
                              {template.allopathicMedicines.map((medicine, index) => (
                                <div key={index} className="text-sm bg-white p-2 rounded border">
                                  <div className="font-medium">{medicine.name}</div>
                                  <div className="text-gray-600">
                                    {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                  </div>
                                  {medicine.instructions && (
                                    <div className="text-gray-500 text-xs mt-1">{medicine.instructions}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {template.ayurvedicMedicines.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-700 mb-2">Ayurvedic Medicines</h4>
                            <div className="space-y-2">
                              {template.ayurvedicMedicines.map((medicine, index) => (
                                <div key={index} className="text-sm bg-white p-2 rounded border">
                                  <div className="font-medium">{medicine.name}</div>
                                  <div className="text-gray-600">
                                    {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                  </div>
                                  {medicine.instructions && (
                                    <div className="text-gray-500 text-xs mt-1">{medicine.instructions}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>

                <CardContent className="pt-0">
                  <Button onClick={() => handleLoadTemplate(template)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Load This Template
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
