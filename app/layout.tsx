import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DoctorProvider } from "@/contexts/doctor-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "Comprehensive hospital management application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <DoctorProvider>
            <PrescriptionTemplateProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 overflow-auto">{children}</main>
              </SidebarProvider>
            </PrescriptionTemplateProvider>
          </DoctorProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
