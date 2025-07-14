"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useVisitWorkflow } from "@/contexts/visit-workflow-context"
import { toast } from "sonner"
import { AlertTriangle, Info } from "lucide-react"

// Normal ranges for vital signs
const VITAL_RANGES = {
  temperature: { min: 35.0, max: 42.0, normal: { min: 36.1, max: 37.2 } },
  systolic: { min: 70, max: 250, normal: { min: 90, max: 140 } },
  diastolic: { min: 40, max: 150, normal: { min: 60, max: 90 } },
  pulse: { min: 30, max: 200, normal: { min: 60, max: 100 } },
  respiratory: { min: 8, max: 40, normal: { min: 12, max: 20 } },
  oxygen: { min: 70, max: 100, normal: { min: 95, max: 100 } },
  height: { min: 50, max: 250, normal: { min: 140, max: 200 } },
  weight: { min: 10, max: 300, normal: { min: 40, max: 120 } },
}

export function VitalSignsStep() {
  const { completeStep } = useVisitWorkflow()
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    pulse: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    height: "",
    weight: "",
    bmi: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})

  // Validation function
  const validateVital = (field: string, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!value || isNaN(numValue)) return { error: "", warning: "" }

    let range
    switch (field) {
      case "temperature":
        range = VITAL_RANGES.temperature
        break
      case "bloodPressureSystolic":
        range = VITAL_RANGES.systolic
        break
      case "bloodPressureDiastolic":
        range = VITAL_RANGES.diastolic
        break
      case "pulse":
        range = VITAL_RANGES.pulse
        break
      case "respiratoryRate":
        range = VITAL_RANGES.respiratory
        break
      case "oxygenSaturation":
        range = VITAL_RANGES.oxygen
        break
      case "height":
        range = VITAL_RANGES.height
        break
      case "weight":
        range = VITAL_RANGES.weight
        break
      default:
        return { error: "", warning: "" }
    }

    if (numValue < range.min || numValue > range.max) {
      return { error: `Value must be between ${range.min} and ${range.max}`, warning: "" }
    }

    if (numValue < range.normal.min || numValue > range.normal.max) {
      return { error: "", warning: `Outside normal range (${range.normal.min}-${range.normal.max})` }
    }

    return { error: "", warning: "" }
  }

  // Auto-calculate BMI when height or weight changes
  useEffect(() => {
    const height = Number.parseFloat(vitalSigns.height)
    const weight = Number.parseFloat(vitalSigns.weight)

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      setVitalSigns((prev) => ({ ...prev, bmi: bmi.toFixed(1) }))
    } else {
      setVitalSigns((prev) => ({ ...prev, bmi: "" }))
    }
  }, [vitalSigns.height, vitalSigns.weight])

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return

    setVitalSigns((prev) => ({ ...prev, [field]: value }))

    // Validate the input
    const { error, warning } = validateVital(field, value)

    setErrors((prev) => ({ ...prev, [field]: error }))
    setWarnings((prev) => ({ ...prev, [field]: warning }))
  }

  const getInputClassName = (field: string) => {
    if (errors[field]) return "border-red-500 focus:border-red-500"
    if (warnings[field]) return "border-orange-500 focus:border-orange-500"
    return ""
  }

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (bmi < 25) return { status: "Normal", color: "text-green-600", bgColor: "bg-green-50" }
    if (bmi < 30) return { status: "Overweight", color: "text-orange-600", bgColor: "bg-orange-50" }
    return { status: "Obese", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check for errors
    const hasErrors = Object.values(errors).some((error) => error !== "")
    if (hasErrors) {
      toast.error("Please correct the errors before submitting")
      return
    }

    // Validate required fields
    if (!vitalSigns.temperature || !vitalSigns.bloodPressureSystolic || !vitalSigns.pulse) {
      toast.error("Please fill in the required vital signs")
      return
    }

    completeStep("vitals", vitalSigns)
    toast.success("Vital signs recorded successfully!")
  }

  const bmiValue = Number.parseFloat(vitalSigns.bmi)
  const bmiInfo = bmiValue ? getBMIStatus(bmiValue) : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Vital Signs</CardTitle>
        <CardDescription>Enter the patient's current vital signs with validation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Temperature */}
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-1">
                Temperature (°C) *<span className="text-xs text-muted-foreground">(36.1-37.2)</span>
              </Label>
              <Input
                id="temperature"
                type="text"
                placeholder="36.5"
                value={vitalSigns.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
                className={getInputClassName("temperature")}
                required
              />
              {errors.temperature && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.temperature}
                </p>
              )}
              {warnings.temperature && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.temperature}
                </p>
              )}
            </div>

            {/* Blood Pressure Systolic */}
            <div className="space-y-2">
              <Label htmlFor="systolic" className="flex items-center gap-1">
                BP Systolic (mmHg) *<span className="text-xs text-muted-foreground">(90-140)</span>
              </Label>
              <Input
                id="systolic"
                type="text"
                placeholder="120"
                value={vitalSigns.bloodPressureSystolic}
                onChange={(e) => handleInputChange("bloodPressureSystolic", e.target.value)}
                className={getInputClassName("bloodPressureSystolic")}
                required
              />
              {errors.bloodPressureSystolic && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.bloodPressureSystolic}
                </p>
              )}
              {warnings.bloodPressureSystolic && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.bloodPressureSystolic}
                </p>
              )}
            </div>

            {/* Blood Pressure Diastolic */}
            <div className="space-y-2">
              <Label htmlFor="diastolic" className="flex items-center gap-1">
                BP Diastolic (mmHg) *<span className="text-xs text-muted-foreground">(60-90)</span>
              </Label>
              <Input
                id="diastolic"
                type="text"
                placeholder="80"
                value={vitalSigns.bloodPressureDiastolic}
                onChange={(e) => handleInputChange("bloodPressureDiastolic", e.target.value)}
                className={getInputClassName("bloodPressureDiastolic")}
                required
              />
              {errors.bloodPressureDiastolic && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.bloodPressureDiastolic}
                </p>
              )}
              {warnings.bloodPressureDiastolic && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.bloodPressureDiastolic}
                </p>
              )}
            </div>

            {/* Pulse */}
            <div className="space-y-2">
              <Label htmlFor="pulse" className="flex items-center gap-1">
                Pulse (bpm) *<span className="text-xs text-muted-foreground">(60-100)</span>
              </Label>
              <Input
                id="pulse"
                type="text"
                placeholder="72"
                value={vitalSigns.pulse}
                onChange={(e) => handleInputChange("pulse", e.target.value)}
                className={getInputClassName("pulse")}
                required
              />
              {errors.pulse && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.pulse}
                </p>
              )}
              {warnings.pulse && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.pulse}
                </p>
              )}
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-2">
              <Label htmlFor="respiratory" className="flex items-center gap-1">
                Respiratory Rate
                <span className="text-xs text-muted-foreground">(12-20)</span>
              </Label>
              <Input
                id="respiratory"
                type="text"
                placeholder="16"
                value={vitalSigns.respiratoryRate}
                onChange={(e) => handleInputChange("respiratoryRate", e.target.value)}
                className={getInputClassName("respiratoryRate")}
              />
              {errors.respiratoryRate && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.respiratoryRate}
                </p>
              )}
              {warnings.respiratoryRate && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.respiratoryRate}
                </p>
              )}
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-2">
              <Label htmlFor="oxygen" className="flex items-center gap-1">
                Oxygen Saturation (%)
                <span className="text-xs text-muted-foreground">(95-100)</span>
              </Label>
              <Input
                id="oxygen"
                type="text"
                placeholder="98"
                value={vitalSigns.oxygenSaturation}
                onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                className={getInputClassName("oxygenSaturation")}
              />
              {errors.oxygenSaturation && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.oxygenSaturation}
                </p>
              )}
              {warnings.oxygenSaturation && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.oxygenSaturation}
                </p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-1">
                Height (cm)
                <span className="text-xs text-muted-foreground">(140-200)</span>
              </Label>
              <Input
                id="height"
                type="text"
                placeholder="170"
                value={vitalSigns.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className={getInputClassName("height")}
              />
              {errors.height && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.height}
                </p>
              )}
              {warnings.height && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.height}
                </p>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-1">
                Weight (kg)
                <span className="text-xs text-muted-foreground">(40-120)</span>
              </Label>
              <Input
                id="weight"
                type="text"
                placeholder="70"
                value={vitalSigns.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className={getInputClassName("weight")}
              />
              {errors.weight && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.weight}
                </p>
              )}
              {warnings.weight && (
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {warnings.weight}
                </p>
              )}
            </div>

            {/* BMI */}
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI (kg/m²)</Label>
              <div className="space-y-1">
                <Input
                  id="bmi"
                  type="text"
                  placeholder="Auto-calculated"
                  value={vitalSigns.bmi}
                  readOnly
                  className="bg-slate-50 text-slate-600"
                />
                {bmiInfo && (
                  <div className={`text-xs font-medium px-2 py-1 rounded ${bmiInfo.bgColor} ${bmiInfo.color}`}>
                    {bmiInfo.status}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional observations or notes"
              value={vitalSigns.notes}
              onChange={(e) => setVitalSigns((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
              Complete Vital Signs & Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
