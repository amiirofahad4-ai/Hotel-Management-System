"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("month")

  // Revenue data
  const revenueData = [
    { date: "Jan 1", revenue: 2400, bookings: 24 },
    { date: "Jan 2", revenue: 1398, bookings: 22 },
    { date: "Jan 3", revenue: 9800, bookings: 29 },
    { date: "Jan 4", revenue: 3908, bookings: 20 },
    { date: "Jan 5", revenue: 4800, bookings: 27 },
    { date: "Jan 6", revenue: 3800, bookings: 25 },
    { date: "Jan 7", revenue: 4300, bookings: 26 },
  ]

  // Room occupancy
  const occupancyData = [
    { name: "Occupied", value: 32, fill: "#8b5cf6" },
    { name: "Available", value: 16, fill: "#06b6d4" },
  ]

  // Customer demographics
  const customerData = [
    { category: "Single", count: 42 },
    { category: "Couples", count: 58 },
    { category: "Groups", count: 35 },
    { category: "Families", count: 29 },
  ]

  // Service usage
  const serviceData = [
    { service: "Cleaning", usage: 89 },
    { service: "Laundry", usage: 72 },
    { service: "Room Service", usage: 95 },
    { service: "WiFi", usage: 88 },
  ]

  // Financial metrics
  const financialMetrics = [
    { label: "Total Revenue", value: "$45,230", change: "+12.5%", positive: true },
    { label: "Avg. Booking Value", value: "$245", change: "+5.2%", positive: true },
    { label: "Occupancy Rate", value: "66.7%", change: "-2.1%", positive: false },
    { label: "Customer Satisfaction", value: "4.8/5", change: "+0.3", positive: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">Comprehensive insights into hotel operations</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((metric, idx) => (
          <Card key={idx} className="p-6">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{metric.value}</p>
            <p className={`text-sm mt-2 ${metric.positive ? "text-green-500" : "text-red-500"}`}>
              {metric.positive ? "↑" : "↓"} {metric.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Revenue & Bookings Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Revenue & Bookings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)" }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={{ fill: "var(--color-chart-2)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Room Occupancy & Customer Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Room Occupancy Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            {occupancyData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.value} rooms</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Customer Types Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Bar dataKey="count" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Service Usage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Service Usage Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serviceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" stroke="var(--color-muted-foreground)" />
            <YAxis dataKey="service" type="category" stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
              }}
            />
            <Bar dataKey="usage" fill="var(--color-primary)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Report Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Monthly Summary Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Metric</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">This Month</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Last Month</th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { metric: "Total Bookings", current: 156, previous: 142, change: "+9.9%" },
                { metric: "Total Revenue", current: "$45,230", previous: "$41,200", change: "+9.8%" },
                { metric: "Avg Room Rate", current: "$290", previous: "$285", change: "+1.8%" },
                { metric: "Occupancy Rate", current: "66.7%", previous: "68.5%", change: "-2.7%" },
                { metric: "Repeat Customers", current: 32, previous: 28, change: "+14.3%" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-foreground">{row.metric}</td>
                  <td className="px-4 py-4 text-foreground font-semibold">{row.current}</td>
                  <td className="px-4 py-4 text-muted-foreground">{row.previous}</td>
                  <td className="px-4 py-4">
                    <span className={row.change.startsWith("+") ? "text-green-500" : "text-red-500"}>{row.change}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
