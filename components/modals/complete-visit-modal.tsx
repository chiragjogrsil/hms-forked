"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, FileText, TestTube, Scan, Stethoscope, CheckCircle2, Calculator } from "lucide-react"
import { toast } from "sonner"

interface CompleteVisitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName: string
  patientId: string
  department: string
  onComplete: (data: any) => void
}

export function CompleteVisitModal({
  open,
  onOpenChange,
  patientName,
  patientId,
  department,
  onComplete,
}: CompleteVisitModalProps) {
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([])
  const [selectedRadiology, setSelectedRadiology] = useState<string[]>([])
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
  const [followUpDate, setFollowUpDate] = useState("")
  const [followUpTime, setFollowUpTime] = useState("")
  const [followUpNotes, setFollowUpNotes] = useState("")
  const [nextStepsNotes, setNextStepsNotes] = useState("")
  const [urgentTests, setUrgentTests] = useState<string[]>([])

  const labTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel",
    "Lipid Profile",
    "Liver Function Tests",
    "Kidney Function Tests",
    "Thyroid Function Tests",
    "HbA1c",
    "Vitamin D",
    "Vitamin B12",
    "Iron Studies",
    "Inflammatory Markers (ESR, CRP)",
    "Cardiac Enzymes",
  ]

  const radiologyTests = [
    "Chest X-Ray",
    "Abdominal X-Ray",
    "CT Scan - Head",
    "CT Scan - Chest",
    "CT Scan - Abdomen",
    "MRI - Brain",
    "MRI - Spine",
    "Ultrasound - Abdomen",
    "Ultrasound - Pelvis",
    "Echocardiogram",
    "ECG",
    "Stress Test",
  ]

  const procedures = [
    "Endoscopy",
    "Colonoscopy",
    "Biopsy",
    "Minor Surgery",
    "Physiotherapy",
    "Counseling Session",
    "Vaccination",
    "Wound Care",
    "Injection",
    "Dressing Change",
  ]

  const handleTestSelection = (test: string, category: "lab" | "radiology" | "procedures") => {
    const setters = {
      lab: setSelectedLabTests,
      radiology: setSelectedRadiology,
      procedures: setSelectedProcedures,
    }

    const getters = {
      lab: selectedLabTests,
      radiology: selectedRadiology,
      procedures: selectedProcedures,
    }

    const currentSelection = getters[category]
    const setter = setters[category]

    if (currentSelection.includes(test)) {
      setter(currentSelection.filter((t) => t !== test))
    } else {
      setter([...currentSelection, test])
    }
  }

  const handleUrgentTestToggle = (test: string) => {
    if (urgentTests.includes(test)) {
      setUrgentTests(urgentTests.filter((t) => t !== test))
    } else {
      setUrgentTests([...urgentTests, test])
    }
  }

  const calculateEstimatedCost = () => {
    const labCost = selectedLabTests.length * 500 // ₹500 per lab test
    const radiologyCost = selectedRadiology.length * 1500 // ₹1500 per radiology test
    const procedureCost = selectedProcedures.length * 2000 // ₹2000 per procedure
    const urgentCost = urgentTests.length * 200 // ₹200 extra for urgent tests
    return labCost + radiologyCost + procedureCost + urgentCost
  }

  const handleComplete = () => {
    const nextStepsData = {
      labTests: selectedLabTests,
      radiology: selectedRadiology,
      procedures: selectedProcedures,
      followUp: followUpDate
        ? {
            date: new Date(followUpDate),
            time: followUpTime,
            notes: followUpNotes,
          }
        : null,
      nextStepsNotes,
      urgentTests,
      totalCost: calculateEstimatedCost(),
    }

    onComplete(nextStepsData)
    onOpenChange(false)

    // Show success message
    toast.success("Visit completed successfully!", {
      description: `All consultation data has been saved for ${patientName}`,
    })

    // Reset form
    setSelectedLabTests([])
    setSelectedRadiology([])
    setSelectedProcedures([])
    setFollowUpDate("")
    setFollowUpTime("")
    setFollowUpNotes("")
    setNextStepsNotes("")
    setUrgentTests([])
  }

  const totalSelectedTests = selectedLabTests.length + selectedRadiology.length + selectedProcedures.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Complete Visit - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800">Visit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-medium">Patient:</span>
                  <p className="font-semibold">{patientName}</p>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Department:</span>
                  <p className="font-semibold capitalize">{department}</p>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Date:</span>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-green-600 font-medium">Time:</span>
                  <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lab Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TestTube className="h-4 w-4 text-blue-600" />
                  Lab Tests
                  {selectedLabTests.length > 0 && <Badge variant="secondary">{selectedLabTests.length}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                {labTests.map((test) => (
                  <div key={test} className="flex items-start space-x-2">
                    <Checkbox
                      id={`lab-${test}`}
                      checked={selectedLabTests.includes(test)}
                      onCheckedChange={() => handleTestSelection(test, "lab")}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`lab-${test}`} className="text-sm cursor-pointer">
                        {test}
                      </Label>
                      {selectedLabTests.includes(test) && (
                        <div className="mt-1">
                          <Checkbox
                            id={`urgent-${test}`}
                            checked={urgentTests.includes(test)}
                            onCheckedChange={() => handleUrgentTestToggle(test)}
                          />
                          <Label htmlFor={`urgent-${test}`} className="text-xs text-orange-600 ml-2">
                            Urgent
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Radiology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scan className="h-4 w-4 text-purple-600" />
                  Radiology
                  {selectedRadiology.length > 0 && <Badge variant="secondary">{selectedRadiology.length}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                {radiologyTests.map((test) => (
                  <div key={test} className="flex items-start space-x-2">
                    <Checkbox
                      id={`radio-${test}`}
                      checked={selectedRadiology.includes(test)}
                      onCheckedChange={() => handleTestSelection(test, "radiology")}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`radio-${test}`} className="text-sm cursor-pointer">
                        {test}
                      </Label>
                      {selectedRadiology.includes(test) && (
                        <div className="mt-1">
                          <Checkbox
                            id={`urgent-radio-${test}`}
                            checked={urgentTests.includes(test)}
                            onCheckedChange={() => handleUrgentTestToggle(test)}
                          />
                          <Label htmlFor={`urgent-radio-${test}`} className="text-xs text-orange-600 ml-2">
                            Urgent
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Procedures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Stethoscope className="h-4 w-4 text-green-600" />
                  Procedures
                  {selectedProcedures.length > 0 && <Badge variant="secondary">{selectedProcedures.length}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                {procedures.map((procedure) => (
                  <div key={procedure} className="flex items-center space-x-2">
                    <Checkbox
                      id={`proc-${procedure}`}
                      checked={selectedProcedures.includes(procedure)}
                      onCheckedChange={() => handleTestSelection(procedure, "procedures")}
                    />
                    <Label htmlFor={`proc-${procedure}`} className="text-sm cursor-pointer">
                      {procedure}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Follow-up Appointment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                Follow-up Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="followUpTime">Preferred Time</Label>
                  <Input
                    id="followUpTime"
                    type="time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="followUpNotes">Follow-up Notes</Label>
                  <Input
                    id="followUpNotes"
                    placeholder="e.g., Review test results"
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-gray-600" />
                Additional Instructions & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any additional instructions for the patient or next steps..."
                value={nextStepsNotes}
                onChange={(e) => setNextStepsNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Cost Estimation */}
          {totalSelectedTests > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-orange-800">
                  <Calculator className="h-4 w-4" />
                  Estimated Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lab Tests ({selectedLabTests.length}):</span>
                    <span>₹{selectedLabTests.length * 500}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Radiology ({selectedRadiology.length}):</span>
                    <span>₹{selectedRadiology.length * 1500}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Procedures ({selectedProcedures.length}):</span>
                    <span>₹{selectedProcedures.length * 2000}</span>
                  </div>
                  {urgentTests.length > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Urgent Processing ({urgentTests.length}):</span>
                      <span>₹{urgentTests.length * 200}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-orange-800">
                    <span>Total Estimated Cost:</span>
                    <span>₹{calculateEstimatedCost()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Visit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
