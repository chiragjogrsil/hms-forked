"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, AlertTriangle, UserPlus, Clock } from "lucide-react"
import { format } from "date-fns"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Simplified schema for emergency registration
const quickEmergencyFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.enum(["male", "female", "other"]),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be at least 10 digits.",
  }),
  emergencyReason: z.string().min(5, {
    message: "Please describe the emergency reason.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }),
  urgencyLevel: z.enum(["urgent", "critical"], {
    required_error: "Please select urgency level.",
  }),
})

type QuickEmergencyFormValues = z.infer<typeof quickEmergencyFormSchema>

interface QuickEmergencyRegistrationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientRegistered?: (data: any) => void
}

const departments = [
  "Emergency Medicine",
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Surgery",
]

export function QuickEmergencyRegistration({
  open,
  onOpenChange,
  onPatientRegistered,
}: QuickEmergencyRegistrationProps) {
  const { toast } = useToast()

  const form = useForm<QuickEmergencyFormValues>({
    resolver: zodResolver(quickEmergencyFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      gender: "male",
      mobileNumber: "",
      emergencyReason: "",
      department: "Emergency Medicine",
      urgencyLevel: "urgent",
    },
    mode: "onChange",
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        form.reset({
          firstName: "",
          lastName: "",
          dateOfBirth: undefined,
          gender: "male",
          mobileNumber: "",
          emergencyReason: "",
          department: "Emergency Medicine",
          urgencyLevel: "urgent",
        })
      }, 300)
    }
  }, [open, form])

  function onSubmit(data: QuickEmergencyFormValues) {
    console.log("Quick emergency registration data:", data)

    // Generate a patient ID (in a real app, this would come from the backend)
    const patientId = `P${Math.floor(10000 + Math.random() * 90000)}`

    // Format the patient name
    const patientName = `${data.firstName} ${data.lastName}`

    // Create a token number for emergency cases (higher priority)
    const tokenNumber = `E${Math.floor(10 + Math.random() * 90)}`

    // Calculate age
    const calculateAge = (birthDate: Date): number => {
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    }

    // Create the patient data object
    const patientData = {
      id: patientId,
      name: patientName,
      firstName: data.firstName,
      lastName: data.lastName,
      age: calculateAge(data.dateOfBirth),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      mobileNumber: data.mobileNumber,
      contactNumber: data.mobileNumber,
      category: "Emergency",
      emergencyReason: data.emergencyReason,
      department: data.department,
      urgencyLevel: data.urgencyLevel,
      tokenNumber,
      registrationTime: new Date(),
      status: "Active",
      // Create immediate appointment
      appointment: {
        id: `app-emergency-${Date.now()}`,
        patientName: patientName,
        contactNumber: data.mobileNumber,
        department: data.department,
        doctor: "Emergency Doctor", // Will be assigned by triage
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "Emergency",
        status: "waiting", // Emergency patients go directly to waiting
        token: tokenNumber,
        fee: data.urgencyLevel === "critical" ? 2000 : 1500,
        paymentStatus: "pending",
        urgencyLevel: data.urgencyLevel,
        emergencyReason: data.emergencyReason,
      },
    }

    // Call the onPatientRegistered callback if provided
    if (onPatientRegistered) {
      onPatientRegistered(patientData)
    }

    // Close the dialog
    onOpenChange(false)

    // Show a success toast with emergency priority information
    toast({
      title: "🚨 Emergency Registration Successful",
      description: (
        <div className="space-y-1">
          <div className="font-medium">{patientName} registered for emergency care</div>
          <div className="text-sm opacity-90">
            Token: {tokenNumber} | Priority: {data.urgencyLevel.toUpperCase()}
            <br />
            Department: {data.department}
            <br />
            Status: Ready for immediate triage
          </div>
        </div>
      ),
      duration: 8000,
    })

    // Show additional priority information
    setTimeout(() => {
      toast({
        title: "⚡ Priority Queue",
        description: `${patientName} has been added to the priority queue and will be seen immediately.`,
        duration: 5000,
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Quick Emergency Registration
          </DialogTitle>
          <DialogDescription>
            Fast-track registration for emergency cases. Only essential information required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient Basic Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Patient Information
              </h3>

              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          value={field.value || ""}
                          onChange={field.onChange}
                          className="bg-white"
                        />
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
                        <Input
                          placeholder="Doe"
                          value={field.value || ""}
                          onChange={field.onChange}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 mt-3">
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
                                "w-full pl-3 text-left font-normal bg-white",
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
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+91 9876543210"
                          value={field.value || ""}
                          onChange={field.onChange}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="mt-3">
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

            {/* Emergency Details */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Emergency Details
              </h3>

              <FormField
                control={form.control}
                name="emergencyReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Reason *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the emergency condition..."
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="bg-white"
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>Describe the emergency condition to help with triage</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-3 md:grid-cols-2 mt-3">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
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
                  name="urgencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="urgent">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              Urgent
                            </div>
                          </SelectItem>
                          <SelectItem value="critical">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              Critical
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Critical cases receive highest priority</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Register Emergency Patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
