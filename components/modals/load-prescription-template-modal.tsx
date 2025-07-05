"use client"

import type React from "react"

import { useState } from "react"
import { FolderOpen, Search, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePrescriptionTemplate, type PrescriptionTemplate } from "@/contexts/prescription-template-context"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"

interface LoadPrescriptionTemplateModalProps {
  trigger?: React.ReactNode
  onTemplateLoad?: (template: PrescriptionTemplate) => void
}

export function LoadPrescriptionTemplateModal({ trigger, onTemplateLoad }: LoadPrescriptionTemplateModalProps) {
  const { templates, deleteTemplate, searchTemplates } = usePrescriptionTemplate()
  const { currentConsultation, updateConsultation } = useConsultation()

  const [open, setOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<PrescriptionTemplate | null>(null)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const departments = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Ophthalmology",
    "Ayurveda",
  ]

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    if (!currentConsultation) {
      toast.error("No active consultation")
      return
    }

    try {
      // Convert template medicines to consultation prescriptions
      const allopathicPrescriptions = template.allopathicMedicines.map((med) => ({
        id: `med-${Date.now()}-${Math.random()}`,
        type: "allopathic" as const,
        medicine: med.medicine,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
        beforeFood: med.beforeFood,
        afterFood: med.afterFood,
      }))

      const ayurvedicPrescriptions = template.ayurvedicMedicines.map((med) => ({
        id: `med-${Date.now()}-${Math.random()}`,
        type: "ayurvedic" as const,
        medicine: med.medicine,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
        beforeFood: med.beforeFood,
        afterFood: med.afterFood,
      }))

      updateConsultation({
        allopathicPrescriptions: [...currentConsultation.allopathicPrescriptions, ...allopathicPrescriptions],
        ayurvedicPrescriptions: [...currentConsultation.ayurvedicPrescriptions, ...ayurvedicPrescriptions],
      })

      if (onTemplateLoad) {
        onTemplateLoad(template)
      }

      toast.success(`Template "${template.name}" loaded successfully`)
      setOpen(false)
    } catch (error) {
      toast.error("Failed to load template")
    }
  }

  const handlePreviewTemplate = (template: PrescriptionTemplate) => {
    setPreviewTemplate(template)
    setPreviewOpen(true)
  }

  const handleDeleteTemplate = (template: PrescriptionTemplate) => {
    try {
      deleteTemplate(template.id)
      toast.success(`Template "${template.name}" deleted`)
    } catch (error) {
      toast.error("Failed to delete template")
    }
  }

  const filteredTemplates = searchTemplates(searchQuery, filterDepartment, filterType)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <FolderOpen className="h-4 w-4" />
              Load Template
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Load Prescription Template</DialogTitle>
          </DialogHeader>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept.toLowerCase()}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates List */}
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {template.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.department}
                        </Badge>
                      </div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Allopathic: {template.allopathicMedicines.length} medicines</span>
                        <span>Ayurvedic: {template.ayurvedicMedicines.length} medicines</span>
                        <span>By: {template.createdBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleLoadTemplate(template)}>
                        Load
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No templates found matching your criteria</div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Preview Template Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{previewTemplate.name}</h3>
                  <Badge variant="secondary">{previewTemplate.type}</Badge>
                  <Badge variant="outline">{previewTemplate.department}</Badge>
                </div>

                {previewTemplate.description && <p className="text-muted-foreground">{previewTemplate.description}</p>}

                {previewTemplate.allopathicMedicines.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Allopathic Medicines</h4>
                    <div className="space-y-2">
                      {previewTemplate.allopathicMedicines.map((med, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="font-medium">{med.medicine}</div>
                          <div className="text-sm text-muted-foreground">
                            {med.dosage} • {med.frequency} • {med.duration}
                          </div>
                          {med.instructions && (
                            <div className="text-sm text-muted-foreground mt-1">{med.instructions}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewTemplate.ayurvedicMedicines.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Ayurvedic Medicines</h4>
                    <div className="space-y-2">
                      {previewTemplate.ayurvedicMedicines.map((med, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="font-medium">{med.medicine}</div>
                          <div className="text-sm text-muted-foreground">
                            {med.dosage} • {med.frequency} • {med.duration}
                          </div>
                          {med.instructions && (
                            <div className="text-sm text-muted-foreground mt-1">{med.instructions}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
