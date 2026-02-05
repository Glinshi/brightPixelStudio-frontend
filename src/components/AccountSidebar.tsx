export default function AccountSidebar() {
  return (
    <div className="w-48 bg-white flex flex-col border-r-2 border-gray-400">
      <div className="flex-1">
        <div className="w-full text-left px-6 py-4 text-sm transition-colors text-gray-700 bg-[rgba(152,122,31,0.49)]">
          Profile
        </div>
        <div className="w-full text-left px-6 py-4 text-sm transition-colors italic text-gray-700 bg-[rgba(152,122,31,0.49)]">
          My workshops
        </div>
        <div className="w-full text-left px-6 py-4 text-sm transition-colors text-gray-700 bg-[rgba(152,122,31,0.49)]">
          My orders
        </div>
        <div className="w-full text-left px-6 py-4 text-sm transition-colors italic text-gray-700 bg-[rgba(152,122,31,0.49)]">
          Settings
        </div>
      </div>
            <div className="mt-auto rounded-bl-3xl bg-[rgba(255,26,26,0.2)]">
        <div className="w-full text-left px-6 py-5 text-lg font-black transition-all hover:opacity-90" style={{ color: "rgba(0, 0, 0, 0.8)" }}>
          Logout
        </div>
      </div>
    </div>
  );
}