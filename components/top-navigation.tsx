"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Stethoscope,
  Settings,
  User,
  LogOut,
  TestTube,
  Zap,
  Activity,
  Heart,
  Waves,
  Eye,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const services = [
  {
    title: "Laboratory Tests",
    href: "/services/laboratory",
    description: "Blood tests, urine analysis, and diagnostic tests",
    icon: TestTube,
  },
  {
    title: "Radiology",
    href: "/services/radiology",
    description: "X-rays, CT scans, MRI, and ultrasound",
    icon: Zap,
  },
  {
    title: "Procedures",
    href: "/services/procedures",
    description: "Medical procedures and treatments",
    icon: Activity,
  },
  {
    title: "Panchkarma",
    href: "/services/panchkarma",
    description: "Ayurvedic detoxification and rejuvenation",
    icon: Heart,
  },
  {
    title: "Physiotherapy",
    href: "/services/physiotherapy",
    description: "Physical therapy and rehabilitation",
    icon: Waves,
  },
  {
    title: "Ophthalmology",
    href: "/services/ophthalmology",
    description: "Eye care and vision services",
    icon: Eye,
  },
]

export function TopNavigation() {
  const pathname = usePathname()
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold sm:inline-block">Hospital Management</span>
        </Link>

        {/* Main Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* Dashboard */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    isActive("/") && "bg-accent text-accent-foreground",
                  )}
                >
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Patients */}
            <NavigationMenuItem>
              <Link href="/patients" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    isActive("/patients") && "bg-accent text-accent-foreground",
                  )}
                >
                  Patients
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Services & Procedures */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(isActive("/services") && "bg-accent text-accent-foreground")}
                onPointerEnter={() => setIsServicesOpen(true)}
                onPointerLeave={() => setIsServicesOpen(false)}
              >
                Services & Procedures
              </NavigationMenuTrigger>
              <NavigationMenuContent
                onPointerEnter={() => setIsServicesOpen(true)}
                onPointerLeave={() => setIsServicesOpen(false)}
              >
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  {services.map((service) => {
                    const IconComponent = service.icon
                    return (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">{service.title}</div>
                        </div>
                        <div className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {service.description}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Menu
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/patients">Patients</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Services</DropdownMenuLabel>
              {services.map((service) => (
                <DropdownMenuItem key={service.href} asChild>
                  <Link href={service.href} className="flex items-center gap-2">
                    <service.icon className="h-4 w-4" />
                    {service.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
