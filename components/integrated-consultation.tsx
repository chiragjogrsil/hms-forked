"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Pill, Leaf, TestTube, Activity, FileText, Calendar, User, Clock } from "lucide-react"
import { PrescriptionTemplateManager } from "@/components/prescription-template-manager"

interface IntegratedConsultationProps {
  patientId: string
  visitId: string
  patientName: string
  age: number
  gender: string
  department: string
}

export function IntegratedConsultation({
  patientId,
  visitId,
  patientName,
  age,
  gender,
  department,
}: IntegratedConsultationProps) {
  const [allopathicMedicines, setAllopathicMedicines] = useState<
    Array<{
      name: string
      dosage: string
      frequency: string
      duration: string
      instructions?: string
    }>
  >([])

  const [ayurvedicMedicines, setAyurvedicMedicines] = useState<
    Array<{
      name: string
      dosage: string
      frequency: string
      duration: string
      instructions?: string
    }>
  >([])

  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
  })

  const [clinicalNotes, setClinicalNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [labTests, setLabTests] = useState<string[]>([])
  const [procedures, setProcedures] = useState<string[]>([])

  const handleLoadTemplate = (template: any) => {
    setAllopathicMedicines(template.allopathicMedicines)
    setAyurvedicMedicines(template.ayurvedicMedicines)
  }

  const addAllopathicMedicine = () => {
    setAllopathicMedicines([
      ...allopathicMedicines,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ])
  }

  const addAyurvedicMedicine = () => {
    setAyurvedicMedicines([
      ...ayurvedicMedicines,
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ])
  }

  const updateAllopathicMedicine = (index: number, field: string, value: string) => {
    const updated = [...allopathicMedicines]
    updated[index] = { ...updated[index], [field]: value }
    setAllopathicMedicines(updated)
  }

  const updateAyurvedicMedicine = (index: number, field: string, value: string) => {
    const updated = [...ayurvedicMedicines]
    updated[index] = { ...updated[index], [field]: value }
    setAyurvedicMedicines(updated)
  }

  const removeAllopathicMedicine = (index: number) => {
    setAllopathicMedicines(allopathicMedicines.filter((_, i) => i !== index))
  }

  const removeAyurvedicMedicine = (index: number) => {
    setAyurvedicMedicines(ayurvedicMedicines.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{patientName}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>
                    {age} years • {gender}
                  </span>
                  <Badge variant="outline">{department}</Badge>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Visit ID: {visitId}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Prescription Template Manager */}
      <PrescriptionTemplateManager
        allopathicMedicines={allopathicMedicines}
        ayurvedicMedicines={ayurvedicMedicines}
        onLoadTemplate={handleLoadTemplate}
        department={department}
      />

      {/* Main Consultation Tabs */}
      <Tabs defaultValue="prescription" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="prescription" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Prescription
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Lab Tests
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Clinical Notes
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Diagnosis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Temperature (°F)</label>
                  <input
                    type="text"
                    value={vitalSigns.temperature}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="98.6"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Blood Pressure</label>
                  <input
                    type="text"
                    value={vitalSigns.bloodPressure}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Heart Rate (bpm)</label>
                  <input
                    type="text"
                    value={vitalSigns.heartRate}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Respiratory Rate</label>
                  <input
                    type="text"
                    value={vitalSigns.respiratoryRate}
                    onChange={(e) => setVitalSigns({ ...vitalSigns, respiratoryRate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="16"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescription" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allopathic Medicines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-green-600" />
                  Allopathic Medicines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {allopathicMedicines.map((medicine, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Medicine {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAllopathicMedicine(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Medicine Name</label>
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => updateAllopathicMedicine(index, "name", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="Enter medicine name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Dosage</label>
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => updateAllopathicMedicine(index, "dosage", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Frequency</label>
                        <input
                          type="text"
                          value={medicine.frequency}
                          onChange={(e) => updateAllopathicMedicine(index, "frequency", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => updateAllopathicMedicine(index, "duration", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., 7 days"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instructions</label>
                      <input
                        type="text"
                        value={medicine.instructions || ""}
                        onChange={(e) => updateAllopathicMedicine(index, "instructions", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., Take after meals"
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addAllopathicMedicine} variant="outline" className="w-full bg-transparent">
                  Add Allopathic Medicine
                </Button>
              </CardContent>
            </Card>

            {/* Ayurvedic Medicines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-orange-600" />
                  Ayurvedic Medicines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ayurvedicMedicines.map((medicine, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Medicine {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAyurvedicMedicine(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Medicine Name</label>
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => updateAyurvedicMedicine(index, "name", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="Enter medicine name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Dosage</label>
                        <input
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) => updateAyurvedicMedicine(index, "dosage", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., 1 tsp"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Frequency</label>
                        <input
                          type="text"
                          value={medicine.frequency}
                          onChange={(e) => updateAyurvedicMedicine(index, "frequency", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <input
                          type="text"
                          value={medicine.duration}
                          onChange={(e) => updateAyurvedicMedicine(index, "duration", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border rounded-md"
                          placeholder="e.g., 15 days"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instructions</label>
                      <input
                        type="text"
                        value={medicine.instructions || ""}
                        onChange={(e) => updateAyurvedicMedicine(index, "instructions", e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder="e.g., Take with warm water"
                      />
                    </div>
                  </div>
                ))}
                <Button onClick={addAyurvedicMedicine} variant="outline" className="w-full bg-transparent">
                  Add Ayurvedic Medicine
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Laboratory Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Lab tests functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full h-40 px-3 py-2 border rounded-md"
                placeholder="Enter clinical observations, patient history, and other relevant notes..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full h-32 px-3 py-2 border rounded-md"
                placeholder="Enter primary and secondary diagnosis..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Save Draft</Button>
        <Button>Complete Consultation</Button>
      </div>
    </div>
  )
}
