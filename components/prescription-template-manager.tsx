"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { FileText, Search, Save, Trash2, Download } from "lucide-react"
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

// Mock templates data
const mockTemplates: PrescriptionTemplate[] = [
  {
    id: "template-1",
    name: "Hypertension Management",
    description: "Standard prescription for hypertension patients",
    department: "Cardiology",
    allopathicMedicines: [
      {
        id: "1",
        medicine: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take in the morning",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Metoprolol",
        dosage: "25mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Monitor heart rate",
        beforeAfterFood: "after",
      },
    ],
    ayurvedicMedicines: [
      {
        id: "1",
        medicine: "Arjuna Capsules",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "For heart health",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-15",
    createdBy: "Dr. Smith",
  },
  {
    id: "template-2",
    name: "Diabetes Type 2 Standard",
    description: "Common prescription for Type 2 diabetes management",
    department: "Endocrinology",
    allopathicMedicines: [
      {
        id: "1",
        medicine: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Glimepiride",
        dosage: "2mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take before breakfast",
        beforeAfterFood: "before",
      },
    ],
    ayurvedicMedicines: [
      {
        id: "1",
        medicine: "Karela Capsules",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Natural blood sugar support",
        beforeAfterFood: "before",
      },
    ],
    createdAt: "2024-01-20",
    createdBy: "Dr. Johnson",
  },
  {
    id: "template-3",
    name: "Common Cold & Fever",
    description: "Standard treatment for viral fever and cold symptoms",
    department: "General Medicine",
    allopathicMedicines: [
      {
        id: "1",
        medicine: "Paracetamol",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "5 days",
        instructions: "For fever and body ache",
        beforeAfterFood: "after",
      },
      {
        id: "2",
        medicine: "Cetirizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "5 days",
        instructions: "For runny nose and sneezing",
        beforeAfterFood: "after",
      },
    ],
    ayurvedicMedicines: [
      {
        id: "1",
        medicine: "Tulsi Drops",
        dosage: "5 drops",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Mix in warm water",
        beforeAfterFood: "before",
      },
      {
        id: "2",
        medicine: "Sitopaladi Churna",
        dosage: "1 tsp",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Mix with honey",
        beforeAfterFood: "after",
      },
    ],
    createdAt: "2024-01-25",
    createdBy: "Dr. Patel",
  },
]

export function PrescriptionTemplateManager({
  allopathicMedicines = [],
  ayurvedicMedicines = [],
  onLoadTemplate,
  department = "General Medicine",
}: PrescriptionTemplateManagerProps) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    department: department,
  })

  // Safe array handling
  const safeAllopathicMedicines = Array.isArray(allopathicMedicines) ? allopathicMedicines : []
  const safeAyurvedicMedicines = Array.isArray(ayurvedicMedicines) ? ayurvedicMedicines : []

  // Filter templates based on search and department
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || template.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    onLoadTemplate(template)
    toast.success(`Template "${template.name}" loaded successfully`)
  }

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (safeAllopathicMedicines.length === 0 && safeAyurvedicMedicines.length === 0) {
      toast.error("Please add at least one medicine before saving template")
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

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
    toast.success("Template deleted successfully")
  }

  const departments = [
    "all",
    "General Medicine",
    "Cardiology",
    "Endocrinology",
    "Ayurveda",
    "Orthopedics",
    "Dermatology",
  ]

  return (
    <div className="space-y-4">
      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save as Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Prescription Template</DialogTitle>
              <DialogDescription>Save the current prescription as a reusable template</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Enter template description"
                  rows={3}
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
                    {departments.slice(1).map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>Save Template</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Prescription Summary */}
      {(safeAllopathicMedicines.length > 0 || safeAyurvedicMedicines.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Current Prescription Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary">{safeAllopathicMedicines.length} Allopathic</Badge>
              <Badge variant="secondary">{safeAyurvedicMedicines.length} Ayurvedic</Badge>
            </div>
            <p className="text-xs text-gray-600">Save this prescription as a template for future use</p>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Available Templates ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No templates found</p>
                  <p className="text-xs">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {template.department}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{template.allopathicMedicines?.length || 0} Allopathic</span>
                          <span>{template.ayurvedicMedicines?.length || 0} Ayurvedic</span>
                          <span>By {template.createdBy}</span>
                          <span>{template.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadTemplate(template)}
                          className="h-8 px-2"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
