"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Building2,
  Pill,
  TestTube,
  Camera,
  Heart,
  Brain,
  Eye,
  Stethoscope,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navigationItems = [
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
    title: "Services",
    icon: TestTube,
    children: [
      {
        title: "Laboratory",
        href: "/services/laboratory",
        icon: TestTube,
        description: "Lab tests and analysis",
      },
      {
        title: "Radiology",
        href: "/services/radiology",
        icon: Camera,
        description: "Imaging and scans",
      },
      {
        title: "Cardiology",
        href: "/services/cardiology",
        icon: Heart,
        description: "Cardiac tests and procedures",
      },
      {
        title: "Neurology",
        href: "/services/neurology",
        icon: Brain,
        description: "Neurological examinations",
      },
      {
        title: "Ophthalmology",
        href: "/services/ophthalmology",
        icon: Eye,
        description: "Eye examinations",
      },
      {
        title: "General",
        href: "/services/general",
        icon: Stethoscope,
        description: "General medical services",
      },
    ],
  },
  {
    title: "Queue",
    href: "/queue",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: DollarSign,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Interdepartmental",
    href: "/interdepartmental",
    icon: Building2,
  },
  {
    title: "Pharmacy",
    href: "/pharmacy",
    icon: Pill,
  },
]

export function TopNavigation() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const isServicesActive = () => {
    return pathname.startsWith("/services")
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Hospital Management</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => {
              if (item.children) {
                return (
                  <DropdownMenu key={item.title}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "h-9 px-3 text-sm font-medium transition-colors hover:text-foreground/80",
                          isServicesActive() ? "text-foreground" : "text-foreground/60",
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      {item.children.map((child) => {
                        const Icon = child.icon
                        return (
                          <DropdownMenuItem key={child.href} asChild>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center px-2 py-2 text-sm",
                                isActive(child.href)
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground/60 hover:text-foreground",
                              )}
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              <div>
                                <div className="font-medium">{child.title}</div>
                                <div className="text-xs text-muted-foreground">{child.description}</div>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    isActive(item.href) ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </nav>
  )
}
