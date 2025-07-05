"use client"

import type React from "react"
import {
  CalendarCheck,
  Clock8,
  Stethoscope,
  CheckCircle2,
  Play,
  Check,
  Clock,
  UserPlus,
  NotebookPen,
  CalendarPlus,
  CalendarPlus2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"
import { AppointmentBookingDialog } from "@/components/appointment-booking-dialog"
import { QuickRegistrationDialog } from "@/components/quick-registration-dialog"
import { PatientCreationDialog } from "@/components/patient-creation-dialog"

import type { FC } from "react"

const MotionCard = motion(Card)

interface StatCardProps {
  title: string
  value: string
  icon: React.ElementType
  colorClass: {
    bg: string
    text: string
  }
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, colorClass }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <MotionCard
      className="rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      whileHover={!shouldReduceMotion ? { scale: 1.03, y: -5 } : {}}
      transition={!shouldReduceMotion ? { type: "spring", stiffness: 400, damping: 10 } : { duration: 0 }}
    >
      <CardContent className="p-6 flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass.bg}`}>
          <Icon className={`h-6 w-6 ${colorClass.text}`} aria-hidden="true" />
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </MotionCard>
  )
}

const initialAppointmentsData = [
  {
    id: 1,
    time: "09:00 AM",
    patient: "Liam Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Consultation",
    status: "Scheduled",
    fee: "$250.00",
  },
  {
    id: 2,
    time: "10:00 AM",
    patient: "Olivia Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Follow-up",
    status: "Waiting",
    fee: "$150.00",
  },
  {
    id: 3,
    time: "11:00 AM",
    patient: "Noah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Check-up",
    status: "In Progress",
    fee: "$100.00",
  },
  {
    id: 4,
    time: "12:00 PM",
    patient: "Emma Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "Consultation",
    status: "Completed",
    fee: "$250.00",
  },
  {
    id: 5,
    time: "01:00 PM",
    patient: "James Jones",
    avatar: "/placeholder.svg?height=40&width=40",
    reason: "New Patient",
    status: "Scheduled",
    fee: "$300.00",
  },
]

type AppointmentStatus = "Scheduled" | "Waiting" | "In Progress" | "Completed"

const getStatusPill = (status: AppointmentStatus) => {
  switch (status) {
    case "Scheduled":
      return (
        <Badge
          variant="outline"
          className="border-gray-300 text-gray-600 bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800/50"
        >
          Scheduled
        </Badge>
      )
    case "Waiting":
      return (
        <Badge
          variant="outline"
          className="border-yellow-300 text-yellow-800 bg-yellow-50 dark:border-yellow-700/80 dark:text-yellow-300 dark:bg-yellow-900/50"
        >
          Waiting
        </Badge>
      )
    case "In Progress":
      return (
        <Badge
          variant="outline"
          className="border-indigo-300 text-indigo-800 bg-indigo-50 dark:border-indigo-700/80 dark:text-indigo-300 dark:bg-indigo-900/50"
        >
          In Progress
        </Badge>
      )
    case "Completed":
      return (
        <Badge
          variant="outline"
          className="border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-700/80 dark:text-emerald-300 dark:bg-emerald-900/50"
        >
          Completed
        </Badge>
      )
  }
}

const AppointmentSkeleton = () => (
  <div className="flex items-center gap-4 p-3">
    <Skeleton className="h-8 w-20" />
    <div className="flex items-center gap-3 flex-1">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-5 w-32" />
    </div>
    <Skeleton className="h-6 w-24 hidden sm:block" />
    <Skeleton className="h-6 w-28 hidden md:block" />
    <Skeleton className="h-9 w-24 hidden lg:block" />
    <Skeleton className="h-9 w-36" />
  </div>
)

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isQuickRegOpen, setIsQuickRegOpen] = useState(false)
  const [isCreationOpen, setIsCreationOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(initialAppointmentsData)
      setIsLoading(false)
    }, 1500) // Reduced loading time
    return () => clearTimeout(timer)
  }, [])

  const handleStatusChange = (id: number, newStatus: AppointmentStatus) => {
    setAppointments((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
  }

  const getActionButtons = (appointment: (typeof initialAppointmentsData)[0]) => {
    switch (appointment.status) {
      case "Scheduled":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(appointment.id, "Waiting")}
            className="gap-1"
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Mark Waiting
          </Button>
        )
      case "Waiting":
        return (
          <Button size="sm" variant="outline" onClick={() => handleStatusChange(appointment.id, "In Progress")}>
            <Play className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Start
          </Button>
        )
      case "In Progress":
        return (
          <Button size="sm" onClick={() => handleStatusChange(appointment.id, "Completed")}>
            <Check className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Complete
          </Button>
        )
      default:
        return null
    }
  }

  const stats = [
    {
      title: "Today's Appointments",
      value: "124",
      icon: CalendarCheck,
      colorClass: {
        bg: "bg-blue-100 dark:bg-blue-900/50",
        text: "text-blue-600 dark:text-blue-400",
      },
    },
    {
      title: "Pending",
      value: "32",
      icon: Clock8,
      colorClass: {
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        text: "text-yellow-600 dark:text-yellow-400",
      },
    },
    {
      title: "In Progress",
      value: "12",
      icon: Stethoscope,
      colorClass: {
        bg: "bg-indigo-100 dark:bg-indigo-900/50",
        text: "text-indigo-600 dark:text-indigo-400",
      },
    },
    {
      title: "Completed",
      value: "80",
      icon: CheckCircle2,
      colorClass: {
        bg: "bg-emerald-100 dark:bg-emerald-900/50",
        text: "text-emerald-600 dark:text-emerald-400",
      },
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const MotionDiv = motion.div

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 md:gap-8">
        <MotionDiv
          className="flex flex-wrap items-center gap-2"
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionDiv variants={shouldReduceMotion ? undefined : itemVariants}>
            <Button onClick={() => setIsCreationOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              New Patient
            </Button>
          </MotionDiv>
          <MotionDiv variants={shouldReduceMotion ? undefined : itemVariants}>
            <Button variant="secondary" onClick={() => setIsBookingOpen(true)}>
              <NotebookPen className="mr-2 h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Button>
          </MotionDiv>
          <MotionDiv variants={shouldReduceMotion ? undefined : itemVariants}>
            <Button variant="ghost" onClick={() => setIsQuickRegOpen(true)}>
              <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Quick Registration
            </Button>
          </MotionDiv>
        </MotionDiv>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              colorClass={stat.colorClass}
            />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Today’s Appointments</CardTitle>
            <CardDescription className="prose prose-sm dark:prose-invert">
              A summary of today's scheduled patient visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <AppointmentSkeleton key={i} />)
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-sm font-medium text-muted-foreground w-20">{appointment.time}</div>
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patient} />
                        <AvatarFallback>{appointment.patient.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{appointment.patient}</span>
                    </div>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      {appointment.reason}
                    </Badge>
                    <div className="w-28 hidden md:block">{getStatusPill(appointment.status as AppointmentStatus)}</div>
                    <div className="font-mono text-sm w-24 text-right hidden lg:block">{appointment.fee}</div>
                    <div className="w-36 text-right">{getActionButtons(appointment)}</div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No appointments yet 🎉"
                  description="Looks like a quiet day. You can book a new appointment now."
                  buttonText="Book Appointment"
                  onButtonClick={() => setIsBookingOpen(true)}
                  Icon={CalendarPlus2}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <AppointmentBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        onAppointmentCreated={(newAppointment) => {
          setAppointments((prev) => [...prev, { ...newAppointment, id: prev.length + 1, status: "Scheduled" }])
        }}
      />
      <QuickRegistrationDialog open={isQuickRegOpen} onOpenChange={setIsQuickRegOpen} />
      <PatientCreationDialog
        open={isCreationOpen}
        onOpenChange={setIsCreationOpen}
        onPatientCreated={(newPatient) => {
          console.log("New patient created:", newPatient)
        }}
      />
    </>
  )
}
