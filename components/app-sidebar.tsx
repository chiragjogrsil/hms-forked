"use client"

import { useState } from "react"
import { LayoutDashboard, Settings, Users, Calendar, FileText, Video, TestTube, Menu, X } from "lucide-react"
import { type SidebarNavItem, SidebarNav } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

const navItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/styled-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Prescribe Tests",
    href: "/services",
    icon: TestTube,
  },
  {
    title: "Invoices",
    href: "/billing",
    icon: FileText,
  },
  {
    title: "Telemedicine",
    href: "/telemedicine",
    icon: Video,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0">
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-6">
            <SidebarNav items={navItems} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex flex-col gap-2">
          <SidebarNav items={navItems} />
          <Separator />
        </div>
      )}
    </>
  )
}
