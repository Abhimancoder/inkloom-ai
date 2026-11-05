// ================================================================
// INKLOOM AI — DETERMINISTIC AUDIT RULE ENGINE (PHASE M4 ENGINE)
// ================================================================

export function runDeterministicAudit(draftText, brandProfile) {
  const findings = []
  const text = draftText || ''
  const lowerText = text.toLowerCase()

  const restricted = brandProfile?.restrictedPhrases || []
  const required = brandProfile?.requiredTerms || []

  // 1. Scan for Restricted Phrases (Critical Violations)
  restricted.forEach((phrase) => {
    if (!phrase) return
    const target = phrase.toLowerCase().trim()
    const index = lowerText.indexOf(target)

    if (index !== -1) {
      // Extract exact surrounding context (up to 30 chars before and after)
      const start = Math.max(0, index - 25)
      const end = Math.min(text.length, index + target.length + 25)
      const excerpt = `...${text.substring(start, end).trim()}...`

      // Suggest alternative wording
      let suggestion = 'compliant professional phrasing'
      if (target === 'cheap') suggestion = 'cost-effective / competitive value'
      else if (target === 'best in class') suggestion = 'enterprise-grade'
      else if (target === 'guarantee' || target.includes('100%')) suggestion = 'engineered to reduce risk'
      else if (target === 'miracle') suggestion = 'proven solution'

      findings.push({
        severity: 'Critical',
        severityType: 'critical',
        category: 'Restricted Phrase',
        excerpt,
        matchedRule: `Restricted phrase detected: "${phrase}"`,
        explanation: `The term "${phrase}" violates the locked brand guidelines for ${brandProfile.name}. Outbound content must avoid superlative, unverified, or non-compliant terminology.`,
        confidence: 'Deterministic Match (100%)',
        suggestedCorrection: suggestion,
        status: 'Needs Review'
      })
    }
  })

  // 2. Scan for Required Terminology
  required.forEach((term) => {
    if (!term) return
    const target = term.toLowerCase().trim()
    const isPresent = lowerText.includes(target)

    if (isPresent) {
      findings.push({
        severity: 'Passed',
        severityType: 'passed',
        category: 'Required Terminology',
        excerpt: `Found: "${term}"`,
        matchedRule: `Mandatory brand term present: "${term}"`,
        explanation: `Mandatory naming convention "${term}" is present in the draft as required.`,
        confidence: 'Confirmed Match',
        suggestedCorrection: null,
        status: 'Passed Check'
      })
    } else {
      findings.push({
        severity: 'Warning',
        severityType: 'warning',
        category: 'Missing Required Term',
        excerpt: 'Opening text',
        matchedRule: `Missing mandatory brand terminology: "${term}"`,
        explanation: `Brand governance recommends explicitly featuring the term "${term}" in promotional drafts.`,
        confidence: 'Possible mismatch',
        suggestedCorrection: `Include "${term}" in the primary copy.`,
        status: 'Needs Review'
      })
    }
  })

  // Compute Summary Totals
  const criticalCount = findings.filter((f) => f.severityType === 'critical').length
  const warningCount = findings.filter((f) => f.severityType === 'warning').length
  const passedCount = findings.filter((f) => f.severityType === 'passed').length

  let status = 'Approved'
  let statusType = 'passed'

  if (criticalCount > 0) {
    status = 'Issues Found'
    statusType = 'critical'
  } else if (warningCount > 0) {
    status = 'Pending Review'
    statusType = 'warning'
  }

  return {
    findings,
    status,
    statusType,
    criticalCount,
    warningCount,
    passedCount
  }
}
