import React, { useState, useEffect } from 'react'
import { Send, FileEdit, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'

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
  const [draftText, setDraftText] = useState('')
  const [isAuditing, setIsAuditing] = useState(false)

  // Sync selectedProfileId when brandProfiles updates (e.g. loaded from MongoDB Atlas)
  useEffect(() => {
    if (brandProfiles?.length > 0 && !brandProfiles.some((p) => p.id === selectedProfileId)) {
      setSelectedProfileId(brandProfiles[0].id)
    }
  }, [brandProfiles, selectedProfileId])

  // Sample quick-fill draft for instant hackathon demonstration
  const handleLoadSampleDraft = () => {
    setTitle('Q4 Enterprise Marketing Campaign')
    setChannel('Email Marketing')
    setDraftText(
      'TechCorp Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
    )
  }

  const handleLoadCleanDraft = () => {
    setTitle('SOC-2 Compliance Update Newsletter')
    setChannel('Newsletter')
    setDraftText(
      'TechCorp Solutions delivers an enterprise-grade governance platform. We are pleased to announce full SOC-2 Type II and ISO 27001 compliance for all hosted accounts.'
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!draftText.trim()) return

    setIsAuditing(true)

    // Simulate fast deterministic audit processing
    setTimeout(() => {
      const selectedProfile = brandProfiles.find((p) => p.id === selectedProfileId)
      onSubmitCheck({
        title: title || 'Untitled Content Draft',
        channel,
        brandProfileId: selectedProfileId,
        brandProfileName: selectedProfile?.name || 'Standard Brand Profile',
        draftText
      })
      setIsAuditing(false)
    }, 700)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#142B4A] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h2 className="text-2xl font-bold text-[#142B4A]">Submit Content for Brand Review</h2>
          <p className="text-sm text-gray-500">
            Check marketing copy, emails, or social posts against approved brand guidelines before publication.
          </p>
        </div>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleLoadSampleDraft}
            className="text-xs bg-red-50 text-[#C62828] border border-red-200 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Pre-fills draft containing known restricted phrases"
          >
            ⚡ Load Draft with Issues
          </button>
          <button
            type="button"
            onClick={handleLoadCleanDraft}
            className="text-xs bg-green-50 text-[#2E7D32] border border-green-200 hover:bg-green-100 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Pre-fills a fully compliant draft"
          >
            ✅ Load Clean Draft
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-xs p-8 space-y-6">
        {/* Row 1: Title & Channel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Content Check Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Campaign Brief Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Content Type / Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833] bg-white"
            >
              <option value="Email Marketing">Email Marketing</option>
              <option value="Social Media">Social Media Post</option>
              <option value="Blog Post">Blog Post / Article</option>
              <option value="Press Release">Press Release</option>
              <option value="Ad Copy">Ad Copy & Landing Page</option>
              <option value="Executive Speech">Executive Keynote</option>
            </select>
          </div>
        </div>

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
                {p.name} ({p.industry}) · {p.ruleCount} Rules Active
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Draft Text Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Draft Content Text
            </label>
            <span className="text-xs text-gray-400 font-mono">
              {draftText.length} characters
            </span>
          </div>
          <textarea
            required
            rows={8}
            placeholder="Paste your marketing draft, email body, or social copy here for governance analysis..."
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833] leading-relaxed resize-y"
          ></textarea>
        </div>

        {/* Audit Engine Notice */}
        <div className="bg-[#F5F7FA] rounded-lg p-4 border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#176B59] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#142B4A] block">Deterministic Rule Engine</span>
            Scans draft against restricted terminology, mandatory claims, and approved phrasing. Results require human review before publishing.
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAuditing || !draftText.trim()}
            className="inline-flex items-center gap-2 bg-[#142B4A] hover:bg-[#1a385f] disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            {isAuditing ? (
              <>
                <span className="animate-spin text-base">⚙️</span>
                <span>Auditing Draft...</span>
              </>
            ) : (
              <>
                <span>Run Brand Check</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
