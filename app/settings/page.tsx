"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Edit, Trash2, Plus, Search, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { SettingsSubNavigation } from "@/components/settings-sub-navigation"

// Sample data for each master
const sampleData: Record<string, any[]> = {
  "lab-tests": [
    {
      id: 1,
      name: "Complete Blood Count",
      category: "Hematology",
      cost: 250,
      normalRange: "Male: 4.5-11.0 x10³/μL, Female: 4.0-10.5 x10³/μL",
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
  "allopathic-medicines": [
    {
      id: 1,
      name: "Paracetamol 500mg",
      genericName: "Paracetamol",
      strength: "500mg",
      dosageForm: "Tablet",
      manufacturer: "ABC Pharma",
      category: "Analgesic",
      price: 2.5,
      stockQuantity: 1000,
      expiryDate: "2025-12-31",
      batchNumber: "PCM001",
      minStockLevel: 100,
    },
    {
      id: 2,
      name: "Amoxicillin 500mg",
      genericName: "Amoxicillin",
      strength: "500mg",
      dosageForm: "Capsule",
      manufacturer: "XYZ Pharma",
      category: "Antibiotic",
      price: 8.0,
      stockQuantity: 500,
      expiryDate: "2025-06-30",
      batchNumber: "AMX001",
      minStockLevel: 50,
    },
  ],
  "ayurvedic-medicines": [
    {
      id: 1,
      name: "Triphala Churna",
      sanskritName: "त्रिफला चूर्ण",
      form: "Churna",
      constituents: ["Amalaki", "Bibhitaki", "Haritaki"],
      manufacturer: "Ayur Pharma",
      category: "Digestive",
      price: 150.0,
      stockQuantity: 200,
      expiryDate: "2025-12-31",
      batchNumber: "TRI001",
      minStockLevel: 20,
    },
  ],
  "dosage-patterns": [
    {
      id: 1,
      pattern: "1-0-0",
      description: "Once daily - Morning",
      frequency: 1,
      type: "Both",
      instructions: "Take in the morning",
    },
    {
      id: 2,
      pattern: "1-0-1",
      description: "Twice daily - Morning & Evening",
      frequency: 2,
      type: "Both",
      instructions: "Take morning and evening",
    },
  ],
}

// Predefined options for dropdowns
const labCategories = [
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Immunology",
  "Endocrinology",
  "Cardiology",
  "Nephrology",
  "Hepatology",
  "Oncology",
  "Genetics",
]

const preferredLabs = [
  "Central Lab",
  "Specialty Lab",
  "Advanced Diagnostics",
  "Quick Lab",
  "Premium Diagnostics",
  "City Lab",
  "Metro Lab",
  "Express Lab",
]

const labUnits = [
  "mg/dL",
  "g/dL",
  "mIU/L",
  "IU/L",
  "U/L",
  "x10³/μL",
  "x10⁶/μL",
  "mmol/L",
  "μmol/L",
  "ng/mL",
  "pg/mL",
  "μg/L",
  "%",
  "ratio",
  "index",
]

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("laboratory")
  const [selectedSubCategory, setSelectedSubCategory] = useState("lab-tests")
  const [formData, setFormData] = useState<any>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<string[]>(labCategories)
  const { toast } = useToast()

  const { getAllAyurvedicTemplates, getAllAllopathicTemplates, deleteAyurvedicTemplate, deleteAllopathicTemplate } =
    usePrescriptionTemplates()

  const handleCategoryChange = (categoryId: string, subCategoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(subCategoryId)
  }

  const handleCreate = () => {
    setFormData({})
    setSelectedCategories([])
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

  const generateBarcode = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const barcode = `LAB${timestamp}${random}`
    setFormData({ ...formData, barCode: barcode })
  }

  const handleCategorySelect = (category: string) => {
    if (category === "add-new") {
      setShowNewCategoryInput(true)
      return
    }
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category))
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !availableCategories.includes(newCategory.trim())) {
      const updatedCategories = [...availableCategories, newCategory.trim()]
      setAvailableCategories(updatedCategories)
      setSelectedCategories([...selectedCategories, newCategory.trim()])
      setNewCategory("")
      setShowNewCategoryInput(false)
    }
  }

  const handleFormSubmit = () => {
    // Validate required fields based on subcategory
    const requiredFields = getRequiredFields()
    const missingFields = requiredFields.filter((field) => !formData[field.key]).map((field) => field.label)

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Handle category field for lab tests
    if (selectedSubCategory === "lab-tests" && selectedCategories.length > 0) {
      formData.category = selectedCategories[0] // Use first selected category
    }

    toast({
      title: "Item Created",
      description: `New ${getSubCategoryName()} created successfully`,
    })

    setIsCreateDialogOpen(false)
    setFormData({})
    setSelectedCategories([])
  }

  const getRequiredFields = () => {
    switch (selectedSubCategory) {
      case "lab-tests":
        return [
          { key: "name", label: "Test Name" },
          { key: "cost", label: "Cost" },
        ]
      case "lab-units":
        return [{ key: "name", label: "Unit Name" }]
      case "lab-packages":
        return [{ key: "name", label: "Package Name" }]
      default:
        return []
    }
  }

  const getSubCategoryName = () => {
    switch (selectedSubCategory) {
      case "lab-tests":
        return "Lab Test"
      case "lab-units":
        return "Lab Unit"
      case "lab-packages":
        return "Lab Package"
      default:
        return "Item"
    }
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

  const renderFieldValue = (value: any, fieldKey: string) => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (fieldKey === "cost" || fieldKey === "price") {
      return `₹${value}`
    }
    if (fieldKey === "expiryDate") {
      return new Date(value).toLocaleDateString()
    }
    return value?.toString() || "-"
  }

  const renderLabTestForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Test Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter test name"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-2">
            <Select value="" onValueChange={handleCategorySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="add-new">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <button onClick={() => handleRemoveCategory(category)} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {showNewCategoryInput && (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                />
                <Button size="sm" onClick={handleAddNewCategory}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewCategoryInput(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cost">
            Cost <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost || ""}
            onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
            placeholder="Enter cost"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="units">Units</Label>
          <Select value={formData.units || ""} onValueChange={(value) => setFormData({ ...formData, units: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select units" />
            </SelectTrigger>
            <SelectContent>
              {labUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="normalRange">Normal Range</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Male:</Label>
              <Input
                value={formData.normalRangeMale || ""}
                onChange={(e) => setFormData({ ...formData, normalRangeMale: e.target.value })}
                placeholder="Male range"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Female:</Label>
              <Input
                value={formData.normalRangeFemale || ""}
                onChange={(e) => setFormData({ ...formData, normalRangeFemale: e.target.value })}
                placeholder="Female range"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredLab">Preferred Lab</Label>
          <Select
            value={formData.preferredLab || ""}
            onValueChange={(value) => setFormData({ ...formData, preferredLab: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred lab" />
            </SelectTrigger>
            <SelectContent>
              {preferredLabs.map((lab) => (
                <SelectItem key={lab} value={lab}>
                  {lab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="barCode">Bar Code</Label>
        <div className="flex gap-2">
          <Input
            id="barCode"
            value={formData.barCode || ""}
            onChange={(e) => setFormData({ ...formData, barCode: e.target.value })}
            placeholder="Enter or generate barcode"
          />
          <Button type="button" variant="outline" onClick={generateBarcode}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  )

  const renderGenericForm = () => {
    const fields = getFormFields()
    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                value={formData[field.key] || ""}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            ) : (
              <Input
                id={field.key}
                type={field.type || "text"}
                value={formData[field.key] || ""}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  const getFormFields = () => {
    switch (selectedSubCategory) {
      case "lab-units":
        return [
          { key: "name", label: "Unit Name", required: true },
          { key: "description", label: "Description", type: "textarea" },
        ]
      case "lab-packages":
        return [{ key: "name", label: "Package Name", required: true }]
      default:
        return []
    }
  }

  const renderDataTable = (data: any[]) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {getSubCategoryName().toLowerCase()}s found. Click "Add New" to create one.
        </div>
      )
    }

    const getTableColumns = () => {
      switch (selectedSubCategory) {
        case "lab-tests":
          return [
            { key: "name", label: "Test Name" },
            { key: "category", label: "Category" },
            { key: "cost", label: "Cost" },
            { key: "units", label: "Units" },
          ]
        case "lab-units":
          return [
            { key: "name", label: "Unit Name" },
            { key: "description", label: "Description" },
          ]
        case "lab-packages":
          return [
            { key: "name", label: "Package Name" },
            { key: "tests", label: "Tests" },
          ]
        default:
          return []
      }
    }

    const columns = getTableColumns()

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th key={column.key} className="text-left p-3 font-medium">
                  {column.label}
                </th>
              ))}
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/50">
                {columns.map((column) => (
                  <td key={column.key} className="p-3">
                    {renderFieldValue(item[column.key], column.key)}
                  </td>
                ))}
                <td className="p-3">
                  <ActionButtons id={item.id} masterType={getSubCategoryName()} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const currentData = sampleData[selectedSubCategory] || []

  return (
    <div className="flex h-screen bg-background">
      <SettingsSubNavigation
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{getSubCategoryName()}s</h1>
              <p className="text-sm text-muted-foreground">
                Manage {getSubCategoryName().toLowerCase()}s and their configurations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New {getSubCategoryName()}</DialogTitle>
                  </DialogHeader>
                  {selectedSubCategory === "lab-tests" ? renderLabTestForm() : renderGenericForm()}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleFormSubmit}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSubCategoryName()}s<Badge variant="secondary">{currentData.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>{renderDataTable(currentData)}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
