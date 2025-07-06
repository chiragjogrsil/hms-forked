"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Package, Calendar, Pill, Leaf } from "lucide-react"
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
  const { getTemplatesByDepartment } = usePrescriptionTemplates()
  const templates = getTemplatesByDepartment(department)

  const handleLoadTemplate = (template: any) => {
    onLoad(template)
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ayurvedic":
        return <Leaf className="h-4 w-4 text-green-600" />
      case "allopathic":
        return <Pill className="h-4 w-4 text-blue-600" />
      case "mixed":
        return <Package className="h-4 w-4 text-purple-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ayurvedic":
        return "bg-green-100 text-green-700"
      case "allopathic":
        return "bg-blue-100 text-blue-700"
      case "mixed":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Load Prescription Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
              <p className="text-gray-600">No prescription templates available for the {department} department.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(template.type)}
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                          </div>

                          {template.description && <p className="text-sm text-gray-600 mb-3">{template.description}</p>}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Leaf className="h-3 w-3" />
                              <span>{template.ayurvedicPrescriptions?.length || 0} Ayurvedic</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Pill className="h-3 w-3" />
                              <span>{template.allopathicPrescriptions?.length || 0} Allopathic</span>
                            </div>
                          </div>
                        </div>

                        <Button size="sm" onClick={() => handleLoadTemplate(template)} className="ml-4">
                          <Download className="h-4 w-4 mr-2" />
                          Load
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
