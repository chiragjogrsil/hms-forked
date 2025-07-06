import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Toaster } from "@/components/ui/toaster"
import { PrescriptionTemplateProvider } from "@/contexts/prescription-template-context"
import { TopNavigation } from "@/components/top-navigation"
import { DoctorProvider } from "@/contexts/doctor-context"
import { VisitWorkflowProvider } from "@/contexts/visit-workflow-context"
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
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  )
}
