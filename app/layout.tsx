import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SidebarProviderOld, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
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
    <html lang="en">
      <body className={inter.className}>
        <PrescriptionTemplateProvider>
          <SidebarProviderOld>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProviderOld>
        </PrescriptionTemplateProvider>
        <Toaster />
      </body>
    </html>
  )
}
