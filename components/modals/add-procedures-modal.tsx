"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Clock, DollarSign, Users } from "lucide-react"
import { toast } from "sonner"

interface Procedure {
  id: string
  name: string
  department: string
  category: string
  duration: string
  cost: number
  description: string
  requiresAnesthesia: boolean
  sessionCount: number
}

interface AddProceduresModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  onProceduresAdded: (procedures: Procedure[]) => void
}

// Mock procedures data with more examples
const mockProcedures: Procedure[] = [
  // General Medicine
  {
    id: "PROC-001",
    name: "Blood Pressure Monitoring",
    department: "general",
    category: "monitoring",
    duration: "15 min",
    cost: 25,
    description: "Regular blood pressure check and monitoring",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-002",
    name: "Wound Dressing",
    department: "general",
    category: "treatment",
    duration: "20 min",
    cost: 40,
    description: "Professional wound cleaning and dressing",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-003",
    name: "Vaccination - Flu Shot",
    department: "general",
    category: "vaccination",
    duration: "10 min",
    cost: 30,
    description: "Annual influenza vaccination",
    requiresAnesthesia: false,
    sessionCount: 1,
  },

  // Cardiology
  {
    id: "PROC-004",
    name: "ECG (Electrocardiogram)",
    department: "cardiology",
    category: "diagnostic",
    duration: "30 min",
    cost: 80,
    description: "12-lead electrocardiogram for heart rhythm analysis",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-005",
    name: "Echocardiogram",
    department: "cardiology",
    category: "diagnostic",
    duration: "45 min",
    cost: 200,
    description: "Ultrasound examination of the heart",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-006",
    name: "Cardiac Stress Test",
    department: "cardiology",
    category: "diagnostic",
    duration: "60 min",
    cost: 300,
    description: "Exercise stress test to evaluate heart function",
    requiresAnesthesia: false,
    sessionCount: 1,
  },

  // Orthopedics
  {
    id: "PROC-007",
    name: "Joint Injection",
    department: "orthopedics",
    category: "treatment",
    duration: "30 min",
    cost: 150,
    description: "Corticosteroid injection for joint pain relief",
    requiresAnesthesia: true,
    sessionCount: 1,
  },
  {
    id: "PROC-008",
    name: "Physical Therapy Session",
    department: "orthopedics",
    category: "therapy",
    duration: "45 min",
    cost: 75,
    description: "Guided physical therapy and rehabilitation",
    requiresAnesthesia: false,
    sessionCount: 6,
  },
  {
    id: "PROC-009",
    name: "Bone Density Scan",
    department: "orthopedics",
    category: "diagnostic",
    duration: "30 min",
    cost: 120,
    description: "DEXA scan for osteoporosis screening",
    requiresAnesthesia: false,
    sessionCount: 1,
  },

  // Dermatology
  {
    id: "PROC-010",
    name: "Skin Biopsy",
    department: "dermatology",
    category: "diagnostic",
    duration: "20 min",
    cost: 180,
    description: "Tissue sample collection for pathological examination",
    requiresAnesthesia: true,
    sessionCount: 1,
  },
  {
    id: "PROC-011",
    name: "Mole Removal",
    department: "dermatology",
    category: "surgical",
    duration: "30 min",
    cost: 250,
    description: "Surgical removal of benign or suspicious moles",
    requiresAnesthesia: true,
    sessionCount: 1,
  },
  {
    id: "PROC-012",
    name: "Acne Treatment",
    department: "dermatology",
    category: "treatment",
    duration: "25 min",
    cost: 90,
    description: "Professional acne extraction and treatment",
    requiresAnesthesia: false,
    sessionCount: 3,
  },

  // Ophthalmology
  {
    id: "PROC-013",
    name: "Comprehensive Eye Exam",
    department: "ophthalmology",
    category: "diagnostic",
    duration: "45 min",
    cost: 120,
    description: "Complete eye examination including vision and retinal check",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-014",
    name: "Cataract Surgery",
    department: "ophthalmology",
    category: "surgical",
    duration: "60 min",
    cost: 2500,
    description: "Phacoemulsification cataract removal with IOL implantation",
    requiresAnesthesia: true,
    sessionCount: 1,
  },
  {
    id: "PROC-015",
    name: "Glaucoma Screening",
    department: "ophthalmology",
    category: "diagnostic",
    duration: "30 min",
    cost: 85,
    description: "Intraocular pressure measurement and optic nerve assessment",
    requiresAnesthesia: false,
    sessionCount: 1,
  },

  // Gynecology
  {
    id: "PROC-016",
    name: "Pap Smear",
    department: "gynecology",
    category: "screening",
    duration: "15 min",
    cost: 60,
    description: "Cervical cancer screening test",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-017",
    name: "Pelvic Ultrasound",
    department: "gynecology",
    category: "diagnostic",
    duration: "30 min",
    cost: 150,
    description: "Transvaginal or abdominal pelvic ultrasound examination",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-018",
    name: "IUD Insertion",
    department: "gynecology",
    category: "procedure",
    duration: "20 min",
    cost: 300,
    description: "Intrauterine device insertion for contraception",
    requiresAnesthesia: false,
    sessionCount: 1,
  },

  // ENT
  {
    id: "PROC-019",
    name: "Hearing Test",
    department: "ent",
    category: "diagnostic",
    duration: "30 min",
    cost: 75,
    description: "Comprehensive audiological assessment",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-020",
    name: "Nasal Endoscopy",
    department: "ent",
    category: "diagnostic",
    duration: "20 min",
    cost: 120,
    description: "Flexible nasal endoscopy for sinus examination",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-021",
    name: "Tonsillectomy",
    department: "ent",
    category: "surgical",
    duration: "45 min",
    cost: 1200,
    description: "Surgical removal of tonsils",
    requiresAnesthesia: true,
    sessionCount: 1,
  },

  // Dental
  {
    id: "PROC-022",
    name: "Dental Cleaning",
    department: "dental",
    category: "preventive",
    duration: "45 min",
    cost: 80,
    description: "Professional dental cleaning and polishing",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-023",
    name: "Tooth Extraction",
    department: "dental",
    category: "surgical",
    duration: "30 min",
    cost: 150,
    description: "Simple tooth extraction procedure",
    requiresAnesthesia: true,
    sessionCount: 1,
  },
  {
    id: "PROC-024",
    name: "Root Canal Treatment",
    department: "dental",
    category: "treatment",
    duration: "90 min",
    cost: 400,
    description: "Endodontic root canal therapy",
    requiresAnesthesia: true,
    sessionCount: 2,
  },

  // Pediatrics
  {
    id: "PROC-025",
    name: "Child Wellness Check",
    department: "pediatrics",
    category: "checkup",
    duration: "30 min",
    cost: 100,
    description: "Routine pediatric health examination",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-026",
    name: "Childhood Vaccination",
    department: "pediatrics",
    category: "vaccination",
    duration: "15 min",
    cost: 45,
    description: "Age-appropriate childhood immunizations",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-027",
    name: "Growth Assessment",
    department: "pediatrics",
    category: "assessment",
    duration: "20 min",
    cost: 60,
    description: "Height, weight, and developmental milestone assessment",
    requiresAnesthesia: false,
    sessionCount: 1,
  },

  // Psychiatry
  {
    id: "PROC-028",
    name: "Psychiatric Evaluation",
    department: "psychiatry",
    category: "assessment",
    duration: "60 min",
    cost: 200,
    description: "Comprehensive mental health assessment",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
  {
    id: "PROC-029",
    name: "Therapy Session",
    department: "psychiatry",
    category: "therapy",
    duration: "50 min",
    cost: 120,
    description: "Individual psychotherapy session",
    requiresAnesthesia: false,
    sessionCount: 8,
  },
  {
    id: "PROC-030",
    name: "Cognitive Assessment",
    department: "psychiatry",
    category: "assessment",
    duration: "45 min",
    cost: 150,
    description: "Neuropsychological cognitive function testing",
    requiresAnesthesia: false,
    sessionCount: 1,
  },
]

// Department labels
const departmentLabels = {
  general: "General Medicine",
  cardiology: "Cardiology",
  orthopedics: "Orthopedics",
  dermatology: "Dermatology",
  ophthalmology: "Ophthalmology",
  gynecology: "Gynecology",
  ent: "ENT",
  dental: "Dental",
  pediatrics: "Pediatrics",
  psychiatry: "Psychiatry",
  neurology: "Neurology",
  ayurveda: "Ayurveda",
  emergency: "Emergency",
}

export function AddProceduresModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onProceduresAdded,
}: AddProceduresModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedDepartment("all")
      setSelectedProcedures([])
    }
  }, [isOpen])

  // Filter procedures based on search term and department
  const filteredProcedures = mockProcedures.filter((procedure) => {
    const matchesSearch =
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || procedure.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleProcedureToggle = (procedureId: string) => {
    setSelectedProcedures((prev) =>
      prev.includes(procedureId) ? prev.filter((id) => id !== procedureId) : [...prev, procedureId],
    )
  }

  const handleAddProcedures = () => {
    const proceduresToAdd = mockProcedures.filter((p) => selectedProcedures.includes(p.id))
    onProceduresAdded(proceduresToAdd)

    toast.success("Procedures added successfully", {
      description: `${proceduresToAdd.length} procedure(s) added for ${patientName}`,
    })

    onClose()
  }

  const totalCost = selectedProcedures.reduce((sum, id) => {
    const procedure = mockProcedures.find((p) => p.id === id)
    return sum + (procedure?.cost || 0)
  }, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Medical Procedures
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select procedures for {patientName} (ID: {patientId})
          </p>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search and Filter Section */}
          <div className="p-6 pb-4 border-b bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="department-filter" className="text-sm font-medium whitespace-nowrap">
                  Department:
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {Object.entries(departmentLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Procedures List */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {filteredProcedures.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">No procedures found</div>
                  <div className="text-sm text-gray-500">Try adjusting your search terms or department filter</div>
                </div>
              ) : (
                filteredProcedures.map((procedure) => (
                  <Card key={procedure.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id={procedure.id}
                          checked={selectedProcedures.includes(procedure.id)}
                          onCheckedChange={() => handleProcedureToggle(procedure.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{procedure.name}</h4>
                              <p className="text-sm text-gray-600 mb-3">{procedure.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{procedure.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>${procedure.cost}</span>
                                </div>
                                {procedure.sessionCount > 1 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{procedure.sessionCount} sessions</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {departmentLabels[procedure.department as keyof typeof departmentLabels]}
                              </Badge>
                              <Badge variant="secondary" className="capitalize">
                                {procedure.category}
                              </Badge>
                              {procedure.requiresAnesthesia && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  Anesthesia Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer with Selection Summary and Actions */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{selectedProcedures.length}</span> procedure(s) selected
                </div>
                {selectedProcedures.length > 0 && (
                  <div className="text-sm font-medium text-gray-900">
                    Total Cost: <span className="text-green-600">${totalCost}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProcedures}
                  disabled={selectedProcedures.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Selected Procedures
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
