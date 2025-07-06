"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Pill, Download, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface AllopathicPrescriptionProps {
  department: string
  data: any[]
  onChange: (data: any[]) => void
  readOnly?: boolean
}

const getMedicineOptions = (department: string) => {
  switch (department) {
    case "dental":
      return [
        "Amoxicillin 500mg",
        "Metronidazole 400mg",
        "Ibuprofen 400mg",
        "Paracetamol 500mg",
        "Clindamycin 300mg",
        "Azithromycin 500mg",
        "Diclofenac 50mg",
        "Chlorhexidine Mouthwash",
        "Benzocaine Gel",
        "Lidocaine 2%",
      ]
    case "ophthalmology":
      return [
        "Tropicamide Eye Drops",
        "Timolol Eye Drops",
        "Ciprofloxacin Eye Drops",
        "Prednisolone Eye Drops",
        "Artificial Tears",
        "Atropine Eye Drops",
        "Brimonidine Eye Drops",
        "Cyclopentolate Eye Drops",
        "Latanoprost Eye Drops",
        "Tobramycin Eye Drops",
      ]
    default:
      return [
        "Paracetamol 500mg",
        "Ibuprofen 400mg",
        "Amoxicillin 500mg",
        "Azithromycin 500mg",
        "Omeprazole 20mg",
        "Metformin 500mg",
        "Amlodipine 5mg",
        "Atorvastatin 20mg",
        "Cetirizine 10mg",
        "Pantoprazole 40mg",
        "Crocin 650mg",
        "Dolo 650mg",
        "Combiflam",
        "Calpol 500mg",
      ]
  }
}

// Enhanced dosage patterns with clear descriptions
const dosagePatterns = [
  { value: "1-0-0", label: "1-0-0 (Morning only)", description: "Take 1 tablet in the morning" },
  { value: "0-1-0", label: "0-1-0 (Afternoon only)", description: "Take 1 tablet in the afternoon" },
  { value: "0-0-1", label: "0-0-1 (Evening only)", description: "Take 1 tablet in the evening" },
  { value: "1-1-0", label: "1-1-0 (Morning & Afternoon)", description: "Take 1 tablet morning and afternoon" },
  { value: "1-0-1", label: "1-0-1 (Morning & Evening)", description: "Take 1 tablet morning and evening" },
  { value: "0-1-1", label: "0-1-1 (Afternoon & Evening)", description: "Take 1 tablet afternoon and evening" },
  { value: "1-1-1", label: "1-1-1 (Three times daily)", description: "Take 1 tablet three times daily" },
  { value: "2-2-2", label: "2-2-2 (Two tablets, three times)", description: "Take 2 tablets three times daily" },
  { value: "1/2-0-1/2", label: "1/2-0-1/2 (Half tablet, twice)", description: "Take half tablet morning and evening" },
  { value: "2-0-0", label: "2-0-0 (Two in morning)", description: "Take 2 tablets in the morning" },
  { value: "0-0-2", label: "0-0-2 (Two in evening)", description: "Take 2 tablets in the evening" },
  { value: "SOS", label: "SOS (As needed)", description: "Take as needed when symptoms occur" },
]

const timingOptions = [
  { value: "before-food", label: "Before Food" },
  { value: "after-food", label: "After Food" },
  { value: "with-food", label: "With Food" },
  { value: "empty-stomach", label: "Empty Stomach" },
  { value: "anytime", label: "Anytime" },
]

// Enhanced prescription modal with structured inputs
function EnhancedPrescriptionModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
  department = "general",
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
  department?: string
}) {
  const [formData, setFormData] = useState({
    medicine: editData?.medicine || "",
    dosage: editData?.dosage || "",
    timing: editData?.timing || "after-food",
    duration: editData?.duration || "",
    quantity: editData?.quantity || 0,
    instructions: editData?.instructions || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-calculate quantity based on dosage and duration
  const calculateQuantity = (dosage: string, duration: string) => {
    if (!dosage || !duration || dosage === "SOS") return 0

    const durationNum = Number.parseInt(duration) || 0
    if (durationNum <= 0) return 0

    // Parse dosage pattern (e.g., "1-0-1" = 2 tablets per day)
    const dosageParts = dosage.split("-")
    const dailyCount = dosageParts.reduce((sum, part) => {
      const num = Number.parseFloat(part) || 0
      return sum + num
    }, 0)

    return Math.ceil(dailyCount * durationNum)
  }

  const updateField = (field: string, value: any) => {
    const newData = { ...formData, [field]: value }

    // Auto-calculate quantity when dosage or duration changes
    if (field === "dosage" || field === "duration") {
      newData.quantity = calculateQuantity(newData.dosage, newData.duration)
    }

    // Auto-generate instructions
    if (field === "dosage" || field === "timing") {
      const pattern = dosagePatterns.find((p) => p.value === newData.dosage)
      const timing = timingOptions.find((t) => t.value === newData.timing)
      if (pattern && timing) {
        newData.instructions = `${pattern.description} ${timing.label.toLowerCase()}`
      }
    }

    setFormData(newData)

    // Clear errors for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.medicine.trim()) {
      newErrors.medicine = "Medicine name is required"
    }
    if (!formData.dosage) {
      newErrors.dosage = "Dosage pattern is required"
    }
    if (!formData.duration || Number.parseInt(formData.duration) <= 0) {
      newErrors.duration = "Valid duration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} Prescription</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Medicine Name */}
          <div className="col-span-2">
            <Label>Medicine Name *</Label>
            <Select value={formData.medicine} onValueChange={(value) => updateField("medicine", value)}>
              <SelectTrigger className={errors.medicine ? "border-red-500" : ""}>
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                {getMedicineOptions(department).map((medicine) => (
                  <SelectItem key={medicine} value={medicine}>
                    {medicine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.medicine && <p className="text-red-500 text-sm mt-1">{errors.medicine}</p>}
          </div>

          {/* Dosage Pattern */}
          <div>
            <Label>Dosage Pattern *</Label>
            <Select value={formData.dosage} onValueChange={(value) => updateField("dosage", value)}>
              <SelectTrigger className={errors.dosage ? "border-red-500" : ""}>
                <SelectValue placeholder="Select dosage pattern" />
              </SelectTrigger>
              <SelectContent>
                {dosagePatterns.map((pattern) => (
                  <SelectItem key={pattern.value} value={pattern.value}>
                    <div>
                      <div className="font-medium">{pattern.label}</div>
                      <div className="text-xs text-muted-foreground">{pattern.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dosage && <p className="text-red-500 text-sm mt-1">{errors.dosage}</p>}
          </div>

          {/* Timing */}
          <div>
            <Label>Timing</Label>
            <Select value={formData.timing} onValueChange={(value) => updateField("timing", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timingOptions.map((timing) => (
                  <SelectItem key={timing.value} value={timing.value}>
                    {timing.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label>Duration (days) *</Label>
            <Input
              type="number"
              min="1"
              max="365"
              value={formData.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="Enter duration"
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>

          {/* Auto-calculated Quantity */}
          <div>
            <Label>Quantity (Auto-calculated)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" value={formData.quantity} readOnly className="bg-gray-50" />
              {formData.quantity > 0 && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            </div>
          </div>

          {/* Instructions */}
          <div className="col-span-2">
            <Label>Instructions (Auto-generated)</Label>
            <Input
              value={formData.instructions}
              onChange={(e) => updateField("instructions", e.target.value)}
              placeholder="Instructions will be auto-generated"
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{editData ? "Update" : "Add"} Prescription</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AllopathicPrescription({ department, data, onChange, readOnly = false }: AllopathicPrescriptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)
  const [showInitialOptions, setShowInitialOptions] = useState(data.length === 0)
  const { getTemplatesByDepartment } = usePrescriptionTemplates()

  const templates = getTemplatesByDepartment(department)

  const [overallDietaryConstraints, setOverallDietaryConstraints] = useState<string[]>([])
  const [newDietaryConstraint, setNewDietaryConstraint] = useState("")

  const commonDietaryConstraints = [
    "Avoid alcohol",
    "Avoid spicy food",
    "Avoid dairy products",
    "Take with food",
    "Avoid citrus fruits",
    "Drink plenty of water",
    "Avoid caffeine",
    "Light meals only",
    "Avoid smoking",
    "No heavy meals",
    "Avoid cold drinks",
  ]

  const addOverallDietaryConstraint = (constraint: string) => {
    if (constraint.trim() && !overallDietaryConstraints.includes(constraint.trim())) {
      setOverallDietaryConstraints((prev) => [...prev, constraint.trim()])
    }
  }

  const removeOverallDietaryConstraint = (constraint: string) => {
    setOverallDietaryConstraints((prev) => prev.filter((c) => c !== constraint))
  }

  const handleAddPrescription = (prescriptionData: any) => {
    if (editingPrescription) {
      onChange(
        data.map((item) =>
          item.id === editingPrescription.id ? { ...prescriptionData, id: editingPrescription.id } : item,
        ),
      )
    } else {
      const newPrescription = { ...prescriptionData, id: Date.now().toString() }
      onChange([...data, newPrescription])
    }
    setEditingPrescription(null)
    setIsModalOpen(false)
    setShowInitialOptions(false)
  }

  const handleEditPrescription = (prescription: any) => {
    setEditingPrescription(prescription)
    setIsModalOpen(true)
  }

  const handleDeletePrescription = (id: string) => {
    onChange(data.filter((item) => item.id !== id))
  }

  const handleLoadTemplate = (template: any) => {
    onChange(template.allopathicPrescriptions || [])
    setShowInitialOptions(false)
  }

  const openAddModal = () => {
    setEditingPrescription(null)
    setIsModalOpen(true)
    setShowInitialOptions(false)
  }

  const getDepartmentName = () => {
    switch (department) {
      case "dental":
        return "Dental"
      case "ophthalmology":
        return "Ophthalmology"
      default:
        return "Allopathic"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{getDepartmentName()} Prescriptions</h3>
          {data.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {data.length} prescription{data.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {data.length === 0 && showInitialOptions ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-muted-foreground mb-2">No {getDepartmentName()} Prescriptions</h4>
            <p className="text-sm text-muted-foreground mb-6 text-center">Choose how you'd like to start prescribing</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90" disabled={readOnly}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Prescription
              </Button>
              {templates.length > 0 && (
                <Button
                  onClick={() => {
                    if (templates[0]) {
                      handleLoadTemplate(templates[0])
                    }
                  }}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5"
                  disabled={readOnly}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Load from Template
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {data.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Timing</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((prescription, index) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">{prescription.medicine}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{prescription.dosage}</Badge>
                        </TableCell>
                        <TableCell className="capitalize">{prescription.timing?.replace("-", " ")}</TableCell>
                        <TableCell>{prescription.duration} days</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {prescription.quantity}
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {!readOnly && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditPrescription(prescription)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePrescription(prescription.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Overall Dietary Constraints Section */}
          {!readOnly && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <Label className="text-sm font-medium">Overall Dietary Constraints</Label>
                  </div>

                  {/* Common Dietary Constraints */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Quick Add:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {commonDietaryConstraints
                        .filter((item) => !overallDietaryConstraints.includes(item))
                        .map((item) => (
                          <Button
                            key={item}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => addOverallDietaryConstraint(item)}
                          >
                            <Plus className="h-2 w-2 mr-1" />
                            {item}
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* Custom Dietary Constraint Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom dietary constraint"
                      value={newDietaryConstraint}
                      onChange={(e) => setNewDietaryConstraint(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(),
                        addOverallDietaryConstraint(newDietaryConstraint),
                        setNewDietaryConstraint(""))
                      }
                      className="text-sm h-8"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addOverallDietaryConstraint(newDietaryConstraint)
                        setNewDietaryConstraint("")
                      }}
                      size="sm"
                      className="h-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Selected Dietary Constraints */}
                  {overallDietaryConstraints.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Applied to all medicines:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {overallDietaryConstraints.map((item: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item}
                            <button
                              type="button"
                              onClick={() => removeOverallDietaryConstraint(item)}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Prescription Box */}
          {!readOnly && (
            <Card
              className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
              onClick={openAddModal}
            >
              <CardContent className="flex items-center justify-center py-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Add Another {getDepartmentName()} Medicine</span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <EnhancedPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPrescription(null)
        }}
        onSubmit={handleAddPrescription}
        editData={editingPrescription}
        department={department}
      />
    </div>
  )
}
