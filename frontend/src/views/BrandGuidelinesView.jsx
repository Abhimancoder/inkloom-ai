import React, { useState } from 'react'
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Building2,
  Save,
  Tag
} from 'lucide-react'

export default function BrandGuidelinesView({
  brandProfiles,
  onSaveProfile
}) {
  const [selectedProfile, setSelectedProfile] = useState(brandProfiles[0])
  const [newRestrictedPhrase, setNewRestrictedPhrase] = useState('')
  const [newRequiredTerm, setNewRequiredTerm] = useState('')
  const [isSavedNotice, setIsSavedNotice] = useState(false)

  // Local state for editing active profile
  const [formData, setFormData] = useState({ ...brandProfiles[0] })

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile)
    setFormData({ ...profile })
  }

  const handleAddRestrictedPhrase = (e) => {
    e.preventDefault()
    if (!newRestrictedPhrase.trim()) return
    setFormData((prev) => ({
      ...prev,
      restrictedPhrases: [...prev.restrictedPhrases, newRestrictedPhrase.trim()]
    }))
    setNewRestrictedPhrase('')
  }

  const handleRemoveRestrictedPhrase = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      restrictedPhrases: prev.restrictedPhrases.filter((_, i) => i !== indexToRemove)
    }))
  }

  const handleAddRequiredTerm = (e) => {
    e.preventDefault()
    if (!newRequiredTerm.trim()) return
    setFormData((prev) => ({
      ...prev,
      requiredTerms: [...prev.requiredTerms, newRequiredTerm.trim()]
    }))
    setNewRequiredTerm('')
  }

  const handleRemoveRequiredTerm = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredTerms: prev.requiredTerms.filter((_, i) => i !== indexToRemove)
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSaveProfile(formData)
    setIsSavedNotice(true)
    setTimeout(() => setIsSavedNotice(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#142B4A]">Brand Guidelines Management</h2>
          <p className="text-sm text-gray-500">
            Define approved voice, restricted terminology, and approved claims used by the governance engine.
          </p>
        </div>

        {isSavedNotice && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-[#2E7D32] border border-green-200">
            <CheckCircle className="w-4 h-4" />
            <span>Guidelines Saved Successfully!</span>
          </span>
        )}
      </div>

      {/* Brand Profile Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {brandProfiles.map((p) => {
          const isSelected = selectedProfile?.id === p.id

          return (
            <div
              key={p.id}
              onClick={() => handleSelectProfile(p)}
              className={`p-5 rounded-xl border transition-all cursor-pointer bg-white shadow-xs ${
                isSelected
                  ? 'border-[#142B4A] ring-2 ring-[#142B4A]/10'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#142B4A]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#142B4A]">{p.name}</h3>
                    <p className="text-xs text-gray-400">{p.industry}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'Active'
                      ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 mt-3">
                <span className="font-semibold text-gray-700">Tone:</span> {p.tone}
              </p>
            </div>
          )
        })}
      </div>

      {/* Active Profile Configuration Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 shadow-xs p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#142B4A]">
            Configure Profile: {formData.name}
          </h3>
          <span className="text-xs text-gray-400">Deterministic rule definition</span>
        </div>

        {/* Brand Name & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Brand Profile Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Industry Category
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833]"
            />
          </div>
        </div>

        {/* Approved Tone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Approved Voice & Tone
          </label>
          <input
            type="text"
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            placeholder="e.g. Professional, authoritative, customer-focused, innovative"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 focus:border-[#142B4A] text-sm text-[#202833]"
          />
        </div>

        {/* Restricted Phrases (Chips) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Restricted Phrases (Flagged as Critical Issues)
            </label>
            <span className="text-xs text-gray-400">
              {formData.restrictedPhrases.length} restricted phrases
            </span>
          </div>

          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200 min-h-[50px] mb-3">
            {formData.restrictedPhrases.map((phrase, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-[#C62828] border border-red-200"
              >
                <span>"{phrase}"</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRestrictedPhrase(idx)}
                  className="hover:text-red-800 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add another restricted phrase (e.g. 'miracle', 'free gift')..."
              value={newRestrictedPhrase}
              onChange={(e) => setNewRestrictedPhrase(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
            />
            <button
              type="button"
              onClick={handleAddRestrictedPhrase}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Add Phrase
            </button>
          </div>
        </div>

        {/* Required Terminology */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Required Brand Terminology
            </label>
            <span className="text-xs text-gray-400">
              {formData.requiredTerms.length} required terms
            </span>
          </div>

          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200 min-h-[50px] mb-3">
            {formData.requiredTerms.map((term, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-[#142B4A] border border-blue-200"
              >
                <span>{term}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequiredTerm(idx)}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add required term (e.g. 'TechCorp Solutions')..."
              value={newRequiredTerm}
              onChange={(e) => setNewRequiredTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
            />
            <button
              type="button"
              onClick={handleAddRequiredTerm}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Add Term
            </button>
          </div>
        </div>

        {/* Approved Claims */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Approved Claims & Evidence References
          </label>
          <textarea
            rows={3}
            value={formData.approvedClaims.join('\n')}
            onChange={(e) =>
              setFormData({
                ...formData,
                approvedClaims: e.target.value.split('\n').filter((l) => l.trim())
              })
            }
            placeholder="One approved claim per line..."
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 text-sm text-[#202833] font-mono leading-relaxed"
          ></textarea>
        </div>

        {/* Visual Guidance */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Visual Guidance (Colors, Logo Safe Margins)
          </label>
          <input
            type="text"
            value={formData.visualGuidance || ''}
            onChange={(e) => setFormData({ ...formData, visualGuidance: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20 text-sm text-[#202833]"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#142B4A] hover:bg-[#1a385f] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Brand Guidelines</span>
          </button>
        </div>
      </form>
    </div>
  )
}
