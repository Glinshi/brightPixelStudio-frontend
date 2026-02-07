import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from './Button'

type AccountContentProps = {
  activeSection: 'profile' | 'workshops' | 'orders' | 'settings'
  setActiveSection: (section: 'profile' | 'workshops' | 'orders' | 'settings') => void
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Date TBD'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AccountContent({ activeSection, setActiveSection }: AccountContentProps) {
  const { enrolledWorkshops, unenrollFromWorkshop, orders, workshopsLoading, user, setUser } = useApp()
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null)
  const itemsPerPage = 6


  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [updatedFields, setUpdatedFields] = useState<string[]>([])

  const handleUpdate = async () => {
    setUpdateError(null)
    setUpdating(true)

    const updateData: Record<string, string> = {}
    const fieldNames: string[] = []

   
    if (firstName.trim()) {
      if (firstName.trim().length < 2) {
        setUpdateError('First name must be at least 2 characters')
        setUpdating(false)
        return
      }
      if (firstName.trim().length > 10) {
        setUpdateError('First name cannot exceed 10 characters')
        setUpdating(false)
        return
      }
      updateData.first_name = firstName.trim()
      fieldNames.push('First Name')
    }

   
    if (lastName.trim()) {
      if (lastName.trim().length < 2) {
        setUpdateError('Last name must be at least 2 characters')
        setUpdating(false)
        return
      }
      if (lastName.trim().length > 40) {
        setUpdateError('Last name cannot exceed 40 characters')
        setUpdating(false)
        return
      }
      updateData.last_name = lastName.trim()
      fieldNames.push('Last Name')
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        setUpdateError('Please enter a valid email address (e.g. name@example.com)')
        setUpdating(false)
        return
      }
      updateData.email = email.trim()
      fieldNames.push('Email')
    }

 
    if (password.trim()) {
      if (password.length < 8) {
        setUpdateError('Password must be at least 8 characters')
        setUpdating(false)
        return
      }
      updateData.password = password.trim()
      fieldNames.push('Password')
    }

    if (Object.keys(updateData).length === 0) {
      setUpdateError('Please fill in at least one field')
      setUpdating(false)
      return
    }

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Update failed')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)

      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')

      setUpdatedFields(fieldNames)
      setShowUpdatedMessage(true)
      setTimeout(() => {
        setShowUpdatedMessage(false)
        setUpdatedFields([])
      }, 3000)
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handleUnenroll = async (workshopId: string) => {
    setUnenrollingId(workshopId)
    try {
      await unenrollFromWorkshop(workshopId)
    } finally {
      setUnenrollingId(null)
    }
  }

  const totalOrderPages = Math.ceil(orders.length / itemsPerPage)
  const orderStartIndex = (currentOrderPage - 1) * itemsPerPage
  const currentOrders = orders.slice(orderStartIndex, orderStartIndex + itemsPerPage)

  const renderProfile = () => (
    <div className="flex items-start justify-center h-full pt-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 w-80">
        {user ? (
          <>
            <p className="text-center text-gray-500 text-sm mb-4">
                Firstname: {user.first_name} <br />
                Lastname: {user.last_name}   <br />
                Email: {user.email}
            </p>
            <Button 
              onClick={() => setActiveSection('settings')}
              className="w-full mt-4 rounded-lg px-4 py-3"
            >
              Update profile
            </Button>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
    </div>
  </div>
  )

  const renderWorkshops = () => (
    <div className="p-6">
      {workshopsLoading ? (
        <div className="text-center text-white py-8">Loading workshops...</div>
      ) : enrolledWorkshops.length === 0 ? (
        <div className="text-center text-white py-8">No enrolled workshops</div>
      ) : (
        <div className="space-y-4 mb-6">
          {enrolledWorkshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-lg border border-gray-400 p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{workshop.title}</h3>
                  <p className="text-gray-600 mb-1">{formatDate(workshop.starts_at)}</p>
                  <p className="text-gray-600 text-sm">{workshop.description}</p>
                </div>
                <button
                  onClick={() => handleUnenroll(workshop.id)}
                  disabled={unenrollingId === workshop.id}
                  className="rounded-[25px] px-3 py-1 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.55)] disabled:opacity-50"
                >
                  {unenrollingId === workshop.id ? 'Unenrolling...' : '-Unenroll'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderOrders = () => (
    <div className="p-6">
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No orders yet
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {currentOrders.map((order, index) => (
            <div key={`${order.id}-${index}`} className="bg-white rounded-lg border border-gray-400 p-4">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="font-medium text-gray-800 mb-1">Order: {order.id.slice(0, 4)}</p>
                    <p className="text-gray-600 text-sm mb-1">
                      Status: <span className={order.status === 'paid' ? 'text-green-600' : 'text-orange-500'}>{order.status}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-2">Total: {order.total_amount}</p>
                    <p className="text-xs text-gray-400">Created at: {new Date(order.created_at).toLocaleDateString()}</p>
                    {order.paid_at && (
                      <p className="text-xs text-gray-400">Paid at: {new Date(order.paid_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="text-right pr-50 text-sm text-gray-600">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <p key={item.id}>{item.quantity}x {item.product_title}</p>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No items</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalOrderPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentOrderPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentOrderPage === 1}
            className={`rounded-[25px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              currentOrderPage === 1
                ? 'bg-gray-200 text-gray-400'
                : 'bg-[rgba(152,122,31,0.49)] text-white hover:bg-[rgba(152,122,31,0.55)]'
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentOrderPage} of {totalOrderPages}
          </span>

          <button
            onClick={() => setCurrentOrderPage((prev) => Math.min(prev + 1, totalOrderPages))}
            disabled={currentOrderPage === totalOrderPages}
            className={`rounded-[25px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              currentOrderPage === totalOrderPages
                ? 'bg-gray-200 text-gray-400'
                : 'bg-[rgba(152,122,31,0.49)] text-white hover:bg-[rgba(152,122,31,0.55)]'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )

  const renderSettings = () => (
    <div className="flex items-start justify-center h-full pt-16">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 w-80">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Update account</h2>
        {user && (
          <p className="text-center text-gray-500 text-sm mb-4">
            Logged in as: {user.first_name} {user.last_name}
          </p>
        )}
        <div className="space-y-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-700 text-sm"
            placeholder="First Name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-700 text-sm"
            placeholder="Last Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-700 text-sm"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-700 text-sm"
            placeholder="New Password"
          />
          <Button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full mt-4 rounded-lg px-4 py-3 text-white font-medium bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.55)] disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
          {showUpdatedMessage && updatedFields.length > 0 && (
            <p className="text-center text-green-600 font-medium mt-2">
              Updated: {updatedFields.join(', ')}
            </p>
          )}
          {updateError && (
            <p className="text-center text-red-500 font-medium mt-2">{updateError}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 bg-[rgba(152,122,31,0.49)] min-w-0">
      <div className="w-full h-full p-4 sm:p-6 md:p-8">
        {activeSection === 'profile' && renderProfile()}
        {activeSection === 'workshops' && renderWorkshops()}
        {activeSection === 'orders' && renderOrders()}
        {activeSection === 'settings' && renderSettings()}
      </div>
    </div>
  )
}
