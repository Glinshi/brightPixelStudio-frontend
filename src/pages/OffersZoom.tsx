import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Minus, Plus, ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ZoomCard from "../components/ZoomCard";
import { useApp } from "../context/AppContext";
import { allOffers } from "./Offers";
import Button from "../components/Button";

export default function OffersZoom() {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [searchParams] = useSearchParams();
  const offerId = parseInt(searchParams.get("offer") || "1");

  const offer = useMemo(() => {
    return allOffers.find((o) => o.id === offerId) || allOffers[0];
  }, [offerId]);

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const addToCartHandler = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: offer.id,
        title: offer.title,
        price: offer.price
      });
    }
    alert(`Added ${quantity} ${offer.title} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
          imageSrc={offer.imageSrc}
          imageAlt={offer.imageAlt}
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

      <Footer />
    </div>
  );
}
