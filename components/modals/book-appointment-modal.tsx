"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, Phone, Mail, TestTube, Zap, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  department: z.string().min(1, "Please select a department"),
  staffMember: z.string().min(1, "Please select a staff member"),
  date: z.date({
    required_error: "Please select an appointment date",
  }),
  time: z.string().min(1, "Please select an appointment time"),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface BookAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (appointment: any) => void
  prefilledData?: {
    appointmentType?: string
    serviceDetails?: {
      name: string
      category: string
      fee: number
      description?: string
    }
  }
}

// Staff members by department
const staffByDepartment: Record<string, string[]> = {
  Laboratory: ["Dr. Sarah Johnson (Lab Director)", "Tech. Mike Chen", "Tech. Lisa Wang", "Dr. Robert Kim"],
  Radiology: ["Dr. Emily Davis (Radiologist)", "Tech. John Smith", "Tech. Maria Garcia", "Dr. David Wilson"],
}

// Available time slots
const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
]

export function BookAppointmentModal({ isOpen, onClose, onSuccess, prefilledData }: BookAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      phoneNumber: "",
      email: "",
      department:
        prefilledData?.serviceDetails?.category === "Laboratory"
          ? "Laboratory"
          : prefilledData?.serviceDetails?.category === "Radiology"
            ? "Radiology"
            : "",
      staffMember: "",
      time: "",
      notes: "",
    },
  })

  const watchedDepartment = form.watch("department")

  // Reset staff member when department changes
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value)
    form.setValue("staffMember", "")
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newAppointment = {
        id: `app-${Date.now()}`,
        patientName: data.patientName,
        patient: data.patientName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        department: data.department,
        doctor: data.staffMember,
        appointmentType: prefilledData?.appointmentType || `${data.department} Service`,
        date: data.date.toISOString(),
        time: data.time,
        notes: data.notes,
        status: "scheduled",
        fee: prefilledData?.serviceDetails?.fee || 300,
        contactNumber: data.phoneNumber,
        duration: 30,
        // Include service details if provided
        ...(prefilledData?.serviceDetails && {
          serviceName: prefilledData.serviceDetails.name,
          serviceCategory: prefilledData.serviceDetails.category,
          serviceDescription: prefilledData.serviceDetails.description,
        }),
      }

      onSuccess(newAppointment)

      toast({
        title: "Appointment Booked Successfully!",
        description: `${data.department} appointment scheduled for ${data.patientName} on ${format(data.date, "PPP")} at ${data.time}`,
      })

      form.reset()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableStaff = watchedDepartment ? staffByDepartment[watchedDepartment] || [] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {prefilledData?.serviceDetails?.category === "Laboratory" ? (
              <TestTube className="h-5 w-5" />
            ) : prefilledData?.serviceDetails?.category === "Radiology" ? (
              <Zap className="h-5 w-5" />
            ) : (
              <CalendarIcon className="h-5 w-5" />
            )}
            Book Service Appointment
          </DialogTitle>
          <DialogDescription>Schedule an appointment for the selected service</DialogDescription>
        </DialogHeader>

        {/* Service Information Card */}
        {prefilledData?.serviceDetails && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  {prefilledData.serviceDetails.category === "Laboratory" ? (
                    <TestTube className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Zap className="h-5 w-5 text-blue-600" />
                  )}
                  {prefilledData.serviceDetails.name}
                </span>
                <Badge variant="secondary" className="text-sm font-bold">
                  ₹{prefilledData.serviceDetails.fee}
                </Badge>
              </CardTitle>
              {prefilledData.serviceDetails.description && (
                <CardDescription className="text-sm text-blue-700">
                  {prefilledData.serviceDetails.description}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter patient name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department and Staff Selection */}
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
                name="staffMember"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Member</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableStaff.map((staff) => (
                          <SelectItem key={staff} value={staff}>
                            {staff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Appointment Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Appointment Time
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any special requirements or notes..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Include any special requirements, preparation instructions, or additional information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fee Summary */}
            {prefilledData?.serviceDetails && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Service Fee</span>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      ₹{prefilledData.serviceDetails.fee}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 mt-2">Payment can be made at the time of service</p>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
