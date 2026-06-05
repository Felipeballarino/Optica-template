export type UserRole = "customer" | "admin"

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  stock: number
  images: string[]
  slug: string
  active: boolean
  extra_fields: Record<string, string> | null
  created_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  role: UserRole
  created_at: string
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled"

export type Order = {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  mp_preference_id: string | null
  mp_payment_id: string | null
  shipping_address: ShippingAddress | null
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  product_snapshot: Product | null
}

export type ShippingAddress = {
  full_name: string
  phone: string
  street: string
  city: string
  province: string
  zip_code: string
}

export type CartItem = {
  product: Product
  quantity: number
}
