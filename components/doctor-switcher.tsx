"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDoctor } from "@/contexts/doctor-context"

const doctors = [
  { id: "doc-001", name: "Dr. Sharma", department: "general", specialization: "General Medicine" },
  { id: "doc-002", name: "Dr. Ayurveda", department: "ayurveda", specialization: "Ayurvedic Medicine" },
  { id: "doc-003", name: "Dr. Dental", department: "dental", specialization: "Dentistry" },
  { id: "doc-004", name: "Dr. Eye", department: "ophthalmology", specialization: "Ophthalmology" },
]

export function DoctorSwitcher() {
  const { currentDoctor, setCurrentDoctor } = useDoctor()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Doctor:</span>
      <Select
        value={currentDoctor.id}
        onValueChange={(value) => {
          const doctor = doctors.find((d) => d.id === value)
          if (doctor) setCurrentDoctor(doctor)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialization}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
