"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getPatientById } from "@/api/patients"
import type { Patient } from "@/types/patient"
import styles from "./page.module.css"
import Button from "@/components/Button"
import Plus from "@/components/Plus"
import { PrescribeTestsModal } from "@/components/modals/prescribe-tests-modal"
import { toast } from "react-toastify"

const PatientPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isPrescribeTestsModalOpen, setIsPrescribeTestsModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      getPatientById(id as string).then(setPatient)
    }
  }, [id])

  if (!patient) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1>{patient.name}</h1>
      <p>{patient.age} years old</p>
      <p>{patient.gender}</p>
      <h2>Services</h2>
      <ul>
        {patient.services.map((service, index) => (
          <li key={index}>
            {service === "Add new service" ? (
              <Button onClick={() => setIsPrescribeTestsModalOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Prescribe Tests
              </Button>
            ) : (
              service
            )}
          </li>
        ))}
      </ul>
      <PrescribeTestsModal
        isOpen={isPrescribeTestsModalOpen}
        onClose={() => setIsPrescribeTestsModalOpen(false)}
        onSuccess={() => {
          setIsPrescribeTestsModalOpen(false)
          toast.success("Tests prescribed successfully")
        }}
        patientId={id as string}
        patientName={patient.name}
      />
    </div>
  )
}

export default PatientPage
