"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { CustomerPanel } from "@/components/customer-panel"
import { RoomBookingPanel } from "@/components/room-booking-panel"
import { ServicesPanel } from "@/components/services-panel"
import { AccountsPanel } from "@/components/accounts-panel"
import { ReportsAnalytics } from "@/components/reports-analytics"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "dashboard" && <DashboardContent />}
      {activeTab === "customers" && <CustomerPanel />}
      {activeTab === "rooms" && <RoomBookingPanel />}
      {activeTab === "services" && <ServicesPanel />}
      {activeTab === "accounts" && <AccountsPanel />}
      {activeTab === "reports" && <ReportsAnalytics />}
    </DashboardLayout>
  )
}
