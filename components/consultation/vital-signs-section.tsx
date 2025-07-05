"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Thermometer, Activity, Droplets, Scale, Ruler } from "lucide-react"

interface VitalSigns {
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  temperature?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  weight?: number
  height?: number
  bmi?: number
}

interface VitalSignsSectionProps {
  data: VitalSigns
  onChange: (data: VitalSigns) => void
}

export function VitalSignsSection({ data, onChange }: VitalSignsSectionProps) {
  const [localData, setLocalData] = useState<VitalSigns>(data || {})

  useEffect(() => {
    setLocalData(data || {})
  }, [data])

  useEffect(() => {
    onChange(localData)
  }, [localData, onChange])

  const updateVital = (field: keyof VitalSigns, value: string) => {
    const numValue = value === "" ? undefined : Number.parseFloat(value)
    setLocalData((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  // Calculate BMI when weight and height are available
  useEffect(() => {
    if (localData.weight && localData.height) {
      const heightInMeters = localData.height / 100
      const bmi = localData.weight / (heightInMeters * heightInMeters)
      setLocalData((prev) => ({
        ...prev,
        bmi: Math.round(bmi * 10) / 10,
      }))
    }
  }, [localData.weight, localData.height])

  const getBPStatus = (systolic?: number, diastolic?: number) => {
    if (!systolic || !diastolic) return { status: "Not recorded", color: "gray" }

    if (systolic < 90 || diastolic < 60) return { status: "Low", color: "blue" }
    if (systolic <= 120 && diastolic <= 80) return { status: "Normal", color: "green" }
    if (systolic <= 129 && diastolic <= 80) return { status: "Elevated", color: "yellow" }
    if (systolic <= 139 || diastolic <= 89) return { status: "Stage 1 High", color: "orange" }
    return { status: "Stage 2 High", color: "red" }
  }

  const getHeartRateStatus = (hr?: number) => {
    if (!hr) return { status: "Not recorded", color: "gray" }
    if (hr < 60) return { status: "Bradycardia", color: "blue" }
    if (hr <= 100) return { status: "Normal", color: "green" }
    return { status: "Tachycardia", color: "red" }
  }

  const getTemperatureStatus = (temp?: number) => {
    if (!temp) return { status: "Not recorded", color: "gray" }
    if (temp < 36.1) return { status: "Low", color: "blue" }
    if (temp <= 37.2) return { status: "Normal", color: "green" }
    if (temp <= 38.0) return { status: "Low Fever", color: "yellow" }
    if (temp <= 39.0) return { status: "Moderate Fever", color: "orange" }
    return { status: "High Fever", color: "red" }
  }

  const getSpO2Status = (spo2?: number) => {
    if (!spo2) return { status: "Not recorded", color: "gray" }
    if (spo2 >= 95) return { status: "Normal", color: "green" }
    if (spo2 >= 90) return { status: "Mild Hypoxemia", color: "yellow" }
    if (spo2 >= 85) return { status: "Moderate Hypoxemia", color: "orange" }
    return { status: "Severe Hypoxemia", color: "red" }
  }

  const getBMIStatus = (bmi?: number) => {
    if (!bmi) return { status: "Not calculated", color: "gray" }
    if (bmi < 18.5) return { status: "Underweight", color: "blue" }
    if (bmi <= 24.9) return { status: "Normal", color: "green" }
    if (bmi <= 29.9) return { status: "Overweight", color: "yellow" }
    if (bmi <= 34.9) return { status: "Obese Class I", color: "orange" }
    if (bmi <= 39.9) return { status: "Obese Class II", color: "red" }
    return { status: "Obese Class III", color: "red" }
  }

  const bpStatus = getBPStatus(localData.bloodPressureSystolic, localData.bloodPressureDiastolic)
  const hrStatus = getHeartRateStatus(localData.heartRate)
  const tempStatus = getTemperatureStatus(localData.temperature)
  const spo2Status = getSpO2Status(localData.oxygenSaturation)
  const bmiStatus = getBMIStatus(localData.bmi)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blood Pressure */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <Label className="font-medium">Blood Pressure</Label>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Systolic"
                    value={localData.bloodPressureSystolic || ""}
                    onChange={(e) => updateVital("bloodPressureSystolic", e.target.value)}
                  />
                </div>
                <span className="flex items-center text-gray-500">/</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Diastolic"
                    value={localData.bloodPressureDiastolic || ""}
                    onChange={(e) => updateVital("bloodPressureDiastolic", e.target.value)}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {localData.bloodPressureSystolic && localData.bloodPressureDiastolic && (
                  <span>
                    {localData.bloodPressureSystolic}/{localData.bloodPressureDiastolic} mmHg
                  </span>
                )}
              </div>
              <Badge
                variant={bpStatus.color === "green" ? "default" : "secondary"}
                className={`
                  ${bpStatus.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${bpStatus.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${bpStatus.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                  ${bpStatus.color === "red" ? "bg-red-100 text-red-800" : ""}
                  ${bpStatus.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                  ${bpStatus.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
                `}
              >
                {bpStatus.status}
              </Badge>
            </div>

            {/* Heart Rate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <Label className="font-medium">Heart Rate</Label>
              </div>
              <Input
                type="number"
                placeholder="BPM"
                value={localData.heartRate || ""}
                onChange={(e) => updateVital("heartRate", e.target.value)}
              />
              <div className="text-sm text-gray-600">
                {localData.heartRate && <span>{localData.heartRate} BPM</span>}
              </div>
              <Badge
                variant={hrStatus.color === "green" ? "default" : "secondary"}
                className={`
                  ${hrStatus.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${hrStatus.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                  ${hrStatus.color === "red" ? "bg-red-100 text-red-800" : ""}
                  ${hrStatus.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
                `}
              >
                {hrStatus.status}
              </Badge>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <Label className="font-medium">Temperature</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="°C"
                value={localData.temperature || ""}
                onChange={(e) => updateVital("temperature", e.target.value)}
              />
              <div className="text-sm text-gray-600">
                {localData.temperature && <span>{localData.temperature}°C</span>}
              </div>
              <Badge
                variant={tempStatus.color === "green" ? "default" : "secondary"}
                className={`
                  ${tempStatus.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${tempStatus.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${tempStatus.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                  ${tempStatus.color === "red" ? "bg-red-100 text-red-800" : ""}
                  ${tempStatus.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                  ${tempStatus.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
                `}
              >
                {tempStatus.status}
              </Badge>
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <Label className="font-medium">Respiratory Rate</Label>
              </div>
              <Input
                type="number"
                placeholder="Breaths/min"
                value={localData.respiratoryRate || ""}
                onChange={(e) => updateVital("respiratoryRate", e.target.value)}
              />
              <div className="text-sm text-gray-600">
                {localData.respiratoryRate && <span>{localData.respiratoryRate} breaths/min</span>}
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {localData.respiratoryRate ? "Recorded" : "Not recorded"}
              </Badge>
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                <Label className="font-medium">Oxygen Saturation</Label>
              </div>
              <Input
                type="number"
                placeholder="SpO2 %"
                value={localData.oxygenSaturation || ""}
                onChange={(e) => updateVital("oxygenSaturation", e.target.value)}
              />
              <div className="text-sm text-gray-600">
                {localData.oxygenSaturation && <span>{localData.oxygenSaturation}%</span>}
              </div>
              <Badge
                variant={spo2Status.color === "green" ? "default" : "secondary"}
                className={`
                  ${spo2Status.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${spo2Status.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${spo2Status.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                  ${spo2Status.color === "red" ? "bg-red-100 text-red-800" : ""}
                  ${spo2Status.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
                `}
              >
                {spo2Status.status}
              </Badge>
            </div>

            {/* Weight */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-purple-500" />
                <Label className="font-medium">Weight</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="kg"
                value={localData.weight || ""}
                onChange={(e) => updateVital("weight", e.target.value)}
              />
              <div className="text-sm text-gray-600">{localData.weight && <span>{localData.weight} kg</span>}</div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {localData.weight ? "Recorded" : "Not recorded"}
              </Badge>
            </div>

            {/* Height */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-green-500" />
                <Label className="font-medium">Height</Label>
              </div>
              <Input
                type="number"
                placeholder="cm"
                value={localData.height || ""}
                onChange={(e) => updateVital("height", e.target.value)}
              />
              <div className="text-sm text-gray-600">{localData.height && <span>{localData.height} cm</span>}</div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {localData.height ? "Recorded" : "Not recorded"}
              </Badge>
            </div>

            {/* BMI */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-500" />
                <Label className="font-medium">BMI</Label>
              </div>
              <Input
                type="number"
                step="0.1"
                placeholder="Auto-calculated"
                value={localData.bmi || ""}
                disabled
                className="bg-gray-50"
              />
              <div className="text-sm text-gray-600">{localData.bmi && <span>{localData.bmi} kg/m²</span>}</div>
              <Badge
                variant={bmiStatus.color === "green" ? "default" : "secondary"}
                className={`
                  ${bmiStatus.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${bmiStatus.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${bmiStatus.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                  ${bmiStatus.color === "red" ? "bg-red-100 text-red-800" : ""}
                  ${bmiStatus.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                  ${bmiStatus.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
                `}
              >
                {bmiStatus.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
