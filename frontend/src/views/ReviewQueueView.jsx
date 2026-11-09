import React, { useState } from 'react'
import {
  CheckSquare,
  Check,
  RotateCcw,
  X,
  Clock,
  User,
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
  const [webhookAlert, setWebhookAlert] = useState('')

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
              reviewerNotes: comment || `Marked as ${decision}`
            }
          : item
      )
    )

    // Trigger webhook banner upon approval
    if (decision === 'Approved') {
      setWebhookAlert(
        '🚀 Human Approval Verified! Webhooks automatically dispatched to Slack Alert, HubSpot CMS (Draft), and WordPress (Draft).'
      )
      setTimeout(() => setWebhookAlert(''), 6000)
    }

    onReviewDecision(id, decision, comment)
  }

  const pendingItems = items.filter((i) => i.status === 'Pending Decision')
  const completedItems = items.filter((i) => i.status !== 'Pending Decision')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#142B4A]">Human Review Queue</h2>
          <p className="text-sm text-gray-500">
            Mandatory human approval gate. Approved content automatically dispatches configured webhooks.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-[#B7791F] border border-amber-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {pendingItems.length} Pending Review
        </span>
      </div>

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

      {/* Pending Items List */}
      <div className="space-y-4">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-4 transition-all"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#142B4A]">{item.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="font-medium text-gray-600">{item.brandProfile}</span>
                  <span>·</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                    {item.channel}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> Submitted by {item.submittedBy}
                  </span>
                  <span>·</span>
                  <span>{item.submittedAgo}</span>
                </div>
              </div>

              {/* Severity Pill */}
              <div className="flex items-center gap-2">
                {item.criticalIssues > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-[#C62828] border border-red-200">
                    <AlertOctagon className="w-3 h-3" />
                    {item.criticalIssues} Critical
                  </span>
                )}
                {item.warningIssues > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#B7791F] border border-amber-200">
                    <AlertTriangle className="w-3 h-3" />
                    {item.warningIssues} Warning
                  </span>
                )}
                {item.criticalIssues === 0 && item.warningIssues === 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-[#2E7D32] border border-green-200">
                    Compliant / 0 Issues
                  </span>
                )}
              </div>
            </div>

            {/* Reviewer Note Input */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reviewer Decision Comments & Revision Notes</span>
              </div>
              <input
                type="text"
                placeholder="Optional notes for author & Slack webhook (e.g. 'Approved with corrected enterprise claims')..."
                value={comments[item.id] || ''}
                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#142B4A]/20"
              />
            </div>

            {/* Action Buttons */}
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
            </div>
          </div>
        ))}

        {pendingItems.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
            <CheckSquare className="w-10 h-10 text-green-500 mx-auto mb-2 opacity-60" />
            <p className="text-base font-semibold text-gray-700">All content checks have been reviewed!</p>
            <p className="text-xs text-gray-400 mt-1">No items currently awaiting approval.</p>
          </div>
        )}
      </div>

      {/* Completed Decision Log */}
      {completedItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider">
            Decisions Recorded This Session
          </h3>
          <div className="divide-y divide-gray-100">
            {completedItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
