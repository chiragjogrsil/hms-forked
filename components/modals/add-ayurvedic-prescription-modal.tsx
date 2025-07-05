"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AddAyurvedicPrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  editData?: any
}

export function AddAyurvedicPrescriptionModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
}: AddAyurvedicPrescriptionModalProps) {
  const [formData, setFormData] = useState({
    formOfMedicine: "",
    constituents: [],
    preparationInstructions: "",
    toBeHadWith: "",
    dosage: "",
    beforeAfterFood: "",
    duration: "",
  })

  useEffect(() => {
    console.log("Ayurvedic modal isOpen:", isOpen)
    if (editData) {
      setFormData(editData)
    } else {
      setFormData({
        formOfMedicine: "",
        constituents: [],
        preparationInstructions: "",
        toBeHadWith: "",
        dosage: "",
        beforeAfterFood: "",
        duration: "",
      })
    }
  }, [editData, isOpen])

  const formOptions = ["Kadha", "Tablet", "Churna", "Vati", "Ghrita", "Taila", "Asava", "Arishta"]

  const constituentMedicines = [
    "Ashwagandha",
    "Brahmi",
    "Shankhpushpi",
    "Triphala",
    "Trikatu",
    "Dashmool",
    "Saraswatarishta",
    "Arjunarishta",
    "Punarnavadi Mandoor",
    "Yograj Guggulu",
    "Mahasudarshan Churna",
    "Sitopaladi Churna",
    "Avipattikar Churna",
  ]

  const toBeHadWithOptions = ["Milk", "Honey", "Ghee", "Warm Water", "Luke Warm Water"]

  // Same duration options as Allopathic prescription
  const durationOptions = [
    "1 day",
    "2 days",
    "3 days",
    "5 days",
    "7 days",
    "10 days",
    "15 days",
    "1 month",
    "2 months",
    "3 months",
    "6 months",
    "Until symptoms resolve",
    "As needed",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting ayurvedic prescription:", formData)
    onSubmit(formData)
  }

  const addConstituent = (constituent: string) => {
    if (!formData.constituents.includes(constituent)) {
      setFormData((prev) => ({
        ...prev,
        constituents: [...prev.constituents, constituent],
      }))
    }
  }

  const removeConstituent = (constituent: string) => {
    setFormData((prev) => ({
      ...prev,
      constituents: prev.constituents.filter((c) => c !== constituent),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} Ayurvedic Prescription</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Form of Medicine *</Label>
              <Select
                value={formData.formOfMedicine}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, formOfMedicine: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions.map((form) => (
                    <SelectItem key={form} value={form}>
                      {form}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Add Constituent Medicines</Label>
              <Select onValueChange={addConstituent}>
                <SelectTrigger>
                  <SelectValue placeholder="Add constituent" />
                </SelectTrigger>
                <SelectContent>
                  {constituentMedicines
                    .filter((medicine) => !formData.constituents.includes(medicine))
                    .map((medicine) => (
                      <SelectItem key={medicine} value={medicine}>
                        {medicine}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.constituents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.constituents.map((constituent: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {constituent}
                      <button
                        type="button"
                        onClick={() => removeConstituent(constituent)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Instructions for Preparing the Medicine</Label>
            <Textarea
              placeholder="e.g., Boil in 400ml water until reduced to 100ml"
              value={formData.preparationInstructions}
              onChange={(e) => setFormData((prev) => ({ ...prev, preparationInstructions: e.target.value }))}
              className="h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>To be had with</Label>
              <Select
                value={formData.toBeHadWith}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, toBeHadWith: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {toBeHadWithOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Dosage *</Label>
              <Select
                value={formData.dosage}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, dosage: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dosage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-0-0">1-0-0 (Once daily - Morning)</SelectItem>
                  <SelectItem value="0-1-0">0-1-0 (Once daily - Afternoon)</SelectItem>
                  <SelectItem value="0-0-1">0-0-1 (Once daily - Evening)</SelectItem>
                  <SelectItem value="1-1-0">1-1-0 (Twice daily - Morning & Afternoon)</SelectItem>
                  <SelectItem value="1-0-1">1-0-1 (Twice daily - Morning & Evening)</SelectItem>
                  <SelectItem value="0-1-1">0-1-1 (Twice daily - Afternoon & Evening)</SelectItem>
                  <SelectItem value="1-1-1">1-1-1 (Three times daily)</SelectItem>
                  <SelectItem value="2-0-0">2-0-0 (Two tablets - Morning)</SelectItem>
                  <SelectItem value="0-2-0">0-2-0 (Two tablets - Afternoon)</SelectItem>
                  <SelectItem value="0-0-2">0-0-2 (Two tablets - Evening)</SelectItem>
                  <SelectItem value="2-2-2">2-2-2 (Two tablets - Three times daily)</SelectItem>
                  <SelectItem value="1/2-0-0">1/2-0-0 (Half tablet - Morning)</SelectItem>
                  <SelectItem value="0-1/2-0">0-1/2-0 (Half tablet - Afternoon)</SelectItem>
                  <SelectItem value="0-0-1/2">0-0-1/2 (Half tablet - Evening)</SelectItem>
                  <SelectItem value="1/2-1/2-1/2">1/2-1/2-1/2 (Half tablet - Three times daily)</SelectItem>
                  <SelectItem value="SOS">SOS (As needed)</SelectItem>
                  <SelectItem value="STAT">STAT (Immediately)</SelectItem>
                </SelectContent>
              </Select>
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
