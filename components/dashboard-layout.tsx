"use client"

import type React from "react"

import { Building2, Users, DoorOpen, Wrench, CreditCard, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <Building2 className="w-5 h-5" /> },
  { id: "customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
  { id: "rooms", label: "Rooms & Booking", icon: <DoorOpen className="w-5 h-5" /> },
  { id: "services", label: "Services", icon: <Wrench className="w-5 h-5" /> },
  { id: "accounts", label: "Accounts", icon: <CreditCard className="w-5 h-5" /> },
  { id: "reports", label: "Reports", icon: <BarChart3 className="w-5 h-5" /> },
]

export function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
}: {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Hotel Pro</h1>
              <p className="text-xs text-sidebar-foreground/60">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  activeTab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="outline" className="w-full bg-transparent" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">
            {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your hotel operations efficiently</p>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
