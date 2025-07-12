"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Edit, Trash2, Search, TestTube, Microscope, Users, Stethoscope } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample data for masters
const labTests = [
  {
    id: 1,
    name: "Complete Blood Count",
    category: "Hematology",
    cost: 250,
    normalRange: "4.5-11.0 x10³/μL",
    barCode: "CBC001",
    preferredLab: "Central Lab",
    units: "x10³/μL",
  },
  {
    id: 2,
    name: "Blood Sugar Fasting",
    category: "Biochemistry",
    cost: 80,
    normalRange: "70-100 mg/dL",
    barCode: "BSF001",
    preferredLab: "Central Lab",
    units: "mg/dL",
  },
  {
    id: 3,
    name: "Lipid Profile",
    category: "Biochemistry",
    cost: 400,
    normalRange: "Total: <200 mg/dL",
    barCode: "LP001",
    preferredLab: "Central Lab",
    units: "mg/dL",
  },
  {
    id: 4,
    name: "Thyroid Function Test",
    category: "Endocrinology",
    cost: 600,
    normalRange: "TSH: 0.4-4.0 mIU/L",
    barCode: "TFT001",
    preferredLab: "Specialty Lab",
    units: "mIU/L",
  },
]

const labUnits = [
  { id: 1, name: "mg/dL", description: "Milligrams per deciliter" },
  { id: 2, name: "x10³/μL", description: "Thousands per microliter" },
  { id: 3, name: "mIU/L", description: "Milli-international units per liter" },
  { id: 4, name: "g/dL", description: "Grams per deciliter" },
]

const labPackages = [
  { id: 1, name: "Basic Health Checkup", tests: ["Complete Blood Count", "Blood Sugar Fasting", "Lipid Profile"] },
  { id: 2, name: "Diabetes Panel", tests: ["Blood Sugar Fasting", "HbA1c", "Urine Sugar"] },
  { id: 3, name: "Cardiac Profile", tests: ["Lipid Profile", "Troponin", "ECG"] },
]

const radiologyTests = [
  { id: 1, name: "Chest X-Ray", category: "X-Ray", cost: 300, barCode: "CXR001", preferredLab: "Radiology Dept" },
  { id: 2, name: "CT Scan Head", category: "CT Scan", cost: 2500, barCode: "CTH001", preferredLab: "Advanced Imaging" },
  { id: 3, name: "MRI Brain", category: "MRI", cost: 8000, barCode: "MRB001", preferredLab: "Advanced Imaging" },
  {
    id: 4,
    name: "Ultrasound Abdomen",
    category: "Ultrasound",
    cost: 800,
    barCode: "USA001",
    preferredLab: "Radiology Dept",
  },
]

const radiologyPackages = [
  { id: 1, name: "Basic Imaging", tests: ["Chest X-Ray", "Ultrasound Abdomen"] },
  { id: 2, name: "Neurological Imaging", tests: ["CT Scan Head", "MRI Brain"] },
]

const clinicalNotes = {
  chiefComplaints: [
    { id: 1, name: "Fever" },
    { id: 2, name: "Headache" },
    { id: 3, name: "Chest Pain" },
    { id: 4, name: "Shortness of Breath" },
    { id: 5, name: "Abdominal Pain" },
  ],
  medicalHistory: [
    { id: 1, name: "Hypertension" },
    { id: 2, name: "Diabetes Mellitus" },
    { id: 3, name: "Heart Disease" },
    { id: 4, name: "Asthma" },
    { id: 5, name: "Previous Surgery" },
  ],
  investigation: [
    { id: 1, name: "Blood Investigation" },
    { id: 2, name: "Urine Analysis" },
    { id: 3, name: "ECG" },
    { id: 4, name: "Chest X-Ray" },
    { id: 5, name: "CT Scan" },
  ],
  observation: [
    { id: 1, name: "Patient appears well" },
    { id: 2, name: "Patient in distress" },
    { id: 3, name: "Vital signs stable" },
    { id: 4, name: "Respiratory distress" },
    { id: 5, name: "Cardiac murmur present" },
  ],
}

const diagnoses = [
  { id: 1, name: "Essential Hypertension", icdCode: "I10" },
  { id: 2, name: "Type 2 Diabetes Mellitus", icdCode: "E11" },
  { id: 3, name: "Acute Upper Respiratory Infection", icdCode: "J06.9" },
  { id: 4, name: "Gastroesophageal Reflux Disease", icdCode: "K21.9" },
]

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentMaster, setCurrentMaster] = useState("")
  const { toast } = useToast()

  const handleCreate = (masterType: string) => {
    setCurrentMaster(masterType)
    setIsCreateDialogOpen(true)
  }

  const handleEdit = (id: number, masterType: string) => {
    toast({
      title: "Edit Item",
      description: `Editing ${masterType} with ID: ${id}`,
    })
  }

  const handleDelete = (id: number, masterType: string) => {
    toast({
      title: "Delete Item",
      description: `Deleted ${masterType} with ID: ${id}`,
      variant: "destructive",
    })
  }

  const handleView = (id: number, masterType: string) => {
    toast({
      title: "View Item",
      description: `Viewing details for ${masterType} with ID: ${id}`,
    })
  }

  const ActionButtons = ({ id, masterType }: { id: number; masterType: string }) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleView(id, masterType)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleEdit(id, masterType)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(id, masterType)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage master data for your hospital management system</p>
        </div>
      </div>

      <Tabs defaultValue="laboratory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="laboratory" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Laboratory
          </TabsTrigger>
          <TabsTrigger value="radiology" className="flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            Radiology
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Diagnosis
          </TabsTrigger>
        </TabsList>

        {/* Laboratory Tab */}
        <TabsContent value="laboratory">
          <Tabs defaultValue="lab-tests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
              <TabsTrigger value="lab-units">Lab Units</TabsTrigger>
              <TabsTrigger value="lab-packages">Lab Packages</TabsTrigger>
            </TabsList>

            <TabsContent value="lab-tests">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lab Tests</CardTitle>
                      <CardDescription>Manage laboratory test definitions</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Lab Test")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lab Test
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="Search lab tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Normal Range</TableHead>
                        <TableHead>Bar Code</TableHead>
                        <TableHead>Preferred Lab</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{test.category}</Badge>
                          </TableCell>
                          <TableCell>₹{test.cost}</TableCell>
                          <TableCell>{test.normalRange}</TableCell>
                          <TableCell>{test.barCode}</TableCell>
                          <TableCell>{test.preferredLab}</TableCell>
                          <TableCell>{test.units}</TableCell>
                          <TableCell>
                            <ActionButtons id={test.id} masterType="Lab Test" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lab-units">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lab Units</CardTitle>
                      <CardDescription>Manage measurement units for lab tests</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Lab Unit")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lab Unit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labUnits.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">{unit.name}</TableCell>
                          <TableCell>{unit.description}</TableCell>
                          <TableCell>
                            <ActionButtons id={unit.id} masterType="Lab Unit" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lab-packages">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Lab Packages</CardTitle>
                      <CardDescription>Manage lab test packages</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Lab Package")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lab Package
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Tests Included</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">{pkg.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {pkg.tests.map((test, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {test}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <ActionButtons id={pkg.id} masterType="Lab Package" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Radiology Tab */}
        <TabsContent value="radiology">
          <Tabs defaultValue="imaging-tests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="imaging-tests">Imaging Tests</TabsTrigger>
              <TabsTrigger value="radiology-packages">Radiology Packages</TabsTrigger>
            </TabsList>

            <TabsContent value="imaging-tests">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Imaging Tests</CardTitle>
                      <CardDescription>Manage radiology and imaging test definitions</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Imaging Test")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Imaging Test
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Bar Code</TableHead>
                        <TableHead>Preferred Lab</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {radiologyTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{test.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{test.category}</Badge>
                          </TableCell>
                          <TableCell>₹{test.cost}</TableCell>
                          <TableCell>{test.barCode}</TableCell>
                          <TableCell>{test.preferredLab}</TableCell>
                          <TableCell>
                            <ActionButtons id={test.id} masterType="Imaging Test" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="radiology-packages">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Radiology Packages</CardTitle>
                      <CardDescription>Manage radiology test packages</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Radiology Package")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Radiology Package
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Tests Included</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {radiologyPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">{pkg.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {pkg.tests.map((test, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {test}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <ActionButtons id={pkg.id} masterType="Radiology Package" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients">
          <Tabs defaultValue="chief-complaints" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chief-complaints">Chief Complaints</TabsTrigger>
              <TabsTrigger value="medical-history">Medical History</TabsTrigger>
              <TabsTrigger value="investigation">Investigation</TabsTrigger>
              <TabsTrigger value="observation">Observation</TabsTrigger>
            </TabsList>

            <TabsContent value="chief-complaints">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Chief Complaints</CardTitle>
                      <CardDescription>Manage common patient complaints for dropdown selection</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Chief Complaint")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chief Complaint
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicalNotes.chiefComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.name}</TableCell>
                          <TableCell>
                            <ActionButtons id={complaint.id} masterType="Chief Complaint" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical-history">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Medical History</CardTitle>
                      <CardDescription>Manage common medical history items</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Medical History")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medical History
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicalNotes.medicalHistory.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell className="font-medium">{history.name}</TableCell>
                          <TableCell>
                            <ActionButtons id={history.id} masterType="Medical History" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investigation">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Investigation</CardTitle>
                      <CardDescription>Manage investigation procedures and methods</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Investigation")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Investigation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicalNotes.investigation.map((investigation) => (
                        <TableRow key={investigation.id}>
                          <TableCell className="font-medium">{investigation.name}</TableCell>
                          <TableCell>
                            <ActionButtons id={investigation.id} masterType="Investigation" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="observation">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Observation</CardTitle>
                      <CardDescription>Manage clinical observation notes</CardDescription>
                    </div>
                    <Button onClick={() => handleCreate("Observation")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Observation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicalNotes.observation.map((observation) => (
                        <TableRow key={observation.id}>
                          <TableCell className="font-medium">{observation.name}</TableCell>
                          <TableCell>
                            <ActionButtons id={observation.id} masterType="Observation" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Diagnosis</CardTitle>
                  <CardDescription>Manage medical diagnoses with ICD codes</CardDescription>
                </div>
                <Button onClick={() => handleCreate("Diagnosis")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Diagnosis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ICD Code</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diagnoses.map((diagnosis) => (
                    <TableRow key={diagnosis.id}>
                      <TableCell className="font-medium">{diagnosis.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{diagnosis.icdCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <ActionButtons id={diagnosis.id} masterType="Diagnosis" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {currentMaster}</DialogTitle>
            <DialogDescription>Create a new {currentMaster.toLowerCase()} entry.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            {currentMaster.includes("Test") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">
                    Cost
                  </Label>
                  <Input id="cost" type="number" className="col-span-3" />
                </div>
              </>
            )}
            {currentMaster === "Lab Test" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="normalRange" className="text-right">
                    Normal Range
                  </Label>
                  <Input id="normalRange" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="units" className="text-right">
                    Units
                  </Label>
                  <Input id="units" className="col-span-3" />
                </div>
              </>
            )}
            {currentMaster === "Diagnosis" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icdCode" className="text-right">
                  ICD Code
                </Label>
                <Input id="icdCode" className="col-span-3" />
              </div>
            )}
            {currentMaster === "Lab Unit" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" className="col-span-3" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
              Create {currentMaster}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
