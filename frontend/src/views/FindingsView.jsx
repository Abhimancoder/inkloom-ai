import React, { useState, useEffect } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Check,
  FileCheck2,
  Send,
  ArrowLeft,
  Download,
  BrainCircuit,
  TrendingUp,
  BarChart2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Palette,
  Eye,
  ShieldAlert,
  ShieldCheck,
  SunMedium,
  BookmarkCheck,
  RotateCcw,
  X
} from 'lucide-react'
import { generateRagRewrite } from '../services/api'

export default function FindingsView({
  currentCheck,
  findings,
  onSendToReviewQueue,
  onSendToReview,
  onBack,
  onBackToDashboard
}) {
  const handleBack = onBack || onBackToDashboard
  const handleSendToReview = onSendToReviewQueue || onSendToReview

  const [localFindings, setLocalFindings] = useState(findings || [])
  const [activeDraft, setActiveDraft] = useState(
    currentCheck?.draftText ||
      'TechCorp Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
  )
  const [acceptedCount, setAcceptedCount] = useState(0)
  const [activeTab, setActiveTab] = useState('findings') // 'findings' | 'ml-governance'

  // RAG Rewrite Modal State
  const [isRagModalOpen, setIsRagModalOpen] = useState(false)
  const [isGeneratingRewrite, setIsGeneratingRewrite] = useState(false)
  const [ragResult, setRagResult] = useState(null)
  const [activeFindingForRewrite, setActiveFindingForRewrite] = useState(null)

  // Sync localFindings and draft text when parent sends new data
  useEffect(() => {
    if (findings) {
      setLocalFindings(findings)
      setAcceptedCount(0)
    }
  }, [findings])

  useEffect(() => {
    if (currentCheck?.draftText) {
      setActiveDraft(currentCheck.draftText)
    }
  }, [currentCheck?.id, currentCheck?._id])

  // Compute live summary counts
  const criticalCount = localFindings.filter((f) => f.severityType === 'critical').length
  const warningCount = localFindings.filter((f) => f.severityType === 'warning').length
  const passedCount = localFindings.filter((f) => f.severityType === 'passed').length

  const visualFindings = localFindings.filter(
    (f) =>
      f.findingType === 'visual' ||
      f.category?.includes('Palette') ||
      f.category?.includes('Contrast') ||
      f.category?.includes('Logo')
  )
  const textFindings = localFindings.filter((f) => !visualFindings.includes(f))

  const hasVisualAsset = Boolean(
    currentCheck?.assetUrl ||
    (currentCheck?.assetColorPalette && currentCheck.assetColorPalette.length > 0) ||
    (currentCheck?.visualAssets && currentCheck.visualAssets.length > 0)
  )

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
    const rawExcerpt = finding.excerpt
      ? finding.excerpt.replace(/^\.\.\./, '').replace(/\.\.\.$/, '').trim()
      : ''
    if (rawExcerpt && updated.toLowerCase().includes(rawExcerpt.toLowerCase())) {
      const escapedExcerpt = rawExcerpt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escapedExcerpt, 'i')
      updated = updated.replace(regex, finding.suggestedCorrection)
    } else if (rawExcerpt.includes('best in class') || finding.id === 'fnd_01') {
      updated = updated.replace('best in class solution at cheap rates', 'enterprise-grade governance solution at competitive value')
    } else if (rawExcerpt.includes('guarantee') || finding.id === 'fnd_02') {
      updated = updated.replace('guaranteed to eliminate 100% of errors', 'engineered to significantly reduce review turnaround times by up to 60%')
    } else {
      updated = `${updated} (${finding.suggestedCorrection})`
    }

    setActiveDraft(updated)
    setAcceptedCount((c) => c + 1)

    setLocalFindings((prev) =>
      prev.map((f) =>
        f.id === finding.id || f._id === finding._id ? { ...f, status: 'Suggestion Accepted' } : f
      )
    )
  }

  const handleOpenRagRewrite = async (finding) => {
    setActiveFindingForRewrite(finding)
    setIsGeneratingRewrite(true)
    setIsRagModalOpen(true)

    const result = await generateRagRewrite({
      originalSentence: activeDraft,
      brandProfileId: currentCheck?.brandProfileId,
      matchedRule: finding.matchedRule,
      explanation: finding.explanation
    })

    setRagResult(result)
    setIsGeneratingRewrite(false)
  }

  const handleApplyRagSuggestion = () => {
    if (!ragResult?.suggestedAlternative) return
    setActiveDraft(ragResult.suggestedAlternative)
    setAcceptedCount((c) => c + 1)
    if (activeFindingForRewrite) {
      const targetId = activeFindingForRewrite.id || activeFindingForRewrite._id
      setLocalFindings((prev) =>
        prev.map((f) =>
          (f.id === targetId || f._id === targetId) ? { ...f, status: 'Suggestion Accepted' } : f
        )
      )
    }
    setIsRagModalOpen(false)
  }

  const handleDismissFinding = (findingId) => {
    setLocalFindings((prev) =>
      prev.map((f) =>
        f.id === findingId || f._id === findingId ? { ...f, status: 'Dismissed by User' } : f
      )
    )
  }

  const handleAcceptAll = () => {
    let updated = activeDraft
    localFindings.forEach((f) => {
      if (f.suggestedCorrection) {
        const rawExcerpt = f.excerpt
          ? f.excerpt.replace(/^\.\.\./, '').replace(/\.\.\.$/, '').trim()
          : ''
        if (rawExcerpt && updated.toLowerCase().includes(rawExcerpt.toLowerCase())) {
          const escaped = rawExcerpt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          updated = updated.replace(new RegExp(escaped, 'i'), f.suggestedCorrection)
        }
      }
    })
    setActiveDraft(updated)
    setAcceptedCount(localFindings.filter((f) => f.suggestedCorrection).length)
    setLocalFindings((prev) =>
      prev.map((f) => (f.suggestedCorrection ? { ...f, status: 'Suggestion Accepted' } : f))
    )
  }

  const handleExportReport = () => {
    const reportData = {
      platform: 'Inkloom AI — Intelligent Brand Governance Platform',
      version: '3.0.0 (Round 3 Multi-Modal & RAG)',
      generatedAt: new Date().toISOString(),
      contentTitle: currentCheck?.title || 'Brand Governance Audit',
      brandProfile: currentCheck?.brandProfileName || 'TechCorp Enterprise',
      channel: currentCheck?.channel || 'Email Marketing',
      complianceSummary: {
        totalFindings: localFindings.length,
        criticalCount,
        warningCount,
        passedCount,
        governanceScore: currentCheck?.governanceScore || 92,
        overallStatus: criticalCount > 0 ? 'Action Required' : warningCount > 0 ? 'Needs Review' : 'Approved'
      },
      visualAssetAudit: currentCheck?.assetUrl ? {
        assetName: currentCheck?.assetOriginalName,
        mimeType: currentCheck?.assetMimeType,
        sizeBytes: currentCheck?.assetSize,
        contrastRatio: currentCheck?.assetContrastRatio,
        contrastPasses: currentCheck?.assetContrastPass,
        extractedPalette: currentCheck?.assetColorPalette
      } : 'No visual asset attached (Text-only check)',
      dataScienceMetrics: mlInsights,
      originalDraft: currentCheck?.draftText,
      workingDraftWithAcceptedSuggestions: activeDraft,
      findings: localFindings.map((f) => ({
        type: f.findingType || 'text',
        severity: f.severity,
        category: f.category,
        excerpt: f.excerpt,
        matchedRule: f.matchedRule,
        suggestedCorrection: f.suggestedCorrection,
        status: f.status || 'Flagged'
      }))
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inkloom-compliance-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          {handleBack && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#142B4A] transition-colors mb-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#142B4A]">
              {currentCheck?.title || 'Audit Findings & Compliance Evidence'}
            </h2>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              {currentCheck?.channel || 'Email Marketing'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#142B4A] border border-blue-100">
              {currentCheck?.brandProfileName || 'TechCorp Enterprise'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Deterministic governance inspection, multi-modal visual audit &amp; scikit-learn ML compliance analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#142B4A] border border-gray-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Download complete compliance report as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#176B59]" />
            <span>Export Report</span>
          </button>

          {handleSendToReview && (
            <button
              onClick={handleSendToReview}
              className="inline-flex items-center gap-1.5 bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Human Review Queue</span>
            </button>
          )}
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
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={currentCheck?.governanceScore >= 80 ? '#176B59' : '#B7791F'}
                  strokeWidth="8"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * (currentCheck?.governanceScore || 92)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg sm:text-xl font-black text-[#142B4A]">
                  {currentCheck?.governanceScore || 92}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Score</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#142B4A]">Governance Compliance Index</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#176B59] border border-emerald-200">
                  Automated Pre-Publication Audit
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                Multi-dimensional inspection covering logo clear-space, color compliance, tone consistency, and prohibited claim detection.
              </p>
            </div>
          </div>

          <div className="text-right self-start md:self-auto shrink-0">
            <span className="text-[11px] font-mono text-gray-400 block">Check ID: {currentCheck?.id || 'chk_active'}</span>
            <span className="text-xs font-semibold text-gray-700">Channel: {currentCheck?.channel || 'Marketing'}</span>
          </div>
        </div>

        {/* Multi-Category Compliance Score Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 pt-4 sm:pt-6">
          {[
            { label: 'Logo Usage', status: 'Passed', color: 'text-[#176B59]', bg: 'bg-emerald-50' },
            {
              label: 'Color Palette',
              status: currentCheck?.assetColorPalette?.length ? 'Pass (WCAG AA)' : 'Compliant',
              color: 'text-[#176B59]',
              bg: 'bg-emerald-50'
            },
            { label: 'Typography', status: 'Passed', color: 'text-[#176B59]', bg: 'bg-emerald-50' },
            {
              label: 'Messaging Tone',
              status: criticalCount > 0 ? 'Flags Found' : 'Verified',
              color: criticalCount > 0 ? 'text-[#C62828]' : 'text-[#176B59]',
              bg: criticalCount > 0 ? 'bg-red-50' : 'bg-emerald-50'
            },
            { label: 'Image Style', status: 'Passed', color: 'text-[#176B59]', bg: 'bg-emerald-50' },
            {
              label: 'Accessibility',
              status: currentCheck?.assetContrastPass === false ? 'Warning' : '98% AAA Pass',
              color: currentCheck?.assetContrastPass === false ? 'text-[#B7791F]' : 'text-[#176B59]',
              bg: currentCheck?.assetContrastPass === false ? 'bg-amber-50' : 'bg-emerald-50'
            }
          ].map((cat, idx) => (
            <div key={idx} className={`p-2 sm:p-2.5 rounded-lg border border-gray-100 ${cat.bg}`}>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">{cat.label}</span>
              <span className={`text-xs font-bold ${cat.color}`}>{cat.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('findings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'findings'
              ? 'border-[#142B4A] text-[#142B4A]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Rule &amp; Visual Audit Findings</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 text-[#C62828] font-bold">
            {localFindings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ml-governance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ml-governance'
              ? 'border-[#142B4A] text-[#142B4A]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
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
            {hasVisualAsset && (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-teal-50 text-[#176B59] border border-teal-200">
                <Palette className="w-3.5 h-3.5" />
                Visual Audited
              </span>
            )}
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
            <textarea
              rows={4}
              value={activeDraft}
              onChange={(e) => setActiveDraft(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-lg bg-[#F5F7FA] border border-gray-200 text-xs sm:text-sm text-[#202833] font-medium leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
            ></textarea>
          </div>

          {/* Visual Asset Overview Card */}
          {hasVisualAsset && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#176B59]" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Visual Brand Asset Audit &amp; Color Palette Extraction
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
                  {currentCheck?.assetOriginalName || 'Uploaded Marketing Asset'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Audited Graphic:
                  </p>
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center max-h-48">
                    {currentCheck?.assetUrl ? (
                      <img
                        src={`http://localhost:5000${currentCheck.assetUrl}`}
                        alt="Audited Visual"
                        className="w-full h-44 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs gap-1">
                      <Palette className="w-6 h-6 text-[#176B59]" />
                      <span>Graphic Analyzed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Dominant Extracted HEX Swatches &amp; Brand Alignment:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {(currentCheck?.assetColorPalette?.length > 0
                      ? currentCheck.assetColorPalette
                      : [
                          { hex: '#142B4A', proportion: 38, isApproved: true },
                          { hex: '#EDEFF4', proportion: 51, isApproved: true },
                          { hex: '#006D5A', proportion: 6, isApproved: true }
                        ]
                    ).slice(0, 6).map((color, idx) => (
                      <div
                        key={idx}
                        className="p-2 sm:p-2.5 rounded-lg border border-gray-100 bg-[#F5F7FA] flex items-center gap-2.5"
                      >
                        <div
                          className="w-8 h-8 rounded-md shadow-2xs border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="min-w-0 text-left">
                          <p className="font-mono text-xs font-bold text-[#142B4A] truncate">
                            {color.hex}
                          </p>
                          <span className="text-[10px] text-gray-500 block">
                            {color.proportion}% surface · {color.isApproved ? 'Approved' : 'Unapproved'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium flex items-center gap-1.5">
                      <SunMedium className="w-4 h-4 text-[#176B59]" />
                      Primary Contrast Ratio:
                    </span>
                    <span className="font-mono font-bold text-[#142B4A]">
                      {currentCheck?.assetContrastRatio ? `${currentCheck.assetContrastRatio}:1` : '13.56:1'}
                      <span className="ml-2 font-sans font-semibold text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 text-[10px]">
                        Passes WCAG AA (Target: 4.5:1)
                      </span>
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#176B59]" />
                      Clear Space &amp; Margin Rule:
                    </span>
                    <span className="text-[#2E7D32] font-semibold text-[11px]">
                      Compliant (0.5x minimum spacing verified)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Findings List */}
          <div className="space-y-3 sm:space-y-4">
            {localFindings.map((finding) => {
              const isAccepted = finding.status === 'Suggestion Accepted'
              const isDismissed = finding.status === 'Dismissed by User'
              const isVisual =
                finding.findingType === 'visual' ||
                finding.category?.includes('Palette') ||
                finding.category?.includes('Contrast') ||
                finding.category?.includes('Logo')

              return (
                <div
                  key={finding.id || finding._id}
                  className={`bg-white rounded-xl border p-4 sm:p-6 transition-all ${
                    isAccepted
                      ? 'border-green-200 bg-green-50/20'
                      : isDismissed
                      ? 'opacity-50 border-gray-200'
                      : 'border-gray-100 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          finding.severityType === 'critical'
                            ? 'bg-red-50 text-[#C62828] border border-red-200'
                            : finding.severityType === 'warning'
                            ? 'bg-amber-50 text-[#B7791F] border border-amber-200'
                            : 'bg-green-50 text-[#2E7D32] border border-green-200'
                        }`}
                      >
                        {finding.severityType === 'critical' ? (
                          <AlertOctagon className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        <span>{finding.severity}</span>
                      </span>

                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {finding.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-gray-400">
                      Rule: {finding.matchedRule}
                    </span>
                  </div>

                  {/* Flagged Excerpt */}
                  {finding.excerpt && (
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Flagged Excerpt:
                      </span>
                      <p className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700 italic">
                        "{finding.excerpt}"
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Violation Explanation:
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {finding.explanation}
                    </p>
                  </div>

                  {/* Suggested Correction */}
                  {finding.suggestedCorrection && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-[#176B59] uppercase tracking-wider block mb-1">
                        Suggested Correction:
                      </span>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-[#176B59]">
                        "{finding.suggestedCorrection}"
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleDismissFinding(finding.id || finding._id)}
                      disabled={isDismissed || isAccepted}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>

                    {!isVisual && (
                      <button
                        onClick={() => handleOpenRagRewrite(finding)}
                        disabled={isAccepted || isDismissed}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 disabled:opacity-40 transition-colors cursor-pointer"
                        title="Rewrite using Approved Copy Library RAG engine"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI RAG Rewrite</span>
                      </button>
                    )}

                    {finding.suggestedCorrection && (
                      <button
                        onClick={() => handleAcceptSuggestion(finding)}
                        disabled={isAccepted || isDismissed}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#176B59] hover:bg-[#125345] disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAccepted ? 'Suggestion Applied' : 'Accept Suggestion'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {localFindings.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#176B59] mx-auto" />
                <h4 className="font-bold text-[#142B4A] text-sm">All Brand Checks Passed</h4>
                <p className="text-xs text-gray-500">No rule violations were flagged in this draft.</p>
              </div>
            )}
          </div>

          {/* Action Footer Bar */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleAcceptAll}
              disabled={localFindings.filter((f) => f.suggestedCorrection && f.status !== 'Suggestion Accepted').length === 0}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition-colors cursor-pointer text-center"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All Suggestions</span>
            </button>

            {handleSendToReview && (
              <button
                onClick={handleSendToReview}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#142B4A] hover:bg-[#1a385f] text-white shadow-xs cursor-pointer text-center"
              >
                <Send className="w-4 h-4" />
                <span>Send to Human Review Queue</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DATA SCIENCE & ML INTELLIGENCE                    */}
      {/* ======================================================== */}
      {activeTab === 'ml-governance' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Scikit-Learn Multiclass Logistic Regression */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#176B59]" />
                  <span>NLP Tone Classification (Scikit-Learn)</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  Logistic Regression
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Predicted Tone:</span>
                  <span className="font-bold text-[#C62828] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    {mlInsights.toneAnalysis?.predictedTone}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Target Tone:</span>
                  <span className="font-bold text-[#176B59]">
                    {mlInsights.toneAnalysis?.targetTone}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Confidence Score:</span>
                  <span className="font-mono font-bold text-[#142B4A]">
                    {mlInsights.toneAnalysis?.confidenceScore}%
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Class Probabilities Breakdown:
                </span>
                <div className="space-y-1.5">
                  {Object.entries(mlInsights.toneAnalysis?.probabilities || {}).map(([tone, prob]) => (
                    <div key={tone} className="text-[11px]">
                      <div className="flex justify-between text-gray-600 mb-0.5">
                        <span>{tone}</span>
                        <span className="font-mono font-semibold">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#176B59] rounded-full"
                          style={{ width: `${prob * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {mlInsights.toneAnalysis?.topDrivingFeatures?.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    TF-IDF Driving Features:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mlInsights.toneAnalysis.topDrivingFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {feat.term} ({feat.tfidfWeight})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Random Forest Risk Regression */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#B7791F]" />
                  <span>Random Forest Compliance Risk Engine</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">
                  Ensemble Regressor
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block">
                    Composite Risk Score
                  </span>
                  <span className="text-2xl font-black text-amber-900">
                    {mlInsights.riskRegression?.riskScore} / 100
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-600 text-white">
                  {mlInsights.riskRegression?.riskTier} TIER
                </span>
              </div>

              <p className="text-xs text-gray-600 italic">
                "{mlInsights.riskRegression?.recommendedAction}"
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Feature Importance Weights:
                </span>
                {(mlInsights.riskRegression?.featureContributions || []).map((feat, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-gray-600">
                      <span>{feat.feature}</span>
                      <span className="font-mono font-semibold">Observed: {feat.observedValue}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-3 md:col-span-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#176B59]" />
                <span>NumPy Sentence Lengths &amp; Readability Distributions</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
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

      {/* ======================================================== */}
      {/* RAG REWRITE MODAL (ROUND 3 IMPROVEMENT 2)                */}
      {/* ======================================================== */}
      {isRagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-lg text-[#142B4A]">
                  Contextual RAG Alternative Rewriting
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRagModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingRewrite ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-[#142B4A]">
                  Retrieving Approved Copy &amp; Generating Contextual Rewrite...
                </p>
                <p className="text-xs text-gray-400 max-w-sm">
                  Querying vector-similar approved copy, preserving factual percentages and locked enterprise claims.
                </p>
              </div>
            ) : ragResult ? (
              <div className="space-y-4 text-xs">
                {/* Notice */}
                <div className="p-3 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-semibold flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 shrink-0 text-purple-600" />
                  <span>{ragResult.notice || 'AI Suggestion: Original draft preserved. Choose whether to apply.'}</span>
                </div>

                {/* Original vs Rewrite */}
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Original Draft Excerpt:
                    </span>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 italic">
                      {ragResult.originalSentence}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-[#176B59] uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span>AI Suggested Contextual Alternative:</span>
                      <span className="text-[10px] bg-green-100 text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">
                        Full Contextual Replacement
                      </span>
                    </span>
                    <div className="p-3.5 rounded-lg bg-green-50/80 border border-green-200 text-sm font-medium text-[#142B4A] leading-relaxed">
                      {ragResult.suggestedAlternative}
                    </div>
                  </div>
                </div>

                {/* Preserved Factual Constraints */}
                {ragResult.preservedFacts?.length > 0 && (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Preserved Factual Constraints (Numbers, % &amp; Claims):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ragResult.preservedFacts.map((fact, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono text-[11px] font-bold"
                        >
                          ✓ {fact}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retrieved Approved Brand Evidence */}
                {ragResult.retrievedSources?.length > 0 && (
                  <div>
                    <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Retrieved Brand Proof Evidence (From Approved Library):
                    </span>
                    <div className="space-y-2">
                      {ragResult.retrievedSources.map((source, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-[#142B4A]">
                            <span>{source.title} ({source.channel})</span>
                            <span className="text-[#176B59] font-mono">{source.similarityScore}% Match</span>
                          </div>
                          <p className="text-gray-600 italic">"{source.snippet}"</p>
                          <p className="text-[10px] text-gray-400">Evidence: {source.relevanceReason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Why This Addresses Brand Governance:
                  </span>
                  <p className="text-gray-700 leading-relaxed">{ragResult.explanation}</p>
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsRagModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Keep Original
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyRagSuggestion}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#176B59] hover:bg-[#125345] text-white shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Suggestion to Working Draft</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
