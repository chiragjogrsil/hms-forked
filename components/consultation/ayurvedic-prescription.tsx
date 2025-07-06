"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { AddAyurvedicPrescriptionModal } from "@/components/modals/add-ayurvedic-prescription-modal"
import { PrescriptionTemplateManager } from "@/components/prescription-template-manager"

interface AyurvedicPrescriptionProps {
  data: any[]
  onChange: (data: any[]) => void
  readOnly?: boolean
}

export function AyurvedicPrescription({ data, onChange, readOnly = false }: AyurvedicPrescriptionProps) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)
  const [showInitialOptions, setShowInitialOptions] = useState(safeData.length === 0)

  // Overall prescription-level pathya/apathya
  const [overallPathya, setOverallPathya] = useState<string[]>([])
  const [overallApathya, setOverallApathya] = useState<string[]>([])
  const [newPathya, setNewPathya] = useState("")
  const [newApathya, setNewApathya] = useState("")

  const commonPathya = [
    "Light food",
    "Warm water",
    "Rest",
    "Fruits",
    "Vegetables",
    "Milk",
    "Honey",
    "Rice",
    "Moong dal",
    "Ghee",
    "Buttermilk",
    "Ginger tea",
  ]

  const commonApathya = [
    "Cold food",
    "Heavy meals",
    "Stress",
    "Spicy food",
    "Fried food",
    "Alcohol",
    "Smoking",
    "Late night meals",
    "Processed food",
    "Ice cream",
    "Cold drinks",
    "Non-veg",
  ]

  const handleAddPrescription = (prescriptionData: any) => {
    if (editingPrescription) {
      onChange(
        safeData.map((item) =>
          item.id === editingPrescription.id ? { ...prescriptionData, id: editingPrescription.id } : item,
        ),
      )
    } else {
      const newPrescription = { ...prescriptionData, id: Date.now().toString() }
      onChange([...safeData, newPrescription])
    }
    setEditingPrescription(null)
    setIsModalOpen(false)
    setShowInitialOptions(false)
  }

  const handleEditPrescription = (prescription: any) => {
    setEditingPrescription(prescription)
    setIsModalOpen(true)
  }

  const handleDeletePrescription = (id: string) => {
    onChange(safeData.filter((item) => item.id !== id))
  }

  const openAddModal = () => {
    setEditingPrescription(null)
    setIsModalOpen(true)
    setShowInitialOptions(false)
  }

  const addPathya = (pathya: string) => {
    if (pathya.trim() && !overallPathya.includes(pathya.trim())) {
      setOverallPathya([...overallPathya, pathya.trim()])
    }
  }

  const removePathya = (pathya: string) => {
    setOverallPathya(overallPathya.filter((p) => p !== pathya))
  }

  const addApathya = (apathya: string) => {
    if (apathya.trim() && !overallApathya.includes(apathya.trim())) {
      setOverallApathya([...overallApathya, apathya.trim()])
    }
  }

  const removeApathya = (apathya: string) => {
    setOverallApathya(overallApathya.filter((a) => a !== apathya))
  }

  const handleAddCustomPathya = () => {
    if (newPathya.trim()) {
      addPathya(newPathya)
      setNewPathya("")
    }
  }

  const handleAddCustomApathya = () => {
    if (newApathya.trim()) {
      addApathya(newApathya)
      setNewApathya("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Ayurvedic Prescriptions</h3>
          {safeData.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {safeData.length} prescription{safeData.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        {!readOnly && (
          <PrescriptionTemplateManager
            ayurvedicPrescriptions={safeData}
            allopathicPrescriptions={[]}
            department="Ayurveda"
            onLoadTemplate={(template) => {
              onChange(template.ayurvedicPrescriptions || [])
              setShowInitialOptions(false)
            }}
            readOnly={readOnly}
          />
        )}
      </div>

      {/* Overall Pathya/Apathya Section - Only show if there are prescriptions */}
      {safeData.length > 0 && !readOnly && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-green-800 mb-4">Overall Prescription Guidelines</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pathya Section */}
              <div className="space-y-3">
                <Label className="text-green-700">Pathya (Things to have)</Label>

                {/* Common Pathya Options */}
                <div>
                  <Label className="text-sm text-muted-foreground">Common Options:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {commonPathya
                      .filter((item) => !overallPathya.includes(item))
                      .map((item) => (
                        <Button
                          key={item}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-transparent"
                          onClick={() => addPathya(item)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {item}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Custom Pathya Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom pathya"
                    value={newPathya}
                    onChange={(e) => setNewPathya(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomPathya())}
                    className="text-sm"
                  />
                  <Button type="button" onClick={handleAddCustomPathya} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected Pathya */}
                {overallPathya.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Selected:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {overallPathya.map((item: string, idx: number) => (
                        <Badge key={idx} variant="default" className="text-xs bg-green-100 text-green-800">
                          {item}
                          <button
                            type="button"
                            onClick={() => removePathya(item)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Apathya Section */}
              <div className="space-y-3">
                <Label className="text-green-700">Apathya (Things to avoid)</Label>

                {/* Common Apathya Options */}
                <div>
                  <Label className="text-sm text-muted-foreground">Common Options:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {commonApathya
                      .filter((item) => !overallApathya.includes(item))
                      .map((item) => (
                        <Button
                          key={item}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-transparent"
                          onClick={() => addApathya(item)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {item}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* Custom Apathya Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom apathya"
                    value={newApathya}
                    onChange={(e) => setNewApathya(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomApathya())}
                    className="text-sm"
                  />
                  <Button type="button" onClick={handleAddCustomApathya} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected Apathya */}
                {overallApathya.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Selected:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {overallApathya.map((item: string, idx: number) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {item}
                          <button
                            type="button"
                            onClick={() => removeApathya(item)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {safeData.length === 0 && showInitialOptions ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-muted-foreground mb-2">No Ayurvedic Prescriptions</h4>
            <p className="text-sm text-muted-foreground mb-6 text-center">Choose how you'd like to start prescribing</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={openAddModal} className="bg-secondary hover:bg-secondary/90" disabled={readOnly}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {safeData.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeData.map((prescription, index) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">{prescription.medicine || "N/A"}</TableCell>
                        <TableCell>{prescription.dosage || "N/A"}</TableCell>
                        <TableCell>{prescription.duration || "N/A"}</TableCell>
                        <TableCell>{prescription.instructions || "N/A"}</TableCell>
                        <TableCell>
                          {!readOnly && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditPrescription(prescription)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePrescription(prescription.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Add Prescription Box */}
          {!readOnly && (
            <Card
              className="border-secondary/20 bg-secondary/5 hover:bg-secondary/10 cursor-pointer border-dashed"
              onClick={openAddModal}
            >
              <CardContent className="flex items-center justify-center py-6">
                <div className="flex items-center gap-3 text-secondary">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Add Another Ayurvedic Medicine</span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <AddAyurvedicPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPrescription(null)
        }}
        onSubmit={handleAddPrescription}
        editData={editingPrescription}
      />
    </div>
  )
}
