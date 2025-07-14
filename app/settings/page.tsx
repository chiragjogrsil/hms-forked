"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2, Plus, FileText, Pill } from "lucide-react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { AyurvedicTemplatePreviewModal } from "@/components/modals/ayurvedic-template-preview-modal"
import { AllopathicTemplatePreviewModal } from "@/components/modals/allopathic-template-preview-modal"
import { SettingsSubNavigation } from "@/components/settings-sub-navigation"

export default function SettingsPage() {
  const { ayurvedicTemplates, allopathicTemplates, deleteAyurvedicTemplate, deleteAllopathicTemplate } =
    usePrescriptionTemplates()
  const [searchTerm, setSearchTerm] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [previewType, setPreviewType] = useState<"ayurvedic" | "allopathic" | null>(null)

  const filteredAyurvedicTemplates = ayurvedicTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAllopathicTemplates = allopathicTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePreview = (template: any, type: "ayurvedic" | "allopathic") => {
    setPreviewTemplate(template)
    setPreviewType(type)
  }

  const handleDelete = (templateId: string, type: "ayurvedic" | "allopathic") => {
    if (confirm("Are you sure you want to delete this template?")) {
      if (type === "ayurvedic") {
        deleteAyurvedicTemplate(templateId)
      } else {
        deleteAllopathicTemplate(templateId)
      }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your hospital system settings</p>
        </div>
      </div>

      <SettingsSubNavigation />

      <Tabs defaultValue="prescription-templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="prescription-templates">Prescription Templates</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="prescription-templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prescription Templates
              </CardTitle>
              <CardDescription>
                Manage your saved prescription templates for quick access during consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Tabs defaultValue="ayurvedic" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="ayurvedic" className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Ayurvedic Templates ({filteredAyurvedicTemplates.length})
                    </TabsTrigger>
                    <TabsTrigger value="allopathic" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Allopathic Templates ({filteredAllopathicTemplates.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ayurvedic" className="space-y-4">
                    {filteredAyurvedicTemplates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No Ayurvedic templates found</p>
                        <p className="text-sm">Create templates during consultations to see them here</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAyurvedicTemplates.map((template) => (
                          <Card key={template.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">{template.name}</CardTitle>
                                  <Badge variant="secondary">{template.department}</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Medicines: {template.medicines?.length || 0}</p>
                                <p>Pathya: {template.pathya?.length || 0} items</p>
                                <p>Apathya: {template.apathya?.length || 0} items</p>
                                <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreview(template, "ayurvedic")}
                                  className="flex-1"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(template.id, "ayurvedic")}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="allopathic" className="space-y-4">
                    {filteredAllopathicTemplates.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No Allopathic templates found</p>
                        <p className="text-sm">Create templates during consultations to see them here</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAllopathicTemplates.map((template) => (
                          <Card key={template.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">{template.name}</CardTitle>
                                  <Badge variant="secondary">{template.department}</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Medicines: {template.medicines?.length || 0}</p>
                                <p>Dietary: {template.dietaryConstraints?.length || 0} items</p>
                                <p>Instructions: {template.generalInstructions ? "Yes" : "No"}</p>
                                <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreview(template, "allopathic")}
                                  className="flex-1"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(template.id, "allopathic")}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">General settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {previewTemplate && previewType === "ayurvedic" && (
        <AyurvedicTemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => {
            setPreviewTemplate(null)
            setPreviewType(null)
          }}
        />
      )}

      {previewTemplate && previewType === "allopathic" && (
        <AllopathicTemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => {
            setPreviewTemplate(null)
            setPreviewType(null)
          }}
        />
      )}
    </div>
  )
}
