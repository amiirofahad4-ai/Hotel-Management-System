"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface Customer {
  _id: string
  name: string
  phone: string
  email: string
  address: string
  idNumber: string
}

interface CustomerFormData {
  name: string
  phone: string
  email: string
  address: string
  idNumber: string
}

export function CustomerPanel() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    idNumber: ""
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers') // relative path
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      setCustomers(data)
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE"
      })
      if (!response.ok) throw new Error('Failed to delete customer')
      setCustomers(customers.filter(c => c._id !== id))
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Error deleting customer')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create customer')

      const newCustomer = await response.json()
      setCustomers([...customers, newCustomer])
      setFormData({ name: "", phone: "", email: "", address: "", idNumber: "" })
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error('Error creating customer:', err)
      alert(err.message || 'Error creating customer')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Management</h2>
          <p className="text-muted-foreground mt-1">Manage all customer information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="idNumber" className="text-right">
                  ID Number
                </Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Customer</Button>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">ID Number</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    Loading customers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-destructive">
                    {error}
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground">{customer.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.phone}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.address}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.idNumber}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors inline-block">
                        <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors inline-block"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
