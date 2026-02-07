import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AccountSidebar from '../components/AccountSidebar'
import AccountContent from '../components/AccountContent'

type AccountSection = 'profile' | 'workshops' | 'orders' | 'settings'

export default function Account() {
  const { user, authLoading } = useApp()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<AccountSection>('profile')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin')
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-6 sm:py-8">
        <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-semibold text-gray-900">Account</h1>
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white shadow-sm border-2 border-gray-400 max-w-full md:max-w-4xl mx-auto min-h-[600px] md:min-h-[900px]">
          <AccountSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <AccountContent activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      </div>
      <Footer />
    </div>
  )
}