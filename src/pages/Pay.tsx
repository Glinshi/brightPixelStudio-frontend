import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
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


  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const pendingOrder = orders.find(o => o.id === currentOrderId);
  const total = pendingOrder ? parseFloat(pendingOrder.total_amount.replace('$', '')) : 0;

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

  const isPaymentReady = () => {
    if (!currentOrderId) return false;
    
    if (selectedPayment === "credit-card") {
      return cardNumber.length >= 16 && cardExpiry.length >= 4 && cardCvv.length >= 3 && cardName.length >= 2;
    }
    if (selectedPayment === "ideal") {
      return selectedBank !== "";
    }
    if (selectedPayment === "paypal") {
      return paypalEmail.includes("@");
    }
    return false;
  };

  const handlePayment = async () => {
    setPaymentError("");
    
    if (!currentOrderId) {
      setPaymentError("No order found. Please try again.");
      return;
    }

    if (selectedPayment === "credit-card") {
      if (!cardName || cardName.length < 2) {
        setPaymentError("Please enter a valid cardholder name.");
        return;
      }
      if (cardNumber.length < 16) {
        setPaymentError("Please enter a valid 16-digit card number.");
        return;
      }
      if (cardExpiry.length < 4) {
        setPaymentError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cardCvv.length < 3) {
        setPaymentError("Please enter a valid CVV (3 digits).");
        return;
      }
    } else if (selectedPayment === "ideal") {
      if (!selectedBank) {
        setPaymentError("Please select your bank.");
        return;
      }
    } else if (selectedPayment === "paypal") {
      if (!paypalEmail.includes("@")) {
        setPaymentError("Please enter a valid PayPal email address.");
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(async () => {
      await payOrder(currentOrderId);
      setPaymentSuccess(true);
      localStorage.removeItem('pendingOrderId');
      localStorage.removeItem('pendingOrderItems');
      setIsProcessing(false);
    }, 1000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            You're one step away from completing your order
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose your preferred payment method below and enter your details. We support Credit Card, iDEAL, and PayPal for your convenience.
          </p>
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
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgba(152,122,31,0.5)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4532 1234 5678 9010"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgba(152,122,31,0.5)]"
                        />
                        <p className="text-xs text-gray-500 mt-1">16-digit card number</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgba(152,122,31,0.5)]"
                          />
                          <p className="text-xs text-gray-500 mt-1">MM/YY</p>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgba(152,122,31,0.5)]"
                          />
                          <p className="text-xs text-gray-500 mt-1">3-digit code</p>
                        </div>
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
                      iDEAL (Netherlands)
                    </label>
                  </div>
                  {selectedPayment === "ideal" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">Select your bank to proceed with iDEAL payment:</p>
                      <select 
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgba(152,122,31,0.5)]"
                      >
                        <option value="">Choose your bank</option>
                        <option value="abn">ABN AMRO</option>
                        <option value="ing">ING</option>
                        <option value="rabo">Rabobank</option>
                        <option value="sns">SNS Bank</option>
                        <option value="bunq">bunq</option>
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
                  {selectedPayment === "paypal" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email Address</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[rgba(152,122,31,0.5)]"
                      />
                      <p className="text-xs text-gray-500 mt-1">You will be redirected to PayPal to complete the payment</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6">
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full rounded-[25px] px-6 py-3 text-white font-medium transition-colors hover:opacity-90 bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.7)] disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)} securely`}
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
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
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
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
