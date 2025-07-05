"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { ArrowRight, Clock, Stethoscope, FileText, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useVisitWorkflow } from "@/contexts/visit-workflow-context"

interface NewVisitModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  onCreateVisit?: (data: any) => void
}

export function NewVisitModal({ isOpen, onClose, patientId, patientName, onCreateVisit }: NewVisitModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showWorkflow, setShowWorkflow] = useState(false)
  const { startNewVisit } = useVisitWorkflow()
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    department: "",
    doctor: "",
    notes: "",
  })

  const departments = [
    { id: "general-medicine", name: "General Medicine" },
    { id: "cardiology", name: "Cardiology" },
    { id: "orthopedics", name: "Orthopedics" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "ayurveda", name: "Ayurveda" },
    { id: "ophthalmology", name: "Ophthalmology" },
  ]

  const doctors = [
    { id: "dr-sharma", name: "Dr. Sharma", department: "general-medicine" },
    { id: "dr-gupta", name: "Dr. Gupta", department: "cardiology" },
    { id: "dr-patel", name: "Dr. Patel", department: "orthopedics" },
    { id: "dr-singh", name: "Dr. Singh", department: "pediatrics" },
    { id: "dr-kumar", name: "Dr. Kumar", department: "ayurveda" },
    { id: "dr-joshi", name: "Dr. Joshi", department: "ophthalmology" },
  ]

  const workflowSteps = [
    {
      step: 1,
      title: "Record Vital Signs",
      description: "Temperature, BP, pulse, weight",
      icon: Clock,
      estimated: "5 mins",
      color: "bg-orange-100 text-orange-700",
    },
    {
      step: 2,
      title: "Doctor Consultation",
      description: "Clinical examination and diagnosis",
      icon: Stethoscope,
      estimated: "15-30 mins",
      color: "bg-blue-100 text-blue-700",
    },
    {
      step: 3,
      title: "Tests & Treatment",
      description: "Lab tests, prescriptions, procedures",
      icon: FileText,
      estimated: "Variable",
      color: "bg-emerald-100 text-emerald-700",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.chiefComplaint || !formData.department || !formData.doctor) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)

    setTimeout(() => {
      // Start the workflow
      startNewVisit(patientId, {
        ...formData,
        patientName,
        createdAt: new Date().toISOString(),
      })

      onCreateVisit?.(formData)
      toast.success("New visit created successfully")
      setIsSaving(false)
      setShowWorkflow(true)
    }, 1000)
  }

  const handleProceedToVitals = () => {
    onClose()
    // The workflow context will handle moving to vitals step
    toast.info("Ready to record vital signs!")
  }

  const filteredDoctors = doctors.filter((doctor) => !formData.department || doctor.department === formData.department)

  if (showWorkflow) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden border-0 shadow-hospital-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-slate-800 font-bold">Visit Created Successfully</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 font-medium">
              Visit for <span className="font-semibold text-slate-800">{patientName}</span> has been registered and the
              workflow has started. You can now proceed to record vital signs.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-5">
              <Card className="border-slate-200 shadow-hospital bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-800">Visit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Chief Complaint:</span>
                    <span className="text-sm font-semibold text-slate-800">{formData.chiefComplaint}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Department:</span>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium">
                      {departments.find((d) => d.id === formData.department)?.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">Doctor:</span>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-medium">
                      {doctors.find((d) => d.id === formData.doctor)?.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-hospital">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-slate-800">Workflow Started</CardTitle>
                  <CardDescription className="font-medium text-slate-600">
                    The visit workflow is now active. Click below to proceed to the next step.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflowSteps.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <div
                          key={step.step}
                          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition-shadow"
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${step.color} font-bold`}
                          >
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <Icon className="h-5 w-5 text-slate-600" />
                              <h4 className="font-semibold text-slate-800">{step.title}</h4>
                              <Badge variant="outline" className="text-xs font-medium bg-slate-50">
                                {step.estimated}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 font-medium">{step.description}</p>
                          </div>
                          {index === 0 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                              <ArrowRight className="h-4 w-4 text-blue-700" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DialogFooter className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="font-medium">
              Close
            </Button>
            <Button
              onClick={handleProceedToVitals}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium shadow-hospital"
            >
              Start with Vital Signs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden border-0 shadow-hospital-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">Create New Visit</DialogTitle>
          <DialogDescription className="font-medium text-slate-600">
            Create a new visit record for <span className="font-semibold text-slate-800">{patientName}</span>. This will
            start the patient care workflow.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                  Visit Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-semibold text-slate-700">
                  Visit Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold text-slate-700">
                  Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value, doctor: "" })}
                >
                  <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 font-medium">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="font-medium">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor" className="text-sm font-semibold text-slate-700">
                  Doctor
                </Label>
                <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 font-medium">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id} className="font-medium">
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chiefComplaint" className="text-sm font-semibold text-slate-700">
                Chief Complaint *
              </Label>
              <Input
                id="chiefComplaint"
                placeholder="Patient's main complaint or reason for visit"
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                required
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this visit"
                className="min-h-[100px] border-slate-200 focus:border-blue-400 focus:ring-blue-400 font-medium"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Workflow Preview */}
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-700">
                  What happens after creating this visit?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>Vital Signs</span>
                  <ArrowRight className="h-3 w-3" />
                  <Stethoscope className="h-4 w-4" />
                  <span>Consultation</span>
                  <ArrowRight className="h-3 w-3" />
                  <FileText className="h-4 w-4" />
                  <span>Tests & Treatment</span>
                </div>
              </CardContent>
            </Card>
          </form>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-medium">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium shadow-hospital"
          >
            {isSaving ? "Creating..." : "Create Visit & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
