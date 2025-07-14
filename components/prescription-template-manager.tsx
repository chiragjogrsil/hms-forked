"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react"
import { usePrescriptionTemplate } from "@/contexts/prescription-template-context"
import { SaveAyurvedicTemplateModal } from "@/components/modals/save-ayurvedic-template-modal"
import { LoadAyurvedicTemplateModal } from "@/components/modals/load-ayurvedic-template-modal"
import { SaveAllopathicTemplateModal } from "@/components/modals/save-allopathic-template-modal"
import { LoadAllopathicTemplateModal } from "@/components/modals/load-allopathic-template-modal"
import { AyurvedicTemplatePreviewModal } from "@/components/modals/ayurvedic-template-preview-modal"
import { AllopathicTemplatePreviewModal } from "@/components/modals/allopathic-template-preview-modal"

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

export function PrescriptionTemplateManager() {
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
  } = usePrescriptionTemplate()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("ayurvedic")

  // Modal states
  const [isSaveAyurvedicModalOpen, setIsSaveAyurvedicModalOpen] = useState(false)
  const [isLoadAyurvedicModalOpen, setIsLoadAyurvedicModalOpen] = useState(false)
  const [isSaveAllopathicModalOpen, setIsSaveAllopathicModalOpen] = useState(false)
  const [isLoadAllopathicModalOpen, setIsLoadAllopathicModalOpen] = useState(false)
  const [isAyurvedicPreviewModalOpen, setIsAyurvedicPreviewModalOpen] = useState(false)
  const [isAllopathicPreviewModalOpen, setIsAllopathicPreviewModalOpen] = useState(false)

  const [selectedAyurvedicTemplate, setSelectedAyurvedicTemplate] = useState<any>(null)
  const [selectedAllopathicTemplate, setSelectedAllopathicTemplate] = useState<any>(null)
  const [editingAyurvedicTemplate, setEditingAyurvedicTemplate] = useState<any>(null)
  const [editingAllopathicTemplate, setEditingAllopathicTemplate] = useState<any>(null)

  // Filter functions
  const getFilteredAyurvedicTemplates = () => {
    let templates = getAllAyurvedicTemplates()

    if (selectedDepartment !== "all") {
      templates = getAyurvedicTemplatesByDepartment(selectedDepartment)
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

  const getFilteredAllopathicTemplates = () => {
    let templates = getAllAllopathicTemplates()

    if (selectedDepartment !== "all") {
      templates = getAllopathicTemplatesByDepartment(selectedDepartment)
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

  const handleDeleteAyurvedicTemplate = async (id: string) => {
    await deleteAyurvedicTemplate(id)
  }

  const handleDeleteAllopathicTemplate = async (id: string) => {
    await deleteAllopathicTemplate(id)
  }

  const handlePreviewAyurvedicTemplate = (template: any) => {
    setSelectedAyurvedicTemplate(template)
    setIsAyurvedicPreviewModalOpen(true)
  }

  const handlePreviewAllopathicTemplate = (template: any) => {
    setSelectedAllopathicTemplate(template)
    setIsAllopathicPreviewModalOpen(true)
  }

  const handleEditAyurvedicTemplate = (template: any) => {
    setEditingAyurvedicTemplate(template)
    setIsSaveAyurvedicModalOpen(true)
  }

  const handleEditAllopathicTemplate = (template: any) => {
    setEditingAllopathicTemplate(template)
    setIsSaveAllopathicModalOpen(true)
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
            <TabsTrigger value="ayurvedic">Ayurvedic Templates ({getFilteredAyurvedicTemplates().length})</TabsTrigger>
            <TabsTrigger value="allopathic">
              Allopathic Templates ({getFilteredAllopathicTemplates().length})
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {activeTab === "ayurvedic" ? (
              <>
                <Button
                  onClick={() => setIsLoadAyurvedicModalOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Load Template
                </Button>
                <Button
                  onClick={() => {
                    setEditingAyurvedicTemplate(null)
                    setIsSaveAyurvedicModalOpen(true)
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Ayurvedic Template
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsLoadAllopathicModalOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Load Template
                </Button>
                <Button
                  onClick={() => {
                    setEditingAllopathicTemplate(null)
                    setIsSaveAllopathicModalOpen(true)
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Allopathic Template
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ayurvedic Templates */}
        <TabsContent value="ayurvedic" className="space-y-4">
          {getFilteredAyurvedicTemplates().length === 0 ? (
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
                <Button
                  onClick={() => {
                    setEditingAyurvedicTemplate(null)
                    setIsSaveAyurvedicModalOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredAyurvedicTemplates().map((template) => (
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
                        onClick={() => handlePreviewAyurvedicTemplate(template)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button onClick={() => handleEditAyurvedicTemplate(template)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Template</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{template.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAyurvedicTemplate(template.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Allopathic Templates */}
        <TabsContent value="allopathic" className="space-y-4">
          {getFilteredAllopathicTemplates().length === 0 ? (
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
                <Button
                  onClick={() => {
                    setEditingAllopathicTemplate(null)
                    setIsSaveAllopathicModalOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredAllopathicTemplates().map((template) => (
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
                        onClick={() => handlePreviewAllopathicTemplate(template)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button onClick={() => handleEditAllopathicTemplate(template)} variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Template</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{template.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAllopathicTemplate(template.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SaveAyurvedicTemplateModal
        open={isSaveAyurvedicModalOpen}
        onOpenChange={setIsSaveAyurvedicModalOpen}
        editingTemplate={editingAyurvedicTemplate}
        onTemplateChange={() => setEditingAyurvedicTemplate(null)}
      />

      <LoadAyurvedicTemplateModal open={isLoadAyurvedicModalOpen} onOpenChange={setIsLoadAyurvedicModalOpen} />

      <SaveAllopathicTemplateModal
        open={isSaveAllopathicModalOpen}
        onOpenChange={setIsSaveAllopathicModalOpen}
        editingTemplate={editingAllopathicTemplate}
        onTemplateChange={() => setEditingAllopathicTemplate(null)}
      />

      <LoadAllopathicTemplateModal open={isLoadAllopathicModalOpen} onOpenChange={setIsLoadAllopathicModalOpen} />

      {selectedAyurvedicTemplate && (
        <AyurvedicTemplatePreviewModal
          open={isAyurvedicPreviewModalOpen}
          onOpenChange={setIsAyurvedicPreviewModalOpen}
          template={selectedAyurvedicTemplate}
        />
      )}

      {selectedAllopathicTemplate && (
        <AllopathicTemplatePreviewModal
          open={isAllopathicPreviewModalOpen}
          onOpenChange={setIsAllopathicPreviewModalOpen}
          template={selectedAllopathicTemplate}
        />
      )}
    </div>
  )
}
