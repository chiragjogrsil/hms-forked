"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { AllopathicPrescription } from "@/components/allopathic-prescription"
import { AyurvedicPrescription } from "@/components/ayurvedic-prescription"
import type { Doctor } from "@/types/doctor"
import { PrescriptionTemplateManager } from "@/components/prescription-template-manager"

interface IntegratedConsultationProps {
  selectedDoctor: Doctor | null
}

export const IntegratedConsultation: React.FC<IntegratedConsultationProps> = ({ selectedDoctor }) => {
  const [allopathicPrescriptions, setAllopathicPrescriptions] = useState<string[]>([])
  const [ayurvedicPrescriptions, setAyurvedicPrescriptions] = useState<string[]>([])

  useEffect(() => {
    // Load initial prescriptions or fetch from API if needed
  }, [])

  return (
    <div>
      <h2>Consultation</h2>

      {/* Prescription Template Manager */}
      <PrescriptionTemplateManager
        allopathicMedicines={allopathicPrescriptions}
        ayurvedicMedicines={ayurvedicPrescriptions}
        onLoadTemplate={(medicines) => {
          setAllopathicPrescriptions(medicines.allopathic)
          setAyurvedicPrescriptions(medicines.ayurvedic)
        }}
        department={selectedDoctor?.department}
      />

      <Tabs>
        <TabList>
          <Tab>Allopathic</Tab>
          <Tab>Ayurvedic</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AllopathicPrescription
              prescriptions={allopathicPrescriptions}
              setPrescriptions={setAllopathicPrescriptions}
            />
          </TabPanel>
          <TabPanel>
            <AyurvedicPrescription
              prescriptions={ayurvedicPrescriptions}
              setPrescriptions={setAyurvedicPrescriptions}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}
