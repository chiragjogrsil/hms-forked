"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Building, FileText, Bell, Shield, Database, Trash2, Eye, Search, Plus } from "lucide-react"
import { useState } from "react"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { ayurvedicTemplates, allopathicTemplates, deleteAyurvedicTemplate, deleteAllopathicTemplate } =
    usePrescriptionTemplates()

  // Filter templates based on search term
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

  const handleDeleteTemplate = (id: string, type: "ayurvedic" | "allopathic") => {
    if (confirm("Are you sure you want to delete this template?")) {
      if (type === "ayurvedic") {
        deleteAyurvedicTemplate(id)
      } else {
        deleteAllopathicTemplate(id)
      }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your hospital system configuration</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Hospital Information
              </CardTitle>
              <CardDescription>Basic information about your hospital</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospital-name">Hospital Name</Label>
                  <Input id="hospital-name" defaultValue="City General Hospital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital-code">Hospital Code</Label>
                  <Input id="hospital-code" defaultValue="CGH001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Medical Center Drive, Healthcare City" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="info@citygeneralhospital.com" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage doctors, nurses, and staff accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="w-64" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Dr. John Smith</p>
                    <p className="text-sm text-muted-foreground">General Medicine • john.smith@hospital.com</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Cardiology • sarah.johnson@hospital.com</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Department Management
              </CardTitle>
              <CardDescription>Configure hospital departments and specialties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">General Medicine</h3>
                    <p className="text-sm text-muted-foreground mb-2">Primary care and general consultations</p>
                    <Badge variant="outline">5 Doctors</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Cardiology</h3>
                    <p className="text-sm text-muted-foreground mb-2">Heart and cardiovascular care</p>
                    <Badge variant="outline">3 Doctors</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Pediatrics</h3>
                    <p className="text-sm text-muted-foreground mb-2">Children's healthcare</p>
                    <Badge variant="outline">4 Doctors</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Orthopedics</h3>
                    <p className="text-sm text-muted-foreground mb-2">Bone and joint care</p>
                    <Badge variant="outline">2 Doctors</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Prescription Templates
              </CardTitle>
              <CardDescription>Manage saved prescription templates for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="ayurvedic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="ayurvedic">Ayurvedic Templates ({filteredAyurvedicTemplates.length})</TabsTrigger>
                  <TabsTrigger value="allopathic">
                    Allopathic Templates ({filteredAllopathicTemplates.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ayurvedic" className="space-y-4">
                  {filteredAyurvedicTemplates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No Ayurvedic templates found</p>
                      {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAyurvedicTemplates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{template.name}</h3>
                              <Badge variant="outline">{template.department}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Medicines: {template.medicines.length}</p>
                              <p>Pathya: {template.pathya.length} items</p>
                              <p>Apathya: {template.apathya.length} items</p>
                              <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id, "ayurvedic")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="allopathic" className="space-y-4">
                  {filteredAllopathicTemplates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No Allopathic templates found</p>
                      {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredAllopathicTemplates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{template.name}</h3>
                              <Badge variant="outline">{template.department}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Medicines: {template.medicines.length}</p>
                              <p>Dietary Constraints: {template.dietaryConstraints.length} items</p>
                              <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id, "allopathic")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">Send reminders to patients before appointments</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lab Results</p>
                  <p className="text-sm text-muted-foreground">Notify doctors when lab results are available</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical system notifications and updates</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage system security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" className="w-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Minimum 8 characters</p>
                  <p>• At least one uppercase letter</p>
                  <p>• At least one number</p>
                  <p>• At least one special character</p>
                </div>
              </div>
              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Backup
              </CardTitle>
              <CardDescription>Manage system backups and data recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p className="text-sm text-muted-foreground">Today at 2:00 AM</p>
                </div>
                <Badge variant="secondary">Successful</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Frequency</p>
                  <p className="text-sm text-muted-foreground">Daily at 2:00 AM</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <Button>Create Manual Backup</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
