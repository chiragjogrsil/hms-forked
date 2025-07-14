"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Pill, Calendar, User } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface LoadAllopathicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (template: any) => void
  department: string
}

export function LoadAllopathicTemplateModal({ isOpen, onClose, onLoad, department }: LoadAllopathicTemplateModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { getAllopathicTemplatesByDepartment } = usePrescriptionTemplates()

  const templates = getAllopathicTemplatesByDepartment(department)
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLoadTemplate = (template: any) => {
    onLoad(template)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Load Allopathic Template
          </DialogTitle>
          <DialogDescription>
            Choose from {templates.length} available Allopathic templates for the {department} department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No Allopathic templates found</p>
                {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="capitalize">
                            {template.department}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Medicines</p>
                            <p className="font-medium">{template.medicines?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Dietary Constraints</p>
                            <p className="font-medium">{template.dietaryConstraints?.length || 0}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {template.createdBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(template.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {template.generalInstructions && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{template.generalInstructions}</p>
                        )}
                      </div>

                      <Button size="sm" onClick={() => handleLoadTemplate(template)} className="ml-4">
                        Load Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
