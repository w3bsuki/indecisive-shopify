'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import {
  User,
  CreditCard,
  MapPin,
  Package,
  History,
  Edit3,
  Plus,
  Trash2,
  Search,
  Filter,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Star,
  X
} from 'lucide-react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateJoined: string;
}

interface BillingInfo {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
}

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const UserAccountSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    dateJoined: '2023-01-15'
  });

  const [billingInfo] = useState<BillingInfo[]>([
    {
      id: '1',
      cardNumber: '**** **** **** 4532',
      expiryDate: '12/26',
      cardholderName: 'Sarah Johnson',
      isDefault: true
    },
    {
      id: '2',
      cardNumber: '**** **** **** 8901',
      expiryDate: '08/25',
      cardholderName: 'Sarah Johnson',
      isDefault: false
    }
  ]);

  const [addresses] = useState<Address[]>([
    {
      id: '1',
      type: 'shipping',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '123 Fashion Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    },
    {
      id: '2',
      type: 'billing',
      firstName: 'Sarah',
      lastName: 'Johnson',
      street: '456 Style Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'United States',
      isDefault: false
    }
  ]);

  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      trackingNumber: 'TRK123456789',
      items: [
        {
          id: '1',
          name: 'Premium Cotton T-Shirt',
          size: 'M',
          color: 'Navy Blue',
          quantity: 2,
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
        },
        {
          id: '2',
          name: 'Designer Jeans',
          size: '32',
          color: 'Dark Wash',
          quantity: 1,
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 159.99,
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2024-01-25',
      items: [
        {
          id: '3',
          name: 'Wool Sweater',
          size: 'L',
          color: 'Cream',
          quantity: 1,
          price: 159.99,
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop'
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-22',
      status: 'processing',
      total: 89.99,
      items: [
        {
          id: '4',
          name: 'Casual Sneakers',
          size: '8',
          color: 'White',
          quantity: 1,
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop'
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-700 border-green-500';
      case 'shipped': return 'bg-blue-500/20 text-blue-700 border-blue-500';
      case 'processing': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500';
      case 'pending': return 'bg-gray-500/20 text-gray-700 border-gray-500';
      case 'cancelled': return 'bg-red-500/20 text-red-700 border-red-500';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProfileUpdate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEditingProfile(false);
    }, 1000);
  };

  const ProfileSection = () => (
    <div className="space-y-6">
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <User className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">Manage your personal information and preferences</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingProfile(!editingProfile)}
              className="flex items-center gap-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Edit3 className="w-4 h-4" />
              {editingProfile ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarImage src={userProfile.avatar} alt={userProfile.firstName} />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {userProfile.firstName[0]}{userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-foreground">
                {userProfile.firstName} {userProfile.lastName}
              </h3>
              <p className="text-muted-foreground text-sm">{userProfile.email}</p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(userProfile.dateJoined).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
              <Input
                id="firstName"
                value={userProfile.firstName}
                disabled={!editingProfile}
                onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                className="border-border bg-input text-foreground disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
              <Input
                id="lastName"
                value={userProfile.lastName}
                disabled={!editingProfile}
                onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                className="border-border bg-input text-foreground disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                disabled={!editingProfile}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                className="border-border bg-input text-foreground disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</Label>
              <Input
                id="phone"
                value={userProfile.phone}
                disabled={!editingProfile}
                onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                className="border-border bg-input text-foreground disabled:opacity-70"
              />
            </div>
          </div>

          {editingProfile && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleProfileUpdate} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setEditingProfile(false)} className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const BillingSection = () => (
    <div className="space-y-6">
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Methods
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">Manage your saved payment methods</CardDescription>
            </div>
            <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground border-border">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Add Payment Method</DialogTitle>
                  <DialogDescription className="text-muted-foreground">Add a new credit or debit card</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="border-border bg-input text-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-sm font-medium text-foreground">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="border-border bg-input text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium text-foreground">CVV</Label>
                      <Input id="cvv" placeholder="123" className="border-border bg-input text-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-sm font-medium text-foreground">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" className="border-border bg-input text-foreground" />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setShowAddPayment(false)} className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAddPayment(false)} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                    Add Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {billingInfo.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-accent/20 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{card.cardNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {card.expiryDate} • {card.cardholderName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {card.isDefault && (
                    <Badge className="bg-secondary text-secondary-foreground border-secondary-foreground/20">Default</Badge>
                  )}
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AddressSection = () => (
    <div className="space-y-6">
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="w-5 h-5 text-primary" />
                Addresses
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">Manage your shipping and billing addresses</CardDescription>
            </div>
            <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                  <Plus className="w-4 h-4" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card text-card-foreground border-border">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Add New Address</DialogTitle>
                  <DialogDescription className="text-muted-foreground">Add a new shipping or billing address</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                      <Input id="firstName" className="border-border bg-input text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                      <Input id="lastName" className="border-border bg-input text-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-sm font-medium text-foreground">Street Address</Label>
                    <Input id="street" className="border-border bg-input text-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-foreground">City</Label>
                      <Input id="city" className="border-border bg-input text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium text-foreground">State</Label>
                      <Input id="state" className="border-border bg-input text-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-sm font-medium text-foreground">ZIP Code</Label>
                      <Input id="zipCode" className="border-border bg-input text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium text-foreground">Country</Label>
                      <Select>
                        <SelectTrigger className="border-border bg-input text-foreground">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover text-popover-foreground border-border">
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setShowAddAddress(false)} className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAddAddress(false)} className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
                    Add Address
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="p-4 border border-border rounded-lg space-y-2 bg-background hover:bg-accent/20 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <Badge className={address.type === 'shipping' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border-secondary-foreground/20'}>
                    {address.type === 'shipping' ? 'Shipping' : 'Billing'}
                  </Badge>
                  {address.isDefault && (
                    <Badge variant="outline" className="border-border text-muted-foreground">Default</Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{address.firstName} {address.lastName}</p>
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OrdersSection = () => (
    <div className="space-y-6">
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Package className="w-5 h-5 text-primary" />
                Order Management
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">Track and manage your orders</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-border bg-input text-foreground"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border-border bg-input text-foreground">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground border-border">
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border border-border rounded-lg space-y-3 bg-background">
                  <Skeleton className="h-4 w-32 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-foreground">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t placed any orders yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg overflow-hidden bg-background">
                  <div className="p-4 bg-muted/30 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{order.orderNumber}</h3>
                          <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ordered on {new Date(order.date).toLocaleDateString()}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-muted-foreground">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">${order.total.toFixed(2)}</p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-muted-foreground">
                            Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate text-foreground">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-foreground">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4 bg-border" />
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.status === 'shipped' && (
                        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <>
                          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                          <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                            <Star className="w-4 h-4 mr-2" />
                            Leave Review
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <Package className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const HistorySection = () => (
    <div className="space-y-6">
      <Card className="border-border bg-card text-card-foreground">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <History className="w-5 h-5 text-primary" />
            Purchase History
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">View your complete purchase history and analytics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="font-medium text-sm text-muted-foreground">Total Orders</h3>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="font-medium text-sm text-muted-foreground">Total Spent</h3>
              <p className="text-2xl font-bold text-foreground">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h3 className="font-medium text-sm text-muted-foreground">Average Order</h3>
              <p className="text-2xl font-bold text-foreground">
                ${(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Recent Activity</h3>
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background hover:bg-accent/20 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${order.total.toFixed(2)}</p>
                  <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your profile, orders, and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-border">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-muted/30 rounded-md">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingSection />
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <AddressSection />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersSection />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistorySection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserAccountSystem;