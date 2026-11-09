import React from 'react'
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Search,
  CheckSquare,
  History,
  BarChart3,
  Settings,
  Globe,
  ShieldCheck,
  BookmarkCheck
} from 'lucide-react'

export default function Sidebar({ currentView, setCurrentView, pendingReviewCount = 2 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-check', label: 'New Content Check', icon: PlusCircle },
    { id: 'brand-guidelines', label: 'Brand Guidelines', icon: BookOpen },
    { id: 'approved-copy', label: 'Approved Copy', icon: BookmarkCheck },
    { id: 'findings', label: 'Findings', icon: Search, badge: '2 Issues' },
    { id: 'review-queue', label: 'Review Queue', icon: CheckSquare, badgeCount: pendingReviewCount },
    { id: 'history', label: 'History & Logs', icon: History },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-[#142B4A] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-lg select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#176B59] flex items-center justify-center font-bold text-lg shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-tight">Inkloom AI</span>
              <span className="text-[11px] text-white/60 tracking-wider uppercase">Studio Governance</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left group cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-white border-l-4 border-[#176B59] shadow-inner font-semibold pl-2.5'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#176B59]' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C62828] text-white">
                    {item.badge}
                  </span>
                )}

                {item.badgeCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B7791F] text-white">
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
          onClick={() => setCurrentView('landing')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>View Public Landing Page</span>
        </button>
        <p className="text-[10px] text-center text-white/40 mt-3">
          Inkloom AI Studio · v3.0 Multi-Modal
        </p>
      </div>
    </aside>
  )
}
