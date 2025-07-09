"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, MapPin, CreditCard, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const appointmentCategories = [
  {
    id: "general",
    name: "General OPD",
    description: "Regular consultations, check-ups, basic medical care",
    fee: 500,
    icon: "🏥",
  },
  {
    id: "specialized",
    name: "Specialized Procedure",
    description: "Specialist consultations, procedures, advanced treatments",
    fee: 1200,
    icon: "⚕️",
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
  "General Medicine": ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Amit Patel"],
  "Family Medicine": ["Dr. Sunita Gupta", "Dr. Vikram Singh"],
  "Internal Medicine": ["Dr. Neha Agarwal", "Dr. Rohit Mehta"],
  Pediatrics: ["Dr. Kavita Joshi", "Dr. Suresh Reddy"],
  "Emergency Medicine": ["Dr. Anita Rao", "Dr. Manoj Tiwari"],
  Cardiology: ["Dr. Ashok Verma", "Dr. Deepika Nair"],
  Orthopedics: ["Dr. Ravi Chopra", "Dr. Sanjay Malhotra"],
  Neurology: ["Dr. Meera Iyer", "Dr. Arun Khanna"],
  Dermatology: ["Dr. Pooja Bansal", "Dr. Kiran Desai"],
  Ophthalmology: ["Dr. Rajiv Sinha", "Dr. Shweta Pandey"],
  ENT: ["Dr. Vinod Agrawal", "Dr. Rekha Jain"],
  Gynecology: ["Dr. Sudha Menon", "Dr. Anjali Saxena"],
  Urology: ["Dr. Prakash Yadav", "Dr. Nisha Kapoor"],
  Psychiatry: ["Dr. Ramesh Bhatt", "Dr. Seema Chandra"],
  Ayurveda: ["Dr. Yogesh Tripathi", "Dr. Lakshmi Devi"],
  Dental: ["Dr. Harsh Gupta", "Dr. Ritu Sharma"],
  Physiotherapy: ["Dr. Mohan Lal", "Dr. Geeta Rani"],
}

const appointmentTypesByCategory = {
  general: ["New Patient Consultation", "Follow-up Visit", "Routine Check-up", "Vaccination", "Health Screening"],
  specialized: [
    "Specialist Consultation",
    "Diagnostic Procedure",
    "Treatment Session",
    "Pre-operative Assessment",
    "Post-operative Follow-up",
    "Therapy Session",
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
  "06:00 PM",
  "06:30 PM",
]

const formSchema = z.object({
  category: z.string().min(1, "Please select an appointment category"),
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  department: z.string().min(1, "Please select a department"),
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentType: z.string().min(1, "Please select an appointment type"),
  appointmentDate: z.date({
    required_error: "Please select an appointment date",
  }),
  appointmentTime: z.string().min(1, "Please select an appointment time"),
  notes: z.string().optional(),
})

interface AppointmentBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (appointmentData: any) => void
}

export function AppointmentBookingDialog({ isOpen, onClose, onSuccess }: AppointmentBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      patientName: "",
      phoneNumber: "",
      email: "",
      department: "",
      doctor: "",
      appointmentType: "",
      appointmentTime: "",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedCategory = appointmentCategories.find((cat) => cat.id === values.category)
      const appointmentData = {
        ...values,
        appointmentId: `APT-${Date.now()}`,
        fee: selectedCategory?.fee || 0,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      }

      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment has been scheduled for ${format(values.appointmentDate, "PPP")} at ${values.appointmentTime}`,
      })

      onSuccess?.(appointmentData)
      onClose()
      form.reset()
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <FormItem>
                  <FormLabel>Appointment Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleCategoryChange}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {appointmentCategories.map((category) => (
                        <div key={category.id}>
                          <RadioGroupItem value={category.id} id={category.id} className="peer sr-only" />
                          <Label htmlFor={category.id} className="flex cursor-pointer">
                            <Card
                              className={cn(
                                "flex-1 transition-all hover:bg-accent",
                                field.value === category.id && "border-primary bg-primary/5",
                              )}
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-base">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{category.icon}</span>
                                    {category.name}
                                  </div>
                                  <Badge variant="secondary">₹{category.fee}</Badge>
                                </CardTitle>
                                <CardDescription className="text-sm">{category.description}</CardDescription>
                              </CardHeader>
                            </Card>
                          </Label>
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
                    <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Multi-Day Procedure</p>
                      <p className="text-sm text-amber-700">
                        Specialized procedures may require multiple sessions. Additional appointments will be
                        automatically scheduled based on your treatment plan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </h3>

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
                  name="phoneNumber"
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
                  name="email"
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

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Appointment Details
                </h3>

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
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
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
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Time</FormLabel>
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

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or additional information..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please mention any specific requirements, symptoms, or information that might be helpful for your
                    appointment.
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
                      <span className="font-medium text-blue-800">Consultation Fee</span>
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      ₹{selectedCategory.fee}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Payment can be made at the time of appointment or through online payment.
                  </p>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
