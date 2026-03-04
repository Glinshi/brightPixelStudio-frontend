import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Button from './Button'
import ConfirmPopup from './ConfirmPopup'

type AccountContentProps = {
  activeSection: 'profile' | 'workshops' | 'orders' | 'offers' | 'settings'
  setActiveSection: (section: 'profile' | 'workshops' | 'orders' | 'offers' | 'settings') => void
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
  const navigate = useNavigate()
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null)
  const itemsPerPage = 6

  // Superuser: all workshops + add workshop form
  const [allWorkshops, setAllWorkshops] = useState<any[]>([])
  const [allWorkshopsLoading, setAllWorkshopsLoading] = useState(false)
  const [currentWorkshopPage, setCurrentWorkshopPage] = useState(1)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newStartsAt, setNewStartsAt] = useState('')
  const [newCapacity, setNewCapacity] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [addingWorkshop, setAddingWorkshop] = useState(false)
  const [addWorkshopError, setAddWorkshopError] = useState<string | null>(null)
  const [addWorkshopSuccess, setAddWorkshopSuccess] = useState(false)

  // Superuser: all offers + add offer form
  const [allOffers, setAllOffers] = useState<any[]>([])
  const [allOffersLoading, setAllOffersLoading] = useState(false)
  const [currentOfferPage, setCurrentOfferPage] = useState(1)
  const [offerTitle, setOfferTitle] = useState('')
  const [offerDescription, setOfferDescription] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [offerType, setOfferType] = useState<'product' | 'service'>('product')
  const [offerImageUrl, setOfferImageUrl] = useState('')
  const [addingOffer, setAddingOffer] = useState(false)
  const [addOfferError, setAddOfferError] = useState<string | null>(null)
  const [addOfferSuccess, setAddOfferSuccess] = useState(false)
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null)
  const [confirmDeleteOfferId, setConfirmDeleteOfferId] = useState<string | null>(null)

  const fetchAllOffers = async () => {
    setAllOffersLoading(true)
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setAllOffers(data)
      }
    } catch {
      // ignore
    } finally {
      setAllOffersLoading(false)
    }
  }

  const handleDeleteOffer = async (offerId: string) => {
    setConfirmDeleteOfferId(null)
    setDeletingOfferId(offerId)
    try {
      const res = await fetch(`/api/products/${offerId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to delete offer')
      }
      await fetchAllOffers()
    } catch (err) {
      setAddOfferError(err instanceof Error ? err.message : 'Failed to delete offer')
    } finally {
      setDeletingOfferId(null)
    }
  }

  const handleAddOffer = async () => {
    setAddOfferError(null)
    if (!offerTitle.trim() || !offerDescription.trim() || !offerPrice.trim()) {
      setAddOfferError('Please fill in all required fields')
      return
    }
    const price = parseFloat(offerPrice)
    if (isNaN(price) || price <= 0) {
      setAddOfferError('Price must be greater than 0')
      return
    }
    if (offerDescription.trim().length < 8) {
      setAddOfferError('Description must be at least 8 characters')
      return
    }

    setAddingOffer(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: offerTitle.trim(),
          description: offerDescription.trim(),
          price,
          product_type: offerType,
          image_url: offerImageUrl.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to create offer')
      }
      setOfferTitle('')
      setOfferDescription('')
      setOfferPrice('')
      setOfferType('product')
      setOfferImageUrl('')
      setAddOfferSuccess(true)
      setTimeout(() => setAddOfferSuccess(false), 3000)
      await fetchAllOffers()
    } catch (err) {
      setAddOfferError(err instanceof Error ? err.message : 'Failed to create offer')
    } finally {
      setAddingOffer(false)
    }
  }

  const fetchAllWorkshops = async () => {
    setAllWorkshopsLoading(true)
    try {
      const res = await fetch('/api/workshops')
      if (res.ok) {
        const data = await res.json()
        setAllWorkshops(data)
      }
    } catch {
      // ignore
    } finally {
      setAllWorkshopsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.is_superuser && activeSection === 'workshops') {
      fetchAllWorkshops()
    }
    if (user?.is_superuser && activeSection === 'offers') {
      fetchAllOffers()
    }
  }, [user?.is_superuser, activeSection])

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDeleteWorkshop = async (workshopId: string) => {
    setConfirmDeleteId(null)
    setDeletingId(workshopId)
    try {
      const res = await fetch(`/api/workshops/${workshopId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to delete workshop')
      }
      await fetchAllWorkshops()
    } catch (err) {
      setAddWorkshopError(err instanceof Error ? err.message : 'Failed to delete workshop')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddWorkshop = async () => {
    setAddWorkshopError(null)
    if (!newTitle.trim() || !newDescription.trim() || !newStartsAt.trim() || !newCapacity.trim()) {
      setAddWorkshopError('Please fill in all required fields')
      return
    }
    const cap = parseInt(newCapacity)
    if (isNaN(cap) || cap < 0) {
      setAddWorkshopError('Capacity must be 0 or higher')
      return
    }

    setAddingWorkshop(true)
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          starts_at: newStartsAt.trim(),
          capacity: cap,
          image_url: newImageUrl.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to create workshop')
      }
      setNewTitle('')
      setNewDescription('')
      setNewStartsAt('')
      setNewCapacity('')
      setNewImageUrl('')
      setAddWorkshopSuccess(true)
      setTimeout(() => setAddWorkshopSuccess(false), 3000)
      await fetchAllWorkshops()
    } catch (err) {
      setAddWorkshopError(err instanceof Error ? err.message : 'Failed to create workshop')
    } finally {
      setAddingWorkshop(false)
    }
  }


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

  const renderWorkshops = () => {
    // Superuser view: add workshop card + all workshops list
    if (user?.is_superuser) {
      // Page 1 shows add-card + (itemsPerPage - 1) workshops, other pages show itemsPerPage
      const workshopsOnFirstPage = itemsPerPage - 1
      const totalSuperPages = allWorkshops.length <= workshopsOnFirstPage
        ? 1
        : 1 + Math.ceil((allWorkshops.length - workshopsOnFirstPage) / itemsPerPage)
      const currentSuperWorkshops = currentWorkshopPage === 1
        ? allWorkshops.slice(0, workshopsOnFirstPage)
        : allWorkshops.slice(
            workshopsOnFirstPage + (currentWorkshopPage - 2) * itemsPerPage,
            workshopsOnFirstPage + (currentWorkshopPage - 1) * itemsPerPage
          )

      return (
        <div className="p-6">
          <ConfirmPopup
            isOpen={confirmDeleteId !== null}
            onClose={() => setConfirmDeleteId(null)}
            onConfirm={() => confirmDeleteId && handleDeleteWorkshop(confirmDeleteId)}
            title="Delete workshop?"
            message="This will permanently remove the workshop and all its registrations."
            confirmText="Delete"
            cancelText="Cancel"
            loading={deletingId !== null}
          />
          {/* Add Workshop card - only on page 1 */}
          {currentWorkshopPage === 1 && (
          <div className="bg-white rounded-lg border border-gray-400 p-4 mb-6">
            <h3 className="font-medium text-gray-800 mb-3">+ Add Workshop</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
                placeholder="Title (max 255 characters)"
                maxLength={255}
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm resize-none"
                placeholder="Description (min 1 character)"
                rows={2}
              />
              <input
                type="text"
                value={newStartsAt}
                onChange={(e) => setNewStartsAt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
                placeholder="Starts at — e.g. 2026-06-15 14:30:00"
              />
              <input
                type="number"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
                placeholder="Capacity (min 0)"
                min={0}
              />
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
                placeholder="Image URL (optional) — e.g. /images/workshops/photo.jpg"
              />
              <button
                onClick={handleAddWorkshop}
                disabled={addingWorkshop}
                className="rounded-[25px] px-4 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.55)] disabled:opacity-50"
              >
                {addingWorkshop ? 'Adding...' : 'Add Workshop'}
              </button>
              {addWorkshopSuccess && (
                <p className="text-green-600 text-sm font-medium">Workshop added!</p>
              )}
              {addWorkshopError && (
                <p className="text-red-500 text-sm font-medium">{addWorkshopError}</p>
              )}
            </div>
          </div>
          )}

          {/* All workshops heading */}
          <h3 className="font-medium text-white mb-3">Workshops</h3>

          {allWorkshopsLoading ? (
            <div className="text-center text-white py-8">Loading workshops...</div>
          ) : allWorkshops.length === 0 ? (
            <div className="text-center text-white py-8">No workshops yet</div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {currentSuperWorkshops.map((workshop) => (
                <div key={workshop.id} className="bg-white rounded-lg border border-gray-400 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <Link to={`/workshops-zoom?workshop=${workshop.id}`} className="hover:opacity-80 transition-opacity">
                        <h3 className="font-medium text-gray-800 mb-1 hover:underline">{workshop.title}</h3>
                      </Link>
                      <p className="text-gray-600 mb-1">{formatDate(workshop.starts_at)}</p>
                      <p className="text-gray-600 text-sm">{workshop.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {workshop.available_spots !== null && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {workshop.available_spots} spots left
                        </span>
                      )}
                      <button
                        onClick={() => setConfirmDeleteId(workshop.id)}
                        disabled={deletingId === workshop.id}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete workshop"
                      >
                        {deletingId === workshop.id ? '...' : '×'}
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>

              {totalSuperPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentWorkshopPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentWorkshopPage === 1}
                    className={`rounded-[25px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentWorkshopPage === 1
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-[rgba(152,122,31,0.49)] text-white hover:bg-[rgba(152,122,31,0.55)]'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-white">
                    Page {currentWorkshopPage} of {totalSuperPages}
                  </span>
                  <button
                    onClick={() => setCurrentWorkshopPage((prev) => Math.min(prev + 1, totalSuperPages))}
                    disabled={currentWorkshopPage === totalSuperPages}
                    className={`rounded-[25px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentWorkshopPage === totalSuperPages
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-[rgba(152,122,31,0.49)] text-white hover:bg-[rgba(152,122,31,0.55)]'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )
    }

    // Normal user view: enrolled workshops only
    return (
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
                    <Link to={`/workshops-zoom?workshop=${workshop.id}`} className="hover:opacity-80 transition-opacity">
                      <h3 className="font-medium text-gray-800 mb-1 hover:underline">{workshop.title}</h3>
                    </Link>
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
  }

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
              <div className="flex">
                <div className="w-1/2">
                  <div className="mb-2">
                    {order.status === 'pending' ? (
                      <p
                        className="font-medium text-blue-600 mb-1 cursor-pointer hover:underline"
                        onClick={() => {
                          localStorage.setItem('pendingOrderId', order.id)
                          const items = order.items?.map((item: any) => ({
                            id: item.id,
                            product_id: item.product_id,
                            title: item.product_title,
                            price: item.unit_price,
                            quantity: item.quantity,
                          })) || []
                          localStorage.setItem('pendingOrderItems', JSON.stringify(items))
                          navigate('/pay')
                        }}
                      >
                        Order: {order.id.slice(0, 4)}
                      </p>
                    ) : (
                      <p className="font-medium text-gray-800 mb-1">Order: {order.id.slice(0, 4)}</p>
                    )}
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
                <div className="w-1/2 text-sm text-gray-600 flex flex-col items-start">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <p key={item.id} className="whitespace-nowrap">{item.quantity}x {item.product_title}</p>
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

  const renderOffers = () => {
    const offersOnFirstPage = itemsPerPage - 1
    const totalOfferPages = allOffers.length <= offersOnFirstPage
      ? 1
      : 1 + Math.ceil((allOffers.length - offersOnFirstPage) / itemsPerPage)
    const currentPageOffers = currentOfferPage === 1
      ? allOffers.slice(0, offersOnFirstPage)
      : allOffers.slice(
          offersOnFirstPage + (currentOfferPage - 2) * itemsPerPage,
          offersOnFirstPage + (currentOfferPage - 1) * itemsPerPage
        )

    return (
      <div className="p-6">
        <ConfirmPopup
          isOpen={confirmDeleteOfferId !== null}
          onClose={() => setConfirmDeleteOfferId(null)}
          onConfirm={() => confirmDeleteOfferId && handleDeleteOffer(confirmDeleteOfferId)}
          title="Delete offer?"
          message="This will permanently remove the offer."
          confirmText="Delete"
          cancelText="Cancel"
          loading={deletingOfferId !== null}
        />

        {/* Add Offer card - only on page 1 */}
        {currentOfferPage === 1 && (
        <div className="bg-white rounded-lg border border-gray-400 p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-3">+ Add Offer</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
              placeholder="Title (max 40 characters)"
              maxLength={40}
            />
            <textarea
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm resize-none"
              placeholder="Description (min 8 characters)"
              rows={2}
            />
            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
              placeholder="Price — use a dot, no comma (e.g. 29.99)"
              min={0.01}
              step={0.01}
            />
            <select
              value={offerType}
              onChange={(e) => setOfferType(e.target.value as 'product' | 'service')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
            <input
              type="text"
              value={offerImageUrl}
              onChange={(e) => setOfferImageUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-700 text-sm"
              placeholder="Image URL (optional) — e.g. /images/offers/photo.jpg"
            />
            <button
              onClick={handleAddOffer}
              disabled={addingOffer}
              className="rounded-[25px] px-4 py-2 text-white text-sm font-medium transition-colors hover:opacity-90 bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.55)] disabled:opacity-50"
            >
              {addingOffer ? 'Adding...' : 'Add Offer'}
            </button>
            {addOfferSuccess && (
              <p className="text-green-600 text-sm font-medium">Offer added!</p>
            )}
            {addOfferError && (
              <p className="text-red-500 text-sm font-medium">{addOfferError}</p>
            )}
          </div>
        </div>
        )}

        {/* All offers heading */}
        <h3 className="font-medium text-white mb-3">Offers</h3>

        {allOffersLoading ? (
          <div className="text-center text-white py-8">Loading offers...</div>
        ) : allOffers.length === 0 ? (
          <div className="text-center text-white py-8">No offers yet</div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {currentPageOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg border border-gray-400 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <Link to={`/offers-zoom?offer=${offer.id}`} className="hover:opacity-80 transition-opacity">
                        <h3 className="font-medium text-gray-800 mb-1 hover:underline">{offer.title}</h3>
                      </Link>
                      <p className="text-gray-600 mb-1 text-sm">${offer.price.toFixed(2)} — {offer.product_type}</p>
                      <p className="text-gray-600 text-sm">{offer.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setConfirmDeleteOfferId(offer.id)}
                        disabled={deletingOfferId === offer.id}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete offer"
                      >
                        {deletingOfferId === offer.id ? '...' : '×'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalOfferPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentOfferPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentOfferPage === 1}
                  className={`rounded-[25px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentOfferPage === 1
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-[rgba(152,122,31,0.49)] text-white hover:bg-[rgba(152,122,31,0.55)]'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-white">
                  Page {currentOfferPage} of {totalOfferPages}
                </span>
                <button
                  onClick={() => setCurrentOfferPage((prev) => Math.min(prev + 1, totalOfferPages))}
                  disabled={currentOfferPage === totalOfferPages}
                  className={`rounded-[25px] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentOfferPage === totalOfferPages
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-[rgba(152,122,31,0.49)] text-white hover:bg-[rgba(152,122,31,0.55)]'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[rgba(152,122,31,0.49)] min-w-0">
      <div className="w-full h-full p-4 sm:p-6 md:p-8">
        {activeSection === 'profile' && renderProfile()}
        {activeSection === 'workshops' && renderWorkshops()}
        {activeSection === 'orders' && renderOrders()}
        {activeSection === 'offers' && renderOffers()}
        {activeSection === 'settings' && renderSettings()}
      </div>
    </div>
  )
}
