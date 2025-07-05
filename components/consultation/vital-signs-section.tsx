"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Thermometer, Wind, Droplets, Weight, Ruler, Calculator } from "lucide-react"

interface VitalSigns {
  bloodPressure?: string
  pulse?: string
  temperature?: string
  respiratoryRate?: string
  spo2?: string
  weight?: string
  height?: string
  bmi?: string
}

interface VitalSignsSectionProps {
  data: VitalSigns
  onChange: (data: VitalSigns) => void
}

export function VitalSignsSection({ data = {}, onChange }: VitalSignsSectionProps) {
  const [localData, setLocalData] = useState<VitalSigns>(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  useEffect(() => {
    onChange(localData)
  }, [localData, onChange])

  const updateVital = (field: keyof VitalSigns, value: string) => {
    const updatedData = { ...localData, [field]: value }

    // Auto-calculate BMI when height and weight are available
    if ((field === "height" || field === "weight") && updatedData.height && updatedData.weight) {
      const heightInM = Number.parseFloat(updatedData.height) / 100
      const weightInKg = Number.parseFloat(updatedData.weight)
      if (heightInM > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInM * heightInM)).toFixed(1)
        updatedData.bmi = bmi
      }
    }

    setLocalData(updatedData)
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = Number.parseFloat(bmi)
    if (bmiValue < 18.5) return { category: "Underweight", color: "text-blue-600" }
    if (bmiValue < 25) return { category: "Normal", color: "text-green-600" }
    if (bmiValue < 30) return { category: "Overweight", color: "text-yellow-600" }
    return { category: "Obese", color: "text-red-600" }
  }

  const getBloodPressureCategory = (bp: string) => {
    const [systolic, diastolic] = bp.split("/").map((n) => Number.parseInt(n))
    if (systolic < 120 && diastolic < 80) return { category: "Normal", color: "text-green-600" }
    if (systolic < 130 && diastolic < 80) return { category: "Elevated", color: "text-yellow-600" }
    if (systolic < 140 || diastolic < 90) return { category: "Stage 1 HTN", color: "text-orange-600" }
    return { category: "Stage 2 HTN", color: "text-red-600" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-600" />
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label htmlFor="bloodPressure" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Blood Pressure (mmHg)
            </Label>
            <Input
              id="bloodPressure"
              value={localData.bloodPressure || ""}
              onChange={(e) => updateVital("bloodPressure", e.target.value)}
              placeholder="120/80"
            />
            {localData.bloodPressure && localData.bloodPressure.includes("/") && (
              <Badge variant="outline" className={getBloodPressureCategory(localData.bloodPressure).color}>
                {getBloodPressureCategory(localData.bloodPressure).category}
              </Badge>
            )}
          </div>

          {/* Pulse */}
          <div className="space-y-2">
            <Label htmlFor="pulse" className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-pink-500" />
              Pulse (bpm)
            </Label>
            <Input
              id="pulse"
              value={localData.pulse || ""}
              onChange={(e) => updateVital("pulse", e.target.value)}
              placeholder="72"
              type="number"
            />
            {localData.pulse && (
              <div className="text-xs text-gray-600">
                {Number.parseInt(localData.pulse) < 60
                  ? "Bradycardia"
                  : Number.parseInt(localData.pulse) > 100
                    ? "Tachycardia"
                    : "Normal"}
              </div>
            )}
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor="temperature" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              Temperature (°F)
            </Label>
            <Input
              id="temperature"
              value={localData.temperature || ""}
              onChange={(e) => updateVital("temperature", e.target.value)}
              placeholder="98.6"
              type="number"
              step="0.1"
            />
            {localData.temperature && (
              <div className="text-xs text-gray-600">
                {Number.parseFloat(localData.temperature) > 100.4
                  ? "Fever"
                  : Number.parseFloat(localData.temperature) < 96
                    ? "Hypothermia"
                    : "Normal"}
              </div>
            )}
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate" className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              Respiratory Rate (/min)
            </Label>
            <Input
              id="respiratoryRate"
              value={localData.respiratoryRate || ""}
              onChange={(e) => updateVital("respiratoryRate", e.target.value)}
              placeholder="16"
              type="number"
            />
            {localData.respiratoryRate && (
              <div className="text-xs text-gray-600">
                {Number.parseInt(localData.respiratoryRate) < 12
                  ? "Bradypnea"
                  : Number.parseInt(localData.respiratoryRate) > 20
                    ? "Tachypnea"
                    : "Normal"}
              </div>
            )}
          </div>

          {/* SpO2 */}
          <div className="space-y-2">
            <Label htmlFor="spo2" className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-500" />
              SpO2 (%)
            </Label>
            <Input
              id="spo2"
              value={localData.spo2 || ""}
              onChange={(e) => updateVital("spo2", e.target.value)}
              placeholder="98"
              type="number"
              min="0"
              max="100"
            />
            {localData.spo2 && (
              <div className="text-xs text-gray-600">{Number.parseInt(localData.spo2) < 95 ? "Low" : "Normal"}</div>
            )}
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-purple-500" />
              Weight (kg)
            </Label>
            <Input
              id="weight"
              value={localData.weight || ""}
              onChange={(e) => updateVital("weight", e.target.value)}
              placeholder="70"
              type="number"
              step="0.1"
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-green-500" />
              Height (cm)
            </Label>
            <Input
              id="height"
              value={localData.height || ""}
              onChange={(e) => updateVital("height", e.target.value)}
              placeholder="170"
              type="number"
            />
          </div>

          {/* BMI */}
          <div className="space-y-2">
            <Label htmlFor="bmi" className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-indigo-500" />
              BMI
            </Label>
            <Input
              id="bmi"
              value={localData.bmi || ""}
              onChange={(e) => updateVital("bmi", e.target.value)}
              placeholder="Auto-calculated"
              readOnly={!!(localData.height && localData.weight)}
            />
            {localData.bmi && (
              <Badge variant="outline" className={getBMICategory(localData.bmi).color}>
                {getBMICategory(localData.bmi).category}
              </Badge>
            )}
          </div>
        </div>

        {/* Summary */}
        {Object.keys(localData).some((key) => localData[key as keyof VitalSigns]) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Vital Signs Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {localData.bloodPressure && (
                <div>
                  <span className="font-medium">BP:</span> {localData.bloodPressure} mmHg
                </div>
              )}
              {localData.pulse && (
                <div>
                  <span className="font-medium">Pulse:</span> {localData.pulse} bpm
                </div>
              )}
              {localData.temperature && (
                <div>
                  <span className="font-medium">Temp:</span> {localData.temperature}°F
                </div>
              )}
              {localData.spo2 && (
                <div>
                  <span className="font-medium">SpO2:</span> {localData.spo2}%
                </div>
              )}
              {localData.weight && (
                <div>
                  <span className="font-medium">Weight:</span> {localData.weight} kg
                </div>
              )}
              {localData.height && (
                <div>
                  <span className="font-medium">Height:</span> {localData.height} cm
                </div>
              )}
              {localData.bmi && (
                <div>
                  <span className="font-medium">BMI:</span> {localData.bmi}
                </div>
              )}
              {localData.respiratoryRate && (
                <div>
                  <span className="font-medium">RR:</span> {localData.respiratoryRate}/min
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
