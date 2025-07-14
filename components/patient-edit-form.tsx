"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { useEffect } from "react"
import { Upload } from "lucide-react"

// Update the form schema to match the new requirements
const patientEditSchema = z.object({
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
  // Photograph will be handled separately
  aadhaarId: z.string().optional().or(z.literal("")),
  dateOfAdmission: z.date().optional(),
  admissionExpiry: z.date().optional(),
  bloodGroup: z.string().optional().or(z.literal("")),
  referredBy: z.string().optional().or(z.literal("")),
  referrerPhoneNumber: z.string().optional().or(z.literal("")),
  fileNumber: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
})

type PatientEditFormValues = z.infer<typeof patientEditSchema>

interface PatientEditFormProps {
  patient: any
  onSubmit: (data: PatientEditFormValues) => void
  onCancel: () => void
}

export function PatientEditForm({ patient, onSubmit, onCancel }: PatientEditFormProps) {
  // Initialize form with patient data
  const form = useForm<PatientEditFormValues>({
    resolver: zodResolver(patientEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      patientId: "",
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
    },
    mode: "onChange",
  })

  // Update form values when patient data is available
  useEffect(() => {
    if (patient) {
      form.reset({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        patientId: patient.patientId || "",
        careOf: patient.careOf || "",
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined,
        gender: patient.gender || "male",
        address: patient.address || "",
        category: patient.category || "general",
        mobileNumber: patient.mobileNumber || patient.contactNumber || "",
        email: patient.email || "",
        aadhaarId: patient.aadhaarId || "",
        dateOfAdmission: patient.dateOfAdmission ? new Date(patient.dateOfAdmission) : undefined,
        admissionExpiry: patient.admissionExpiry ? new Date(patient.admissionExpiry) : undefined,
        bloodGroup: patient.bloodGroup || "",
        referredBy: patient.referredBy || "",
        referrerPhoneNumber: patient.referrerPhoneNumber || "",
        fileNumber: patient.fileNumber || "",
        occupation: patient.occupation || "",
      })
    }
  }, [patient, form])

  function handleSubmit(data: PatientEditFormValues) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form id="patient-edit-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} value={field.value || ""} />
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
                  <Input placeholder="Doe" {...field} value={field.value || ""} />
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
                  <Input placeholder="Patient ID" {...field} value={field.value || ""} disabled />
                </FormControl>
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

        <div className="grid gap-6 md:grid-cols-3">
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
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
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

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter patient's address" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} value={field.value || ""} />
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
                  <Input placeholder="john.doe@example.com" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Optional, for sending reports and receipts</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}
