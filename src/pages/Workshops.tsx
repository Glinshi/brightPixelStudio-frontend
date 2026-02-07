import { useState, useEffect } from "react";
import NavigationArrows from "../components/NavigationArrows";
import WorkshopCard from "../components/WorkshopCard";

export interface Workshop {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  capacity: number | null;
  available_spots: number | null;
  image_url: string | null;
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("/api/workshops");
        if (!response.ok) {
          throw new Error("Failed to fetch workshops");
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const totalPages = Math.ceil(workshops.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentWorkshops = workshops.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading workshops...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center text-red-500 py-8">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Workshops
          </h1>
          <p className="text-gray-600">
            Interactive learning experiences designed to help you and your team
            develop new skills, explore creative processes, and unlock
            innovation.
          </p>
        </div>

        {workshops.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No workshops available at the moment
          </div>
        ) : (
          <div className="relative">
            <div className="space-y-4 mb-8">
              {currentWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
            {totalPages > 1 && (
              <NavigationArrows
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>

    </div>
  );
}
