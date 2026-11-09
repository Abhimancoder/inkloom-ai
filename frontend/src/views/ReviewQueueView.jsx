import { useState } from 'react'
import {
  CheckSquare,
  Check,
  RotateCcw,
  X,
  Clock,
  AlertOctagon,
  AlertTriangle,
  MessageSquare,
  Webhook,
  Send,
  CheckCircle2
} from 'lucide-react'

export default function ReviewQueueView({
  queueItems,
  onReviewDecision
}) {
  const [items, setItems] = useState(queueItems)
  const [comments, setComments] = useState({})
<<<<<<< HEAD
  const [reviewerRole, setReviewerRole] = useState('Brand Team')
  const [reviewerName, setReviewerName] = useState('Abhiman (Team Lead)')
=======
  const [webhookAlert, setWebhookAlert] = useState('')
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc

  const handleCommentChange = (id, text) => {
    setComments((prev) => ({ ...prev, [id]: text }))
  }

  const handleAction = (id, decision) => {
    const comment = comments[id] || ''
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: decision,
              decisionTime: timestamp,
              reviewerName,
              reviewerRole,
              reviewerNotes: comment || `Marked as ${decision}`
            }
          : item
      )
    )

<<<<<<< HEAD
    onReviewDecision(id, decision, comment, reviewerRole, reviewerName)
=======
    // Trigger webhook banner upon approval
    if (decision === 'Approved') {
      setWebhookAlert(
        '🚀 Human Approval Verified! Webhooks automatically dispatched to Slack Alert, HubSpot CMS (Draft), and WordPress (Draft).'
      )
      setTimeout(() => setWebhookAlert(''), 6000)
    }

    onReviewDecision(id, decision, comment)
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
  }

  const pendingItems = items.filter((i) => i.status === 'Pending Decision')
  const completedItems = items.filter((i) => i.status !== 'Pending Decision')

  return (
<<<<<<< HEAD
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Header (Responsive Stack on Phone) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#142B4A]">Human Review Queue</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Human approval gate before publishing. Role-based routing and sign-off authority.
=======
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#142B4A]">Human Review Queue</h2>
          <p className="text-sm text-gray-500">
            Mandatory human approval gate. Approved content automatically dispatches configured webhooks.
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-[#B7791F] border border-amber-200 flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{pendingItems.length} Pending Review</span>
        </span>
      </div>

<<<<<<< HEAD
      {/* Reviewer Persona Bar (Slide 3 & 5) */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
            Signing Off As:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['Brand Team', 'Legal Team', 'Compliance Officer', 'Marketing Team'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setReviewerRole(role)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  reviewerRole === role
                    ? 'bg-[#142B4A] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs w-full md:w-auto">
          <span className="text-gray-400 shrink-0">Reviewer:</span>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1 border border-gray-200 rounded text-xs font-medium text-gray-700 focus:outline-none focus:border-[#142B4A]"
          />
        </div>
      </div>
=======
      {/* Webhook Dispatch Live Notification */}
      {webhookAlert && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-[#2E7D32] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150 shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-semibold">
            <span className="block font-bold text-sm">Automated Connectors Dispatched</span>
            {webhookAlert}
          </div>
        </div>
      )}
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc

      {/* Pending Items List */}
      <div className="space-y-3 sm:space-y-4">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 space-y-3 sm:space-y-4"
          >
            {/* Top Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {item.channel}
                  </span>
                  <span className="text-xs text-gray-400">· {item.brandProfile}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[#142B4A] mt-1">{item.title}</h3>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  Submitted by <span className="text-gray-600 font-medium">{item.submittedBy}</span> · {item.submittedAgo}
                </p>
              </div>

              {/* Issues Badges */}
              <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto shrink-0">
                {item.criticalIssues > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-[#C62828] border border-red-200">
                    <AlertOctagon className="w-3 h-3" />
                    {item.criticalIssues} Critical
                  </span>
                )}
                {item.warningIssues > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-50 text-[#B7791F] border border-amber-200">
                    <AlertTriangle className="w-3 h-3" />
                    {item.warningIssues} Warning
                  </span>
                )}
                {item.criticalIssues === 0 && item.warningIssues === 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-green-50 text-[#2E7D32] border border-green-200">
                    Compliant / 0 Issues
                  </span>
                )}
              </div>
            </div>

            {/* Reviewer Note Input */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reviewer Decision Comments &amp; Revision Notes</span>
              </div>
              <input
                type="text"
                placeholder="Optional notes for author & Slack webhook (e.g. 'Approved with corrected enterprise claims')..."
                value={comments[item.id] || ''}
                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
              />
            </div>

            {/* Action Buttons */}
<<<<<<< HEAD
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 sm:pt-3 border-t border-gray-100">
              <button
                onClick={() => handleAction(item.id, 'Dismissed')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>

              <button
                onClick={() => handleAction(item.id, 'Changes Requested')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#142B4A] hover:bg-[#1a385f] text-white transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Request Changes</span>
              </button>

              <button
                onClick={() => handleAction(item.id, 'Approved')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#176B59] hover:bg-[#125345] text-white transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve &amp; Authorize</span>
              </button>
=======
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Webhook className="w-3 h-3 text-[#176B59]" />
                Approval triggers Slack & CMS Draft sync
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleAction(item.id, 'Dismissed')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>

                <button
                  onClick={() => handleAction(item.id, 'Changes Requested')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#142B4A] hover:bg-[#1a385f] text-white transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Changes</span>
                </button>

                <button
                  onClick={() => handleAction(item.id, 'Approved')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#2E7D32] hover:bg-[#256328] text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Content</span>
                </button>
              </div>
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
            </div>
          </div>
        ))}

        {pendingItems.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center space-y-2">
            <CheckSquare className="w-8 h-8 text-[#176B59] mx-auto" />
            <h4 className="font-bold text-[#142B4A] text-sm">All Pending Checks Completed</h4>
            <p className="text-xs text-gray-500">There are no items currently awaiting human sign-off.</p>
          </div>
        )}
      </div>

      {/* Completed History List */}
      {completedItems.length > 0 && (
        <div className="space-y-3 pt-4 sm:pt-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Completed Review Decisions ({completedItems.length})
          </h3>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
<<<<<<< HEAD
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{item.title}</span>
                    <span className="text-gray-400">· {item.channel}</span>
                  </div>
                  <p className="text-gray-500 mt-0.5 text-[11px]">
                    Decided by <span className="font-semibold text-gray-700">{item.reviewerName || 'Reviewer'}</span> ({item.reviewerRole || 'Brand Team'})
                    {item.decisionTime && ` at ${item.decisionTime}`}
                  </p>
                  {item.reviewerNotes && (
                    <p className="text-gray-600 mt-1 italic text-[11px]">
                      "{item.reviewerNotes}"
                    </p>
                  )}
=======
                  <span className="font-semibold text-gray-800">{item.title}</span>
                  <span className="text-gray-400 ml-2">({item.reviewerNotes})</span>
                  {item.status === 'Approved' && (
                    <span className="ml-2 text-[10px] text-[#176B59] font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      Dispatched to Slack, HubSpot, WordPress
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Approved'
                        ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                        : 'bg-red-50 text-[#C62828] border border-red-200'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-gray-400">{item.decisionTime}</span>
>>>>>>> faa97547145795a42e32a147158687ca4b3a25bc
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] self-start sm:self-auto shrink-0 ${
                    item.status === 'Approved'
                      ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                      : item.status === 'Changes Requested'
                      ? 'bg-amber-50 text-[#B7791F] border border-amber-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
