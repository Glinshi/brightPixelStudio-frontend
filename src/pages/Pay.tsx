import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";

interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
}

export default function Pay() {
  const { payOrder, orders, fetchOrders } = useApp();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("credit-card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const pendingOrder = orders.find(o => o.id === currentOrderId);
  const total = pendingOrder ? parseFloat(pendingOrder.total_amount.replace('€', '')) : 0;

  React.useEffect(() => {
    const pendingOrderId = localStorage.getItem('pendingOrderId');
    const pendingOrderItems = localStorage.getItem('pendingOrderItems');
    
    if (pendingOrderId) {
      setCurrentOrderId(pendingOrderId);
      fetchOrders();
    }
    
    if (pendingOrderItems) {
      try {
        setOrderItems(JSON.parse(pendingOrderItems));
      } catch {
        setOrderItems([]);
      }
    }
  }, [fetchOrders]);

  const handlePayment = async () => {
    if (currentOrderId) {
      setIsProcessing(true);
      setTimeout(async () => {
        await payOrder(currentOrderId);
        setPaymentSuccess(true);
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingOrderItems');
        setIsProcessing(false);
      }, 1000);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-12 text-center">
          <div className="bg-white rounded-xl border border-gray-300 p-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Payment Successful
            </h1>
            <p className="text-gray-600 mb-8">
              Your payment has been processed successfully
            </p>
            <Button onClick={() => navigate("/landing")}> 
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            You're one step away from completing your order
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-xl p-6 bg-[rgba(152,122,31,0.30)] ">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 ">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment"
                      value="credit-card"
                      checked={selectedPayment === "credit-card"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="credit-card"
                      className="flex items-center gap-2 font-medium"
                    >
                      Credit Card
                      <CreditCard size={20} className="text-gray-600" />
                    </label>
                  </div>
                  {selectedPayment === "credit-card" && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <input
                          type="text"
                          placeholder="0426567780"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:[rgba(152,122,31,0.30)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="ideal"
                      name="payment"
                      value="ideal"
                      checked={selectedPayment === "ideal"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="ideal" className="font-medium">
                      iDEAL
                    </label>
                  </div>
                  {selectedPayment === "ideal" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:[rgba(152,122,31,0.30)]">
                        <option>Choose your bank</option>
                        <option>ABN AMRO</option>
                        <option>ING</option>
                        <option>Rabobank</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      value="paypal"
                      checked={selectedPayment === "paypal"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="paypal" className="font-medium">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !currentOrderId}
                  className="w-full rounded-[25px] px-6 py-3 text-white font-medium transition-colors hover:opacity-90 bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.7)] disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay €${total.toFixed(2)} securely`}
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {orderItems.length > 0 ? (
                <>
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <p className="font-medium text-gray-900">{item.quantity}x {item.title}</p>
                      <span className="font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-500">Loading order items...</p>
              )}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
