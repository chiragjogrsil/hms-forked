import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { TopNavigation } from "@/components/top-navigation"
import { DoctorProvider } from "@/contexts/doctor-context"
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
import { ConsultationProvider } from "@/contexts/consultation-context"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

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
      <body
        className={`${poppins.variable} font-sans antialiased bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <PrescriptionTemplateProvider>
            <DoctorProvider>
              <VisitWorkflowProvider>
                <ConsultationProvider>
                  <div className="flex min-h-screen w-full flex-col">
                    <TopNavigation />
                    <main className="flex-1 p-6">{children}</main>
                  </div>
                  <Toaster />
                </ConsultationProvider>
              </VisitWorkflowProvider>
            </DoctorProvider>
          </PrescriptionTemplateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
