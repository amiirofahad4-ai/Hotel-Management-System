"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Users, DoorOpen, TrendingUp, Plus } from "lucide-react"

interface CustomerFormData {
  name: string
  phone: string
  email: string
  address: string
  idNumber: string
}

interface RoomFormData {
  roomNumber: string
  type: string
  capacity: number
  price: number
  amenities: string
  description: string
}

export function DashboardContent() {
  const [stats] = useState([
    {
      title: "Total Rooms",
      value: "48",
      icon: DoorOpen,
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      title: "Occupied Rooms",
      value: "32",
      icon: Building2,
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      title: "Active Customers",
      value: "28",
      icon: Users,
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      title: "Revenue Today",
      value: "$4,250",
      icon: TrendingUp,
      color: "bg-purple-500/20 text-purple-500",
    },
  ])

  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [customerFormData, setCustomerFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    idNumber: ""
  })
  const [roomFormData, setRoomFormData] = useState<RoomFormData>({
    roomNumber: "",
    type: "",
    capacity: 1,
    price: 0,
    amenities: "",
    description: ""
  })

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerFormData),
      })

      if (!response.ok) throw new Error('Failed to create customer')

      alert('Customer added successfully!')
      setCustomerFormData({ name: "", phone: "", email: "", address: "", idNumber: "" })
      setIsCustomerDialogOpen(false)
    } catch (err: any) {
      console.error('Error creating customer:', err)
      alert(err.message || 'Error creating customer')
    }
  }

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomFormData),
      })

      if (!response.ok) throw new Error('Failed to create room')

      alert('Room added successfully!')
      setRoomFormData({ roomNumber: "", type: "", capacity: 1, price: 0, amenities: "", description: "" })
      setIsRoomDialogOpen(false)
    } catch (err: any) {
      console.error('Error creating room:', err)
      alert(err.message || 'Error creating room')
    }
  }

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRoomFormData(prev => ({ ...prev, [name]: name === 'capacity' || name === 'price' ? { ...prev, [name]: parseFloat(value) || 0 } : { ...prev, [name]: value } }))
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'customer':
        setIsCustomerDialogOpen(true)
        break
      case 'room':
        setIsRoomDialogOpen(true)
        break
      case 'book':
        // Could navigate to booking panel or open booking dialog
        alert('Navigate to Room & Booking management to create bookings')
        break
      case 'service':
        alert('Service management coming soon!')
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {[
              { customer: "John Doe", room: "305", status: "Checked In" },
              { customer: "Jane Smith", room: "412", status: "Pending" },
              { customer: "Mike Johnson", room: "201", status: "Checked Out" },
            ].map((booking, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{booking.customer}</p>
                  <p className="text-sm text-muted-foreground">Room {booking.room}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    booking.status === "Checked In"
                      ? "bg-green-500/20 text-green-600"
                      : booking.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-gray-500/20 text-gray-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "New Booking", action: "book", icon: Plus },
              { label: "Add Customer", action: "customer", icon: Users },
              { label: "Add Room", action: "room", icon: DoorOpen },
              { label: "Add Service", action: "service", icon: Building2 },
            ].map((action, idx) => {
              const Icon = action.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.action)}
                  className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg text-primary font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Customer Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-name" className="text-right">
                Name
              </Label>
              <Input
                id="customer-name"
                name="name"
                value={customerFormData.name}
                onChange={handleCustomerInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="customer-phone"
                name="phone"
                value={customerFormData.phone}
                onChange={handleCustomerInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-email" className="text-right">
                Email
              </Label>
              <Input
                id="customer-email"
                name="email"
                type="email"
                value={customerFormData.email}
                onChange={handleCustomerInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-address" className="text-right">
                Address
              </Label>
              <Input
                id="customer-address"
                name="address"
                value={customerFormData.address}
                onChange={handleCustomerInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer-idNumber" className="text-right">
                ID Number
              </Label>
              <Input
                id="customer-idNumber"
                name="idNumber"
                value={customerFormData.idNumber}
                onChange={handleCustomerInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Customer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoomSubmit} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-number" className="text-right">
                Room Number
              </Label>
              <Input
                id="room-number"
                name="roomNumber"
                value={roomFormData.roomNumber}
                onChange={handleRoomInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-type" className="text-right">
                Type
              </Label>
              <Input
                id="room-type"
                name="type"
                value={roomFormData.type}
                onChange={handleRoomInputChange}
                className="col-span-3"
                placeholder="Single, Double, Suite, etc."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="room-capacity"
                name="capacity"
                type="number"
                min="1"
                value={roomFormData.capacity}
                onChange={handleRoomInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-price" className="text-right">
                Price ($)
              </Label>
              <Input
                id="room-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={roomFormData.price}
                onChange={handleRoomInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-amenities" className="text-right">
                Amenities
              </Label>
              <Input
                id="room-amenities"
                name="amenities"
                value={roomFormData.amenities}
                onChange={handleRoomInputChange}
                className="col-span-3"
                placeholder="WiFi, TV, AC, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="room-description" className="text-right pt-2">
                Description
              </Label>
              <textarea
                id="room-description"
                name="description"
                value={roomFormData.description}
                onChange={handleRoomInputChange}
                className="col-span-3 min-h-[80px] p-2 border border-input rounded-md resize-none"
                placeholder="Room description..."
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Room</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
