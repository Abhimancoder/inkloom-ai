import { useState, useEffect } from 'react'
import {
  Database,
  Users,
  Shield,
  RefreshCw
} from 'lucide-react'
import { checkBackendHealth } from '../services/api'

export default function SettingsView() {
  const [health, setHealth] = useState(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    const res = await checkBackendHealth()
    setHealth(res)
    setIsChecking(false)
  }

  useEffect(() => {
    let isCurrent = true

    async function loadInitialHealth() {
      const result = await checkBackendHealth()
      if (isCurrent) setHealth(result)
    }

    void loadInitialHealth()
    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Top Banner (Responsive Stack on Phone) */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#142B4A]">Platform Settings &amp; Roles</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Enterprise role configuration, live database diagnostics, and governance safety policies.
          </p>
        </div>
        <button
          onClick={checkHealth}
          disabled={isChecking}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>Ping Database</span>
        </button>
      </div>

      {/* Database Diagnostics Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-[#2E7D32] flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#142B4A]">MongoDB Persistence Engine</h3>
              <p className="text-[11px] text-gray-400">Database connection diagnostics</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border self-start sm:self-auto ${
              health?.database?.connected
                ? 'bg-green-50 text-[#2E7D32] border-green-200'
                : 'bg-amber-50 text-[#B7791F] border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                health?.database?.connected ? 'bg-green-500' : 'bg-amber-500'
              }`}
            ></span>
            {health?.database?.connected ? 'MongoDB Live Connected' : 'Local Cache / Offline'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
          <div className="p-3 sm:p-3.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block uppercase text-[10px] font-semibold">Service</span>
            <span className="font-bold text-gray-800 font-mono mt-0.5 block truncate">
              {health?.service || 'inkloom-backend'}
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block uppercase text-[10px] font-semibold">Port &amp; Host</span>
            <span className="font-bold text-gray-800 font-mono mt-0.5 block truncate">
              localhost:5000 (MongoDB 27017)
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block uppercase text-[10px] font-semibold">Database Name</span>
            <span className="font-bold text-[#176B59] font-mono mt-0.5 block">inkloom</span>
          </div>
        </div>
      </div>

      {/* Role-Based Governance Workflows (Slide 3 & 8) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#142B4A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#176B59]" />
            <span>Enterprise Roles &amp; Responsibilities (Slide 3)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Governance permissions configured for cross-functional stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-[#F5F7FA]/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-[#142B4A]">Brand Managers</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#142B4A]">Admin</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Define locked brand guidelines, approve corporate color palettes, maintain tone profiles, and manage audit rule thresholds.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-[#F5F7FA]/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-[#142B4A]">Marketing Teams</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#176B59]">Creator</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Submit drafts, inspect ad copy &amp; visual assets, accept replacement suggestions with one click, and send to review queue.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-[#F5F7FA]/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-[#142B4A]">Compliance Officers</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Approver</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ensure ongoing brand adherence, monitor continuous channel scanning feeds, flag regulatory issues, and verify certifications.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-[#F5F7FA]/70 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-[#142B4A]">Legal Teams</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#C62828]">Sign-Off Gate</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Review unverified claims, ensure disclaimers accompany promotional copy, sign off on critical risks, and prevent liability.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Honesty Principles */}
      <div className="bg-[#142B4A] rounded-xl p-4 sm:p-6 text-white space-y-2.5 sm:space-y-3">
        <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#176B59]" />
          <span>Safety &amp; Honest AI Principles</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs text-white/80">
          <div>
            <span className="font-bold text-white block mb-0.5">✓ Evidence Before Claims</span>
            Every flagged violation highlights the exact matched surrounding excerpt and cited guideline.
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">✓ Deterministic Baseline First</span>
            Restricted phrases are validated with 100% deterministic certainty without relying on black-box guessing.
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">✓ Human-in-the-Loop</span>
            No silent auto-publishing. A human reviewer retains final authority to approve or request changes.
          </div>
          <div>
            <span className="font-bold text-white block mb-0.5">✓ Zero Secret Leaks</span>
            Database credentials and secrets are kept exclusively in isolated server environment files.
          </div>
        </div>
      </div>
    </div>
  )
}
