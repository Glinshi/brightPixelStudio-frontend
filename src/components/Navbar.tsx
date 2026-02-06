import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartPopup from './CartPopup'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const { user } = useApp()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          BrightPixel Studio
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/offers" className="text-gray-600 hover:text-gray-900">
            Offers
          </Link>
          <Link to="/workshops" className="text-gray-600 hover:text-gray-900">
            Workshops
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div 
            className="group relative z-50"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <Link to="/cart" className="block p-2 text-gray-600 hover:text-gray-900">
              <ShoppingCart size={20} />
            </Link>
            {showCartPreview && <CartPopup />}
          </div>
          <Link 
            to="/account" 
            className="hidden rounded-[25px] border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:block"
          >
            Account
          </Link>
          <Link 
            to="/signin" 
            className="hidden rounded-[25px] border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:block"
          >
            {user ? user.first_name || 'Account' : 'Sign In'}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4">
            <Link to="/offers" className="text-gray-600 hover:text-gray-900">
              Offers
            </Link>
            <Link to="/workshops" className="text-gray-600 hover:text-gray-900">
              Workshops
            </Link>
            <Link to="/account" className="text-gray-600 hover:text-gray-900">
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
