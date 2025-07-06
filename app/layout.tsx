import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AppSidebar from "@/components/app-sidebar"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { ConsultationProvider } from "@/contexts/consultation-context"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Hospital Management Dashboard",
  description: "A responsive admin shell for hospital management.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ConsultationProvider>
            <div className="flex min-h-screen w-full bg-muted/40">
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 sm:p-6">{children}</main>
              </div>
            </div>
            <Toaster />
          </ConsultationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
