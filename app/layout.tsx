import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { ConsultationProvider } from "@/contexts/consultation-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"
import { DoctorProvider } from "@/contexts/doctor-context"
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigation } from "@/components/top-navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <DoctorProvider>
            <ConsultationProvider>
              <PrescriptionTemplateProvider>
                <VisitWorkflowProvider>
                  <SidebarProvider>
                    <div className="flex h-screen bg-background">
                      <AppSidebar />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <TopNavigation />
                        <main className="flex-1 overflow-auto p-6">{children}</main>
                      </div>
                    </div>
                  </SidebarProvider>
                </VisitWorkflowProvider>
              </PrescriptionTemplateProvider>
            </ConsultationProvider>
          </DoctorProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
