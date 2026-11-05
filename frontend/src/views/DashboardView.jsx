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

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Checks */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Checks</p>
            <p className="text-3xl font-extrabold text-[#142B4A] mt-1">{totalChecks}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Live saved audits</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#142B4A] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Issues Found */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#C62828] uppercase tracking-wider">Issues Found</p>
            <p className="text-3xl font-extrabold text-[#C62828] mt-1">{issuesFound}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Critical violations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#B7791F] uppercase tracking-wider">Pending Review</p>
            <p className="text-3xl font-extrabold text-[#B7791F] mt-1">{pendingReview}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Awaiting human sign-off</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#B7791F] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Approved */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">Approved</p>
            <p className="text-3xl font-extrabold text-[#2E7D32] mt-1">{approved}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Compliant drafts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-[#2E7D32] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
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
