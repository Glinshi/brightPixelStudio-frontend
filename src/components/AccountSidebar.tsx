
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

type AccountSection = 'profile' | 'workshops' | 'orders' | 'settings';

interface AccountSidebarProps {
  activeSection: AccountSection;
  setActiveSection: (section: AccountSection) => void;
}

export default function AccountSidebar({ activeSection, setActiveSection }: AccountSidebarProps) {
  const { logout } = useApp();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/signin');
  }

  return (
    <div className="w-full md:w-48 bg-white flex flex-row md:flex-col border-b-2 md:border-b-0 md:border-r-2 border-gray-400">
      <div className="flex flex-row md:flex-col w-full">
        <button
          onClick={() => setActiveSection('profile')}
          className={`w-full text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm transition-colors ${activeSection === 'profile' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700 bg-[rgba(152,122,31,0.55)]'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSection('workshops')}
          className={`w-full text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm transition-colors italic ${activeSection === 'workshops' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700 bg-[rgba(152,122,31,0.55)]'}`}
        >
          My workshops
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          className={`w-full text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm transition-colors ${activeSection === 'orders' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700  bg-[rgba(152,122,31,0.55)]'}`}
        >
          My orders
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm transition-colors italic ${activeSection === 'settings' ? 'text-gray-800 font-medium bg-[rgba(152,122,31,0.49)]' : 'text-gray-700 bg-[rgba(152,122,31,0.55)]'}`}
        >
          Settings
        </button>
      </div>
      <div className="mt-0 md:mt-auto rounded-bl-none md:rounded-bl-3xl bg-[rgba(255,26,26,0.2)] w-full">
        <button onClick={onLogout} className="w-full">
          <div className="w-full text-left px-4 md:px-6 py-4 md:py-5 text-xs md:text-lg font-black transition-all hover:opacity-90 text-[rgba(0,0,0,0.8)]">
            Logout
          </div>
        </button>
      </div>
    </div>
  )
}