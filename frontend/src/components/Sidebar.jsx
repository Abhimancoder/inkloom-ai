import React from 'react'
import {
  LayoutDashboard,
  Activity,
  PlusCircle,
  BookOpen,
  Search,
  CheckSquare,
  History,
  BarChart3,
  Settings,
  Globe,
  ShieldCheck,
  X
} from 'lucide-react'

export default function Sidebar({
  currentView,
  setCurrentView,
  pendingReviewCount = 2,
  isOpen = false,
  onClose
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Continuous Monitoring', icon: Activity },
    { id: 'new-check', label: 'New Content Check', icon: PlusCircle },
    { id: 'brand-guidelines', label: 'Brand Guidelines', icon: BookOpen },
    { id: 'findings', label: 'Findings & Evidence', icon: Search, badge: '2 Issues' },
    { id: 'review-queue', label: 'Review Queue', icon: CheckSquare, badgeCount: pendingReviewCount },
    { id: 'reports', label: 'Governance Reports', icon: BarChart3 },
    { id: 'history', label: 'History & Logs', icon: History },
    { id: 'settings', label: 'Settings & Roles', icon: Settings },
  ]

  const handleNavClick = (id) => {
    setCurrentView(id)
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Responsive Sidebar (Drawer on < lg, Sticky on lg+) */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 lg:w-64 bg-[#142B4A] text-white flex flex-col justify-between shrink-0 h-screen shadow-2xl lg:shadow-lg select-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#176B59] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block leading-tight">Inkloom AI</span>
                <span className="text-[11px] text-white/60 tracking-wider uppercase">Studio Governance</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation Menu */}
          <nav className="p-3 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left group cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border-l-4 border-[#176B59] shadow-inner font-semibold pl-2.5'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 shrink-0 ${
                        isActive ? 'text-emerald-400' : 'text-white/60'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C62828] text-white shrink-0">
                      {item.badge}
                    </span>
                  )}

                  {item.badgeCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B7791F] text-white shrink-0">
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer Area: Switch to Public Landing Page */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Landing Page</span>
          </button>
          <p className="text-[10px] text-center text-white/40 mt-2.5">
            Inkloom AI · Responsive Multi-Screen
          </p>
        </div>
      </aside>
    </>
  )
}
