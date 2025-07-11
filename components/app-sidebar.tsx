"use client"

import { Activity, CreditCard, LayoutDashboard, Pill, Users, TestTube } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { title: "Appointment Dashboard", icon: LayoutDashboard, path: "/" },
    { title: "Patients", icon: Users, path: "/patients" },
    { title: "Services", icon: TestTube, path: "/services" },
    { title: "Billing", icon: CreditCard, path: "/billing" },
    { title: "Pharmacy", icon: Pill, path: "/pharmacy" },
    { title: "Reports", icon: Activity, path: "/reports" },
    { title: "Styled Dashboard", icon: LayoutDashboard, path: "/styled-dashboard" },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">HMS</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
                <Link href={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">Hospital Management System v1.0</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
