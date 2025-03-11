import type React from "react"
import { ReturnProvider } from "@/context/return-context"
import "./globals.css"

export const metadata = {
  title: "Amazon Returns",
  description: "A simulation of Amazon returns process with AI-powered analysis",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReturnProvider>{children}</ReturnProvider>
      </body>
    </html>
  )
}



import './globals.css'