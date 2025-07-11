"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, User, Phone, MapPin, Heart, FileText, Save, X, Clock } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Enhanced form schema with comprehensive validation
const patientFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name too long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name too long"),
  careOf: z.string().optional().or(z.literal("")),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please select a valid date",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  address: z.string().min(10, "Address must be at least 10 characters").max(200, "Address too long"),
  category: z.string({
    required_error: "Please select a category",
  }),
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number too long")
    .regex(/^[+]?[0-9\s-()]+$/, "Invalid mobile number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  aadhaarId: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0 || /^\d{4}\s?\d{4}\s?\d{4}$/.test(val), "Aadhaar ID must be 12 digits"),
  bloodGroup: z.string().optional().or(z.literal("")),
  referredBy: z.string().optional().or(z.literal("")),
  referrerPhoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0 || /^[+]?[0-9\s-()]+$/.test(val), "Invalid phone number format"),
  fileNumber: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .min(10, "Emergency contact phone is required")
    .regex(/^[+]?[0-9\s-()]+$/, "Invalid phone number format"),
  emergencyContactRelation: z.string().min(2, "Emergency contact relation is required"),
  allergies: z.string().optional().or(z.literal("")),
  medicalHistory: z.string().optional().or(z.literal("")),
  currentMedications: z.string().optional().or(z.literal("")),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientCreated: (data: any) => void
}

export function PatientCreationDialog({ open, onOpenChange, onPatientCreated }: PatientCreationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const [scheduleAppointment, setScheduleAppointment] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date())
  const [appointmentTime, setAppointmentTime] = useState("")
  const [department, setDepartment] = useState("")
  const [doctor, setDoctor] = useState("")
  const [consultationType, setConsultationType] = useState("")

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
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  // Department to doctors mapping
  const departmentDoctorsMap: Record<string, string[]> = {
    "General Medicine": ["Dr. Smith", "Dr. Johnson", "Dr. Wilson"],
    Cardiology: ["Dr. Johnson", "Dr. Martinez", "Dr. Lee"],
    Orthopedics: ["Dr. Williams", "Dr. Garcia", "Dr. Anderson"],
    Pediatrics: ["Dr. Davis", "Dr. Roberts", "Dr. White"],
    Neurology: ["Dr. Brown", "Dr. Thompson", "Dr. Harris"],
    Dermatology: ["Dr. Miller", "Dr. Clark", "Dr. Lewis"],
  }

  // Get available doctors based on selected department
  const availableDoctors = department ? departmentDoctorsMap[department] || [] : []

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      careOf: "",
      gender: "male",
      address: "",
      category: "general",
      mobileNumber: "",
      email: "",
      aadhaarId: "",
      bloodGroup: "",
      referredBy: "",
      referrerPhoneNumber: "",
      fileNumber: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      allergies: "",
      medicalHistory: "",
      currentMedications: "",
    },
    mode: "onChange",
  })

  const { watch, trigger, formState } = form
  const watchedFields = watch()

  // Real-time validation for current step
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof PatientFormValues)[] = []

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "dateOfBirth", "gender", "mobileNumber", "category"]
        break
      case 2:
        fieldsToValidate = ["address", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation"]
        break
      case 3:
        fieldsToValidate = ["email", "aadhaarId"] // Optional fields, but validate format if provided
        break
    }

    const result = await trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true)

    try {
      // Generate patient ID
      const patientId = `P${Date.now().toString().slice(-6)}`

      // Format the patient data
      const patientData = {
        id: patientId,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        careOf: data.careOf,
        age: calculateAge(data.dateOfBirth),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        category: data.category,
        phone: data.mobileNumber,
        mobileNumber: data.mobileNumber,
        email: data.email,
        aadhaarId: data.aadhaarId,
        bloodGroup: data.bloodGroup,
        referredBy: data.referredBy,
        referrerPhoneNumber: data.referrerPhoneNumber,
        fileNumber: data.fileNumber,
        occupation: data.occupation,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelation,
        },
        allergies: data.allergies ? data.allergies.split(",").map((a) => a.trim()) : [],
        medicalHistory: data.medicalHistory ? data.medicalHistory.split(",").map((h) => h.trim()) : [],
        currentMedications: data.currentMedications ? data.currentMedications.split(",").map((m) => m.trim()) : [],
        createdAt: new Date().toISOString(),
        lastVisit: null,
        status: "Active",
      }

      // Create appointment if requested
      if (scheduleAppointment && appointmentDate && appointmentTime && department && doctor && consultationType) {
        const appointmentData = {
          id: `app-${Date.now()}`,
          patientId: patientId,
          patientName: patientData.name,
          department,
          doctor,
          date: appointmentDate,
          time: appointmentTime,
          type: consultationType,
          appointmentType: "general",
          fee: 1500,
          paymentStatus: "pending",
          status: "scheduled",
          contactNumber: data.mobileNumber,
          token: `Token #${Math.floor(Math.random() * 100) + 1}`,
        }

        // Show success toast with appointment info
        toast.success("Patient & Appointment Created Successfully!", {
          description: (
            <div className="space-y-2">
              <div className="font-medium">Patient Details:</div>
              <div>• Name: {patientData.name}</div>
              <div>• Patient ID: {patientId}</div>
              <div className="font-medium mt-2">Appointment Details:</div>
              <div>• Doctor: {doctor}</div>
              <div>• Department: {department}</div>
              <div>• Date: {format(appointmentDate, "PPP")}</div>
              <div>• Time: {appointmentTime}</div>
              <div>• Type: {consultationType}</div>
              <div>• Token: {appointmentData.token}</div>
            </div>
          ),
          duration: 10000,
          action: {
            label: "View Details",
            onClick: () => {
              console.log("Appointment created:", appointmentData)
            },
          },
        })

        // Also show a separate appointment confirmation toast
        setTimeout(() => {
          toast.info("Appointment Reminder", {
            description: `Don't forget: ${patientData.name} has an appointment with ${doctor} on ${format(appointmentDate, "PPP")} at ${appointmentTime}`,
            duration: 8000,
          })
        }, 2000)
      } else {
        // Show success toast for patient only
        toast.success("Patient Created Successfully!", {
          description: (
            <div className="space-y-1">
              <div>• Name: {patientData.name}</div>
              <div>• Patient ID: {patientId}</div>
              <div>• Category: {data.category}</div>
              <div>• Phone: {data.mobileNumber}</div>
            </div>
          ),
          duration: 6000,
          action: {
            label: "View Patient",
            onClick: () => {
              onPatientCreated(patientData)
            },
          },
        })
      }

      // Reset form and close dialog
      form.reset()
      setCurrentStep(1)
      setScheduleAppointment(false)
      setAppointmentDate(new Date())
      setAppointmentTime("")
      setDepartment("")
      setDoctor("")
      setConsultationType("")
      onOpenChange(false)

      // Call the callback with patient data
      onPatientCreated(patientData)
    } catch (error) {
      toast.error("Failed to create patient", {
        description: "Please try again or contact support if the problem persists.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Information"
      case 2:
        return "Contact & Emergency Details"
      case 3:
        return "Additional Information"
      default:
        return "Patient Details"
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Enter the patient's basic personal information"
      case 2:
        return "Provide contact details and emergency contact information"
      case 3:
        return "Add optional medical and reference information"
      default:
        return "Complete the patient registration"
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          watchedFields.firstName &&
          watchedFields.lastName &&
          watchedFields.dateOfBirth &&
          watchedFields.gender &&
          watchedFields.mobileNumber &&
          watchedFields.category &&
          !formState.errors.firstName &&
          !formState.errors.lastName &&
          !formState.errors.dateOfBirth &&
          !formState.errors.gender &&
          !formState.errors.mobileNumber &&
          !formState.errors.category
        )
      case 2:
        return (
          watchedFields.address &&
          watchedFields.emergencyContactName &&
          watchedFields.emergencyContactPhone &&
          watchedFields.emergencyContactRelation &&
          !formState.errors.address &&
          !formState.errors.emergencyContactName &&
          !formState.errors.emergencyContactPhone &&
          !formState.errors.emergencyContactRelation
        )
      case 3:
        return !formState.errors.email && !formState.errors.aadhaarId
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-teal-600" />
            </div>
            Create New Patient
          </DialogTitle>
          <DialogDescription>
            {getStepDescription(currentStep)} • Step {currentStep} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step < currentStep
                    ? "bg-teal-500 text-white"
                    : step === currentStep
                      ? "bg-teal-100 text-teal-600 border-2 border-teal-500"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {step < 3 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-teal-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-teal-600" />
                    {getStepTitle(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="careOf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>C/O (Care Of)</FormLabel>
                        <FormControl>
                          <Input placeholder="Guardian or caretaker name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Birth *</FormLabel>
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
                                onSelect={(date) => {
                                  field.onChange(date)
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                                defaultMonth={field.value}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender *</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-normal">Other</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="senior">Senior Citizen</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Contact & Emergency Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-teal-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter complete address" {...field} />
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
                          <FormLabel>Email ID</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormDescription>Optional, for sending reports and receipts</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="h-5 w-5 text-red-600" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact person name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Phone *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContactRelation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="friend">Friend</SelectItem>
                                <SelectItem value="guardian">Guardian</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5 text-teal-600" />
                      Additional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="aadhaarId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aadhaar ID</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="Patient's occupation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Number</FormLabel>
                            <FormControl>
                              <Input placeholder="File reference number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="referredBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referred By</FormLabel>
                            <FormControl>
                              <Input placeholder="Doctor or referrer name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="referrerPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referrer's Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-red-600" />
                      Medical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Known Allergies</FormLabel>
                          <FormControl>
                            <Textarea placeholder="List any known allergies (comma separated)" {...field} />
                          </FormControl>
                          <FormDescription>e.g., Penicillin, Shellfish, Peanuts</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical History</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Previous medical conditions (comma separated)" {...field} />
                          </FormControl>
                          <FormDescription>e.g., Diabetes, Hypertension, Heart Disease</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentMedications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Medications</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Current medications (comma separated)" {...field} />
                          </FormControl>
                          <FormDescription>e.g., Metformin 500mg, Lisinopril 10mg</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appointment Scheduling Section */}
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Schedule Appointment (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="schedule-appointment"
                    checked={scheduleAppointment}
                    onCheckedChange={setScheduleAppointment}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="schedule-appointment" className="font-medium text-gray-700">
                    Schedule an appointment for this patient
                  </Label>
                </div>

                {scheduleAppointment && (
                  <div className="space-y-4 pt-4 border-t border-blue-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select value={department} onValueChange={setDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Neurology">Neurology</SelectItem>
                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Doctor *</Label>
                        <Select value={doctor} onValueChange={setDoctor} disabled={!department}>
                          <SelectTrigger>
                            <SelectValue placeholder={department ? "Select doctor" : "Select department first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDoctors.map((doc) => (
                              <SelectItem key={doc} value={doc}>
                                {doc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Consultation Type *</Label>
                        <Select value={consultationType} onValueChange={setConsultationType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consultation">Consultation</SelectItem>
                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                            <SelectItem value="Procedure">Procedure</SelectItem>
                            <SelectItem value="Test">Test</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Time *</Label>
                        <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Appointment Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !appointmentDate && "text-muted-foreground",
                            )}
                          >
                            {appointmentDate ? format(appointmentDate, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={appointmentDate}
                            onSelect={(date) => {
                              setAppointmentDate(date)
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            defaultMonth={appointmentDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {scheduleAppointment &&
                      (!department || !doctor || !consultationType || !appointmentTime || !appointmentDate) && (
                        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                          Please fill in all appointment fields to schedule an appointment along with patient
                          registration.
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isStepValid(currentStep)}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Create Patient
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
