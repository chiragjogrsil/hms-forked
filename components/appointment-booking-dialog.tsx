"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock, User, DollarSign, Stethoscope, Activity } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Appointment categories
const appointmentCategories = [
  {
    id: "general",
    name: "General OPD",
    description: "Regular consultations, check-ups, and basic medical care",
    fee: 500,
    icon: Stethoscope,
  },
  {
    id: "specialized",
    name: "Specialized Procedure",
    description: "Specialist consultations, procedures, and advanced treatments",
    fee: 1200,
    icon: Activity,
  },
]

// Departments based on category
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
  "General Medicine": ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Amit Patel"],
  "Family Medicine": ["Dr. Sunita Gupta", "Dr. Vikram Singh", "Dr. Meera Joshi"],
  "Internal Medicine": ["Dr. Arun Mehta", "Dr. Kavita Reddy", "Dr. Sanjay Verma"],
  Pediatrics: ["Dr. Neha Agarwal", "Dr. Rohit Malhotra", "Dr. Deepika Rao"],
  "Emergency Medicine": ["Dr. Kiran Desai", "Dr. Arjun Nair", "Dr. Pooja Iyer"],
  Cardiology: ["Dr. Ashok Gupta", "Dr. Ravi Krishnan", "Dr. Sushma Reddy"],
  Orthopedics: ["Dr. Manoj Tiwari", "Dr. Rekha Jain", "Dr. Suresh Yadav"],
  Neurology: ["Dr. Anita Sharma", "Dr. Rajiv Khanna", "Dr. Nisha Patel"],
  Dermatology: ["Dr. Preeti Agarwal", "Dr. Mohit Gupta", "Dr. Shweta Singh"],
  Ophthalmology: ["Dr. Vinod Kumar", "Dr. Lakshmi Devi", "Dr. Harish Chandra"],
  ENT: ["Dr. Sunil Joshi", "Dr. Radha Krishnan", "Dr. Prakash Sharma"],
  Gynecology: ["Dr. Mamta Verma", "Dr. Sita Devi", "Dr. Usha Rani"],
  Urology: ["Dr. Ramesh Gupta", "Dr. Ajay Kumar", "Dr. Vijay Singh"],
  Psychiatry: ["Dr. Seema Agarwal", "Dr. Raman Jha", "Dr. Nidhi Sharma"],
  Ayurveda: ["Dr. Vaidya Raghunath", "Dr. Ayush Pandey", "Dr. Priyanka Joshi"],
  Dental: ["Dr. Dental Sharma", "Dr. Tooth Patel", "Dr. Smile Kumar"],
  Physiotherapy: ["Dr. Physio Singh", "Dr. Rehab Gupta", "Dr. Therapy Jain"],
}

// Appointment types by category
const appointmentTypesByCategory = {
  general: ["Consultation", "Follow-up", "Check-up", "Emergency"],
  specialized: ["Consultation", "Follow-up", "Procedure", "Surgery", "Diagnostic", "Treatment"],
}

// Time slots
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

// Form schema
const formSchema = z.object({
  category: z.enum(["general", "specialized"], {
    required_error: "Please select an appointment category",
  }),
  department: z.string().min(1, "Please select a department"),
  doctor: z.string().min(1, "Please select a doctor"),
  appointmentType: z.string().min(1, "Please select appointment type"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AppointmentBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  patientId: string
  patientName: string
}

export function AppointmentBookingDialog({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  patientName,
}: AppointmentBookingDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<"general" | "specialized" | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      department: "",
      doctor: "",
      appointmentType: "",
      date: "",
      time: "",
      notes: "",
    },
  })

  // Watch form values
  const watchedCategory = form.watch("category")
  const watchedDepartment = form.watch("department")

  // Reset dependent fields when category changes
  useEffect(() => {
    if (watchedCategory !== selectedCategory) {
      setSelectedCategory(watchedCategory)
      form.setValue("department", "")
      form.setValue("doctor", "")
      form.setValue("appointmentType", "")
    }
  }, [watchedCategory, selectedCategory, form])

  // Reset doctor when department changes
  useEffect(() => {
    form.setValue("doctor", "")
  }, [watchedDepartment, form])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset()
      setSelectedCategory(null)
    }
  }, [isOpen, form])

  // Get available departments and doctors based on selection
  const availableDepartments = watchedCategory ? departmentsByCategory[watchedCategory] : []
  const availableDoctors = watchedDepartment ? doctorsByDepartment[watchedDepartment] || [] : []
  const availableAppointmentTypes = watchedCategory ? appointmentTypesByCategory[watchedCategory] : []

  // Get selected category details
  const selectedCategoryDetails = appointmentCategories.find((cat) => cat.id === watchedCategory)

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  function onSubmit(data: FormValues) {
    // In a real app, this would call an API to book the appointment
    console.log("Booking appointment:", {
      ...data,
      patientId,
      patientName,
      fee: selectedCategoryDetails?.fee,
    })

    // Show success message
    toast({
      title: "Appointment booked successfully",
      description: `Appointment scheduled for ${patientName} on ${data.date} at ${data.time}`,
    })

    // Call success callback
    onSuccess()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>Schedule an appointment for {patientName}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Selection */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Appointment Category *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-4">
                      {appointmentCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <FormItem key={category.id} className="space-y-0">
                            <FormControl>
                              <RadioGroupItem value={category.id} id={category.id} className="sr-only" />
                            </FormControl>
                            <FormLabel htmlFor={category.id} className="cursor-pointer">
                              <Card
                                className={`transition-colors ${
                                  field.value === category.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                                }`}
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
                            </FormLabel>
                          </FormItem>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fee Summary */}
            {selectedCategoryDetails && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Consultation Fee</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">₹{selectedCategoryDetails.fee}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Department Selection */}
            {watchedCategory && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            )}

            {/* Doctor Selection */}
            {watchedDepartment && (
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDoctors.map((doctor) => (
                          <SelectItem key={doctor} value={doctor}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {doctor}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Appointment Type */}
            {watchedCategory && (
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type *</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Selection */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" min={minDate} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Selection */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
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

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special instructions or notes for the appointment..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional notes or special instructions for the appointment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
