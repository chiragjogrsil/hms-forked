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
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"
import { ConsultationProvider } from "@/contexts/consultation-context"

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
      <body className={cn(inter.className, "antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <DoctorProvider>
            <VisitWorkflowProvider>
              <PrescriptionTemplateProvider>
                <ConsultationProvider>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <main className="flex-1 overflow-hidden">{children}</main>
                    </div>
                  </SidebarProvider>
                </ConsultationProvider>
              </PrescriptionTemplateProvider>
            </VisitWorkflowProvider>
          </DoctorProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
