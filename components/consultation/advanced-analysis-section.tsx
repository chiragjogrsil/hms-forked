"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AyurvedicAnalysis } from "./ayurvedic-analysis"
import { OphthalmologyAnalysis } from "./ophthalmology-analysis"
import { Brain, Eye, Stethoscope } from "lucide-react"

interface AdvancedAnalysisSectionProps {
  department: string
  data: any
  onChange: (data: any) => void
}

export function AdvancedAnalysisSection({ department, data, onChange }: AdvancedAnalysisSectionProps) {
  // Only show advanced analysis for specific departments
  const hasAdvancedAnalysis = ["ayurveda", "ophthalmology"].includes(department)

  if (!hasAdvancedAnalysis) {
    return null
  }

  const getDepartmentIcon = () => {
    switch (department) {
      case "ayurveda":
        return <Stethoscope className="h-5 w-5 text-green-600" />
      case "ophthalmology":
        return <Eye className="h-5 w-5 text-blue-600" />
      default:
        return <Brain className="h-5 w-5 text-purple-600" />
    }
  }

  const getDepartmentTitle = () => {
    switch (department) {
      case "ayurveda":
        return "Ayurvedic Analysis"
      case "ophthalmology":
        return "Ophthalmology Analysis"
      default:
        return "Advanced Analysis"
    }
  }

  const renderAnalysisComponent = () => {
    switch (department) {
      case "ayurveda":
        return <AyurvedicAnalysis data={data} onChange={onChange} />
      case "ophthalmology":
        return <OphthalmologyAnalysis data={data} onChange={onChange} />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getDepartmentIcon()}
          {getDepartmentTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderAnalysisComponent()}</CardContent>
    </Card>
  )
}
