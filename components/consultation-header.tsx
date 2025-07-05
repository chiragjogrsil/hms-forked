"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Stethoscope, Plus, FileText, Save } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"

interface ConsultationHeaderProps {
  patientName: string
  onNewConsultation: () => void
  consultationData?: any
}

export function ConsultationHeader({ patientName, onNewConsultation, consultationData }: ConsultationHeaderProps) {
  const { activeConsultation, completeConsultation, isConsultationSaved } = useConsultation()

  const handleCompleteConsultation = () => {
    completeConsultation(consultationData)
    toast.success("Consultation saved successfully")
  }

  const handleNewConsultation = () => {
    if (activeConsultation && !isConsultationSaved && consultationData) {
      // Auto-save current consultation before starting new one
      completeConsultation(consultationData)
      toast.success("Previous consultation auto-saved")
    }
    onNewConsultation()
  }

  if (!activeConsultation) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Stethoscope className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">No Active Consultation</h3>
                <p className="text-sm text-orange-700">Start a new consultation for {patientName}</p>
              </div>
            </div>
            <Button onClick={onNewConsultation} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Start Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isConsultationSaved ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2 ${isConsultationSaved ? "bg-green-100" : "bg-blue-100"} rounded-full`}>
              <Stethoscope className={`h-5 w-5 ${isConsultationSaved ? "text-green-600" : "text-blue-600"}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold ${isConsultationSaved ? "text-green-900" : "text-blue-900"}`}>
                  {isConsultationSaved ? "Saved Consultation" : "Active Consultation"}
                </h3>
                <Badge
                  variant="secondary"
                  className={isConsultationSaved ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                >
                  {isConsultationSaved ? "Saved" : "In Progress"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{activeConsultation.doctorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{activeConsultation.time}</span>
                </div>
              </div>
              <p className="text-sm text-blue-600">
                <strong>Chief Complaint:</strong> {activeConsultation.chiefComplaint}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isConsultationSaved ? (
              <Button onClick={handleNewConsultation} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            ) : (
              <>
                <Button onClick={handleCompleteConsultation} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Consultation
                </Button>
                <Button onClick={handleNewConsultation} variant="outline" className="border-blue-300">
                  <FileText className="h-4 w-4 mr-2" />
                  New Consultation
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
