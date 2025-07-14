"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2 } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { AllopathicTemplatePreviewModal } from "@/components/modals/allopathic-template-preview-modal"

interface LoadAllopathicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  department: string
  onLoadTemplate: (templateData: any) => void
}

export function LoadAllopathicTemplateModal({
  isOpen,
  onClose,
  department,
  onLoadTemplate,
}: LoadAllopathicTemplateModalProps) {
  const {
    allopathicTemplates,
    getAllopathicTemplatesByDepartment,
    searchAllopathicTemplates,
    deleteAllopathicTemplate,
  } = usePrescriptionTemplates()

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredTemplates(searchAllopathicTemplates(searchQuery))
    } else {
      setFilteredTemplates(getAllopathicTemplatesByDepartment(department))
    }
  }, [searchQuery, department, allopathicTemplates])

  const handleLoadTemplate = (template: any) => {
    onLoadTemplate({
      prescriptions: template.prescriptions,
      dietaryConstraints: template.dietaryConstraints || [],
    })
    onClose()
  }

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteAllopathicTemplate(templateId)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Load Allopathic Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search Templates</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or department"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description || "No description"}</CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {template.department}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p>{template.prescriptions.length} prescription(s)</p>
                        {template.dietaryConstraints && template.dietaryConstraints.length > 0 && (
                          <p>{template.dietaryConstraints.length} dietary constraint(s)</p>
                        )}
                        <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleLoadTemplate(template)} className="flex-1">
                          Load Template
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handlePreviewTemplate(template)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteTemplate(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No templates found matching your search."
                    : "No templates available for this department."}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <AllopathicTemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
        onLoadTemplate={handleLoadTemplate}
      />
    </>
  )
}
