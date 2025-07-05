"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Calendar, User, Stethoscope, Pill, Leaf } from "lucide-react"
import { useState } from "react"

interface LoadConsultationTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (template: any) => void
  department: string
}

// Mock consultation templates data
const mockConsultationTemplates = [
  {
    id: "CT-001",
    name: "Hypertension Follow-up",
    department: "cardiology",
    chiefComplaint: "Follow-up for hypertension management",
    clinicalNotes: "Patient monitoring for blood pressure control. Check medication compliance and side effects.",
    provisionalDiagnosis: ["Essential Hypertension"],
    prescriptions: {
      allopathic: [
        {
          id: "1",
          medicine: "Amlodipine 5mg",
          dosage: "1-0-0",
          timing: "after-food",
          duration: "30",
          quantity: 30,
          instructions: "Take 1 tablet in the morning after food",
        },
      ],
      ayurvedic: [],
    },
    vitals: {
      bloodPressure: "",
      pulse: "",
      weight: "",
    },
    createdBy: "Dr. Sarah Wilson",
    createdAt: "2024-06-20",
    usageCount: 15,
    type: "followup",
  },
  {
    id: "CT-002",
    name: "Diabetes Management",
    department: "general",
    chiefComplaint: "Diabetes mellitus follow-up",
    clinicalNotes: "Regular monitoring of blood glucose levels. Assess HbA1c results and adjust medication as needed.",
    provisionalDiagnosis: ["Type 2 Diabetes Mellitus"],
    prescriptions: {
      allopathic: [
        {
          id: "1",
          medicine: "Metformin 500mg",
          dosage: "1-0-1",
          timing: "after-food",
          duration: "30",
          quantity: 60,
          instructions: "Take 1 tablet morning and evening after food",
        },
      ],
      ayurvedic: [
        {
          id: "1",
          medicine: "Karela Churna",
          dosage: "1 tsp twice daily",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Mix with warm water, take before meals",
          beforeAfterFood: "before",
        },
      ],
    },
    vitals: {
      bloodPressure: "",
      pulse: "",
      weight: "",
      bloodSugar: "",
    },
    createdBy: "Dr. Michael Chen",
    createdAt: "2024-06-18",
    usageCount: 23,
    type: "followup",
  },
  {
    id: "CT-003",
    name: "Digestive Health Assessment",
    department: "ayurveda",
    chiefComplaint: "Digestive issues and gastric problems",
    clinicalNotes:
      "Assess digestive fire (Agni), bowel movements, and dietary habits. Check for Ama (toxins) accumulation.",
    provisionalDiagnosis: ["Agnimandya", "Ama Dosha"],
    prescriptions: {
      allopathic: [],
      ayurvedic: [
        {
          id: "1",
          medicine: "Triphala Churna",
          dosage: "1 tsp twice daily",
          frequency: "Twice daily",
          duration: "21 days",
          instructions: "Mix with warm water, take at bedtime",
          beforeAfterFood: "after",
        },
        {
          id: "2",
          medicine: "Hingvastak Churna",
          dosage: "1/2 tsp with meals",
          frequency: "Three times daily",
          duration: "15 days",
          instructions: "Take with first bite of food",
          beforeAfterFood: "with",
        },
      ],
    },
    vitals: {},
    createdBy: "Dr. Priya Sharma",
    createdAt: "2024-06-15",
    usageCount: 8,
    type: "routine",
  },
  {
    id: "CT-004",
    name: "Eye Examination Routine",
    department: "ophthalmology",
    chiefComplaint: "Routine eye examination",
    clinicalNotes:
      "Comprehensive eye examination including visual acuity, intraocular pressure, and fundus examination.",
    provisionalDiagnosis: ["Routine Eye Examination"],
    prescriptions: {
      allopathic: [
        {
          id: "1",
          medicine: "Artificial Tears",
          dosage: "SOS",
          timing: "anytime",
          duration: "30",
          quantity: 1,
          instructions: "Use as needed for dry eyes",
        },
      ],
      ayurvedic: [],
    },
    vitals: {},
    createdBy: "Dr. Rajesh Kumar",
    createdAt: "2024-06-12",
    usageCount: 12,
    type: "routine",
  },
]

export function LoadConsultationTemplateModal({
  isOpen,
  onClose,
  onLoad,
  department,
}: LoadConsultationTemplateModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")

  // Filter templates based on search and filters
  const filteredTemplates = mockConsultationTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.provisionalDiagnosis.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || template.type === filterType
    const matchesDepartment = filterDepartment === "all" || template.department === filterDepartment

    return matchesSearch && matchesType && matchesDepartment
  })

  const handleLoadTemplate = (template: any) => {
    onLoad(template)
    onClose()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "followup":
        return "bg-blue-100 text-blue-700"
      case "routine":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "cardiology":
        return "bg-red-100 text-red-700"
      case "ayurveda":
        return "bg-green-100 text-green-700"
      case "ophthalmology":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Load Consultation Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates by name, complaint, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="ayurveda">Ayurveda</SelectItem>
                <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates List */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{template.name}</h4>
                                <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                                <Badge className={getDepartmentColor(template.department)}>{template.department}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{template.chiefComplaint}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-muted-foreground mb-1">Diagnosis</div>
                              <div className="space-y-1">
                                {template.provisionalDiagnosis.map((diagnosis, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {diagnosis}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="font-medium text-muted-foreground mb-1">Prescriptions</div>
                              <div className="flex items-center gap-2">
                                {template.prescriptions.allopathic.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Pill className="h-3 w-3 text-blue-600" />
                                    <span className="text-xs">
                                      {template.prescriptions.allopathic.length} Allopathic
                                    </span>
                                  </div>
                                )}
                                {template.prescriptions.ayurvedic.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Leaf className="h-3 w-3 text-green-600" />
                                    <span className="text-xs">{template.prescriptions.ayurvedic.length} Ayurvedic</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="font-medium text-muted-foreground mb-1">Usage</div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {template.createdBy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(template.createdAt).toLocaleDateString()}
                                </span>
                                <span>{template.usageCount} uses</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button onClick={() => handleLoadTemplate(template)} className="ml-4">
                          <Download className="h-4 w-4 mr-2" />
                          Load Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Templates Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== "all" || filterDepartment !== "all"
                      ? "Try adjusting your search criteria"
                      : "No consultation templates available"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
