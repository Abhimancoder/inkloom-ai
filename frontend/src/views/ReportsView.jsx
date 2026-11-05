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
  Award
} from 'lucide-react'
import { getReportsSummary, getContentChecks } from '../services/api'

export default function ReportsView() {
  const [reportData, setReportData] = useState(null)
  const [checks, setChecks] = useState([])
  const [selectedCheckId, setSelectedCheckId] = useState('')
  const [selectedCheck, setSelectedCheck] = useState(null)

  useEffect(() => {
    async function loadData() {
      const summary = await getReportsSummary()
      if (summary) setReportData(summary)

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
    const jsonBlob = new Blob([JSON.stringify({ reportData, selectedAudit: selectedCheck }, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(jsonBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Inkloom_Governance_Executive_Report_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#142B4A]">Governance & Compliance Reports</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate audit-ready reports that highlight issues, risk areas, and remediation recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Executive JSON</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Compliance Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#2E7D32]">
              {reportData?.summary?.complianceRate || 96}%
            </span>
            <span className="text-xs font-semibold text-green-700">Audit-Ready</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Across all tested promotional copy</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Audits Evaluated</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#142B4A]">
              {reportData?.summary?.totalAudits || checks.length}
            </span>
            <span className="text-xs text-gray-400">Campaign Drafts</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {reportData?.summary?.approvedCount || 2} Passed · {reportData?.summary?.pendingCount || 1} Needs Action
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurring Risk Areas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-[#C62828]">4</span>
            <span className="text-xs text-gray-400">Tracked Categories</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Superlatives, Unverified Claims, Colors, Margins</span>
        </div>
      </div>

      {/* Two Column Grid: Violation Categories & Channel Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Violation Categories (Slide 6 & 11) */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Recurring Violation Risk Breakdown</span>
          </h3>
          <div className="space-y-3">
            {(reportData?.violationCategories || [
              { name: 'Restricted Buzzwords & Superlatives ("cheap", "guarantee")', count: 2, risk: 'High' },
              { name: 'Unsupported Claims & Guarantees ("100% bug-free")', count: 2, risk: 'High' },
              { name: 'Visual Violations & Brand Palettes (Logo safe space)', count: 1, risk: 'Medium' },
              { name: 'Readability & Accessibility Gaps (Complex sentences)', count: 1, risk: 'Low' }
            ]).map((v, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-gray-800 block">{v.name}</span>
                  <span className="text-gray-400 text-[11px] mt-0.5 block">{v.count} occurrences flagged</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    v.risk === 'High'
                      ? 'bg-red-50 text-[#C62828] border border-red-200'
                      : v.risk === 'Medium'
                      ? 'bg-amber-50 text-[#B7791F] border border-amber-200'
                      : 'bg-blue-50 text-[#142B4A] border border-blue-200'
                  }`}
                >
                  {v.risk} Risk
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Compliance Health */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-2">
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#142B4A] text-xs font-bold border border-blue-200 mb-1">
              <Award className="w-3.5 h-3.5 text-[#176B59]" />
              <span>Official Compliance Audit Certificate</span>
            </div>
            <h3 className="text-lg font-bold text-[#142B4A]">
              Certificate of Brand Governance Adherence
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Select Audit:</span>
            <select
              value={selectedCheckId}
              onChange={(e) => handleSelectCheck(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none"
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
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 space-y-4 bg-[#F5F7FA]/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                  Audit Certificate #{selectedCheck._id || selectedCheck.id}
                </span>
                <h4 className="font-bold text-base text-[#142B4A]">{selectedCheck.title}</h4>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  selectedCheck.status === 'Approved'
                    ? 'bg-green-100 text-[#2E7D32]'
                    : 'bg-amber-100 text-[#B7791F]'
                }`}
              >
                Status: {selectedCheck.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Brand Profile</span>
                <span className="font-bold text-gray-800">{selectedCheck.brandProfileName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Channel</span>
                <span className="font-bold text-gray-800">{selectedCheck.channel}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Author</span>
                <span className="font-bold text-gray-800">{selectedCheck.submittedBy}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase text-[10px]">Governance Score</span>
                <span className="font-extrabold text-[#176B59] text-base">{selectedCheck.governanceScore || 92}/100</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-gray-200 text-xs font-mono text-gray-700 leading-relaxed">
              "{selectedCheck.draftText}"
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-200">
              <span>Verified deterministically by Inkloom Brand Engine v1.0</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
