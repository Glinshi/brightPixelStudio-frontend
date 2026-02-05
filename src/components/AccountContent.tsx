import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from './Button'

type AccountContentProps = {
  activeSection: 'profile' | 'workshops' | 'orders' | 'settings'
}

export default function AccountContent({ activeSection }: AccountContentProps) {
  const { enrolledWorkshops, unenrollFromWorkshop, orders } = useApp()
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false)
  const itemsPerPage = 6

  const handleUpdate = () => {
    setShowUpdatedMessage(true)
    setTimeout(() => {
      setShowUpdatedMessage(false)
    }, 2000)
  }

  const totalOrderPages = Math.ceil(orders.length / itemsPerPage)
  const orderStartIndex = (currentOrderPage - 1) * itemsPerPage
  const currentOrders = orders.slice(orderStartIndex, orderStartIndex + itemsPerPage)

  const renderProfile = () => (
    <div className="flex items-start justify-center h-full pt-16">Empty</div>
  )

  const renderWorkshops = () => (
    <div className="p-6">
      <div className="space-y-4 mb-6">
        {enrolledWorkshops.map((workshop) => (
          <div key={workshop.id} className="bg-white rounded-lg border border-gray-400 p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">{workshop.title}</h3>
                <p className="text-gray-600 mb-1">{workshop.date}</p>
                <p className="text-gray-600 text-sm">{workshop.description}</p>
              </div>
              <button
                onClick={() => unenrollFromWorkshop(workshop.id)}
                className="rounded-[25px] px-3 py-1 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.55)]"
              >
                -Unenroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="p-6">
      <div className="space-y-4 mb-6">
        {currentOrders.map((order, index) => (
          <div key={`${order.id}-${index}`} className="bg-white rounded-lg border border-gray-400 p-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="mb-2">
                  <p className="font-medium text-gray-800 mb-1">Order: {order.id}</p>
                  <p className="text-gray-600 text-sm mb-1">Status: {order.status}</p>
                  <p className="text-gray-600 text-sm mb-2">Total: ${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Created at: {order.date}</p>
                </div>
              </div>
              <div className="flex-1 pl-6">
                <div className="space-y-1">
                  {order.items.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-gray-600 text-sm">
                      {item.quantity}x {item.title}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
        <div className="space-y-4">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-500 text-sm"
            placeholder="FirstName"
          />
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-500 text-sm"
            placeholder="LastName"
          />
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-500 text-sm"
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-gray-500 text-sm"
            placeholder="Password"
          />
          <Button
            onClick={handleUpdate}
            className="w-full mt-4 rounded-lg px-4 py-3 text-white font-medium bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.55)]"
          >
            Update
          </Button>
          {showUpdatedMessage && (
            <p className="text-center text-green-600 font-medium mt-2">Updated!</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 bg-[rgba(152,122,31,0.49)]">
      <div className="w-full h-full p-8">
        {activeSection === 'profile' && renderProfile()}
        {activeSection === 'workshops' && renderWorkshops()}
        {activeSection === 'orders' && renderOrders()}
        {activeSection === 'settings' && renderSettings()}
      </div>
    </div>
  )
}
