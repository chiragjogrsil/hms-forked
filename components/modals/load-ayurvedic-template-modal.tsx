"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrescriptionTemplates, type AyurvedicTemplate } from "@/contexts/prescription-template-context"
import { Search, Leaf, Calendar, User } from "lucide-react"

interface LoadAyurvedicTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (template: AyurvedicTemplate) => void
}

export function LoadAyurvedicTemplateModal({ isOpen, onClose, onLoad }: LoadAyurvedicTemplateModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { getAllAyurvedicTemplates } = usePrescriptionTemplates()
  const templates = getAllAyurvedicTemplates()

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLoadTemplate = (template: AyurvedicTemplate) => {
    onLoad(template)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Load Ayurvedic Prescription Template
          </DialogTitle>
          <DialogDescription>Select a saved template to load into the current prescription</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {templates.length === 0 ? "No templates saved yet" : "No templates match your search"}
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {template.createdBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(template.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {template.department}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{template.prescriptions.length} medicines</span>
                      <span>{template.pathya.length} pathya items</span>
                      <span>{template.apathya.length} apathya items</span>
                    </div>
                    <Button size="sm" onClick={() => handleLoadTemplate(template)} className="w-full">
                      Load Template
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
