<<<<<<< HEAD
import { useState } from 'react'
import { Send, AlertCircle, ArrowLeft } from 'lucide-react'
=======
import React, { useState, useEffect } from 'react'
import {
  Send,
  FileEdit,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Palette
} from 'lucide-react'
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc

export default function NewCheckView({
  brandProfiles,
  onSubmitCheck,
  onCancel
}) {
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState('Email Marketing')
  const [selectedProfileId, setSelectedProfileId] = useState(
    brandProfiles[0]?.id || ''
  )
  const [visualAsset, setVisualAsset] = useState('peltz.jpg')
  const [draftText, setDraftText] = useState(
    'Acme Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
  )
  const [isAuditing, setIsAuditing] = useState(false)

<<<<<<< HEAD
  // Sample quick-fill drafts for instant hackathon demonstration
=======
  // Round 3 Improvement 1: Visual Asset Upload State
  const [assetFile, setAssetFile] = useState(null)
  const [assetPreview, setAssetPreview] = useState(null)
  const [fileError, setFileError] = useState('')

  // Sync selectedProfileId when brandProfiles updates (e.g. loaded from MongoDB Atlas)
  useEffect(() => {
    if (brandProfiles?.length > 0 && !brandProfiles.some((p) => p.id === selectedProfileId)) {
      setSelectedProfileId(brandProfiles[0].id)
    }
  }, [brandProfiles, selectedProfileId])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setFileError('')

    if (!file) {
      setAssetFile(null)
      setAssetPreview(null)
      return
    }

    // Validate MIME types: PNG, JPG/JPEG, WEBP
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Unsupported file format. Please upload a PNG, JPG, or WEBP image.')
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError('File size exceeds the 10MB limit. Please upload an optimized image.')
      return
    }

    setAssetFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setAssetPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = () => {
    setAssetFile(null)
    setAssetPreview(null)
    setFileError('')
  }

  // Sample quick-fill draft for instant hackathon demonstration
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
  const handleLoadSampleDraft = () => {
    setTitle('Acme Q4 Enterprise Marketing Campaign')
    setChannel('Email Marketing')
    setVisualAsset('peltz.jpg')
    setDraftText(
      'Acme Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
    )
  }

  const handleLoadAdCreativeDraft = () => {
    setTitle('Instagram Retargeting Campaign Creative')
    setChannel('Ad Copy')
    setVisualAsset('peltz.jpg')
    setDraftText(
      'Acme Solutions is offering an innovative enterprise-grade governance platform. Sign up today for qualifying enterprise accounts.'
    )
  }

  const handleLoadCleanDraft = () => {
    setTitle('SOC-2 Compliance Update Newsletter')
    setChannel('Newsletter')
    setVisualAsset('security-badge.svg')
    setDraftText(
      'Acme Solutions delivers an enterprise-grade governance platform. We are pleased to announce full SOC-2 Type II and ISO 27001 compliance for all hosted accounts.'
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!draftText.trim()) return

    setIsAuditing(true)

<<<<<<< HEAD
    // Run deterministic + backend audit processing
    setTimeout(() => {
      const selectedProfile = brandProfiles.find((p) => p.id === selectedProfileId)
      onSubmitCheck({
        title: title || 'Untitled Content Draft',
        channel,
        brandProfileId: selectedProfileId,
        brandProfileName: selectedProfile?.name || 'Acme Corp',
        draftText,
        visualAssets: visualAsset ? [{ fileName: visualAsset, url: `/assets/${visualAsset}`, caption: 'Ad Creative Asset', complianceStatus: 'Compliant' }] : []
      })
      setIsAuditing(false)
    }, 700)
=======
    const selectedProfile = brandProfiles.find((p) => p.id === selectedProfileId)
    onSubmitCheck({
      title: title || 'Untitled Content Draft',
      channel,
      brandProfileId: selectedProfileId,
      brandProfileName: selectedProfile?.name || 'Standard Brand Profile',
      draftText,
      assetFile
    })
    setIsAuditing(false)
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Responsive Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#142B4A] transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
<<<<<<< HEAD
          <h2 className="text-xl sm:text-2xl font-bold text-[#142B4A]">Submit Content for Brand Review</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Check marketing copy, emails, or social posts against approved brand guidelines before publication.
=======
          <h2 className="text-2xl font-bold text-[#142B4A]">Submit Content for Brand Review</h2>
          <p className="text-sm text-gray-500">
            Check marketing copy and visual graphics against approved brand guidelines before publication.
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
          </p>
        </div>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleLoadSampleDraft}
            className="text-[11px] sm:text-xs bg-red-50 text-[#C62828] border border-red-200 hover:bg-red-100 font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Pre-fills draft containing known restricted phrases"
          >
            ⚡ Issues Draft
          </button>
          <button
            type="button"
            onClick={handleLoadAdCreativeDraft}
            className="text-[11px] sm:text-xs bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Pre-fills an ad creative check with peltz.jpg"
          >
            🖼️ Ad Creative
          </button>
          <button
            type="button"
            onClick={handleLoadCleanDraft}
            className="text-[11px] sm:text-xs bg-green-50 text-[#2E7D32] border border-green-200 hover:bg-green-100 font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Pre-fills a fully compliant draft"
          >
            ✅ Clean Draft
          </button>
        </div>
      </div>

      {/* Main Form Card with Responsive Padding */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Row 1: Title & Channel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Content Check Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Campaign Brief Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-xs sm:text-sm text-[#202833]"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Content Type / Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-xs sm:text-sm text-[#202833] bg-white"
            >
              <option value="Email Marketing">Email Marketing</option>
              <option value="Social Media">Social Media Post</option>
              <option value="Blog Post">Blog Post / Article</option>
              <option value="Press Release">Press Release</option>
              <option value="Ad Copy">Ad Copy &amp; Landing Page</option>
              <option value="Executive Speech">Executive Keynote</option>
            </select>
          </div>
        </div>

<<<<<<< HEAD
        {/* Row 2: Brand Profile Selector & Supported Visual Asset (Slide 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Target Brand Profile
            </label>
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-xs sm:text-sm text-[#202833] bg-white font-medium"
            >
              {brandProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.industry}) · {p.ruleCount} Rules Active
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Supported Visual Asset Attachment (Slide 5)
            </label>
            <select
              value={visualAsset}
              onChange={(e) => setVisualAsset(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-xs sm:text-sm text-[#202833] bg-white font-mono"
            >
              <option value="peltz.jpg">peltz.jpg (Instagram Story &amp; Banner Creative)</option>
              <option value="acme-logo.svg">acme-logo.svg (Vector Brand Logo)</option>
              <option value="security-badge.svg">security-badge.svg (SOC-2 Compliance Badge)</option>
              <option value="">None (Text-only audit)</option>
            </select>
          </div>
=======
        {/* Row 2: Brand Profile Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Target Brand Profile
          </label>
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833] bg-white font-medium"
          >
            {brandProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.industry}) · {p.ruleCount || 8} Rules Active
              </option>
            ))}
          </select>
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
        </div>

        {/* Row 3: Draft Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Draft Content Text
            </label>
            <span className="text-[10px] sm:text-xs text-gray-400 font-mono">
              {draftText.length} characters
            </span>
          </div>
          <textarea
            required
            rows={7}
            placeholder="Paste your marketing draft, email body, or social copy here for governance analysis..."
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-xs sm:text-sm text-[#202833] leading-relaxed resize-y"
          ></textarea>
        </div>

        {/* Row 4: Round 3 Improvement 1 — Multi-Modal Visual Asset Upload */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#176B59]" />
              <span>Visual Asset Governance (Optional Banner / Slide / Graphic)</span>
            </label>
            <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</span>
          </div>

          {!assetPreview ? (
            <label className="border-2 border-dashed border-gray-200 hover:border-[#142B4A] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#F5F7FA]/50 hover:bg-white group">
              <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#176B59] transition-colors mb-2" />
              <p className="text-sm font-semibold text-[#142B4A]">
                Click to upload or drag & drop visual asset
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Audits dominant HEX colors, WCAG contrast ratios, and logo padding rules.
              </p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="p-4 rounded-xl border border-gray-200 bg-[#F5F7FA] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={assetPreview}
                  alt="Asset Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-2xs"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#142B4A] truncate">
                    {assetFile?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(assetFile?.size / 1024).toFixed(1)} KB · {assetFile?.type}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7D32] mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for palette & contrast audit
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-[#C62828] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove uploaded image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {fileError && (
            <p className="text-xs text-[#C62828] font-semibold mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {fileError}
            </p>
          )}
        </div>

        {/* Audit Engine Notice */}
        <div className="bg-[#F5F7FA] rounded-lg p-3 sm:p-4 border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5 sm:gap-3">
          <AlertCircle className="w-4 h-4 text-[#176B59] shrink-0 mt-0.5" />
<<<<<<< HEAD
          <div className="text-[11px] sm:text-xs">
            <span className="font-semibold text-[#142B4A] block">Deterministic Rule Engine + Scikit-Learn Model</span>
            Scans draft against restricted terminology, mandatory claims, and approved phrasing. Results require human review before publishing.
=======
          <div>
            <span className="font-semibold text-[#142B4A] block">Multi-Modal Brand Governance Engine</span>
            Scans text copy against restricted phrases and terminology, extracts dominant image HEX swatches, calculates WCAG contrast ratios, and evaluates clear-space padding before publication.
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
          </div>
        </div>

        {/* Form Action Buttons (Responsive on Mobile) */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAuditing || !draftText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#142B4A] hover:bg-[#1a385f] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer text-center"
          >
            {isAuditing ? (
              <>
                <span className="animate-spin text-base">⚙️</span>
                <span>Auditing Draft & Visual Asset...</span>
              </>
            ) : (
              <>
<<<<<<< HEAD
                <span>Run Brand Check</span>
                <Send className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
=======
                <span>Run Brand Governance Check</span>
                <Send className="w-4 h-4" />
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
