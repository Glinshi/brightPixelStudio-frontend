import { Trash2 } from 'lucide-react'

interface PreviewProps {
  item: {
    id: number
    name: string
    quantity: number
    price: number
  }
  onRemove: () => void
}

export default function Preview({ item, onRemove }: PreviewProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-sm font-medium text-gray-700">
            {item.quantity}
          </span>
          <div>
            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
            <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
          </div>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        title="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}