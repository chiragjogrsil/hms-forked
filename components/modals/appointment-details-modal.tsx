"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Appointment } from "@/types"
import { ExternalLink } from "lucide-react"

interface AppointmentDetailsModalProps {
  appointment: Appointment
  open: boolean
  setOpen: (open: boolean) => void
}

export function AppointmentDetailsModal({ appointment, open, setOpen }: AppointmentDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogDescription>Here are the details of the appointment. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input type="text" id="name" value={appointment.patientName} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input type="email" id="email" value={appointment.email} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input type="text" id="phone" value={appointment.phone} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input type="text" id="date" value={appointment.date} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input type="text" id="time" value={appointment.time} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service" className="text-right">
              Service
            </Label>
            <Input type="text" id="service" value={appointment.service} className="col-span-3" disabled />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              const patientId = `PAT-${appointment.patientName.replace(/\s+/g, "").toUpperCase()}-${Math.random().toString(36).substr(2, 4)}`
              window.open(`/patients/${patientId}`, "_blank")
            }}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Patient Details
          </Button>
          <Button type="submit">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
