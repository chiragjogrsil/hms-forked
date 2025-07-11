"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TestTube, Zap, CalendarIcon, CheckCircle2, FileText, Activity } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Lab tests data
const labTestCategories = {
  "Blood Tests": [
    { id: "cbc", name: "Complete Blood Count (CBC)", price: 350, urgent: false },
    { id: "lipid", name: "Lipid Profile", price: 400, urgent: false },
    { id: "liver", name: "Liver Function Test", price: 450, urgent: false },
    { id: "kidney", name: "Kidney Function Test", price: 500, urgent: false },
    { id: "thyroid", name: "Thyroid Function Test", price: 600, urgent: false },
    { id: "hba1c", name: "HbA1c (Diabetes)", price: 300, urgent: false },
  ],
  "Urine Tests": [
    { id: "urine-routine", name: "Urine Routine & Microscopy", price: 200, urgent: false },
    { id: "urine-culture", name: "Urine Culture", price: 350, urgent: false },
  ],
  "Specialized Tests": [
    { id: "esr", name: "ESR (Erythrocyte Sedimentation Rate)", price: 150, urgent: false },
    { id: "crp", name: "C-Reactive Protein", price: 250, urgent: false },
    { id: "vitamin-d", name: "Vitamin D", price: 800, urgent: false },
    { id: "vitamin-b12", name: "Vitamin B12", price: 600, urgent: false },
  ],
}

// Radiology services data
const radiologyCategories = {
  "X-Ray": [
    { id: "xray-chest", name: "Chest X-Ray", price: 800, duration: "15 mins" },
    { id: "xray-knee", name: "Knee X-Ray", price: 600, duration: "10 mins" },
    { id: "xray-spine", name: "Spine X-Ray", price: 900, duration: "15 mins" },
    { id: "xray-abdomen", name: "Abdomen X-Ray", price: 700, duration: "10 mins" },
  ],
  "CT Scan": [
    { id: "ct-head", name: "CT Head", price: 3500, duration: "30 mins" },
    { id: "ct-chest", name: "CT Chest", price: 4000, duration: "30 mins" },
    { id: "ct-abdomen", name: "CT Abdomen", price: 4500, duration: "45 mins" },
  ],
  MRI: [
    { id: "mri-knee", name: "MRI Knee", price: 8000, duration: "45 mins" },
    { id: "mri-brain", name: "MRI Brain", price: 9000, duration: "60 mins" },
    { id: "mri-spine", name: "MRI Spine", price: 8500, duration: "50 mins" },
  ],
  Ultrasound: [
    { id: "usg-abdomen", name: "USG Abdomen", price: 1200, duration: "20 mins" },
    { id: "usg-pelvis", name: "USG Pelvis", price: 1000, duration: "15 mins" },
    { id: "usg-thyroid", name: "USG Thyroid", price: 800, duration: "15 mins" },
  ],
}

// Department-specific procedures
const departmentProcedures = {
  general: [
    { id: "general-checkup", name: "Comprehensive Health Checkup", sessions: 1, price: 1500 },
    { id: "vaccination", name: "Vaccination", sessions: 1, price: 500 },
  ],
  orthopedics: [
    { id: "physiotherapy", name: "Physiotherapy Sessions", sessions: 10, price: 5000 },
    { id: "joint-injection", name: "Joint Injection", sessions: 1, price: 2000 },
    { id: "fracture-care", name: "Fracture Care & Follow-up", sessions: 3, price: 3000 },
  ],
  ayurveda: [
    { id: "panchkarma-basic", name: "Basic Panchkarma Package", sessions: 7, price: 8000 },
    { id: "abhyanga", name: "Abhyanga Therapy", sessions: 5, price: 3000 },
    { id: "shirodhara", name: "Shirodhara Treatment", sessions: 3, price: 2500 },
    { id: "nasya", name: "Nasya Treatment", sessions: 5, price: 2000 },
  ],
  dental: [
    { id: "root-canal", name: "Root Canal Treatment", sessions: 3, price: 8000 },
    { id: "dental-cleaning", name: "Professional Dental Cleaning", sessions: 1, price: 1500 },
    { id: "tooth-extraction", name: "Tooth Extraction", sessions: 1, price: 2000 },
  ],
  cardiology: [
    { id: "stress-test", name: "Cardiac Stress Test", sessions: 1, price: 3500 },
    { id: "echo", name: "Echocardiogram", sessions: 1, price: 2500 },
    { id: "holter-monitoring", name: "24-Hour Holter Monitoring", sessions: 1, price: 4000 },
  ],
  dermatology: [
    { id: "laser-therapy", name: "Laser Therapy", sessions: 5, price: 5000 },
    { id: "chemical-peel", name: "Chemical Peel", sessions: 3, price: 3000 },
    { id: "phototherapy", name: "Phototherapy", sessions: 8, price: 6000 },
  ],
}

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
  const [activeTab, setActiveTab] = useState("summary")
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([])
  const [selectedRadiology, setSelectedRadiology] = useState<string[]>([])
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([])
  const [followUpDate, setFollowUpDate] = useState<Date>()
  const [followUpTime, setFollowUpTime] = useState("")
  const [followUpNotes, setFollowUpNotes] = useState("")
  const [nextStepsNotes, setNextStepsNotes] = useState("")
  const [urgentTests, setUrgentTests] = useState<string[]>([])

  // Calculate totals
  const getLabTestsTotal = () => {
    return Object.values(labTestCategories)
      .flat()
      .filter((test) => selectedLabTests.includes(test.id))
      .reduce((total, test) => total + test.price, 0)
  }

  const getRadiologyTotal = () => {
    return Object.values(radiologyCategories)
      .flat()
      .filter((service) => selectedRadiology.includes(service.id))
      .reduce((total, service) => total + service.price, 0)
  }

  const getProceduresTotal = () => {
    const procedures = departmentProcedures[department as keyof typeof departmentProcedures] || []
    return procedures
      .filter((proc) => selectedProcedures.includes(proc.id))
      .reduce((total, proc) => total + proc.price, 0)
  }

  const getTotalCost = () => {
    return getLabTestsTotal() + getRadiologyTotal() + getProceduresTotal()
  }

  const handleLabTestToggle = (testId: string) => {
    setSelectedLabTests((prev) => (prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]))
  }

  const handleRadiologyToggle = (serviceId: string) => {
    setSelectedRadiology((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleProcedureToggle = (procedureId: string) => {
    setSelectedProcedures((prev) =>
      prev.includes(procedureId) ? prev.filter((id) => id !== procedureId) : [...prev, procedureId],
    )
  }

  const handleUrgentToggle = (testId: string) => {
    setUrgentTests((prev) => (prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]))
  }

  const handleCompleteVisit = () => {
    const completionData = {
      labTests: selectedLabTests,
      radiology: selectedRadiology,
      procedures: selectedProcedures,
      followUp: followUpDate
        ? {
            date: followUpDate,
            time: followUpTime,
            notes: followUpNotes,
          }
        : null,
      nextStepsNotes,
      urgentTests,
      totalCost: getTotalCost(),
    }

    // Show completion toast
    toast.success("Visit completed successfully!", {
      description: `Next steps scheduled for ${patientName}`,
    })

    // Navigate to appropriate section if tests/procedures selected
    if (selectedLabTests.length > 0) {
      setTimeout(() => {
        toast.info("Redirecting to Laboratory section", {
          description: "Complete the lab test booking process",
        })
        // Here you would navigate to lab section
      }, 2000)
    } else if (selectedRadiology.length > 0) {
      setTimeout(() => {
        toast.info("Redirecting to Radiology section", {
          description: "Complete the radiology booking process",
        })
        // Here you would navigate to radiology section
      }, 2000)
    } else if (selectedProcedures.length > 0) {
      setTimeout(() => {
        toast.info("Redirecting to Procedures section", {
          description: "Schedule the recommended procedures",
        })
        // Here you would navigate to procedures section
      }, 2000)
    }

    // Schedule follow-up appointment if date selected
    if (followUpDate) {
      setTimeout(() => {
        toast.success("Follow-up appointment scheduled", {
          description: `Appointment booked for ${format(followUpDate, "PPP")} at ${followUpTime}`,
        })
      }, 1000)
    }

    onComplete(completionData)
    onOpenChange(false)
  }

  const hasSelections =
    selectedLabTests.length > 0 || selectedRadiology.length > 0 || selectedProcedures.length > 0 || followUpDate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Complete Visit - Next Steps
          </DialogTitle>
          <DialogDescription>
            Plan the next course of treatment for {patientName} (ID: {patientId})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="lab-tests">
                Lab Tests
                {selectedLabTests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedLabTests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="radiology">
                Radiology
                {selectedRadiology.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedRadiology.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="procedures">
                Procedures
                {selectedProcedures.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedProcedures.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="follow-up">
                Follow-up
                {followUpDate && (
                  <Badge variant="secondary" className="ml-2">
                    ✓
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4 min-h-0">
              <TabsContent value="summary" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Treatment Plan Summary
                    </CardTitle>
                    <CardDescription>Review and add notes for the next steps in treatment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="next-steps">Next Steps & Instructions</Label>
                      <Textarea
                        id="next-steps"
                        placeholder="Describe the recommended next steps, treatment plan, or any specific instructions for the patient..."
                        value={nextStepsNotes}
                        onChange={(e) => setNextStepsNotes(e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    {hasSelections && (
                      <div className="space-y-4">
                        <Separator />
                        <h4 className="font-medium">Selected Recommendations:</h4>

                        {selectedLabTests.length > 0 && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <TestTube className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">Lab Tests ({selectedLabTests.length})</span>
                            </div>
                            <div className="text-sm text-blue-700">Total Cost: ₹{getLabTestsTotal()}</div>
                          </div>
                        )}

                        {selectedRadiology.length > 0 && (
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4 text-purple-600" />
                              <span className="font-medium text-purple-800">
                                Radiology ({selectedRadiology.length})
                              </span>
                            </div>
                            <div className="text-sm text-purple-700">Total Cost: ₹{getRadiologyTotal()}</div>
                          </div>
                        )}

                        {selectedProcedures.length > 0 && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-800">
                                Procedures ({selectedProcedures.length})
                              </span>
                            </div>
                            <div className="text-sm text-green-700">Total Cost: ₹{getProceduresTotal()}</div>
                          </div>
                        )}

                        {followUpDate && (
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarIcon className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-orange-800">Follow-up Scheduled</span>
                            </div>
                            <div className="text-sm text-orange-700">
                              {format(followUpDate, "PPP")} at {followUpTime}
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Estimated Cost:</span>
                            <span className="text-lg font-bold">₹{getTotalCost()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lab-tests" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-blue-600" />
                      Recommended Lab Tests
                    </CardTitle>
                    <CardDescription>Select lab tests to help with diagnosis and treatment planning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(labTestCategories).map(([category, tests]) => (
                        <div key={category}>
                          <h4 className="font-medium mb-3">{category}</h4>
                          <div className="grid gap-3">
                            {tests.map((test) => (
                              <div
                                key={test.id}
                                className={cn(
                                  "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                                  selectedLabTests.includes(test.id)
                                    ? "border-blue-300 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300",
                                )}
                                onClick={() => handleLabTestToggle(test.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedLabTests.includes(test.id)}
                                    onChange={() => handleLabTestToggle(test.id)}
                                  />
                                  <div>
                                    <div className="font-medium">{test.name}</div>
                                    <div className="text-sm text-gray-600">₹{test.price}</div>
                                  </div>
                                </div>
                                {selectedLabTests.includes(test.id) && (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant={urgentTests.includes(test.id) ? "default" : "outline"}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleUrgentToggle(test.id)
                                      }}
                                    >
                                      {urgentTests.includes(test.id) ? "Urgent" : "Mark Urgent"}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="radiology" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      Recommended Radiology Services
                    </CardTitle>
                    <CardDescription>Select imaging studies for further evaluation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(radiologyCategories).map(([category, services]) => (
                        <div key={category}>
                          <h4 className="font-medium mb-3">{category}</h4>
                          <div className="grid gap-3">
                            {services.map((service) => (
                              <div
                                key={service.id}
                                className={cn(
                                  "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                                  selectedRadiology.includes(service.id)
                                    ? "border-purple-300 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300",
                                )}
                                onClick={() => handleRadiologyToggle(service.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedRadiology.includes(service.id)}
                                    onChange={() => handleRadiologyToggle(service.id)}
                                  />
                                  <div>
                                    <div className="font-medium">{service.name}</div>
                                    <div className="text-sm text-gray-600">
                                      ₹{service.price} • {service.duration}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procedures" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      Recommended Procedures & Treatments
                    </CardTitle>
                    <CardDescription>Select procedures based on the patient's condition and department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentProcedures[department as keyof typeof departmentProcedures] ? (
                        <div className="grid gap-3">
                          {departmentProcedures[department as keyof typeof departmentProcedures].map((procedure) => (
                            <div
                              key={procedure.id}
                              className={cn(
                                "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                                selectedProcedures.includes(procedure.id)
                                  ? "border-green-300 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300",
                              )}
                              onClick={() => handleProcedureToggle(procedure.id)}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedProcedures.includes(procedure.id)}
                                  onChange={() => handleProcedureToggle(procedure.id)}
                                />
                                <div>
                                  <div className="font-medium">{procedure.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {procedure.sessions} session{procedure.sessions > 1 ? "s" : ""} • ₹{procedure.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No specific procedures available for {department} department</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="follow-up" className="space-y-4 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-orange-600" />
                      Schedule Follow-up Appointment
                    </CardTitle>
                    <CardDescription>Set a follow-up date to monitor progress and adjust treatment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Follow-up Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-2",
                                !followUpDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {followUpDate ? format(followUpDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={followUpDate}
                              onSelect={setFollowUpDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="follow-up-time">Follow-up Time</Label>
                        <Select value={followUpTime} onValueChange={setFollowUpTime}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">09:00 AM</SelectItem>
                            <SelectItem value="09:30">09:30 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="11:30">11:30 AM</SelectItem>
                            <SelectItem value="14:00">02:00 PM</SelectItem>
                            <SelectItem value="14:30">02:30 PM</SelectItem>
                            <SelectItem value="15:00">03:00 PM</SelectItem>
                            <SelectItem value="15:30">03:30 PM</SelectItem>
                            <SelectItem value="16:00">04:00 PM</SelectItem>
                            <SelectItem value="16:30">04:30 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="follow-up-notes">Follow-up Notes</Label>
                      <Textarea
                        id="follow-up-notes"
                        placeholder="Add any specific instructions or notes for the follow-up appointment..."
                        value={followUpNotes}
                        onChange={(e) => setFollowUpNotes(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    {followUpDate && (
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Follow-up Scheduled</span>
                        </div>
                        <div className="text-sm text-orange-700">
                          <div>Date: {format(followUpDate, "PPPP")}</div>
                          {followUpTime && <div>Time: {followUpTime}</div>}
                          <div className="mt-2 text-xs">
                            An appointment will be automatically created for this date and time.
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between border-t pt-4 mt-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            {hasSelections && (
              <div className="text-sm text-gray-600">
                Total Cost: <span className="font-bold">₹{getTotalCost()}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteVisit} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Visit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
