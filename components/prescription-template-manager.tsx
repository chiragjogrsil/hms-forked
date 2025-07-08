"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Download, Pill, Leaf } from "lucide-react"
import { toast } from "sonner"

interface PrescriptionTemplate {
  id: string
  name: string
  description: string
  department: string
  allopathicMedicines: any[]
  ayurvedicMedicines: any[]
  createdAt: string
  createdBy: string
}

interface PrescriptionTemplateManagerProps {
  allopathicMedicines: any[]
  ayurvedicMedicines: any[]
  onLoadTemplate: (template: PrescriptionTemplate) => void
  department?: string
}

// Simplified mock templates
const mockTemplates: PrescriptionTemplate[] = [
  {
    id: "template-1",
    name: "Common Cold",
    description: "Standard cold and fever treatment",
    department: "General Medicine",
    allopathicMedicines: [
      { id: "1", medicine: "Paracetamol 500mg", dosage: "1-0-1", timing: "after-food", duration: "5", quantity: 10 },
      { id: "2", medicine: "Cetirizine 10mg", dosage: "0-0-1", timing: "after-food", duration: "5", quantity: 5 },
    ],
    ayurvedicMedicines: [
      { id: "1", medicine: "Tulsi Drops", dosage: "5 drops", frequency: "3 times daily", duration: "7 days" },
    ],
    createdAt: "2024-01-15",
    createdBy: "Dr. Smith",
  },
  {
    id: "template-2",
    name: "Hypertension",
    description: "Blood pressure management",
    department: "Cardiology",
    allopathicMedicines: [
      { id: "1", medicine: "Amlodipine 5mg", dosage: "1-0-0", timing: "after-food", duration: "30", quantity: 30 },
    ],
    ayurvedicMedicines: [
      { id: "1", medicine: "Arjuna Capsules", dosage: "2 capsules", frequency: "2 times daily", duration: "30 days" },
    ],
    createdAt: "2024-01-20",
    createdBy: "Dr. Johnson",
  },
]

export function PrescriptionTemplateManager({
  allopathicMedicines = [],
  ayurvedicMedicines = [],
  onLoadTemplate,
  department = "General Medicine",
}: PrescriptionTemplateManagerProps) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>(mockTemplates)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    department: department,
  })

  // Safe array handling
  const safeAllopathicMedicines = Array.isArray(allopathicMedicines) ? allopathicMedicines : []
  const safeAyurvedicMedicines = Array.isArray(ayurvedicMedicines) ? ayurvedicMedicines : []
  const totalMedicines = safeAllopathicMedicines.length + safeAyurvedicMedicines.length

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (totalMedicines === 0) {
      toast.error("Please add at least one medicine before saving")
      return
    }

    const template: PrescriptionTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      department: newTemplate.department,
      allopathicMedicines: safeAllopathicMedicines,
      ayurvedicMedicines: safeAyurvedicMedicines,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Current Doctor",
    }

    setTemplates([template, ...templates])
    setShowSaveDialog(false)
    setNewTemplate({ name: "", description: "", department: department })
    toast.success("Template saved successfully")
  }

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    onLoadTemplate(template)
    setShowLoadDialog(false)
    toast.success(`Template "${template.name}" loaded`)
  }

  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Prescription Templates</h3>
              <p className="text-sm text-gray-600">Save time with pre-made medicine combinations</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Current prescription summary */}
              {totalMedicines > 0 && (
                <div className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full border">
                  <div className="flex items-center gap-1">
                    <Pill className="h-3 w-3 text-blue-600" />
                    <span>{safeAllopathicMedicines.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="h-3 w-3 text-green-600" />
                    <span>{safeAyurvedicMedicines.length}</span>
                  </div>
                </div>
              )}

              {/* Load Template Button */}
              <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    Load Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Load Prescription Template</DialogTitle>
                    <DialogDescription>Choose a template to quickly add medicines</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {templates.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{template.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {template.department}
                                </Badge>
                              </div>

                              <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                              <div className="flex items-center gap-4 text-sm">
                                {template.allopathicMedicines.length > 0 && (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <Pill className="h-3 w-3" />
                                    <span>{template.allopathicMedicines.length} Allopathic</span>
                                  </div>
                                )}
                                {template.ayurvedicMedicines.length > 0 && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Leaf className="h-3 w-3" />
                                    <span>{template.ayurvedicMedicines.length} Ayurvedic</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button size="sm" onClick={() => handleLoadTemplate(template)} className="ml-4">
                              Load
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Save Template Button */}
              {totalMedicines > 0 && (
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save as Template</DialogTitle>
                      <DialogDescription>Save your current prescription for future use</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Preview current prescription */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Current Prescription:</p>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Pill className="h-3 w-3 mr-1" />
                            {safeAllopathicMedicines.length} Allopathic
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Leaf className="h-3 w-3 mr-1" />
                            {safeAyurvedicMedicines.length} Ayurvedic
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="template-name">Template Name *</Label>
                        <Input
                          id="template-name"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                          placeholder="e.g., Common Cold Treatment"
                        />
                      </div>

                      <div>
                        <Label htmlFor="template-description">Description</Label>
                        <Textarea
                          id="template-description"
                          value={newTemplate.description}
                          onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                          placeholder="Brief description of when to use this template"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="template-department">Department</Label>
                        <Select
                          value={newTemplate.department}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                            <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveTemplate}>Save Template</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
