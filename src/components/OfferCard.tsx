import { Link } from 'react-router-dom'

interface OfferCardProps {
  offer: {
    id: number
    title: string
    price: number
    description: string
    features: string[]
  }
}

export default function OfferCard({ offer }: OfferCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <Link 
        to={`/offers-zoom?offer=${offer.id}`}
        className="block hover:opacity-80 transition-opacity"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{offer.title}</h3>
      </Link>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{offer.description}</p>
      
      <ul className="space-y-2 mb-4">
        {offer.features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-600 flex items-center">
            <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="mb-4">
        <span className="text-2xl font-bold text-indigo-600">${offer.price}</span>
      </div>
    </div>
  )
}