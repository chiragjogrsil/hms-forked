"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const vitalSignsSchema = z.object({
  temperature: z.string().min(1, { message: "Temperature is required" }),
  bodyWeight: z.string().min(1, { message: "Body weight is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  bpSystolic: z.string().min(1, { message: "Systolic BP is required" }),
  bpDiastolic: z.string().min(1, { message: "Diastolic BP is required" }),
  pulse: z.string().min(1, { message: "Pulse is required" }),
  spo2: z.string().min(1, { message: "SPO2 is required" }),
  respiratoryRate: z.string().min(1, { message: "Respiratory rate is required" }),
  notes: z.string().optional(),
})

type VitalSignsFormValues = z.infer<typeof vitalSignsSchema>

interface VitalSignsModalProps {
  isOpen: boolean
  onClose: () => void
  visitId?: string
  visitDate?: string
  patientName: string
  onSave?: (data: VitalSignsFormValues) => void
  initialData?: VitalSignsFormValues
  patientId?: string
}

export default function VitalSignsModal({
  isOpen,
  onClose,
  visitId,
  visitDate,
  patientName,
  onSave,
  initialData,
  patientId,
}: VitalSignsModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  const defaultValues: Partial<VitalSignsFormValues> = {
    temperature: "",
    bodyWeight: "",
    height: "",
    bpSystolic: "",
    bpDiastolic: "",
    pulse: "",
    spo2: "",
    respiratoryRate: "",
    notes: "",
    ...initialData,
  }

  const form = useForm<VitalSignsFormValues>({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues,
  })

  function onSubmit(data: VitalSignsFormValues) {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      onSave?.(data)
      toast.success("Vital signs saved successfully")
      setIsSaving(false)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>EMR - Vital Signs</DialogTitle>
          <DialogDescription>
            Enter vital signs for {patientName} {visitDate ? `- Visit on ${visitDate}` : ""}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input placeholder="37.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bodyWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Weight (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="70" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="175" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="text-sm font-medium">Blood Pressure (mmHg)</div>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="bpSystolic"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="120" {...field} />
                        </FormControl>
                        <div className="text-xs text-muted-foreground">Systolic</div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className="self-center">/</span>
                  <FormField
                    control={form.control}
                    name="bpDiastolic"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="80" {...field} />
                        </FormControl>
                        <div className="text-xs text-muted-foreground">Diastolic</div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pulse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulse (bpm)</FormLabel>
                    <FormControl>
                      <Input placeholder="72" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spo2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SPO2 (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="98" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="respiratoryRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respiratory Rate</FormLabel>
                    <FormControl>
                      <Input placeholder="16" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Any additional observations" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Vital Signs"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Add a named export that references the default export
export { VitalSignsModal }
