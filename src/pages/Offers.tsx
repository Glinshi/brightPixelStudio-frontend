import { useState, useEffect } from "react";
import NavigationArrows from "../components/NavigationArrows";
import OfferCard from "../components/OfferCard";

export interface Offer {
  id: string;
  title: string;
  price: number;
  description: string;
  features?: string[];
  image_url?: string | null;
  product_type: "product" | "service";
  is_active: boolean;
}

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data = await response.json();
        setOffers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentOffers = offers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading offers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Our Offers
          </h1>
          <p className="text-gray-600 max-w-2xl">
            We offer comprehensive suite of services and products to help you
            build, launch and grow digital products that make a difference.
          </p>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2 mb-16 w-fit mx-auto">
            {currentOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          <NavigationArrows
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

    </div>
  );
}
