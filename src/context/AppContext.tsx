import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

interface Workshop {
  id: string
  title: string
  description: string | null
  starts_at: string | null
  capacity: number | null
  available_spots: number | null
  image_url: string | null
}

interface CartItem {
  id: string
  product_id: string
  title: string
  price: number
  quantity: number
}

interface Order {
  id: string
  total_amount: string
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  paid_at: string | null
}

interface AppContextType {
  // User
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  
  // Workshops
  enrolledWorkshops: Workshop[]
  workshopsLoading: boolean
  enrollInWorkshop: (workshopId: string) => Promise<void>
  unenrollFromWorkshop: (workshopId: string) => Promise<void>
  fetchEnrolledWorkshops: () => Promise<void>
  
  // Cart
  cartItems: CartItem[]
  cartLoading: boolean
  addToCart: (productId: string, title: string, price: number, quantity?: number) => Promise<void>
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => void
  fetchCart: () => Promise<void>
  
  // Orders
  orders: Order[]
  ordersLoading: boolean
  checkout: () => Promise<string | null>
  payOrder: (orderId: string) => Promise<void>
  fetchOrders: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<Workshop[]>([])
  const [workshopsLoading, setWorkshopsLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartLoading, setCartLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      // Don't clear cart when not logged in so keep local cart
      return
    }
    setCartLoading(true)
    try {
      const response = await fetch('/api/carts/me', { credentials: 'include' })
      if (response.ok) {
        const cartData = await response.json()
        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(
          cartData.items.map(async (item: { id: string; product_id: string; quantity: number; unit_price_snapshot: number }) => {
            try {
              const productRes = await fetch(`/api/products/${item.product_id}`)
              const product = productRes.ok ? await productRes.json() : null
              return {
                id: item.id,
                product_id: item.product_id,
                title: product?.title || 'Unknown Product',
                price: item.unit_price_snapshot,
                quantity: item.quantity
              }
            } catch {
              return {
                id: item.id,
                product_id: item.product_id,
                title: 'Unknown Product',
                price: item.unit_price_snapshot,
                quantity: item.quantity
              }
            }
          })
        )
        setCartItems(itemsWithDetails)
      } else if (response.status === 404) {
        setCartItems([])
      }
    } catch {
      // Failed to fetch cart
    } finally {
      setCartLoading(false)
    }
  }, [user])

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    if (!user) {
      // Don't clear orders when not logged in
      return
    }
    setOrdersLoading(true)
    try {
      const response = await fetch('/api/orders', { credentials: 'include' })
      if (response.ok) {
        const ordersData = await response.json()
        setOrders(ordersData)
      }
    } catch {
      // Failed to fetch orders
    } finally {
      setOrdersLoading(false)
    }
  }, [user])

  // Fetch enrolled workshops from backend
  const fetchEnrolledWorkshops = useCallback(async () => {
    if (!user) return
    setWorkshopsLoading(true)
    try {
      const response = await fetch('/api/workshop-registrations/user/my-registrations', { 
        credentials: 'include' 
      })
      if (response.ok) {
        const registrations = await response.json()
        // Fetch workshop details for each registration
        const workshopsWithDetails = await Promise.all(
          registrations.map(async (reg: { workshop_id: string }) => {
            try {
              const workshopRes = await fetch(`/api/workshops/${reg.workshop_id}`)
              if (workshopRes.ok) {
                return await workshopRes.json()
              }
              return null
            } catch {
              return null
            }
          })
        )
        setEnrolledWorkshops(workshopsWithDetails.filter(Boolean))
      }
    } catch {
      // Failed to fetch enrollments
    } finally {
      setWorkshopsLoading(false)
    }
  }, [user])

  // Check if user is already logged in (via cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch {
        // Not logged in, that's fine
      }
    }
    checkAuth()
  }, [])

  // Fetch cart, orders, and enrolled workshops when user logs in
  useEffect(() => {
    if (user) {
      fetchCart()
      fetchOrders()
      fetchEnrolledWorkshops()
    }
  }, [user, fetchCart, fetchOrders, fetchEnrolledWorkshops])

  // User functions
  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
      credentials: 'include',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail || 'Login failed')
    }

    // Fetch user info after login
    const userResponse = await fetch('/api/auth/me', { credentials: 'include' })
    if (userResponse.ok) {
      const userData = await userResponse.json()
      setUser(userData)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // Ignore errors
    }
    setUser(null)
    setCartItems([])
    setOrders([])
    setEnrolledWorkshops([])
  }

  // Workshop functions
  const enrollInWorkshop = async (workshopId: string) => {
    if (!user) return
    try {
      const response = await fetch(`/api/workshop-registrations/${workshopId}/register`, {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        await fetchEnrolledWorkshops()
      }
    } catch {
      // Failed to enroll
    }
  }

  const unenrollFromWorkshop = async (workshopId: string) => {
    if (!user) return
    try {
      const response = await fetch(`/api/workshop-registrations/${workshopId}/cancel`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.ok) {
        await fetchEnrolledWorkshops()
      }
    } catch {
      // Failed to unenroll
    }
  }

  // Cart functions
  const addToCart = async (productId: string, title: string, price: number, quantity: number = 1) => {
    if (!user) return

    try {
      const response = await fetch('/api/cart-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity }),
        credentials: 'include',
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch {
    }
  }

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    if (!user) return

    try {
      const response = await fetch(`/api/cart-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        credentials: 'include',
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch {
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/cart-items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.ok) {
        await fetchCart()
      }
    } catch {
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const checkout = async (): Promise<string | null> => {
    if (!user) return null
    
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        const order = await response.json()
        await fetchCart()
        await fetchOrders()
        return order.id
      }
    } catch {
    }
    return null
  }

  const payOrder = async (orderId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'PATCH',
        credentials: 'include',
      })
      if (response.ok) {
        await fetchOrders()
      }
    } catch {
      // Failed to pay order
    }
  }

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      enrolledWorkshops,
      workshopsLoading,
      enrollInWorkshop,
      unenrollFromWorkshop,
      fetchEnrolledWorkshops,
      cartItems,
      cartLoading,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
      orders,
      ordersLoading,
      checkout,
      payOrder,
      fetchOrders,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}