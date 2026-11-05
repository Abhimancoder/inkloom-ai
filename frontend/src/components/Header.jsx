import React from 'react'
import { Bell, Menu, PlusCircle, ShieldCheck } from 'lucide-react'

export default function Header({
  title,
  subtitle,
  onNewCheckClick,
  onToggleSidebar
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Hamburger & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile/Tablet Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 -ml-1 text-gray-600 hover:text-[#142B4A] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Logo for Mobile Top Bar */}
        <div className="w-7 h-7 rounded-md bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shrink-0 sm:hidden">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-[#142B4A] tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate hidden sm:block">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Action Button: Responsive icon on mobile, full label on sm+ */}
        {onNewCheckClick && (
          <button
            onClick={onNewCheckClick}
            className="inline-flex items-center gap-1.5 bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Create new content audit check"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ New Check</span>
            <span className="sm:hidden">Check</span>
          </button>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-1.5 sm:p-2 text-gray-500 hover:text-[#142B4A] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-[#C62828] rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-gray-200">
          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            A
          </div>
          <div className="text-left hidden md:block">
            <span className="text-xs font-semibold text-[#202833] block leading-tight">Abhiman</span>
            <span className="text-[10px] text-gray-400 block">Lead</span>
          </div>
        </div>
      </div>
    </header>
  )
}
