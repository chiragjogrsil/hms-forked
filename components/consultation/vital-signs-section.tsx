"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Activity, Heart, Thermometer, Wind, Droplets, Weight, Ruler, Calculator } from "lucide-react"
import { useConsultation } from "@/contexts/consultation-context"

interface VitalSignsSectionProps {
  patientId: string
  patientName: string
}

export function VitalSignsSection({ patientId, patientName }: VitalSignsSectionProps) {
  const { activeConsultation, updateConsultationData } = useConsultation()

  const [vitals, setVitals] = useState({
    bloodPressure: "",
    pulse: "",
    temperature: "",
    respiratoryRate: "",
    spo2: "",
    weight: "",
    height: "",
    bmi: "",
  })

  // Load vitals from active consultation only when consultation ID changes
  useEffect(() => {
    if (activeConsultation?.vitals) {
      setVitals({
        bloodPressure: activeConsultation.vitals.bloodPressure || "",
        pulse: activeConsultation.vitals.pulse || "",
        temperature: activeConsultation.vitals.temperature || "",
        respiratoryRate: activeConsultation.vitals.respiratoryRate || "",
        spo2: activeConsultation.vitals.spo2 || "",
        weight: activeConsultation.vitals.weight || "",
        height: activeConsultation.vitals.height || "",
        bmi: activeConsultation.vitals.bmi || "",
      })
    }
  }, [activeConsultation?.id]) // Only depend on consultation ID

  // Auto-calculate BMI when weight or height changes
  useEffect(() => {
    if (vitals.weight && vitals.height) {
      const weightKg = Number.parseFloat(vitals.weight)
      const heightM = Number.parseFloat(vitals.height) / 100 // Convert cm to m
      if (weightKg > 0 && heightM > 0) {
        const bmiValue = (weightKg / (heightM * heightM)).toFixed(1)
        setVitals((prev) => ({ ...prev, bmi: bmiValue }))
      }
    }
  }, [vitals.weight, vitals.height])

  // Memoized auto-save function
  const autoSave = useCallback(() => {
    if (activeConsultation) {
      updateConsultationData({ vitals })
    }
  }, [activeConsultation, vitals, updateConsultationData]) // Updated dependency

  // Debounced auto-save
  useEffect(() => {
    if (!activeConsultation) return

    const timer = setTimeout(() => {
      autoSave()
    }, 2000) // 2 second delay

    return () => clearTimeout(timer)
  }, [autoSave])

  const handleVitalChange = useCallback((field: string, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }))
  }, [])

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

    if (temperature < 97) return { status: "Low", color: "bg-blue-100 text-blue-800" }
    if (temperature <= 99.5) return { status: "Normal", color: "bg-green-100 text-green-800" }
    if (temperature <= 100.4) return { status: "Low Fever", color: "bg-yellow-100 text-yellow-800" }
    return { status: "Fever", color: "bg-red-100 text-red-800" }
  }

  const getSpo2Status = (spo2: string) => {
    if (!spo2) return null
    const oxygen = Number.parseInt(spo2)
    if (isNaN(oxygen)) return null

    if (oxygen < 90) return { status: "Critical", color: "bg-red-100 text-red-800" }
    if (oxygen < 95) return { status: "Low", color: "bg-orange-100 text-orange-800" }
    return { status: "Normal", color: "bg-green-100 text-green-800" }
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

  if (!activeConsultation) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Consultation</h3>
          <p className="text-muted-foreground">Start a consultation to record vital signs</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label htmlFor="bloodPressure" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Blood Pressure
            </Label>
            <Input
              id="bloodPressure"
              placeholder="120/80"
              value={vitals.bloodPressure}
              onChange={(e) => handleVitalChange("bloodPressure", e.target.value)}
            />
            {getBPStatus(vitals.bloodPressure) && (
              <Badge className={getBPStatus(vitals.bloodPressure)!.color}>
                {getBPStatus(vitals.bloodPressure)!.status}
              </Badge>
            )}
          </div>

          {/* Pulse */}
          <div className="space-y-2">
            <Label htmlFor="pulse" className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Pulse (bpm)
            </Label>
            <Input
              id="pulse"
              placeholder="72"
              type="number"
              value={vitals.pulse}
              onChange={(e) => handleVitalChange("pulse", e.target.value)}
            />
            {getPulseStatus(vitals.pulse) && (
              <Badge className={getPulseStatus(vitals.pulse)!.color}>{getPulseStatus(vitals.pulse)!.status}</Badge>
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
              placeholder="98.6"
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => handleVitalChange("temperature", e.target.value)}
            />
            {getTempStatus(vitals.temperature) && (
              <Badge className={getTempStatus(vitals.temperature)!.color}>
                {getTempStatus(vitals.temperature)!.status}
              </Badge>
            )}
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate" className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              Respiratory Rate
            </Label>
            <Input
              id="respiratoryRate"
              placeholder="16"
              type="number"
              value={vitals.respiratoryRate}
              onChange={(e) => handleVitalChange("respiratoryRate", e.target.value)}
            />
          </div>

          {/* SpO2 */}
          <div className="space-y-2">
            <Label htmlFor="spo2" className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-500" />
              SpO2 (%)
            </Label>
            <Input
              id="spo2"
              placeholder="98"
              type="number"
              value={vitals.spo2}
              onChange={(e) => handleVitalChange("spo2", e.target.value)}
            />
            {getSpo2Status(vitals.spo2) && (
              <Badge className={getSpo2Status(vitals.spo2)!.color}>{getSpo2Status(vitals.spo2)!.status}</Badge>
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
              placeholder="70"
              type="number"
              step="0.1"
              value={vitals.weight}
              onChange={(e) => handleVitalChange("weight", e.target.value)}
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-indigo-500" />
              Height (cm)
            </Label>
            <Input
              id="height"
              placeholder="175"
              type="number"
              value={vitals.height}
              onChange={(e) => handleVitalChange("height", e.target.value)}
            />
          </div>

          {/* BMI */}
          <div className="space-y-2">
            <Label htmlFor="bmi" className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-teal-500" />
              BMI
            </Label>
            <Input id="bmi" placeholder="Auto-calculated" value={vitals.bmi} readOnly className="bg-gray-50" />
            {getBMIStatus(vitals.bmi) && (
              <Badge className={getBMIStatus(vitals.bmi)!.color}>{getBMIStatus(vitals.bmi)!.status}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
