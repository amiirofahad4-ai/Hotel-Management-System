"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Users, Calendar, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Room {
  _id: string
  roomNumber: string
  type: string
  capacity: number
  price: number
  status: string
}

interface Customer {
  _id: string
  name: string
  email: string
}

interface BookingFormData {
  customer: string
  room: string
  checkInDate: Date | undefined
  checkOutDate: Date | undefined
  totalAmount: number
  specialRequests: string
}

interface Booking {
  _id: string
  customer: {
    _id: string
    name: string
    email: string
  }
  room: {
    _id: string
    roomNumber: string
    type: string
    price: number
  }
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  specialRequests: string
  createdAt: string
}

interface RoomFormData {
  roomNumber: string
  type: string
  capacity: number
  price: string
  description: string
}

export function RoomBookingPanel() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<BookingFormData>({
    customer: "",
    room: "",
    checkInDate: undefined,
    checkOutDate: undefined,
    totalAmount: 0,
    specialRequests: ""
  })

  const [roomFormData, setRoomFormData] = useState<RoomFormData>({
    roomNumber: "",
    type: "Standard",
    capacity: 2,
    price: "",
    description: ""
  })

  useEffect(() => {
    fetchRooms()
    fetchCustomers()
    fetchAvailableRooms()
    fetchBookings()
  }, [])

  useEffect(() => {
    fetchAvailableRooms()
  }, [formData.checkInDate, formData.checkOutDate])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      if (!response.ok) throw new Error('Failed to fetch rooms')
      const data = await response.json()
      setRooms(data)
    } catch (err) {
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      setCustomers(data)
      // Clear selected customer if it no longer exists
      if (formData.customer && !data.some((c: Customer) => c._id === formData.customer)) {
        setFormData(prev => ({ ...prev, customer: '' }))
      }
    } catch (err) {
      console.error('Error fetching customers:', err)
    }
  }

  const fetchAvailableRooms = async () => {
    try {
      const params = new URLSearchParams()
      if (formData.checkInDate) {
        params.append('checkInDate', formData.checkInDate.toISOString())
      }
      if (formData.checkOutDate) {
        params.append('checkOutDate', formData.checkOutDate.toISOString())
      }
      const query = params.toString() ? `?${params.toString()}` : ''
      const response = await fetch(`/api/rooms/available${query}`)
      if (!response.ok) throw new Error('Failed to fetch available rooms')
      const data = await response.json()
      setAvailableRooms(data)
      // If the currently selected room is not available, clear the selection
      if (formData.room && !data.some((room: Room) => room._id === formData.room)) {
        setFormData(prev => ({ ...prev, room: "" }))
      }
    } catch (err) {
      console.error('Error fetching available rooms:', err)
      setAvailableRooms([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Convert dates to ISO strings for API submission
      const submitData = {
        ...formData,
        checkInDate: formData.checkInDate?.toISOString(),
        checkOutDate: formData.checkOutDate?.toISOString(),
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) throw new Error('Failed to create booking')

      alert('Booking created successfully!')
      setFormData({
        customer: "",
        room: "",
        checkInDate: undefined,
        checkOutDate: undefined,
        totalAmount: 0,
        specialRequests: ""
      })
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error('Error creating booking:', err)
      alert(err.message || 'Error creating booking')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateTotal = () => {
    const selectedRoom = rooms.find(r => r._id === formData.room)
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) return 0

    const checkIn = new Date(formData.checkInDate)
    const checkOut = new Date(formData.checkOutDate)
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))

    return selectedRoom.price * nights
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roomFormData,
          price: parseFloat(roomFormData.price)
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room created successfully"
        })
        setIsRoomDialogOpen(false)
        setRoomFormData({
          roomNumber: "",
          type: "Standard",
          capacity: 2,
          price: "",
          description: ""
        })
        fetchRooms()
        fetchAvailableRooms()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create room",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive"
      })
    }
  }

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Booking status updated to ${status}`
        })
        fetchBookings()
        fetchAvailableRooms()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      })
    }
  }

  const handleRoomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRoomFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Rooms & Bookings</h2>
        <p className="text-muted-foreground mt-1">Manage rooms and reservations</p>
      </div>

      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rooms">Rooms Management</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Room Management</h3>
              <p className="text-sm text-muted-foreground">Add and manage hotel rooms</p>
            </div>
            <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roomNumber" className="text-right">Room Number</Label>
                    <Input
                      id="roomNumber"
                      name="roomNumber"
                      value={roomFormData.roomNumber}
                      onChange={handleRoomFormChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select value={roomFormData.type} onValueChange={(value) => setRoomFormData({...roomFormData, type: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                        <SelectItem value="Presidential">Presidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={roomFormData.capacity}
                      onChange={(e) => setRoomFormData({...roomFormData, capacity: parseInt(e.target.value)})}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={roomFormData.price}
                      onChange={handleRoomFormChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={roomFormData.description}
                      onChange={handleRoomFormChange}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Add Room</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-muted-foreground">Loading rooms...</div>
            ) : rooms.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">No rooms found</div>
            ) : (
              rooms.map((room) => (
                <Card key={room._id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Room {room.roomNumber}</h3>
                        <Badge variant="outline" className="mt-1">{room.type}</Badge>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          room.status === "available" ? "bg-green-500/20 text-green-600" : "bg-orange-500/20 text-orange-600"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="text-sm font-semibold flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {room.capacity} guests
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price/Night</p>
                        <p className="text-sm font-semibold flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${room.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Booking Management</h3>
              <p className="text-sm text-muted-foreground">Manage reservations and check-ins</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Booking</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">
                      Customer
                    </Label>
                    <Select value={formData.customer} onValueChange={(value) => handleSelectChange('customer', value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.name} - {customer.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                      Room
                    </Label>
                    <Select value={formData.room} onValueChange={(value) => handleSelectChange('room', value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room._id} value={room._id}>
                            Room {room.roomNumber} - {room.type} (${room.price}/night)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Check-in
                    </Label>
                    <DatePicker
                      date={formData.checkInDate}
                      onDateChange={(date) => setFormData(prev => ({ ...prev, checkInDate: date }))}
                      placeholder="Select check-in date"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Check-out
                    </Label>
                    <DatePicker
                      date={formData.checkOutDate}
                      onDateChange={(date) => setFormData(prev => ({ ...prev, checkOutDate: date }))}
                      placeholder="Select check-out date"
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalAmount" className="text-right">
                      Total Amount
                    </Label>
                    <Input
                      id="totalAmount"
                      value={`$${calculateTotal()}`}
                      className="col-span-3"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="specialRequests" className="text-right pt-2">
                      Special Requests
                    </Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      className="col-span-3 min-h-[80px] p-2 border border-input rounded-md resize-none"
                      placeholder="Any special requests..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!formData.customer || !formData.room || !formData.checkInDate || !formData.checkOutDate}>
                      Create Booking
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Room</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check-in</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check-out</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground">
                        <div>
                          <p className="font-medium">{booking.customer.name}</p>
                          <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        Room {booking.room.roomNumber} - {booking.room.type}
                      </td>
                      <td className="px-6 py-4 text-foreground">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-foreground">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'checked-in' ? 'secondary' :
                          booking.status === 'checked-out' ? 'outline' : 'destructive'
                        }>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">${booking.totalAmount}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {booking.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateBookingStatus(booking._id, 'checked-in')}
                              className="h-8"
                            >
                              Check-in
                            </Button>
                          )}
                          {booking.status === 'checked-in' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateBookingStatus(booking._id, 'checked-out')}
                              className="h-8"
                            >
                              Check-out
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
