"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, User, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  patientId: z.string(),
  careOf: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  address: z.string().optional(),
  category: z.string().optional(),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  emailId: z.string().email().optional().or(z.literal("")),
  aadhaarId: z.string().optional(),
  dateOfAdmission: z.date().optional(),
  admissionExpiry: z.date().optional(),
  bloodGroup: z.string().optional(),
  referredBy: z.string().optional(),
  referrerPhone: z.string().optional(),
  fileNumber: z.string().optional(),
  occupation: z.string().optional(),
  scheduleAppointment: z.boolean().default(false),
  appointmentDate: z.date().optional(),
  appointmentTime: z.string().optional(),
  department: z.string().optional(),
  doctor: z.string().optional(),
  appointmentType: z.string().optional(),
  reasonForVisit: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormData) => void
  onCancel: () => void
}

export function PatientRegistrationForm({ onSubmit, onCancel }: PatientRegistrationFormProps) {
  const [scheduleAppointment, setScheduleAppointment] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientId: `PAT${Date.now().toString().slice(-6)}`,
      scheduleAppointment: false,
    },
  })

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (data: PatientFormData) => {
    onSubmit({ ...data, scheduleAppointment })
  }

  const currentYear = new Date().getFullYear()

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" {...form.register("firstName")} placeholder="Enter first name" />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" {...form.register("lastName")} placeholder="Enter last name" />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Input id="patientId" {...form.register("patientId")} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careOf">C/O (Care Of)</Label>
            <Input id="careOf" {...form.register("careOf")} placeholder="Care of (optional)" />
          </div>

          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("dateOfBirth") && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("dateOfBirth") ? format(form.watch("dateOfBirth"), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("dateOfBirth")}
                  onSelect={(date) => form.setValue("dateOfBirth", date!)}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={currentYear}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.dateOfBirth && (
              <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gender *</Label>
            <RadioGroup
              value={form.watch("gender")}
              onValueChange={(value) => form.setValue("gender", value as "male" | "female" | "other")}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            {form.formState.errors.gender && (
              <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...form.register("address")} placeholder="Enter full address" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => form.setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="senior">Senior Citizen</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input id="mobileNumber" {...form.register("mobileNumber")} placeholder="Enter mobile number" type="tel" />
            {form.formState.errors.mobileNumber && (
              <p className="text-sm text-red-500">{form.formState.errors.mobileNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailId">Email ID</Label>
            <Input id="emailId" {...form.register("emailId")} placeholder="Enter email address" type="email" />
            {form.formState.errors.emailId && (
              <p className="text-sm text-red-500">{form.formState.errors.emailId.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photograph">Photograph</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                id="photograph"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="cursor-pointer"
              />
            </div>
            {photoPreview && (
              <div className="w-16 h-16 rounded-lg overflow-hidden border">
                <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            {!photoPreview && (
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <Camera className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaarId">Aadhaar ID</Label>
            <Input id="aadhaarId" {...form.register("aadhaarId")} placeholder="Enter Aadhaar number" />
          </div>

          <div className="space-y-2">
            <Label>Date of Admission</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("dateOfAdmission") && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("dateOfAdmission") ? (
                    format(form.watch("dateOfAdmission"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("dateOfAdmission")}
                  onSelect={(date) => form.setValue("dateOfAdmission", date)}
                  disabled={(date) => date < new Date("2020-01-01") || date > new Date("2030-12-31")}
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Admission Expiry</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("admissionExpiry") && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("admissionExpiry") ? (
                    format(form.watch("admissionExpiry"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("admissionExpiry")}
                  onSelect={(date) => form.setValue("admissionExpiry", date)}
                  disabled={(date) => date < new Date()}
                  captionLayout="dropdown-buttons"
                  fromYear={currentYear}
                  toYear={2030}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select onValueChange={(value) => form.setValue("bloodGroup", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="referredBy">Referred By</Label>
            <Input id="referredBy" {...form.register("referredBy")} placeholder="Enter referrer name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrerPhone">Referrer's Phone Number</Label>
            <Input
              id="referrerPhone"
              {...form.register("referrerPhone")}
              placeholder="Enter referrer's phone"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileNumber">File Number</Label>
            <Input id="fileNumber" {...form.register("fileNumber")} placeholder="Enter file number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input id="occupation" {...form.register("occupation")} placeholder="Enter occupation" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Appointment Scheduling */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="schedule-appointment" checked={scheduleAppointment} onCheckedChange={setScheduleAppointment} />
          <Label htmlFor="schedule-appointment" className="text-sm font-medium">
            Schedule appointment
          </Label>
        </div>

        {scheduleAppointment && (
          <Card className="border-teal-200 bg-teal-50/50">
            <CardHeader>
              <CardTitle className="text-teal-800 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Appointment Details
              </CardTitle>
              <CardDescription className="text-teal-600">Schedule an appointment for this patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Appointment Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.watch("appointmentDate") && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("appointmentDate") ? (
                          format(form.watch("appointmentDate"), "PPP")
                        ) : (
                          <span>Pick appointment date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("appointmentDate")}
                        onSelect={(date) => form.setValue("appointmentDate", date)}
                        disabled={(date) => date < new Date()}
                        captionLayout="dropdown-buttons"
                        fromYear={currentYear}
                        toYear={currentYear + 1}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Appointment Time *
                  </Label>
                  <Select onValueChange={(value) => form.setValue("appointmentTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="09:30">09:30 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="10:30">10:30 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="11:30">11:30 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="14:30">02:30 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="15:30">03:30 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                      <SelectItem value="16:30">04:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select onValueChange={(value) => form.setValue("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Medicine</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="gynecology">Gynecology</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Doctor *
                  </Label>
                  <Select onValueChange={(value) => form.setValue("doctor", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith (Cardiology)</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Johnson (General Medicine)</SelectItem>
                      <SelectItem value="dr-williams">Dr. Williams (Orthopedics)</SelectItem>
                      <SelectItem value="dr-brown">Dr. Brown (Pediatrics)</SelectItem>
                      <SelectItem value="dr-davis">Dr. Davis (Gynecology)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <Select onValueChange={(value) => form.setValue("appointmentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="check-up">Check-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reasonForVisit">Reason for Visit</Label>
                  <Textarea
                    id="reasonForVisit"
                    {...form.register("reasonForVisit")}
                    placeholder="Brief description of the reason for visit"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {scheduleAppointment ? "Register Patient & Schedule Appointment" : "Register Patient"}
        </Button>
      </div>
    </form>
  )
}
