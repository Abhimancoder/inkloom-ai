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
  ExternalLink
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Continuous Monitoring Active</span>
          </div>
          <h2 className="text-xl font-bold text-[#142B4A] mt-1">
            Real-Time Brand Governance & Channel Scanner
          </h2>
          <p className="text-sm text-gray-500">
            Approved content is monitored across channels in real time. Flag regressions, visual drifts, and unauthorized updates.
          </p>
        </div>

        <button
          onClick={loadMonitoringData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scans Today</p>
            <p className="text-3xl font-extrabold text-[#142B4A] mt-1">{stats.scansToday}</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 block">{stats.scansTodayDelta}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#142B4A] flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#C62828] uppercase tracking-wider">Issues Detected</p>
            <p className="text-3xl font-extrabold text-[#C62828] mt-1">{stats.issuesDetected}</p>
            <span className="text-[11px] font-semibold text-[#2E7D32] mt-1 block">{stats.issuesDetectedDelta}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C62828] flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2E7D32] uppercase tracking-wider">Compliance Score</p>
            <p className="text-3xl font-extrabold text-[#2E7D32] mt-1">{stats.complianceScore}%</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Locked standards match</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-[#2E7D32] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assets Monitored</p>
            <p className="text-3xl font-extrabold text-[#142B4A] mt-1">{stats.assetsMonitored}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Live across all platforms</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#142B4A] flex items-center justify-center">
            <Radio className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Manual Trigger Form */}
      <form onSubmit={handleRunScan} className="bg-white rounded-xl border border-gray-100 shadow-xs p-6">
        <h3 className="text-sm font-bold text-[#142B4A] uppercase tracking-wider mb-4">
          Trigger On-Demand Channel Audit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Channel</label>
            <select
              value={scanChannel}
              onChange={(e) => setScanChannel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs bg-white text-gray-800 focus:outline-none focus:border-[#142B4A]"
            >
              <option value="Website Landing Page">Website Landing Page</option>
              <option value="Display Ad Banner">Display Ad Banner (peltz.jpg)</option>
              <option value="LinkedIn Post">LinkedIn Post</option>
              <option value="Instagram Ads">Instagram Ad Creative</option>
              <option value="Email Campaign">Email Newsletter Stream</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Asset or Page Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Growth Campaign Landing Page"
              value={scanAssetName}
              onChange={(e) => setScanAssetName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#142B4A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">URL or Asset ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://acme.corp/demo"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-lg border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#142B4A]"
              />
              <button
                type="submit"
                disabled={isScanning || !scanAssetName.trim()}
                className="px-4 py-2 bg-[#142B4A] hover:bg-[#1a385f] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* Monitored Assets Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#142B4A]">Monitored Assets Registry</h3>
            <p className="text-xs text-gray-500">Continuous health audits across public and syndicated channels</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-gray-100 text-gray-600">
            {assets.length} Active Feeds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F7FA] text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Asset & Channel</th>
                <th className="px-6 py-3.5">Brand Profile</th>
                <th className="px-6 py-3.5">Compliance Score</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((asset) => (
                <tr key={asset._id || asset.id} className="hover:bg-gray-50/75 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#202833]">{asset.assetName}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <span className="font-medium text-gray-600">{asset.channel}</span>
                      {asset.urlOrIdentifier && (
                        <>
                          <span>·</span>
                          <span className="truncate max-w-[200px] font-mono">{asset.urlOrIdentifier}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">
                    {asset.brandProfileName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            asset.complianceScore >= 90 ? 'bg-[#2E7D32]' : 'bg-[#B7791F]'
                          }`}
                          style={{ width: `${asset.complianceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-800">{asset.complianceScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        asset.status === 'Compliant'
                          ? 'bg-green-50 text-[#2E7D32] border border-green-200'
                          : 'bg-amber-50 text-[#B7791F] border border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'Compliant' ? 'bg-[#2E7D32]' : 'bg-[#B7791F]'}`}></span>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-gray-500 max-w-xs truncate">
                    {asset.details}
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
