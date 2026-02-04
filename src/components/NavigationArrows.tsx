import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationArrowsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function NavigationArrows({ currentPage, totalPages, onPageChange }: NavigationArrowsProps) {
  if (totalPages <= 1) return null

  return (
    <>
      {currentPage > 0 && (
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
      )}
      
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      )}
    </>
  )
}