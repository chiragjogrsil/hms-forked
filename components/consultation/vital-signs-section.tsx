"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Thermometer, Activity, Droplets, Eye, Weight, Ruler, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface VitalSign {
  id: string
  name: string
  value: string
  unit: string
  normalRange: string
  status: "normal" | "high" | "low" | "critical"
  icon: React.ReactNode
  timestamp: string
}

interface VitalSignsSectionProps {
  patientId: string
  onVitalSignsUpdate?: (vitalSigns: VitalSign[]) => void
}

export function VitalSignsSection({ patientId, onVitalSignsUpdate }: VitalSignsSectionProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([
    {
      id: "temperature",
      name: "Temperature",
      value: "37.0",
      unit: "°C",
      normalRange: "36.1-37.2°C",
      status: "normal",
      icon: <Thermometer className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "blood-pressure-systolic",
      name: "Blood Pressure (Systolic)",
      value: "120",
      unit: "mmHg",
      normalRange: "90-140 mmHg",
      status: "normal",
      icon: <Heart className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "blood-pressure-diastolic",
      name: "Blood Pressure (Diastolic)",
      value: "80",
      unit: "mmHg",
      normalRange: "60-90 mmHg",
      status: "normal",
      icon: <Heart className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "heart-rate",
      name: "Heart Rate",
      value: "72",
      unit: "bpm",
      normalRange: "60-100 bpm",
      status: "normal",
      icon: <Activity className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "respiratory-rate",
      name: "Respiratory Rate",
      value: "16",
      unit: "breaths/min",
      normalRange: "12-20 breaths/min",
      status: "normal",
      icon: <Activity className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "oxygen-saturation",
      name: "Oxygen Saturation",
      value: "98",
      unit: "%",
      normalRange: "95-100%",
      status: "normal",
      icon: <Droplets className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "weight",
      name: "Weight",
      value: "70",
      unit: "kg",
      normalRange: "BMI 18.5-24.9",
      status: "normal",
      icon: <Weight className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
    {
      id: "height",
      name: "Height",
      value: "175",
      unit: "cm",
      normalRange: "Adult height",
      status: "normal",
      icon: <Ruler className="h-4 w-4" />,
      timestamp: new Date().toISOString(),
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800"
      case "high":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleVitalSignChange = (id: string, value: string) => {
    setVitalSigns((prev) =>
      prev.map((vital) =>
        vital.id === id
          ? {
              ...vital,
              value,
              timestamp: new Date().toISOString(),
              status: determineStatus(id, value),
            }
          : vital,
      ),
    )
  }

  const determineStatus = (id: string, value: string): "normal" | "high" | "low" | "critical" => {
    const numValue = Number.parseFloat(value)

    switch (id) {
      case "temperature":
        if (numValue < 36.1) return "low"
        if (numValue > 37.2 && numValue < 38.0) return "high"
        if (numValue >= 38.0) return "critical"
        return "normal"
      case "blood-pressure-systolic":
        if (numValue < 90) return "low"
        if (numValue > 140 && numValue < 160) return "high"
        if (numValue >= 160) return "critical"
        return "normal"
      case "blood-pressure-diastolic":
        if (numValue < 60) return "low"
        if (numValue > 90 && numValue < 100) return "high"
        if (numValue >= 100) return "critical"
        return "normal"
      case "heart-rate":
        if (numValue < 60) return "low"
        if (numValue > 100 && numValue < 120) return "high"
        if (numValue >= 120) return "critical"
        return "normal"
      case "oxygen-saturation":
        if (numValue < 90) return "critical"
        if (numValue < 95) return "low"
        return "normal"
      default:
        return "normal"
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onVitalSignsUpdate) {
        onVitalSignsUpdate(vitalSigns)
      }

      toast({
        title: "Vital signs updated",
        description: "Patient vital signs have been recorded successfully.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vital signs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values if needed
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              Vital Signs
            </CardTitle>
            <CardDescription>Record and monitor patient vital signs</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vitalSigns.map((vital) => (
            <div key={vital.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  {vital.icon}
                  {vital.name}
                </Label>
                <Badge className={getStatusColor(vital.status)} variant="secondary">
                  {vital.status}
                </Badge>
              </div>

              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={vital.value}
                    onChange={(e) => handleVitalSignChange(vital.id, e.target.value)}
                    className="flex-1"
                    step="0.1"
                  />
                  <span className="text-sm text-gray-500 min-w-fit">{vital.unit}</span>
                </div>
              ) : (
                <div className="text-2xl font-bold">
                  {vital.value} <span className="text-sm font-normal text-gray-500">{vital.unit}</span>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <div>Normal: {vital.normalRange}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {new Date(vital.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Blood Pressure Summary</h4>
            <div className="text-lg font-semibold">
              {vitalSigns.find((v) => v.id === "blood-pressure-systolic")?.value}/
              {vitalSigns.find((v) => v.id === "blood-pressure-diastolic")?.value} mmHg
            </div>
            <p className="text-sm text-gray-600">
              {vitalSigns.find((v) => v.id === "blood-pressure-systolic")?.status === "normal" &&
              vitalSigns.find((v) => v.id === "blood-pressure-diastolic")?.status === "normal"
                ? "Normal blood pressure"
                : "Blood pressure needs attention"}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">BMI Calculation</h4>
            <div className="text-lg font-semibold">
              {(() => {
                const weight = Number.parseFloat(vitalSigns.find((v) => v.id === "weight")?.value || "0")
                const height = Number.parseFloat(vitalSigns.find((v) => v.id === "height")?.value || "0") / 100
                const bmi = height > 0 ? (weight / (height * height)).toFixed(1) : "0"
                return `${bmi} kg/m²`
              })()}
            </div>
            <p className="text-sm text-gray-600">
              {(() => {
                const weight = Number.parseFloat(vitalSigns.find((v) => v.id === "weight")?.value || "0")
                const height = Number.parseFloat(vitalSigns.find((v) => v.id === "height")?.value || "0") / 100
                const bmi = height > 0 ? weight / (height * height) : 0
                if (bmi < 18.5) return "Underweight"
                if (bmi < 25) return "Normal weight"
                if (bmi < 30) return "Overweight"
                return "Obese"
              })()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
