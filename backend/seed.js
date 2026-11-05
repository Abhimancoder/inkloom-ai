import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { BrandProfile } from './models/BrandProfile.js'
import { ContentCheck } from './models/ContentCheck.js'
import { Finding } from './models/Finding.js'
import { ReviewDecision } from './models/ReviewDecision.js'
import { MonitoringScan } from './models/MonitoringScan.js'
import { Alert } from './models/Alert.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inkloom'

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB:', MONGODB_URI)
    await mongoose.connect(MONGODB_URI)
    console.log('[Seed] Connected successfully. Clearing existing collections...')

    await BrandProfile.deleteMany({})
    await ContentCheck.deleteMany({})
    await Finding.deleteMany({})
    await ReviewDecision.deleteMany({})
    await MonitoringScan.deleteMany({})
    await Alert.deleteMany({})

    console.log('[Seed] Populating Brand Profiles (Acme Corp, TechCorp, Aldenaire, StartupXYZ)...')
    const acme = await BrandProfile.create({
      name: 'Acme Corp',
      industry: 'Enterprise Software & Cloud AI',
      status: 'Active',
      tone: 'Professional, authoritative, customer-focused, innovative',
      restrictedPhrases: ['cheap', 'guarantee', 'best in class', 'miracle', '100% bug-free', 'revolutionary'],
      requiredTerms: ['Acme Solutions', 'enterprise-grade', 'governance platform'],
      approvedClaims: [
        'Trusted by 500+ enterprises worldwide',
        'SOC-2 Type II and ISO 27001 compliant',
        'Reduces review turnaround time by up to 60%'
      ],
      visualGuidance: 'Use primary navy (#142B4A) and emerald accent (#176B59). Minimum 24px safe margin around Acme logo.',
      brandColors: [
        { name: 'Primary Navy', hex: '#142B4A', role: 'Primary' },
        { name: 'Brand Emerald', hex: '#176B59', role: 'Accent' },
        { name: 'Text Charcoal', hex: '#202833', role: 'Typography' },
        { name: 'Success Green', hex: '#2E7D32', role: 'Validation' }
      ],
      typography: {
        primaryFont: 'Inter, system-ui, sans-serif',
        secondaryFont: 'Outfit, sans-serif',
        minHeadingSize: '24px',
        guidance: 'Clean high-contrast sans-serif layout. Avoid decorative script fonts.'
      },
      logoGuidance: {
        minClearSpace: '24px padding on all sides',
        minWidthPx: 140,
        forbiddenUsages: ['Do not rotate or skew', 'Do not place on neon backgrounds'],
        logoUrl: '/assets/acme-logo.svg'
      },
      imageryGuidelines: {
        styleTags: ['Authentic', 'Enterprise Tech', 'Minimalist', 'Data-focused'],
        forbiddenThemes: ['Cheesy stock clip-art', 'Misleading metric charts']
      }
    })

    const techcorp = await BrandProfile.create({
      name: 'TechCorp Solutions',
      industry: 'Cloud Infrastructure',
      status: 'Active',
      tone: 'Direct, technical, reassuring, precise',
      restrictedPhrases: ['unmatched', 'cheapest', 'magic', 'instant fix'],
      requiredTerms: ['TechCorp Infrastructure', 'high-availability'],
      approvedClaims: ['99.99% SLA availability guaranteed under standard contract terms'],
      visualGuidance: 'High-contrast monochrome with blue accents.',
      brandColors: [
        { name: 'Tech Navy', hex: '#0F172A', role: 'Primary' },
        { name: 'Sky Blue', hex: '#0284C7', role: 'Accent' }
      ]
    })

    const aldenaire = await BrandProfile.create({
      name: 'Aldenaire Luxury',
      industry: 'Luxury Retail & Goods',
      status: 'Draft',
      tone: 'Sophisticated, elegant, understated, timeless',
      restrictedPhrases: ['discount', 'deal', 'bargain', 'sale now'],
      requiredTerms: ['Aldenaire Atelier', 'handcrafted'],
      approvedClaims: ['Crafted using 100% ethically sourced Italian textiles'],
      visualGuidance: 'Warm muted tones, generous whitespace.',
      brandColors: [
        { name: 'Warm Noir', hex: '#1C1917', role: 'Primary' },
        { name: 'Champagne Gold', hex: '#D97706', role: 'Accent' }
      ]
    })

    console.log('[Seed] Populating Content Checks & Audit Findings...')
    const check1 = await ContentCheck.create({
      title: 'Q4 Enterprise Campaign Brief',
      channel: 'Email Marketing',
      brandProfileId: acme._id,
      brandProfileName: acme.name,
      submittedBy: 'Sarah M. (Marketing Lead)',
      status: 'Issues Found',
      statusType: 'critical',
      criticalCount: 2,
      warningCount: 1,
      passedCount: 2,
      governanceScore: 72,
      draftText: 'Acme Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.',
      categoryScores: {
        logoUsage: 'Passed',
        colorCompliance: 'Passed',
        typography: 'Warning',
        messaging: 'Warning',
        imageStyle: 'Passed',
        accessibility: 'Passed'
      },
      evidence: {
        colorsFound: ['#142B4A', '#176B59'],
        typographyUsed: 'Inter Sans-Serif',
        messagingTone: 'Needs Review (2 Critical Claims)',
        imageryTags: ['Clean', 'Enterprise']
      },
      readabilityMetrics: {
        readingEaseScore: 68,
        readabilityLabel: 'Standard / Accessible',
        wordCount: 26,
        sentenceCount: 2
      }
    })

    await Finding.create([
      {
        checkId: check1._id,
        severity: 'Critical',
        severityType: 'critical',
        category: 'Restricted Phrase',
        excerpt: '...best in class solution at cheap rates...',
        matchedRule: 'Restricted phrases detected: "best in class", "cheap"',
        explanation: 'Violates Acme brand guidelines. "cheap" devalues enterprise positioning, and "best in class" is an unverified superlative claim.',
        confidence: 'Deterministic Match (100%)',
        suggestedCorrection: 'enterprise-grade governance solution at competitive value',
        status: 'Needs Review'
      },
      {
        checkId: check1._id,
        severity: 'Critical',
        severityType: 'critical',
        category: 'Restricted Phrase',
        excerpt: '...guaranteed to eliminate 100% of errors...',
        matchedRule: 'Restricted phrase detected: "guaranteed", "100%"',
        explanation: 'Legal restriction: Absolute performance guarantees cannot be published in external marketing.',
        confidence: 'Deterministic Match (100%)',
        suggestedCorrection: 'engineered to significantly reduce review turnaround times by up to 60%',
        status: 'Needs Review'
      },
      {
        checkId: check1._id,
        severity: 'Warning',
        severityType: 'warning',
        category: 'Unsupported Claim',
        excerpt: '...to all new customers...',
        matchedRule: 'Unverified audience claim',
        explanation: 'Promotional tier pricing must specify qualifying terms & conditions.',
        confidence: 'Heuristic Match (92%)',
        suggestedCorrection: 'qualifying enterprise accounts',
        status: 'Needs Review'
      },
      {
        checkId: check1._id,
        severity: 'Passed',
        severityType: 'passed',
        category: 'Required Terminology',
        excerpt: 'Acme Solutions provides an enterprise-grade governance platform...',
        matchedRule: 'Required terms present: "Acme Solutions", "enterprise-grade"',
        explanation: 'All mandatory brand naming conventions were used accurately in the opening copy.',
        confidence: 'Confirmed Match',
        suggestedCorrection: null,
        status: 'Passed Check'
      },
      {
        checkId: check1._id,
        severity: 'Passed',
        severityType: 'passed',
        category: 'Accessibility',
        excerpt: 'Reading Ease: 68/100',
        matchedRule: 'WCAG Plain-Language Compliance',
        explanation: 'Sentence structure is clear, concise, and accessible to target business audience.',
        confidence: 'Confirmed (WCAG Accessible)',
        suggestedCorrection: null,
        status: 'Passed Check'
      }
    ])

    const check2 = await ContentCheck.create({
      title: 'SOC-2 Type II Security Announcement',
      channel: 'Press Release',
      brandProfileId: acme._id,
      brandProfileName: acme.name,
      submittedBy: 'Pranav S. (Compliance Team)',
      status: 'Approved',
      statusType: 'passed',
      criticalCount: 0,
      warningCount: 0,
      passedCount: 3,
      governanceScore: 98,
      draftText: 'Acme Solutions delivers an enterprise-grade governance platform. We are proud to announce our full SOC-2 Type II and ISO 27001 compliance for all hosted accounts.',
      categoryScores: {
        logoUsage: 'Passed',
        colorCompliance: 'Passed',
        typography: 'Passed',
        messaging: 'Passed',
        imageStyle: 'Passed',
        accessibility: 'Passed'
      },
      evidence: {
        colorsFound: ['#142B4A', '#2E7D32'],
        typographyUsed: 'Inter Sans-Serif',
        messagingTone: 'Authoritative & Compliant',
        imageryTags: ['Security', 'Verified']
      },
      readabilityMetrics: {
        readingEaseScore: 74,
        readabilityLabel: 'Easy & Engaging',
        wordCount: 27,
        sentenceCount: 2
      }
    })

    await ReviewDecision.create({
      checkId: check2._id,
      decision: 'Approved',
      reviewerName: 'Labeeba Khan',
      reviewerRole: 'Compliance Officer',
      reviewerNotes: 'Approved. Official SOC-2 attestation verified and cited accurately.',
      decidedAt: new Date(Date.now() - 3600000)
    })

    const check3 = await ContentCheck.create({
      title: 'Product Launch Announcement Email',
      channel: 'Newsletter',
      brandProfileId: acme._id,
      brandProfileName: acme.name,
      submittedBy: 'Aryan Mishra (Growth Marketing)',
      status: 'Pending Review',
      statusType: 'warning',
      criticalCount: 0,
      warningCount: 1,
      passedCount: 2,
      governanceScore: 88,
      draftText: 'Acme Solutions is used by millions of customers worldwide with zero configuration needed for enterprise governance.',
      categoryScores: {
        logoUsage: 'Passed',
        colorCompliance: 'Passed',
        typography: 'Passed',
        messaging: 'Warning',
        imageStyle: 'Passed',
        accessibility: 'Passed'
      },
      evidence: {
        colorsFound: ['#142B4A'],
        typographyUsed: 'Inter Sans-Serif',
        messagingTone: 'Review Recommended (Unverified Claims)',
        imageryTags: ['Growth']
      },
      readabilityMetrics: {
        readingEaseScore: 62,
        readabilityLabel: 'Standard / Accessible',
        wordCount: 16,
        sentenceCount: 1
      }
    })

    await Finding.create([
      {
        checkId: check3._id,
        severity: 'Warning',
        severityType: 'warning',
        category: 'Unsupported Claim',
        excerpt: '...millions of customers worldwide with zero configuration...',
        matchedRule: 'Unverified superlative claim',
        explanation: 'Audience claim ("millions") and technical claim ("zero configuration") lack approved documentation.',
        confidence: 'Heuristic Match (90%)',
        suggestedCorrection: 'Trusted by over 500+ enterprises worldwide with streamlined setup',
        status: 'Needs Review'
      },
      {
        checkId: check3._id,
        severity: 'Passed',
        severityType: 'passed',
        category: 'Required Terminology',
        excerpt: 'Acme Solutions ... enterprise governance',
        matchedRule: 'Mandatory brand terms present',
        explanation: 'Acme Solutions naming convention respected.',
        confidence: 'Confirmed Match',
        suggestedCorrection: null,
        status: 'Passed Check'
      }
    ])

    console.log('[Seed] Populating Continuous Channel Monitoring Scans (Slide 4 & 5)...')
    await MonitoringScan.create([
      {
        assetName: 'Corporate Website (Homepage & Features)',
        channel: 'Website Landing Page',
        urlOrIdentifier: 'https://acme.corp/platform',
        brandProfileName: 'Acme Corp',
        complianceScore: 98,
        issuesDetected: 0,
        status: 'Compliant',
        lastScannedAt: new Date(Date.now() - 120000), // 2m ago
        details: 'Website scan completed: 100% compliant with Acme design tokens and messaging rules.'
      },
      {
        assetName: 'LinkedIn Corporate Thought Leadership Post',
        channel: 'LinkedIn Post',
        urlOrIdentifier: 'linkedin.com/posts/acme-q4',
        brandProfileName: 'Acme Corp',
        complianceScore: 100,
        issuesDetected: 0,
        status: 'Compliant',
        lastScannedAt: new Date(Date.now() - 420000), // 7m ago
        details: 'Ad content approved. Verified brand terms and ESG compliance statements.'
      },
      {
        assetName: 'Instagram Stories Retargeting Creative (peltz.jpg)',
        channel: 'Display Ad Banner',
        urlOrIdentifier: 'peltz.jpg',
        brandProfileName: 'Acme Corp',
        complianceScore: 78,
        issuesDetected: 2,
        status: 'Warning',
        lastScannedAt: new Date(Date.now() - 720000), // 12m ago
        details: 'Ad creative flagged: Logo placement violates 24px safe padding boundary.'
      },
      {
        assetName: 'Brand Guidelines Governance Policy Document',
        channel: 'PDF Whitepaper',
        urlOrIdentifier: 'brand-policy-v2.pdf',
        brandProfileName: 'Acme Corp',
        complianceScore: 96,
        issuesDetected: 0,
        status: 'Compliant',
        lastScannedAt: new Date(Date.now() - 1500000), // 25m ago
        details: 'Policy updated: Integrated 2026 AI compliance and copyright attribution rules.'
      }
    ])

    console.log('[Seed] Populating Governance Alerts...')
    await Alert.create([
      {
        title: 'Ad creative flagged',
        message: 'Instagram Stories creative (peltz.jpg) flagged for safe area logo margin violation.',
        type: 'warning',
        channel: 'Display Ad Banner',
        createdAt: new Date(Date.now() - 720000)
      },
      {
        title: 'Ad content approved',
        message: 'LinkedIn corporate leadership post passed all compliance gates and is ready to publish.',
        type: 'success',
        channel: 'LinkedIn Post',
        createdAt: new Date(Date.now() - 420000)
      },
      {
        title: 'Website scan completed',
        message: 'Automated channel scan of homepage verified 98% brand consistency across all viewports.',
        type: 'info',
        channel: 'Website Landing Page',
        createdAt: new Date(Date.now() - 120000)
      },
      {
        title: 'Policy updated',
        message: 'Brand governance guidelines for Acme Corp updated by Brand Team.',
        type: 'info',
        channel: 'Governance',
        createdAt: new Date(Date.now() - 1500000)
      }
    ])

    console.log('[Seed] ✅ Database seeded successfully with pitch deck data!')
    process.exit(0)
  } catch (error) {
    console.error('[Seed] ❌ Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()
