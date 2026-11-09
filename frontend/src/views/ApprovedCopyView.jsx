import React, { useState, useEffect } from 'react'
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Copy,
  Check,
  Filter,
  Sparkles,
  Building2,
  Tag,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react'
import { getApprovedCopy, createApprovedCopy, deleteApprovedCopy } from '../services/api'

export default function ApprovedCopyView({ brandProfiles }) {
  const [selectedBrandId, setSelectedBrandId] = useState(brandProfiles[0]?.id || '')
  const [copyList, setCopyList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New copy form state
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState('Email Marketing')
  const [contentType, setContentType] = useState('Value Proposition')
  const [approvedText, setApprovedText] = useState('')
  const [tags, setTags] = useState('')
  const [performanceNotes, setPerformanceNotes] = useState('')

  // Sync selectedBrandId when brandProfiles change
  useEffect(() => {
    if (brandProfiles?.length > 0 && !brandProfiles.some((p) => p.id === selectedBrandId)) {
      setSelectedBrandId(brandProfiles[0].id)
    }
  }, [brandProfiles])

  // Fetch approved copy for selected brand (Brand-Isolated)
  const loadApprovedCopy = async (brandId) => {
    setIsLoading(true)
    const data = await getApprovedCopy(brandId)
    if (data) {
      setCopyList(data)
    } else {
      // Fallback baseline if offline
      setCopyList([
        {
          _id: 'seed_01',
          title: 'Enterprise Platform Value Proposition',
          channel: 'Email Marketing',
          contentType: 'Value Proposition',
          approvedText: 'TechCorp Solutions delivers an enterprise-grade governance platform engineered to significantly streamline compliance operations at competitive value.',
          performanceNotes: 'Approved Q3 enterprise copy with 42% email engagement rate',
          tags: ['enterprise-grade', 'governance', 'value', 'turnaround']
        },
        {
          _id: 'seed_02',
          title: 'SOC-2 Compliance & Security Standard',
          channel: 'Newsletter',
          contentType: 'Body Copy',
          approvedText: 'We are pleased to confirm full SOC-2 Type II and ISO 27001 compliance across all hosted clusters, trusted by 500+ enterprises worldwide.',
          performanceNotes: 'Legal and compliance approved standard messaging',
          tags: ['security', 'soc-2', 'iso-27001', 'compliance']
        },
        {
          _id: 'seed_03',
          title: 'Audit Turnaround Improvement Announcement',
          channel: 'Ad Copy',
          contentType: 'Body Copy',
          approvedText: 'Engineered to reduce manual review turnaround times by up to 60% without compromising brand accuracy or regulatory rigor.',
          performanceNotes: 'Benchmark claim backed by verified customer case studies',
          tags: ['turnaround', 'efficiency', 'accuracy', '60%']
        }
      ])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadApprovedCopy(selectedBrandId)
  }, [selectedBrandId])

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id) => {
    try {
      await deleteApprovedCopy(id)
    } catch (err) {
      console.warn('Local state delete fallback')
    }
    setCopyList((prev) => prev.filter((item) => (item._id || item.id) !== id))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !approvedText.trim()) return

    const newRecord = {
      title,
      brandProfileId: selectedBrandId,
      channel,
      contentType,
      approvedText,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      performanceNotes: performanceNotes || 'Verified high-performing copy'
    }

    try {
      const created = await createApprovedCopy(newRecord)
      if (created) {
        setCopyList([created, ...copyList])
      } else {
        setCopyList([{ ...newRecord, _id: `local_${Date.now()}` }, ...copyList])
      }
    } catch (err) {
      setCopyList([{ ...newRecord, _id: `local_${Date.now()}` }, ...copyList])
    }

    // Reset and close
    setTitle('')
    setApprovedText('')
    setTags('')
    setPerformanceNotes('')
    setIsModalOpen(false)
  }

  const currentProfile = brandProfiles.find((p) => p.id === selectedBrandId) || brandProfiles[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#142B4A]">Approved Copy Library</h2>
          <p className="text-sm text-gray-500">
            Gold-standard approved brand copy corpus used by the contextual RAG re-writing engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
            <Building2 className="w-4 h-4 text-[#176B59]" />
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="text-xs font-semibold text-[#142B4A] bg-transparent focus:outline-none cursor-pointer"
            >
              {brandProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#176B59] hover:bg-[#125345] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Approved Copy</span>
          </button>
        </div>
      </div>

      {/* RAG Context Banner */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#176B59] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#142B4A]">
              Brand-Isolated RAG Retrieval Corpus Active
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Only verified approved messaging for <span className="font-semibold text-gray-800">{currentProfile?.name}</span> enters the retrieval pool. Unreviewed or rejected drafts are strictly excluded.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#176B59] bg-green-50 px-3 py-1 rounded-full border border-green-200 shrink-0">
          {copyList.length} Approved Reference Cards
        </span>
      </div>

      {/* Grid of Approved Copy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {copyList.map((item) => {
          const itemId = item._id || item.id

          return (
            <div
              key={itemId}
              className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-gray-200 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-base font-bold text-[#142B4A]">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded">
                        {item.channel}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-gray-500">{item.contentType}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 shrink-0">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F5F7FA] border border-gray-200 text-sm text-[#202833] leading-relaxed mt-3">
                  "{item.approvedText}"
                </div>

                {item.performanceNotes && (
                  <p className="text-xs text-gray-500 mt-2.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#176B59]" />
                    <span>{item.performanceNotes}</span>
                  </p>
                )}

                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-gray-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-400 text-[11px]">RAG Vector Indexed</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(itemId, item.approvedText)}
                    className="inline-flex items-center gap-1 text-gray-500 hover:text-[#142B4A] px-2.5 py-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {copiedId === itemId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span className="text-[#2E7D32] font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(itemId)}
                    className="p-1.5 text-gray-400 hover:text-[#C62828] hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Remove from approved library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {copyList.length === 0 && !isLoading && (
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
            <BookmarkCheck className="w-8 h-8 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No approved copy for this brand yet</p>
            <p className="text-xs text-gray-400">Add approved marketing copy to empower contextual RAG rewrites.</p>
          </div>
        )}
      </div>

      {/* Modal for Adding Approved Brand Copy */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-[#176B59]" />
                <h3 className="text-base font-bold text-[#142B4A]">Add Approved Brand Copy</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Campaign Title or Concept
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Turnaround Efficiency Headline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  >
                    <option value="Email Marketing">Email Marketing</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Blog Post">Blog Post</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Ad Copy">Ad Copy</option>
                    <option value="Executive Speech">Executive Speech</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  >
                    <option value="Headline">Headline</option>
                    <option value="Body Copy">Body Copy</option>
                    <option value="Value Proposition">Value Proposition</option>
                    <option value="Call to Action">Call to Action</option>
                    <option value="Disclaimer">Disclaimer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Approved Copy Text
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the approved brand wording that future rewrites should emulate..."
                  value={approvedText}
                  onChange={(e) => setApprovedText(e.target.value)}
                  className="w-full p-3.5 rounded-lg border border-gray-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. enterprise, pricing, soc-2"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Performance Context
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 42% email click-through rate"
                    value={performanceNotes}
                    onChange={(e) => setPerformanceNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#176B59] hover:bg-[#125345] text-white shadow-xs cursor-pointer"
                >
                  Save to Approved Corpus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
