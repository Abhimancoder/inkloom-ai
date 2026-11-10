/**
 * Inkloom Guide In-Browser Knowledge Engine
 * Provides instant, highly accurate domain-specific answers for Inkloom AI
 * ensuring 100% uptime and resilience even when backend API is offline or unreachable.
 */

export function getLocalAssistantResponse(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'Hi! I’m Inkloom Guide. How can I assist you with Inkloom AI today?'
  }

  const lastMessage = messages[messages.length - 1]
  const query = (lastMessage.content || '').toLowerCase().trim()

  // 1. First Content Audit / How to run a check
  if (
    query.includes('first content audit') ||
    query.includes('how do i run') ||
    query.includes('how to use') ||
    query.includes('start audit') ||
    query.includes('new check') ||
    query.includes('submit')
  ) {
    return `To run your first content audit in Inkloom AI:

1. Click **"+ New Check"** in the top navigation bar or sidebar.
2. Select your target **Brand Profile** (e.g., Acme Corp, TechCorp, or Aldenaire) and publishing **Channel** (Website, Social Media, Email, or Press Release).
3. Enter your draft copy in the **Draft Content Text** area (you can also click **"Violations Test"** or **"Clean Test"** for instant sample inputs).
4. *(Optional)* Attach a marketing graphic (PNG, JPG, or WEBP up to 10MB) to perform automated visual brand and palette auditing.
5. Click **"Run Content Audit"**.

Inkloom AI will scan for banned phrases, tone breaches, and WCAG contrast issues, then automatically open the **Findings** view with violation excerpts and suggested alternatives!`
  }

  // 2. Review Queue & Human Approval Gate
  if (
    query.includes('review queue') ||
    query.includes('approval gate') ||
    query.includes('human review') ||
    query.includes('approve content') ||
    query.includes('request changes') ||
    query.includes('human in the loop')
  ) {
    return `The **Review Queue** is Inkloom AI's mandatory human-in-the-loop authorization gate:

• **Human Authority:** AI assists by highlighting violations and proposing RAG rewrites, but authorized human reviewers (Brand Manager, Legal Counsel, Marketing Lead) retain final sign-off authority.
• **Three Decisions:** Reviewers can choose **"Approve Content"**, **"Request Changes"** (with revision notes), or **"Dismiss"**.
• **Strict Safety Barrier:** External integrations (Slack alerts, HubSpot CMS drafts, WordPress drafts) are **strictly locked** until a human clicks "Approve Content". Drafts marked with changes requested or dismissed will never trigger external publication.
• **Idempotency Protection:** Double-clicks or duplicate submissions are blocked by compound idempotency keys in MongoDB, ensuring zero duplicate dispatches.`
  }

  // 3. Visual brand checks & WCAG contrast
  if (
    query.includes('visual') ||
    query.includes('palette') ||
    query.includes('wcag') ||
    query.includes('contrast') ||
    query.includes('image') ||
    query.includes('graphic') ||
    query.includes('logo') ||
    query.includes('clear-space')
  ) {
    return `Inkloom AI's **Multi-Modal Visual Auditing Engine** inspects graphic assets alongside marketing copy:

• **Multi-Format Ingestion:** Supports PNG, JPG/JPEG, and WEBP image uploads up to 10MB via server-side Multer validation.
• **Dominant Palette Extraction:** Uses Sharp and ColorThief to extract dominant HEX colors and calculate visual percentage breakdown.
• **Mathematical WCAG 2.1 Contrast Engine:** Calculates sRGB relative luminance using exact W3C formulas, benchmarking foreground text against background colors for **Level AA (≥ 4.5:1)** and **AAA (≥ 7.0:1)** standards.
• **Honest Logo Clear-Space Policy:** If asset transparency or bounding boxes are ambiguous, the engine transparently reports *"Needs Manual Review"* with clear guidance (e.g., minimum 24px margin required) rather than hallucinating fake compliance scores.`
  }

  // 4. Contextual RAG Rewriter & Constraint Preservation
  if (
    query.includes('rag') ||
    query.includes('rewrite') ||
    query.includes('constraint') ||
    query.includes('preservation') ||
    query.includes('approved copy') ||
    query.includes('hallucin')
  ) {
    return `The **Domain-Specific Contextual RAG Rewriting Engine** generates enterprise-grade compliant copy while preventing hallucinations:

• **Brand-Isolated Retrieval:** Rewrites are synthesized exclusively from gold-standard approved copy records (\`isApproved: true\`) tagged with the target brand profile ID. Acme Corp never retrieves TechCorp copy.
• **Factual Constraint Preservation:** Tokenized regex guards detect and lock hard numerical claims—such as percentages (*"60%"*, *"100%"*), currency amounts (*"$50M"*), and compliance standards (*"SOC-2 Type II"*, *"ISO 27001"*).
• **Guaranteed Accuracy:** Metrics are strictly retained in the output while elevating marketing tone.
• **Side-by-Side Comparison:** In the **Findings** view, click **"View RAG Rewrite"** to see original text, the compliant rewrite, preserved facts, and cited brand proof snippets.`
  }

  // 5. Webhooks & CMS Integrations
  if (
    query.includes('webhook') ||
    query.includes('slack') ||
    query.includes('hubspot') ||
    query.includes('wordpress') ||
    query.includes('integration') ||
    query.includes('cms') ||
    query.includes('idempotenc')
  ) {
    return `Inkloom AI's **Webhooks & Headless CMS Connectors** automate downstream publishing safely:

• **Slack Alert Connector:** Formats and dispatches Block Kit cards containing audit scores, reviewer persona, and audit summaries directly to marketing channels.
• **HubSpot & WordPress Draft Connectors:** Automatically creates draft posts with \`post_status="draft"\`. Auto-publishing without human editorial sign-off is strictly prohibited.
• **Idempotency Keys:** Every dispatch uses a compound key (\`idem_{checkId}_{provider}_{decision}\`) to prevent double-posting or duplicate webhooks on network retries.
• **In-App Simulation Mode:** Open the **"Integrations"** tab in the sidebar to view the live audit table showing Event IDs, Providers, Timestamps, and Delivery Payloads in real time!`
  }

  // 6. Brand Guidelines / Profiles
  if (
    query.includes('guideline') ||
    query.includes('brand profile') ||
    query.includes('rules') ||
    query.includes('restricted') ||
    query.includes('buzzword') ||
    query.includes('acme') ||
    query.includes('techcorp')
  ) {
    return `The **Brand Guidelines** view lets brand administrators configure multi-tenant governance rules:

• **Restricted Buzzwords & Banned Phrases:** Flags superlatives and risky claims (e.g., *"cheap"*, *"miracle"*, *"100% bug-free"*).
• **Required Terms & Claims:** Enforces mandatory legal credentials (e.g., *"SOC-2 Type II certified"*, *"GDPR compliant"*).
• **Tone & Voice Parameters:** Defines approved tone attributes (Authoritative, Professional, Warm) and target audience parameters.
• **Pre-loaded Profiles:** Try switching between **Acme Corp**, **TechCorp**, and **Aldenaire Luxury** to test different rulebooks!`
  }

  // 7. Continuous Monitoring / Surveillance
  if (
    query.includes('monitor') ||
    query.includes('surveillance') ||
    query.includes('channel') ||
    query.includes('drift')
  ) {
    return `The **Continuous Monitoring** dashboard tracks active marketing streams in real time:

• **Channel Surveillance:** Continuously audits digital touchpoints including Corporate Website landing pages, LinkedIn posts, and display retargeting ads.
• **Health Scores & Alerts:** Visualizes compliance health (e.g., 98% Compliant vs. Warning) and flags brand drift when assets deviate from newly ratified tone rules.
• **Audit Trail:** Every scan logs timestamps, compliance scores, and issue breakdowns in MongoDB Atlas.`
  }

  // 8. Reports & Certification
  if (
    query.includes('report') ||
    query.includes('certificat') ||
    query.includes('audit log') ||
    query.includes('export')
  ) {
    return `In the **Reports** view, you can:

• View overall compliance statistics, audit distributions, and top recurring violations.
• Generate an official, audit-ready **Brand Compliance Certificate** with verification timestamps.
• Download machine-readable **JSON Audit Trails** for compliance archives and enterprise risk assessments.`
  }

  // 9. Team & Hackathon Info
  if (
    query.includes('team') ||
    query.includes('who built') ||
    query.includes('creator') ||
    query.includes('aryan') ||
    query.includes('pranav') ||
    query.includes('labeeba') ||
    query.includes('abhiman') ||
    query.includes('codenexus')
  ) {
    return `Inkloom AI was developed for the **CodeNexus 2026 National Hackathon** (Round 3 Finalist) by **Team ryanmishra4551** (Team ID: %65) from Shri Ramswaroop Memorial University:

• **Aryan Mishra (Team Leader):** Frontend UI/UX, Testing, and Compliance Reports.
• **Pranav Sharma:** Backend Node.js REST APIs, MongoDB Atlas schemas, and Python NLP service.
• **Labeeba Khan:** Research Lead, brand guideline rulebooks, and QA test matrices.
• **Abhiman Singh Yadav:** Product & Architecture Lead, Visual Auditing Engine (WCAG math), Contextual RAG Rewriter, and Webhook Gate.`
  }

  // 10. Greetings & Friendly Help
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.includes('help') ||
    query.includes('who are you') ||
    query.includes('what can you do')
  ) {
    return `Hello! I’m **Inkloom Guide**, your dedicated product assistant inside Inkloom AI. 

I can help you navigate the platform and answer any questions about:
1. **Running Content Audits:** Step-by-step guidance on text and image asset checks.
2. **Visual Palette Auditing:** Sharp & ColorThief color clustering, WCAG 2.1 contrast math.
3. **Contextual RAG Rewriter:** Brand-isolated exemplar retrieval and factual constraint locking.
4. **Human Review Queue:** Approval gates, Slack Block Kit alerts, and CMS draft sync.
5. **Brand Guidelines & Profiles:** Configuring restricted phrases and brand rules.

What would you like to explore first?`
  }

  // 11. Smart General Fallback
  return `Inkloom AI is an intelligent brand governance platform designed to ensure all marketing copy and visual assets comply with enterprise brand standards before publication.

Key capabilities available in this studio:
• **Audit:** Run multi-modal audits on copy and images in **"+ New Check"**.
• **Review:** Inspect violations and RAG rewrites in **"Findings"** and **"Approved Copy"**.
• **Authorize:** Review and approve drafts in the **"Review Queue"** to safely trigger Slack, HubSpot, and WordPress webhooks.
• **Surveil:** Monitor live digital channels in **"Continuous Monitoring"**.

Feel free to ask a specific question like *"How do I run my first content audit?"* or *"Explain the visual brand checks."*!`
}
