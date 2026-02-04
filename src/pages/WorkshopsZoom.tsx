import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'
import ZoomCard from '../components/ZoomCard'
import { useApp } from '../context/AppContext'
import { allWorkshops } from './Workshops'

export default function WorkshopsZoom() {
  const { enrolledWorkshops, enrollInWorkshop, unenrollFromWorkshop } = useApp()
  const [searchParams] = useSearchParams()
  const workshopId = parseInt(searchParams.get('workshop') || '1')
  
  const workshop = allWorkshops.find(w => w.id === workshopId) || allWorkshops[0]
  const isEnrolled = enrolledWorkshops.some(w => w.id === workshop.id)

  const handleEnrollment = () => {
    if (isEnrolled) {
      unenrollFromWorkshop(workshop.id)
    } else {
      enrollInWorkshop(workshop)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
          description={workshop.description}
          features={["Hands-on exercises", "Industry best practices", "Real-world projects", "Expert mentorship"]}
          imageSrc={workshop.imageSrc}
          imageAlt={workshop.imageAlt}
          type="workshop"
          date={workshop.date}
          actionSection={
            <div className="flex items-center">
              <Button
                onClick={handleEnrollment}
                variant={isEnrolled ? "secondary" : "primary"}
                className={`text-sm h-10 px-4 py-2 ${
                  isEnrolled ? '!bg-gray-300 !text-gray-600 hover:!bg-gray-400' : '!bg-[rgba(152,122,31,0.49)] hover:!bg-[rgba(152,122,31,0.7)] '
                }`}
              >
                {isEnrolled ? '- Unenrol' : '+ Enrol'}
              </Button>
            </div>
          }


        />
      </div>

      <Footer />
    </div>
  )
}



