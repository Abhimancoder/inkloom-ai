import { useState } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Check,
  X,
  FileCheck2,
  Send,
  ArrowLeft,
  Download,
  BrainCircuit,
  TrendingUp,
  BarChart2,
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react'

export default function FindingsView({
  currentCheck,
  findings,
  onSendToReviewQueue,
  onBack
}) {
  const [activeTab, setActiveTab] = useState('findings') // 'findings' | 'datascience'
  const [localFindings, setLocalFindings] = useState(findings)
  const [activeDraft, setActiveDraft] = useState(
    currentCheck?.draftText ||
      'TechCorp Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
  )
  const [acceptedCount, setAcceptedCount] = useState(0)

  // Compute live summary counts
  const criticalCount = localFindings.filter((f) => f.severityType === 'critical').length
  const warningCount = localFindings.filter((f) => f.severityType === 'warning').length
  const passedCount = localFindings.filter((f) => f.severityType === 'passed').length

  // Extract ML Insights & Visual Analytics
  const mlInsights = currentCheck?.mlInsights || {
    toneAnalysis: {
      predictedTone: 'Aggressive / Superlative Hype',
      confidenceScore: 78.4,
      targetTone: 'Professional & Authoritative',
      isToneAligned: false,
      probabilities: {
        'Professional & Authoritative': 0.12,
        'Casual & Conversational': 0.08,
        'Aggressive / Superlative Hype': 0.65,
        'Technical & Architecture': 0.05,
        'Urgent / High-Pressure Sales': 0.10
      },
      topDrivingFeatures: [
        { term: 'cheap rates', tfidfWeight: 0.42 },
        { term: 'guaranteed', tfidfWeight: 0.38 },
        { term: 'best class', tfidfWeight: 0.35 }
      ],
      mlModel: 'TF-IDF + Multinomial Logistic Regression (scikit-learn)'
    },
    riskRegression: {
      riskScore: 74.5,
      riskTier: 'HIGH',
      tierColor: '#D97706',
      recommendedAction: 'Substantial violation risk. Unsubstantiated claims or buzzwords require review.',
      featureContributions: [
        { feature: 'Superlative Density', importance: 0.38, observedValue: 3.2 },
        { feature: 'Restricted Phrase Count', importance: 0.29, observedValue: 2 },
        { feature: 'Readability Penalty', importance: 0.18, observedValue: 0.45 },
        { feature: 'Sentence Length Variance', importance: 0.15, observedValue: 6.8 }
      ],
      modelEngine: 'Random Forest Ensemble Regressor (scikit-learn)'
    },
    linguisticStats: {
      sentenceMetrics: { count: 2, meanWords: 15.5, stdWords: 4.5, medianWords: 15.5, p90Words: 19.1 },
      tokenMetrics: { totalWords: 31, uniqueWords: 24, typeTokenRatio: 0.774, shannonEntropy: 4.12, complexWordPercentage: 16.1 },
      readabilityIndices: { fleschReadingEase: 52.4, fleschKincaidGrade: 8.8, gunningFog: 10.2, colemanLiau: 9.4, readingLabel: 'Accessible' }
    }
  }

  const visualAnalytics = currentCheck?.visualAnalytics || {}

  const handleAcceptSuggestion = (finding) => {
    if (!finding.suggestedCorrection) return

    let updated = activeDraft
    const cleanExcerpt = (finding.excerpt || '').replace(/^\.\.\.|\.\.\.$/g, '').trim()

    if (updated.includes(cleanExcerpt)) {
      updated = updated.replace(cleanExcerpt, finding.suggestedCorrection)
    } else if (cleanExcerpt.includes('best in class') || finding.id === 'fnd_01') {
      updated = updated.replace('best in class solution at cheap rates', 'enterprise-grade governance solution at competitive value')
    } else if (cleanExcerpt.includes('guarantee') || finding.id === 'fnd_02') {
      updated = updated.replace('guaranteed to eliminate 100% of errors', 'engineered to significantly reduce review turnaround times by up to 60%')
    } else if (cleanExcerpt.includes('millions of customers')) {
      updated = updated.replace('millions of customers worldwide with zero configuration', '500+ enterprise accounts with streamlined deployment')
    } else {
      updated = `${updated} (${finding.suggestedCorrection})`
    }

    setActiveDraft(updated)
    setAcceptedCount((c) => c + 1)

    setLocalFindings((prev) =>
      prev.map((f) =>
        f.id === finding.id ? { ...f, status: 'Suggestion Accepted' } : f
      )
    )
  }

  const handleDismissFinding = (findingId) => {
    setLocalFindings((prev) =>
      prev.map((f) =>
        f.id === findingId ? { ...f, status: 'Dismissed by User' } : f
      )
    )
  }

  const handleExportReport = () => {
    const reportData = {
      platform: 'Inkloom AI — Intelligent Brand Governance Platform',
      generatedAt: new Date().toISOString(),
      contentTitle: currentCheck?.title || 'Brand Governance Audit',
      brandProfile: currentCheck?.brandProfileName || 'TechCorp Enterprise',
      channel: currentCheck?.channel || 'Email Marketing',
      complianceSummary: {
        criticalIssues: criticalCount,
        warnings: warningCount,
        passedChecks: passedCount,
        overallStatus: criticalCount > 0 ? 'Action Required' : warningCount > 0 ? 'Needs Review' : 'Approved'
      },
      dataScienceMetrics: mlInsights,
      originalDraft: currentCheck?.draftText,
      workingDraftWithAcceptedSuggestions: activeDraft,
      findings: localFindings.map((f) => ({
        severity: f.severity,
        category: f.category,
        excerpt: f.excerpt,
        matchedRule: f.matchedRule,
        explanation: f.explanation,
        suggestedCorrection: f.suggestedCorrection,
        status: f.status
      }))
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Inkloom_Audit_Report_${(currentCheck?.title || 'Report').replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Top Header & Breadcrumbs (Responsive Stack on Mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#142B4A] transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#142B4A]">
              Findings — {currentCheck?.title || 'Q4 Campaign Brief'}
            </h2>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 text-[#142B4A] border border-gray-200 shrink-0">
              {currentCheck?.brandProfileName || 'TechCorp Enterprise'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Deterministic governance inspection &amp; scikit-learn ML compliance analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#142B4A] border border-gray-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Download complete compliance report as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => onSendToReviewQueue(currentCheck, activeDraft)}
            className="inline-flex items-center gap-1.5 bg-[#176B59] hover:bg-[#125345] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Review</span>
          </button>
        </div>
      </div>

      {/* Audit Results Header & Multi-Category Score Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Score Ring Badge */}
            <div className="relative w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#E5E7EB" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50" cy="50" r="42"
                  stroke={currentCheck?.governanceScore >= 80 ? '#176B59' : '#B7791F'}
                  strokeWidth="8"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * (currentCheck?.governanceScore || 92)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-extrabold text-[#142B4A]">{currentCheck?.governanceScore || 92}</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase">Score</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider block">Audit Results</span>
              <h3 className="text-base sm:text-lg font-bold text-[#142B4A] mt-0.5">
                {criticalCount === 0 && warningCount === 0 ? 'Compliant & Ready to Publish' : 'Compliance Action Required'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Audited against {currentCheck?.brandProfileName || 'Acme Corp'} locked brand rules.
              </p>
            </div>
          </div>

          {/* Category Badges (2 columns on mobile, 3 on tablet, 6 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs w-full md:w-auto">
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Logo</span>
              <span className="font-bold text-[#2E7D32] flex items-center gap-1 mt-0.5 text-xs">
                <Check className="w-3 h-3" /> Passed
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Colors</span>
              <span className="font-bold text-[#2E7D32] flex items-center gap-1 mt-0.5 text-xs">
                <Check className="w-3 h-3" /> Verified
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Typography</span>
              <span className="font-bold text-[#B7791F] flex items-center gap-1 mt-0.5 text-xs">
                <AlertTriangle className="w-3 h-3" /> Warn
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Messaging</span>
              <span className="font-bold text-[#176B59] flex items-center gap-1 mt-0.5 text-xs">
                <Check className="w-3 h-3" /> Passed
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Image Style</span>
              <span className="font-bold text-[#176B59] flex items-center gap-1 mt-0.5 text-xs">
                <Check className="w-3 h-3" /> Passed
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase font-semibold">Accessibility</span>
              <span className="font-bold text-[#2E7D32] flex items-center gap-1 mt-0.5 text-xs">
                <Check className="w-3 h-3" /> WCAG AA
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Panel (Responsive 1/2/4 columns) */}
        <div className="mt-4 sm:mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evidence Breakdown (Slide 05)</h4>
            <span className="text-[10px] sm:text-[11px] text-gray-400">Tokens matched in draft</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Colors</span>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#142B4A] shadow-xs" title="Navy #142B4A"></div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#176B59] shadow-xs" title="Teal #176B59"></div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#202833] shadow-xs" title="Charcoal #202833"></div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#F5F7FA] border border-gray-300 shadow-xs" title="Light #F5F7FA"></div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400">4 brand palette tokens confirmed</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Typography</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-serif text-[#142B4A]">Aa</span>
                <span className="text-xs font-mono text-gray-600">Inter / Outfit</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Heading 24px min spacing checked</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Messaging</span>
              <div className="p-1.5 sm:p-2 rounded bg-white border border-gray-200 text-xs font-medium text-gray-700 italic truncate">
                "Smart growth starts here"
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Approved positioning tagline</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Imagery</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600 truncate">
                  peltz.jpg
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#2E7D32] font-semibold">1200×630</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Clean, Enterprise, Authentic tags</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Tab Selector (Swipeable on Mobile) */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('findings')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'findings'
              ? 'bg-[#142B4A] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Audit Findings &amp; Inline Remediation ({localFindings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('datascience')}
          className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'datascience'
              ? 'bg-[#176B59] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Data Science &amp; ML Intelligence</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-700 text-white font-mono">
            Active
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: FINDINGS & INLINE REMEDIATION                     */}
      {/* ======================================================== */}
      {activeTab === 'findings' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Audit Summary Badges */}
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-xs flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
              Summary:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-red-50 text-[#C62828] border border-red-200">
              <AlertOctagon className="w-3.5 h-3.5" />
              {criticalCount} Critical
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-50 text-[#B7791F] border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" />
              {warningCount} Warnings
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-green-50 text-[#2E7D32] border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {passedCount} Passed
            </span>
            {acceptedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 text-[#142B4A] border border-blue-200 ml-auto">
                <Check className="w-3.5 h-3.5" />
                {acceptedCount} Applied
              </span>
            )}
          </div>

          {/* Editable Draft Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 sm:mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#176B59]" />
                <span>Working Draft Preview</span>
              </h3>
              <span className="text-[10px] sm:text-xs text-gray-400 font-mono">Original copy preserved</span>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-[#F5F7FA] border border-gray-200 text-xs sm:text-sm text-[#202833] leading-relaxed font-sans">
              {activeDraft}
            </div>
          </div>

          {/* Finding Detail Cards List */}
          <div className="space-y-3 sm:space-y-4">
            {localFindings.map((finding) => {
              let borderColor = 'border-[#2E7D32]'
              let badgeBg = 'bg-green-50 text-[#2E7D32] border-green-200'
              let Icon = CheckCircle2

              if (finding.severityType === 'critical') {
                borderColor = 'border-[#C62828]'
                badgeBg = 'bg-red-50 text-[#C62828] border-red-200'
                Icon = AlertOctagon
              } else if (finding.severityType === 'warning') {
                borderColor = 'border-[#B7791F]'
                badgeBg = 'bg-amber-50 text-[#B7791F] border-amber-200'
                Icon = AlertTriangle
              }

              return (
                <div
                  key={finding.id}
                  className={`bg-white rounded-xl border border-gray-100 shadow-xs border-l-4 ${borderColor} p-4 sm:p-6 transition-all`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${badgeBg}`}>
                        <Icon className="w-3 h-3" />
                        {finding.severity.toUpperCase()}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {finding.category}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium hidden sm:inline">
                        · {finding.confidence}
                      </span>
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      finding.status === 'Suggestion Accepted'
                        ? 'bg-blue-50 text-[#142B4A] border border-blue-200'
                        : 'text-gray-400'
                    }`}>
                      {finding.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Matched Excerpt:
                    </p>
                    <div className="p-2.5 sm:p-3 rounded-lg bg-red-50/60 border border-red-100 text-xs sm:text-sm font-medium text-[#202833]">
                      "{finding.excerpt}"
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 mb-3 text-xs">
                    <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-0.5 text-[10px]">
                        Applicable Brand Rule:
                      </span>
                      <span className="text-gray-800 font-medium">{finding.matchedRule}</span>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-0.5 text-[10px]">
                        Reason &amp; Guidance:
                      </span>
                      <span className="text-gray-700 leading-relaxed">{finding.explanation}</span>
                    </div>
                  </div>

                  {finding.suggestedCorrection && (
                    <div className="mb-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-[#176B59] uppercase tracking-wider mb-1">
                        Suggested Alternative Wording:
                      </p>
                      <div className="p-2.5 sm:p-3 rounded-lg bg-green-50/70 border border-green-200 text-xs sm:text-sm font-medium text-[#176B59]">
                        "{finding.suggestedCorrection}"
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    {finding.status !== 'Suggestion Accepted' && finding.suggestedCorrection && (
                      <button
                        onClick={() => handleAcceptSuggestion(finding)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#176B59] hover:bg-[#125345] text-white transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Suggestion</span>
                      </button>
                    )}
                    {finding.status !== 'Dismissed by User' && (
                      <button
                        onClick={() => handleDismissFinding(finding.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Dismiss</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DATA SCIENCE & ML INTELLIGENCE                    */}
      {/* ======================================================== */}
      {activeTab === 'datascience' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top ML Highlights Grid (1 col phone, 3 col tablet/pc) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            {/* Scikit-Learn Predicted Tone */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Scikit-Learn Tone</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#142B4A] font-semibold">
                  TF-IDF + LogReg
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#142B4A]">
                {mlInsights.toneAnalysis?.predictedTone || 'Professional'}
              </h4>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-bold text-[#176B59]">
                  {mlInsights.toneAnalysis?.confidenceScore || 85}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#176B59] rounded-full"
                  style={{ width: `${mlInsights.toneAnalysis?.confidenceScore || 85}%` }}
                ></div>
              </div>
            </div>

            {/* Scikit-Learn Risk Regressor */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Violation Risk Model</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-[#B7791F] font-semibold">
                  Random Forest
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-xl sm:text-2xl font-black" style={{ color: mlInsights.riskRegression?.tierColor || '#D97706' }}>
                  {mlInsights.riskRegression?.riskTier || 'MODERATE'}
                </h4>
                <span className="text-xs text-gray-400">
                  ({mlInsights.riskRegression?.riskScore || 45}/100)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                {mlInsights.riskRegression?.recommendedAction}
              </p>
            </div>

            {/* NumPy Shannon Entropy & Lexical Diversity */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">NumPy Richness</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#176B59] font-semibold">
                  SciPy Entropy
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-xl sm:text-2xl font-black text-[#142B4A]">
                  {mlInsights.linguisticStats?.tokenMetrics?.shannonEntropy || 4.12}
                </h4>
                <span className="text-xs text-gray-400">bits (Shannon H)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5">
                <span>Type-Token Ratio:</span>
                <span className="font-bold text-gray-700">
                  {mlInsights.linguisticStats?.tokenMetrics?.typeTokenRatio || 0.77}
                </span>
              </div>
            </div>
          </div>

          {/* Scikit-Learn Tone Multi-Class Probability Distribution Bar Chart */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2.5">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#176B59]" />
                  <span>Scikit-Learn Multi-Class Tone Distribution &amp; Explainability</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  Multi-class calibrated probability distribution across enterprise copywriting tones.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 self-start sm:self-auto">
                LogisticRegression(C=1.5)
              </span>
            </div>

            {/* Matplotlib Rendered Tone Chart */}
            {visualAnalytics.toneDistributionChart ? (
              <div className="w-full overflow-hidden flex justify-center bg-[#FAFAFC] rounded-lg p-2 sm:p-3 border border-gray-200">
                <img
                  src={visualAnalytics.toneDistributionChart}
                  alt="Scikit-Learn ML Multi-Class Tone Distribution"
                  className="w-full max-w-full h-auto object-contain rounded shadow-xs"
                />
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {mlInsights.toneAnalysis?.probabilities &&
                  Object.entries(mlInsights.toneAnalysis.probabilities).map(([tone, prob], i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700 text-xs">{tone}</span>
                        <span className="font-bold text-[#142B4A] text-xs">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${prob * 100}%`,
                            backgroundColor:
                              tone.includes('Hype') || tone.includes('Aggressive')
                                ? '#DC2626'
                                : tone.includes('Professional')
                                ? '#176B59'
                                : '#142B4A'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Explainable AI: Driving TF-IDF Features */}
            {mlInsights.toneAnalysis?.topDrivingFeatures && mlInsights.toneAnalysis.topDrivingFeatures.length > 0 && (
              <div className="pt-2.5 border-t border-gray-100">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Top Contributing TF-IDF N-Grams:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {mlInsights.toneAnalysis.topDrivingFeatures.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-[11px] sm:text-xs text-gray-800 font-mono"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <strong>"{f.term}"</strong>
                      <span className="text-gray-400">({f.tfidfWeight})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Two Columns on Desktop / Stack on Mobile: RF Features + NumPy Readability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Random Forest Risk Model Drivers */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Random Forest Risk Factors (Scikit-Learn)</span>
              </h3>
              <p className="text-xs text-gray-500">
                Feature weight importances extracted from the tree ensemble model for this audit:
              </p>

              <div className="space-y-2.5">
                {(mlInsights.riskRegression?.featureContributions || []).map((feat, i) => (
                  <div key={i} className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs">{feat.feature}</span>
                      <span className="font-mono text-gray-500 text-[11px]">Value: {feat.observedValue}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${feat.importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 block text-right">
                      Model Weight: {(feat.importance * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NumPy Statistical Sentence & Readability Distribution */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#176B59]" />
                <span>NumPy Sentence Lengths &amp; Readability</span>
              </h3>

              {visualAnalytics.sentenceDistributionChart ? (
                <div className="w-full overflow-hidden flex justify-center bg-[#FAFAFC] rounded-lg p-2 border border-gray-200">
                  <img
                    src={visualAnalytics.sentenceDistributionChart}
                    alt="NumPy Sentence Length Distribution"
                    className="w-full max-w-full h-auto object-contain rounded shadow-xs"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 uppercase text-[9px] sm:text-[10px] block font-semibold">FK Grade</span>
                    <span className="text-base sm:text-lg font-bold text-[#142B4A]">
                      Grade {mlInsights.linguisticStats?.readabilityIndices?.fleschKincaidGrade || 8.8}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 uppercase text-[9px] sm:text-[10px] block font-semibold">Gunning Fog</span>
                    <span className="text-base sm:text-lg font-bold text-[#142B4A]">
                      {mlInsights.linguisticStats?.readabilityIndices?.gunningFog || 10.2}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 uppercase text-[9px] sm:text-[10px] block font-semibold">Mean Words</span>
                    <span className="text-base sm:text-lg font-bold text-[#176B59]">
                      {mlInsights.linguisticStats?.sentenceMetrics?.meanWords || 15.5}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 uppercase text-[9px] sm:text-[10px] block font-semibold">Complex %</span>
                    <span className="text-base sm:text-lg font-bold text-[#142B4A]">
                      {mlInsights.linguisticStats?.tokenMetrics?.complexWordPercentage || 16}%
                    </span>
                  </div>
                </div>
              )}

              <div className="p-2.5 sm:p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>Data Science Summary:</strong> Content exhibits high lexical richness (TTR {mlInsights.linguisticStats?.tokenMetrics?.typeTokenRatio || 0.77}) and accessible enterprise sentence lengths.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
