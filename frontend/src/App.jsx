import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardView from './views/DashboardView'
import NewCheckView from './views/NewCheckView'
import FindingsView from './views/FindingsView'
import BrandGuidelinesView from './views/BrandGuidelinesView'
import ReviewQueueView from './views/ReviewQueueView'
import LandingPageView from './views/LandingPageView'

import {
  SAMPLE_BRAND_PROFILES,
  SAMPLE_CONTENT_CHECKS,
  SAMPLE_FINDINGS,
  SAMPLE_REVIEW_QUEUE
} from './data/sampleData'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [brandProfiles, setBrandProfiles] = useState(SAMPLE_BRAND_PROFILES)
  const [checks, setChecks] = useState(SAMPLE_CONTENT_CHECKS)
  const [findings, setFindings] = useState(SAMPLE_FINDINGS)
  const [reviewQueue, setReviewQueue] = useState(SAMPLE_REVIEW_QUEUE)
  const [selectedCheck, setSelectedCheck] = useState(SAMPLE_CONTENT_CHECKS[0])

  // Deterministic Audit Rule Engine (Runs directly in client state)
  const handleAuditSubmit = ({ title, channel, brandProfileId, brandProfileName, draftText }) => {
    const profile = brandProfiles.find((p) => p.id === brandProfileId) || brandProfiles[0]

    const newFindings = []
    const lowerDraft = draftText.toLowerCase()

    // 1. Scan for Restricted Phrases (Critical Violations)
    profile.restrictedPhrases.forEach((phrase, idx) => {
      if (lowerDraft.includes(phrase.toLowerCase())) {
        newFindings.push({
          id: `gen_crit_${idx}_${Date.now()}`,
          checkId: `chk_${Date.now()}`,
          severity: 'Critical',
          severityType: 'critical',
          category: 'Restricted Phrase',
          excerpt: `...${phrase}...`,
          matchedRule: `Restricted phrase detected: "${phrase}"`,
          explanation: `The term "${phrase}" violates the locked ${profile.name} brand guidelines. Please replace with compliant alternative wording.`,
          confidence: 'Deterministic Match (100%)',
          suggestedCorrection: phrase === 'cheap' ? 'cost-effective' : phrase === 'best in class' ? 'enterprise-grade' : 'verified',
          status: 'Needs Review'
        })
      }
    })

    // 2. Scan for Required Terminology
    profile.requiredTerms.forEach((term, idx) => {
      const isPresent = lowerDraft.includes(term.toLowerCase())
      if (isPresent) {
        newFindings.push({
          id: `gen_req_pass_${idx}_${Date.now()}`,
          checkId: `chk_${Date.now()}`,
          severity: 'Passed',
          severityType: 'passed',
          category: 'Required Terminology',
          excerpt: `...${term}...`,
          matchedRule: `Mandatory brand term present: "${term}"`,
          explanation: `Mandatory naming convention was used correctly in draft.`,
          confidence: 'Confirmed Match',
          suggestedCorrection: null,
          status: 'Passed Check'
        })
      } else {
        newFindings.push({
          id: `gen_req_warn_${idx}_${Date.now()}`,
          checkId: `chk_${Date.now()}`,
          severity: 'Warning',
          severityType: 'warning',
          category: 'Missing Required Term',
          excerpt: 'Draft content',
          matchedRule: `Missing mandatory brand terminology: "${term}"`,
          explanation: `Recommended to explicitly include approved term "${term}" for brand consistency.`,
          confidence: 'Possible mismatch',
          suggestedCorrection: `Ensure "${term}" is mentioned in the opening paragraph.`,
          status: 'Needs Review'
        })
      }
    })

    const criticalCount = newFindings.filter((f) => f.severityType === 'critical').length
    const warningCount = newFindings.filter((f) => f.severityType === 'warning').length
    const passedCount = newFindings.filter((f) => f.severityType === 'passed').length

    let status = 'Approved'
    let statusType = 'passed'
    if (criticalCount > 0) {
      status = 'Issues Found'
      statusType = 'critical'
    } else if (warningCount > 0) {
      status = 'Pending Review'
      statusType = 'warning'
    }

    const newCheckRecord = {
      id: `chk_${Date.now()}`,
      title,
      channel,
      brandProfileId,
      brandProfileName,
      submittedBy: 'Current Author',
      submittedAt: new Date().toISOString(),
      status,
      statusType,
      criticalCount,
      warningCount,
      passedCount,
      draftText
    }

    setChecks([newCheckRecord, ...checks])
    setFindings(newFindings)
    setSelectedCheck(newCheckRecord)

    // Also add to review queue
    const newQueueItem = {
      id: `rev_${Date.now()}`,
      checkId: newCheckRecord.id,
      title,
      channel,
      brandProfile: brandProfileName,
      submittedBy: 'Current Author',
      submittedAgo: 'Just now',
      criticalIssues: criticalCount,
      warningIssues: warningCount,
      status: 'Pending Decision',
      reviewerNotes: ''
    }
    setReviewQueue([newQueueItem, ...reviewQueue])

    // Direct user to the findings page
    setCurrentView('findings')
  }

  const handleSendToReviewQueue = (check, activeDraft) => {
    setCurrentView('review-queue')
  }

  const handleReviewDecision = (queueId, decision, comment) => {
    // Sync check status
    const queueItem = reviewQueue.find((q) => q.id === queueId)
    if (queueItem) {
      setChecks((prev) =>
        prev.map((c) =>
          c.id === queueItem.checkId
            ? { ...c, status: decision === 'Approved' ? 'Approved' : 'Changes Requested' }
            : c
        )
      )
    }
  }

  const handleSaveProfile = (updatedProfile) => {
    setBrandProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    )
  }

  // If user is on the Public Landing Page
  if (currentView === 'landing') {
    return <LandingPageView onEnterApp={() => setCurrentView('dashboard')} />
  }

  // Get active screen title & subtitle
  const viewTitles = {
    dashboard: { title: 'Studio Dashboard', subtitle: 'Real-time overview of content governance and recent reviews' },
    'new-check': { title: 'New Content Check', subtitle: 'Submit marketing copy or draft for automated inspection' },
    'brand-guidelines': { title: 'Brand Guidelines', subtitle: 'Maintain approved voice, restricted terminology and claims' },
    findings: { title: 'Audit Findings', subtitle: 'Structured evidence, matched rules and suggested corrections' },
    'review-queue': { title: 'Review Queue', subtitle: 'Human reviewer approval gate before content publication' },
    history: { title: 'Audit History & Logs', subtitle: 'Historical record of content checks and reviewer decisions' },
    reports: { title: 'Governance Reports', subtitle: 'Compliance metrics and recurring brand violation trends' },
    settings: { title: 'Studio Settings', subtitle: 'Platform preferences and team role configurations' }
  }

  const activeHeader = viewTitles[currentView] || { title: 'Inkloom AI Studio', subtitle: '' }
  const pendingReviewCount = reviewQueue.filter((q) => q.status === 'Pending Decision').length

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#202833] font-sans">
      {/* Locked Inkloom Studio Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        pendingReviewCount={pendingReviewCount}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={activeHeader.title}
          subtitle={activeHeader.subtitle}
          onNewCheckClick={currentView !== 'new-check' ? () => setCurrentView('new-check') : null}
        />

        <main className="p-8 flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              checks={checks}
              onNavigate={setCurrentView}
              onSelectCheck={setSelectedCheck}
            />
          )}

          {currentView === 'new-check' && (
            <NewCheckView
              brandProfiles={brandProfiles}
              onSubmitCheck={handleAuditSubmit}
              onCancel={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'findings' && (
            <FindingsView
              currentCheck={selectedCheck}
              findings={findings}
              onSendToReviewQueue={handleSendToReviewQueue}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'brand-guidelines' && (
            <BrandGuidelinesView
              brandProfiles={brandProfiles}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentView === 'review-queue' && (
            <ReviewQueueView
              queueItems={reviewQueue}
              onReviewDecision={handleReviewDecision}
            />
          )}

          {currentView === 'history' && (
            <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-100 shadow-xs p-8 space-y-4">
              <h2 className="text-xl font-bold text-[#142B4A]">Audit History & Compliance Logs</h2>
              <p className="text-sm text-gray-500">
                Full chronological audit trail of all drafts analyzed, matched rules, and reviewer decisions.
              </p>
              <div className="divide-y divide-gray-100 pt-4">
                {checks.map((c) => (
                  <div key={c.id} className="py-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Brand: {c.brandProfileName} · Channel: {c.channel} · Author: {c.submittedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          c.status === 'Approved'
                            ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                            : c.status === 'Issues Found'
                            ? 'bg-red-50 text-[#C62828] border border-red-200'
                            : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(currentView === 'reports' || currentView === 'settings') && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
              <p className="text-base font-semibold text-gray-700 capitalize">{currentView} Module</p>
              <p className="text-xs text-gray-400">
                Additional governance tools will connect here as we integrate backend endpoints in Phase M3.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
