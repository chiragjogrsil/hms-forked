"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Upload, CalendarIcon, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

// Complete form schema with all required fields including appointment
const patientFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  patientId: z.string().optional(),
  careOf: z.string().optional().or(z.literal("")),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().optional().or(z.literal("")),
  category: z.string(),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be at least 10 digits.",
  }),
  email: z.string().email().optional().or(z.literal("")),
  // Additional Information
  aadhaarId: z.string().optional().or(z.literal("")),
  dateOfAdmission: z.date().optional(),
  admissionExpiry: z.date().optional(),
  bloodGroup: z.string().optional().or(z.literal("")),
  referredBy: z.string().optional().or(z.literal("")),
  referrerPhoneNumber: z.string().optional().or(z.literal("")),
  fileNumber: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  scheduleAppointment: z.boolean().optional(),
  // Appointment fields (conditional)
  appointmentDate: z.date().optional(),
  appointmentTime: z.string().optional(),
  appointmentType: z.string().optional(),
  doctor: z.string().optional(),
  department: z.string().optional(),
  appointmentReason: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

interface PatientRegistrationFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PatientRegistrationForm({ onSubmit, onCancel }: PatientRegistrationFormProps) {
  const [scheduleAppointment, setScheduleAppointment] = useState(false)

  // Generate auto patient ID
  const autoPatientId = `P${Math.floor(10000 + Math.random() * 90000)}`

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      patientId: autoPatientId,
      careOf: "",
      dateOfBirth: undefined,
      gender: "male",
      address: "",
      category: "general",
      mobileNumber: "",
      email: "",
      aadhaarId: "",
      dateOfAdmission: undefined,
      admissionExpiry: undefined,
      bloodGroup: "",
      referredBy: "",
      referrerPhoneNumber: "",
      fileNumber: "",
      occupation: "",
      scheduleAppointment: false,
      appointmentDate: undefined,
      appointmentTime: "",
      appointmentType: "consultation",
      doctor: "",
      department: "",
      appointmentReason: "",
    },
    mode: "onChange",
  })

  function handleSubmit(data: PatientFormValues) {
    const submitData = {
      ...data,
      scheduleAppointment,
    }
    onSubmit(submitData)
  }

  // Available time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  // Doctors list
  const doctors = [
    { id: "dr-sharma", name: "Dr. Rajesh Sharma", department: "General Medicine" },
    { id: "dr-patel", name: "Dr. Priya Patel", department: "Cardiology" },
    { id: "dr-singh", name: "Dr. Amit Singh", department: "Orthopedics" },
    { id: "dr-gupta", name: "Dr. Sunita Gupta", department: "Pediatrics" },
    { id: "dr-kumar", name: "Dr. Vikash Kumar", department: "Dermatology" },
  ]

  // Departments
  const departments = [
    "General Medicine",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "Gynecology",
    "Neurology",
    "Psychiatry",
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

          <div className="grid gap-6 md:grid-cols-2">
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

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-50" />
                  </FormControl>
                  <FormDescription>Auto-generated patient ID</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careOf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>C/O (Care Of)</FormLabel>
                  <FormControl>
                    <Input placeholder="Guardian or caretaker name" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter patient's complete address" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
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
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ID</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Optional, for sending reports and receipts</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="photograph"
            render={() => (
              <FormItem>
                <FormLabel>Photograph</FormLabel>
                <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-muted/50">
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Patient Photograph</p>
                  <p className="text-xs text-muted-foreground">Click to upload</p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="aadhaarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar ID</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012" {...field} value={field.value || ""} />
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
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

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dateOfAdmission"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Admission</FormLabel>
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
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={2020}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="admissionExpiry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Admission Expiry</FormLabel>
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={new Date().getFullYear()}
                        toYear={2030}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referred By</FormLabel>
                  <FormControl>
                    <Input placeholder="Doctor or referrer name" {...field} value={field.value || ""} />
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
                  <FormLabel>Referrer's Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 9876543210" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Number</FormLabel>
                  <FormControl>
                    <Input placeholder="File reference number" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Patient's occupation" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Schedule Appointment Option */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
            <Switch
              id="schedule-appointment"
              checked={scheduleAppointment}
              onCheckedChange={setScheduleAppointment}
              className="data-[state=checked]:bg-teal-500"
            />
            <Label htmlFor="schedule-appointment" className="font-medium text-gray-700">
              Schedule appointment after registration
            </Label>
          </div>

          {/* Inline Appointment Details - Show when toggle is ON */}
          {scheduleAppointment && (
            <Card className="border-teal-200 bg-teal-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <CalendarIcon className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Schedule an appointment for the patient after registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
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
                              disabled={(date) => date < new Date()}
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={new Date().getFullYear()}
                              toYear={new Date().getFullYear() + 1}
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
                        <FormLabel>Appointment Time *</FormLabel>
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

                <div className="grid gap-4 md:grid-cols-2">
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
                            {departments.map((dept) => (
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
                        <FormLabel>Doctor *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {doctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{doctor.name}</div>
                                    <div className="text-xs text-gray-500">{doctor.department}</div>
                                  </div>
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
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="check-up">Check-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="procedure">Procedure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the reason for appointment..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {scheduleAppointment ? "Register Patient & Schedule Appointment" : "Register Patient"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
