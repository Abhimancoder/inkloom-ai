import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Activity,
  PlusCircle,
  Search,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardView from './views/DashboardView'
import NewCheckView from './views/NewCheckView'
import FindingsView from './views/FindingsView'
import BrandGuidelinesView from './views/BrandGuidelinesView'
import ReviewQueueView from './views/ReviewQueueView'
import MonitoringView from './views/MonitoringView'
import ReportsView from './views/ReportsView'
import SettingsView from './views/SettingsView'
import LandingPageView from './views/LandingPageView'

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
  getContentCheckDetail,
  submitContentCheck,
  submitReviewDecision,
  updateBrandProfile
} from './services/api'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
  const handleAuditSubmit = async ({ title, channel, brandProfileId, brandProfileName, draftText }) => {
    try {
      const result = await submitContentCheck({
        title,
        channel,
        brandProfileId,
        submittedBy: 'Content Author (Current User)',
        draftText
      })

      if (result?.check && result?.findings) {
        const savedCheck = {
          ...result.check,
          id: result.check._id || result.check.id,
          mlInsights: result.mlInsights || result.check.mlInsights,
          visualAnalytics: result.visualAnalytics || result.check.visualAnalytics
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
      }
    })

    const critCount = newFindings.filter((f) => f.severityType === 'critical').length
    const warnCount = newFindings.filter((f) => f.severityType === 'warning').length
    const passCount = newFindings.filter((f) => f.severityType === 'passed').length

    let status = 'Approved'
    let statusType = 'passed'

    if (critCount > 0) {
      status = 'Issues Found'
      statusType = 'critical'
    } else if (warnCount > 0) {
      status = 'Pending Review'
      statusType = 'warning'
    }

    const newCheckRecord = {
      id: `chk_${Date.now()}`,
      title: title || 'Untitled Content Check',
      channel: channel || 'Email Marketing',
      brandProfileName: profile.name,
      submittedBy: 'Content Author (Current User)',
      status,
      statusType,
      criticalCount: critCount,
      warningCount: warnCount,
      passedCount: passCount,
      draftText
    }

    setChecks([newCheckRecord, ...checks])
    setFindings(newFindings)
    setSelectedCheck(newCheckRecord)

    const newQueueItem = {
      id: `rev_${Date.now()}`,
      checkId: newCheckRecord.id,
      title: newCheckRecord.title,
      channel: newCheckRecord.channel,
      brandProfile: newCheckRecord.brandProfileName,
      submittedBy: newCheckRecord.submittedBy,
      submittedAgo: 'Just now',
      criticalIssues: critCount,
      warningIssues: warnCount,
      status: 'Pending Decision',
      reviewerNotes: ''
    }
    setReviewQueue([newQueueItem, ...reviewQueue])
    setCurrentView('findings')
  }

  // 3. Select check with specific findings
  const handleSelectCheckWithFindings = async (check) => {
    setSelectedCheck(check)

    if (dbConnected && check._id) {
      try {
        const detail = await getContentCheckDetail(check._id)
        if (detail?.findings && detail.findings.length > 0) {
          const formatted = detail.findings.map((f) => ({
            ...f,
            id: f._id || f.id
          }))
          setFindings(formatted)
          return
        }
      } catch (err) {
        console.warn('Error fetching detailed findings from MongoDB:', err.message)
      }
    }

    // Heuristic findings if local/fallback
    const profile = brandProfiles.find((p) => p.name === check.brandProfileName) || brandProfiles[0]
    const matched = []
    const lower = (check.draftText || '').toLowerCase()

    profile.restrictedPhrases.forEach((phrase, idx) => {
      if (lower.includes(phrase.toLowerCase())) {
        matched.push({
          id: `fnd_${check.id || check._id}_${idx}`,
          checkId: check.id || check._id,
          severity: 'Critical',
          severityType: 'critical',
          category: 'Restricted Phrase',
          excerpt: `...${phrase}...`,
          matchedRule: `Restricted phrase detected: "${phrase}"`,
          explanation: `The term "${phrase}" violates brand governance standards. Use approved enterprise phrasing.`,
          confidence: 'Deterministic Match (100%)',
          suggestedCorrection: phrase === 'cheap' ? 'cost-effective' : phrase === 'best in class' ? 'enterprise-grade' : 'guaranteed results with verified SLAs',
          status: 'Needs Review'
        })
      }
    })

    if (matched.length === 0) {
      matched.push({
        id: `fnd_pass_${check.id || check._id}`,
        checkId: check.id || check._id,
        severity: 'Passed',
        severityType: 'passed',
        category: 'Brand Voice & Tone',
        excerpt: check.draftText?.substring(0, 45) + '...',
        matchedRule: 'Adherence to approved brand tone',
        explanation: 'Content complies with enterprise tone benchmarks and contains no restricted terms.',
        confidence: 'Confirmed Match',
        suggestedCorrection: null,
        status: 'Passed Check'
      })
    }

    setFindings(matched)
  }

  // 4. Update brand profile in MongoDB or local state
  const handleSaveProfile = async (updatedProfile) => {
    if (dbConnected && updatedProfile._id) {
      try {
        const saved = await updateBrandProfile(updatedProfile._id, updatedProfile)
        if (saved) {
          setBrandProfiles((prev) =>
            prev.map((p) => ((p._id || p.id) === (saved._id || saved.id) ? { ...saved, id: saved._id || saved.id } : p))
          )
          return
        }
      } catch (err) {
        console.warn('Error updating profile in MongoDB:', err.message)
      }
    }

    setBrandProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    )
  }

  // 5. Submit review decision to MongoDB or local state
  const handleReviewDecision = async (queueItemId, decision, reviewerNotes = '', reviewerRole = 'Brand Manager', reviewerName = 'Abhiman') => {
    const targetItem = reviewQueue.find((q) => q.id === queueItemId)

    if (dbConnected && targetItem?.checkId) {
      try {
        await submitReviewDecision({
          checkId: targetItem.checkId,
          decision,
          reviewerName,
          reviewerRole,
          reviewerNotes
        })
      } catch (err) {
        console.warn('Error saving decision to MongoDB:', err.message)
      }
    }

    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === queueItemId
          ? {
              ...item,
              status: decision,
              decisionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reviewerNotes: reviewerNotes || `Marked as ${decision}`
            }
          : item
      )
    )

    if (targetItem?.checkId) {
      setChecks((prev) =>
        prev.map((c) =>
          (c.id === targetItem.checkId || c._id === targetItem.checkId)
            ? { ...c, status: decision, statusType: decision === 'Approved' ? 'passed' : 'warning' }
            : c
        )
      )
    }
  }

  // If user opens Public Landing Page
  if (currentView === 'landing') {
    return <LandingPageView onEnterApp={() => setCurrentView('dashboard')} />
  }

  const viewTitles = {
    dashboard: { title: 'Studio Dashboard', subtitle: 'Overview of automated brand compliance and ongoing audit activity' },
    monitoring: { title: 'Continuous Brand Monitoring', subtitle: 'Real-time channel surveillance and regression scanning' },
    'new-check': { title: 'New Content Check', subtitle: 'Deterministic multi-factor audit against locked brand standards' },
    findings: { title: 'Findings & Evidence', subtitle: 'Detailed rule match analysis, suggestions, and visual evidence' },
    'brand-guidelines': { title: 'Brand Guidelines Management', subtitle: 'Configure restricted phrases, mandatory terms, and voice' },
    'review-queue': { title: 'Human Review Queue', subtitle: 'Enterprise sign-off and role-based publishing authorization' },
    reports: { title: 'Governance Reports & Analytics', subtitle: 'Audit-ready compliance certificates and Matplotlib visual analytics' },
    history: { title: 'Audit History & Logs', subtitle: 'Historical record of content checks and reviewer decisions' },
    settings: { title: 'Platform Settings & Roles', subtitle: 'Cross-functional governance permissions and MongoDB diagnostics' }
  }

  const activeHeader = viewTitles[currentView] || { title: 'Inkloom AI Studio', subtitle: '' }
  const pendingReviewCount = reviewQueue.filter((q) => q.status === 'Pending Decision').length

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#202833] font-sans antialiased">
      {/* Responsive Sidebar (Slide-in Drawer on mobile/tablet, Sticky on desktop) */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        pendingReviewCount={pendingReviewCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Responsive Header with Hamburger Menu for Mobile/Tablet */}
        <Header
          title={activeHeader.title}
          subtitle={
            <span className="flex items-center gap-2">
              <span>{activeHeader.subtitle}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gray-50 text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                {dbConnected ? 'MongoDB Live' : 'Local Mode'}
              </span>
            </span>
          }
          onNewCheckClick={currentView !== 'new-check' ? () => setCurrentView('new-check') : null}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Main Content View Container with Responsive Fluid Padding */}
        <main className="p-3 sm:p-5 md:p-6 lg:p-8 flex-1 overflow-y-auto pb-20 lg:pb-8 w-full min-w-0">
          {currentView === 'dashboard' && (
            <DashboardView
              checks={checks}
              onNavigate={setCurrentView}
              onSelectCheck={handleSelectCheckWithFindings}
            />
          )}

          {currentView === 'monitoring' && (
            <MonitoringView />
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

          {currentView === 'review-queue' && (
            <ReviewQueueView
              queueItems={reviewQueue}
              onReviewDecision={handleReviewDecision}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}

          {currentView === 'history' && (
            <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 lg:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#142B4A]">Audit History &amp; Compliance Logs</h2>
                  <p className="text-xs sm:text-sm text-gray-500">
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
                  className="px-3.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-[#142B4A] rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Download History JSON
                </button>
              </div>
              <div className="divide-y divide-gray-100 pt-2 sm:pt-4">
                {checks.map((c) => (
                  <div key={c.id || c._id} className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">{c.title}</p>
                      <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                        Brand: {c.brandProfileName} · Channel: {c.channel} · Author: {c.submittedBy}
                      </p>
                    </div>
                    <div className="self-start sm:self-auto">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
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
        </main>

        {/* Mobile Quick Navigation Bar (Phones & Small Tablets < 1024px) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#142B4A]/95 backdrop-blur-md border-t border-white/10 text-white flex items-center justify-around py-2 px-1 shadow-2xl">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer py-1 px-2 rounded-md ${
              currentView === 'dashboard' ? 'text-emerald-400 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('new-check')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer py-1 px-2 rounded-md ${
              currentView === 'new-check' ? 'text-emerald-400 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Audit</span>
          </button>

          <button
            onClick={() => setCurrentView('findings')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer py-1 px-2 rounded-md relative ${
              currentView === 'findings' ? 'text-emerald-400 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Findings</span>
            <span className="absolute 1 top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>

          <button
            onClick={() => setCurrentView('monitoring')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer py-1 px-2 rounded-md ${
              currentView === 'monitoring' ? 'text-emerald-400 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Monitor</span>
          </button>

          <button
            onClick={() => setCurrentView('reports')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer py-1 px-2 rounded-md ${
              currentView === 'reports' ? 'text-emerald-400 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
