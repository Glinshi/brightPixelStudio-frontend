import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext'

export default function Cart() {
  const { cartItems, updateCartQuantity, removeFromCart, checkout } = useApp()
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const handleProceedToCheckout = async () => {
    const orderId = await checkout();
    if (orderId) {
      localStorage.setItem('pendingOrderId', orderId);
      navigate('/pay');
    } else {
      alert('Failed to create order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
       
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">Review the items in your cart before processing them</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm">Service</p>
                    <p className="font-semibold text-gray-900 mt-1">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 rounded-l-full"
                    >
                      <Minus size={18} className="text-gray-700" />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center font-semibold text-gray-900">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 rounded-r-full"
                    >
                      <Plus size={18} className="text-gray-700" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <Trash2 size={16} className="text-gray-600 hover:text-red-600" />
                  </button>

                  <div className="w-16 text-right">
                    <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link to="/offers">
                <button className="bg-white border-2 border-gray-300 rounded-[25px] px-6 py-3 text-gray-700 font-medium transition-colors hover:border-gray-400 hover:bg-gray-50">
                  Continue shopping
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-300 p-6">
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full rounded-[25px] px-6 py-3 text-white font-medium transition-colors hover:opacity-90 bg-[rgba(152,122,31,0.60)] hover:bg-[rgba(152,122,31,0.65)] disabled:opacity-50"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
