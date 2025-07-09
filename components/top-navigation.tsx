"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Stethoscope,
  TestTube,
  Activity,
  Pill,
  Building2,
  CreditCard,
  ArrowRightLeft,
  ClipboardList,
  Zap,
  Heart,
  Eye,
  Brain,
  Bone,
  Baby,
  Flower2,
  Smile,
  Waves,
  Home,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    name: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    name: "Queue",
    href: "/queue",
    icon: ClipboardList,
  },
  {
    name: "Departments",
    href: "/departments",
    icon: Building2,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    name: "Pharmacy",
    href: "/pharmacy",
    icon: Pill,
  },
  {
    name: "Interdepartmental",
    href: "/interdepartmental",
    icon: ArrowRightLeft,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
]

const servicesDropdown = [
  {
    category: "Laboratory",
    icon: TestTube,
    items: [
      { name: "Blood Tests", href: "/services/lab/blood-tests" },
      { name: "Urine Tests", href: "/services/lab/urine-tests" },
      { name: "Biochemistry", href: "/services/lab/biochemistry" },
      { name: "Microbiology", href: "/services/lab/microbiology" },
      { name: "Pathology", href: "/services/lab/pathology" },
    ],
  },
  {
    category: "Radiology",
    icon: Zap,
    items: [
      { name: "X-Ray", href: "/services/radiology/xray" },
      { name: "CT Scan", href: "/services/radiology/ct-scan" },
      { name: "MRI", href: "/services/radiology/mri" },
      { name: "Ultrasound", href: "/services/radiology/ultrasound" },
      { name: "Mammography", href: "/services/radiology/mammography" },
    ],
  },
  {
    category: "Specialized Departments",
    icon: Stethoscope,
    items: [
      { name: "Cardiology", href: "/departments/cardiology", icon: Heart },
      { name: "Neurology", href: "/departments/neurology", icon: Brain },
      { name: "Orthopedics", href: "/departments/orthopedics", icon: Bone },
      { name: "Ophthalmology", href: "/departments/ophthalmology", icon: Eye },
      { name: "Pediatrics", href: "/departments/pediatrics", icon: Baby },
      { name: "Gynecology", href: "/departments/gynecology", icon: Flower2 },
      { name: "Dental", href: "/departments/dental", icon: Smile },
      { name: "Physiotherapy", href: "/departments/physiotherapy", icon: Waves },
    ],
  },
  {
    category: "Procedures",
    icon: Activity,
    items: [
      { name: "Minor Surgery", href: "/services/procedures/minor-surgery" },
      { name: "Endoscopy", href: "/services/procedures/endoscopy" },
      { name: "Biopsy", href: "/services/procedures/biopsy" },
      { name: "Injection", href: "/services/procedures/injection" },
      { name: "Dressing", href: "/services/procedures/dressing" },
    ],
  },
]

export function TopNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MediCare</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-16 rounded-none",
                      pathname.startsWith("/services") || pathname.startsWith("/departments")
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    )}
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Services
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="start">
                  {servicesDropdown.map((category, index) => {
                    const CategoryIcon = category.icon
                    return (
                      <div key={category.category}>
                        <DropdownMenuLabel className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4" />
                          {category.category}
                        </DropdownMenuLabel>
                        {category.items.map((item) => {
                          const ItemIcon = item.icon
                          return (
                            <DropdownMenuItem key={item.name} asChild>
                              <Link href={item.href} className="flex items-center gap-2">
                                {ItemIcon && <ItemIcon className="w-4 h-4" />}
                                {item.name}
                              </Link>
                            </DropdownMenuItem>
                          )
                        })}
                        {index < servicesDropdown.length - 1 && <DropdownMenuSeparator />}
                      </div>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input type="search" placeholder="Search patients, appointments..." className="pl-10 w-64" />
            </div>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input type="search" placeholder="Search..." className="pl-10 w-full" />
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Button variant="ghost" className="w-full justify-start px-4">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start px-4">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start px-4">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
