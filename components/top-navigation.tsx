"use client"

import { Activity, LayoutDashboard, Users, TestTube } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DoctorSwitcher } from "@/components/doctor-switcher"

export function TopNavigation() {
  const pathname = usePathname()

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Patients", icon: Users, path: "/patients" },
    { title: "Services", icon: TestTube, path: "/services" },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4">
      <div className="flex items-center gap-2 mr-6">
        <Activity className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">HMS</span>
      </div>

      <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === item.path ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center space-x-4">
        <DoctorSwitcher />
      </div>
    </header>
  )
}
