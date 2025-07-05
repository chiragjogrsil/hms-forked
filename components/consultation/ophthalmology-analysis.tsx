"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OphthalmologyAnalysisProps {
  data: any
  onChange: (data: any) => void
}

export function OphthalmologyAnalysis({ data, onChange }: OphthalmologyAnalysisProps) {
  const updateField = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Eye Power Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Right Eye (OD)</h4>
            <div className="space-y-3">
              <div>
                <Label>Spherical Power</Label>
                <Input
                  placeholder="e.g., -2.50"
                  value={data.rightEye?.spherical || ""}
                  onChange={(e) => updateField("rightEye", { ...data.rightEye, spherical: e.target.value })}
                />
              </div>
              <div>
                <Label>Cylindrical Power</Label>
                <Input
                  placeholder="e.g., -1.25"
                  value={data.rightEye?.cylindrical || ""}
                  onChange={(e) => updateField("rightEye", { ...data.rightEye, cylindrical: e.target.value })}
                />
              </div>
              <div>
                <Label>Axis</Label>
                <Input
                  placeholder="e.g., 90°"
                  value={data.rightEye?.axis || ""}
                  onChange={(e) => updateField("rightEye", { ...data.rightEye, axis: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Left Eye (OS)</h4>
            <div className="space-y-3">
              <div>
                <Label>Spherical Power</Label>
                <Input
                  placeholder="e.g., -2.75"
                  value={data.leftEye?.spherical || ""}
                  onChange={(e) => updateField("leftEye", { ...data.leftEye, spherical: e.target.value })}
                />
              </div>
              <div>
                <Label>Cylindrical Power</Label>
                <Input
                  placeholder="e.g., -1.00"
                  value={data.leftEye?.cylindrical || ""}
                  onChange={(e) => updateField("leftEye", { ...data.leftEye, cylindrical: e.target.value })}
                />
              </div>
              <div>
                <Label>Axis</Label>
                <Input
                  placeholder="e.g., 85°"
                  value={data.leftEye?.axis || ""}
                  onChange={(e) => updateField("leftEye", { ...data.leftEye, axis: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Additional Measurements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Intraocular Pressure (IOP)</Label>
            <Input
              placeholder="e.g., 15 mmHg"
              value={data.iop || ""}
              onChange={(e) => updateField("iop", e.target.value)}
            />
          </div>
          <div>
            <Label>Visual Acuity (VA)</Label>
            <Input
              placeholder="e.g., 6/6"
              value={data.visualAcuity || ""}
              onChange={(e) => updateField("visualAcuity", e.target.value)}
            />
          </div>
          <div>
            <Label>Pupillary Distance (PD)</Label>
            <Input
              placeholder="e.g., 62 mm"
              value={data.pupillaryDistance || ""}
              onChange={(e) => updateField("pupillaryDistance", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
