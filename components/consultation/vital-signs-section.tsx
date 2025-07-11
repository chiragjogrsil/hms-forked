"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface VitalSignsSectionProps {
  data: any
  onChange: (data: any) => void
}

// Define normal ranges for vital signs
const VITAL_RANGES = {
  bloodPressure: {
    systolic: { min: 70, max: 250, normal: [90, 140] },
    diastolic: { min: 40, max: 150, normal: [60, 90] },
  },
  pulse: { min: 40, max: 200, normal: [60, 100] },
  temperature: { min: 35, max: 42, normal: [36.1, 37.2] },
  spo2: { min: 70, max: 100, normal: [95, 100] },
  respiratoryRate: { min: 8, max: 40, normal: [12, 20] },
  height: { min: 30, max: 250, normal: [150, 200] },
  weight: { min: 2, max: 300, normal: [50, 100] },
}

const validateVitalSign = (
  value: string,
  type: string,
): { isValid: boolean; status: "normal" | "warning" | "error"; message?: string } => {
  if (!value || value === "") return { isValid: true, status: "normal" }

  const numValue = Number.parseFloat(value)
  if (isNaN(numValue)) return { isValid: false, status: "error", message: "Invalid number" }

  const range = VITAL_RANGES[type as keyof typeof VITAL_RANGES]
  if (!range) return { isValid: true, status: "normal" }

  // Handle blood pressure separately since it has a different structure
  if (type === "bloodPressure") {
    return { isValid: true, status: "normal" }
  }

  if (numValue < range.min || numValue > range.max) {
    return { isValid: false, status: "error", message: `Value must be between ${range.min} and ${range.max}` }
  }

  if (numValue < range.normal[0] || numValue > range.normal[1]) {
    return { isValid: true, status: "warning", message: `Outside normal range (${range.normal[0]}-${range.normal[1]})` }
  }

  return { isValid: true, status: "normal" }
}

const validateBloodPressure = (
  bp: string,
): { isValid: boolean; status: "normal" | "warning" | "error"; message?: string } => {
  if (!bp || bp === "") return { isValid: true, status: "normal" }

  const bpPattern = /^(\d+)\/(\d+)$/
  const match = bp.match(bpPattern)

  if (!match) {
    return { isValid: false, status: "error", message: "Format: 120/80" }
  }

  const systolic = Number.parseInt(match[1])
  const diastolic = Number.parseInt(match[2])

  const systolicRange = VITAL_RANGES.bloodPressure.systolic
  const diastolicRange = VITAL_RANGES.bloodPressure.diastolic

  // Check if values are within valid ranges
  if (
    systolic < systolicRange.min ||
    systolic > systolicRange.max ||
    diastolic < diastolicRange.min ||
    diastolic > diastolicRange.max
  ) {
    return { isValid: false, status: "error", message: "Invalid blood pressure values" }
  }

  // Check if values are within normal ranges
  if (
    systolic < systolicRange.normal[0] ||
    systolic > systolicRange.normal[1] ||
    diastolic < diastolicRange.normal[0] ||
    diastolic > diastolicRange.normal[1]
  ) {
    return { isValid: true, status: "warning", message: "Outside normal range (90-140/60-90)" }
  }

  return { isValid: true, status: "normal" }
}

const getStatusIcon = (status: "normal" | "warning" | "error") => {
  switch (status) {
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />
    case "normal":
      return <CheckCircle className="h-4 w-4 text-green-500" />
  }
}

const getInputClassName = (status: "normal" | "warning" | "error") => {
  const baseClass = "flex-1"
  switch (status) {
    case "error":
      return `${baseClass} border-red-500 focus:border-red-500`
    case "warning":
      return `${baseClass} border-orange-500 focus:border-orange-500`
    default:
      return baseClass
  }
}

export function VitalSignsSection({ data, onChange }: VitalSignsSectionProps) {
  // Ensure data is always an object with default values
  const safeData = data || {}

  const updateVital = (field: string, value: string) => {
    const updatedData = {
      ...safeData,
      [field]: value,
    }
    onChange(updatedData)
  }

  // Auto-calculate BMI when height or weight changes
  useEffect(() => {
    const height = Number.parseFloat(safeData.height || "0")
    const weight = Number.parseFloat(safeData.weight || "0")

    if (height > 0 && weight > 0) {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)

      if (safeData.bmi !== bmi.toFixed(1)) {
        const updatedData = {
          ...safeData,
          bmi: bmi.toFixed(1),
        }
        onChange(updatedData)
      }
    } else if (safeData.bmi) {
      const updatedData = {
        ...safeData,
        bmi: "",
      }
      onChange(updatedData)
    }
  }, [safeData.height, safeData.weight, onChange, safeData])

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-blue-600" }
    if (bmi < 25) return { status: "Normal", color: "text-green-600" }
    if (bmi < 30) return { status: "Overweight", color: "text-orange-600" }
    return { status: "Obese", color: "text-red-600" }
  }

  const bmiValue = Number.parseFloat(safeData.bmi || "0")
  const bmiInfo = bmiValue > 0 ? getBMIStatus(bmiValue) : null

  // Validation states
  const bpValidation = validateBloodPressure(safeData.bloodPressure || "")
  const pulseValidation = validateVitalSign(safeData.pulse || "", "pulse")
  const tempValidation = validateVitalSign(safeData.temperature || "", "temperature")
  const spo2Validation = validateVitalSign(safeData.spo2 || "", "spo2")
  const respValidation = validateVitalSign(safeData.respiratoryRate || "", "respiratoryRate")
  const heightValidation = validateVitalSign(safeData.height || "", "height")
  const weightValidation = validateVitalSign(safeData.weight || "", "weight")

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="bp" className="flex items-center gap-2">
          Blood Pressure
          {safeData.bloodPressure && getStatusIcon(bpValidation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="bp"
            placeholder="120/80"
            value={safeData.bloodPressure || ""}
            onChange={(e) => updateVital("bloodPressure", e.target.value)}
            className={getInputClassName(bpValidation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[45px]">mmHg</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 90-140/60-90</div>
        {bpValidation.message && (
          <div className={`text-xs mt-1 ${bpValidation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {bpValidation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="pulse" className="flex items-center gap-2">
          Pulse Rate
          {safeData.pulse && getStatusIcon(pulseValidation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="pulse"
            placeholder="72"
            type="number"
            min="40"
            max="200"
            value={safeData.pulse || ""}
            onChange={(e) => updateVital("pulse", e.target.value)}
            className={getInputClassName(pulseValidation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[35px]">bpm</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 60-100</div>
        {pulseValidation.message && (
          <div className={`text-xs mt-1 ${pulseValidation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {pulseValidation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="temp" className="flex items-center gap-2">
          Temperature
          {safeData.temperature && getStatusIcon(tempValidation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="temp"
            placeholder="98.6"
            type="number"
            step="0.1"
            min="35"
            max="42"
            value={safeData.temperature || ""}
            onChange={(e) => updateVital("temperature", e.target.value)}
            className={getInputClassName(tempValidation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[25px]">°F</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 36.1-37.2</div>
        {tempValidation.message && (
          <div className={`text-xs mt-1 ${tempValidation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {tempValidation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="spo2" className="flex items-center gap-2">
          SpO2
          {safeData.spo2 && getStatusIcon(spo2Validation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="spo2"
            placeholder="99"
            type="number"
            min="70"
            max="100"
            value={safeData.spo2 || ""}
            onChange={(e) => updateVital("spo2", e.target.value)}
            className={getInputClassName(spo2Validation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[20px]">%</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 95-100</div>
        {spo2Validation.message && (
          <div className={`text-xs mt-1 ${spo2Validation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {spo2Validation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="resp" className="flex items-center gap-2">
          Respiratory Rate
          {safeData.respiratoryRate && getStatusIcon(respValidation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="resp"
            placeholder="16"
            type="number"
            min="8"
            max="40"
            value={safeData.respiratoryRate || ""}
            onChange={(e) => updateVital("respiratoryRate", e.target.value)}
            className={getInputClassName(respValidation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[35px]">/min</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 12-20</div>
        {respValidation.message && (
          <div className={`text-xs mt-1 ${respValidation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {respValidation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="weight" className="flex items-center gap-2">
          Weight
          {safeData.weight && getStatusIcon(weightValidation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="weight"
            placeholder="70"
            type="number"
            step="0.1"
            min="2"
            max="300"
            value={safeData.weight || ""}
            onChange={(e) => updateVital("weight", e.target.value)}
            className={getInputClassName(weightValidation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[25px]">kg</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 50-100</div>
        {weightValidation.message && (
          <div className={`text-xs mt-1 ${weightValidation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {weightValidation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="height" className="flex items-center gap-2">
          Height
          {safeData.height && getStatusIcon(heightValidation.status)}
        </Label>
        <div className="flex items-center gap-1">
          <Input
            id="height"
            placeholder="170"
            type="number"
            min="30"
            max="250"
            value={safeData.height || ""}
            onChange={(e) => updateVital("height", e.target.value)}
            className={getInputClassName(heightValidation.status)}
          />
          <span className="text-sm text-muted-foreground font-medium min-w-[25px]">cm</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Normal: 150-200</div>
        {heightValidation.message && (
          <div className={`text-xs mt-1 ${heightValidation.status === "error" ? "text-red-500" : "text-orange-500"}`}>
            {heightValidation.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="bmi">BMI</Label>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Input
              id="bmi"
              placeholder="Auto-calculated"
              value={safeData.bmi || ""}
              className="flex-1 bg-slate-50 text-slate-600"
              readOnly
            />
            <span className="text-sm text-muted-foreground font-medium min-w-[35px]">kg/m²</span>
          </div>
          {bmiInfo && <p className={`text-xs font-medium ${bmiInfo.color}`}>{bmiInfo.status}</p>}
        </div>
      </div>
    </div>
  )
}
