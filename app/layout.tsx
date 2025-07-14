import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProviderOld, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Toaster } from "@/components/ui/toaster"
import { DoctorProvider } from "@/contexts/doctor-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
import { ConsultationProvider } from "@/contexts/consultation-context"
import { ThemeProvider } from "@/components/theme-provider"

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
        <ThemeProvider attribute="class" defaultTheme="light">
          <DoctorProvider>
            <VisitWorkflowProvider>
              <ConsultationProvider>
                <PrescriptionTemplateProvider>
                  <SidebarProviderOld>
                    <AppSidebar />
                    <SidebarInset>
                      <TopNavigation />
                      <main className="flex-1 p-6">{children}</main>
                    </SidebarInset>
                    <Toaster />
                  </SidebarProviderOld>
                </PrescriptionTemplateProvider>
              </ConsultationProvider>
            </VisitWorkflowProvider>
          </DoctorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
