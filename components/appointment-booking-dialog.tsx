"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, CreditCard, FileText } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const appointmentSchema = z.object({
  category: z.enum(["general", "specialized"], {
    required_error: "Please select an appointment category.",
  }),
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional()
    .or(z.literal("")),
  department: z.string({
    required_error: "Please select a department.",
  }),
  doctor: z.string({
    required_error: "Please select a doctor.",
  }),
  appointmentType: z.string({
    required_error: "Please select an appointment type.",
  }),
  date: z.date({
    required_error: "Please select an appointment date.",
  }),
  time: z.string({
    required_error: "Please select an appointment time.",
  }),
  notes: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

const appointmentCategories = [
  {
    id: "general",
    name: "General OPD",
    description: "Regular consultations, check-ups, and basic medical care",
    fee: 500,
    icon: User,
  },
  {
    id: "specialized",
    name: "Specialized Procedure",
    description: "Specialist consultations, procedures, and advanced treatments",
    fee: 1200,
    icon: FileText,
  },
]

const departmentsByCategory = {
  general: [
    { value: "general-medicine", label: "General Medicine" },
    { value: "family-medicine", label: "Family Medicine" },
    { value: "internal-medicine", label: "Internal Medicine" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "emergency", label: "Emergency Medicine" },
  ],
  specialized: [
    { value: "cardiology", label: "Cardiology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "ent", label: "ENT" },
    { value: "gynecology", label: "Gynecology" },
    { value: "urology", label: "Urology" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "ayurveda", label: "Ayurveda" },
    { value: "dental", label: "Dental" },
    { value: "physiotherapy", label: "Physiotherapy" },
  ],
}

const doctorsByDepartment = {
  "general-medicine": [
    { value: "dr-smith", label: "Dr. John Smith" },
    { value: "dr-johnson", label: "Dr. Sarah Johnson" },
  ],
  "family-medicine": [
    { value: "dr-brown", label: "Dr. Michael Brown" },
    { value: "dr-davis", label: "Dr. Emily Davis" },
  ],
  "internal-medicine": [
    { value: "dr-wilson", label: "Dr. Robert Wilson" },
    { value: "dr-taylor", label: "Dr. Lisa Taylor" },
  ],
  pediatrics: [
    { value: "dr-anderson", label: "Dr. James Anderson" },
    { value: "dr-thomas", label: "Dr. Maria Thomas" },
  ],
  emergency: [
    { value: "dr-martinez", label: "Dr. Carlos Martinez" },
    { value: "dr-garcia", label: "Dr. Ana Garcia" },
  ],
  cardiology: [
    { value: "dr-heart", label: "Dr. Richard Heart" },
    { value: "dr-cardiac", label: "Dr. Jennifer Cardiac" },
  ],
  orthopedics: [
    { value: "dr-bone", label: "Dr. David Bone" },
    { value: "dr-joint", label: "Dr. Susan Joint" },
  ],
  neurology: [
    { value: "dr-brain", label: "Dr. William Brain" },
    { value: "dr-nerve", label: "Dr. Patricia Nerve" },
  ],
  dermatology: [
    { value: "dr-skin", label: "Dr. Mark Skin" },
    { value: "dr-derma", label: "Dr. Linda Derma" },
  ],
  ophthalmology: [
    { value: "dr-eye", label: "Dr. Kevin Eye" },
    { value: "dr-vision", label: "Dr. Nancy Vision" },
  ],
  ent: [
    { value: "dr-throat", label: "Dr. Paul Throat" },
    { value: "dr-ear", label: "Dr. Helen Ear" },
  ],
  gynecology: [
    { value: "dr-women", label: "Dr. Rachel Women" },
    { value: "dr-female", label: "Dr. Michelle Female" },
  ],
  urology: [
    { value: "dr-kidney", label: "Dr. Steven Kidney" },
    { value: "dr-bladder", label: "Dr. Karen Bladder" },
  ],
  psychiatry: [
    { value: "dr-mind", label: "Dr. Daniel Mind" },
    { value: "dr-mental", label: "Dr. Laura Mental" },
  ],
  ayurveda: [
    { value: "dr-ayur", label: "Dr. Raj Ayur" },
    { value: "dr-veda", label: "Dr. Priya Veda" },
  ],
  dental: [
    { value: "dr-tooth", label: "Dr. Tom Tooth" },
    { value: "dr-dental", label: "Dr. Amy Dental" },
  ],
  physiotherapy: [
    { value: "dr-physio", label: "Dr. Chris Physio" },
    { value: "dr-therapy", label: "Dr. Jessica Therapy" },
  ],
}

const appointmentTypesByCategory = {
  general: [
    { value: "consultation", label: "General Consultation" },
    { value: "checkup", label: "Health Check-up" },
    { value: "followup", label: "Follow-up Visit" },
    { value: "vaccination", label: "Vaccination" },
    { value: "prescription", label: "Prescription Renewal" },
  ],
  specialized: [
    { value: "consultation", label: "Specialist Consultation" },
    { value: "procedure", label: "Medical Procedure" },
    { value: "surgery", label: "Minor Surgery" },
    { value: "therapy", label: "Therapy Session" },
    { value: "diagnostic", label: "Diagnostic Test" },
    { value: "treatment", label: "Treatment Session" },
  ],
}

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

interface AppointmentBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAppointmentCreated?: (appointment: any) => void
}

export function AppointmentBookingDialog({ open, onOpenChange, onAppointmentCreated }: AppointmentBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      category: undefined,
      patientName: "",
      phone: "",
      email: "",
      department: "",
      doctor: "",
      appointmentType: "",
      date: undefined,
      time: "",
      notes: "",
    },
  })

  const watchedCategory = form.watch("category")
  const watchedDepartment = form.watch("department")

  // Reset dependent fields when category changes
  const handleCategoryChange = (value: string) => {
    form.setValue("department", "")
    form.setValue("doctor", "")
    form.setValue("appointmentType", "")
  }

  // Reset doctor when department changes
  const handleDepartmentChange = (value: string) => {
    form.setValue("doctor", "")
  }

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedCategory = appointmentCategories.find((cat) => cat.id === data.category)
      const selectedDepartment = departmentsByCategory[data.category as keyof typeof departmentsByCategory]?.find(
        (dept) => dept.value === data.department,
      )
      const selectedDoctor = doctorsByDepartment[data.department as keyof typeof doctorsByDepartment]?.find(
        (doc) => doc.value === data.doctor,
      )
      const selectedType = appointmentTypesByCategory[data.category as keyof typeof appointmentTypesByCategory]?.find(
        (type) => type.value === data.appointmentType,
      )

      const newAppointment = {
        id: `app-${Date.now()}`,
        patientName: data.patientName,
        phone: data.phone,
        email: data.email,
        department: selectedDepartment?.label,
        doctor: selectedDoctor?.label,
        appointmentType: selectedType?.label,
        date: data.date.toISOString(),
        time: data.time,
        status: "scheduled",
        fee: selectedCategory?.fee,
        category: data.category,
        notes: data.notes,
        paymentStatus: "pending",
      }

      // Call the callback if provided
      if (onAppointmentCreated) {
        onAppointmentCreated(newAppointment)
      }

      toast({
        title: "Appointment Booked Successfully!",
        description: `Appointment scheduled for ${data.patientName} on ${format(data.date, "PPP")} at ${data.time}`,
      })

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
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

  const selectedCategory = appointmentCategories.find((cat) => cat.id === watchedCategory)
  const availableDepartments = watchedCategory
    ? departmentsByCategory[watchedCategory as keyof typeof departmentsByCategory]
    : []
  const availableDoctors = watchedDepartment
    ? doctorsByDepartment[watchedDepartment as keyof typeof doctorsByDepartment]
    : []
  const availableAppointmentTypes = watchedCategory
    ? appointmentTypesByCategory[watchedCategory as keyof typeof appointmentTypesByCategory]
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book New Appointment
          </DialogTitle>
          <DialogDescription>Fill in the details below to schedule a new appointment.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Appointment Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Appointment Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleCategoryChange(value)
                      }}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {appointmentCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div key={category.id}>
                            <RadioGroupItem value={category.id} id={category.id} className="peer sr-only" />
                            <label htmlFor={category.id} className="flex cursor-pointer">
                              <Card
                                className={cn(
                                  "w-full transition-all hover:shadow-md",
                                  field.value === category.id
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-muted hover:border-primary/50",
                                )}
                              >
                                <CardHeader className="pb-3">
                                  <CardTitle className="flex items-center justify-between text-base">
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-5 w-5" />
                                      {category.name}
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      ₹{category.fee}
                                    </Badge>
                                  </CardTitle>
                                  <CardDescription className="text-sm">{category.description}</CardDescription>
                                </CardHeader>
                              </Card>
                            </label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Multi-day procedure info */}
            {watchedCategory === "specialized" && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Multi-Day Procedure Information</p>
                      <p className="mt-1">
                        Specialized procedures may require multiple sessions. Additional appointments will be
                        automatically scheduled based on your treatment plan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
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
                    <FormLabel>Email Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Appointment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          handleDepartmentChange(value)
                        }}
                        value={field.value}
                        disabled={!watchedCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDepartments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
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
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!watchedDepartment}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDoctors.map((doctor) => (
                            <SelectItem key={doctor.value} value={doctor.value}>
                              {doctor.label}
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
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCategory}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableAppointmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Appointment Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
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
                      <FormLabel>Appointment Time *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
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
                        placeholder="Any additional information or special requirements..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fee Summary */}
            {selectedCategory && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Consultation Fee</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-base px-3 py-1">
                      ₹{selectedCategory.fee}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Payment can be made at the time of consultation or in advance.
                  </p>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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
