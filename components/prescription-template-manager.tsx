"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Download, Leaf, Pill } from "lucide-react"
import { SaveAyurvedicTemplateModal } from "@/components/modals/save-ayurvedic-template-modal"
import { LoadAyurvedicTemplateModal } from "@/components/modals/load-ayurvedic-template-modal"
import { SaveAllopathicTemplateModal } from "@/components/modals/save-allopathic-template-modal"
import { LoadAllopathicTemplateModal } from "@/components/modals/load-allopathic-template-modal"
import { usePrescriptionTemplates } from "@/contexts/prescription-template-context"

interface PrescriptionTemplateManagerProps {
  type: "ayurvedic" | "allopathic"
  prescriptions: any[]
  department: string
  onLoadTemplate: (template: any) => void
  readOnly?: boolean
  // Additional props for Ayurvedic
  pathya?: string[]
  apathya?: string[]
  // Additional props for Allopathic
  dietaryConstraints?: string[]
}

export function PrescriptionTemplateManager({
  type,
  prescriptions,
  department,
  onLoadTemplate,
  readOnly = false,
  pathya = [],
  apathya = [],
  dietaryConstraints = [],
}: PrescriptionTemplateManagerProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const {
    getAyurvedicTemplatesByDepartment,
    getAllopathicTemplatesByDepartment,
    saveAyurvedicTemplate,
    saveAllopathicTemplate,
  } = usePrescriptionTemplates()

  const templates =
    type === "ayurvedic"
      ? getAyurvedicTemplatesByDepartment(department)
      : getAllopathicTemplatesByDepartment(department)

  const hasPrescriptions = prescriptions.length > 0

  const handleSaveTemplate = (templateData: any) => {
    if (type === "ayurvedic") {
      saveAyurvedicTemplate({
        ...templateData,
        prescriptions,
        pathya,
        apathya,
        department,
        type: "ayurvedic",
        createdBy: "Current Doctor", // This would come from auth context
      })
    } else {
      saveAllopathicTemplate({
        ...templateData,
        prescriptions,
        dietaryConstraints,
        department,
        type: "allopathic",
        createdBy: "Current Doctor", // This would come from auth context
      })
    }
    setShowSaveModal(false)
  }

  if (readOnly) {
    return null
  }

  const getIcon = () => (type === "ayurvedic" ? Leaf : Pill)
  const getColor = () => (type === "ayurvedic" ? "text-green-700" : "text-blue-700")
  const getBorderColor = () => (type === "ayurvedic" ? "border-green-300" : "border-blue-300")
  const getHoverColor = () => (type === "ayurvedic" ? "hover:bg-green-50" : "hover:bg-blue-50")
  const getTypeName = () => (type === "ayurvedic" ? "Ayurvedic" : "Allopathic")

  const Icon = getIcon()

  return (
    <div className="flex gap-2">
      {hasPrescriptions && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveModal(true)}
          className={`border-orange-300 text-orange-700 hover:bg-orange-50`}
        >
          <Save className="h-4 w-4 mr-2" />
          Save as {getTypeName()} Template
        </Button>
      )}

      {templates.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLoadModal(true)}
          className={`${getBorderColor()} ${getColor()} ${getHoverColor()}`}
        >
          <Download className="h-4 w-4 mr-2" />
          <Icon className="h-4 w-4 mr-1" />
          Load {getTypeName()} Template
        </Button>
      )}

      {type === "ayurvedic" ? (
        <>
          <SaveAyurvedicTemplateModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSaveTemplate}
            prescriptions={prescriptions}
            pathya={pathya}
            apathya={apathya}
            department={department}
          />

          <LoadAyurvedicTemplateModal
            isOpen={showLoadModal}
            onClose={() => setShowLoadModal(false)}
            onLoad={onLoadTemplate}
            department={department}
          />
        </>
      ) : (
        <>
          <SaveAllopathicTemplateModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSaveTemplate}
            prescriptions={prescriptions}
            dietaryConstraints={dietaryConstraints}
            department={department}
          />

          <LoadAllopathicTemplateModal
            isOpen={showLoadModal}
            onClose={() => setShowLoadModal(false)}
            onLoad={onLoadTemplate}
            department={department}
          />
        </>
      )}
    </div>
  )
}
