"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, MapPin, CreditCard, TestTube, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

const serviceAppointmentSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  patientPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  patientEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }),
  doctor: z.string({
    required_error: "Please select a doctor.",
  }),
  date: z.date({
    required_error: "Please select an appointment date.",
  }),
  time: z.string({
    required_error: "Please select an appointment time.",
  }),
  notes: z.string().optional(),
})

type ServiceAppointmentFormValues = z.infer<typeof serviceAppointmentSchema>

const serviceDepartments = {
  laboratory: "Laboratory",
  radiology: "Radiology",
}

const doctorsByServiceDepartment = {
  Laboratory: ["Dr. Lab Technician 1", "Dr. Lab Technician 2", "Dr. Pathologist Kumar"],
  Radiology: ["Dr. Radiologist Sharma", "Dr. Imaging Specialist", "Dr. Radiology Expert"],
}

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
]

interface BookAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  prefilledData?: {
    appointmentType?: string
    serviceDetails?: {
      name: string
      type: "laboratory" | "radiology"
      fee: number
      description?: string
    }
  }
}

export function BookAppointmentModal({ isOpen, onClose, onSuccess, prefilledData }: BookAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ServiceAppointmentFormValues>({
    resolver: zodResolver(serviceAppointmentSchema),
    defaultValues: {
      department: prefilledData?.serviceDetails?.type ? serviceDepartments[prefilledData.serviceDetails.type] : "",
      notes: "",
    },
  })

  const watchedDepartment = form.watch("department")

  const handleDepartmentChange = (department: string) => {
    form.setValue("department", department)
    form.setValue("doctor", "")
  }

  const onSubmit = async (data: ServiceAppointmentFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const appointmentId = `SVC-${Date.now()}`
      const serviceName = prefilledData?.serviceDetails?.name || "Service"
      const serviceFee = prefilledData?.serviceDetails?.fee || 0

      toast({
        title: "Service Appointment Booked Successfully!",
        description: `Appointment ID: ${appointmentId} for ${serviceName} on ${format(data.date, "PPP")} at ${data.time}. Patient: ${data.patientName}${serviceFee > 0 ? `, Fee: ₹${serviceFee}` : ""}`,
      })

      form.reset()
      onSuccess?.()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book service appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableDoctors = watchedDepartment
    ? doctorsByServiceDepartment[watchedDepartment as keyof typeof doctorsByServiceDepartment] || []
    : []
  const serviceIcon = prefilledData?.serviceDetails?.type === "laboratory" ? TestTube : Zap

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book Service Appointment
          </DialogTitle>
          <DialogDescription>
            Book an appointment for {prefilledData?.serviceDetails?.name || "the selected service"}.
          </DialogDescription>
        </DialogHeader>

        {/* Service Details */}
        {prefilledData?.serviceDetails && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  {serviceIcon && <serviceIcon className="h-5 w-5 text-blue-600" />}
                  {prefilledData.serviceDetails.name}
                </div>
                {prefilledData.serviceDetails.fee > 0 && (
                  <Badge variant="secondary">₹{prefilledData.serviceDetails.fee}</Badge>
                )}
              </CardTitle>
              {prefilledData.serviceDetails.description && (
                <CardDescription>{prefilledData.serviceDetails.description}</CardDescription>
              )}
            </CardHeader>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Appointment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={handleDepartmentChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Laboratory">
                            <div className="flex items-center gap-2">
                              <TestTube className="h-4 w-4" />
                              Laboratory
                            </div>
                          </SelectItem>
                          <SelectItem value="Radiology">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Radiology
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Staff</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDoctors.map((doctor) => (
                            <SelectItem key={doctor} value={doctor}>
                              {doctor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Time</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {time}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or notes for the service appointment..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any special requirements, preparation instructions, or additional information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fee Summary */}
            {prefilledData?.serviceDetails?.fee && prefilledData.serviceDetails.fee > 0 && (
              <>
                <Separator />
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">Service Fee</span>
                      </div>
                      <Badge variant="secondary" className="text-lg font-bold">
                        ₹{prefilledData.serviceDetails.fee}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Payment can be made at the time of service or through advance booking.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Service Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
