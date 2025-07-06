"use client"

import { useState } from "react"
import { Save, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SavePrescriptionTemplateModal } from "@/components/modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "@/components/modals/load-prescription-template-modal"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface PrescriptionTemplateManagerProps {
  ayurvedicPrescriptions: any[]
  allopathicPrescriptions: any[]
  department: string
  onLoadTemplate: (template: any) => void
  readOnly?: boolean
}

export function PrescriptionTemplateManager({
  ayurvedicPrescriptions,
  allopathicPrescriptions,
  department,
  onLoadTemplate,
  readOnly = false,
}: PrescriptionTemplateManagerProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const { getTemplatesByDepartment } = usePrescriptionTemplates()

  const totalMedicines = ayurvedicPrescriptions.length + allopathicPrescriptions.length
  const hasTemplates = getTemplatesByDepartment(department).length > 0

  if (readOnly) return null

  return (
    <div className="flex items-center gap-2">
      {totalMedicines > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveModal(true)}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLoadModal(true)}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Load Template
        {hasTemplates && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {getTemplatesByDepartment(department).length}
          </Badge>
        )}
      </Button>

      <SavePrescriptionTemplateModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        ayurvedicPrescriptions={ayurvedicPrescriptions}
        allopathicPrescriptions={allopathicPrescriptions}
        department={department}
      />

      <LoadPrescriptionTemplateModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        department={department}
        onLoadTemplate={onLoadTemplate}
      />
    </div>
  )
}
