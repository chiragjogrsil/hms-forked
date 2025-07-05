"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

export function VitalSignsSection({ data, onChange }: VitalSignsSectionProps) {
  const [vitals, setVitals] = useState<VitalSigns>(data || {})

  useEffect(() => {
    setVitals(data || {})
  }, [data])

  useEffect(() => {
    onChange(vitals)
  }, [vitals, onChange])

  const updateVital = (field: keyof VitalSigns, value: string) => {
    const newVitals = { ...vitals, [field]: value }

    // Auto-calculate BMI when weight and height are available
    if ((field === "weight" || field === "height") && newVitals.weight && newVitals.height) {
      const weightKg = Number.parseFloat(newVitals.weight)
      const heightM = Number.parseFloat(newVitals.height) / 100 // Convert cm to m
      if (weightKg > 0 && heightM > 0) {
        const bmi = (weightKg / (heightM * heightM)).toFixed(1)
        newVitals.bmi = bmi
      }
    }

    setVitals(newVitals)
  }

  const getBPStatus = (bp: string) => {
    if (!bp) return null
    const [systolic, diastolic] = bp.split("/").map((n) => Number.parseInt(n))
    if (isNaN(systolic) || isNaN(diastolic)) return null

    if (systolic < 90 || diastolic < 60) return { status: "Low", color: "bg-blue-100 text-blue-800" }
    if (systolic < 120 && diastolic < 80) return { status: "Normal", color: "bg-green-100 text-green-800" }
    if (systolic < 130 && diastolic < 80) return { status: "Elevated", color: "bg-yellow-100 text-yellow-800" }
    if (systolic < 140 || diastolic < 90) return { status: "Stage 1", color: "bg-orange-100 text-orange-800" }
    return { status: "Stage 2", color: "bg-red-100 text-red-800" }
  }

  const getPulseStatus = (pulse: string) => {
    if (!pulse) return null
    const rate = Number.parseInt(pulse)
    if (isNaN(rate)) return null

    if (rate < 60) return { status: "Bradycardia", color: "bg-blue-100 text-blue-800" }
    if (rate <= 100) return { status: "Normal", color: "bg-green-100 text-green-800" }
    return { status: "Tachycardia", color: "bg-red-100 text-red-800" }
  }

  const getTempStatus = (temp: string) => {
    if (!temp) return null
    const temperature = Number.parseFloat(temp)
    if (isNaN(temperature)) return null

    if (temperature < 36.1) return { status: "Low", color: "bg-blue-100 text-blue-800" }
    if (temperature <= 37.2) return { status: "Normal", color: "bg-green-100 text-green-800" }
    if (temperature <= 38.0) return { status: "Low Fever", color: "bg-yellow-100 text-yellow-800" }
    if (temperature <= 39.0) return { status: "Moderate Fever", color: "bg-orange-100 text-orange-800" }
    return { status: "High Fever", color: "bg-red-100 text-red-800" }
  }

  const getBMIStatus = (bmi: string) => {
    if (!bmi) return null
    const bmiValue = Number.parseFloat(bmi)
    if (isNaN(bmiValue)) return null

    if (bmiValue < 18.5) return { status: "Underweight", color: "bg-blue-100 text-blue-800" }
    if (bmiValue < 25) return { status: "Normal", color: "bg-green-100 text-green-800" }
    if (bmiValue < 30) return { status: "Overweight", color: "bg-yellow-100 text-yellow-800" }
    return { status: "Obese", color: "bg-red-100 text-red-800" }
  }

  const getSpo2Status = (spo2: string) => {
    if (!spo2) return null
    const oxygen = Number.parseInt(spo2)
    if (isNaN(oxygen)) return null

    if (oxygen < 90) return { status: "Critical", color: "bg-red-100 text-red-800" }
    if (oxygen < 95) return { status: "Low", color: "bg-orange-100 text-orange-800" }
    return { status: "Normal", color: "bg-green-100 text-green-800" }
  }

  const bpStatus = getBPStatus(vitals.bloodPressure || "")
  const pulseStatus = getPulseStatus(vitals.pulse || "")
  const tempStatus = getTempStatus(vitals.temperature || "")
  const bmiStatus = getBMIStatus(vitals.bmi || "")
  const spo2Status = getSpo2Status(vitals.spo2 || "")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Blood Pressure */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-red-500" />
            Blood Pressure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="120/80"
            value={vitals.bloodPressure || ""}
            onChange={(e) => updateVital("bloodPressure", e.target.value)}
          />
          <div className="text-xs text-gray-500">mmHg (Systolic/Diastolic)</div>
          {bpStatus && <Badge className={bpStatus.color}>{bpStatus.status}</Badge>}
        </CardContent>
      </Card>

      {/* Pulse Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-blue-500" />
            Pulse Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="72" value={vitals.pulse || ""} onChange={(e) => updateVital("pulse", e.target.value)} />
          <div className="text-xs text-gray-500">beats per minute</div>
          {pulseStatus && <Badge className={pulseStatus.color}>{pulseStatus.status}</Badge>}
        </CardContent>
      </Card>

      {/* Temperature */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Thermometer className="h-4 w-4 text-orange-500" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="98.6"
            value={vitals.temperature || ""}
            onChange={(e) => updateVital("temperature", e.target.value)}
          />
          <div className="text-xs text-gray-500">°F</div>
          {tempStatus && <Badge className={tempStatus.color}>{tempStatus.status}</Badge>}
        </CardContent>
      </Card>

      {/* Respiratory Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wind className="h-4 w-4 text-teal-500" />
            Respiratory Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="16"
            value={vitals.respiratoryRate || ""}
            onChange={(e) => updateVital("respiratoryRate", e.target.value)}
          />
          <div className="text-xs text-gray-500">breaths per minute</div>
        </CardContent>
      </Card>

      {/* SpO2 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Droplets className="h-4 w-4 text-cyan-500" />
            SpO2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="98" value={vitals.spo2 || ""} onChange={(e) => updateVital("spo2", e.target.value)} />
          <div className="text-xs text-gray-500">% oxygen saturation</div>
          {spo2Status && <Badge className={spo2Status.color}>{spo2Status.status}</Badge>}
        </CardContent>
      </Card>

      {/* Weight */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Weight className="h-4 w-4 text-purple-500" />
            Weight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input placeholder="70" value={vitals.weight || ""} onChange={(e) => updateVital("weight", e.target.value)} />
          <div className="text-xs text-gray-500">kg</div>
        </CardContent>
      </Card>

      {/* Height */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Ruler className="h-4 w-4 text-indigo-500" />
            Height
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="175"
            value={vitals.height || ""}
            onChange={(e) => updateVital("height", e.target.value)}
          />
          <div className="text-xs text-gray-500">cm</div>
        </CardContent>
      </Card>

      {/* BMI */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4 text-green-500" />
            BMI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Auto-calculated"
            value={vitals.bmi || ""}
            onChange={(e) => updateVital("bmi", e.target.value)}
            className="bg-gray-50"
          />
          <div className="text-xs text-gray-500">kg/m² (auto-calculated)</div>
          {bmiStatus && <Badge className={bmiStatus.color}>{bmiStatus.status}</Badge>}
        </CardContent>
      </Card>
    </div>
  )
}
