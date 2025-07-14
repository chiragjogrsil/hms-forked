import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { DoctorProvider } from "@/contexts/doctor-context"
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
import { ConsultationProvider } from "@/contexts/consultation-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "Comprehensive hospital management solution",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DoctorProvider>
            <VisitWorkflowProvider>
              <ConsultationProvider>
                <PrescriptionTemplateProvider>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1 flex flex-col min-h-screen">
                      <TopNavigation />
                      <div className="flex-1 p-6">{children}</div>
                    </main>
                  </SidebarProvider>
                  <Toaster />
                </PrescriptionTemplateProvider>
              </ConsultationProvider>
            </VisitWorkflowProvider>
          </DoctorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
