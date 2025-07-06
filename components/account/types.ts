export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  dateJoined: string
}

export interface Address {
  id: string
  type: 'shipping' | 'billing'
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  cardNumber: string
  expiryDate: string
  cardholderName: string
  isDefault: boolean
  type?: 'visa' | 'mastercard' | 'amex'
}

export interface OrderItem {
  id: string
  name: string
  size: string
  color: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  trackingNumber?: string
  estimatedDelivery?: string
}

export type AccountTab = 'overview' | 'profile' | 'orders' | 'addresses' | 'billing'

export interface AccountSectionProps {
  className?: string
}