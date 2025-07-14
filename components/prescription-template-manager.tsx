"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, Eye, Filter, Save, FolderOpen } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { SaveAyurvedicTemplateModal } from "@/components/modals/save-ayurvedic-template-modal"
import { LoadAyurvedicTemplateModal } from "@/components/modals/load-ayurvedic-template-modal"
import { SaveAllopathicTemplateModal } from "@/components/modals/save-allopathic-template-modal"
import { LoadAllopathicTemplateModal } from "@/components/modals/load-allopathic-template-modal"
import { AyurvedicTemplatePreviewModal } from "@/components/modals/ayurvedic-template-preview-modal"
import { AllopathicTemplatePreviewModal } from "@/components/modals/allopathic-template-preview-modal"

interface PrescriptionTemplateManagerProps {
  type: "allopathic" | "ayurvedic"
  prescriptions: any[]
  department: string
  onLoadTemplate: (templateData: any) => void
  pathya?: string[]
  apathya?: string[]
  dietaryConstraints?: string[]
  readOnly?: boolean
}

const departments = [
  { value: "all", label: "All Departments" },
  { value: "general", label: "General Medicine" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "gynecology", label: "Gynecology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "ent", label: "ENT" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "ayurveda", label: "Ayurveda" },
  { value: "dental", label: "Dental" },
  { value: "emergency", label: "Emergency" },
]

export function PrescriptionTemplateManager({
  type,
  prescriptions,
  department,
  onLoadTemplate,
  pathya = [],
  apathya = [],
  dietaryConstraints = [],
  readOnly = false,
}: PrescriptionTemplateManagerProps) {
  const {
    ayurvedicTemplates,
    allopathicTemplates,
    deleteAyurvedicTemplate,
    deleteAllopathicTemplate,
    getAyurvedicTemplatesByDepartment,
    getAllopathicTemplatesByDepartment,
    searchAyurvedicTemplates,
    searchAllopathicTemplates,
    getAllAyurvedicTemplates,
    getAllAllopathicTemplates,
    isLoading,
  } = usePrescriptionTemplates()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState(type)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [isAyurvedicPreviewModalOpen, setIsAyurvedicPreviewModalOpen] = useState(false)
  const [isAllopathicPreviewModalOpen, setIsAllopathicPreviewModalOpen] = useState(false)

  const handleDeleteTemplate = async (id: string) => {
    if (type === "ayurvedic") {
      await deleteAyurvedicTemplate(id)
    } else {
      await deleteAllopathicTemplate(id)
    }
  }

  const handlePreviewTemplate = (template: any) => {
    setSelectedTemplate(template)
    if (type === "ayurvedic") {
      setIsAyurvedicPreviewModalOpen(true)
    } else {
      setIsAllopathicPreviewModalOpen(true)
    }
  }

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template)
    setIsSaveModalOpen(true)
  }

  const getFilteredTemplates = () => {
    let templates = type === "ayurvedic" ? getAllAyurvedicTemplates() : getAllAllopathicTemplates()

    if (selectedDepartment !== "all") {
      templates =
        type === "ayurvedic"
          ? getAyurvedicTemplatesByDepartment(selectedDepartment)
          : getAllopathicTemplatesByDepartment(selectedDepartment)
    }

    if (searchQuery) {
      templates = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return templates
  }

  const templateData = {
    prescriptions,
    department,
    ...(type === "ayurvedic" ? { pathya, apathya } : { dietaryConstraints }),
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prescription Templates</h2>
          <p className="text-gray-600">Manage and organize prescription templates</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="ayurvedic">Ayurvedic Templates ({ayurvedicTemplates.length})</TabsTrigger>
            <TabsTrigger value="allopathic">Allopathic Templates ({allopathicTemplates.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveModalOpen(true)}
                disabled={prescriptions.length === 0}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Template
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoadModalOpen(true)}
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Load Template
            </Button>
          </div>
        </div>

        {/* Ayurvedic Templates */}
        <TabsContent value="ayurvedic" className="space-y-4">
          {ayurvedicTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Ayurvedic templates found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedDepartment !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first Ayurvedic prescription template"}
                </p>
                {!readOnly && (
                  <Button onClick={() => setIsSaveModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ayurvedicTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {departments.find((d) => d.value === template.department)?.label || template.department}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {template.medicines.length} medicines
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {template.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    )}

                    <div className="text-xs text-gray-500">
                      <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                      <p>By: {template.createdBy}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handlePreviewTemplate(template)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      {!readOnly && (
                        <Button onClick={() => handleEditTemplate(template)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {!readOnly && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Template</DialogTitle>
                              <CardDescription>
                                Are you sure you want to delete "{template.name}"? This action cannot be undone.
                              </CardDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Allopathic Templates */}
        <TabsContent value="allopathic" className="space-y-4">
          {allopathicTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Allopathic templates found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedDepartment !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first Allopathic prescription template"}
                </p>
                {!readOnly && (
                  <Button onClick={() => setIsSaveModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allopathicTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {departments.find((d) => d.value === template.department)?.label || template.department}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {template.medicines.length} medicines
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {template.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    )}

                    <div className="text-xs text-gray-500">
                      <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                      <p>By: {template.createdBy}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handlePreviewTemplate(template)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      {!readOnly && (
                        <Button onClick={() => handleEditTemplate(template)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {!readOnly && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Template</DialogTitle>
                              <CardDescription>
                                Are you sure you want to delete "{template.name}"? This action cannot be undone.
                              </CardDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {type === "allopathic" ? (
        <SaveAllopathicTemplateModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          templateData={templateData}
        />
      ) : (
        <SaveAyurvedicTemplateModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          templateData={templateData}
        />
      )}

      {type === "allopathic" ? (
        <LoadAllopathicTemplateModal
          isOpen={isLoadModalOpen}
          onClose={() => setIsLoadModalOpen(false)}
          department={department}
          onLoadTemplate={onLoadTemplate}
        />
      ) : (
        <LoadAyurvedicTemplateModal
          isOpen={isLoadModalOpen}
          onClose={() => setIsLoadModalOpen(false)}
          department={department}
          onLoadTemplate={onLoadTemplate}
        />
      )}

      {selectedTemplate && type === "ayurvedic" && isAyurvedicPreviewModalOpen && (
        <AyurvedicTemplatePreviewModal
          open={true}
          onOpenChange={() => setIsAyurvedicPreviewModalOpen(false)}
          template={selectedTemplate}
        />
      )}

      {selectedTemplate && type === "allopathic" && isAllopathicPreviewModalOpen && (
        <AllopathicTemplatePreviewModal
          open={true}
          onOpenChange={() => setIsAllopathicPreviewModalOpen(false)}
          template={selectedTemplate}
        />
      )}
    </div>
  )
}
