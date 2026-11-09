import React, { useState, useEffect } from 'react'
import {
  Webhook,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  Sliders,
  ShieldCheck,
  MessageSquare,
  Globe,
  Share2,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react'
import { getIntegrations, updateIntegration, getIntegrationEvents } from '../services/api'

export default function IntegrationsView() {
  const [integrations, setIntegrations] = useState([])
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(null)
  const [saveNotice, setSaveNotice] = useState('')

  const loadData = async () => {
    setIsLoading(true)
    const [configs, eventList] = await Promise.all([
      getIntegrations(),
      getIntegrationEvents()
    ])
    if (configs) setIntegrations(configs)
    if (eventList) setEvents(eventList)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleMode = async (provider, currentMode) => {
    const nextMode = currentMode === 'live' ? 'simulation' : 'live'
    setIsUpdating(provider)
    try {
      await updateIntegration(provider, { mode: nextMode })
      setIntegrations((prev) =>
        prev.map((c) =>
          c.provider === provider
            ? { ...c, mode: nextMode, status: nextMode === 'live' ? 'Connected' : 'Test Mode' }
            : c
        )
      )
      setSaveNotice(`Switched ${provider} to ${nextMode} mode`)
      setTimeout(() => setSaveNotice(''), 2500)
    } catch (err) {
      console.warn('Mode toggle fallback')
    }
    setIsUpdating(null)
  }

  const handleToggleEnabled = async (provider, currentEnabled) => {
    const nextEnabled = !currentEnabled
    setIsUpdating(provider)
    try {
      await updateIntegration(provider, { enabled: nextEnabled })
      setIntegrations((prev) =>
        prev.map((c) => (c.provider === provider ? { ...c, enabled: nextEnabled } : c))
      )
    } catch (err) {
      console.warn('Toggle fallback')
    }
    setIsUpdating(null)
  }

  const providerIcons = {
    slack: MessageSquare,
    hubspot: Share2,
    wordpress: Globe
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#142B4A]">Webhook & CMS Integrations</h2>
          <p className="text-sm text-gray-500">
            Automated notifications and draft syncs triggered strictly upon human approval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveNotice && (
            <span className="text-xs font-semibold text-[#2E7D32] bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveNotice}
            </span>
          )}

          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#142B4A] border border-gray-200 text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {/* Human Approval Gate Policy Card */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#B7791F] flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#142B4A] flex items-center gap-2">
            <span>Strict Human Verification Policy</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#B7791F]">
              Gate Enforced
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Integration events are <span className="font-semibold text-gray-800">ONLY triggered when a human reviewer explicitly clicks "Approve Content"</span> in the Review Queue. Pending, Changes Requested, or Dismissed drafts will never trigger webhooks. Furthermore, WordPress and HubSpot sync content <span className="font-semibold text-gray-800">strictly as Drafts</span> — never auto-publishing publicly.
          </p>
        </div>
      </div>

      {/* 3 Connector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const Icon = providerIcons[item.provider] || Webhook
          const isSim = item.mode === 'simulation'
          const isEnabled = item.enabled

          return (
            <div
              key={item.provider}
              className={`bg-white rounded-xl border p-6 flex flex-col justify-between space-y-5 transition-all shadow-xs ${
                isEnabled ? 'border-gray-100' : 'border-gray-200 opacity-60'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F7FA] text-[#142B4A] flex items-center justify-center border border-gray-200">
                      <Icon className="w-5 h-5 text-[#176B59]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#142B4A]">{item.displayName}</h4>
                      <span className="text-[11px] text-gray-400 capitalize">
                        {item.provider} connector
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isSim
                        ? 'bg-amber-50 text-[#B7791F] border-amber-200'
                        : 'bg-green-50 text-[#2E7D32] border-green-200'
                    }`}
                  >
                    {isSim ? 'Test Mode' : 'Connected'}
                  </span>
                </div>

                {/* Target & Policy */}
                <div className="space-y-2 mt-4 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F5F7FA] border border-gray-100 text-gray-600">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                      Target Endpoint:
                    </span>
                    <span className="font-mono text-[11px] text-[#142B4A] font-semibold">
                      {item.targetChannelOrEndpoint}
                    </span>
                  </div>

                  {item.publishAsDraftOnly && (
                    <div className="p-2 rounded bg-green-50/70 border border-green-200 text-[#2E7D32] text-[11px] font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Draft-Only Mode: Zero auto-publish</span>
                    </div>
                  )}

                  <p className="text-[11px] text-gray-400 mt-2">
                    {item.lastStatusMessage}
                  </p>
                </div>
              </div>

              {/* Action toggles */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleMode(item.provider, item.mode)}
                  disabled={isUpdating === item.provider}
                  className="text-xs font-semibold text-[#176B59] hover:text-[#142B4A] transition-colors cursor-pointer"
                >
                  Switch to {isSim ? 'Live Mode' : 'Test Mode'}
                </button>

                <button
                  onClick={() => handleToggleEnabled(item.provider, item.enabled)}
                  disabled={isUpdating === item.provider}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    isEnabled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-[#2E7D32]'
                  }`}
                >
                  {isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Webhook Delivery Audit Trail Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#142B4A]">Webhook Delivery Audit Trail</h3>
            <p className="text-xs text-gray-500">
              Idempotent dispatch log recorded whenever human reviewers approve content
            </p>
          </div>
          <span className="text-xs font-bold text-gray-400">
            {events.length} Recorded Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Event ID</th>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">Content Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Response Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((evt) => (
                <tr key={evt.eventId || evt._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 text-gray-400 font-mono">
                    {new Date(evt.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-gray-600 font-semibold">
                    {evt.eventId}
                  </td>
                  <td className="px-6 py-3.5 font-bold uppercase text-[#142B4A]">
                    {evt.provider}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-gray-800">
                    {evt.checkTitle}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        evt.status === 'Delivered'
                          ? 'bg-green-50 text-[#2E7D32] border-green-200'
                          : evt.status === 'Simulated'
                          ? 'bg-amber-50 text-[#B7791F] border-amber-200'
                          : 'bg-red-50 text-[#C62828] border-red-200'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 max-w-xs truncate">
                    {evt.responseSummary}
                  </td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    No webhooks dispatched yet. Go to <span className="font-semibold text-gray-700">Review Queue</span> and click <span className="font-semibold text-green-700">"Approve Content"</span> on any draft to trigger approval webhooks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
