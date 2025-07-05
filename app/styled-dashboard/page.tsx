"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, Users } from "lucide-react"

export default function StyledDashboard() {
  const primaryColor = "emerald" // Tailwind color name
  const secondaryColor = "gray" // Tailwind color name
  const textColor = "zinc" // Tailwind color name

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Styled Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={`border-${primaryColor}-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium text-${textColor}-700`}>Total Patients Today</CardTitle>
            <Users className={`h-4 w-4 text-${secondaryColor}-500`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <p className={`text-xs text-${textColor}-500`}>+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card className={`border-${primaryColor}-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium text-${textColor}-700`}>Appointments Today</CardTitle>
            <Calendar className={`h-4 w-4 text-${secondaryColor}-500`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">28</div>
            <p className={`text-xs text-${textColor}-500`}>4 pending</p>
          </CardContent>
        </Card>
        <Card className={`border-${primaryColor}-500`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium text-${textColor}-700`}>Current Queue</CardTitle>
            <Activity className={`h-4 w-4 text-${secondaryColor}-500`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className={`text-xs text-${textColor}-500`}>Average wait: 15 min</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className={`border-${primaryColor}-500`}>
          <CardHeader>
            <CardTitle className={`text-lg font-semibold text-${textColor}-700`}>Quick Actions</CardTitle>
            <CardDescription className={`text-sm text-${textColor}-500`}>Manage common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button className={`bg-${primaryColor}-500 hover:bg-${primaryColor}-700 text-white`}>
              Book Appointment
            </Button>
            <Button className={`bg-${primaryColor}-500 hover:bg-${primaryColor}-700 text-white`}>
              Register Patient
            </Button>
            <Button className={`bg-${primaryColor}-500 hover:bg-${primaryColor}-700 text-white`}>View Reports</Button>
            <Button className={`bg-${primaryColor}-500 hover:bg-${primaryColor}-700 text-white`}>Manage Queue</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
