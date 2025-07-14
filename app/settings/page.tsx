"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  TestTube,
  Microscope,
  Users,
  Stethoscope,
  Construction,
  Leaf,
  Pill,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SettingsSubNavigation } from "@/components/settings-sub-navigation"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { AyurvedicTemplatePreviewModal } from "@/components/modals/ayurvedic-template-preview-modal"
import { AllopathicTemplatePreviewModal } from "@/components/modals/allopathic-template-preview-modal"

// Master Categories Configuration - Including Prescription Templates
const masterCategories = [
  {
    id: "laboratory",
    name: "Laboratory",
    icon: TestTube,
    description: "Lab tests, units, and packages",
    color: "text-blue-600",
    subCategories: [
      {
        id: "lab-tests",
        name: "Lab Tests",
        description: "Laboratory test definitions",
        fields: [
          { key: "name", label: "Test Name", type: "text", required: true },
          { key: "category", label: "Category", type: "text", required: true },
          { key: "cost", label: "Cost", type: "number", required: true },
          { key: "normalRange", label: "Normal Range", type: "text" },
          { key: "barCode", label: "Bar Code", type: "text" },
          { key: "preferredLab", label: "Preferred Lab", type: "text" },
          { key: "units", label: "Units", type: "text" },
        ],
      },
      {
        id: "lab-units",
        name: "Lab Units",
        description: "Measurement units for lab tests",
        fields: [
          { key: "name", label: "Unit Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        id: "lab-packages",
        name: "Lab Packages",
        description: "Lab test packages",
        fields: [
          { key: "name", label: "Package Name", type: "text", required: true },
          { key: "tests", label: "Tests", type: "multiselect" },
        ],
      },
    ],
  },
  {
    id: "radiology",
    name: "Radiology",
    icon: Microscope,
    description: "Imaging tests and packages",
    color: "text-green-600",
    subCategories: [
      {
        id: "imaging-tests",
        name: "Imaging Tests",
        description: "Radiology and imaging test definitions",
        fields: [
          { key: "name", label: "Test Name", type: "text", required: true },
          { key: "category", label: "Category", type: "text", required: true },
          { key: "cost", label: "Cost", type: "number", required: true },
          { key: "barCode", label: "Bar Code", type: "text" },
          { key: "preferredLab", label: "Preferred Lab", type: "text" },
        ],
      },
      {
        id: "radiology-packages",
        name: "Radiology Packages",
        description: "Radiology test packages",
        fields: [
          { key: "name", label: "Package Name", type: "text", required: true },
          { key: "tests", label: "Tests", type: "multiselect" },
        ],
      },
    ],
  },
  {
    id: "clinical",
    name: "Clinical Notes",
    icon: Users,
    description: "Patient clinical note templates",
    color: "text-purple-600",
    subCategories: [
      {
        id: "chief-complaints",
        name: "Chief Complaints",
        description: "Common patient complaints",
        fields: [
          { key: "name", label: "Complaint", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
        ],
      },
      {
        id: "medical-history",
        name: "Medical History",
        description: "Medical history items",
        fields: [
          { key: "name", label: "History Item", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
        ],
      },
      {
        id: "investigation",
        name: "Investigation",
        description: "Investigation procedures",
        fields: [
          { key: "name", label: "Investigation", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
        ],
      },
      {
        id: "observation",
        name: "Observation",
        description: "Clinical observations",
        fields: [
          { key: "name", label: "Observation", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
        ],
      },
    ],
  },
  {
    id: "diagnosis",
    name: "Diagnosis",
    icon: Stethoscope,
    description: "Medical diagnoses and ICD codes",
    color: "text-red-600",
    subCategories: [
      {
        id: "diagnoses",
        name: "Diagnoses",
        description: "Medical diagnoses with ICD codes",
        fields: [
          { key: "name", label: "Diagnosis Name", type: "text", required: true },
          { key: "icdCode", label: "ICD Code", type: "text", required: true },
          { key: "category", label: "Category", type: "text" },
        ],
      },
    ],
  },
  {
    id: "prescription-templates",
    name: "Prescription Templates",
    icon: Pill,
    description: "Ayurvedic and Allopathic prescription templates",
    color: "text-indigo-600",
    subCategories: [
      {
        id: "ayurvedic-templates",
        name: "Ayurvedic Templates",
        description: "Ayurvedic prescription templates",
        fields: [],
      },
      {
        id: "allopathic-templates",
        name: "Allopathic Templates",
        description: "Allopathic prescription templates",
        fields: [],
      },
    ],
  },
]

// Sample data for each master
const sampleData = {
  "lab-tests": [
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
    {
      id: 5,
      name: "Liver Function Test",
      category: "Biochemistry",
      cost: 350,
      normalRange: "ALT: 7-56 U/L",
      barCode: "LFT001",
      preferredLab: "Central Lab",
      units: "U/L",
    },
  ],
  "lab-units": [
    { id: 1, name: "mg/dL", description: "Milligrams per deciliter" },
    { id: 2, name: "x10³/μL", description: "Thousands per microliter" },
    { id: 3, name: "mIU/L", description: "Milli-international units per liter" },
    { id: 4, name: "g/dL", description: "Grams per deciliter" },
    { id: 5, name: "IU/L", description: "International units per liter" },
    { id: 6, name: "U/L", description: "Units per liter" },
  ],
  "lab-packages": [
    { id: 1, name: "Basic Health Checkup", tests: ["Complete Blood Count", "Blood Sugar Fasting", "Lipid Profile"] },
    { id: 2, name: "Diabetes Panel", tests: ["Blood Sugar Fasting", "HbA1c", "Urine Sugar"] },
    { id: 3, name: "Cardiac Profile", tests: ["Lipid Profile", "Troponin", "ECG"] },
    { id: 4, name: "Thyroid Package", tests: ["Thyroid Function Test", "T3", "T4"] },
    { id: 5, name: "Liver Package", tests: ["Liver Function Test", "Bilirubin", "Protein"] },
  ],
  "imaging-tests": [
    { id: 1, name: "Chest X-Ray", category: "X-Ray", cost: 300, barCode: "CXR001", preferredLab: "Radiology Dept" },
    {
      id: 2,
      name: "CT Scan Head",
      category: "CT Scan",
      cost: 2500,
      barCode: "CTH001",
      preferredLab: "Advanced Imaging",
    },
    { id: 3, name: "MRI Brain", category: "MRI", cost: 8000, barCode: "MRB001", preferredLab: "Advanced Imaging" },
    {
      id: 4,
      name: "Ultrasound Abdomen",
      category: "Ultrasound",
      cost: 800,
      barCode: "USA001",
      preferredLab: "Radiology Dept",
    },
    {
      id: 5,
      name: "Mammography",
      category: "X-Ray",
      cost: 1200,
      barCode: "MAM001",
      preferredLab: "Women's Imaging",
    },
  ],
  "radiology-packages": [
    { id: 1, name: "Basic Imaging", tests: ["Chest X-Ray", "Ultrasound Abdomen"] },
    { id: 2, name: "Neurological Imaging", tests: ["CT Scan Head", "MRI Brain"] },
    { id: 3, name: "Cardiac Imaging", tests: ["Chest X-Ray", "ECG", "Echo"] },
    { id: 4, name: "Women's Health Imaging", tests: ["Mammography", "Pelvic Ultrasound"] },
  ],
  "chief-complaints": [
    { id: 1, name: "Fever", category: "General" },
    { id: 2, name: "Headache", category: "Neurological" },
    { id: 3, name: "Chest Pain", category: "Cardiac" },
    { id: 4, name: "Shortness of Breath", category: "Respiratory" },
    { id: 5, name: "Abdominal Pain", category: "Gastrointestinal" },
    { id: 6, name: "Back Pain", category: "Musculoskeletal" },
    { id: 7, name: "Dizziness", category: "Neurological" },
    { id: 8, name: "Nausea", category: "Gastrointestinal" },
  ],
  "medical-history": [
    { id: 1, name: "Hypertension", category: "Cardiovascular" },
    { id: 2, name: "Diabetes Mellitus", category: "Endocrine" },
    { id: 3, name: "Asthma", category: "Respiratory" },
    { id: 4, name: "Heart Disease", category: "Cardiovascular" },
    { id: 5, name: "Previous Surgery", category: "Surgical" },
    { id: 6, name: "Allergies", category: "Immunological" },
    { id: 7, name: "Kidney Disease", category: "Renal" },
    { id: 8, name: "Liver Disease", category: "Hepatic" },
  ],
  investigation: [
    { id: 1, name: "Blood Investigation", category: "Laboratory" },
    { id: 2, name: "ECG", category: "Cardiac" },
    { id: 3, name: "Chest Examination", category: "Physical" },
    { id: 4, name: "Neurological Examination", category: "Physical" },
    { id: 5, name: "Urine Analysis", category: "Laboratory" },
    { id: 6, name: "X-Ray", category: "Imaging" },
    { id: 7, name: "Ultrasound", category: "Imaging" },
    { id: 8, name: "Endoscopy", category: "Procedure" },
  ],
  observation: [
    { id: 1, name: "Patient appears well", category: "General" },
    { id: 2, name: "Vital signs stable", category: "Vitals" },
    { id: 3, name: "Patient in distress", category: "General" },
    { id: 4, name: "Respiratory distress", category: "Respiratory" },
    { id: 5, name: "Cardiac murmur present", category: "Cardiac" },
    { id: 6, name: "Abdomen soft and non-tender", category: "Abdominal" },
    { id: 7, name: "Neurologically intact", category: "Neurological" },
    { id: 8, name: "Skin warm and dry", category: "Dermatological" },
  ],
  diagnoses: [
    { id: 1, name: "Essential Hypertension", icdCode: "I10", category: "Cardiovascular" },
    { id: 2, name: "Type 2 Diabetes Mellitus", icdCode: "E11", category: "Endocrine" },
    { id: 3, name: "Acute Upper Respiratory Infection", icdCode: "J06.9", category: "Respiratory" },
    { id: 4, name: "Gastroesophageal Reflux Disease", icdCode: "K21.9", category: "Gastrointestinal" },
    { id: 5, name: "Migraine", icdCode: "G43", category: "Neurological" },
    { id: 6, name: "Osteoarthritis", icdCode: "M19", category: "Musculoskeletal" },
    { id: 7, name: "Anxiety Disorder", icdCode: "F41", category: "Mental Health" },
    { id: 8, name: "Chronic Kidney Disease", icdCode: "N18", category: "Renal" },
  ],
}

// Coming Soon Component for non-implemented sections
function ComingSoonCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Construction className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-4">{description}</p>
        <Badge variant="secondary">Coming Soon</Badge>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("laboratory")
  const [selectedSubCategory, setSelectedSubCategory] = useState("lab-tests")
  const [currentCategory, setCurrentCategory] = useState("")
  const [currentSubCategory, setCurrentSubCategory] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [previewTemplateType, setPreviewTemplateType] = useState<"ayurvedic" | "allopathic">("ayurvedic")
  const { toast } = useToast()

  const { getAllAyurvedicTemplates, getAllAllopathicTemplates, deleteAyurvedicTemplate, deleteAllopathicTemplate } =
    usePrescriptionTemplates()

  const handleCategoryChange = (categoryId: string, subCategoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategoryId)
  }

  const handleCreate = (categoryId: string, subCategoryId: string) => {
    setCurrentCategory(categoryId)
    setCurrentSubCategory(subCategoryId)
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

  const handlePreviewTemplate = (template: any, type: "ayurvedic" | "allopathic") => {
    setPreviewTemplate(template)
    setPreviewTemplateType(type)
  }

  const handleDeleteTemplate = (id: string, type: "ayurvedic" | "allopathic") => {
    if (type === "ayurvedic") {
      deleteAyurvedicTemplate(id)
    } else {
      deleteAllopathicTemplate(id)
    }
    toast({
      title: "Template Deleted",
      description: `${type === "ayurvedic" ? "Ayurvedic" : "Allopathic"} template deleted successfully`,
      variant: "destructive",
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

  const TemplateActionButtons = ({ template, type }: { template: any; type: "ayurvedic" | "allopathic" }) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template, type)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id, type)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const renderFieldValue = (value: any, field: any) => {
    if (field.key === "cost" && typeof value === "number") {
      return `₹${value}`
    }
    if (field.key === "category") {
      return <Badge variant="secondary">{value}</Badge>
    }
    if (field.key === "icdCode") {
      return <Badge variant="outline">{value}</Badge>
    }
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )
    }
    return value
  }

  const renderFormField = (field: any) => {
    const fieldId = `field-${field.key}`

    switch (field.type) {
      case "textarea":
        return <Textarea id={fieldId} className="col-span-3" />
      case "number":
        return <Input id={fieldId} type="number" className="col-span-3" />
      case "email":
        return <Input id={fieldId} type="email" className="col-span-3" />
      case "select":
        return (
          <Select>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return <Input id={fieldId} type="text" className="col-span-3" />
    }
  }

  const getCurrentSubCategory = () => {
    const category = masterCategories.find((cat) => cat.id === currentCategory)
    return category?.subCategories.find((sub) => sub.id === currentSubCategory)
  }

  const currentCategoryData = masterCategories.find((cat) => cat.id === selectedCategory)
  const currentSubCategoryData = currentCategoryData?.subCategories.find((sub) => sub.id === selectedSubCategory)
  const currentData = sampleData[selectedSubCategory as keyof typeof sampleData] || []

  // Check if current selection is implemented
  const isImplementedCategory = ["laboratory", "radiology", "clinical", "diagnosis", "prescription-templates"].includes(
    selectedCategory,
  )

  // Get template data for prescription templates
  const ayurvedicTemplates = getAllAyurvedicTemplates()
  const allopathicTemplates = getAllAllopathicTemplates()

  const renderPrescriptionTemplates = () => {
    if (selectedSubCategory === "ayurvedic-templates") {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Ayurvedic Prescription Templates
                </CardTitle>
                <CardDescription>
                  {ayurvedicTemplates.length} template{ayurvedicTemplates.length !== 1 ? "s" : ""} available
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search ayurvedic templates..."
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
                  <TableHead>Template Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Medicines</TableHead>
                  <TableHead>Pathya</TableHead>
                  <TableHead>Apathya</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ayurvedicTemplates
                  .filter(
                    (template) =>
                      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {template.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.prescriptions?.length || 0}</TableCell>
                      <TableCell>{template.pathya?.length || 0}</TableCell>
                      <TableCell>{template.apathya?.length || 0}</TableCell>
                      <TableCell>{template.createdBy}</TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <TemplateActionButtons template={template} type="ayurvedic" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }

    if (selectedSubCategory === "allopathic-templates") {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Allopathic Prescription Templates
                </CardTitle>
                <CardDescription>
                  {allopathicTemplates.length} template{allopathicTemplates.length !== 1 ? "s" : ""} available
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search allopathic templates..."
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
                  <TableHead>Template Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Medicines</TableHead>
                  <TableHead>Dietary Guidelines</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allopathicTemplates
                  .filter(
                    (template) =>
                      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {template.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.prescriptions?.length || 0}</TableCell>
                      <TableCell>{template.dietaryConstraints?.length || 0}</TableCell>
                      <TableCell>{template.createdBy}</TableCell>
                      <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <TemplateActionButtons template={template} type="allopathic" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Tree Navigation Sidebar */}
      <SettingsSubNavigation
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        {isImplementedCategory ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {currentCategoryData && <currentCategoryData.icon className={`h-6 w-6 ${currentCategoryData.color}`} />}
                <h1 className="text-3xl font-bold">{currentSubCategoryData?.name}</h1>
              </div>
              <p className="text-muted-foreground">{currentSubCategoryData?.description}</p>
            </div>

            {/* Prescription Templates */}
            {selectedCategory === "prescription-templates"
              ? renderPrescriptionTemplates()
              : /* Master Data Table */
                currentSubCategoryData && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Manage {currentSubCategoryData.name}
                          </CardTitle>
                          <CardDescription>
                            {currentData.length} item{currentData.length !== 1 ? "s" : ""} in this category
                          </CardDescription>
                        </div>
                        <Button onClick={() => handleCreate(selectedCategory, selectedSubCategory)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add {currentSubCategoryData.name.slice(0, -1)}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4" />
                        <Input
                          placeholder={`Search ${currentSubCategoryData.name.toLowerCase()}...`}
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
                            {currentSubCategoryData.fields.map((field) => (
                              <TableHead key={field.key}>{field.label}</TableHead>
                            ))}
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentData
                            .filter((item: any) =>
                              Object.values(item).some((value) =>
                                value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
                              ),
                            )
                            .map((item: any) => (
                              <TableRow key={item.id}>
                                {currentSubCategoryData.fields.map((field) => (
                                  <TableCell key={field.key}>{renderFieldValue(item[field.key], field)}</TableCell>
                                ))}
                                <TableCell>
                                  <ActionButtons id={item.id} masterType={currentSubCategoryData.name} />
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

            {/* Dynamic Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New {getCurrentSubCategory()?.name.slice(0, -1)}</DialogTitle>
                  <DialogDescription>
                    Create a new {getCurrentSubCategory()?.name.toLowerCase().slice(0, -1)} entry.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  {getCurrentSubCategory()?.fields.map((field) => (
                    <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`field-${field.key}`} className="text-right">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
                    Create {getCurrentSubCategory()?.name.slice(0, -1)}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          // Coming Soon for non-implemented categories
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Additional settings sections are coming soon</p>
            </div>

            <ComingSoonCard
              title="Feature Under Development"
              description="This settings section is currently being developed and will be available in a future update."
            />
          </div>
        )}
      </div>

      {/* Template Preview Modals */}
      <AyurvedicTemplatePreviewModal
        template={previewTemplateType === "ayurvedic" ? previewTemplate : null}
        isOpen={!!previewTemplate && previewTemplateType === "ayurvedic"}
        onClose={() => setPreviewTemplate(null)}
        onLoad={() => {}}
      />

      <AllopathicTemplatePreviewModal
        template={previewTemplateType === "allopathic" ? previewTemplate : null}
        isOpen={!!previewTemplate && previewTemplateType === "allopathic"}
        onClose={() => setPreviewTemplate(null)}
        onLoad={() => {}}
      />
    </div>
  )
}
