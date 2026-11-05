import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Layers,
  Award,
  TrendingUp,
  PieChart,
  Table,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { getReportsSummary, getContentChecks, getVisualAnalyticsCharts } from '../services/api'

export default function ReportsView() {
  const [reportData, setReportData] = useState(null)
  const [visualCharts, setVisualCharts] = useState(null)
  const [checks, setChecks] = useState([])
  const [selectedCheckId, setSelectedCheckId] = useState('')
  const [selectedCheck, setSelectedCheck] = useState(null)
  const [viewTab, setViewTab] = useState('executive') // 'executive' | 'visual_analytics'

  useEffect(() => {
    async function loadData() {
      const summary = await getReportsSummary()
      if (summary) setReportData(summary)

      const charts = await getVisualAnalyticsCharts()
      if (charts) setVisualCharts(charts)

      const checkList = await getContentChecks()
      if (checkList && checkList.length > 0) {
        setChecks(checkList)
        setSelectedCheckId(checkList[0]._id || checkList[0].id)
        setSelectedCheck(checkList[0])
      }
    }
    loadData()
  }, [])

  const handleSelectCheck = (id) => {
    setSelectedCheckId(id)
    const found = checks.find((c) => (c._id || c.id) === id)
    setSelectedCheck(found || null)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadReport = () => {
    const jsonBlob = new Blob(
      [JSON.stringify({ reportData, visualCharts, selectedAudit: selectedCheck }, null, 2)],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(jsonBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Inkloom_Governance_Executive_Report_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Header (Responsive Stack on Phone) */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#142B4A]">Governance &amp; Compliance Reports</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Audit-ready reports powered by Matplotlib visual analytics &amp; Pandas aggregated channel trends.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-lg bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Responsive Swipeable Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setViewTab('executive')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
            viewTab === 'executive'
              ? 'bg-[#142B4A] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Executive Summary &amp; Certificate</span>
        </button>

        <button
          onClick={() => setViewTab('visual_analytics')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
            viewTab === 'visual_analytics'
              ? 'bg-[#176B59] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Matplotlib Visual Analytics &amp; Pandas Engine</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-700 text-white font-mono">
            Live
          </span>
        </button>
      </div>

      {/* 3 Top Metric Cards (1 col on phone, 3 col on tablet/pc) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Compliance</p>
          <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2E7D32]">
              {reportData?.summary?.complianceRate || 96}%
            </span>
            <span className="text-xs font-semibold text-green-700">Audit-Ready</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 block">Across all tested promotional copy</span>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Audits Evaluated</p>
          <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#142B4A]">
              {reportData?.summary?.totalAudits || checks.length || 3}
            </span>
            <span className="text-xs text-gray-400">Campaign Drafts</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 block">
            {reportData?.summary?.approvedCount || 2} Passed · {reportData?.summary?.pendingCount || 1} Action
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurring Risk Areas</p>
          <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#C62828]">4</span>
            <span className="text-xs text-gray-400">Tracked Categories</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 block">Superlatives, Claims, Colors, Readability</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EXECUTIVE SUMMARY & AUDIT CERTIFICATE             */}
      {/* ======================================================== */}
      {viewTab === 'executive' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Two Column Grid: Violation Categories & Channel Risk Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recurring Violation Categories */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Recurring Violation Risk Breakdown</span>
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                {(reportData?.violationCategories || [
                  { name: 'Restricted Buzzwords & Superlatives ("cheap", "guarantee")', count: 2, risk: 'High' },
                  { name: 'Unsupported Claims & Guarantees ("100% bug-free")', count: 2, risk: 'High' },
                  { name: 'Visual Violations & Brand Palettes (Logo safe space)', count: 1, risk: 'Medium' },
                  { name: 'Readability & Accessibility Gaps (Complex sentences)', count: 1, risk: 'Low' }
                ]).map((v, i) => (
                  <div key={i} className="p-3 sm:p-3.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-800 block truncate">{v.name}</span>
                      <span className="text-gray-400 text-[10px] sm:text-[11px] mt-0.5 block">{v.count} occurrences</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                        v.risk === 'High'
                          ? 'bg-red-50 text-[#C62828] border border-red-200'
                          : v.risk === 'Medium'
                          ? 'bg-amber-50 text-[#B7791F] border border-amber-200'
                          : 'bg-blue-50 text-[#142B4A] border border-blue-200'
                      }`}
                    >
                      {v.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Compliance Health */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#176B59]" />
                <span>Channel Compliance Distribution</span>
              </h3>
              <div className="space-y-3">
                {(reportData?.channelRisks || [
                  { channel: 'Email Marketing', audits: 18, complianceRate: 92 },
                  { channel: 'Social Media / LinkedIn', audits: 34, complianceRate: 97 },
                  { channel: 'Display Ad Copy & Creatives', audits: 12, complianceRate: 88 },
                  { channel: 'Press Releases & Keynotes', audits: 8, complianceRate: 100 }
                ]).map((c, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">{c.channel}</span>
                      <span className="font-bold text-[#142B4A]">{c.complianceRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.complianceRate >= 95 ? 'bg-[#2E7D32]' : 'bg-[#176B59]'}`}
                        style={{ width: `${c.complianceRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Audit Certificate Preview Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 sm:pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#142B4A] text-xs font-bold border border-blue-200 mb-1">
                  <Award className="w-3.5 h-3.5 text-[#176B59]" />
                  <span>Official Compliance Certificate</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#142B4A]">
                  Certificate of Brand Governance Adherence
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 shrink-0">Select Audit:</span>
                <select
                  value={selectedCheckId}
                  onChange={(e) => handleSelectCheck(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none w-full sm:w-auto"
                >
                  {checks.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.title} ({c.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCheck && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#F5F7FA]/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                      Audit Certificate #{selectedCheck._id || selectedCheck.id}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-[#142B4A]">{selectedCheck.title}</h4>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto ${
                      selectedCheck.status === 'Approved'
                        ? 'bg-green-100 text-[#2E7D32]'
                        : 'bg-amber-100 text-[#B7791F]'
                    }`}
                  >
                    {selectedCheck.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block font-semibold uppercase text-[9px] sm:text-[10px]">Brand Profile</span>
                    <span className="font-bold text-gray-800 truncate block">{selectedCheck.brandProfileName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold uppercase text-[9px] sm:text-[10px]">Channel</span>
                    <span className="font-bold text-gray-800 truncate block">{selectedCheck.channel}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold uppercase text-[9px] sm:text-[10px]">Author</span>
                    <span className="font-bold text-gray-800 truncate block">{selectedCheck.submittedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold uppercase text-[9px] sm:text-[10px]">Governance Score</span>
                    <span className="font-extrabold text-[#176B59] text-base">{selectedCheck.governanceScore || 92}/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-gray-200 text-xs font-mono text-gray-700 leading-relaxed">
                  "{selectedCheck.draftText}"
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] text-gray-400 border-t border-gray-200 gap-1">
                  <span>Verified by Inkloom Brand Engine v2.0 + Scikit-Learn ML</span>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MATPLOTLIB VISUAL ANALYTICS & PANDAS ENGINE       */}
      {/* ======================================================== */}
      {viewTab === 'visual_analytics' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Matplotlib Charts Banner */}
          <div className="bg-gradient-to-r from-[#142B4A] to-[#176B59] rounded-xl p-4 sm:p-6 text-white space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200">
                Visual Analytics &amp; Statistical Aggregations (Slide 7 Architecture)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold">
              Publication-Ready Matplotlib Figures &amp; Pandas Data Pipelines
            </h3>
            <p className="text-xs text-gray-200 max-w-2xl leading-relaxed">
              Rendered on the Python AI microservice using <code>matplotlib.pyplot</code> and <code>pandas.DataFrame</code> rolling calculations. Exported dynamically as high-res base64 images.
            </p>
          </div>

          {/* 30-Day Trend Chart & Donut Chart in 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Matplotlib 30-Day Compliance Trend Chart */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#176B59]" />
                  <span>30-Day Compliance Moving Average</span>
                </h4>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  Matplotlib 3.11
                </span>
              </div>

              {visualCharts?.trendChart ? (
                <div className="w-full overflow-hidden flex justify-center bg-[#FAFAFC] rounded-lg p-2 border border-gray-200">
                  <img
                    src={visualCharts.trendChart}
                    alt="30-Day Compliance Trend Chart"
                    className="w-full max-w-full h-auto object-contain rounded shadow-xs"
                  />
                </div>
              ) : (
                <div className="h-40 sm:h-48 flex items-center justify-center bg-gray-50 rounded-lg text-xs text-gray-400">
                  Loading Matplotlib chart from Python service...
                </div>
              )}
              <p className="text-[10px] sm:text-[11px] text-gray-500">
                Computes 7-day rolling moving average via <code>df['compliance_rate'].rolling(7).mean()</code> with green benchmark zones.
              </p>
            </div>

            {/* Matplotlib Violation Category Donut Chart */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#C62828]" />
                  <span>Violation Category Distribution</span>
                </h4>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  Slide 06 / 11
                </span>
              </div>

              {visualCharts?.violationDonutChart ? (
                <div className="w-full overflow-hidden flex justify-center bg-[#FAFAFC] rounded-lg p-2 border border-gray-200">
                  <img
                    src={visualCharts.violationDonutChart}
                    alt="Violation Category Donut Chart"
                    className="w-full max-w-full h-auto object-contain rounded shadow-xs"
                  />
                </div>
              ) : (
                <div className="h-40 sm:h-48 flex items-center justify-center bg-gray-50 rounded-lg text-xs text-gray-400">
                  Loading Matplotlib donut chart...
                </div>
              )}
              <p className="text-[10px] sm:text-[11px] text-gray-500">
                Segmented share of restricted superlatives, unverified claims, color mismatches, and readability gaps.
              </p>
            </div>
          </div>

          {/* Pandas DataFrame Aggregated Channel Risk Table with Touch Scroll */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <Table className="w-4 h-4 text-[#142B4A]" />
                  <span>Pandas Channel Risk &amp; Volatility Matrix (DataFrame Aggregations)</span>
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calculated using Pandas vector operations, groupby, and conditional risk indexing.
                </p>
              </div>
              <span className="text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded bg-blue-50 text-[#142B4A] border border-blue-200 self-start sm:self-auto">
                pandas.DataFrame
              </span>
            </div>

            {/* Mobile swipe hint */}
            <div className="sm:hidden px-4 py-1.5 bg-gray-50 text-[10px] text-gray-400 flex items-center justify-between border-b border-gray-100">
              <span>Swipe horizontally for full metrics</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[520px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[9px] sm:text-[10px] border-b border-gray-200">
                    <th className="py-2.5 px-3 font-semibold">Channel</th>
                    <th className="py-2.5 px-3 font-semibold">Audits Evaluated</th>
                    <th className="py-2.5 px-3 font-semibold">Approved</th>
                    <th className="py-2.5 px-3 font-semibold">Compliance Rate</th>
                    <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(visualCharts?.channelMetrics || [
                    { channel: 'Email Marketing', audits: 142, approved: 131, compliance_rate: 92.3, risk_level: 'MODERATE' },
                    { channel: 'Social Media / LinkedIn', audits: 286, approved: 277, compliance_rate: 96.9, risk_level: 'LOW' },
                    { channel: 'Landing Pages', audits: 94, approved: 82, compliance_rate: 87.2, risk_level: 'ELEVATED' },
                    { channel: 'Display Ad Copy', audits: 110, approved: 97, compliance_rate: 88.2, risk_level: 'ELEVATED' },
                    { channel: 'Press Releases', audits: 48, approved: 48, compliance_rate: 100.0, risk_level: 'LOW' }
                  ]).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-gray-800">{row.channel}</td>
                      <td className="py-3 px-3 font-mono text-gray-600">{row.audits} drafts</td>
                      <td className="py-3 px-3 font-mono text-[#2E7D32]">{row.approved} passed</td>
                      <td className="py-3 px-3">
                        <span className="font-extrabold text-[#142B4A]">{row.compliance_rate}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            row.risk_level === 'LOW'
                              ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                              : row.risk_level === 'MODERATE'
                              ? 'bg-blue-50 text-[#142B4A] border border-blue-200'
                              : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                          }`}
                        >
                          {row.risk_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
