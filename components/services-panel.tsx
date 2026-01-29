"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Service {
  _id: string
  name: string
  description: string
  price: number
  category: string
  isActive: boolean
}

interface Customer {
  _id: string
  name: string
  phone: string
  email: string
}

export function ServicesPanel() {
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<string>("")

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General'
  })

  // Service order form state
  const [orderForm, setOrderForm] = useState({
    service: '',
    customer: '',
    quantity: '1',
    notes: '',
    dateProvided: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, customersRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/customers')
      ])

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json()
        setServices(servicesData)
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json()
        setCustomers(customersData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load services data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service created successfully"
        })
        setShowServiceDialog(false)
        setServiceForm({
          name: '', description: '', price: '', category: 'General'
        })
        fetchData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create service",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive"
      })
    }
  }

  const handleCreateServiceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/service-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Service order created and expense recorded"
        })
        setShowOrderDialog(false)
        setOrderForm({
          service: '', customer: '', quantity: '1', notes: '',
          dateProvided: new Date().toISOString().split('T')[0]
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create service order",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service order",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Services Management</h2>
          <p className="text-muted-foreground mt-1">Manage available services and orders</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Record Service Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record Service Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateServiceOrder} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order-service" className="text-right">Service</Label>
                  <Select value={orderForm.service} onValueChange={(value) => setOrderForm({...orderForm, service: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {service.name} - ${service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order-customer" className="text-right">Customer</Label>
                  <Select value={orderForm.customer} onValueChange={(value) => setOrderForm({...orderForm, customer: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order-quantity" className="text-right">Quantity</Label>
                  <Input
                    id="order-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order-date" className="text-right">Date</Label>
                  <Input
                    id="order-date"
                    name="dateProvided"
                    type="date"
                    value={orderForm.dateProvided}
                    onChange={(e) => setOrderForm({...orderForm, dateProvided: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="order-notes" className="text-right pt-2">Notes</Label>
                  <Textarea
                    id="order-notes"
                    name="notes"
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowOrderDialog(false)}>Cancel</Button>
                  <Button type="submit">Record Order</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateService} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service-name" className="text-right">Name</Label>
                  <Input
                    id="service-name"
                    name="name"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service-price" className="text-right">Price ($)</Label>
                  <Input
                    id="service-price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service-category" className="text-right">Category</Label>
                  <Select value={serviceForm.category} onValueChange={(value) => setServiceForm({...serviceForm, category: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="service-description" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="service-description"
                    name="description"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowServiceDialog(false)}>Cancel</Button>
                  <Button type="submit">Add Service</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service._id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  <Badge variant="outline" className="mt-2">{service.category}</Badge>
                </div>
                <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Service Price</p>
                <p className="text-2xl font-bold text-primary">
                  {service.price === 0 ? "Complimentary" : `$${service.price.toFixed(2)}`}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
