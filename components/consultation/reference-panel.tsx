"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ReferencePanelProps {
  consultationData: any
  patientData: any
}

export function ReferencePanel({ consultationData, patientData }: ReferencePanelProps) {
  // Provide default values to prevent undefined errors
  const consultation = consultationData || {}
  const patient = patientData || {}
  const vitals = consultation.vitals || {}
  const diagnosis = consultation.diagnosis || consultation.provisionalDiagnosis || []
  const allergies = patient.allergies || []

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Quick Reference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        {/* Patient Info */}
        <div>
          <h4 className="font-medium mb-1">Patient</h4>
          <div className="text-muted-foreground">
            {patient?.name || "—"} • {patient?.age || "—"}y • {patient?.gender || "—"}
          </div>
        </div>

        <Separator />

        {/* Key Vitals */}
        <div>
          <h4 className="font-medium mb-1">Key Vitals</h4>
          <div className="grid grid-cols-2 gap-1 text-muted-foreground">
            <div>
              BP:{" "}
              {vitals?.bloodPressure ||
                (vitals?.bpSystolic && vitals?.bpDiastolic ? `${vitals.bpSystolic}/${vitals.bpDiastolic}` : "—")}
            </div>
            <div>Pulse: {vitals?.pulse || "—"}</div>
            <div>Temp: {vitals?.temperature || "—"}</div>
            <div>SpO2: {vitals?.spo2 || "—"}</div>
          </div>
        </div>

        <Separator />

        {/* Active Diagnosis */}
        <div>
          <h4 className="font-medium mb-1">Diagnosis</h4>
          <div className="space-y-1">
            {diagnosis.length > 0 ? (
              <>
                {diagnosis.slice(0, 2).map((diagnosisItem: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs block w-full justify-start">
                    {diagnosisItem}
                  </Badge>
                ))}
                {diagnosis.length > 2 && <div className="text-muted-foreground">+{diagnosis.length - 2} more</div>}
              </>
            ) : (
              <div className="text-muted-foreground">No diagnosis yet</div>
            )}
          </div>
        </div>

        <Separator />

        {/* Allergies/Alerts */}
        <div>
          <h4 className="font-medium mb-1">Alerts</h4>
          <div className="space-y-1">
            {allergies.length > 0 ? (
              allergies.slice(0, 2).map((allergy: string, index: number) => (
                <Badge key={index} variant="destructive" className="text-xs block w-full justify-start">
                  {allergy}
                </Badge>
              ))
            ) : (
              <div className="text-muted-foreground">No known allergies</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
