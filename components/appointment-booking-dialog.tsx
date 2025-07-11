"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, Phone, Mail, MapPin, CreditCard, AlertCircle } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  category: z.string().min(1, "Please select an appointment category"),
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  department: z.string().min(1, "Please select a department"),
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentType: z.string().min(1, "Please select an appointment type"),
  date: z.date({
    required_error: "Please select an appointment date",
  }),
  time: z.string().min(1, "Please select an appointment time"),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface AppointmentBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAppointmentCreated: (appointment: any) => void
}

// Appointment categories with fees
const appointmentCategories = [
  {
    id: "general",
    name: "General OPD",
    description: "Regular consultations, check-ups, and basic medical care",
    fee: 500,
    icon: "🏥",
  },
  {
    id: "specialized",
    name: "Specialized Procedure",
    description: "Specialist consultations, procedures, and advanced treatments",
    fee: 1200,
    icon: "⚕️",
  },
]

// Departments by category
const departmentsByCategory = {
  general: ["General Medicine", "Family Medicine", "Internal Medicine", "Pediatrics", "Emergency Medicine"],
  specialized: [
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Dermatology",
    "Ophthalmology",
    "ENT",
    "Gynecology",
    "Urology",
    "Psychiatry",
    "Ayurveda",
    "Dental",
    "Physiotherapy",
  ],
}

// Doctors by department
const doctorsByDepartment: Record<string, string[]> = {
  "General Medicine": ["Dr. Smith", "Dr. Johnson", "Dr. Williams"],
  "Family Medicine": ["Dr. Brown", "Dr. Davis", "Dr. Miller"],
  "Internal Medicine": ["Dr. Wilson", "Dr. Moore", "Dr. Taylor"],
  Pediatrics: ["Dr. Anderson", "Dr. Thomas", "Dr. Jackson"],
  "Emergency Medicine": ["Dr. White", "Dr. Harris", "Dr. Martin"],
  Cardiology: ["Dr. Thompson", "Dr. Garcia", "Dr. Martinez"],
  Orthopedics: ["Dr. Robinson", "Dr. Clark", "Dr. Rodriguez"],
  Neurology: ["Dr. Lewis", "Dr. Lee", "Dr. Walker"],
  Dermatology: ["Dr. Hall", "Dr. Allen", "Dr. Young"],
  Ophthalmology: ["Dr. Hernandez", "Dr. King", "Dr. Wright"],
  ENT: ["Dr. Lopez", "Dr. Hill", "Dr. Scott"],
  Gynecology: ["Dr. Green", "Dr. Adams", "Dr. Baker"],
  Urology: ["Dr. Gonzalez", "Dr. Nelson", "Dr. Carter"],
  Psychiatry: ["Dr. Mitchell", "Dr. Perez", "Dr. Roberts"],
  Ayurveda: ["Dr. Turner", "Dr. Phillips", "Dr. Campbell"],
  Dental: ["Dr. Parker", "Dr. Evans", "Dr. Edwards"],
  Physiotherapy: ["Dr. Collins", "Dr. Stewart", "Dr. Sanchez"],
}

// Appointment types by category
const appointmentTypesByCategory = {
  general: ["Consultation", "Follow-up", "Check-up", "Vaccination", "Health Screening"],
  specialized: [
    "Specialist Consultation",
    "Procedure",
    "Surgery Consultation",
    "Diagnostic Test",
    "Treatment Session",
    "Follow-up Review",
  ],
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

export function AppointmentBookingDialog({ open, onOpenChange, onAppointmentCreated }: AppointmentBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      patientName: "",
      phoneNumber: "",
      email: "",
      department: "",
      doctor: "",
      appointmentType: "",
      time: "",
      notes: "",
    },
  })

  const watchedCategory = form.watch("category")
  const watchedDepartment = form.watch("department")

  // Reset dependent fields when category changes
  const handleCategoryChange = (value: string) => {
    form.setValue("category", value)
    form.setValue("department", "")
    form.setValue("doctor", "")
    form.setValue("appointmentType", "")
  }

  // Reset doctor when department changes
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value)
    form.setValue("doctor", "")
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedCategory = appointmentCategories.find((cat) => cat.id === data.category)

      const newAppointment = {
        id: `app-${Date.now()}`,
        patientName: data.patientName,
        patient: data.patientName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        department: data.department,
        doctor: data.doctor,
        appointmentType: data.appointmentType,
        date: data.date.toISOString(),
        time: data.time,
        notes: data.notes,
        status: "scheduled",
        fee: selectedCategory?.fee || 500,
        category: data.category,
        contactNumber: data.phoneNumber,
        duration: data.category === "specialized" ? 60 : 30,
        // Add procedure info for specialized appointments
        ...(data.category === "specialized" && {
          procedureId: `PROC-${Date.now()}`,
          procedureName: `${data.department} - ${data.appointmentType}`,
          sessionNumber: 1,
          totalSessions: data.appointmentType.includes("Surgery") ? 3 : 2,
          sessionDescription: "Initial consultation and assessment",
        }),
      }

      onAppointmentCreated(newAppointment)

      toast({
        title: "Appointment Booked Successfully!",
        description: `Appointment scheduled for ${data.patientName} on ${format(data.date, "PPP")} at ${data.time}`,
      })

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
  const availableDoctors = watchedDepartment ? doctorsByDepartment[watchedDepartment] || [] : []
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
          <DialogDescription>Fill in the details below to schedule a new appointment</DialogDescription>
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
                      onValueChange={handleCategoryChange}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {appointmentCategories.map((category) => (
                        <div key={category.id}>
                          <RadioGroupItem value={category.id} id={category.id} className="peer sr-only" />
                          <label htmlFor={category.id} className="cursor-pointer">
                            <Card
                              className={cn(
                                "transition-all hover:shadow-md",
                                field.value === category.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "hover:border-primary/50",
                              )}
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-lg">
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">{category.icon}</span>
                                    {category.name}
                                  </span>
                                  <Badge variant="secondary" className="text-sm font-bold">
                                    ₹{category.fee}
                                  </Badge>
                                </CardTitle>
                                <CardDescription className="text-sm">{category.description}</CardDescription>
                              </CardHeader>
                            </Card>
                          </label>
                        </div>
                      ))}
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
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Multi-Session Procedure</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Specialized procedures may require multiple sessions. Additional appointments will be
                        automatically scheduled based on your treatment plan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Department and Doctor Selection */}
            {watchedCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Department
                      </FormLabel>
                      <Select onValueChange={handleDepartmentChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
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
                      <FormLabel>Doctor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
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
              </div>
            )}

            {/* Appointment Type */}
            {watchedCategory && (
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableAppointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                    Include any special requirements, symptoms, or additional information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fee Summary */}
            {selectedCategory && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Consultation Fee</span>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      ₹{selectedCategory.fee}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Payment can be made at the time of consultation</p>
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
