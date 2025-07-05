"use client"

import { Bell, Home, ShoppingCart, Users, Settings, HeartPulse, FlaskConical } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/services", label: "Services", icon: FlaskConical },
  { href: "/billing", label: "Billing", icon: ShoppingCart },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <HeartPulse className="h-6 w-6 text-emerald-600" />
            <span className="">CarePlus</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === href ? "bg-muted text-primary" : "",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
