"use client"
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
import { Stethoscope, Settings, User, LogOut, HelpCircle } from "lucide-react"

export function TopNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

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
          <Link
            href="/services"
            className={`transition-colors hover:text-foreground/80 ${
              isActive("/services") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Services
          </Link>
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
