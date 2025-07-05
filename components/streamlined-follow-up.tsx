"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, History, Calendar, Stethoscope, TestTube, Scan, Plus, Copy, Info } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"
import { toast } from "sonner"
import { IntegratedConsultation } from "@/components/integrated-consultation"

interface StreamlinedFollowUpProps {
  patientId: string
  patientData: {
    id: string
    name: string
    age: number
    gender: string
    bloodGroup: string
    allergies: string[]
    medicalHistory: string[]
  }
  department: string
  doctorName: string
  visitDate: string
}

// Mock recent reports data
const recentReports = [
  {
    id: "RPT-001",
    type: "lab",
    name: "Complete Blood Count",
    date: "2024-06-25",
    status: "completed",
    abnormal: false,
    summary: "All parameters within normal range",
    urgency: "routine",
    keyFindings: ["Hemoglobin: 14.2 g/dL (Normal)", "WBC: 7.5 (Normal)", "Platelets: 250 (Normal)"],
  },
  {
    id: "RPT-002",
    type: "radiology",
    name: "Chest X-Ray",
    date: "2024-06-24",
    status: "completed",
    abnormal: true,
    summary: "Mild consolidation in right lower lobe",
    urgency: "urgent",
    keyFindings: ["Right lower lobe consolidation", "Heart size normal", "No pleural effusion"],
  },
  {
    id: "RPT-003",
    type: "lab",
    name: "Lipid Profile",
    date: "2024-06-23",
    status: "completed",
    abnormal: true,
    summary: "Elevated cholesterol levels",
    urgency: "routine",
    keyFindings: ["Total Cholesterol: 220 mg/dL (High)", "LDL: 145 mg/dL (High)", "HDL: 45 mg/dL (Normal)"],
  },
]

export function StreamlinedFollowUp({
  patientId,
  patientData,
  department,
  doctorName,
  visitDate,
}: StreamlinedFollowUpProps) {
  const {
    activeConsultation,
    isConsultationActive,
    getPatientConsultations,
    startNewConsultation,
    updateConsultationData,
    completeVisit,
    debugConsultationHistory,
  } = useConsultation()

  const [selectedPreviousConsultation, setSelectedPreviousConsultation] = useState<any>(null)
  const [showPreviousConsultations, setShowPreviousConsultations] = useState(false)
  const [consultationKey, setConsultationKey] = useState(0)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false)

  // Get consultation history and add debugging
  const consultationHistory = getPatientConsultations(patientId).filter((c) => c.status === "completed")

  // Debug effect to check what's happening
  useEffect(() => {
    const allHistory = debugConsultationHistory()
    const patientHistory = getPatientConsultations(patientId)
    const completedHistory = patientHistory.filter((c) => c.status === "completed")

    setDebugInfo({
      patientId,
      patientName: patientData.name,
      totalHistoryCount: allHistory.length,
      patientHistoryCount: patientHistory.length,
      completedHistoryCount: completedHistory.length,
      allPatientIds: [...new Set(allHistory.map((c) => c.patientId))],
      sampleConsultation: allHistory[0],
      // Add name derivation info
      nameDerivation: {
        currentPatientName: patientData.name,
        currentPatientId: patientId,
        consultationNames: completedHistory.map((c) => ({
          id: c.id,
          patientId: c.patientId,
          patientName: c.patientName,
          source: c.id?.includes(patientId) ? "sample-data" : "mock-data",
        })),
      },
    })

    console.log("🔍 Follow-up Debug Info:", {
      patientId,
      patientName: patientData.name,
      totalHistoryCount: allHistory.length,
      patientHistoryCount: patientHistory.length,
      completedHistoryCount: completedHistory.length,
      allPatientIds: [...new Set(allHistory.map((c) => c.patientId))],
      consultationHistory: completedHistory,
      nameDerivation: {
        currentPatientName: patientData.name,
        currentPatientId: patientId,
        consultationNames: completedHistory.map((c) => ({
          id: c.id,
          patientId: c.patientId,
          patientName: c.patientName,
          source: c.id?.includes(patientId) ? "sample-data" : "mock-data",
        })),
      },
    })
  }, [patientId, patientData.name])

  // Initialize consultation if not active
  const initializeConsultation = () => {
    if (!activeConsultation) {
      startNewConsultation(patientId, patientData.name, visitDate, {
        department,
        doctorName,
        consultationType: "followup",
      })
    }
  }

  const loadPreviousConsultation = async (consultation: any) => {
    setIsLoadingPrevious(true)
    setSelectedPreviousConsultation(consultation)
    setShowPreviousConsultations(false)

    try {
      // Initialize consultation first
      initializeConsultation()

      // Show loading toast
      const loadingToast = toast.loading("Loading previous consultation...", {
        description: "Prefilling all consultation data",
      })

      // Wait a moment for consultation to be created
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Prepare comprehensive data mapping
      const comprehensiveData = {
        // Basic consultation info
        chiefComplaint: `Follow-up: ${consultation.chiefComplaint}`,
        clinicalNotes: consultation.clinicalNotes || "",
        consultationType: "followup",
        previousConsultationId: consultation.id,

        // Clinical assessment
        provisionalDiagnosis: consultation.provisionalDiagnosis || consultation.diagnosis || [],
        differentialDiagnosis: consultation.differentialDiagnosis || [],
        clinicalFindings: consultation.clinicalFindings || "",

        // Vital signs - ensure all fields are mapped
        vitals: {
          bloodPressure: consultation.vitals?.bloodPressure || "",
          pulse: consultation.vitals?.pulse || "",
          temperature: consultation.vitals?.temperature || "",
          respiratoryRate: consultation.vitals?.respiratoryRate || "",
          spo2: consultation.vitals?.spo2 || "",
          weight: consultation.vitals?.weight || "",
          height: consultation.vitals?.height || "",
          bmi: consultation.vitals?.bmi || "",
          ...consultation.vitals,
        },

        // Prescriptions - ensure both types are mapped
        prescriptions: {
          allopathic: consultation.prescriptions?.allopathic || [],
          ayurvedic: consultation.prescriptions?.ayurvedic || [],
        },

        // Advanced analysis data
        ayurvedicAnalysis: consultation.ayurvedicAnalysis || {},
        ophthalmologyAnalysis: consultation.ophthalmologyAnalysis || {},

        // Additional clinical data
        historyOfPresentIllness: consultation.historyOfPresentIllness || "",
        pastMedicalHistory: consultation.pastMedicalHistory || [],
        familyHistory: consultation.familyHistory || "",
        socialHistory: consultation.socialHistory || "",
        allergies: consultation.allergies || [],
        currentMedications: consultation.currentMedications || [],

        // System review
        systemReview: consultation.systemReview || {},

        // Investigations
        investigationsOrdered: consultation.investigationsOrdered || [],

        // Follow-up and advice
        advice: consultation.advice || "",
        followUpInstructions: consultation.followUpInstructions || "",

        // Administrative
        consultationFee: consultation.consultationFee || 0,

        // Notes
        doctorNotes: consultation.doctorNotes || "",
        privateNotes: consultation.privateNotes || "",

        // Department and doctor info
        department: consultation.department || department,
        doctorName: consultation.doctorName || doctorName,
      }

      // Update consultation data with comprehensive mapping
      updateConsultationData(comprehensiveData)

      // Force re-render of consultation component
      setConsultationKey((prev) => prev + 1)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Show success toast with details
      toast.success("Previous consultation loaded successfully!", {
        description: (
          <div className="space-y-1">
            <div className="font-medium">All data has been prefilled</div>
            <div className="text-sm opacity-90">
              Patient: {consultation.patientName}
              <br />
              Date: {new Date(consultation.visitDate).toLocaleDateString()}
              <br />
              Department: {consultation.department}
              <br />
              Doctor: {consultation.doctorName}
              <br />
              Prescriptions:{" "}
              {(consultation.prescriptions?.allopathic?.length || 0) +
                (consultation.prescriptions?.ayurvedic?.length || 0)}{" "}
              medicines
            </div>
          </div>
        ),
        duration: 5000,
      })

      // Log the loaded data for debugging
      console.log("🔄 Loaded Previous Consultation:", {
        originalConsultation: consultation,
        mappedData: comprehensiveData,
        activeConsultation: activeConsultation,
      })
    } catch (error) {
      console.error("Error loading previous consultation:", error)
      toast.error("Failed to load previous consultation", {
        description: "Please try again",
      })
    } finally {
      setIsLoadingPrevious(false)
    }
  }

  const startFreshConsultation = () => {
    setSelectedPreviousConsultation(null)
    initializeConsultation()

    // Force re-render of consultation component
    setConsultationKey((prev) => prev + 1)

    toast.success("Started fresh follow-up consultation")
  }

  const handleCompleteVisit = async () => {
    const success = await completeVisit()
    if (success) {
      // Reset state
      setSelectedPreviousConsultation(null)
      setConsultationKey((prev) => prev + 1)
    }
  }

  // Function to create sample data for current patient
  const createSampleDataForPatient = () => {
    console.log("🎯 Creating sample data with patient name:", patientData.name)

    // This will add sample consultations for the current patient
    const sampleConsultations = [
      {
        id: `CONS-${patientId}-2024-06-20-${Date.now()}`,
        patientId: patientId,
        patientName: patientData.name, // ← NAME COMES FROM CURRENT PATIENT DATA
        visitDate: "2024-06-20",
        visitTime: "14:30",
        doctorName: "Dr. Sarah Wilson",
        department: "cardiology",
        consultationType: "followup",
        chiefComplaint: "Follow-up for hypertension management and chest discomfort",
        clinicalNotes:
          "Patient reports improved blood pressure control with current medication regimen. Occasional mild chest discomfort on exertion, no chest pain at rest. Compliance with medication is excellent. Patient has been following dietary recommendations and regular exercise routine. No shortness of breath or palpitations reported. Physical examination reveals normal heart sounds, no murmurs. Lungs clear bilaterally. No peripheral edema.",
        provisionalDiagnosis: ["Essential Hypertension - Well Controlled", "Atypical Chest Pain - Stable"],
        vitals: {
          bloodPressure: "128/82",
          pulse: "72",
          temperature: "98.6",
          respiratoryRate: "16",
          spo2: "98",
          weight: "75",
          height: "175",
          bmi: "24.5",
        },
        prescriptions: {
          allopathic: [
            {
              id: "1",
              medicine: "Lisinopril",
              dosage: "10mg",
              frequency: "Once daily",
              duration: "30 days",
              instructions: "Continue current dose, monitor BP at home",
              beforeAfterFood: "before",
            },
            {
              id: "2",
              medicine: "Aspirin",
              dosage: "75mg",
              frequency: "Once daily",
              duration: "30 days",
              instructions: "Take with food to prevent gastric irritation",
              beforeAfterFood: "after",
            },
          ],
          ayurvedic: [],
        },
        advice:
          "Continue current medication. Monitor blood pressure at home twice weekly. Follow low-sodium diet (<2g/day). Regular moderate exercise 30 minutes daily. Return if chest pain worsens.",
        followUpInstructions: "Follow-up in 4 weeks or sooner if symptoms worsen",
        status: "completed",
        createdAt: "2024-06-20T14:30:00.000Z",
        updatedAt: "2024-06-20T15:15:00.000Z",
      },
      {
        id: `CONS-${patientId}-2024-06-15-${Date.now() + 1}`,
        patientId: patientId,
        patientName: patientData.name, // ← NAME COMES FROM CURRENT PATIENT DATA
        visitDate: "2024-06-15",
        visitTime: "10:15",
        doctorName: "Dr. Priya Sharma",
        department: "ayurveda",
        consultationType: "routine",
        chiefComplaint: "Digestive issues and stress management consultation",
        clinicalNotes:
          "Patient reports occasional indigestion, bloating after meals, and work-related stress affecting sleep quality. Seeking natural remedies for overall wellness and digestive health. Pulse examination reveals Vata-Pitta imbalance. Tongue examination shows mild coating indicating digestive fire (Agni) imbalance. Patient interested in Panchakarma therapy for detoxification.",
        provisionalDiagnosis: [
          "Ajirna (Digestive Imbalance)",
          "Stress-related Vata Aggravation",
          "Mandagni (Weak Digestive Fire)",
        ],
        vitals: {
          bloodPressure: "125/80",
          pulse: "70",
          temperature: "98.2",
          weight: "74.5",
          height: "175",
        },
        prescriptions: {
          allopathic: [],
          ayurvedic: [
            {
              id: "1",
              medicine: "Triphala Churna",
              dosage: "1 tsp",
              frequency: "Twice daily",
              duration: "15 days",
              instructions: "Mix with warm water, take on empty stomach",
              beforeAfterFood: "before",
            },
            {
              id: "2",
              medicine: "Brahmi Ghrita",
              dosage: "1/2 tsp",
              frequency: "Once daily",
              duration: "21 days",
              instructions: "Take with warm milk before bedtime for stress relief",
              beforeAfterFood: "before",
            },
            {
              id: "3",
              medicine: "Hingvastak Churna",
              dosage: "1/4 tsp",
              frequency: "After meals",
              duration: "10 days",
              instructions: "Mix with buttermilk for digestive support",
              beforeAfterFood: "after",
            },
          ],
        },
        ayurvedicAnalysis: {
          constitution: "Vata-Pitta",
          currentImbalance: "Vata aggravated with Pitta secondary",
          pulseFindings: "Vata pulse prominent, irregular rhythm",
          tongueExamination: "Mild white coating, slightly dry",
          digestiveFire: "Mandagni (irregular/weak)",
          recommendations: [
            "Follow Vata-pacifying diet",
            "Regular meal timings",
            "Avoid cold and raw foods",
            "Practice Pranayama daily",
            "Oil massage (Abhyanga) twice weekly",
          ],
        },
        advice:
          "Practice pranayama daily (Anulom-Vilom 10 minutes). Avoid spicy and fried foods. Follow regular meal timings. Warm water intake throughout the day.",
        followUpInstructions: "Follow-up in 2 weeks to assess treatment response",
        status: "completed",
        createdAt: "2024-06-15T10:15:00.000Z",
        updatedAt: "2024-06-15T11:00:00.000Z",
      },
      {
        id: `CONS-${patientId}-2024-06-10-${Date.now() + 2}`,
        patientId: patientId,
        patientName: patientData.name, // ← NAME COMES FROM CURRENT PATIENT DATA
        visitDate: "2024-06-10",
        visitTime: "11:20",
        doctorName: "Dr. Robert Johnson",
        department: "orthopedics",
        consultationType: "routine",
        chiefComplaint: "Lower back pain after exercise and morning stiffness",
        clinicalNotes:
          "Patient reports mild to moderate lower back pain that started after recent gym sessions focusing on deadlifts. Pain is mechanical in nature, worse with forward bending and prolonged sitting. No radiation to legs. Morning stiffness lasting 15-20 minutes. No neurological symptoms. Physical examination reveals mild paravertebral muscle spasm at L4-L5 level. Straight leg raise test negative bilaterally.",
        provisionalDiagnosis: ["Mechanical Lower Back Pain", "Lumbar Muscle Strain", "Postural Syndrome"],
        vitals: {
          bloodPressure: "122/78",
          pulse: "65",
          temperature: "98.1",
          weight: "75",
          height: "175",
        },
        prescriptions: {
          allopathic: [
            {
              id: "1",
              medicine: "Ibuprofen",
              dosage: "400mg",
              frequency: "Twice daily",
              duration: "5 days",
              instructions: "Take with food to prevent gastric irritation",
              beforeAfterFood: "after",
            },
            {
              id: "2",
              medicine: "Muscle Relaxant (Thiocolchicoside)",
              dosage: "4mg",
              frequency: "Twice daily",
              duration: "5 days",
              instructions: "May cause drowsiness, avoid driving",
              beforeAfterFood: "after",
            },
          ],
          ayurvedic: [],
        },
        advice:
          "Apply heat therapy 15-20 minutes twice daily. Avoid heavy lifting for 2 weeks. Start gentle stretching exercises after pain subsides. Maintain proper posture while sitting.",
        followUpInstructions: "Follow-up in 1 week if pain persists or worsens",
        investigationsOrdered: [
          {
            id: "1",
            category: "radiology",
            test: "X-Ray Lumbar Spine (AP & Lateral)",
            urgency: "routine",
            notes: "If pain persists beyond 1 week",
          },
        ],
        status: "completed",
        createdAt: "2024-06-10T11:20:00.000Z",
        updatedAt: "2024-06-10T12:05:00.000Z",
      },
    ]

    console.log(
      "📝 Sample consultations created with names:",
      sampleConsultations.map((c) => c.patientName),
    )

    // Add these consultations to the consultation history
    const currentHistory = debugConsultationHistory()
    const updatedHistory = [...sampleConsultations, ...currentHistory]

    // Update localStorage directly
    localStorage.setItem("consultation-history", JSON.stringify(updatedHistory))

    // Force a page refresh to reload the context
    window.location.reload()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar - Reports Only */}
      <div className="lg:col-span-1 space-y-4">
        {/* Enhanced Debug Info Card with Name Derivation */}
        {debugInfo && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Name Derivation Debug
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-blue-700 mb-1">Current Patient:</div>
                <div>
                  <strong>ID:</strong> {debugInfo.patientId}
                </div>
                <div>
                  <strong>Name:</strong> {debugInfo.patientName}
                </div>
              </div>

              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-green-700 mb-1">Consultation Names:</div>
                {debugInfo.nameDerivation?.consultationNames?.map((item: any, idx: number) => (
                  <div key={idx} className="text-xs mb-1 p-1 bg-gray-50 rounded">
                    <div>
                      <strong>Name:</strong> {item.patientName}
                    </div>
                    <div>
                      <strong>Source:</strong>
                      <Badge variant={item.source === "sample-data" ? "default" : "secondary"} className="ml-1 text-xs">
                        {item.source}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-gray-500">No consultations found</div>}
              </div>

              <div className="bg-white p-2 rounded border">
                <div className="font-semibold text-purple-700 mb-1">Name Sources:</div>
                <div className="text-xs space-y-1">
                  <div>
                    • <strong>Mock Data:</strong> "John Doe" (hardcoded)
                  </div>
                  <div>
                    • <strong>Sample Data:</strong> Uses current patient name
                  </div>
                  <div>
                    • <strong>New Consultations:</strong> Uses patientData.name prop
                  </div>
                </div>
              </div>

              {debugInfo.completedHistoryCount === 0 && (
                <Button
                  onClick={createSampleDataForPatient}
                  size="sm"
                  className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700"
                >
                  Create Sample Data (with {debugInfo.patientName})
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-3 rounded-lg border ${
                      report.abnormal ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {report.type === "lab" ? (
                          <TestTube className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Scan className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="font-medium text-sm">{report.name}</span>
                      </div>
                      <Badge variant={report.abnormal ? "destructive" : "secondary"} className="text-xs">
                        {report.abnormal ? "Abnormal" : "Normal"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{report.summary}</p>
                    <div className="space-y-1">
                      {report.keyFindings.map((finding, idx) => (
                        <div key={idx} className="text-xs flex items-center gap-1">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {finding}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Reports Summary */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Reports Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Reports:</span>
                <Badge variant="outline">{recentReports.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Abnormal:</span>
                <Badge variant="destructive" className="text-xs">
                  {recentReports.filter((r) => r.abnormal).length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Normal:</span>
                <Badge variant="secondary" className="text-xs">
                  {recentReports.filter((r) => !r.abnormal).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Main Area - Consultation Interface */}
      <div className="lg:col-span-3">
        {isConsultationActive ? (
          <div className="space-y-4">
            {/* Loaded Consultation Details - Horizontal Section (Only when consultation is loaded) */}
            {selectedPreviousConsultation && (
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100/70 rounded-full">
                        <History className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800">Amendment Mode - Previous Consultation Loaded</h3>
                        <p className="text-sm text-blue-600">
                          Patient: <strong>{selectedPreviousConsultation.patientName}</strong> •{" "}
                          {selectedPreviousConsultation.chiefComplaint}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedPreviousConsultation.visitDate).toLocaleDateString()}
                      </div>
                      <div>{selectedPreviousConsultation.doctorName}</div>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        {selectedPreviousConsultation.department}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Data Prefilled
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Consultation Status Header */}
            <Card className="border-teal-200 bg-gradient-to-r from-slate-50 to-teal-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100/70 rounded-full">
                      <Stethoscope className="h-5 w-5 text-teal-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-800">Follow-up Consultation</h3>
                      <p className="text-sm text-teal-600">
                        Current Patient: <strong>{patientData.name}</strong> •{" "}
                        {selectedPreviousConsultation
                          ? "Amending previous consultation with new findings"
                          : "New follow-up consultation in progress"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                      Follow-up Mode
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Integrated Consultation Interface */}
            <IntegratedConsultation
              key={consultationKey}
              patientId={patientId}
              patientData={patientData}
              department={activeConsultation?.department || department}
              doctorName={activeConsultation?.doctorName || doctorName}
              onCompleteVisit={handleCompleteVisit}
            />
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Follow-up Consultation</h3>
              <p className="text-muted-foreground mb-2">
                Patient: <strong>{patientData.name}</strong>
              </p>
              <p className="text-muted-foreground mb-6">
                Start a fresh follow-up consultation or load a previous consultation to make amendments
              </p>

              {/* Quick Start Actions - Now in the main area */}
              <div className="flex gap-4 justify-center mb-6">
                <Button onClick={startFreshConsultation} className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Fresh Follow-up
                </Button>
                <Button
                  onClick={() => setShowPreviousConsultations(true)}
                  variant="outline"
                  disabled={consultationHistory.length === 0 || isLoadingPrevious}
                >
                  <History className="h-4 w-4 mr-2" />
                  {isLoadingPrevious ? "Loading..." : `Load Previous Visit (${consultationHistory.length})`}
                </Button>
              </div>

              {/* Show message if no history */}
              {consultationHistory.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    No previous consultations found for this patient.
                    {debugInfo && debugInfo.completedHistoryCount === 0 && (
                      <span> Create sample data to test the follow-up functionality.</span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Previous Consultations Modal */}
      <Dialog open={showPreviousConsultations} onOpenChange={setShowPreviousConsultations}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Load Previous Consultation for Amendment</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {consultationHistory.length > 0 ? (
                consultationHistory.map((consultation) => (
                  <Card key={consultation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{consultation.patientName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {consultation.id?.includes(patientId) ? "Sample Data" : "Mock Data"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{consultation.chiefComplaint}</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(consultation.visitDate!).toLocaleDateString()}
                              </span>
                              <span>{consultation.doctorName}</span>
                              <Badge variant="outline" className="text-xs">
                                {consultation.department}
                              </Badge>
                            </div>
                            {consultation.provisionalDiagnosis?.length > 0 && (
                              <div>
                                <strong>Diagnosis:</strong> {consultation.provisionalDiagnosis.join(", ")}
                              </div>
                            )}
                            {consultation.prescriptions?.allopathic?.length > 0 && (
                              <div>
                                <strong>Prescriptions:</strong> {consultation.prescriptions.allopathic.length}{" "}
                                allopathic
                                {consultation.prescriptions?.ayurvedic?.length > 0 &&
                                  `, ${consultation.prescriptions.ayurvedic.length} ayurvedic`}
                              </div>
                            )}
                            {consultation.vitals && Object.keys(consultation.vitals).length > 0 && (
                              <div>
                                <strong>Vitals:</strong> BP {consultation.vitals.bloodPressure}, Pulse{" "}
                                {consultation.vitals.pulse}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => loadPreviousConsultation(consultation)}
                          size="sm"
                          disabled={isLoadingPrevious}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {isLoadingPrevious ? "Loading..." : "Load & Amend"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No previous consultations found for this patient</p>
                  <p className="text-sm text-muted-foreground mt-2">Patient ID: {patientId}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
