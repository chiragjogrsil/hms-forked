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
  Pill,
  CreditCard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SettingsSubNavigation } from "@/components/settings-sub-navigation"

// Master Categories Configuration
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
    id: "pharmacy",
    name: "Pharmacy",
    icon: Pill,
    description: "Medicine and pharmacy masters",
    color: "text-orange-600",
    subCategories: [
      {
        id: "medicines",
        name: "Medicines",
        description: "Medicine definitions",
        fields: [
          { key: "name", label: "Medicine Name", type: "text", required: true },
          { key: "genericName", label: "Generic Name", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "manufacturer", label: "Manufacturer", type: "text" },
          { key: "strength", label: "Strength", type: "text" },
          { key: "unit", label: "Unit", type: "text" },
        ],
      },
      {
        id: "suppliers",
        name: "Suppliers",
        description: "Medicine suppliers",
        fields: [
          { key: "name", label: "Supplier Name", type: "text", required: true },
          { key: "contact", label: "Contact", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "address", label: "Address", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    icon: CreditCard,
    description: "Billing and payment masters",
    color: "text-yellow-600",
    subCategories: [
      {
        id: "payment-methods",
        name: "Payment Methods",
        description: "Available payment methods",
        fields: [
          { key: "name", label: "Method Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
          { key: "isActive", label: "Active", type: "checkbox" },
        ],
      },
      {
        id: "insurance-providers",
        name: "Insurance Providers",
        description: "Insurance companies",
        fields: [
          { key: "name", label: "Provider Name", type: "text", required: true },
          { key: "contact", label: "Contact", type: "text" },
          { key: "coverage", label: "Coverage %", type: "number" },
        ],
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
  ],
  "lab-units": [
    { id: 1, name: "mg/dL", description: "Milligrams per deciliter" },
    { id: 2, name: "x10³/μL", description: "Thousands per microliter" },
    { id: 3, name: "mIU/L", description: "Milli-international units per liter" },
    { id: 4, name: "g/dL", description: "Grams per deciliter" },
    { id: 5, name: "IU/L", description: "International units per liter" },
  ],
  "lab-packages": [
    { id: 1, name: "Basic Health Checkup", tests: ["Complete Blood Count", "Blood Sugar Fasting", "Lipid Profile"] },
    { id: 2, name: "Diabetes Panel", tests: ["Blood Sugar Fasting", "HbA1c", "Urine Sugar"] },
    { id: 3, name: "Cardiac Profile", tests: ["Lipid Profile", "Troponin", "ECG"] },
    { id: 4, name: "Thyroid Package", tests: ["Thyroid Function Test", "T3", "T4"] },
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
  ],
  "radiology-packages": [
    { id: 1, name: "Basic Imaging", tests: ["Chest X-Ray", "Ultrasound Abdomen"] },
    { id: 2, name: "Neurological Imaging", tests: ["CT Scan Head", "MRI Brain"] },
    { id: 3, name: "Cardiac Imaging", tests: ["Chest X-Ray", "ECG", "Echo"] },
  ],
  "chief-complaints": [
    { id: 1, name: "Fever", category: "General" },
    { id: 2, name: "Headache", category: "Neurological" },
    { id: 3, name: "Chest Pain", category: "Cardiac" },
    { id: 4, name: "Shortness of Breath", category: "Respiratory" },
    { id: 5, name: "Abdominal Pain", category: "Gastrointestinal" },
  ],
  "medical-history": [
    { id: 1, name: "Hypertension", category: "Cardiovascular" },
    { id: 2, name: "Diabetes Mellitus", category: "Endocrine" },
    { id: 3, name: "Asthma", category: "Respiratory" },
    { id: 4, name: "Heart Disease", category: "Cardiovascular" },
    { id: 5, name: "Previous Surgery", category: "Surgical" },
  ],
  investigation: [
    { id: 1, name: "Blood Investigation", category: "Laboratory" },
    { id: 2, name: "ECG", category: "Cardiac" },
    { id: 3, name: "Chest Examination", category: "Physical" },
    { id: 4, name: "Neurological Examination", category: "Physical" },
    { id: 5, name: "Urine Analysis", category: "Laboratory" },
  ],
  observation: [
    { id: 1, name: "Patient appears well", category: "General" },
    { id: 2, name: "Vital signs stable", category: "Vitals" },
    { id: 3, name: "Patient in distress", category: "General" },
    { id: 4, name: "Respiratory distress", category: "Respiratory" },
    { id: 5, name: "Cardiac murmur present", category: "Cardiac" },
  ],
  diagnoses: [
    { id: 1, name: "Essential Hypertension", icdCode: "I10", category: "Cardiovascular" },
    { id: 2, name: "Type 2 Diabetes Mellitus", icdCode: "E11", category: "Endocrine" },
    { id: 3, name: "Acute Upper Respiratory Infection", icdCode: "J06.9", category: "Respiratory" },
    { id: 4, name: "Gastroesophageal Reflux Disease", icdCode: "K21.9", category: "Gastrointestinal" },
    { id: 5, name: "Migraine", icdCode: "G43", category: "Neurological" },
  ],
  medicines: [
    {
      id: 1,
      name: "Paracetamol",
      genericName: "Acetaminophen",
      category: "Analgesic",
      manufacturer: "ABC Pharma",
      strength: "500",
      unit: "mg",
    },
    {
      id: 2,
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      category: "Antibiotic",
      manufacturer: "XYZ Pharma",
      strength: "250",
      unit: "mg",
    },
    {
      id: 3,
      name: "Metformin",
      genericName: "Metformin HCl",
      category: "Antidiabetic",
      manufacturer: "DEF Pharma",
      strength: "500",
      unit: "mg",
    },
  ],
  suppliers: [
    {
      id: 1,
      name: "MedSupply Co.",
      contact: "+91-9876543210",
      email: "contact@medsupply.com",
      address: "123 Medical Street, City",
    },
    {
      id: 2,
      name: "PharmaCorp Ltd.",
      contact: "+91-8765432109",
      email: "info@pharmacorp.com",
      address: "456 Pharma Avenue, City",
    },
  ],
  "payment-methods": [
    { id: 1, name: "Cash", description: "Cash payment", isActive: true },
    { id: 2, name: "Credit Card", description: "Credit card payment", isActive: true },
    { id: 3, name: "Debit Card", description: "Debit card payment", isActive: true },
    { id: 4, name: "UPI", description: "UPI payment", isActive: true },
  ],
  "insurance-providers": [
    { id: 1, name: "Health Insurance Co.", contact: "+91-1234567890", coverage: 80 },
    { id: 2, name: "Medical Care Insurance", contact: "+91-2345678901", coverage: 70 },
    { id: 3, name: "Life & Health Insurance", contact: "+91-3456789012", coverage: 90 },
  ],
}

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("laboratory")
  const [selectedSubCategory, setSelectedSubCategory] = useState("lab-tests")
  const [currentCategory, setCurrentCategory] = useState("")
  const [currentSubCategory, setCurrentSubCategory] = useState("")
  const { toast } = useToast()

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

  const renderFieldValue = (value: any, field: any) => {
    if (field.key === "cost" && typeof value === "number") {
      return `₹${value}`
    }
    if (field.key === "coverage" && typeof value === "number") {
      return `${value}%`
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
    if (typeof value === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
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
      case "checkbox":
        return (
          <div className="col-span-3">
            <input type="checkbox" id={fieldId} className="mr-2" />
            <Label htmlFor={fieldId}>Enable</Label>
          </div>
        )
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {currentCategoryData && <currentCategoryData.icon className={`h-6 w-6 ${currentCategoryData.color}`} />}
            <h1 className="text-3xl font-bold">{currentSubCategoryData?.name}</h1>
          </div>
          <p className="text-muted-foreground">{currentSubCategoryData?.description}</p>
        </div>

        {/* Master Data Table */}
        {currentSubCategoryData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">Manage {currentSubCategoryData.name}</CardTitle>
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
      </div>
    </div>
  )
}
