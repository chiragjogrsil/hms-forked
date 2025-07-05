"use client"

import { useState } from "react"
import { Save, FolderOpen, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SavePrescriptionTemplateModal } from "@/components/modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "@/components/modals/load-prescription-template-modal"
import { useConsultation } from "@/contexts/consultation-context"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { useDoctorContext } from "@/contexts/doctor-context"

export function PrescriptionTemplateManager() {
  const { consultationData } = useConsultation()
  const { searchTemplates } = usePrescriptionTemplates()
  const { selectedDoctor } = useDoctorContext()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const hasPrescriptions = consultationData.prescriptions.length > 0

  const filteredTemplates = searchTemplates(searchQuery, {
    department: departmentFilter === "all" ? undefined : departmentFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  })

  const departments = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "ENT",
    "Ophthalmology",
    "Ayurveda",
    "Endocrinology",
    "Pain Management",
  ]

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShowSaveModal(true)} disabled={!hasPrescriptions} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save as Template
        </Button>

        <Button variant="outline" onClick={() => setShowLoadModal(true)} className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          Load Template
        </Button>
      </div>

      {/* Quick Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="allopathic">Allopathic</SelectItem>
            <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("")
            setDepartmentFilter("all")
            setTypeFilter("all")
          }}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      {/* Quick Template Preview */}
      {(searchQuery || departmentFilter !== "all" || typeFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          Found {filteredTemplates.length} template(s)
          {searchQuery && ` matching "${searchQuery}"`}
          {departmentFilter !== "all" && ` in ${departmentFilter}`}
          {typeFilter !== "all" && ` of type ${typeFilter}`}
        </div>
      )}

      {/* Modals */}
      <SavePrescriptionTemplateModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        prescriptions={consultationData.prescriptions}
        defaultDepartment={selectedDoctor?.department}
      />

      <LoadPrescriptionTemplateModal open={showLoadModal} onOpenChange={setShowLoadModal} />
    </div>
  )
}
