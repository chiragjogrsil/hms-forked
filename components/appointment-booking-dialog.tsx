"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, MapPin, CreditCard, AlertCircle } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

const appointmentSchema = z.object({
  category: z.enum(["general", "specialized"], {
    required_error: "Please select an appointment category.",
  }),
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
    icon: CreditCard,
  },
]

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

const doctorsByDepartment = {
  "General Medicine": ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Amit Singh"],
  "Family Medicine": ["Dr. Sunita Patel", "Dr. Ravi Gupta"],
  "Internal Medicine": ["Dr. Meera Joshi", "Dr. Vikram Rao"],
  Pediatrics: ["Dr. Kavita Nair", "Dr. Suresh Reddy"],
  "Emergency Medicine": ["Dr. Anita Das", "Dr. Rohit Verma"],
  Cardiology: ["Dr. Ashok Mehta", "Dr. Deepa Agarwal"],
  Orthopedics: ["Dr. Sanjay Khanna", "Dr. Neha Chopra"],
  Neurology: ["Dr. Ramesh Iyer", "Dr. Pooja Malhotra"],
  Dermatology: ["Dr. Kiran Bhat", "Dr. Arjun Pillai"],
  Ophthalmology: ["Dr. Shweta Jain", "Dr. Manoj Tiwari"],
  ENT: ["Dr. Rekha Sood", "Dr. Ajay Bansal"],
  Gynecology: ["Dr. Nisha Arun", "Dr. Seema Kapoor"],
  Urology: ["Dr. Prakash Yadav", "Dr. Ritu Saxena"],
  Psychiatry: ["Dr. Mohan Lal", "Dr. Anjali Mishra"],
  Ayurveda: ["Dr. Vaidya Krishnan", "Dr. Lakshmi Devi"],
  Dental: ["Dr. Rajiv Dental", "Dr. Smita Oral"],
  Physiotherapy: ["Dr. Physio Kumar", "Dr. Rehab Sharma"],
}

const appointmentTypesByCategory = {
  general: ["New Consultation", "Follow-up Visit", "Health Check-up", "Vaccination", "Medical Certificate"],
  specialized: [
    "Specialist Consultation",
    "Procedure Consultation",
    "Pre-operative Assessment",
    "Post-operative Follow-up",
    "Treatment Planning",
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
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
]

interface AppointmentBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentBookingDialog({ open, onOpenChange }: AppointmentBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      notes: "",
    },
  })

  const watchedCategory = form.watch("category")
  const watchedDepartment = form.watch("department")

  // Reset dependent fields when category changes
  const handleCategoryChange = (category: string) => {
    form.setValue("category", category as "general" | "specialized")
    form.setValue("department", "")
    form.setValue("doctor", "")
    form.setValue("appointmentType", "")
  }

  // Reset doctor when department changes
  const handleDepartmentChange = (department: string) => {
    form.setValue("department", department)
    form.setValue("doctor", "")
  }

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedCategory = appointmentCategories.find((cat) => cat.id === data.category)
      const appointmentId = `APT-${Date.now()}`

      toast({
        title: "Appointment Booked Successfully!",
        description: `Appointment ID: ${appointmentId} for ${data.patientName} on ${format(data.date, "PPP")} at ${data.time}. Fee: ₹${selectedCategory?.fee}`,
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

  const availableDepartments = watchedCategory ? departmentsByCategory[watchedCategory] : []
  const availableDoctors = watchedDepartment
    ? doctorsByDepartment[watchedDepartment as keyof typeof doctorsByDepartment] || []
    : []
  const availableAppointmentTypes = watchedCategory ? appointmentTypesByCategory[watchedCategory] : []
  const selectedCategory = appointmentCategories.find((cat) => cat.id === watchedCategory)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book New Appointment
          </DialogTitle>
          <DialogDescription>Fill in the details below to book a new appointment for the patient.</DialogDescription>
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
                      {appointmentCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div key={category.id}>
                            <RadioGroupItem value={category.id} id={category.id} className="peer sr-only" />
                            <Label htmlFor={category.id} className="flex cursor-pointer">
                              <Card
                                className={cn(
                                  "flex-1 transition-all hover:shadow-md",
                                  field.value === category.id && "border-primary bg-primary/5",
                                )}
                              >
                                <CardHeader className="pb-3">
                                  <CardTitle className="flex items-center justify-between text-base">
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-5 w-5" />
                                      {category.name}
                                    </div>
                                    <Badge variant="secondary">₹{category.fee}</Badge>
                                  </CardTitle>
                                  <CardDescription className="text-sm">{category.description}</CardDescription>
                                </CardHeader>
                              </Card>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Multi-day procedure info for specialized */}
            {watchedCategory === "specialized" && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Multi-Day Procedure Information</p>
                      <p>
                        Specialized procedures may require multiple sessions. Additional appointments will be
                        automatically scheduled based on your treatment plan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

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
              </div>

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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or notes for the appointment..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any special requirements, symptoms, or additional information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fee Summary */}
            {selectedCategory && (
              <>
                <Separator />
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Consultation Fee</span>
                      </div>
                      <Badge variant="secondary" className="text-lg font-bold">
                        ₹{selectedCategory.fee}
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Payment can be made at the time of consultation or through advance booking.
                    </p>
                  </CardContent>
                </Card>
              </>
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
