"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VitalSignsData {
  temperature?: string
  bodyWeight?: string
  height?: string
  bpSystolic?: string
  bpDiastolic?: string
  pulse?: string
  spo2?: string
  respiratoryRate?: string
  notes?: string
}

interface VitalSignsSectionProps {
  data: VitalSignsData
  onChange: (data: VitalSignsData) => void
}

export function VitalSignsSection({ data, onChange }: VitalSignsSectionProps) {
  const [vitals, setVitals] = useState<VitalSignsData>(data || {})
  const [isDataPrefilled, setIsDataPrefilled] = useState(false)

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setVitals(data)
      setIsDataPrefilled(true)
      console.log("🔄 VitalSignsSection: Data prefilled:", data)
    }
  }, [data])

  const updateVital = (field: keyof VitalSignsData, value: string) => {
    const updatedVitals = { ...vitals, [field]: value }
    setVitals(updatedVitals)
    onChange(updatedVitals)
  }

  const calculateBMI = () => {
    const weight = Number.parseFloat(vitals.bodyWeight || "0")
    const height = Number.parseFloat(vitals.height || "0") / 100 // Convert cm to m
    if (weight > 0 && height > 0) {
      return (weight / (height * height)).toFixed(1)
    }
    return ""
  }

  return (
    <div className="space-y-4">
      {isDataPrefilled && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">✅ Vital signs loaded from previous consultation</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="37.0"
            value={vitals.temperature || ""}
            onChange={(e) => updateVital("temperature", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="bodyWeight">Body Weight (kg)</Label>
          <Input
            id="bodyWeight"
            type="number"
            step="0.1"
            placeholder="70.0"
            value={vitals.bodyWeight || ""}
            onChange={(e) => updateVital("bodyWeight", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            value={vitals.height || ""}
            onChange={(e) => updateVital("height", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="bpSystolic">Blood Pressure (mmHg)</Label>
          <div className="flex gap-2">
            <Input
              id="bpSystolic"
              type="number"
              placeholder="120"
              value={vitals.bpSystolic || ""}
              onChange={(e) => updateVital("bpSystolic", e.target.value)}
            />
            <span className="flex items-center">/</span>
            <Input
              type="number"
              placeholder="80"
              value={vitals.bpDiastolic || ""}
              onChange={(e) => updateVital("bpDiastolic", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pulse">Pulse (bpm)</Label>
          <Input
            id="pulse"
            type="number"
            placeholder="72"
            value={vitals.pulse || ""}
            onChange={(e) => updateVital("pulse", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="spo2">SpO2 (%)</Label>
          <Input
            id="spo2"
            type="number"
            placeholder="98"
            value={vitals.spo2 || ""}
            onChange={(e) => updateVital("spo2", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
          <Input
            id="respiratoryRate"
            type="number"
            placeholder="16"
            value={vitals.respiratoryRate || ""}
            onChange={(e) => updateVital("respiratoryRate", e.target.value)}
          />
        </div>

        {calculateBMI() && (
          <div>
            <Label>BMI</Label>
            <Input value={calculateBMI()} readOnly className="bg-gray-50" />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes about vital signs..."
          value={vitals.notes || ""}
          onChange={(e) => updateVital("notes", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )
}
