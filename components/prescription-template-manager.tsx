"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save, FolderOpen, Trash2, FileText, Pill, Clock } from "lucide-react"
import { toast } from "sonner"

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  timing?: string
  beforeAfterFood?: string
}

interface PrescriptionTemplate {
  id: string
  name: string
  description?: string
  category: string
  allopathicMedicines: Medicine[]
  ayurvedicMedicines: Medicine[]
  createdAt: string
  lastUsed?: string
  usageCount: number
}

interface PrescriptionTemplateManagerProps {
  allopathicMedicines?: Medicine[]
  ayurvedicMedicines?: Medicine[]
  onLoadTemplate: (template: PrescriptionTemplate) => void
}

export function PrescriptionTemplateManager({
  allopathicMedicines = [],
  ayurvedicMedicines = [],
  onLoadTemplate,
}: PrescriptionTemplateManagerProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Safe array handling
  const safeAllopathicMedicines = Array.isArray(allopathicMedicines) ? allopathicMedicines : []
  const safeAyurvedicMedicines = Array.isArray(ayurvedicMedicines) ? ayurvedicMedicines : []

  // Mock templates data - in real app, this would come from API
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([
    {
      id: "1",
      name: "Hypertension Standard",
      description: "Standard treatment for hypertension",
      category: "Cardiology",
      allopathicMedicines: [
        {
          id: "1",
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take with water",
          timing: "Morning",
          beforeAfterFood: "After food",
        },
      ],
      ayurvedicMedicines: [],
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20",
      usageCount: 15,
    },
    {
      id: "2",
      name: "Diabetes Management",
      description: "Comprehensive diabetes treatment",
      category: "Endocrinology",
      allopathicMedicines: [
        {
          id: "2",
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take with meals",
          timing: "Morning & Evening",
          beforeAfterFood: "With food",
        },
      ],
      ayurvedicMedicines: [
        {
          id: "3",
          name: "Karela Churna",
          dosage: "1 tsp",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Mix with warm water",
          timing: "Before meals",
          beforeAfterFood: "Before food",
        },
      ],
      createdAt: "2024-01-10",
      lastUsed: "2024-01-18",
      usageCount: 8,
    },
    {
      id: "3",
      name: "Common Cold",
      description: "Treatment for viral upper respiratory infection",
      category: "General Medicine",
      allopathicMedicines: [
        {
          id: "4",
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "5 days",
          instructions: "Take with water",
          timing: "After meals",
          beforeAfterFood: "After food",
        },
      ],
      ayurvedicMedicines: [
        {
          id: "5",
          name: "Sitopaladi Churna",
          dosage: "1/2 tsp",
          frequency: "Three times daily",
          duration: "7 days",
          instructions: "Mix with honey",
          timing: "After meals",
          beforeAfterFood: "After food",
        },
      ],
      createdAt: "2024-01-05",
      lastUsed: "2024-01-22",
      usageCount: 25,
    },
  ])

  const categories = ["General Medicine", "Cardiology", "Endocrinology", "Respiratory", "Gastroenterology", "Neurology"]

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (!templateCategory) {
      toast.error("Please select a category")
      return
    }

    if (safeAllopathicMedicines.length === 0 && safeAyurvedicMedicines.length === 0) {
      toast.error("Please add at least one medicine before saving template")
      return
    }

    const newTemplate: PrescriptionTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      allopathicMedicines: safeAllopathicMedicines,
      ayurvedicMedicines: safeAyurvedicMedicines,
      createdAt: new Date().toISOString().split("T")[0],
      usageCount: 0,
    }

    setTemplates((prev) => [...prev, newTemplate])
    setShowSaveDialog(false)
    setTemplateName("")
    setTemplateDescription("")
    setTemplateCategory("")
    toast.success("Template saved successfully")
  }

  const handleLoadTemplate = (template: PrescriptionTemplate) => {
    // Update usage statistics
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === template.id
          ? { ...t, lastUsed: new Date().toISOString().split("T")[0], usageCount: t.usageCount + 1 }
          : t,
      ),
    )

    onLoadTemplate(template)
    setShowLoadDialog(false)
    toast.success(`Template "${template.name}" loaded successfully`)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
    toast.success("Template deleted successfully")
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const hasCurrentPrescription = safeAllopathicMedicines.length > 0 || safeAyurvedicMedicines.length > 0

  return (
    <div className="flex items-center gap-3">
      {/* Current Prescription Summary */}
      {hasCurrentPrescription && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Pill className="h-4 w-4" />
          <span>
            {safeAllopathicMedicines.length} Allopathic, {safeAyurvedicMedicines.length} Ayurvedic
          </span>
        </div>
      )}

      {/* Save Template Button */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasCurrentPrescription}
            className="flex items-center gap-2 bg-transparent"
          >
            <Save className="h-4 w-4" />
            Save Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Prescription Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Hypertension Standard"
              />
            </div>
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Brief description of the template"
              />
            </div>
            <div>
              <Label htmlFor="template-category">Category *</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview of medicines to be saved */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Medicines to save:</p>
              <div className="space-y-1 text-xs">
                {safeAllopathicMedicines.length > 0 && <p>• {safeAllopathicMedicines.length} Allopathic medicine(s)</p>}
                {safeAyurvedicMedicines.length > 0 && <p>• {safeAyurvedicMedicines.length} Ayurvedic medicine(s)</p>}
              </div>
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

      {/* Load Template Button */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <FolderOpen className="h-4 w-4" />
            Load Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Load Prescription Template</DialogTitle>
          </DialogHeader>

          {/* Search and Filter */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Templates List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No templates found</p>
                <p className="text-sm">Try adjusting your search or create a new template</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>

                      {template.description && <p className="text-sm text-gray-600 mb-2">{template.description}</p>}

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created: {template.createdAt}
                        </span>
                        {template.lastUsed && <span>Last used: {template.lastUsed}</span>}
                        <span>Used {template.usageCount} times</span>
                      </div>

                      <div className="flex gap-4 text-sm">
                        {template.allopathicMedicines.length > 0 && (
                          <span className="text-blue-600">{template.allopathicMedicines.length} Allopathic</span>
                        )}
                        {template.ayurvedicMedicines.length > 0 && (
                          <span className="text-green-600">{template.ayurvedicMedicines.length} Ayurvedic</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleLoadTemplate(template)}>
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
