import {
  FileText,
  AlertOctagon,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react'

export default function DashboardView({
  checks,
  onNavigate,
  onSelectCheck
}) {
  const totalChecks = checks.length
  const issuesFound = checks.filter((c) => c.statusType === 'critical').length
  const pendingReview = checks.filter((c) => c.statusType === 'warning' || c.status === 'Pending Review').length
  const approved = checks.filter((c) => c.statusType === 'passed' || c.status === 'Approved').length

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto w-full min-w-0">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#142B4A]">
            Intelligent Brand Governance Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Deterministic rule engine active. Review drafts against locked brand guidelines before publishing.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('new-check')}
            className="inline-flex items-center gap-2 bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <span>+ New Content Check</span>
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards (Responsive 1-col on mobile, 2-col on tablet, 4-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Recorded Checks */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recorded Checks</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] mt-1">{totalChecks}</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 inline-flex items-center gap-1">
              <span>Live</span> audit history
            </span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 text-[#142B4A] flex items-center justify-center shrink-0">
            <FileText className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        {/* Issues Found */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#C62828] uppercase tracking-wider">Issues Found</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#C62828] mt-1">{issuesFound}</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 inline-flex items-center gap-1">
              <span>{pendingReview}</span> awaiting review
            </span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">Approved</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2E7D32] mt-1">{approved}</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 inline-flex items-center gap-1">
              <span>Ready</span> for publication
            </span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-green-50 text-[#2E7D32] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        {/* Assets Monitored */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assets Monitored</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] mt-1">124</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Live across 4 channels</span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-emerald-50 text-[#176B59] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Compliance Status Gauge & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Compliance Status Gauge */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] uppercase tracking-wider">Compliance Status</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-[#2E7D32] font-semibold border border-green-200">
                Healthy
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 sm:py-4">
              <div className="relative w-32 sm:w-36 h-32 sm:h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#176B59"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="10.05"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#142B4A]">96%</span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Compliant</span>
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

        {/* Live Governance Activity Stream */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Real-Time Audit Activity Feed</span>
            </h3>
            <span className="text-xs text-[#176B59] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                time: '2m ago',
                channel: 'Display Ad (peltz.jpg)',
                user: 'Agency Lead',
                event: 'Audit Passed: Color palette and logo safe zone verified (WCAG AA).',
                status: 'Passed',
                statusColor: 'text-[#2E7D32] bg-green-50 border-green-200'
              },
              {
                time: '14m ago',
                channel: 'Email Marketing',
                user: 'Sarah M.',
                event: 'Restricted buzzword "cheap rates" flagged with context suggestion.',
                status: 'Action Required',
                statusColor: 'text-[#C62828] bg-red-50 border-red-200'
              },
              {
                time: '42m ago',
                channel: 'Landing Page',
                user: 'Dev Team',
                event: 'Unverified claim "guaranteed to eliminate 100% of errors" detected.',
                status: 'Warning',
                statusColor: 'text-[#B7791F] bg-amber-50 border-amber-200'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-3 sm:p-3.5 rounded-lg bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{item.channel}</span>
                    <span className="text-gray-400">· {item.user}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{item.event}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <span className="text-gray-400 text-[10px]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Audits Table with Touch Scrolling */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#142B4A]">Recent Content Checks</h3>
            <p className="text-xs text-gray-500">Real-time history of audited marketing drafts</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-[#176B59] hover:text-[#142B4A] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scroll hint on mobile */}
        <div className="sm:hidden px-4 py-1.5 bg-gray-50 text-[10px] text-gray-400 flex items-center justify-between border-b border-gray-100">
          <span>Swipe horizontally to view full table</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[580px]">
            <thead className="bg-[#F5F7FA] text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3">Content Title</th>
                <th className="px-3 sm:px-6 py-3">Brand Profile</th>
                <th className="px-3 sm:px-6 py-3">Channel</th>
                <th className="px-3 sm:px-6 py-3">Issues Status</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
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
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                      <div className="font-semibold text-[#202833] text-xs sm:text-sm">{check.title}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Submitted by {check.submittedBy}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3.5 sm:py-4 text-gray-600 font-medium text-xs sm:text-sm">
                      {check.brandProfileName}
                    </td>
                    <td className="px-3 sm:px-6 py-3.5 sm:py-4 text-gray-500 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 font-medium text-gray-600 text-[11px]">
                        {check.channel}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3.5 sm:py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeDot}`}></span>
                        {check.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 text-right">
                      <button
                        onClick={() => {
                          onSelectCheck(check)
                          onNavigate('findings')
                        }}
                        className="text-xs font-semibold text-[#142B4A] hover:text-[#176B59] bg-gray-100 hover:bg-gray-200 px-2.5 sm:px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                      >
                        View Findings
                      </button>
                    </td>
                  </tr>
                )
              })}

              {checks.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-xs">
                    No content checks recorded yet. Click <span className="font-semibold text-[#142B4A]">"New Check"</span> above to audit your first marketing draft.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
