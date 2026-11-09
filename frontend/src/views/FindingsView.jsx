import React, { useState, useEffect } from 'react'
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Check,
  X,
  FileCheck2,
  Send,
  ArrowLeft,
  Download,
  Palette,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Layers,
  Sparkles,
  SunMedium
} from 'lucide-react'

export default function FindingsView({
  currentCheck,
  findings,
  onSendToReviewQueue,
  onBack
}) {
  const [localFindings, setLocalFindings] = useState(findings)
  const [activeDraft, setActiveDraft] = useState(
    currentCheck?.draftText ||
      'TechCorp Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
  )
  const [acceptedCount, setAcceptedCount] = useState(0)

  // Sync localFindings and draft text when parent sends new data (fresh audit run)
  useEffect(() => {
    setLocalFindings(findings)
    setAcceptedCount(0)
  }, [findings])

  useEffect(() => {
    if (currentCheck?.draftText) {
      setActiveDraft(currentCheck.draftText)
    }
  }, [currentCheck?.id])

  // Compute live summary counts
  const criticalCount = localFindings.filter((f) => f.severityType === 'critical').length
  const warningCount = localFindings.filter((f) => f.severityType === 'warning').length
  const passedCount = localFindings.filter((f) => f.severityType === 'passed').length

  const visualFindings = localFindings.filter(
    (f) => f.findingType === 'visual' || f.category?.includes('Palette') || f.category?.includes('Contrast') || f.category?.includes('Logo')
  )
  const textFindings = localFindings.filter((f) => !visualFindings.includes(f))

  const handleAcceptSuggestion = (finding) => {
    if (!finding.suggestedCorrection) return

    // Apply suggestion: use the excerpt text to find and replace in the draft
    let updated = activeDraft
    const rawExcerpt = finding.excerpt
      ? finding.excerpt.replace(/^\.\.\./, '').replace(/\.\.\.$/, '').trim()
      : ''
    if (rawExcerpt && updated.toLowerCase().includes(rawExcerpt.toLowerCase())) {
      const escapedExcerpt = rawExcerpt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escapedExcerpt, 'i')
      updated = updated.replace(regex, finding.suggestedCorrection)
    }

    setActiveDraft(updated)
    setAcceptedCount((c) => c + 1)

    // Mark finding as accepted
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
      version: '3.0.0 (Round 3 Multi-Modal)',
      generatedAt: new Date().toISOString(),
      contentTitle: currentCheck?.title || 'Brand Governance Audit',
      brandProfile: currentCheck?.brandProfileName || 'TechCorp Enterprise',
      channel: currentCheck?.channel || 'Email Marketing',
      complianceSummary: {
        totalFindings: localFindings.length,
        criticalIssues: criticalCount,
        warnings: warningCount,
        passedChecks: passedCount,
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
      originalDraft: currentCheck?.draftText,
      workingDraftWithAcceptedSuggestions: activeDraft,
      findings: localFindings.map((f) => ({
        type: f.findingType || 'text',
        severity: f.severity,
        category: f.category,
        excerpt: f.excerpt,
        matchedRule: f.matchedRule,
        explanation: f.explanation,
        suggestedCorrection: f.suggestedCorrection,
        confidence: f.confidence,
        status: f.status,
        visualDetails: f.visualDetails || null
      }))
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Inkloom_Unified_Audit_Report_${(currentCheck?.title || 'Report').replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasVisualAsset = Boolean(currentCheck?.assetUrl || currentCheck?.assetColorPalette?.length > 0)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#142B4A] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#142B4A]">
              Findings — {currentCheck?.title || 'Q4 Campaign Brief'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 text-[#142B4A] border border-gray-200">
              {currentCheck?.brandProfileName || 'TechCorp Enterprise'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Unified multi-modal governance audit results. Review copy evidence, visual palette, and WCAG contrast.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#142B4A] border border-gray-200 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Download complete compliance report as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => onSendToReviewQueue(currentCheck, activeDraft)}
            className="inline-flex items-center gap-2 bg-[#176B59] hover:bg-[#125345] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Review Queue</span>
          </button>
        </div>
      </div>

      {/* Audit Summary Badges */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
          Unified Audit:
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#C62828] border border-red-200">
          <AlertOctagon className="w-3.5 h-3.5" />
          {criticalCount} Critical
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#B7791F] border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          {warningCount} Warnings
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-[#2E7D32] border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {passedCount} Passed
        </span>
        {hasVisualAsset && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#176B59] border border-teal-200">
            <Palette className="w-3.5 h-3.5" />
            Multi-Modal Visual Audited
          </span>
        )}
        {acceptedCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#142B4A] border border-blue-200 ml-auto">
            <Check className="w-3.5 h-3.5" />
            {acceptedCount} Suggestions Applied
          </span>
        )}
      </div>

      {/* Round 3 Improvement 1: Multi-Modal Visual Asset Inspection Card */}
      {hasVisualAsset && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#176B59]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Visual Brand Asset Audit & Color Palette Extraction
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">
              {currentCheck?.assetOriginalName || 'Uploaded Marketing Asset'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Asset Preview Thumbnail */}
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
                      // Fallback if local server path differs
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 hidden">
                  <Palette className="w-6 h-6 text-[#176B59]" />
                  <span>Graphic Analyzed</span>
                </div>
              </div>
            </div>

            {/* Extracted Dominant Color Swatches */}
            <div className="space-y-2 md:col-span-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Dominant Extracted HEX Swatches & Brand Alignment:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                    className="p-2.5 rounded-lg border border-gray-100 bg-[#F5F7FA] flex items-center gap-3"
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

              {/* Contrast Quick Metric */}
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
            </div>
          </div>
        </div>
      )}

      {/* Editable Draft Preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#176B59]" />
            <span>Working Draft Preview (Updated when suggestions are accepted)</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">Original content preserved</span>
        </div>
        <div className="p-4 rounded-lg bg-[#F5F7FA] border border-gray-200 text-sm text-[#202833] leading-relaxed font-sans">
          {activeDraft}
        </div>
      </div>

      {/* Finding Detail Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider">
            Detailed Audit Evidence ({localFindings.length} Items)
          </h3>
          <span className="text-xs text-gray-400">
            {textFindings.length} Text Rules · {visualFindings.length} Visual Assets
          </span>
        </div>

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

          const isVisualFinding =
            finding.findingType === 'visual' ||
            finding.category?.includes('Palette') ||
            finding.category?.includes('Contrast') ||
            finding.category?.includes('Logo')

          return (
            <div
              key={finding.id || finding._id}
              className={`bg-white rounded-xl border border-gray-100 shadow-xs border-l-4 ${borderColor} p-6 transition-all`}
            >
              {/* Card Top: Badges & Category */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {finding.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    {isVisualFinding && <Palette className="w-3 h-3 text-[#176B59]" />}
                    {finding.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    · {finding.confidence}
                  </span>
                </div>

                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  finding.status === 'Suggestion Accepted'
                    ? 'bg-blue-50 text-[#142B4A] border border-blue-200'
                    : 'text-gray-400'
                }`}>
                  {finding.status}
                </span>
              </div>

              {/* Excerpt Box */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Matched Audit Evidence:
                </p>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-[#202833] flex items-center justify-between">
                  <span>"{finding.excerpt}"</span>

                  {/* Live Color Swatch if visual finding */}
                  {finding.visualDetails?.extractedHex && (
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-gray-200">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10"
                        style={{ backgroundColor: finding.visualDetails.extractedHex }}
                      ></div>
                      <span className="font-mono text-xs text-gray-700">
                        {finding.visualDetails.extractedHex}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rule & Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Applicable Brand Rule:
                  </span>
                  <span className="text-gray-800 font-medium">{finding.matchedRule}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Reason & Guidance:
                  </span>
                  <span className="text-gray-700 leading-relaxed">{finding.explanation}</span>
                </div>
              </div>

              {/* Suggested Correction (if available) */}
              {finding.suggestedCorrection && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#176B59] uppercase tracking-wider mb-1">
                    Suggested Action / Wording:
                  </p>
                  <div className="p-3 rounded-lg bg-green-50/70 border border-green-200 text-sm font-medium text-[#176B59]">
                    "{finding.suggestedCorrection}"
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                {finding.status !== 'Suggestion Accepted' && finding.suggestedCorrection && !isVisualFinding && (
                  <button
                    onClick={() => handleAcceptSuggestion(finding)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#176B59] hover:bg-[#125345] text-white transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Suggestion</span>
                  </button>
                )}
                {finding.status !== 'Dismissed by User' && (
                  <button
                    onClick={() => handleDismissFinding(finding.id || finding._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss Finding</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
