"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Mock data for departments
const departments = [
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "Ophthalmology",
  "ENT",
]

const doctors = [
  { id: "dr1", name: "Dr. Smith", department: "General Medicine" },
  { id: "dr2", name: "Dr. Johnson", department: "Cardiology" },
  { id: "dr3", name: "Dr. Williams", department: "Orthopedics" },
  { id: "dr4", name: "Dr. Brown", department: "Neurology" },
  { id: "dr5", name: "Dr. Davis", department: "Pediatrics" },
]

interface GenerateTokenModalProps {
  isOpen: boolean
  onClose: () => void
  patientId?: string
  patientName?: string
}

export function GenerateTokenModal({ isOpen, onClose, patientId, patientName }: GenerateTokenModalProps) {
  const [department, setDepartment] = useState("")
  const [doctor, setDoctor] = useState("")
  const [priority, setPriority] = useState(false)
  const [notes, setNotes] = useState("")
  const [searchPatient, setSearchPatient] = useState("")

  const filteredDoctors = department ? doctors.filter((doc) => doc.department === department) : doctors

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would submit the token data to the server
    console.log({
      patientId,
      patientName,
      department,
      doctor,
      priority,
      notes,
    })

    // Generate a random token number for demo purposes
    const tokenNumber = Math.floor(Math.random() * 100) + 1
    alert(`Token generated successfully! Token Number: ${tokenNumber}`)

    // Reset form and close modal
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setDepartment("")
    setDoctor("")
    setPriority(false)
    setNotes("")
    setSearchPatient("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Queue Token</DialogTitle>
          <DialogDescription>Create a new queue token for {patientName || "the patient"}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!patientId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patient" className="text-right">
                  Patient
                </Label>
                <div className="col-span-3">
                  <Input
                    id="patient"
                    placeholder="Search patient..."
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <div className="col-span-3">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">
                Doctor
              </Label>
              <div className="col-span-3">
                <Select value={doctor} onValueChange={setDoctor} disabled={!department}>
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="priority" checked={priority} onCheckedChange={setPriority} />
                <Label htmlFor="priority" className="text-sm text-muted-foreground">
                  Mark as priority case
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                placeholder="Additional information"
                className="col-span-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Generate Token</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
