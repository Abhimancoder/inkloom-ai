import { useState } from 'react'

export default function App() {
  const [testCount, setTestCount] = useState(0)

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#202833] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🖊️</span>
          <h1 className="text-xl font-bold text-[#142B4A]">Inkloom AI</h1>
          <span className="text-xs bg-[#176B59] text-white px-2 py-0.5 rounded-full font-medium">
            Phase M1 Active
          </span>
        </div>
        <p className="text-sm text-gray-500">Intelligent Brand Governance Platform</p>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full p-8 flex-1">
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-[#142B4A] mb-2">
            🎨 Tailwind CSS & Inkloom Studio Theme Verified
          </h2>
          <p className="text-gray-600 mb-6">
            If this card is cleanly styled with white background, rounded borders, and crisp colors below,
            Tailwind CSS is functioning correctly!
          </p>

          {/* Theme Color Swatches */}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Locked Theme Palette
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-lg bg-[#142B4A] text-white">
              <p className="font-semibold text-sm">Primary Navy</p>
              <p className="text-xs opacity-75 font-mono">#142B4A</p>
            </div>
            <div className="p-4 rounded-lg bg-[#176B59] text-white">
              <p className="font-semibold text-sm">Brand Green</p>
              <p className="text-xs opacity-75 font-mono">#176B59</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F5F7FA] border border-gray-200 text-[#202833]">
              <p className="font-semibold text-sm">Page Background</p>
              <p className="text-xs text-gray-500 font-mono">#F5F7FA</p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-gray-200 text-[#202833]">
              <p className="font-semibold text-sm">Cards & Panels</p>
              <p className="text-xs text-gray-500 font-mono">#FFFFFF</p>
            </div>
          </div>

          {/* Status Color Badges */}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Audit Status Indicators
          </h3>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-[#C62828] border border-red-200">
              🔴 Critical Issue (#C62828)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B7791F] border border-amber-200">
              🟡 Warning / Needs Review (#B7791F)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-[#2E7D32] border border-green-200">
              🟢 Passed Check (#2E7D32)
            </span>
          </div>

          {/* Interactive Test Button */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setTestCount((c) => c + 1)}
              className="bg-[#142B4A] hover:bg-[#1a385f] text-white font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Interactive Test: Clicked {testCount} times
            </button>
            <span className="text-xs text-gray-400">Next step: Express Backend (/api/health)</span>
          </div>
        </div>
      </main>
    </div>
  )
}
