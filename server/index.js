import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Simple in-memory rate limiter: max 10 requests per username per day
const rateLimits = new Map()
function checkRateLimit(username) {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const entry = rateLimits.get(username) || { count: 0, resetAt: now + dayMs }
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + dayMs
  }
  if (entry.count >= 10) return false
  entry.count++
  rateLimits.set(username, entry)
  return true
}

function buildPrompt(data) {
  const {
    username, businessIdea, category, businessType,
    targetCustomer, problemSolved, solution, budget,
    skills, timeline, pricingIdea,
  } = data

  const timelineLabel = {
    '1week': 'this week',
    '1month': 'within 1 month',
    '3months': 'within 3 months',
    'flexible': 'flexible timeline',
  }[timeline] || timeline

  return `You are an expert MVP business advisor helping a young Kenyan entrepreneur named ${username}.

They have submitted the following business idea details:
- Business Idea: ${businessIdea}
- Category: ${category} (product / service / both)
- Business Type: ${businessType} (physical / digital / both)
- Target Customer: ${targetCustomer}
- Problem Being Solved: ${problemSolved}
- Proposed Solution: ${solution}
- Starting Budget: KSh ${Number(budget).toLocaleString()}
- Skills & Resources Available: ${skills}
- Launch Timeline: ${timelineLabel}
- Pricing Idea: ${pricingIdea || 'Not specified — please suggest a realistic price'}

Generate a practical, detailed MVP plan for this business.

STRICT RULES:
1. All money amounts MUST be in Kenyan Shillings (KSh). Never use USD or any other currency.
2. The plan must be realistic for someone starting with KSh ${Number(budget).toLocaleString()}. Do not suggest anything requiring more than this budget for the MVP.
3. Marketing must specifically name: WhatsApp, TikTok, Instagram, Facebook — with concrete tactics for each.
4. All language must be simple, plain English. No business jargon, no MBA-speak. Write like a smart friend.
5. Validation methods must be free or very cheap (under KSh 500).
6. Go-to-market plan must be executable by ONE person with a smartphone.
7. Be specific to Kenya — reference local context, platforms, and conditions where relevant.
8. Do NOT give generic advice. Everything must be specific to this exact business idea.

Return ONLY a valid JSON object with exactly these fields. No markdown, no explanation, just the JSON:

{
  "businessSummary": "One clear sentence describing the business",
  "targetCustomer": "Who they are, where they are in Kenya, what they need",
  "problemSolved": "The specific pain point — be concrete",
  "valueProposition": "Why a customer would choose this over alternatives or doing nothing",
  "businessType": "Describe the nature of the business",
  "simplestMVP": "The absolute minimum version to start and test — specific and actionable",
  "mustHaveFeatures": ["feature 1", "feature 2", "feature 3"],
  "niceToHaveFeatures": ["feature 1", "feature 2", "feature 3"],
  "keyAssumptions": ["assumption 1", "assumption 2", "assumption 3"],
  "validationMethods": ["method 1 (free/cheap)", "method 2", "method 3"],
  "revenueModel": "How money is made — specific to this business",
  "suggestedPricing": "Specific price range in KSh with reasoning",
  "startupCostEstimate": {
    "total": "KSh X,XXX",
    "breakdown": [
      { "item": "item name", "cost": "KSh XXX" }
    ]
  },
  "goToMarket": ["step 1", "step 2", "step 3"],
  "marketingChannels": {
    "whatsapp": "Specific tactic for WhatsApp",
    "tiktok": "Specific tactic for TikTok",
    "instagram": "Specific tactic for Instagram",
    "facebook": "Specific tactic for Facebook"
  },
  "timeline": [
    { "phase": "Week 1–2", "actions": ["action 1", "action 2"] },
    { "phase": "Month 1", "actions": ["action 1", "action 2"] },
    { "phase": "Month 2–3", "actions": ["action 1", "action 2"] }
  ],
  "keyRisks": [
    { "risk": "risk description", "reduction": "how to reduce it" }
  ],
  "successMetrics": ["metric 1", "metric 2", "metric 3"],
  "next3Steps": ["step 1 (do today)", "step 2 (do this week)", "step 3 (do this month)"],
  "feasibilityScore": { "score": 8, "label": "High" },
  "costLevelScore": { "score": 3, "label": "Low Cost" },
  "speedToLaunchScore": { "score": 9, "label": "Very Fast" }
}

Score explanations:
- feasibilityScore: How viable is this business given the budget, skills, and market? (1=Very Low, 10=Very High)
- costLevelScore: How much money does starting require? (1=Almost Free, 10=Very Expensive)
- speedToLaunchScore: How fast can this be launched? (1=Very Slow, 10=Instant)

For labels use: Very Low / Low / Moderate / High / Very High (for feasibility)
For cost: Very Low Cost / Low Cost / Moderate Cost / High Cost / Very High Cost
For speed: Very Slow / Slow / Moderate / Fast / Very Fast / Instant`
}

app.post('/api/generate', async (req, res) => {
  const data = req.body

  if (!data.username || !data.businessIdea) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  if (!checkRateLimit(data.username)) {
    return res.status(429).json({ error: 'You have reached the limit of 10 plans per day. Please try again tomorrow.' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: buildPrompt(data) }],
    })

    const raw = message.content[0].text.trim()

    // Extract JSON from response (handles cases where model adds text)
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid response format from AI.')

    const plan = JSON.parse(jsonMatch[0])
    return res.json(plan)
  } catch (err) {
    console.error('AI error:', err.message)
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'AI returned an unexpected format. Please try again.' })
    }
    return res.status(500).json({ error: 'Could not generate plan. Please try again in a moment.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`MvpGen API running on port ${PORT}`))
