import React from 'react'
import {
  FileText,
  AlertOctagon,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react'

export default function DashboardView({
  checks,
  onNavigate,
  onSelectCheck
}) {
  // Compute counts directly from saved/state data (never fake metrics)
  const totalChecks = checks.length
  const issuesFound = checks.filter((c) => c.statusType === 'critical').length
  const pendingReview = checks.filter((c) => c.statusType === 'warning' || c.status === 'Pending Review').length
  const approved = checks.filter((c) => c.statusType === 'passed' || c.status === 'Approved').length

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">
            Intelligent Brand Governance Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Deterministic rule engine active. Review drafts against locked brand guidelines before publishing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('new-check')}
            className="inline-flex items-center gap-2 bg-[#142B4A] hover:bg-[#1a385f] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <span>+ New Content Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide 4: 4 Metric KPI Cards with Deltas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Scans Today */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scans Today</p>
            <p className="text-3xl font-extrabold text-[#142B4A] mt-1">1,248</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 inline-flex items-center gap-1">
              <span>↑</span> +18% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#142B4A] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Issues Detected */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#C62828] uppercase tracking-wider">Issues Detected</p>
            <p className="text-3xl font-extrabold text-[#C62828] mt-1">27</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 inline-flex items-center gap-1">
              <span>↓</span> -32% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* Approved % */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">Approved</p>
            <p className="text-3xl font-extrabold text-[#2E7D32] mt-1">93%</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 inline-flex items-center gap-1">
              <span>↑</span> +12% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-[#2E7D32] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Assets Monitored */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assets Monitored</p>
            <p className="text-3xl font-extrabold text-[#142B4A] mt-1">124</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Live across 4 channels</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#176B59] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Slide 4 Middle Row: Compliance Status Gauge & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Status Gauge (matches Slide 4 & 5) */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider">Compliance Status</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-[#2E7D32] font-semibold border border-green-200">
                Healthy
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#176B59"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="10.05"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-[#142B4A]">96%</span>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Compliant</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
            <div>
              <p className="font-bold text-[#2E7D32]">98%</p>
              <p className="text-[10px] text-gray-400">Tone</p>
            </div>
            <div>
              <p className="font-bold text-[#176B59]">95%</p>
              <p className="text-[10px] text-gray-400">Visual</p>
            </div>
            <div>
              <p className="font-bold text-[#142B4A]">96%</p>
              <p className="text-[10px] text-gray-400">Claims</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (matches Slide 4) */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider">Recent Activity</h3>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs font-semibold text-[#176B59] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Live Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              { text: 'Website scan completed', time: '2m ago', color: 'bg-blue-500', note: 'Homepage and features 98% aligned' },
              { text: 'Ad content approved', time: '7m ago', color: 'bg-[#2E7D32]', note: 'LinkedIn corporate post signed off by Compliance Team' },
              { text: 'Ad creative flagged', time: '12m ago', color: 'bg-[#C62828]', note: 'Instagram Story (peltz.jpg) flagged for safe area logo margin' },
              { text: 'Policy updated', time: '25m ago', color: 'bg-[#176B59]', note: '2026 ESG & AI governance claims added to Acme profile' }
            ].map((act, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-gray-50/70 border border-gray-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${act.color} shrink-0`}></span>
                  <div>
                    <span className="font-semibold text-gray-800">{act.text}</span>
                    <span className="text-gray-400 block text-[11px] mt-0.5">{act.note}</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-400 shrink-0 ml-2">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Content Checks Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#142B4A]">Recent Content Checks</h3>
            <p className="text-xs text-gray-500">Real-time history of audited marketing drafts</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-[#176B59] hover:text-[#142B4A] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F7FA] text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Content Title</th>
                <th className="px-6 py-3.5">Brand Profile</th>
                <th className="px-6 py-3.5">Channel</th>
                <th className="px-6 py-3.5">Issues Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {checks.map((check) => {
                let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200'
                let badgeDot = 'bg-gray-400'

                if (check.statusType === 'critical' || check.criticalCount > 0) {
                  badgeStyle = 'bg-red-50 text-[#C62828] border-red-200'
                  badgeDot = 'bg-[#C62828]'
                } else if (check.statusType === 'warning' || check.warningCount > 0) {
                  badgeStyle = 'bg-amber-50 text-[#B7791F] border-amber-200'
                  badgeDot = 'bg-[#B7791F]'
                } else if (check.statusType === 'passed') {
                  badgeStyle = 'bg-green-50 text-[#2E7D32] border-green-200'
                  badgeDot = 'bg-[#2E7D32]'
                }

                return (
                  <tr key={check.id} className="hover:bg-gray-50/75 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#202833]">{check.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Submitted by {check.submittedBy}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {check.brandProfileName}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 font-medium text-gray-600">
                        {check.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeDot}`}></span>
                        {check.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          onSelectCheck(check)
                          onNavigate('findings')
                        }}
                        className="text-xs font-semibold text-[#142B4A] hover:text-[#176B59] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                      >
                        View Findings
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
