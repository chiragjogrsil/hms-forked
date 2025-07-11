"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Stethoscope, Settings, ChevronDown, User, LogOut, HelpCircle, TestTube, Zap } from "lucide-react"

export function TopNavigation() {
  const pathname = usePathname()
  const [servicesOpen, setServicesOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  const servicesItems = [
    { href: "/services/laboratory", label: "Laboratory Tests", icon: TestTube },
    { href: "/services/radiology", label: "Radiology Tests", icon: Zap },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Hospital Management</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground/80 ${
              isActive("/") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/patients"
            className={`transition-colors hover:text-foreground/80 ${
              isActive("/patients") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Patients
          </Link>

          {/* Services Dropdown */}
          <DropdownMenu open={servicesOpen} onOpenChange={setServicesOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-auto p-0 font-medium text-sm transition-colors hover:text-foreground/80 ${
                  servicesItems.some((item) => isActive(item.href)) ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Services
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {servicesItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={`w-full flex items-center gap-2 ${isActive(item.href) ? "bg-accent text-accent-foreground" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
