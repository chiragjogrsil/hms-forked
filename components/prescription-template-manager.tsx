"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Download } from "lucide-react"
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
  const { saveTemplate, getTemplatesByDepartment } = usePrescriptionTemplates()

  const templates = getTemplatesByDepartment(department)
  const hasPrescriptions = ayurvedicPrescriptions.length > 0 || allopathicPrescriptions.length > 0

  const handleSaveTemplate = (templateData: any) => {
    saveTemplate(templateData)
    setShowSaveModal(false)
  }

  const handleLoadTemplate = (template: any) => {
    onLoadTemplate(template)
    setShowLoadModal(false)
  }

  if (readOnly) {
    return null
  }

  return (
    <div className="flex gap-2">
      {hasPrescriptions && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveModal(true)}
          className="border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <Save className="h-4 w-4 mr-2" />
          Save as Template
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLoadModal(true)}
        className="border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Load Template
      </Button>

      <SavePrescriptionTemplateModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveTemplate}
        ayurvedicPrescriptions={ayurvedicPrescriptions}
        allopathicPrescriptions={allopathicPrescriptions}
        department={department}
      />

      <LoadPrescriptionTemplateModal
        isOpen={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        onLoad={handleLoadTemplate}
        department={department}
      />
    </div>
  )
}
