import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userScore } = body

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a random decision with weighted probabilities
    const decisions = ["refund", "credit", "reject"]
    const weights = [0.4, 0.3, 0.3] // 40% refund, 30% credit, 30% reject
    const decision = weightedRandom(decisions, weights)

    // Generate a random condition grade
    const conditions = ["Brand New", "Good", "Acceptable", "Poor"]
    const conditionWeights = [0.2, 0.4, 0.3, 0.1]
    const condition = weightedRandom(conditions, conditionWeights)

    // Generate damage severity based on condition
    let damageSeverity
    if (condition === "Brand New") {
      damageSeverity = weightedRandom(["no damage", "minor defect"], [0.8, 0.2])
    } else if (condition === "Good") {
      damageSeverity = weightedRandom(["no damage", "minor defect", "repairable defect"], [0.5, 0.4, 0.1])
    } else if (condition === "Acceptable") {
      damageSeverity = weightedRandom(["minor defect", "repairable defect"], [0.6, 0.4])
    } else {
      damageSeverity = weightedRandom(["repairable defect", "critical failure"], [0.7, 0.3])
    }

    // Calculate score adjustment based on decision
    let scoreAdjustment
    let newScore
    if (decision === "refund") {
      scoreAdjustment = "+2 points"
      newScore = Math.min(userScore + 2, 100)
    } else if (decision === "credit") {
      scoreAdjustment = "+0 points"
      newScore = userScore
    } else {
      scoreAdjustment = "-5 points"
      newScore = Math.max(userScore - 5, 0)
    }

    // Generate marketplace data
    const marketplaceData = {
      facebook: {
        estimatedValue: `$${(Math.random() * 50 + 50).toFixed(2)}`,
        timeToSell: "2-3 days",
        fees: "No fees",
      },
      kijiji: {
        estimatedValue: `$${(Math.random() * 40 + 45).toFixed(2)}`,
        timeToSell: "4-7 days",
        fees: "Optional promotion fees",
      },
      poshmark: {
        estimatedValue: `$${(Math.random() * 30 + 40).toFixed(2)}`,
        timeToSell: "5-10 days",
        fees: "20% of sale price",
      },
      offerup: {
        estimatedValue: `$${(Math.random() * 20 + 35).toFixed(2)}`,
        timeToSell: "3-5 days",
        fees: "7.9% of sale price",
      },
    }

    // Generate mock response
    const mockResponse = {
      condition_grade: condition,
      condition_reasoning: `The item appears to be in ${condition.toLowerCase()} condition based on the image provided.`,
      damage_severity: damageSeverity,
      order_consistency: "consistent",
      order_discrepancies: [],
      ai_confidence: "high",
      human_review_flag: false,
      comment_analysis: {
        sentiment: weightedRandom(["positive", "neutral", "negative"], [0.3, 0.4, 0.3]),
        fraud_risk: weightedRandom(["low", "medium", "high"], [0.7, 0.2, 0.1]),
        red_flags: [],
      },
      user_score_impact: decision,
      return_timing_impact: decision,
      final_decision: decision,
      item_disposition: weightedRandom(["resell", "refurbish", "salvage", "landfill"], [0.4, 0.3, 0.2, 0.1]),
      user_score_adjustment: scoreAdjustment,
      new_user_score: newScore,
      decision_reasoning: getDecisionReasoning(decision, condition, damageSeverity),
      resale_ad: decision !== "refund" ? generateMockResaleAd(condition, damageSeverity) : "",
      marketplace_data: marketplaceData,
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("Error in mock API:", error)
    return NextResponse.json({ error: "Failed to process mock return analysis" }, { status: 500 })
  }
}

// Helper function for weighted random selection
function weightedRandom<T>(items: T[], weights: number[]): T {
  const cumulativeWeights: number[] = []
  let sum = 0

  for (const weight of weights) {
    sum += weight
    cumulativeWeights.push(sum)
  }

  const random = Math.random() * sum

  for (let i = 0; i < items.length; i++) {
    if (random < cumulativeWeights[i]) {
      return items[i]
    }
  }

  return items[items.length - 1]
}

function getDecisionReasoning(decision: string, condition: string, damageSeverity: string): string {
  if (decision === "refund") {
    return `The item is in ${condition.toLowerCase()} condition with ${damageSeverity}. Based on our policy, you are eligible for a full refund.`
  } else if (decision === "credit") {
    return `Due to the ${condition.toLowerCase()} condition and ${damageSeverity} of the item, we can offer store credit instead of a full refund.`
  } else {
    return `Unfortunately, the ${condition.toLowerCase()} condition with ${damageSeverity} makes this item ineligible for return under our policy. We recommend exploring the marketplace options below.`
  }
}

function generateMockResaleAd(condition: string, damageSeverity: string): string {
  const price = Math.floor(Math.random() * 50 + 50)

  return `
  FOR SALE: Premium Product
  Condition: ${condition}
  Damage Severity: ${damageSeverity}
  Price: $${price} (Negotiable)
  Description: This item is in ${condition.toLowerCase()} condition with ${damageSeverity}. It is perfect for someone looking for a great deal!
  Expected Time to Sell: 1-2 weeks
  Contact for more details or to make an offer!
  `.trim()
}


