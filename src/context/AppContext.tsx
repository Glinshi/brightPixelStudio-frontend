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

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  product_title: string
}

interface Order {
  id: string
  total_amount: string
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  paid_at: string | null
  items: OrderItem[]
}

interface AppContextType {
  // User
  user: User | null
  setUser: (user: User | null) => void
  authLoading: boolean
  login: (email: string, password: string, syncCart?: boolean) => Promise<void>
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
  syncLocalCartToBackend: () => Promise<void>
  
  // Orders
  orders: Order[]
  ordersLoading: boolean
  checkout: () => Promise<string | null>
  payOrder: (orderId: string) => Promise<void>
  fetchOrders: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Helper functions for local cart storage
const LOCAL_CART_KEY = 'brightpixel_local_cart'

const getLocalCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const setLocalCart = (items: CartItem[]) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
}

const clearLocalCart = () => {
  localStorage.removeItem(LOCAL_CART_KEY)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<Workshop[]>([])
  const [workshopsLoading, setWorkshopsLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getLocalCart())
  const [cartLoading, setCartLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Sync local cart to backend after login
  const syncLocalCartToBackend = useCallback(async () => {
    const localItems = getLocalCart()
    if (localItems.length === 0) return
    
    console.log('Syncing local cart to backend:', localItems)
    
    for (const item of localItems) {
      try {
        const response = await fetch('/api/cart-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: item.product_id, quantity: item.quantity }),
          credentials: 'include',
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to sync cart item:', item, response.status, errorData)
        }
      } catch (err) {
        console.error('Error syncing cart item:', item, err)
      }
    }
    clearLocalCart()
  }, [])

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      // Load from local storage when not logged in
      setCartItems(getLocalCart())
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
      } finally {
        setAuthLoading(false)
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
  const login = async (email: string, password: string, syncCart: boolean = true) => {
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

    // Sync local cart to backend before fetching user
    if (syncCart) {
      await syncLocalCartToBackend()
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
    if (!user) {
      // Add to local cart when not logged in
      const localCart = getLocalCart()
      const existingIndex = localCart.findIndex(item => item.product_id === productId)
      
      if (existingIndex >= 0) {
        localCart[existingIndex].quantity += quantity
      } else {
        localCart.push({
          id: `local_${Date.now()}`,
          product_id: productId,
          title,
          price,
          quantity
        })
      }
      
      setLocalCart(localCart)
      setCartItems(localCart)
      return
    }

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
    
    if (!user) {
      // Update local cart when not logged in
      const localCart = getLocalCart()
      const itemIndex = localCart.findIndex(item => item.id === itemId)
      if (itemIndex >= 0) {
        localCart[itemIndex].quantity = quantity
        setLocalCart(localCart)
        setCartItems(localCart)
      }
      return
    }

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
    if (!user) {
      // Remove from local cart when not logged in
      const localCart = getLocalCart()
      const filtered = localCart.filter(item => item.id !== itemId)
      setLocalCart(filtered)
      setCartItems(filtered)
      return
    }

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
    clearLocalCart()
    setCartItems([])
  }

  const checkout = async (): Promise<string | null> => {
    // Note: We don't check for user here because this can be called
    // right after login before React state updates. The backend will
    // verify auth via the cookie.
    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        const order = await response.json()
        clearLocalCart()
        setCartItems([])
        await fetchOrders()
        return order.id
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Checkout failed:', response.status, errorData)
      }
    } catch (err) {
      console.error('Checkout error:', err)
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
      setUser,
      authLoading,
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
      syncLocalCartToBackend,
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