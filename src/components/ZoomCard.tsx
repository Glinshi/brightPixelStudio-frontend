import { ReactNode } from 'react'

interface ZoomCardProps {
  title: string
  description: string
  features?: string[]
  price?: number
  date?: string
  imageSrc?: string | null
  imageAlt?: string
  actionSection: ReactNode
}

export default function ZoomCard({
  title,
  description,
  features,
  price,
  date,
  imageSrc,
  imageAlt,
  actionSection
}: ZoomCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {imageSrc && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <img 
                src={imageSrc}
                alt={imageAlt || title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        )}

        <div className={`space-y-6 ${!imageSrc ? 'lg:col-span-2' : ''}`}>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          
          {date && (
            <p className="text-gray-500 text-lg font-medium">{date}</p>
          )}
          
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          {features && features.length > 0 && (
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-[rgba(152,122,31,0.55)] rounded-full mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
          
          {price && (
            <div className="text-3xl font-bold text-[rgba(152,122,31,0.55)]">${price.toFixed(2)}</div>
          )}
          
          <div className="pt-4">
            {actionSection}
          </div>
        </div>
      </div>
    </div>
  )
}