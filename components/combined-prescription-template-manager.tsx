"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Download, Package } from "lucide-react"
import { SavePrescriptionTemplateModal } from "@/components/modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "@/components/modals/load-prescription-template-modal"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"
import { Badge } from "@/components/ui/badge"

interface CombinedPrescriptionTemplateManagerProps {
  ayurvedicPrescriptions: any[]
  allopathicPrescriptions: any[]
  department: string
  onLoadTemplate: (template: any) => void
  readOnly?: boolean
}

export function CombinedPrescriptionTemplateManager({
  ayurvedicPrescriptions,
  allopathicPrescriptions,
  department,
  onLoadTemplate,
  readOnly = false,
}: CombinedPrescriptionTemplateManagerProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const { saveTemplate, getTemplatesByDepartment } = usePrescriptionTemplates()

  const templates = getTemplatesByDepartment(department)
  const hasPrescriptions = ayurvedicPrescriptions.length > 0 || allopathicPrescriptions.length > 0
  const totalPrescriptions = ayurvedicPrescriptions.length + allopathicPrescriptions.length

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
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-800">Prescription Templates</h4>
          </div>
          {totalPrescriptions > 0 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {totalPrescriptions} total medicines
            </Badge>
          )}
        </div>

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
            {templates.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                {templates.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {hasPrescriptions && (
        <div className="mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Ayurvedic: {ayurvedicPrescriptions.length}</span>
            <span>Allopathic: {allopathicPrescriptions.length}</span>
            <span className="text-purple-600 font-medium">Ready to save as template</span>
          </div>
        </div>
      )}

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
