"use client"

import type React from "react"
import { Button, Heading } from "@chakra-ui/react"
import { PrescribeTestsModal } from "@/components/modals/prescribe-tests-modal"
import { toast } from "sonner"
import { useState } from "react"
import Plus from "@/icons/Plus"

const Page: React.FC = () => {
  const [isPrescribeTestsModalOpen, setIsPrescribeTestsModalOpen] = useState(false)

  return (
    <div>
      <Heading>Prescribe tests</Heading>
      <Button onClick={() => setIsPrescribeTestsModalOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Prescribe Tests
      </Button>
      {/* rest of code here */}
      <PrescribeTestsModal
        isOpen={isPrescribeTestsModalOpen}
        onClose={() => setIsPrescribeTestsModalOpen(false)}
        onSuccess={() => {
          setIsPrescribeTestsModalOpen(false)
          toast.success("Tests prescribed successfully")
        }}
        patientId=""
        patientName="Select Patient"
      />
    </div>
  )
}

export default Page
