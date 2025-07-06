"use client"

import { useState } from "react"
import { Download, Search, Eye, Trash2, Pill, Leaf, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useToast } from "@/hooks/use-toast"

interface LoadPrescriptionTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  department: string
  onLoadTemplate: (template: any) => void
}

export function LoadPrescriptionTemplateModal({
  isOpen,
  onClose,
  department,
  onLoadTemplate,
}: LoadPrescriptionTemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const { searchTemplates, getTemplatesByDepartment, deleteTemplate } = usePrescriptionTemplates()
  const { toast } = useToast()

  const templates = searchQuery
    ? searchTemplates(searchQuery).filter(
        (t) => t.department === department || t.department === "general" || department === "general",
      )
    : getTemplatesByDepartment(department)

  const handleLoadTemplate = (template: any) => {
    onLoadTemplate(template)
    toast({
      title: "Template loaded successfully",
      description: `"${template.name}" has been applied to your prescription`,
    })
    onClose()
  }

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId)
    toast({
      title: "Template deleted",
      description: "Template has been removed from your library",
    })
    setTemplateToDelete(null)
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Load Prescription Template
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates by name, description, or medicine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Templates List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {templates.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Download className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">
                        {searchQuery ? "No templates found matching your search" : "No templates available"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                                {template.category}
                              </Badge>
                            </div>

                            {template.description && (
                              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {template.allopathicPrescriptions.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Pill className="h-3 w-3 text-blue-600" />
                                  <span>{template.allopathicPrescriptions.length} Allopathic</span>
                                </div>
                              )}
                              {template.ayurvedicPrescriptions.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Leaf className="h-3 w-3 text-green-600" />
                                  <span>{template.ayurvedicPrescriptions.length} Ayurvedic</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{template.createdAt}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{template.createdBy}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template)
                                setShowPreview(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTemplateToDelete(template.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleLoadTemplate(template)}>
                              Load
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
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {selectedTemplate.allopathicPrescriptions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-blue-600" />
                      Allopathic Medicines
                    </h4>
                    <div className="space-y-2">
                      {selectedTemplate.allopathicPrescriptions.map((med: any, idx: number) => (
                        <Card key={idx} className="bg-blue-50">
                          <CardContent className="p-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <strong>Medicine:</strong> {med.medicine}
                              </div>
                              <div>
                                <strong>Dosage:</strong> {med.dosage}
                              </div>
                              <div>
                                <strong>Duration:</strong> {med.duration} days
                              </div>
                              <div>
                                <strong>Quantity:</strong> {med.quantity}
                              </div>
                              <div className="col-span-2">
                                <strong>Instructions:</strong> {med.instructions}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTemplate.ayurvedicPrescriptions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Ayurvedic Medicines
                    </h4>
                    <div className="space-y-2">
                      {selectedTemplate.ayurvedicPrescriptions.map((med: any, idx: number) => (
                        <Card key={idx} className="bg-green-50">
                          <CardContent className="p-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <strong>Medicine:</strong> {med.medicine}
                              </div>
                              <div>
                                <strong>Dosage:</strong> {med.dosage}
                              </div>
                              <div>
                                <strong>Duration:</strong> {med.duration}
                              </div>
                              <div className="col-span-2">
                                <strong>Instructions:</strong> {med.instructions}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate) {
                  handleLoadTemplate(selectedTemplate)
                  setShowPreview(false)
                }
              }}
            >
              Load This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
