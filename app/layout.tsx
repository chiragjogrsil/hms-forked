import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { TopNavigation } from "@/components/top-navigation"
import { DoctorProvider } from "@/contexts/doctor-context"
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
        <DoctorProvider>
          <PrescriptionTemplateProvider>
            <div className="min-h-screen bg-background">
              <TopNavigation />
              <main className="pt-16">{children}</main>
              <Toaster />
            </div>
          </PrescriptionTemplateProvider>
        </DoctorProvider>
      </body>
    </html>
  )
}
