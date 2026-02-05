import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AccountSidebar from '../components/AccountSidebar'
import AccountContent from '../components/AccountContent'

type AccountSection = 'profile' | 'workshops' | 'orders' | 'settings'

export default function Account() {
  const [activeSection, setActiveSection] = useState<AccountSection>('profile')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-semibold text-gray-900">Account</h1>
        <div className="flex rounded-3xl overflow-hidden bg-white shadow-sm border-2 border-gray-400 max-w-4xl mx-auto min-h-[900px]">
          <AccountSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <AccountContent activeSection={activeSection} />
        </div>
      </div>
      <Footer />
    </div>
  )
}