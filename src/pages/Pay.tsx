import { CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function Pay() {
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
              <p className="text-sm text-gray-500 mb-6">workshopcard2</p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-2 border-[rgba(152,122,31,0.49)]">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment"
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
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <input
                        type="text"
                        placeholder="0426567780"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:[rgba(152,122,31,0.30)]"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="ideal"
                      name="payment"
                      className="w-4 h-4"
                    />
                    <label htmlFor="ideal" className="font-medium">
                      iDEAL
                    </label>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:[rgba(152,122,31,0.30)]">
                      <option>Choose your bank</option>
                      <option>ABN AMRO</option>
                      <option>ING</option>
                      <option>Rabobank</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      className="w-4 h-4"
                    />
                    <label htmlFor="paypal" className="font-medium">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full rounded-[25px] px-6 py-3 text-white font-medium transition-colors hover:opacity-90 bg-[rgba(152,122,31,0.49)] hover:bg-[rgba(152,122,31,0.7)]">
                  Pay $0 securely
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-300 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">1x Example Workshop</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    $0
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
