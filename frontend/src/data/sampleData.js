// ================================================================
// INKLOOM AI — SAMPLE DEMONSTRATION DATA (CLEARLY LABELED AS SAMPLE)
// ================================================================

export const SAMPLE_BRAND_PROFILES = [
  {
    id: 'bp_techcorp',
    name: 'TechCorp Enterprise',
    industry: 'Enterprise Software & Cloud',
    status: 'Active',
    ruleCount: 6,
    tone: 'Professional, authoritative, customer-focused, innovative',
    restrictedPhrases: [
      'cheap',
      'guarantee',
      'best in class',
      'miracle',
      '100% bug-free',
      'revolutionary'
    ],
    requiredTerms: [
      'TechCorp Solutions',
      'enterprise-grade',
      'governance platform'
    ],
    approvedClaims: [
      'Trusted by 500+ enterprises worldwide',
      'SOC-2 Type II and ISO 27001 compliant',
      'Reduces review turnaround time by up to 60%'
    ],
    visualGuidance: 'Use dark navy (#142B4A) for primary surfaces. Always pair logo with clear minimum spacing.'
  },
  {
    id: 'bp_startupxyz',
    name: 'StartupXYZ',
    industry: 'Fintech & Payments',
    status: 'Draft',
    ruleCount: 4,
    tone: 'Friendly, transparent, empowering, simple',
    restrictedPhrases: [
      'no risk',
      'free money',
      'get rich',
      'foolproof'
    ],
    requiredTerms: [
      'StartupXYZ Pay',
      'bank-grade encryption'
    ],
    approvedClaims: [
      'Over $50M in secure transactions processed',
      'Regulated partner networks'
    ],
    visualGuidance: 'Minimalist white cards, clean typography, avoid flashy animations.'
  }
]

export const SAMPLE_CONTENT_CHECKS = [
  {
    id: 'chk_101',
    title: 'Q4 Enterprise Campaign Brief',
    channel: 'Email Marketing',
    brandProfileId: 'bp_techcorp',
    brandProfileName: 'TechCorp Enterprise',
    submittedBy: 'Sarah M. (Content Team)',
    submittedAt: '2026-11-05T09:30:00Z',
    status: 'Issues Found',
    statusType: 'critical',
    criticalCount: 2,
    warningCount: 1,
    passedCount: 1,
    draftText: 'TechCorp Solutions provides an enterprise-grade governance platform. We are offering the best in class solution at cheap rates to all new customers, guaranteed to eliminate 100% of errors.'
  },
  {
    id: 'chk_102',
    title: 'Product Launch Announcement Email',
    channel: 'Newsletter',
    brandProfileId: 'bp_techcorp',
    brandProfileName: 'TechCorp Enterprise',
    submittedBy: 'James K. (Growth Marketing)',
    submittedAt: '2026-11-05T08:15:00Z',
    status: 'Pending Review',
    statusType: 'warning',
    criticalCount: 0,
    warningCount: 1,
    passedCount: 2,
    draftText: 'TechCorp Solutions is used by millions of customers worldwide with zero configuration needed.'
  },
  {
    id: 'chk_103',
    title: 'Social Media Security Feature Post',
    channel: 'LinkedIn / Social',
    brandProfileId: 'bp_techcorp',
    brandProfileName: 'TechCorp Enterprise',
    submittedBy: 'Priya R. (Social Media)',
    submittedAt: '2026-11-04T16:00:00Z',
    status: 'Approved',
    statusType: 'passed',
    criticalCount: 0,
    warningCount: 0,
    passedCount: 3,
    draftText: 'TechCorp Solutions delivers an enterprise-grade governance platform. We are SOC-2 Type II and ISO 27001 compliant.'
  }
]

export const SAMPLE_FINDINGS = [
  {
    id: 'fnd_01',
    checkId: 'chk_101',
    severity: 'Critical',
    severityType: 'critical',
    category: 'Restricted Phrase',
    excerpt: '...offering the best in class solution at cheap rates...',
    matchedRule: 'Restricted phrases detected: "best in class", "cheap"',
    explanation: 'These phrases violate TechCorp brand guidelines. "cheap" devalues enterprise positioning, and "best in class" is an unverified superlative claim.',
    confidence: 'Deterministic Match (100%)',
    suggestedCorrection: '...offering an enterprise-grade governance solution at competitive value...',
    status: 'Needs Review'
  },
  {
    id: 'fnd_02',
    checkId: 'chk_101',
    severity: 'Critical',
    severityType: 'critical',
    category: 'Restricted Phrase',
    excerpt: '...guaranteed to eliminate 100% of errors...',
    matchedRule: 'Restricted phrase detected: "guaranteed", "100%"',
    explanation: 'Legal & brand restriction: Absolute performance guarantees must not be made in outbound marketing copy.',
    confidence: 'Deterministic Match (100%)',
    suggestedCorrection: '...engineered to significantly reduce review turnaround times by up to 60%...',
    status: 'Needs Review'
  },
  {
    id: 'fnd_03',
    checkId: 'chk_101',
    severity: 'Warning',
    severityType: 'warning',
    category: 'Unsupported Claim',
    excerpt: '...to all new customers...',
    matchedRule: 'Unverified audience claim',
    explanation: 'Special pricing eligibility must specify terms & conditions or link to approved reference schedule.',
    confidence: 'Possible mismatch',
    suggestedCorrection: '...for qualifying enterprise accounts...',
    status: 'Possible Mismatch'
  },
  {
    id: 'fnd_04',
    checkId: 'chk_101',
    severity: 'Passed',
    severityType: 'passed',
    category: 'Required Terminology',
    excerpt: 'TechCorp Solutions provides an enterprise-grade governance platform...',
    matchedRule: 'Required terms present: "TechCorp Solutions", "enterprise-grade"',
    explanation: 'All mandatory brand naming conventions were used accurately in the opening statement.',
    confidence: 'Confirmed Match',
    suggestedCorrection: null,
    status: 'Passed Check'
  }
]

export const SAMPLE_REVIEW_QUEUE = [
  {
    id: 'rev_01',
    checkId: 'chk_101',
    title: 'Q4 Enterprise Campaign Brief',
    channel: 'Email Marketing',
    brandProfile: 'TechCorp Enterprise',
    submittedBy: 'Sarah M.',
    submittedAgo: '2 hours ago',
    criticalIssues: 2,
    warningIssues: 1,
    status: 'Pending Decision',
    reviewerNotes: ''
  },
  {
    id: 'rev_02',
    checkId: 'chk_102',
    title: 'Product Launch Announcement Email',
    channel: 'Newsletter',
    brandProfile: 'TechCorp Enterprise',
    submittedBy: 'James K.',
    submittedAgo: '5 hours ago',
    criticalIssues: 0,
    warningIssues: 1,
    status: 'Pending Decision',
    reviewerNotes: ''
  },
  {
    id: 'rev_03',
    checkId: 'chk_103',
    title: 'Social Media Security Feature Post',
    channel: 'LinkedIn',
    brandProfile: 'TechCorp Enterprise',
    submittedBy: 'Priya R.',
    submittedAgo: '1 day ago',
    criticalIssues: 0,
    warningIssues: 0,
    status: 'Approved',
    reviewerNotes: 'Approved for scheduled publication on LinkedIn.'
  }
]
