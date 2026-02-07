import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Minus, Plus, ChevronLeft } from "lucide-react";
import ZoomCard from "../components/ZoomCard";
import { useApp } from "../context/AppContext";
import type { Offer } from "./Offers";
import Button from "../components/Button";

export default function OffersZoom() {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(0);
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("offer") || "";
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) {
        setError("No offer ID provided");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/products/${offerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch offer");
        }
        const data = await response.json();
        setOffer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [offerId]);

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 0) return;
    setQuantity(newQuantity);
  };

  const addToCartHandler = async () => {
    if (!offer || quantity === 0) return;
    await addToCart(offer.id, offer.title, offer.price, quantity);
    alert(`Added ${quantity} ${offer.title} to cart!`);
    setQuantity(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading offer...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6">
            <Link
              to="/offers"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-gray-600 font-medium">Return to offers</span>
            </Link>
          </div>
          <div className="flex items-center justify-center h-64">
            <p className="text-red-600">Error: {error || "Offer not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <Link
            to="/offers"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <span className="text-gray-600 font-medium">Return to offers</span>
          </Link>
        </div>

        <ZoomCard
          title={offer.title}
          description={offer.description}
          features={offer.features}
          price={offer.price}
          imageSrc={offer.image_url}
          imageAlt={offer.title}
          actionSection={
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 rounded-l-full"
                >
                  <Minus size={18} className="text-gray-700" />
                </button>
                <div className="w-12 h-10 flex items-center justify-center font-semibold text-gray-900">
                  {quantity}
                </div>
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 rounded-r-full"
                >
                  <Plus size={18} className="text-gray-700" />
                </button>
              </div>
              <Button
                onClick={addToCartHandler}
                variant="primary"
                className="whitespace-nowrap"
              >
                ADD TO CART
              </Button>
            </div>
          }
        />
      </div>

    </div>
  );
}
