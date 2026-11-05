import React, { useState, useEffect } from 'react'
import {
  Activity,
  Globe,
  Radio,
  RefreshCw,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { getMonitoringStats, getMonitoringAssets, getMonitoringActivity, triggerChannelScan } from '../services/api'

export default function MonitoringView() {
  const [stats, setStats] = useState({
    scansToday: 1252,
    scansTodayDelta: '+18% vs yesterday',
    issuesDetected: 27,
    issuesDetectedDelta: '-32% vs yesterday',
    approvalRate: 93,
    complianceScore: 96,
    assetsMonitored: 124
  })
  const [assets, setAssets] = useState([])
  const [activity, setActivity] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanChannel, setScanChannel] = useState('Website Landing Page')
  const [scanAssetName, setScanAssetName] = useState('')
  const [scanUrl, setScanUrl] = useState('')

  const loadMonitoringData = async () => {
    const s = await getMonitoringStats()
    if (s) setStats(s)
    const a = await getMonitoringAssets()
    if (a) setAssets(a)
    const act = await getMonitoringActivity()
    if (act) setActivity(act)
  }

  useEffect(() => {
    loadMonitoringData()
  }, [])

  const handleRunScan = async (e) => {
    e.preventDefault()
    if (!scanAssetName.trim()) return

    setIsScanning(true)
    try {
      const newScan = await triggerChannelScan({
        assetName: scanAssetName,
        channel: scanChannel,
        urlOrIdentifier: scanUrl || 'https://brandproof.ai/campaign',
        brandProfileName: 'Acme Corp'
      })

      if (newScan) {
        setAssets((prev) => [newScan, ...prev])
        setScanAssetName('')
        setScanUrl('')
        loadMonitoringData()
      }
    } catch (err) {
      console.warn('Scan trigger error:', err.message)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Top Banner (Responsive Stack on Phone) */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-wider">Continuous Monitoring Active</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#142B4A] mt-0.5">
            Real-Time Brand Governance &amp; Channel Scanner
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Approved content is monitored across channels in real time. Flag regressions, visual drifts, and unauthorized updates.
          </p>
        </div>

        <button
          onClick={loadMonitoringData}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer self-start md:self-auto shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* KPI Cards (1-col on mobile, 2-col on tablet, 4-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Scans Today</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] mt-1">{stats.scansToday}</p>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#2E7D32] mt-0.5 block">{stats.scansTodayDelta}</span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 text-[#142B4A] flex items-center justify-center shrink-0">
            <Activity className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#C62828] uppercase tracking-wider">Issues Detected</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#C62828] mt-1">{stats.issuesDetected}</p>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#2E7D32] mt-0.5 block">{stats.issuesDetectedDelta}</span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">Compliance Score</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2E7D32] mt-1">{stats.complianceScore}%</p>
            <span className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 block">Locked standards match</span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-green-50 text-[#2E7D32] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Assets Monitored</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] mt-1">{stats.assetsMonitored}</p>
            <span className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 block">Live across all platforms</span>
          </div>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-purple-50 text-[#142B4A] flex items-center justify-center shrink-0">
            <Radio className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Real-time ML Drift Detection Banner */}
      <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#176B59] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#142B4A] block text-xs sm:text-sm">
              Continuous Machine Learning Drift Detection Active
            </span>
            <span className="text-gray-500 text-[10px] sm:text-[11px]">
              Scikit-learn classification &amp; Pandas moving averages observe voice consistency across 124 live marketing assets.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 text-[#176B59] font-bold border border-emerald-200 text-[10px] sm:text-[11px]">
            Voice Drift: 0.8% (Negligible)
          </span>
        </div>
      </div>

      {/* Manual Trigger Form */}
      <form onSubmit={handleRunScan} className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 sm:p-6 space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-[#142B4A] uppercase tracking-wider">
          Trigger On-Demand Channel Audit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 uppercase">Channel</label>
            <select
              value={scanChannel}
              onChange={(e) => setScanChannel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white text-gray-800 focus:outline-none focus:border-[#142B4A]"
            >
              <option value="Website Landing Page">Website Landing Page</option>
              <option value="Display Ad Banner">Display Ad Banner (peltz.jpg)</option>
              <option value="LinkedIn Post">LinkedIn Post</option>
              <option value="Instagram Ads">Instagram Ad Creative</option>
              <option value="Email Campaign">Email Newsletter Stream</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 uppercase">Asset or Page Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Growth Landing Page"
              value={scanAssetName}
              onChange={(e) => setScanAssetName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#142B4A]"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 mb-1 uppercase">URL or Identifier</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="https://acme.corp/demo"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#142B4A]"
              />
              <button
                type="submit"
                disabled={isScanning || !scanAssetName.trim()}
                className="px-3.5 py-2 bg-[#142B4A] hover:bg-[#1a385f] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {isScanning ? (
                  <span>Scanning...</span>
                ) : (
                  <>
                    <span>Run Scan</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Monitored Assets Table with Touch Scroll */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#142B4A]">Monitored Assets Registry</h3>
            <p className="text-xs text-gray-500">Continuous health audits across public and syndicated channels</p>
          </div>
          <span className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold bg-gray-100 text-gray-600 shrink-0">
            {assets.length} Active Feeds
          </span>
        </div>

        {/* Swipe hint on mobile */}
        <div className="sm:hidden px-4 py-1.5 bg-gray-50 text-[10px] text-gray-400 flex items-center justify-between border-b border-gray-100">
          <span>Swipe horizontally for full registry</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[620px]">
            <thead className="bg-[#F5F7FA] text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3">Asset &amp; Channel</th>
                <th className="px-3 sm:px-6 py-3">Brand Profile</th>
                <th className="px-3 sm:px-6 py-3">Compliance Score</th>
                <th className="px-3 sm:px-6 py-3">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset) => (
                <tr key={asset._id || asset.id} className="hover:bg-gray-50/75 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="font-semibold text-[#202833] text-xs sm:text-sm">{asset.assetName}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="font-medium text-gray-600">{asset.channel}</span>
                      {asset.urlOrIdentifier && (
                        <span className="truncate max-w-[140px] text-gray-400">· {asset.urlOrIdentifier}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3.5 text-xs text-gray-600 font-medium">
                    {asset.brandProfileName}
                  </td>
                  <td className="px-3 sm:px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#142B4A]">{asset.complianceScore}%</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#176B59] rounded-full"
                          style={{ width: `${asset.complianceScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        asset.status === 'Compliant'
                          ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                          : asset.status === 'Warning'
                          ? 'bg-amber-50 text-[#B7791F] border border-amber-200'
                          : 'bg-red-50 text-[#C62828] border border-red-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          asset.status === 'Compliant' ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                      ></span>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right text-xs">
                    <span className="text-gray-400 text-[11px]">
                      {asset.criticalIssues || 0} crit · {asset.warnings || 0} warn
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
