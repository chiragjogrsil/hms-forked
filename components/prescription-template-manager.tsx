"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, FolderOpen } from "lucide-react"
import { SavePrescriptionTemplateModal } from "@/components/modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "@/components/modals/load-prescription-template-modal"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface PrescriptionTemplateManagerProps {
  allopathicMedicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  ayurvedicMedicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  onLoadTemplate: (allopathicMedicines: any[], ayurvedicMedicines: any[]) => void
  department?: string
}

export function PrescriptionTemplateManager({
  allopathicMedicines,
  ayurvedicMedicines,
  onLoadTemplate,
  department = "General OPD",
}: PrescriptionTemplateManagerProps) {
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [loadModalOpen, setLoadModalOpen] = useState(false)
  const { templates } = usePrescriptionTemplates()

  const totalMedicines = allopathicMedicines.length + ayurvedicMedicines.length
  const hasMedicines = totalMedicines > 0

  const departmentTemplates = templates.filter((t) => t.department === department)

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">Prescription Templates</h3>
          <Badge variant="outline" className="bg-white">
            {departmentTemplates.length} available
          </Badge>
        </div>
        {hasMedicines && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Current prescription:</span>
            {allopathicMedicines.length > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {allopathicMedicines.length} Allopathic
              </Badge>
            )}
            {ayurvedicMedicines.length > 0 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {ayurvedicMedicines.length} Ayurvedic
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLoadModalOpen(true)}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Load Template
        </Button>

        {hasMedicines && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaveModalOpen(true)}
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Template
          </Button>
        )}
      </div>

      <SavePrescriptionTemplateModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        allopathicMedicines={allopathicMedicines}
        ayurvedicMedicines={ayurvedicMedicines}
        department={department}
      />

      <LoadPrescriptionTemplateModal
        open={loadModalOpen}
        onOpenChange={setLoadModalOpen}
        onLoadTemplate={onLoadTemplate}
        department={department}
      />
    </div>
  )
}
