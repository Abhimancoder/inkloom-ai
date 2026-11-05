import React from 'react'
import {
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Search,
  CheckCircle2,
  Lock,
  Zap,
  Users
} from 'lucide-react'

export default function LandingPageView({ onEnterApp }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#202833] flex flex-col font-sans antialiased w-full overflow-x-hidden">
      {/* Navbar (Responsive padding & layout) */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-[#142B4A] flex items-center justify-center text-white font-bold shadow-sm shrink-0">
            <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg text-[#142B4A] tracking-tight block leading-tight">
              Inkloom AI
            </span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 tracking-wider uppercase font-semibold block">
              Brand Governance
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-[#142B4A] transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-[#142B4A] transition-colors">
            Features
          </a>
          <a href="#governance" className="hover:text-[#142B4A] transition-colors">
            Human Governance
          </a>
        </div>

        <button
          onClick={onEnterApp}
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#142B4A] hover:bg-[#1a385f] text-white text-xs font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <span>Launch Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#142B4A] text-white py-12 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#176B59]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] sm:text-xs font-semibold text-white/90 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#176B59]"></span>
            <span>Intelligent Brand Governance Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Protect Brand Trust <br />
            <span className="text-[#176B59] bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              Before Publication.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            Review marketing copy created by employees, agencies, and generative AI against approved brand
            guidelines. Flag restricted phrases, unverified claims, and tone mismatches with evidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#176B59] hover:bg-[#125345] text-white font-semibold text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Start Content Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm px-5 py-3 sm:py-3.5 rounded-lg transition-colors border border-white/20 cursor-pointer"
            >
              <span>Open Review Queue</span>
            </button>
          </div>

          {/* Floating UI Teaser Box */}
          <div className="pt-6 sm:pt-10 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-left flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30 text-[10px] shrink-0">
                  CRITICAL
                </span>
                <span className="text-white/80 truncate text-[11px] sm:text-xs">
                  Restricted phrase: "best in class solution at cheap rates"
                </span>
              </div>
              <span className="text-emerald-400 font-semibold hidden sm:inline shrink-0 text-xs">
                Suggested edit ready →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B4A]">How Inkloom Works</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            A deterministic governance workflow ensuring no unapproved content slips into production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <div className="bg-white p-5 sm:p-8 rounded-xl border border-gray-100 shadow-xs text-center space-y-2.5 sm:space-y-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 text-[#142B4A] mx-auto flex items-center justify-center font-bold">
              <BookOpen className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <h3 className="font-bold text-[#142B4A] text-sm sm:text-base">1. Define Brand Guidelines</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Lock in approved voice, mandatory naming conventions, restricted buzzwords, and verified claims.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-xl border border-gray-100 shadow-xs text-center space-y-2.5 sm:space-y-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-emerald-50 text-[#176B59] mx-auto flex items-center justify-center font-bold">
              <Search className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <h3 className="font-bold text-[#142B4A] text-sm sm:text-base">2. Inspect Content Drafts</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Scan copy against exact rules. See exact excerpt matches, rule citations, and alternative suggestions.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-xl border border-gray-100 shadow-xs text-center space-y-2.5 sm:space-y-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-purple-50 text-[#142B4A] mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <h3 className="font-bold text-[#142B4A] text-sm sm:text-base">3. Human Review Gate</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              No silent automatic publishing. A human reviewer approves, requests changes, or dismisses findings.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="bg-white py-12 sm:py-20 px-4 sm:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#142B4A]">
              Designed for Enterprise Safety
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              Every design decision reinforces transparency, verification, and human control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-xl bg-[#F5F7FA] border border-gray-200/60 space-y-2">
              <Lock className="w-5 h-5 text-[#142B4A]" />
              <h4 className="font-bold text-sm text-[#142B4A]">Deterministic Rules First</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Guaranteed detection of forbidden claims and terms without reliance on unpredictable black-box AI.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F5F7FA] border border-gray-200/60 space-y-2">
              <Users className="w-5 h-5 text-[#176B59]" />
              <h4 className="font-bold text-sm text-[#142B4A]">Team Collaboration</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Connects content creators, marketing leads, and external agencies in a unified sign-off queue.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F5F7FA] border border-gray-200/60 space-y-2">
              <Zap className="w-5 h-5 text-[#142B4A]" />
              <h4 className="font-bold text-sm text-[#142B4A]">Audit Trail &amp; Evidence</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every review decision, timestamp, and rule violation is permanently logged for compliance.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-[#142B4A] rounded-2xl p-6 sm:p-12 text-center text-white space-y-3 sm:space-y-4 shadow-lg">
            <h3 className="text-xl sm:text-3xl font-bold">Ready to review your first draft?</h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
              Open the interactive Inkloom Studio and experience the full governance flow.
            </p>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#176B59] hover:bg-[#125345] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-lg transition-colors cursor-pointer"
            >
              <span>Open Studio App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 px-4 sm:px-8 text-center text-xs text-gray-400">
        <p>Inkloom AI — Intelligent Brand Governance Platform · Responsive Multi-Device</p>
      </footer>
    </div>
  )
}
