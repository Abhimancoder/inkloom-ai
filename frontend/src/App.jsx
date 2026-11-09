import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardView from './views/DashboardView'
import NewCheckView from './views/NewCheckView'
import FindingsView from './views/FindingsView'
import BrandGuidelinesView from './views/BrandGuidelinesView'
import ReviewQueueView from './views/ReviewQueueView'
import LandingPageView from './views/LandingPageView'
import ApprovedCopyView from './views/ApprovedCopyView'
import IntegrationsView from './views/IntegrationsView'

import {
  SAMPLE_BRAND_PROFILES,
  SAMPLE_CONTENT_CHECKS,
  SAMPLE_FINDINGS,
  SAMPLE_REVIEW_QUEUE
} from './data/sampleData'

import {
  checkBackendHealth,
  getBrandProfiles,
  getContentChecks,
  submitContentCheck,
  submitReviewDecision,
  updateBrandProfile
} from './services/api'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [brandProfiles, setBrandProfiles] = useState(SAMPLE_BRAND_PROFILES)
  const [checks, setChecks] = useState(SAMPLE_CONTENT_CHECKS)
  const [findings, setFindings] = useState(SAMPLE_FINDINGS)
  const [reviewQueue, setReviewQueue] = useState(SAMPLE_REVIEW_QUEUE)
  const [selectedCheck, setSelectedCheck] = useState(SAMPLE_CONTENT_CHECKS[0])
  const [dbConnected, setDbConnected] = useState(false)

  // 1. Initial Data Fetch from MongoDB Atlas Backend
  useEffect(() => {
    async function initData() {
      const health = await checkBackendHealth()
      if (health?.database?.connected) {
        setDbConnected(true)

        // Fetch profiles from MongoDB
        const remoteProfiles = await getBrandProfiles()
        if (remoteProfiles && remoteProfiles.length > 0) {
          // Normalize _id to id for seamless UI compatibility
          const formattedProfiles = remoteProfiles.map((p) => ({
            ...p,
            id: p._id || p.id,
            ruleCount: (p.restrictedPhrases?.length || 0) + (p.requiredTerms?.length || 0)
          }))
          setBrandProfiles(formattedProfiles)
        }

        // Fetch checks from MongoDB
        const remoteChecks = await getContentChecks()
        if (remoteChecks && remoteChecks.length > 0) {
          const formattedChecks = remoteChecks.map((c) => ({
            ...c,
            id: c._id || c.id
          }))
          setChecks(formattedChecks)
        }
      } else {
        setDbConnected(false)
      }
    }

    initData()
  }, [])

  // 2. Submit Content Check via Backend API (Falls back to client engine if offline)
  const handleAuditSubmit = async ({ title, channel, brandProfileId, brandProfileName, draftText, assetFile }) => {
    try {
      // Build payload: use FormData if an image asset is attached
      let payload
      if (assetFile) {
        payload = new FormData()
        payload.append('title', title || 'Untitled Content Check')
        payload.append('channel', channel)
        payload.append('brandProfileId', brandProfileId)
        payload.append('submittedBy', 'Content Author (Current User)')
        payload.append('draftText', draftText)
        payload.append('asset', assetFile)
      } else {
        payload = {
          title,
          channel,
          brandProfileId,
          submittedBy: 'Content Author (Current User)',
          draftText
        }
      }

      // Attempt backend API call (Phase M5/M8 Axios integration)
      const result = await submitContentCheck(payload)

      if (result?.check && result?.findings) {
        const savedCheck = {
          ...result.check,
          id: result.check._id || result.check.id
        }

        const savedFindings = result.findings.map((f) => ({
          ...f,
          id: f._id || f.id
        }))

        setChecks([savedCheck, ...checks])
        setFindings(savedFindings)
        setSelectedCheck(savedCheck)

        // Add to review queue
        const newQueueItem = {
          id: `rev_${Date.now()}`,
          checkId: savedCheck.id,
          title: savedCheck.title,
          channel: savedCheck.channel,
          brandProfile: savedCheck.brandProfileName,
          submittedBy: savedCheck.submittedBy,
          submittedAgo: 'Just now',
          criticalIssues: savedCheck.criticalCount,
          warningIssues: savedCheck.warningCount,
          status: 'Pending Decision',
          reviewerNotes: ''
        }
        setReviewQueue([newQueueItem, ...reviewQueue])
        setCurrentView('findings')
        return
      }
    } catch (err) {
      console.warn('[Inkloom] Backend API not responding, using deterministic client fallback:', err.message)
    }

    // Client-side fallback if backend is offline
    const profile = brandProfiles.find((p) => p.id === brandProfileId) || brandProfiles[0]
    const newFindings = []
    const lowerDraft = draftText.toLowerCase()

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

    const fallbackCheck = {
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

    setChecks([fallbackCheck, ...checks])
    setFindings(newFindings)
    setSelectedCheck(fallbackCheck)

    const newQueueItem = {
      id: `rev_${Date.now()}`,
      checkId: fallbackCheck.id,
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
    setCurrentView('findings')
  }

  // 3. Human Review Decision via API
  const handleReviewDecision = async (queueId, decision, comment) => {
    const queueItem = reviewQueue.find((q) => q.id === queueId)

    if (queueItem?.checkId) {
      try {
        await submitReviewDecision({
          checkId: queueItem.checkId,
          decision,
          reviewerName: 'Abhiman (UX Lead)',
          reviewerNotes: comment
        })
      } catch (err) {
        console.warn('[Inkloom] Review decision saved in local state:', err.message)
      }

      setChecks((prev) =>
        prev.map((c) =>
          c.id === queueItem.checkId
            ? { ...c, status: decision === 'Approved' ? 'Approved' : 'Changes Requested' }
            : c
        )
      )
    }
  }

  // 4. Save Brand Profile via API
  const handleSaveProfile = async (updatedProfile) => {
    try {
      if (updatedProfile._id || updatedProfile.id) {
        await updateBrandProfile(updatedProfile._id || updatedProfile.id, updatedProfile)
      }
    } catch (err) {
      console.warn('[Inkloom] Profile updated in local state:', err.message)
    }

    setBrandProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    )
  }

  if (currentView === 'landing') {
    return <LandingPageView onEnterApp={() => setCurrentView('dashboard')} />
  }

  const viewTitles = {
    dashboard: { title: 'Studio Dashboard', subtitle: 'Real-time overview of content governance and recent reviews' },
    'new-check': { title: 'New Content Check', subtitle: 'Submit marketing copy or draft for automated inspection' },
    'brand-guidelines': { title: 'Brand Guidelines', subtitle: 'Maintain approved voice, restricted terminology and claims' },
    'approved-copy': { title: 'Approved Copy Library', subtitle: 'Gold-standard verified brand messaging corpus used for RAG re-writing' },
    findings: { title: 'Audit Findings', subtitle: 'Structured evidence, matched rules and suggested corrections' },
    'review-queue': { title: 'Review Queue', subtitle: 'Human reviewer approval gate before content publication' },
    integrations: { title: 'Webhook & CMS Integrations', subtitle: 'Manage Slack alerts, HubSpot, and WordPress headless connectors' },
    history: { title: 'Audit History & Logs', subtitle: 'Historical record of content checks and reviewer decisions' },
    reports: { title: 'Governance Reports', subtitle: 'Compliance metrics and recurring brand violation trends' },
    settings: { title: 'Studio Settings', subtitle: 'Platform preferences and team role configurations' }
  }

  const activeHeader = viewTitles[currentView] || { title: 'Inkloom AI Studio', subtitle: '' }
  const pendingReviewCount = reviewQueue.filter((q) => q.status === 'Pending Decision').length

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#202833] font-sans">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        pendingReviewCount={pendingReviewCount}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={activeHeader.title}
          subtitle={
            <span className="flex items-center gap-2">
              <span>{activeHeader.subtitle}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                {dbConnected ? 'MongoDB Atlas Live' : 'Local Offline Mode'}
              </span>
            </span>
          }
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
              onSendToReviewQueue={() => setCurrentView('review-queue')}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'brand-guidelines' && (
            <BrandGuidelinesView
              brandProfiles={brandProfiles}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentView === 'approved-copy' && (
            <ApprovedCopyView brandProfiles={brandProfiles} />
          )}

          {currentView === 'review-queue' && (
            <ReviewQueueView
              queueItems={reviewQueue}
              onReviewDecision={handleReviewDecision}
            />
          )}

          {currentView === 'integrations' && (
            <IntegrationsView />
          )}

          {currentView === 'history' && (
            <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-100 shadow-xs p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#142B4A]">Audit History & Compliance Logs</h2>
                  <p className="text-sm text-gray-500">
                    Full chronological audit trail of all drafts analyzed, matched rules, and reviewer decisions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(checks, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Inkloom_All_Audits_History_${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="px-3.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-[#142B4A] rounded-lg transition-colors cursor-pointer"
                >
                  Download History JSON
                </button>
              </div>
              <div className="divide-y divide-gray-100 pt-4">
                {checks.map((c) => (
                  <div key={c.id || c._id} className="py-4 flex items-center justify-between text-sm">
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
                Active governance module running with live MongoDB Atlas connection.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
