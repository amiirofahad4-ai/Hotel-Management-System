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
import { Plus, Search, Filter, Download, Eye, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Account {
  _id: string
  name: string
  institution: string
  balance: number
  type: string
  accountNumber: string
  description?: string
}

interface Transaction {
  _id: string
  date: string
  type: 'Income' | 'Expense'
  amount: number
  description: string
  account: {
    _id: string
    name: string
    institution: string
  }
  reference: string
  category?: string
}

interface Receipt {
  _id: string
  receiptNumber: string
  customer: {
    name: string
    phone: string
    email: string
  }
  paymentMethod: string
  amount: number
  date: string
  account: {
    name: string
    institution: string
  }
  status: string
}

export function AccountsPanel() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string>("")

  // Transaction form state
  const [transactionForm, setTransactionForm] = useState({
    type: 'Income',
    amount: '',
    description: '',
    account: '',
    reference: 'Manual',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Account form state
  const [accountForm, setAccountForm] = useState({
    name: '',
    institution: '',
    type: 'Checking',
    accountNumber: '',
    balance: '0',
    description: ''
  })

  // Receipt form state
  const [receiptForm, setReceiptForm] = useState({
    customer: '',
    paymentMethod: 'Cash',
    amount: '',
    account: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Filters
  const [transactionFilters, setTransactionFilters] = useState({
    account: '',
    type: '',
    search: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [accountsRes, transactionsRes, receiptsRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/transactions'),
        fetch('/api/receipts')
      ])

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json()
        setAccounts(accountsData)
        // Clear controlled select values if they no longer exist in fetched accounts
        setTransactionForm(prev => (prev.account && !accountsData.some((a: Account) => a._id === prev.account)) ? { ...prev, account: '' } : prev)
        setReceiptForm(prev => (prev.account && !accountsData.some((a: Account) => a._id === prev.account)) ? { ...prev, account: '' } : prev)
        setTransactionFilters(prev => (prev.account && prev.account !== 'all' && !accountsData.some((a: Account) => a._id === prev.account)) ? { ...prev, account: '' } : prev)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData.transactions || [])
      }

      if (receiptsRes.ok) {
        const receiptsData = await receiptsRes.json()
        setReceipts(receiptsData.receipts || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load accounts data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully"
        })
        setShowAccountDialog(false)
        setAccountForm({
          name: '', institution: '', type: 'Checking', accountNumber: '', balance: '0', description: ''
        })
        fetchData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create account",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive"
      })
    }
  }

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Transaction created successfully"
        })
        setShowTransactionDialog(false)
        setTransactionForm({
          type: 'Income', amount: '', description: '', account: '', reference: 'Manual', category: '',
          date: new Date().toISOString().split('T')[0]
        })
        fetchData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create transaction",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive"
      })
    }
  }

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptForm)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Receipt created successfully"
        })
        setShowReceiptDialog(false)
        setReceiptForm({
          customer: '', paymentMethod: 'Cash', amount: '', account: '', description: '',
          date: new Date().toISOString().split('T')[0]
        })
        fetchData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create receipt",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create receipt",
        variant: "destructive"
      })
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (!transaction || !transaction.account) return false
    const matchesAccount = !transactionFilters.account || transactionFilters.account === 'all' || transaction.account._id === transactionFilters.account
    const matchesType = !transactionFilters.type || transactionFilters.type === 'all' || transaction.type === transactionFilters.type
    const matchesSearch = !transactionFilters.search ||
      (transaction.description && transaction.description.toLowerCase().includes(transactionFilters.search.toLowerCase())) ||
      (transaction.account.name && transaction.account.name.toLowerCase().includes(transactionFilters.search.toLowerCase()))
    return matchesAccount && matchesType && matchesSearch
  })

  const totalBalance = accounts.reduce((sum, account) => sum + (account?.balance || 0), 0)
  const todayIncome = transactions
    .filter(t => t && t.type === 'Income' && t.date && new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  const currentMonthRevenue = transactions
    .filter(t => {
      if (!t || !t.date || t.type !== 'Income') return false
      const transactionDate = new Date(t.date)
      const now = new Date()
      return transactionDate.getMonth() === now.getMonth() &&
             transactionDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalExpenses = transactions
    .filter(t => t && t.type === 'Expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Accounts & Finance</h2>
        <p className="text-muted-foreground mt-1">Manage accounts, transactions, and financial records</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-primary">${totalBalance.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Income</p>
              <p className="text-2xl font-bold text-green-500">${todayIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
              <Plus className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Month Revenue</p>
              <p className="text-2xl font-bold text-purple-500">${currentMonthRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg">
              <Filter className="w-6 h-6" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bank Accounts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Bank Accounts</h3>
          <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-name" className="text-right">Name</Label>
                  <Input
                    id="account-name"
                    name="name"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-institution" className="text-right">Institution</Label>
                  <Input
                    id="account-institution"
                    name="institution"
                    value={accountForm.institution}
                    onChange={(e) => setAccountForm({...accountForm, institution: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-type" className="text-right">Type</Label>
                  <Select value={accountForm.type} onValueChange={(value) => setAccountForm({...accountForm, type: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Checking">Checking</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-number" className="text-right">Account Number</Label>
                  <Input
                    id="account-number"
                    name="accountNumber"
                    value={accountForm.accountNumber}
                    onChange={(e) => setAccountForm({...accountForm, accountNumber: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-balance" className="text-right">Initial Balance</Label>
                  <Input
                    id="account-balance"
                    name="balance"
                    type="number"
                    step="0.01"
                    value={accountForm.balance}
                    onChange={(e) => setAccountForm({...accountForm, balance: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="account-description" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="account-description"
                    name="description"
                    value={accountForm.description}
                    onChange={(e) => setAccountForm({...accountForm, description: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAccountDialog(false)}>Cancel</Button>
                  <Button type="submit">Add Account</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account._id} className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{account.type}</p>
                  <h4 className="text-lg font-semibold text-foreground mt-1">{account.name}</h4>
                  <p className="text-sm text-muted-foreground">{account.institution}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <p className="text-3xl font-bold text-primary">${account.balance.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Transactions</h3>
          <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-type" className="text-right">Type</Label>
                  <Select value={transactionForm.type} onValueChange={(value) => setTransactionForm({...transactionForm, type: value as 'Income' | 'Expense'})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-amount" className="text-right">Amount</Label>
                  <Input
                    id="transaction-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-description" className="text-right">Description</Label>
                  <Input
                    id="transaction-description"
                    name="description"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-account" className="text-right">Account</Label>
                  <Select value={transactionForm.account} onValueChange={(value) => setTransactionForm({...transactionForm, account: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account._id} value={account._id}>
                          {account.name} - {account.institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-reference" className="text-right">Reference</Label>
                  <Select value={transactionForm.reference} onValueChange={(value) => setTransactionForm({...transactionForm, reference: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Booking">Booking</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-category" className="text-right">Category</Label>
                  <Input
                    id="transaction-category"
                    name="category"
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                    className="col-span-3"
                    placeholder="Optional category"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-date" className="text-right">Date</Label>
                  <Input
                    id="transaction-date"
                    name="date"
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowTransactionDialog(false)}>Cancel</Button>
                  <Button type="submit">Add Transaction</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transaction Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={transactionFilters.search}
                onChange={(e) => setTransactionFilters({...transactionFilters, search: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={transactionFilters.account} onValueChange={(value) => setTransactionFilters({...transactionFilters, account: value})}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account._id} value={account._id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={transactionFilters.type} onValueChange={(value) => setTransactionFilters({...transactionFilters, type: value})}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Account</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground">{new Date(transaction.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={transaction.type === 'Income' ? 'default' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-foreground">{transaction.description}</td>
                    <td className="px-6 py-4 text-muted-foreground">{transaction.account.name}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: transaction.type === 'Income' ? '#22c55e' : '#ef4444' }}>
                      {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{transaction.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Receipts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Receipts</h3>
          <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Receipt</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateReceipt} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receipt-customer" className="text-right">Customer ID</Label>
                  <Input
                    id="receipt-customer"
                    name="customer"
                    value={receiptForm.customer}
                    onChange={(e) => setReceiptForm({...receiptForm, customer: e.target.value})}
                    className="col-span-3"
                    placeholder="Customer ObjectId"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receipt-payment-method" className="text-right">Payment Method</Label>
                  <Select value={receiptForm.paymentMethod} onValueChange={(value) => setReceiptForm({...receiptForm, paymentMethod: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="EVC Plus">EVC Plus</SelectItem>
                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receipt-amount" className="text-right">Amount</Label>
                  <Input
                    id="receipt-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={receiptForm.amount}
                    onChange={(e) => setReceiptForm({...receiptForm, amount: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receipt-account" className="text-right">Account</Label>
                  <Select value={receiptForm.account} onValueChange={(value) => setReceiptForm({...receiptForm, account: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account._id} value={account._id}>
                          {account.name} - {account.institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receipt-description" className="text-right">Description</Label>
                  <Input
                    id="receipt-description"
                    name="description"
                    value={receiptForm.description}
                    onChange={(e) => setReceiptForm({...receiptForm, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="receipt-date" className="text-right">Date</Label>
                  <Input
                    id="receipt-date"
                    name="date"
                    type="date"
                    value={receiptForm.date}
                    onChange={(e) => setReceiptForm({...receiptForm, date: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowReceiptDialog(false)}>Cancel</Button>
                  <Button type="submit">Create Receipt</Button>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Receipt #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {receipts.map((receipt) => (
                  <tr key={receipt._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-mono">{receipt.receiptNumber}</td>
                    <td className="px-6 py-4 text-foreground">{receipt.customer.name}</td>
                    <td className="px-6 py-4 text-primary font-semibold">${receipt.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{receipt.paymentMethod}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(receipt.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={receipt.status === 'Completed' ? 'default' : 'secondary'}>
                        {receipt.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.print()}
                        className="h-8 w-8 p-0"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
