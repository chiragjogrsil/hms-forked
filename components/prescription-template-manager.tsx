"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { SavePrescriptionTemplateModal } from "@/components/modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "@/components/modals/load-prescription-template-modal"
import { Save, FolderOpen } from "lucide-react"

interface PrescriptionTemplateManagerProps {
  allopathicMedicines: any[]
  ayurvedicMedicines: any[]
  onLoadTemplate: (medicines: { allopathic: any[]; ayurvedic: any[] }) => void
  department?: string
}

export function PrescriptionTemplateManager({
  allopathicMedicines,
  ayurvedicMedicines,
  onLoadTemplate,
  department,
}: PrescriptionTemplateManagerProps) {
  const [showSaveModal, setShowSaveModal] = React.useState(false)
  const [showLoadModal, setShowLoadModal] = React.useState(false)

  const hasMedicines = allopathicMedicines.length > 0 || ayurvedicMedicines.length > 0

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-1">
        <h3 className="font-medium text-sm text-gray-700">Prescription Templates</h3>
        <p className="text-xs text-gray-500">Save frequently used medicine combinations or load existing templates</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setShowLoadModal(true)} className="flex items-center gap-1">
          <FolderOpen className="h-4 w-4" />
          Load Template
        </Button>

        {hasMedicines && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Template
          </Button>
        )}
      </div>

      <SavePrescriptionTemplateModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        allopathicMedicines={allopathicMedicines}
        ayurvedicMedicines={ayurvedicMedicines}
        department={department}
      />

      <LoadPrescriptionTemplateModal
        open={showLoadModal}
        onOpenChange={setShowLoadModal}
        onLoadTemplate={onLoadTemplate}
        department={department}
      />
    </div>
  )
}
