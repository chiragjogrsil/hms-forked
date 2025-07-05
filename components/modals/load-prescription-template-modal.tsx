"use client"
import { useState, useEffect } from "react"
import { Search, Filter, Eye, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
import { usePrescriptionTemplates, type PrescriptionTemplate } from "@/contexts/prescription-template-context"
import { useConsultation } from "@/contexts/consultation-context"

interface LoadPrescriptionTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoadPrescriptionTemplateModal({ open, onOpenChange }: LoadPrescriptionTemplateModalProps) {
  const { searchTemplates, deleteTemplate, isLoading } = usePrescriptionTemplates()
  const { updateConsultationData, consultationData } = useConsultation()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<PrescriptionTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  const departments = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "ENT",
    "Ophthalmology",
    "Ayurveda",
    "Endocrinology",
    "Pain Management",
  ]

  const filteredTemplates = searchTemplates(searchQuery, {
    department: departmentFilter === "all" ? undefined : departmentFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  })

  const handleLoadTemplate = async (template: PrescriptionTemplate) => {
    try {
      // Add template prescriptions to current consultation
      const newPrescriptions = template.prescriptions.map((p) => ({
        ...p,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }))

      updateConsultationData({
        prescriptions: [...consultationData.prescriptions, ...newPrescriptions],
      })

      onOpenChange(false)
      setSelectedTemplate(null)
    } catch (error) {
      // Error handling is done in the context
    }
  }

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return

    try {
      await deleteTemplate(templateToDelete)
      setShowDeleteConfirm(false)
      setTemplateToDelete(null)
    } catch (error) {
      // Error handling is done in the context
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Reset filters when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setDepartmentFilter("all")
      setTypeFilter("all")
      setSelectedTemplate(null)
      setShowPreview(false)
    }
  }, [open])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Load Prescription Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="allopathic">Allopathic</SelectItem>
                  <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setDepartmentFilter("all")
                  setTypeFilter("all")
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear
              </Button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">{filteredTemplates.length} template(s) found</div>

            {/* Templates List */}
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <Badge
                              variant={
                                template.type === "mixed"
                                  ? "default"
                                  : template.type === "ayurvedic"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {template.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {template.department} • {template.createdBy} • {formatDate(template.createdAt)}
                          </div>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          )}
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTemplate(template)
                              setShowPreview(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setTemplateToDelete(template.id)
                              setShowDeleteConfirm(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-sm text-muted-foreground">
                        {template.prescriptions.length} prescription(s)
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" onClick={() => handleLoadTemplate(template)} disabled={isLoading}>
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Load Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No templates found matching your criteria</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.department} • {selectedTemplate.createdBy}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedTemplate.type === "mixed"
                      ? "default"
                      : selectedTemplate.type === "ayurvedic"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedTemplate.type}
                </Badge>
              </div>

              {selectedTemplate.description && <p className="text-sm">{selectedTemplate.description}</p>}

              {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Prescriptions ({selectedTemplate.prescriptions.length})</Label>
                {selectedTemplate.prescriptions.map((prescription, index) => (
                  <Card key={prescription.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={prescription.type === "allopathic" ? "default" : "secondary"}>
                              {prescription.type}
                            </Badge>
                            <span className="font-medium">{prescription.medication}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {prescription.dosage} • {prescription.frequency} • {prescription.duration}
                          </div>
                          {prescription.instructions && (
                            <div className="text-sm text-muted-foreground mt-1">{prescription.instructions}</div>
                          )}
                          <div className="flex gap-2 mt-2">
                            {prescription.beforeFood && (
                              <Badge variant="outline" className="text-xs">
                                Before Food
                              </Badge>
                            )}
                            {prescription.afterFood && (
                              <Badge variant="outline" className="text-xs">
                                After Food
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            {selectedTemplate && (
              <Button
                onClick={() => {
                  handleLoadTemplate(selectedTemplate)
                  setShowPreview(false)
                }}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Load This Template
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prescription template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
