"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
]

const labUnits = [
  { id: 1, name: "mg/dL", description: "Milligrams per deciliter" },
  { id: 2, name: "x10³/μL", description: "Thousands per microliter" },
  { id: 3, name: "IU/L", description: "International units per liter" },
  { id: 4, name: "mmol/L", description: "Millimoles per liter" },
]

const labPackages = [
  { id: 1, name: "Basic Health Checkup", tests: ["Complete Blood Count", "Blood Sugar Fasting", "Urine Routine"] },
  { id: 2, name: "Cardiac Profile", tests: ["Lipid Profile", "ECG", "Troponin"] },
  { id: 3, name: "Diabetes Package", tests: ["Blood Sugar Fasting", "HbA1c", "Urine Sugar"] },
]

const radiologyTests = [
  { id: 1, name: "Chest X-Ray", category: "X-Ray", cost: 300, barCode: "CXR001", preferredLab: "Radiology Dept" },
  { id: 2, name: "CT Scan Head", category: "CT Scan", cost: 2500, barCode: "CTH001", preferredLab: "Radiology Dept" },
  { id: 3, name: "MRI Brain", category: "MRI", cost: 5000, barCode: "MRB001", preferredLab: "Radiology Dept" },
]

const radiologyPackages = [
  { id: 1, name: "Basic Imaging", tests: ["Chest X-Ray", "Abdomen X-Ray"] },
  { id: 2, name: "Neurological Package", tests: ["CT Scan Head", "MRI Brain"] },
]

const clinicalNotes = {
  chiefComplaints: [
    { id: 1, value: "Fever" },
    { id: 2, value: "Headache" },
    { id: 3, value: "Chest pain" },
    { id: 4, value: "Shortness of breath" },
  ],
  medicalHistory: [
    { id: 1, value: "Diabetes" },
    { id: 2, value: "Hypertension" },
    { id: 3, value: "Heart disease" },
    { id: 4, value: "Asthma" },
  ],
  investigation: [
    { id: 1, value: "Blood pressure monitoring" },
    { id: 2, value: "ECG" },
    { id: 3, value: "Chest examination" },
    { id: 4, value: "Neurological examination" },
  ],
  observation: [
    { id: 1, value: "Patient appears well" },
    { id: 2, value: "Mild distress" },
    { id: 3, value: "Acute distress" },
    { id: 4, value: "Stable condition" },
  ],
}

const diagnoses = [
  { id: 1, name: "Essential Hypertension", code: "I10" },
  { id: 2, name: "Type 2 Diabetes", code: "E11" },
  { id: 3, name: "Acute Bronchitis", code: "J20" },
  { id: 4, name: "Migraine", code: "G43" },
]

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMaster, setSelectedMaster] = useState("lab-tests")

  const MasterTable = ({ title, data, columns, onView, onEdit, onDelete }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Manage {title.toLowerCase()} in the system</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
                <DialogDescription>Enter the details for the new {title.toLowerCase().slice(0, -1)}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {columns.map((column) => (
                  <div key={column.key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={column.key} className="text-right">
                      {column.label}
                    </Label>
                    {column.type === "textarea" ? (
                      <Textarea id={column.key} className="col-span-3" />
                    ) : column.type === "select" ? (
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={`Select ${column.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {column.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id={column.key} className="col-span-3" type={column.type || "text"} />
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
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
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .filter((item) =>
                Object.values(item).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
              )
              .map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onView?.(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete?.(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const labTestColumns = [
    { key: "name", label: "Test Name" },
    { key: "category", label: "Category", render: (value) => <Badge variant="secondary">{value}</Badge> },
    { key: "cost", label: "Cost", render: (value) => `₹${value}` },
    { key: "normalRange", label: "Normal Range" },
    { key: "barCode", label: "Bar Code" },
    { key: "preferredLab", label: "Preferred Lab" },
    { key: "units", label: "Units" },
  ]

  const labUnitColumns = [
    { key: "name", label: "Unit Name" },
    { key: "description", label: "Description" },
  ]

  const labPackageColumns = [
    { key: "name", label: "Package Name" },
    { key: "tests", label: "Tests", render: (tests) => <Badge variant="outline">{tests.length} tests</Badge> },
  ]

  const radiologyTestColumns = [
    { key: "name", label: "Test Name" },
    { key: "category", label: "Category", render: (value) => <Badge variant="secondary">{value}</Badge> },
    { key: "cost", label: "Cost", render: (value) => `₹${value}` },
    { key: "barCode", label: "Bar Code" },
    { key: "preferredLab", label: "Preferred Lab" },
  ]

  const radiologyPackageColumns = [
    { key: "name", label: "Package Name" },
    { key: "tests", label: "Tests", render: (tests) => <Badge variant="outline">{tests.length} tests</Badge> },
  ]

  const clinicalNoteColumns = [{ key: "value", label: "Value" }]

  const diagnosisColumns = [
    { key: "name", label: "Diagnosis Name" },
    { key: "code", label: "ICD Code" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system masters and configuration</p>
        </div>
      </div>

      <Tabs value={selectedMaster} onValueChange={setSelectedMaster} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
          <TabsTrigger value="radiology">Radiology</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
        </TabsList>

        <TabsContent value="laboratory" className="space-y-6">
          <Tabs defaultValue="lab-tests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
              <TabsTrigger value="lab-units">Lab Units</TabsTrigger>
              <TabsTrigger value="lab-packages">Lab Packages</TabsTrigger>
            </TabsList>

            <TabsContent value="lab-tests">
              <MasterTable
                title="Lab Tests"
                data={labTests}
                columns={labTestColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>

            <TabsContent value="lab-units">
              <MasterTable
                title="Lab Units"
                data={labUnits}
                columns={labUnitColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>

            <TabsContent value="lab-packages">
              <MasterTable
                title="Lab Packages"
                data={labPackages}
                columns={labPackageColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="radiology" className="space-y-6">
          <Tabs defaultValue="radiology-tests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="radiology-tests">Imaging Tests</TabsTrigger>
              <TabsTrigger value="radiology-packages">Radiology Packages</TabsTrigger>
            </TabsList>

            <TabsContent value="radiology-tests">
              <MasterTable
                title="Imaging Tests"
                data={radiologyTests}
                columns={radiologyTestColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>

            <TabsContent value="radiology-packages">
              <MasterTable
                title="Radiology Packages"
                data={radiologyPackages}
                columns={radiologyPackageColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Tabs defaultValue="chief-complaints" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chief-complaints">Chief Complaints</TabsTrigger>
              <TabsTrigger value="medical-history">Medical History</TabsTrigger>
              <TabsTrigger value="investigation">Investigation</TabsTrigger>
              <TabsTrigger value="observation">Observation</TabsTrigger>
            </TabsList>

            <TabsContent value="chief-complaints">
              <MasterTable
                title="Chief Complaints"
                data={clinicalNotes.chiefComplaints}
                columns={clinicalNoteColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>

            <TabsContent value="medical-history">
              <MasterTable
                title="Medical History"
                data={clinicalNotes.medicalHistory}
                columns={clinicalNoteColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>

            <TabsContent value="investigation">
              <MasterTable
                title="Investigation"
                data={clinicalNotes.investigation}
                columns={clinicalNoteColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>

            <TabsContent value="observation">
              <MasterTable
                title="Observation"
                data={clinicalNotes.observation}
                columns={clinicalNoteColumns}
                onView={(item) => console.log("View", item)}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="diagnosis">
          <MasterTable
            title="Diagnosis"
            data={diagnoses}
            columns={diagnosisColumns}
            onView={(item) => console.log("View", item)}
            onEdit={(item) => console.log("Edit", item)}
            onDelete={(item) => console.log("Delete", item)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
