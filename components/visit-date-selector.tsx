"use client"

import { useState } from "react"
import { Calendar, AlertCircle, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useConsultation } from "@/contexts/consultation-context"

interface VisitDateSelectorProps {
  patientId: string
  patientName: string
  onDateSelected: (date: string) => void
  onExistingConsultationLoad: (consultation: any) => void
}

export function VisitDateSelector({
  patientId,
  patientName,
  onDateSelected,
  onExistingConsultationLoad,
}: VisitDateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const { hasConsultationForDate, getConsultationForDate, getConsultationsByDate } = useConsultation()

  const existingConsultation = getConsultationForDate(patientId, selectedDate)
  const consultationsForDate = getConsultationsByDate(patientId, selectedDate)

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleCreateNew = () => {
    onDateSelected(selectedDate)
  }

  const handleLoadExisting = () => {
    if (existingConsultation) {
      onExistingConsultationLoad(existingConsultation)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Visit Date
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="font-medium text-slate-800">{patientName}</p>
          <p className="text-sm text-slate-600">Patient ID: {patientId}</p>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="visitDate">Visit Date</Label>
          <Input id="visitDate" type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} />
        </div>

        {/* Existing Consultation Warning/Info */}
        {existingConsultation && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Consultation exists for this date</p>
                <p className="text-xs text-blue-600 mt-1">
                  Created: {new Date(existingConsultation.createdAt!).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">
                  Status: {existingConsultation.status === "completed" ? "Completed" : "Draft"}
                </p>
                {existingConsultation.chiefComplaint && (
                  <p className="text-xs text-blue-600">Chief Complaint: {existingConsultation.chiefComplaint}</p>
                )}
              </div>
              <Badge
                variant="secondary"
                className={
                  existingConsultation.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }
              >
                {existingConsultation.status === "completed" ? "Completed" : "Draft"}
              </Badge>
            </div>
          </div>
        )}

        {/* No Consultation Info */}
        {!existingConsultation && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Plus className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">
              No consultation exists for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {existingConsultation ? (
            <>
              <Button onClick={handleLoadExisting} className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Load Existing Consultation
              </Button>
              <Button onClick={handleCreateNew} variant="outline" className="w-full" disabled>
                <AlertCircle className="h-4 w-4 mr-2" />
                Consultation Already Exists
              </Button>
            </>
          ) : (
            <Button onClick={handleCreateNew} className="w-full bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Consultation
            </Button>
          )}
        </div>

        {/* Visit Date Summary */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Selected Date:</span>
            <span className="font-medium text-slate-800">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-slate-600">Day of Week:</span>
            <span className="font-medium text-slate-800">
              {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
