"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Activity, Calendar, CheckCircle2, FlaskConical, Heart, Play, Stethoscope, User, View, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import TabsTrigger

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { serviceRequests as serviceData, type ServiceRequest, type ServiceType } from "@/data/services"
import { cn } from "@/lib/utils"
import { CardSkeleton } from "@/components/card-skeleton"
import { EmptyState } from "@/components/empty-state"

const serviceTabs: { type: ServiceType; icon: React.ElementType }[] = [
  { type: "Pathology", icon: FlaskConical },
  { type: "Radiology", icon: Zap },
  { type: "Procedure", icon: Activity },
  { type: "Panchkarma", icon: Heart },
]

const StatusBadge = ({ status }: { status: ServiceRequest["status"] }) => {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "In-progress": "bg-blue-100 text-blue-800 border-blue-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
  }
  return <Badge className={cn("font-medium", statusStyles[status])}>{status}</Badge>
}

const ActionButton = ({ status }: { status: ServiceRequest["status"] }) => {
  if (status === "Pending") {
    return (
      <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
        <Play className="mr-2 h-4 w-4" />
        Start
      </Button>
    )
  }
  if (status === "In-progress") {
    return (
      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Complete
      </Button>
    )
  }
  return (
    <Button size="sm" variant="outline" className="w-full bg-transparent">
      <View className="mr-2 h-4 w-4" />
      View Report
    </Button>
  )
}

const ServiceCard = ({ service }: { service: ServiceRequest }) => (
  <Card className="flex flex-col transition-all hover:shadow-lg">
    <CardHeader>
      <div className="flex items-start justify-between">
        <CardTitle className="text-base font-semibold">{service.serviceName}</CardTitle>
        <Badge variant={service.urgency === "Urgent" ? "destructive" : "secondary"}>{service.urgency}</Badge>
      </div>
    </CardHeader>
    <CardContent className="flex-grow space-y-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <User className="h-4 w-4" />
        <span>
          {service.patient.name} ({service.patient.age}, {service.patient.gender})
        </span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Prescribed: {new Date(service.prescribedDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Stethoscope className="h-4 w-4" />
        <span>Dr. {service.prescribingDoctor}</span>
      </div>
      {service.sampleType && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <FlaskConical className="h-4 w-4" />
          <span>Sample: {service.sampleType}</span>
        </div>
      )}
    </CardContent>
    <CardFooter className="flex items-center justify-between gap-4 pt-4">
      <StatusBadge status={service.status} />
      <ActionButton status={service.status} />
    </CardFooter>
  </Card>
)

export default function ServicesPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setServiceRequests(serviceData)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const renderContent = (type: ServiceType) => {
    if (isLoading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )
    }

    const filteredServices = serviceRequests.filter((req) => req.serviceType === type)

    if (filteredServices.length === 0) {
      const TabIcon = serviceTabs.find((tab) => tab.type === type)?.icon || Activity
      return (
        <div className="pt-8">
          <EmptyState
            title={`No ${type} Requests`}
            description={`There are currently no pending or completed ${type.toLowerCase()} services.`}
            buttonText="Request New Service"
            onButtonClick={() => alert(`Requesting new ${type} service...`)}
            Icon={TabIcon}
          />
        </div>
      )
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Services & Procedures</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Pathology">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {serviceTabs.map(({ type, icon: Icon }) => (
                <TabsTrigger key={type} value={type}>
                  <Icon className="mr-2 h-4 w-4" />
                  {type}
                </TabsTrigger> // Added closing tag
              ))}
            </TabsList>
            {serviceTabs.map(({ type }) => (
              <TabsContent key={type} value={type} className="pt-6">
                {renderContent(type)}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
