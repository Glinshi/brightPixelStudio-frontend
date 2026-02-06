import { Link } from 'react-router-dom'
import { Presentation } from 'lucide-react'

interface WorkshopCardProps {
  workshop: {
    id: number
    title: string
    date: string
    description: string
    workshopId: string
  }
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mb-4">
          <Presentation size={24} className="text-[rgba(152,122,31,0.7)]" />
        </div>
        
        <div className="flex-1">
          <Link to={`/workshops-zoom?workshop=${workshop.id}`} className="block hover:opacity-80 transition-opacity">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{workshop.title}</h3>
          </Link>
          <p className="text-gray-500 text-sm mb-3">{workshop.date}</p>
          <p className="text-gray-700 mb-3 leading-relaxed">{workshop.description}</p>
        </div>
      </div>
    </div>
  )
}