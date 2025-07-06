"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FolderOpen, Eye, Trash2, Pill, Leaf, Calendar, User } from "lucide-react"
import { usePrescriptionTemplates, type PrescriptionTemplate } from "@/contexts/prescription-template-context"
import { format } from "date-fns"

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
  const [showPreview, setShowPreview] = useState(false)
  const { searchTemplates, deleteTemplate } = usePrescriptionTemplates()
  const [filteredTemplates, setFilteredTemplates] = useState<PrescriptionTemplate[]>([])

  useEffect(() => {
    if (open) {
      const results = searchTemplates(searchQuery, department)
      setFilteredTemplates(results)
    }
  }, [open, searchQuery, department, searchTemplates])

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    onLoadTemplate(template)
    onOpenChange(false)
    setSearchQuery("")
    setSelectedTemplate(null)
  }

  const handlePreview = (template: PrescriptionTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleDelete = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTemplate(templateId)
    // Refresh the list
    const results = searchTemplates(searchQuery, department)
    setFilteredTemplates(results)
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "allopathic":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Allopathic</Badge>
      case "ayurvedic":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Ayurvedic</Badge>
      case "mixed":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Mixed</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  if (showPreview && selectedTemplate) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Template Preview: {selectedTemplate.name}
            </DialogTitle>
            <DialogDescription>Review the template details before loading</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Template Info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedTemplate.name}</CardTitle>
                  {getCategoryBadge(selectedTemplate.category)}
                </div>
                {selectedTemplate.description && (
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedTemplate.createdBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedTemplate.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allopathic Medicines */}
            {selectedTemplate.allopathicMedicines.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Pill className="w-4 h-4 text-green-600" />
                    Allopathic Medicines ({selectedTemplate.allopathicMedicines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {selectedTemplate.allopathicMedicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-medium text-green-900">{medicine.name}</div>
                        <div className="text-sm text-green-700 mt-1">
                          {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                        </div>
                        {medicine.instructions && (
                          <div className="text-sm text-green-600 mt-1 italic">{medicine.instructions}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ayurvedic Medicines */}
            {selectedTemplate.ayurvedicMedicines.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Leaf className="w-4 h-4 text-amber-600" />
                    Ayurvedic Medicines ({selectedTemplate.ayurvedicMedicines.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {selectedTemplate.ayurvedicMedicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="font-medium text-amber-900">{medicine.name}</div>
                        <div className="text-sm text-amber-700 mt-1">
                          {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                        </div>
                        {medicine.instructions && (
                          <div className="text-sm text-amber-600 mt-1 italic">{medicine.instructions}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to List
            </Button>
            <Button onClick={() => handleLoadTemplate(selectedTemplate)} className="bg-blue-600 hover:bg-blue-700">
              Load Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-600" />
            Load Prescription Template
          </DialogTitle>
          <DialogDescription>Choose a template to load into your current prescription</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates by name, description, or medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Templates List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No templates found</p>
                <p className="text-sm">Try adjusting your search or create a new template</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{template.name}</h3>
                          {getCategoryBadge(template.category)}
                        </div>

                        {template.description && <p className="text-sm text-gray-600 mb-2">{template.description}</p>}

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {template.createdBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(template.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          {template.allopathicMedicines.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <Pill className="w-3 h-3" />
                              {template.allopathicMedicines.length} Allopathic
                            </div>
                          )}
                          {template.ayurvedicMedicines.length > 0 && (
                            <div className="flex items-center gap-1 text-sm text-amber-600">
                              <Leaf className="w-3 h-3" />
                              {template.ayurvedicMedicines.length} Ayurvedic
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(template)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDelete(template.id, e)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleLoadTemplate(template)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
