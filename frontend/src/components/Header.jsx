import React from 'react'
import { Bell, Search, UserCheck } from 'lucide-react'

export default function Header({ title, subtitle, onNewCheckClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Title & Path */}
      <div>
        <h1 className="text-xl font-bold text-[#142B4A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {onNewCheckClick && (
          <button
            onClick={onNewCheckClick}
            className="hidden sm:inline-flex items-center gap-2 bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <span>+ New Content Check</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 text-gray-500 hover:text-[#142B4A] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            A
          </div>
          <div className="text-left hidden md:block">
            <span className="text-xs font-semibold text-[#202833] block leading-tight">Abhiman</span>
            <span className="text-[10px] text-gray-400 block">Product & UI/UX Lead</span>
          </div>
        </div>
      </div>
    </header>
  )
}
