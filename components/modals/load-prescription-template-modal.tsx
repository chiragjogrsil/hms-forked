"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"
import { Search, Eye, Trash2, Calendar, User } from "lucide-react"

interface LoadPrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadTemplate: (medicines: { allopathic: any[]; ayurvedic: any[] }) => void
  department?: string
}

export function LoadPrescriptionTemplateModal({
  open,
  onOpenChange,
  onLoadTemplate,
  department,
}: LoadPrescriptionTemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const { templates, loadTemplate, deleteTemplate } = usePrescriptionTemplates()
  const { toast } = useToast()

  // Filter templates by department and search query
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Filter by department if specified
    if (department) {
      filtered = filtered.filter((template) => !template.department || template.department === department)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.medicines.some((med) => med.name.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [templates, department, searchQuery])

  const selectedTemplate = selectedTemplateId ? loadTemplate(selectedTemplateId) : null

  const handleLoadTemplate = () => {
    if (!selectedTemplate) return

    // Convert template medicines back to prescription format
    const allopathicMedicines = selectedTemplate.medicines
      .filter((med) => med.type === "allopathic")
      .map((med) => ({
        id: med.id,
        medicine: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
      }))

    const ayurvedicMedicines = selectedTemplate.medicines
      .filter((med) => med.type === "ayurvedic")
      .map((med) => ({
        id: med.id,
        medicine: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
      }))

    onLoadTemplate({ allopathic: allopathicMedicines, ayurvedic: ayurvedicMedicines })

    toast({
      title: "Success",
      description: `Loaded template: ${selectedTemplate.name}`,
    })

    onOpenChange(false)
    setSelectedTemplateId(null)
  }

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    deleteTemplate(templateId)
    toast({
      title: "Template Deleted",
      description: `"${templateName}" has been removed`,
    })
    if (selectedTemplateId === templateId) {
      setSelectedTemplateId(null)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "allopathic":
        return "bg-blue-100 text-blue-800"
      case "ayurvedic":
        return "bg-green-100 text-green-800"
      case "mixed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Load Prescription Template</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Templates List */}
          <div className="flex-1 flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No templates found matching your search" : "No templates available"}
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplateId === template.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTemplateId(template.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                          {template.description && <p className="text-xs text-gray-600 mt-1">{template.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTemplate(template.id, template.name)
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {template.medicines.length} medicine{template.medicines.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{template.createdBy}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Template Preview */}
          {selectedTemplate && (
            <div className="w-80 border-l pl-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Template Preview
              </h3>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">{selectedTemplate.name}</h4>
                  {selectedTemplate.description && (
                    <p className="text-xs text-gray-600 mt-1">{selectedTemplate.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(selectedTemplate.createdAt).toLocaleDateString()}</span>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Medicines ({selectedTemplate.medicines.length})</h5>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedTemplate.medicines.map((medicine, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium flex items-center gap-2">
                          {medicine.name}
                          <Badge className={`text-xs ${getCategoryColor(medicine.type)}`}>{medicine.type}</Badge>
                        </div>
                        <div className="text-gray-600 mt-1">
                          <div>
                            {medicine.dosage} • {medicine.frequency}
                          </div>
                          <div>Duration: {medicine.duration}</div>
                          {medicine.instructions && <div className="italic">"{medicine.instructions}"</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleLoadTemplate} disabled={!selectedTemplate}>
            Load Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
