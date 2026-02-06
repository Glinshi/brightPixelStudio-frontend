import { X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

interface NotLoggedInPopupProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function NotLoggedInPopup({ isOpen, onClose, redirectTo = "checkout" }: NotLoggedInPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Sign in to checkout
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to place your order. Your cart will be saved!
          </p>

          <div className="space-y-3">
            <Link to={`/signin?redirect=${redirectTo}`} className="block">
              <Button variant="primary" className="w-full py-3">
                Sign In
              </Button>
            </Link>
            
            <Link to={`/signup?redirect=${redirectTo}`} className="block">
              <Button variant="secondary" className="w-full py-3">
                Create Account
              </Button>
            </Link>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
