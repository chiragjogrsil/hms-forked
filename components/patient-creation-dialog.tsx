"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.string().min(1, "Please select a gender"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  // Appointment fields
  scheduleAppointment: z.boolean().default(false),
  department: z.string().optional(),
  doctor: z.string().optional(),
  consultationType: z.string().optional(),
  appointmentDate: z.date().optional(),
  timeSlot: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface PatientCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientCreated: (patientData: any) => void
}

export function PatientCreationDialog({ open, onOpenChange, onPatientCreated }: PatientCreationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      bloodGroup: "",
      allergies: "",
      medicalHistory: "",
      scheduleAppointment: false,
      department: "",
      doctor: "",
      consultationType: "",
      timeSlot: "",
    },
  })

  const watchScheduleAppointment = form.watch("scheduleAppointment")
  const watchDepartment = form.watch("department")

  const filteredDoctors = doctors.filter((doctor) => doctor.department === watchDepartment)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate patient ID
      const patientId = `PAT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      // Create patient data object
      const patientData = {
        id: patientId,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
        emergencyContact: data.emergencyContact,
        bloodGroup: data.bloodGroup,
        allergies: data.allergies,
        medicalHistory: data.medicalHistory,
      }

      if (data.scheduleAppointment) {
        // Validate appointment fields
        if (!data.department || !data.doctor || !data.consultationType || !data.appointmentDate || !data.timeSlot) {
          toast({
            title: "Incomplete Appointment Details",
            description: "Please fill in all appointment fields or disable appointment scheduling.",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        // Generate appointment details
        const tokenNumber = `T${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`
        const selectedDoctor = doctors.find((d) => d.id === data.doctor)
        const selectedDepartment = departments.find((d) => d.id === data.department)
        const selectedConsultationType = consultationTypes.find((c) => c.id === data.consultationType)

        // Success toast for patient + appointment
        toast({
          title: "Patient & Appointment Created Successfully!",
          description: (
            <div className="space-y-2 text-sm">
              <div className="font-semibold">Patient Details:</div>
              <div>
                • {data.firstName} {data.lastName} (ID: {patientId})
              </div>
              <div>• Phone: {data.phone}</div>
              <div className="font-semibold mt-2">Appointment Details:</div>
              <div>• Doctor: {selectedDoctor?.name}</div>
              <div>• Department: {selectedDepartment?.name}</div>
              <div>• Date: {format(data.appointmentDate, "PPP")}</div>
              <div>• Time: {data.timeSlot}</div>
              <div>• Type: {selectedConsultationType?.name}</div>
              <div>• Token: {tokenNumber}</div>
            </div>
          ),
          duration: 10000,
        })

        // Follow-up reminder toast
        setTimeout(() => {
          toast({
            title: "Appointment Reminder",
            description: `Don't forget: ${data.firstName} ${data.lastName} has an appointment on ${format(data.appointmentDate, "PPP")} at ${data.timeSlot}`,
            duration: 5000,
          })
        }, 2000)
      } else {
        // Success toast for patient only
        toast({
          title: "Patient Created Successfully!",
          description: (
            <div className="space-y-1 text-sm">
              <div>
                • Name: {data.firstName} {data.lastName}
              </div>
              <div>• Patient ID: {patientId}</div>
              <div>• Phone: {data.phone}</div>
              <div>• Category: {data.bloodGroup ? "Complete Profile" : "Basic Profile"}</div>
            </div>
          ),
          duration: 6000,
        })
      }

      form.reset()
      onPatientCreated(patientData)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create patient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
          <DialogDescription>
            Enter patient information to create a new patient record. Optionally schedule an appointment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            defaultMonth={field.value}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter emergency contact number" {...field} />
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
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Known Allergies</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List any known allergies" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Brief medical history" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Appointment Scheduling */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="scheduleAppointment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base font-semibold">Schedule Appointment</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Create an appointment along with patient registration
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {watchScheduleAppointment && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50 border-blue-200">
                  <h4 className="font-semibold text-blue-900">Appointment Details</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
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
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchDepartment}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select doctor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredDoctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  {doctor.name}
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
                      name="consultationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select consultation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {consultationTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
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
                                  {field.value ? format(field.value, "PPP") : <span>Pick appointment date</span>}
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
                                defaultMonth={field.value}
                                disabled={(date) => date < new Date()}
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
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Slot *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {watchScheduleAppointment ? "Create Patient & Appointment" : "Create Patient"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Mock data for departments and doctors
const departments = [
  { id: "cardiology", name: "Cardiology" },
  { id: "neurology", name: "Neurology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "general", name: "General Medicine" },
]

const doctors = [
  { id: "dr-sharma", name: "Dr. Sharma", department: "cardiology" },
  { id: "dr-patel", name: "Dr. Patel", department: "neurology" },
  { id: "dr-kumar", name: "Dr. Kumar", department: "orthopedics" },
  { id: "dr-gupta", name: "Dr. Gupta", department: "pediatrics" },
  { id: "dr-singh", name: "Dr. Singh", department: "general" },
]

const consultationTypes = [
  { id: "consultation", name: "Consultation" },
  { id: "follow-up", name: "Follow-up" },
  { id: "emergency", name: "Emergency" },
]

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
]
