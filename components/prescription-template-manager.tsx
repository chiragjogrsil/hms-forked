"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, FolderOpen, Pill, Leaf } from "lucide-react"
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
  onLoadTemplate: (template: any) => void
  department: string
}

export function PrescriptionTemplateManager({
  allopathicMedicines,
  ayurvedicMedicines,
  onLoadTemplate,
  department,
}: PrescriptionTemplateManagerProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const { templates } = usePrescriptionTemplates()

  const totalMedicines = allopathicMedicines.length + ayurvedicMedicines.length
  const hasTemplates = templates.length > 0

  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Save className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Prescription Templates</h3>
                  <p className="text-sm text-gray-600">Save and load frequently used medicine combinations</p>
                </div>
              </div>

              {totalMedicines > 0 && (
                <div className="flex items-center gap-2">
                  {allopathicMedicines.length > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Pill className="h-3 w-3 mr-1" />
                      {allopathicMedicines.length} Allopathic
                    </Badge>
                  )}
                  {ayurvedicMedicines.length > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Leaf className="h-3 w-3 mr-1" />
                      {ayurvedicMedicines.length} Ayurvedic
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {totalMedicines > 0 && (
                <Button onClick={() => setShowSaveModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              )}

              <Button onClick={() => setShowLoadModal(true)} variant="outline" size="sm" disabled={!hasTemplates}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Template
                {hasTemplates && (
                  <Badge variant="secondary" className="ml-2">
                    {templates.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </>
  )
}
