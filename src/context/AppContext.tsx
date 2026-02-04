import { createContext, useContext, useState, ReactNode } from 'react'

interface Workshop {
  id: number
  title: string
  date: string
  description: string
}

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
}

interface Order {
  id: number
  items: CartItem[]
  total: number
  status: 'pending' | 'paid'
  date: string
}

interface AppContextType {
  // Workshops
  enrolledWorkshops: Workshop[]
  enrollInWorkshop: (workshop: Workshop) => void
  unenrollFromWorkshop: (workshopId: number) => void
  
  // Cart
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  updateCartQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  
  // Orders
  orders: Order[]
  createOrder: (items: CartItem[], total: number) => number
  updateOrderStatus: (orderId: number, status: 'pending' | 'paid') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<Workshop[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // Workshop functions
  const enrollInWorkshop = (workshop: Workshop) => {
    setEnrolledWorkshops(prev => {
      if (prev.find(w => w.id === workshop.id)) return prev
      return [...prev, workshop]
    })
  }

  const unenrollFromWorkshop = (workshopId: number) => {
    setEnrolledWorkshops(prev => prev.filter(w => w.id !== workshopId))
  }

  // Cart functions
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Order functions
  const createOrder = (items: CartItem[], total: number): number => {
    const orderId = Date.now()
    const newOrder: Order = {
      id: orderId,
      items: [...items],
      total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }
    setOrders(prev => [...prev, newOrder])
    return orderId
  }

  const updateOrderStatus = (orderId: number, status: 'pending' | 'paid') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    )
  }

  return (
    <AppContext.Provider value={{
      enrolledWorkshops,
      enrollInWorkshop,
      unenrollFromWorkshop,
      cartItems,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      orders,
      createOrder,
      updateOrderStatus
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