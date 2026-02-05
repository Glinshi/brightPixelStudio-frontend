type AccountSection = 'profile' | 'workshops' | 'orders' | 'settings'

interface AccountSidebarProps {
  activeSection: AccountSection
  setActiveSection: (section: AccountSection) => void
  onLogout?: () => void
}

export default function AccountSidebar({ activeSection, setActiveSection, onLogout }: AccountSidebarProps) {
  return (
    <div className="w-48 bg-white flex flex-col border-r-2 border-gray-400">
      <div className="flex-1">
        <button
          onClick={() => setActiveSection('profile')}
          className={`w-full text-left px-6 py-4 text-sm transition-colors ${activeSection === 'profile' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700 bg-[rgba(152,122,31,0.55)]'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSection('workshops')}
          className={`w-full text-left px-6 py-4 text-sm transition-colors italic ${activeSection === 'workshops' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700 bg-[rgba(152,122,31,0.55)]'}`}
        >
          My workshops
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          className={`w-full text-left px-6 py-4 text-sm transition-colors ${activeSection === 'orders' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700  bg-[rgba(152,122,31,0.55)]'}`}
        >
          My orders
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full text-left px-6 py-4 text-sm transition-colors italic ${activeSection === 'settings' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700 bg-[rgba(152,122,31,0.55)]'}`}
        >
          Settings
        </button>
      </div>
      
      <div className="mt-auto rounded-bl-3xl bg-[rgba(255,26,26,0.2)]">
        <button onClick={onLogout}>
          <div className="w-full text-left px-6 py-5 text-lg font-black transition-all hover:opacity-90 text-[rgba(0,0,0,0.8)]">
            Logout
          </div>
        </button>
      </div>
    </div>
  )
}