"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye } from "lucide-react"
import { usePrescriptionTemplate } from "@/contexts/prescription-template-context"
import { AyurvedicTemplatePreviewModal } from "./ayurvedic-template-preview-modal"

interface LoadAyurvedicTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateSelect?: (template: any) => void
}

export function LoadAyurvedicTemplateModal({ open, onOpenChange, onTemplateSelect }: LoadAyurvedicTemplateModalProps) {
  const { getAllAyurvedicTemplates } = usePrescriptionTemplate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  const templates = getAllAyurvedicTemplates()
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
    setIsPreviewModalOpen(true)
  }

  const handleLoad = (template: any) => {
    onTemplateSelect?.(template)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Load Ayurvedic Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Templates List */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No templates found</p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {template.department}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {template.medicines.length} medicines
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handlePreview(template)} variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button onClick={() => handleLoad(template)} size="sm">
                            Load
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {template.description && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {selectedTemplate && (
        <AyurvedicTemplatePreviewModal
          open={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
          template={selectedTemplate}
        />
      )}
    </>
  )
}
