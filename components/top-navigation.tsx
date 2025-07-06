"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, CreditCard, Pill, Activity, Calendar, ClipboardList, Building2, UserPlus } from "lucide-react"

export function TopNavigation() {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      current: pathname === "/",
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      current: pathname.startsWith("/patients"),
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: Calendar,
      current: pathname.startsWith("/appointments"),
    },
    {
      name: "Queue",
      href: "/queue",
      icon: ClipboardList,
      current: pathname.startsWith("/queue"),
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
      current: pathname.startsWith("/billing"),
    },
    {
      name: "Pharmacy",
      href: "/pharmacy",
      icon: Pill,
      current: pathname.startsWith("/pharmacy"),
    },
    {
      name: "Departments",
      href: "/departments",
      icon: Building2,
      current: pathname.startsWith("/departments"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: Activity,
      current: pathname.startsWith("/reports"),
    },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Hospital Management System</h1>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      item.current
                        ? "border-blue-500 text-gray-900 bg-blue-50"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50",
                      "inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-t-md transition-colors",
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/patients/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Register Patient
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
