"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, FolderOpen, Pill, Leaf } from "lucide-react"
import { SavePrescriptionTemplateModal } from "./modals/save-prescription-template-modal"
import { LoadPrescriptionTemplateModal } from "./modals/load-prescription-template-modal"

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
  department?: string
}

export function PrescriptionTemplateManager({
  allopathicMedicines = [],
  ayurvedicMedicines = [],
  onLoadTemplate,
  department = "General Medicine",
}: PrescriptionTemplateManagerProps) {
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [loadModalOpen, setLoadModalOpen] = useState(false)

  // Ensure arrays are defined and have length property
  const safeAllopathicMedicines = Array.isArray(allopathicMedicines) ? allopathicMedicines : []
  const safeAyurvedicMedicines = Array.isArray(ayurvedicMedicines) ? ayurvedicMedicines : []

  const totalMedicines = safeAllopathicMedicines.length + safeAyurvedicMedicines.length
  const hasMedicines = totalMedicines > 0

  return (
    <>
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Save className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Prescription Templates</h3>
                  <p className="text-sm text-gray-600">Save and load frequently used medicine combinations</p>
                </div>
              </div>

              {hasMedicines && (
                <div className="flex items-center gap-2">
                  {safeAllopathicMedicines.length > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Pill className="w-3 h-3 mr-1" />
                      {safeAllopathicMedicines.length} Allopathic
                    </Badge>
                  )}
                  {safeAyurvedicMedicines.length > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <Leaf className="w-3 h-3 mr-1" />
                      {safeAyurvedicMedicines.length} Ayurvedic
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
                <FolderOpen className="w-4 h-4 mr-2" />
                Load Template
              </Button>

              {hasMedicines && (
                <Button size="sm" onClick={() => setSaveModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <SavePrescriptionTemplateModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        allopathicMedicines={safeAllopathicMedicines}
        ayurvedicMedicines={safeAyurvedicMedicines}
        department={department}
      />

      <LoadPrescriptionTemplateModal
        open={loadModalOpen}
        onOpenChange={setLoadModalOpen}
        onLoadTemplate={onLoadTemplate}
        department={department}
      />
    </>
  )
}
