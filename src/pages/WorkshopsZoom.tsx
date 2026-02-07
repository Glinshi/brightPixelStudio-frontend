import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Button from '../components/Button'
import ZoomCard from '../components/ZoomCard'
import { useApp } from '../context/AppContext'
import type { Workshop } from './Workshops'

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Date TBD'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function WorkshopsZoom() {
  const { enrolledWorkshops, enrollInWorkshop, unenrollFromWorkshop, user } = useApp()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const workshopId = searchParams.get('workshop') || ''
  
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!workshopId) {
        setError('No workshop ID provided')
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`/api/workshops/${workshopId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch workshop')
        }
        const data = await response.json()
        setWorkshop(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchWorkshop()
  }, [workshopId])

  const isEnrolled = enrolledWorkshops.some(w => w.id === workshopId)

  const refreshWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops/${workshopId}`)
      if (response.ok) {
        const data = await response.json()
        setWorkshop(data)
      }
    } catch (err) {
      console.error('Failed to refresh workshop data')
    }
  }

  const handleEnrollment = async () => {
    if (!user) {
      alert('Please log in to enroll in workshops')
      navigate('/signin')
      return
    }
    if (!workshop) return

    setEnrolling(true)
    try {
      if (isEnrolled) {
        await unenrollFromWorkshop(workshop.id)
      } else {
        await enrollInWorkshop(workshop.id)
      }
      await refreshWorkshop()
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Loading workshop...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6">
            <Link to="/workshops" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="text-gray-600 font-medium">Return to workshops</span>
            </Link>
          </div>
          <div className="text-center text-red-500 py-8">{error || 'Workshop not found'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6">
          <Link to="/workshops" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <button className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <span className="text-gray-600 font-medium">Return to workshops</span>
          </Link>
        </div>
        
        <ZoomCard
          title={workshop.title}
          description={workshop.description || 'No description available'}
          imageSrc={workshop.image_url || ''}
          imageAlt={workshop.title}
          date={formatDate(workshop.starts_at)}
          actionSection={
            <div className="flex items-center gap-4">
              <Button
                onClick={handleEnrollment}
                disabled={enrolling || (workshop.available_spots === 0 && !isEnrolled)}
                variant={isEnrolled ? "secondary" : "primary"}
                className={`text-sm h-10 px-4 py-2 ${
                  isEnrolled ? '!bg-gray-300 !text-gray-600 hover:!bg-gray-400' : '!bg-[rgba(152,122,31,0.49)] hover:!bg-[rgba(152,122,31,0.7)] '
                }`}
              >
                {enrolling ? 'Processing...' : isEnrolled ? '- Unenroll' : '+ Enroll'}
              </Button>
              {workshop.available_spots !== null && (
                <span className="text-sm text-gray-500">
                  {workshop.available_spots} spots left
                </span>
              )}
            </div>
          }
        />
      </div>

    </div>
  )
}



