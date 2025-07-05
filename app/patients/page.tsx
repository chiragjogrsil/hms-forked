"use client"

import { useEffect, useState } from "react"
import { columns } from "./columns"
import { PatientDataTable } from "@/components/patient-data-table"
import { patients as patientData } from "@/data/patients"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPatients(patientData)
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription className="prose prose-sm dark:prose-invert">
            Manage your patients and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientDataTable columns={columns} data={patients} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
