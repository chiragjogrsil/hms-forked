"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface AddAllopathicPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
  department?: string
}

export function AddAllopathicPrescriptionModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
  department = "general",
}: AddAllopathicPrescriptionModalProps) {
  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    beforeAfterFood: "",
    duration: "",
    dietaryRestrictions: [],
  })

  const [newDietaryRestriction, setNewDietaryRestriction] = useState("")

  useEffect(() => {
    console.log("Allopathic modal isOpen:", isOpen)
    if (editData) {
      setFormData(editData)
    } else {
      setFormData({
        medicine: "",
        dosage: "",
        beforeAfterFood: "",
        duration: "",
        dietaryRestrictions: [],
      })
    }
  }, [editData, isOpen])

  const getMedicineOptions = () => {
    switch (department) {
      case "dental":
        return [
          "Amoxicillin 500mg",
          "Metronidazole 400mg",
          "Ibuprofen 400mg",
          "Paracetamol 500mg",
          "Clindamycin 300mg",
          "Azithromycin 500mg",
          "Diclofenac 50mg",
          "Chlorhexidine Mouthwash",
        ]
      case "ophthalmology":
        return [
          "Tropicamide Eye Drops",
          "Timolol Eye Drops",
          "Ciprofloxacin Eye Drops",
          "Prednisolone Eye Drops",
          "Artificial Tears",
          "Atropine Eye Drops",
          "Brimonidine Eye Drops",
          "Cyclopentolate Eye Drops",
        ]
      default:
        return [
          "Paracetamol 500mg",
          "Ibuprofen 400mg",
          "Amoxicillin 500mg",
          "Azithromycin 500mg",
          "Omeprazole 20mg",
          "Metformin 500mg",
          "Amlodipine 5mg",
          "Atorvastatin 20mg",
          "Cetirizine 10mg",
          "Pantoprazole 40mg",
        ]
    }
  }

  const commonDietaryRestrictions = [
    "Avoid alcohol",
    "Avoid spicy food",
    "Avoid dairy products",
    "Take with food",
    "Avoid citrus fruits",
    "Drink plenty of water",
    "Avoid caffeine",
    "Light meals only",
    "Avoid smoking",
    "No heavy meals",
    "Avoid cold drinks",
    "Take on empty stomach",
  ]

  const durationOptions = ["3 days", "5 days", "7 days", "10 days", "15 days", "1 month", "2 months", "3 months"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting allopathic prescription:", formData)
    onSubmit(formData)
  }

  const addDietaryRestriction = (restriction: string) => {
    if (restriction.trim() && !formData.dietaryRestrictions.includes(restriction.trim())) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction.trim()],
      }))
    }
  }

  const removeDietaryRestriction = (restriction: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter((r) => r !== restriction),
    }))
  }

  const handleAddCustomRestriction = () => {
    if (newDietaryRestriction.trim()) {
      addDietaryRestriction(newDietaryRestriction)
      setNewDietaryRestriction("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit" : "Add"}{" "}
            {department === "dental" ? "Dental" : department === "ophthalmology" ? "Ophthalmology" : "Allopathic"}{" "}
            Prescription
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Medicine *</Label>
            <Select
              value={formData.medicine}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, medicine: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                {getMedicineOptions().map((medicine) => (
                  <SelectItem key={medicine} value={medicine}>
                    {medicine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Dosage *</Label>
              <Input
                placeholder="e.g., 1-0-1"
                value={formData.dosage}
                onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label>Before/After Food</Label>
              <Select
                value={formData.beforeAfterFood}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, beforeAfterFood: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Before Food</SelectItem>
                  <SelectItem value="after">After Food</SelectItem>
                  <SelectItem value="empty">Empty Stomach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duration *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dietary Restrictions Section */}
          <div className="space-y-3">
            <Label>Dietary Restrictions</Label>

            {/* Common Dietary Restrictions */}
            <div>
              <Label className="text-sm text-muted-foreground">Common Options:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {commonDietaryRestrictions
                  .filter((item) => !formData.dietaryRestrictions.includes(item))
                  .map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => addDietaryRestriction(item)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {item}
                    </Button>
                  ))}
              </div>
            </div>

            {/* Custom Dietary Restriction Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom dietary restriction"
                value={newDietaryRestriction}
                onChange={(e) => setNewDietaryRestriction(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomRestriction())}
                className="text-sm"
              />
              <Button type="button" onClick={handleAddCustomRestriction} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Dietary Restrictions */}
            {formData.dietaryRestrictions.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground">Selected:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.dietaryRestrictions.map((item: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeDietaryRestriction(item)}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editData ? "Update" : "Add"} Prescription</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
