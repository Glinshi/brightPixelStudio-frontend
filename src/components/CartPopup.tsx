import { Link } from "react-router-dom";
import Preview from "./Preview";
import { useApp } from "../context/AppContext";

export default function CartPopup() {
  const { cartItems, removeFromCart } = useApp();

  return (
    <div className="absolute top-full left-1/2 mt-1 w-80 -translate-x-1/2 transform rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-50">
      <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-b-4 border-l-4 border-r-4 border-b-white border-l-transparent border-r-transparent"></div>
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-900">My cart</h3>
      </div>
      <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <Preview
              key={item.id}
              item={{
                id: item.id,
                name: item.title,
                quantity: item.quantity,
                price: item.price,
              }}
              onRemove={() => removeFromCart(item.id)}
            />
          ))
        )}
      </div>
      <div className="mt-4">
        <Link
          to="/cart"
          className="block w-full rounded-lg bg-[rgba(152,122,31,0.49)] py-2 text-center text-white font-medium hover:bg-[rgba(152,122,31,0.55)] transition-colors"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
