import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { ConsultationProvider } from "@/contexts/consultation-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"
import { DoctorProvider } from "@/contexts/doctor-context"
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
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
                  <div className="min-h-screen bg-background">
                    <TopNavigation />
                    <main className="container mx-auto p-6">{children}</main>
                  </div>
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
