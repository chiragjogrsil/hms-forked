"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Activity, Calendar, Clock, AlertTriangle, Plus, Scissors, Heart, Brain, Eye, Waves } from "lucide-react"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"
import { AddProceduresModal } from "@/components/modals/add-procedures-modal"

// Department-based procedure categories
const procedureCategories = {
  general: [
    {
      id: "general-procedures",
      name: "General Procedures",
      icon: Scissors,
      description: "Minor procedures and general treatments",
    },
    {
      id: "vaccinations",
      name: "Vaccinations",
      icon: Activity,
      description: "Immunizations and preventive vaccines",
    },
  ],
  cardiology: [
    {
      id: "cardiac-procedures",
      name: "Cardiac Procedures",
      icon: Heart,
      description: "Heart-related interventions and treatments",
    },
    {
      id: "cardiac-diagnostics",
      name: "Cardiac Diagnostics",
      icon: Activity,
      description: "ECG, stress tests, and cardiac monitoring",
    },
  ],
  orthopedics: [
    {
      id: "orthopedic-procedures",
      name: "Orthopedic Procedures",
      icon: Scissors,
      description: "Joint injections, arthroscopy, and bone procedures",
    },
    {
      id: "physiotherapy",
      name: "Physiotherapy",
      icon: Waves,
      description: "Physical therapy and rehabilitation programs",
    },
  ],
  neurology: [
    {
      id: "neurological-procedures",
      name: "Neurological Procedures",
      icon: Brain,
      description: "EEG, EMG, and nerve conduction studies",
    },
    {
      id: "neuro-diagnostics",
      name: "Neuro Diagnostics",
      icon: Activity,
      description: "Brain function and neurological assessments",
    },
  ],
  ophthalmology: [
    {
      id: "eye-procedures",
      name: "Eye Procedures",
      icon: Eye,
      description: "Laser treatments, injections, and eye surgeries",
    },
    {
      id: "eye-diagnostics",
      name: "Eye Diagnostics",
      icon: Activity,
      description: "Comprehensive eye examinations and tests",
    },
  ],
  dermatology: [
    {
      id: "dermatological-procedures",
      name: "Dermatological Procedures",
      icon: Scissors,
      description: "Biopsies, laser treatments, and skin procedures",
    },
    {
      id: "cosmetic-procedures",
      name: "Cosmetic Procedures",
      icon: Activity,
      description: "Aesthetic treatments and cosmetic interventions",
    },
  ],
  gynecology: [
    {
      id: "gynecological-procedures",
      name: "Gynecological Procedures",
      icon: Scissors,
      description: "Colposcopy, biopsy, and surgical procedures",
    },
    {
      id: "reproductive-health",
      name: "Reproductive Health",
      icon: Heart,
      description: "Family planning and reproductive procedures",
    },
  ],
  ayurveda: [
    {
      id: "panchkarma",
      name: "Panchkarma Treatments",
      icon: Heart,
      description: "Detoxification and rejuvenation therapies",
    },
    {
      id: "ayurvedic-therapies",
      name: "Ayurvedic Therapies",
      icon: Activity,
      description: "Traditional healing and therapeutic treatments",
    },
  ],
  pediatrics: [
    {
      id: "pediatric-procedures",
      name: "Pediatric Procedures",
      icon: Heart,
      description: "Child-specific medical procedures and treatments",
    },
    {
      id: "pediatric-vaccinations",
      name: "Pediatric Vaccinations",
      icon: Activity,
      description: "Childhood immunization programs",
    },
  ],
  psychiatry: [
    {
      id: "psychiatric-treatments",
      name: "Psychiatric Treatments",
      icon: Brain,
      description: "Therapy sessions, counseling, and interventions",
    },
    {
      id: "mental-health-assessments",
      name: "Mental Health Assessments",
      icon: Activity,
      description: "Psychological evaluations and cognitive tests",
    },
  ],
}

// Mock prescribed procedures data - filtered by department
const getAllPrescribedProcedures = () => [
  {
    id: "prescribed-proc-001",
    procedureId: "ortho-physio-rehab",
    procedureName: "Physiotherapy Rehabilitation",
    department: "orthopedics",
    category: "physiotherapy",
    prescribedBy: "Dr. Anderson",
    prescribedDate: "2024-06-20",
    visitId: "visit-001",
    status: "pending",
    priority: "routine",
    notes: "Post-surgery rehabilitation for left shoulder. Focus on range of motion and strength building.",
    indication: "Left shoulder surgery recovery",
    sessions: 10,
    estimatedDuration: "3 weeks",
  },
  {
    id: "prescribed-proc-002",
    procedureId: "cardio-stress-test",
    procedureName: "Cardiac Stress Test",
    department: "cardiology",
    category: "cardiac-diagnostics",
    prescribedBy: "Dr. Martinez",
    prescribedDate: "2024-06-18",
    visitId: "visit-002",
    status: "pending",
    priority: "urgent",
    notes: "Evaluate cardiac function due to chest pain episodes",
    indication: "Chest pain and shortness of breath",
    sessions: 1,
    estimatedDuration: "1 day",
  },
  {
    id: "prescribed-proc-003",
    procedureId: "derm-phototherapy",
    procedureName: "Phototherapy Treatment",
    department: "dermatology",
    category: "dermatological-procedures",
    prescribedBy: "Dr. Clark",
    prescribedDate: "2024-06-15",
    visitId: "visit-003",
    status: "scheduled",
    priority: "routine",
    scheduledDate: "2024-06-25",
    notes: "UV light therapy for psoriasis treatment",
    indication: "Chronic psoriasis on arms and legs",
    sessions: 8,
    estimatedDuration: "4 weeks",
  },
  {
    id: "prescribed-proc-004",
    procedureId: "panchkarma-basic",
    procedureName: "Basic Panchkarma Package",
    department: "ayurveda",
    category: "panchkarma",
    prescribedBy: "Dr. Ayurveda Specialist",
    prescribedDate: "2024-06-12",
    visitId: "visit-004",
    status: "pending",
    priority: "routine",
    notes: "Detoxification and rejuvenation therapy for chronic fatigue",
    indication: "Chronic fatigue and digestive issues",
    sessions: 7,
    estimatedDuration: "2 weeks",
  },
  {
    id: "prescribed-proc-005",
    procedureId: "neuro-eeg",
    procedureName: "Electroencephalogram (EEG)",
    department: "neurology",
    category: "neurological-procedures",
    prescribedBy: "Dr. Thompson",
    prescribedDate: "2024-06-10",
    visitId: "visit-005",
    status: "pending",
    priority: "urgent",
    notes: "Investigate seizure-like episodes",
    indication: "Suspected seizure activity",
    sessions: 1,
    estimatedDuration: "1 day",
  },
  {
    id: "prescribed-proc-006",
    procedureId: "eye-laser-treatment",
    procedureName: "Laser Eye Treatment",
    department: "ophthalmology",
    category: "eye-procedures",
    prescribedBy: "Dr. Vision",
    prescribedDate: "2024-06-08",
    visitId: "visit-006",
    status: "pending",
    priority: "routine",
    notes: "Laser treatment for retinal condition",
    indication: "Diabetic retinopathy",
    sessions: 2,
    estimatedDuration: "2 weeks",
  },
  {
    id: "prescribed-proc-007",
    procedureId: "general-vaccination",
    procedureName: "Annual Flu Vaccination",
    department: "general",
    category: "vaccinations",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2024-06-05",
    visitId: "visit-007",
    status: "completed",
    priority: "routine",
    notes: "Annual influenza vaccination",
    indication: "Preventive care",
    sessions: 1,
    estimatedDuration: "1 day",
  },
]

interface ProceduresSectionProps {
  patientId?: string
  patientName?: string
  selectedDepartment?: string
}

export function ProceduresSection({ patientId, patientName, selectedDepartment = "general" }: ProceduresSectionProps) {
  const [selectedProcedureCategory, setSelectedProcedureCategory] = useState("")
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showAddProceduresModal, setShowAddProceduresModal] = useState(false)
  const [selectedPrescribedProcedure, setSelectedPrescribedProcedure] = useState<any>(null)

  // Get available procedure categories for selected department
  const availableCategories =
    procedureCategories[selectedDepartment as keyof typeof procedureCategories] || procedureCategories.general

  // Set default category when department changes
  useState(() => {
    if (availableCategories.length > 0) {
      setSelectedProcedureCategory(availableCategories[0].id)
    }
  })

  // Filter procedures by department and category
  const allProcedures = getAllPrescribedProcedures()
  const departmentProcedures = allProcedures.filter((proc) => proc.department === selectedDepartment)
  const filteredProcedures = selectedProcedureCategory
    ? departmentProcedures.filter((proc) => proc.category === selectedProcedureCategory)
    : departmentProcedures

  const getStatusBadge = (status: string, priority?: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            className={`${priority === "urgent" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"} hover:bg-current`}
          >
            {priority === "urgent" ? "Urgent" : "Pending"}
          </Badge>
        )
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      orthopedics: "bg-blue-100 text-blue-800 border-blue-200",
      cardiology: "bg-red-100 text-red-800 border-red-200",
      dermatology: "bg-purple-100 text-purple-800 border-purple-200",
      ayurveda: "bg-green-100 text-green-800 border-green-200",
      neurology: "bg-indigo-100 text-indigo-800 border-indigo-200",
      ophthalmology: "bg-pink-100 text-pink-800 border-pink-200",
      general: "bg-gray-100 text-gray-800 border-gray-200",
      gynecology: "bg-rose-100 text-rose-800 border-rose-200",
      pediatrics: "bg-orange-100 text-orange-800 border-orange-200",
      psychiatry: "bg-violet-100 text-violet-800 border-violet-200",
    }
    return colors[department] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleBookAppointment = (procedure: any) => {
    setSelectedPrescribedProcedure(procedure)
    setShowAppointmentModal(true)
  }

  const handleAppointmentBooked = () => {
    setShowAppointmentModal(false)
    setSelectedPrescribedProcedure(null)
  }

  const handleAddProcedures = () => {
    setShowAddProceduresModal(true)
  }

  const handleProceduresAdded = () => {
    setShowAddProceduresModal(false)
    // In a real app, this would refresh the prescribed procedures list
  }

  return (
    <div className="space-y-6">
      {/* Header with Category Selection and Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold">Procedures & Treatments</h3>
            <p className="text-sm text-muted-foreground">Manage prescribed procedures for {selectedDepartment}</p>
          </div>
          {availableCategories.length > 1 && (
            <div className="flex items-center gap-2">
              <Label htmlFor="category-select" className="text-sm font-medium">
                Category:
              </Label>
              <Select value={selectedProcedureCategory} onValueChange={setSelectedProcedureCategory}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-w-80">
                  {availableCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <SelectItem key={category.id} value={category.id} className="py-3">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{category.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{category.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button onClick={handleAddProcedures} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Procedures
        </Button>
      </div>

      {/* Prescribed Procedures */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Prescribed Procedures</CardTitle>
                <CardDescription>
                  {selectedProcedureCategory
                    ? `${availableCategories.find((c) => c.id === selectedProcedureCategory)?.name || "Selected"} procedures`
                    : `All ${selectedDepartment} procedures`}{" "}
                  that need to be scheduled
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              {filteredProcedures.length} procedures
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProcedures.length > 0 ? (
            <div className="space-y-4">
              {filteredProcedures.map((procedure) => (
                <div key={procedure.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{procedure.procedureName}</h4>
                          <Badge variant="outline" className={getDepartmentColor(procedure.department)}>
                            {procedure.department.charAt(0).toUpperCase() + procedure.department.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Prescribed: {new Date(procedure.prescribedDate).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>By: {procedure.prescribedBy}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Indication:</strong> {procedure.indication}
                        </p>
                        {procedure.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Notes:</strong> {procedure.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-blue-600 mt-2">
                          <span>Sessions: {procedure.sessions}</span>
                          <span>•</span>
                          <span>Duration: {procedure.estimatedDuration}</span>
                        </div>
                        {procedure.scheduledDate && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>Scheduled: {new Date(procedure.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(procedure.status, procedure.priority)}
                      {procedure.status !== "completed" && (
                        <Button size="sm" onClick={() => handleBookAppointment(procedure)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No procedures found for {selectedDepartment}</p>
              <p className="text-sm mt-1">
                {selectedProcedureCategory
                  ? `No ${availableCategories.find((c) => c.id === selectedProcedureCategory)?.name.toLowerCase()} procedures pending`
                  : "No procedures prescribed for this department"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Booking Modal */}
      <AppointmentBookingDialog
        open={showAppointmentModal}
        onOpenChange={setShowAppointmentModal}
        onAppointmentCreated={handleAppointmentBooked}
        prefilledData={{
          appointmentType: "Specialized Procedure",
          serviceDetails: selectedPrescribedProcedure
            ? {
                name: selectedPrescribedProcedure.procedureName,
                notes: selectedPrescribedProcedure.notes,
                prescribedBy: selectedPrescribedProcedure.prescribedBy,
                priority: selectedPrescribedProcedure.priority,
                indication: selectedPrescribedProcedure.indication,
              }
            : undefined,
          department: selectedPrescribedProcedure?.department,
          doctor: selectedPrescribedProcedure?.prescribedBy,
        }}
      />

      {/* Add Procedures Modal */}
      <AddProceduresModal
        isOpen={showAddProceduresModal}
        onClose={() => setShowAddProceduresModal(false)}
        onSuccess={handleProceduresAdded}
        patientId={patientId || ""}
        patientName={patientName || ""}
      />
    </div>
  )
}
