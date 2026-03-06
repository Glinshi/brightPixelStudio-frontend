import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

// Blueprint for a user object
interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  is_superuser: boolean
}

// Blueprint for a workshop object
interface Workshop {
  id: string
  title: string
  description: string | null
  starts_at: string | null
  capacity: number | null
  available_spots: number | null
  image_url: string | null
}

// Blueprint for a shopping cart item
interface CartItem {
  id: string
  product_id: string
  title: string
  price: number
  quantity: number
}

// Blueprint for an item in an order
interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  product_title: string
}

// Blueprint for an order
interface Order {
  id: string
  total_amount: string
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  paid_at: string | null
  items: OrderItem[]
}

// The main context interface: describes all data and functions shared in the app
interface AppContextType {
  // User data and authentication functions
  user: User | null // The current logged-in user, or null if not logged in
  setUser: (user: User | null) => void // Function to set/change the user
  authLoading: boolean // Is the app checking if the user is logged in?
    login: (email: string, password: string, syncCart?: boolean) => Promise<void> // Log in a user (POST /api/auth/login)
    logout: () => void // Log out the user (POST /api/auth/logout)

  // Workshop data and functions
  enrolledWorkshops: Workshop[] // List of workshops the user is enrolled in
  workshopsLoading: boolean // Is the app loading workshops?
    enrollInWorkshop: (workshopId: string) => Promise<void> // Enroll user in a workshop (POST /api/workshop-registrations/{id}/register)
    unenrollFromWorkshop: (workshopId: string) => Promise<void> // Unenroll user from a workshop (DELETE /api/workshop-registrations/{id}/cancel)
    fetchEnrolledWorkshops: () => Promise<void> // Get all workshops the user is enrolled in (GET /api/workshop-registrations/user/my-registrations)

  // Shopping cart data and functions
  cartItems: CartItem[] // List of items in the shopping cart
  cartLoading: boolean // Is the app loading the cart?
    addToCart: (productId: string, title: string, price: number, quantity?: number) => Promise<void> // Add item to cart (POST /api/cart-items)
    updateCartQuantity: (itemId: string, quantity: number) => Promise<void> // Change quantity of an item in cart (PATCH /api/cart-items/{id})
    removeFromCart: (itemId: string) => Promise<void> // Remove item from cart (DELETE /api/cart-items/{id})
    clearCart: () => void // Empty the cart (local only)
    fetchCart: () => Promise<void> // Get the cart: if logged in, from backend (GET /api/carts/me); if not logged in, from localStorage
    syncLocalCartToBackend: () => Promise<void> // After login: for each item in localStorage cart, send a POST to /api/cart-items with product_id and quantity, then clear localStorage. Ensures all cart items are transferred to backend cart.

  // Order data and functions
  orders: Order[] // List of orders for the user
  ordersLoading: boolean // Is the app loading orders?
    checkout: () => Promise<string | null> // Create a new order from the cart (POST /api/orders/checkout)
    payOrder: (orderId: string) => Promise<void> // Pay for an order (PATCH /api/orders/{id}/pay)
    fetchOrders: () => Promise<void> // Get all orders for the user (GET /api/orders)
}

// Create the context object
const AppContext = createContext<AppContextType | undefined>(undefined)

// --- Local cart storage helpers ---
// Everything you add to your cart while not logged in is saved under this name in localStorage.
// This lets you keep your cart even if you close the page and come back later.
const LOCAL_CART_KEY = 'brightpixel_local_cart'

// Get all cart items from localStorage (for users who are not logged in)
// Hier wordt localStorage gebruikt om de winkelwagen van een niet-ingelogde gebruiker op te slaan.
// Dit zorgt ervoor dat je cart blijft bestaan als je niet ingelogd bent.
const getLocalCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save all cart items to localStorage (when user is not logged in)
// Hier wordt localStorage gebruikt om de cart-items op te slaan voor gasten.
// Zo kun je later verder winkelen zonder ingelogd te zijn.
const setLocalCart = (items: CartItem[]) => {
  // Sla de cart op in localStorage
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
}

// Delete everything from your local cart (for users who are not logged in)
// Hier wordt localStorage geleegd als de cart van een gast wordt verwijderd.
const clearLocalCart = () => {
  // Verwijder de cart uit localStorage
  localStorage.removeItem(LOCAL_CART_KEY)
}

// The provider component: wraps the app and provides all context data/functions
export function AppProvider({ children }: { children: ReactNode }) {
  // Who is currently logged in? (user)
  const [user, setUser] = useState<User | null>(null)

  // Is the app checking if someone is logged in? (authLoading)
  const [authLoading, setAuthLoading] = useState(true)

  // Which workshops is the user enrolled in? (enrolledWorkshops)
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<Workshop[]>([])

  // Is the app loading workshops? (workshopsLoading)
  const [workshopsLoading, setWorkshopsLoading] = useState(false)

  // What is currently in the shopping cart? (cartItems)
  // If you are not logged in, this is loaded from localStorage.
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getLocalCart())

  // Is the shopping cart loading? (cartLoading)
  const [cartLoading, setCartLoading] = useState(false)

  // Which orders has the user made? (orders)
  const [orders, setOrders] = useState<Order[]>([])

  // Is the app loading orders? (ordersLoading)
  const [ordersLoading, setOrdersLoading] = useState(false)

  // --- Cart sync helpers ---
  // After login, move all items from your local shopping cart (localStorage) to your account's cart on the backend.
  // This makes sure you keep your cart items when you log in.
  const syncLocalCartToBackend = useCallback(async () => {
    const localItems = getLocalCart()
    if (localItems.length === 0) return // If there are no items, do nothing

    // For each item in your local cart, send it to the backend so it appears in your account's cart
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

    // After syncing, clear the local cart so you don't have duplicate items
    clearLocalCart()
  }, [])

  // --- Data fetchers ---
  // Get the shopping cart for the current user.
  // If the user is not logged in, load the cart from localStorage (browser storage).
  // If the user is logged in, fetch the cart from the backend and get extra product details for each item.
  const fetchCart = useCallback(async () => {
    if (!user) {
      // Not logged in: get cart from localStorage
      setCartItems(getLocalCart())
      return
    }

    // Logged in: get cart from backend
    setCartLoading(true)
    try {
      const response = await fetch('/api/carts/me', { credentials: 'include' })
      if (response.ok) {
        const cartData = await response.json()

        // For each cart item, fetch extra product details (like the title)
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
              // If product details can't be loaded, use fallback info
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
        // No cart found: set to empty
        setCartItems([])
      }
    } catch {
      // If something goes wrong, do nothing
    } finally {
      // Always stop loading spinner
      setCartLoading(false)
    }
  }, [user])

  // Get all orders for the current user from the backend.
  // If the user is not logged in, do nothing (keep existing orders).
  // If the user is logged in, show a loading spinner, fetch the orders, and update the state.
  const fetchOrders = useCallback(async () => {
    if (!user) {
      // Not logged in: don't change the orders list
      return
    }
    setOrdersLoading(true) // Show loading spinner while fetching
    try {
      // Ask the backend for all orders belonging to the current user
      const response = await fetch('/api/orders', { credentials: 'include' })
      if (response.ok) {
        // If successful, update the orders state with the new data
        const ordersData = await response.json()
        setOrders(ordersData)
      }
    } catch {
      // If something goes wrong, just keep the old orders
    } finally {
      // Always stop the loading spinner, even if there was an error
      setOrdersLoading(false)
    }
  }, [user])

 

  // Haal alle workshops op waar de gebruiker voor is aangemeld
  // Alleen als je ingelogd bent, anders doe je niks
  const fetchEnrolledWorkshops = useCallback(async () => {
    // Alleen als er een gebruiker is, wordt de spinner aangezet en workshops opgehaald
    if (!user) return // Niet ingelogd: functie stopt direct, spinner blijft uit
    setWorkshopsLoading(true) // Wel ingelogd: spinner aan, workshops ophalen
    try {
      // Vraag backend om alle workshop-registraties van deze gebruiker
      const response = await fetch('/api/workshop-registrations/user/my-registrations', { credentials: 'include' })
      if (response.ok) {
        // Haal de lijst van registraties op
        const registrations = await response.json()
        // Voor elke registratie: haal de workshop details op
        const workshopsWithDetails = await Promise.all(
          registrations.map(async (reg: { workshop_id: string }) => {
            try {
              const workshopRes = await fetch(`/api/workshops/${reg.workshop_id}`)
              if (workshopRes.ok) {
                return await workshopRes.json()
              }
              return null // Niet gevonden: overslaan
            } catch {
              return null // Fout: overslaan
            }
          })
        )
        // Zet alle geldige workshops in de state
        setEnrolledWorkshops(workshopsWithDetails.filter(Boolean))
      }
    } catch {
      // Fout: oude workshops blijven staan
    } finally {
      setWorkshopsLoading(false) // Spinner uit
    }
  }, [user])

  // --- Effects ---
  // Bij het starten van de app: check of iemand al ingelogd is (cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch {
        // Niet ingelogd: geen probleem
      } finally {
        setAuthLoading(false)
      }
    }
    checkAuth()
  }, [])

  // When user changes: fetch cart, orders, and workshops
  useEffect(() => {
    if (user) {
      fetchCart()
      fetchOrders()
      fetchEnrolledWorkshops()
    }
  }, [user, fetchCart, fetchOrders, fetchEnrolledWorkshops])

  // --- User authentication functions ---
  // Log in a user
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

    // After login, sync local cart to backend
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

  // Log out the user
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // Ignore errors
    }
    // Clear all user-related data
    setUser(null)
    setCartItems([])
    setOrders([])
    setEnrolledWorkshops([])
  }

  // --- Workshop functions ---
  // Enroll user in a workshop
  const enrollInWorkshop = async (workshopId: string) => {
    // Deze functie schrijft je in voor een workshop.
    // Na inschrijven wordt fetchEnrolledWorkshops aangeroepen zodat je direct ziet dat je workshop-lijst is bijgewerkt.
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

  // Unenroll user from a workshop
  const unenrollFromWorkshop = async (workshopId: string) => {
    // Deze functie schrijft je uit voor een workshop.
    // Na uitschrijven wordt fetchEnrolledWorkshops aangeroepen zodat je direct ziet dat je workshop-lijst is bijgewerkt.
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

  // --- Cart functions ---
  // Add item to cart
  const addToCart = async (productId: string, title: string, price: number, quantity: number = 1) => {
    if (!user) {
      // Hier wordt localStorage gebruikt om de cart van een gast bij te werken.
      // Dit zorgt ervoor dat je cart-items blijven bestaan als je niet ingelogd bent.
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

  // Update quantity of an item in cart
  const updateCartQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    if (!user) {
      // Hier wordt localStorage gebruikt om de hoeveelheid van een cart-item aan te passen voor gasten.
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

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    if (!user) {
      // Hier wordt localStorage gebruikt om een item uit de cart van een gast te verwijderen.
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

  // Empty the cart
  const clearCart = () => {
    // Hier wordt localStorage geleegd als de cart wordt gewist.
    clearLocalCart()
    setCartItems([])
  }

  //  Order functions 
  // Create a new order from the cart
  const checkout = async (): Promise<string | null> => {
    // This can be called right after login before React state updates
    // The backend will verify auth via the cookie
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

  // Pay for an order
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

  // Provide all context data and functions to children
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

// Custom hook to use the context easily in other components
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}