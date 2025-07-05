"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TestTube, Search, AlertTriangle, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"

// Comprehensive lab tests database
const labTests = [
  // Hematology
  {
    id: "cbc",
    name: "Complete Blood Count",
    category: "Hematology",
    price: 350,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Red blood cells, white blood cells, platelets, hemoglobin",
  },
  {
    id: "esr",
    name: "ESR (Erythrocyte Sedimentation Rate)",
    category: "Hematology",
    price: 200,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Inflammation marker",
  },
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    category: "Hematology",
    price: 150,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Oxygen-carrying protein in blood",
  },
  {
    id: "platelet-count",
    name: "Platelet Count",
    category: "Hematology",
    price: 180,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Blood clotting cells",
  },
  {
    id: "reticulocyte",
    name: "Reticulocyte Count",
    category: "Hematology",
    price: 300,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Young red blood cells",
  },

  // Chemistry
  {
    id: "glucose-fasting",
    name: "Glucose (Fasting)",
    category: "Chemistry",
    price: 120,
    turnaroundTime: "2-4 hours",
    fasting: true,
    description: "Blood sugar levels after fasting",
  },
  {
    id: "glucose-random",
    name: "Glucose (Random)",
    category: "Chemistry",
    price: 100,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Blood sugar levels without fasting",
  },
  {
    id: "creatinine",
    name: "Creatinine",
    category: "Chemistry",
    price: 150,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Kidney function marker",
  },
  {
    id: "urea",
    name: "Urea/BUN",
    category: "Chemistry",
    price: 140,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Kidney function and protein metabolism",
  },
  {
    id: "total-protein",
    name: "Total Protein",
    category: "Chemistry",
    price: 160,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Overall protein levels in blood",
  },
  {
    id: "albumin",
    name: "Albumin",
    category: "Chemistry",
    price: 170,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Main protein made by liver",
  },

  // Lipid Profile
  {
    id: "total-cholesterol",
    name: "Total Cholesterol",
    category: "Lipid Profile",
    price: 200,
    turnaroundTime: "4-6 hours",
    fasting: true,
    description: "Total cholesterol in blood",
  },
  {
    id: "hdl-cholesterol",
    name: "HDL Cholesterol",
    category: "Lipid Profile",
    price: 220,
    turnaroundTime: "4-6 hours",
    fasting: true,
    description: "Good cholesterol",
  },
  {
    id: "ldl-cholesterol",
    name: "LDL Cholesterol",
    category: "Lipid Profile",
    price: 240,
    turnaroundTime: "4-6 hours",
    fasting: true,
    description: "Bad cholesterol",
  },
  {
    id: "triglycerides",
    name: "Triglycerides",
    category: "Lipid Profile",
    price: 200,
    turnaroundTime: "4-6 hours",
    fasting: true,
    description: "Fat levels in blood",
  },
  {
    id: "lipid-profile",
    name: "Complete Lipid Profile",
    category: "Lipid Profile",
    price: 600,
    turnaroundTime: "4-6 hours",
    fasting: true,
    description: "Comprehensive cholesterol and fat analysis",
  },

  // Liver Function
  {
    id: "sgpt-alt",
    name: "SGPT/ALT",
    category: "Liver Function",
    price: 180,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Liver enzyme",
  },
  {
    id: "sgot-ast",
    name: "SGOT/AST",
    category: "Liver Function",
    price: 180,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Liver enzyme",
  },
  {
    id: "bilirubin-total",
    name: "Bilirubin (Total)",
    category: "Liver Function",
    price: 160,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Liver function and red blood cell breakdown",
  },
  {
    id: "bilirubin-direct",
    name: "Bilirubin (Direct)",
    category: "Liver Function",
    price: 170,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Conjugated bilirubin",
  },
  {
    id: "alkaline-phosphatase",
    name: "Alkaline Phosphatase",
    category: "Liver Function",
    price: 190,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Liver and bone enzyme",
  },
  {
    id: "lft-complete",
    name: "Liver Function Test (Complete)",
    category: "Liver Function",
    price: 800,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Comprehensive liver function panel",
  },

  // Thyroid Function
  {
    id: "tsh",
    name: "TSH",
    category: "Thyroid Function",
    price: 300,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Thyroid stimulating hormone",
  },
  {
    id: "t3",
    name: "T3 (Total)",
    category: "Thyroid Function",
    price: 280,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Triiodothyronine",
  },
  {
    id: "t4",
    name: "T4 (Total)",
    category: "Thyroid Function",
    price: 280,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Thyroxine",
  },
  {
    id: "free-t3",
    name: "Free T3",
    category: "Thyroid Function",
    price: 350,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Free triiodothyronine",
  },
  {
    id: "free-t4",
    name: "Free T4",
    category: "Thyroid Function",
    price: 350,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Free thyroxine",
  },
  {
    id: "thyroid-profile",
    name: "Thyroid Profile (Complete)",
    category: "Thyroid Function",
    price: 1200,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Comprehensive thyroid function panel",
  },

  // Diabetes
  {
    id: "hba1c",
    name: "HbA1c",
    category: "Diabetes",
    price: 400,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "3-month average blood sugar",
  },
  {
    id: "ogtt",
    name: "OGTT (Oral Glucose Tolerance Test)",
    category: "Diabetes",
    price: 500,
    turnaroundTime: "3 hours",
    fasting: true,
    description: "Glucose tolerance assessment",
  },
  {
    id: "c-peptide",
    name: "C-Peptide",
    category: "Diabetes",
    price: 600,
    turnaroundTime: "6-8 hours",
    fasting: true,
    description: "Insulin production marker",
  },
  {
    id: "insulin-fasting",
    name: "Insulin (Fasting)",
    category: "Diabetes",
    price: 450,
    turnaroundTime: "6-8 hours",
    fasting: true,
    description: "Fasting insulin levels",
  },

  // Cardiac Markers
  {
    id: "troponin-i",
    name: "Troponin I",
    category: "Cardiac Markers",
    price: 800,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Heart attack marker",
  },
  {
    id: "troponin-t",
    name: "Troponin T",
    category: "Cardiac Markers",
    price: 850,
    turnaroundTime: "2-4 hours",
    fasting: false,
    description: "Heart attack marker",
  },
  {
    id: "ck-mb",
    name: "CK-MB",
    category: "Cardiac Markers",
    price: 400,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Heart muscle enzyme",
  },
  {
    id: "ldh",
    name: "LDH",
    category: "Cardiac Markers",
    price: 250,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Lactate dehydrogenase",
  },

  // Infectious Disease
  {
    id: "hiv",
    name: "HIV (ELISA)",
    category: "Infectious Disease",
    price: 500,
    turnaroundTime: "24 hours",
    fasting: false,
    description: "HIV antibody test",
  },
  {
    id: "hbsag",
    name: "HBsAg",
    category: "Infectious Disease",
    price: 300,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Hepatitis B surface antigen",
  },
  {
    id: "anti-hcv",
    name: "Anti-HCV",
    category: "Infectious Disease",
    price: 400,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Hepatitis C antibody",
  },
  {
    id: "vdrl",
    name: "VDRL",
    category: "Infectious Disease",
    price: 200,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Syphilis screening",
  },
  {
    id: "widal",
    name: "Widal Test",
    category: "Infectious Disease",
    price: 250,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Typhoid fever test",
  },

  // Vitamins & Minerals
  {
    id: "vitamin-d",
    name: "Vitamin D (25-OH)",
    category: "Vitamins & Minerals",
    price: 800,
    turnaroundTime: "24 hours",
    fasting: false,
    description: "Vitamin D deficiency assessment",
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12",
    category: "Vitamins & Minerals",
    price: 600,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "B12 deficiency assessment",
  },
  {
    id: "folate",
    name: "Folate",
    category: "Vitamins & Minerals",
    price: 500,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Folic acid levels",
  },
  {
    id: "iron-studies",
    name: "Iron Studies",
    category: "Vitamins & Minerals",
    price: 700,
    turnaroundTime: "6-8 hours",
    fasting: true,
    description: "Iron, TIBC, ferritin",
  },
  {
    id: "calcium",
    name: "Calcium",
    category: "Vitamins & Minerals",
    price: 150,
    turnaroundTime: "4-6 hours",
    fasting: false,
    description: "Calcium levels in blood",
  },

  // Hormones
  {
    id: "testosterone",
    name: "Testosterone (Total)",
    category: "Hormones",
    price: 600,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Male hormone levels",
  },
  {
    id: "estradiol",
    name: "Estradiol",
    category: "Hormones",
    price: 550,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Female hormone levels",
  },
  {
    id: "prolactin",
    name: "Prolactin",
    category: "Hormones",
    price: 450,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Prolactin hormone",
  },
  {
    id: "cortisol",
    name: "Cortisol",
    category: "Hormones",
    price: 400,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Stress hormone",
  },

  // Tumor Markers
  {
    id: "psa",
    name: "PSA (Prostate Specific Antigen)",
    category: "Tumor Markers",
    price: 700,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Prostate cancer marker",
  },
  {
    id: "cea",
    name: "CEA",
    category: "Tumor Markers",
    price: 800,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Carcinoembryonic antigen",
  },
  {
    id: "ca-125",
    name: "CA 125",
    category: "Tumor Markers",
    price: 900,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Ovarian cancer marker",
  },
  {
    id: "ca-19-9",
    name: "CA 19-9",
    category: "Tumor Markers",
    price: 850,
    turnaroundTime: "6-8 hours",
    fasting: false,
    description: "Pancreatic cancer marker",
  },
]

// Test categories for dropdown
const testCategories = [
  "All Categories",
  "Hematology",
  "Chemistry",
  "Lipid Profile",
  "Liver Function",
  "Thyroid Function",
  "Diabetes",
  "Cardiac Markers",
  "Infectious Disease",
  "Vitamins & Minerals",
  "Hormones",
  "Tumor Markers",
]

interface PrescribeTestsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  patientId: string
  patientName: string
}

export function PrescribeTestsModal({ isOpen, onClose, onSuccess, patientId, patientName }: PrescribeTestsModalProps) {
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchTerm, setSearchTerm] = useState("")
  const [priority, setPriority] = useState("routine")
  const [clinicalNotes, setClinicalNotes] = useState("")

  // Filter tests based on category and search term
  const filteredTests = labTests.filter((test) => {
    const matchesCategory = selectedCategory === "All Categories" || test.category === selectedCategory
    const matchesSearch =
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Group filtered tests by category
  const groupedTests = filteredTests.reduce(
    (acc, test) => {
      if (!acc[test.category]) {
        acc[test.category] = []
      }
      acc[test.category].push(test)
      return acc
    },
    {} as Record<string, typeof labTests>,
  )

  const toggleTest = (testId: string) => {
    setSelectedTests((prev) => (prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]))
  }

  const calculateTotal = () => {
    return selectedTests.reduce((total, testId) => {
      const test = labTests.find((t) => t.id === testId)
      return total + (test?.price || 0)
    }, 0)
  }

  const getSelectedTestsDetails = () => {
    return labTests.filter((test) => selectedTests.includes(test.id))
  }

  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      toast.error("Please select at least one test")
      return
    }

    // Here you would typically send the data to your backend
    console.log({
      patientId,
      patientName,
      selectedTests,
      priority,
      clinicalNotes,
      totalAmount: calculateTotal(),
    })

    toast.success(`${selectedTests.length} test(s) prescribed successfully`, {
      description: `Total amount: ₹${calculateTotal()}`,
    })

    // Reset form
    setSelectedTests([])
    setSelectedCategory("All Categories")
    setSearchTerm("")
    setPriority("routine")
    setClinicalNotes("")

    onSuccess()
  }

  const handleClose = () => {
    setSelectedTests([])
    setSelectedCategory("All Categories")
    setSearchTerm("")
    setPriority("routine")
    setClinicalNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Prescribe Laboratory Tests
          </DialogTitle>
          <DialogDescription>
            Select laboratory tests for {patientName} (ID: {patientId})
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
          {/* Test Selection - 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Tests</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by test name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-64">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {testCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Test List */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {Object.entries(groupedTests).map(([category, tests]) => (
                <div key={category} className="p-4 border-b last:border-b-0">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">{category}</h4>
                  <div className="space-y-2">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        className={`border rounded-lg p-3 transition-colors ${
                          selectedTests.includes(test.id)
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={test.id}
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={() => toggleTest(test.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label htmlFor={test.id} className="cursor-pointer">
                              <div className="font-medium text-sm">{test.name}</div>
                              <div className="text-xs text-gray-600 mt-1">{test.description}</div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>₹{test.price}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{test.turnaroundTime}</span>
                                </div>
                                {test.fasting && (
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                                    <span className="text-orange-600">Fasting Required</span>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredTests.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tests found matching your criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - 1/3 width */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <CardDescription>{selectedTests.length} test(s) selected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTests.length > 0 ? (
                  <>
                    {/* Selected Tests List */}
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {getSelectedTestsDetails().map((test) => (
                        <div key={test.id} className="flex justify-between items-start text-sm p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="font-medium">{test.name}</div>
                            <div className="text-xs text-gray-500">{test.category}</div>
                            {test.fasting && (
                              <Badge variant="outline" className="text-xs mt-1 bg-orange-100 text-orange-800">
                                Fasting Required
                              </Badge>
                            )}
                          </div>
                          <div className="text-right ml-2">
                            <div className="font-medium">₹{test.price}</div>
                            <div className="text-xs text-gray-500">{test.turnaroundTime}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Priority Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="stat">STAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clinical Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Clinical Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Clinical indication, special instructions..."
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span className="text-lg">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No tests selected</p>
                    <p className="text-xs mt-1">Select tests to see summary</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedTests.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Prescribe Tests ({selectedTests.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
