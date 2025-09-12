"use client"

import { AuthProvider } from "@/context/AuthContext"
import { IssueProvider } from "@/context/IssueContext"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
  <AuthProvider>
    <IssueProvider>
    {children}
    </IssueProvider>
    </AuthProvider>
    )
}
