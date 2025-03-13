import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

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

function shouldDetectWrongItem(): boolean {
  // For testing purposes, randomly detect wrong items about 10% of the time
  return Math.random() < 0.1
}

// Update the POST function to handle forceProceed flag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userScore,
      forceProceed = false,
      daysSincePurchase = 3,
      orderDescription = "Generic Item",
      userComment = "",
      reason = "",
    } = body

    // Check for wrong item detection (for testing purposes)
    if (shouldDetectWrongItem() && !forceProceed) {
      // Check if this is the first or second attempt
      const cookieStore = cookies()
      const wrongItemAttempt = cookieStore.get("wrong_item_attempt")

      if (!wrongItemAttempt) {
        // First attempt - set a cookie and return a gentle nudge
        const response = NextResponse.json(
          {
            error:
              "The image you uploaded doesn't seem to match the item description. Please try taking a clearer picture of the correct item.",
            first_attempt: true,
          },
          { status: 400 },
        )

        // Set cookie to expire in 1 hour
        response.cookies.set("wrong_item_attempt", "1", {
          maxAge: 60 * 60,
          path: "/",
        })

        return response
      } else {
        // Second attempt - return a warning but allow proceeding
        const response = NextResponse.json(
          {
            error: "This is the second time we've detected a mismatch. Proceeding may flag your return as suspicious.",
            first_attempt: false,
          },
          { status: 400 },
        )

        return response
      }
    }

    // If we're forcing to proceed with a wrong item
    if (forceProceed) {
      const cookieStore = cookies()
      const wrongItemAttempt = cookieStore.get("wrong_item_attempt")

      if (wrongItemAttempt) {
        // This is a second attempt being forced through - flag as suspicious
        const mockResponse = {
          condition_grade: "Acceptable",
          condition_reasoning:
            "The item appears to be in acceptable condition, but doesn't match the order description.",
          damage_severity: "minor defect",
          order_consistency: "inconsistent",
          order_discrepancies: ["Item doesn't match order description"],
          ai_confidence: "high",
          human_review_flag: true,
          comment_analysis: {
            sentiment: "neutral",
            fraud_risk: "high",
            red_flags: ["Item in image doesn't match order description"],
          },
          user_score_impact: "reject",
          return_timing_impact: "reject",
          final_decision: "reject",
          item_disposition: "reject",
          user_score_adjustment: "-20 points",
          new_user_score: Math.max(userScore - 20, 0),
          decision_reasoning:
            "Our analysis detected suspicious patterns. The item in the image doesn't appear to match what was originally purchased. This return has been flagged for human review.",
          resale_ad: generateMockResaleAd("Poor", "critical failure"),
          marketplace_data: {
            facebook: {
              estimatedValue: `$${(Math.random() * 30 + 20).toFixed(2)}`,
              timeToSell: "5-7 days",
              fees: "No fees",
            },
            kijiji: {
              estimatedValue: `$${(Math.random() * 25 + 15).toFixed(2)}`,
              timeToSell: "7-10 days",
              fees: "Optional promotion fees",
            },
            poshmark: {
              estimatedValue: `$${(Math.random() * 20 + 15).toFixed(2)}`,
              timeToSell: "10-14 days",
              fees: "20% of sale price",
            },
            offerup: {
              estimatedValue: `$${(Math.random() * 15 + 10).toFixed(2)}`,
              timeToSell: "7-10 days",
              fees: "7.9% of sale price",
            },
          },
        }

        // Clear the cookie
        const response = NextResponse.json(mockResponse)
        response.cookies.set("wrong_item_attempt", "", {
          maxAge: 0,
          path: "/",
        })

        return response
      }
    }

    // Update the special case handling in the POST function
    // Replace the existing special case code with this:

    // Special case for critically damaged items that appear to be shipping/manufacturing defects
    const isFragileItem =
      orderDescription.toLowerCase().includes("glass") ||
      orderDescription.toLowerCase().includes("crystal") ||
      orderDescription.toLowerCase().includes("electronic")

    const isDefectiveReason = reason === "Item defective" || reason === "Item damaged" || reason === "Arrived damaged"

    const isShippingOrManufacturingIssue =
      userComment.toLowerCase().includes("broken") ||
      userComment.toLowerCase().includes("shattered") ||
      userComment.toLowerCase().includes("damaged in shipping") ||
      userComment.toLowerCase().includes("arrived broken") ||
      userComment.toLowerCase().includes("manufacturing defect")

    const hasSignsOfUse =
      userComment.toLowerCase().includes("stain") ||
      userComment.toLowerCase().includes("tear") ||
      userComment.toLowerCase().includes("wrinkle") ||
      userComment.toLowerCase().includes("worn") ||
      userComment.toLowerCase().includes("used")

    // Only apply special case if it's a fragile item with a defective reason
    // and comments suggesting shipping/manufacturing issues, with no signs of user wear
    if (isFragileItem && (isDefectiveReason || isShippingOrManufacturingIssue) && !hasSignsOfUse) {
      // Force the condition to be poor and damage to be critical
      const mockResponse = {
        condition_grade: "Poor",
        condition_reasoning: "The item appears to be broken with visible cracks and chips.",
        damage_severity: "critical failure",
        order_consistency: "consistent",
        order_discrepancies: [],
        ai_confidence: "high",
        human_review_flag: false,
        comment_analysis: {
          sentiment: "negative",
          fraud_risk: "low",
          red_flags: [],
        },
        user_score_impact: "refund",
        return_timing_impact: "refund",
        final_decision: "refund",
        item_disposition: "landfill",
        user_score_adjustment: "+2 points",
        new_user_score: Math.min(userScore + 2, 100),
        decision_reasoning:
          "While the item is critically damaged, it appears to have been damaged during shipping or has a manufacturing defect. " +
          "Since the damage is not due to user wear or misuse, we'll process a full refund. " +
          "Please consider recycling this item as it cannot be resold.",
        resale_ad: "",
        not_resellable: true,
        marketplace_data: {
          facebook: {
            estimatedValue: "Not resellable",
            timeToSell: "N/A",
            fees: "N/A",
          },
          kijiji: {
            estimatedValue: "Not resellable",
            timeToSell: "N/A",
            fees: "N/A",
          },
          poshmark: {
            estimatedValue: "Not resellable",
            timeToSell: "N/A",
            fees: "N/A",
          },
          offerup: {
            estimatedValue: "Not resellable",
            timeToSell: "N/A",
            fees: "N/A",
          },
        },
      }

      return NextResponse.json(mockResponse)
    }

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

    // Update the POST function to use condition-based pricing for marketplace data
    // Replace the existing marketplace data generation with this:

    // Generate marketplace data based on condition
    const basePercentage = (() => {
      // Base percentage based on condition
      let percentage = 0.5 // Default 50%

      switch (condition.toLowerCase()) {
        case "brand new":
          percentage = 0.75 // 75% of original price
          break
        case "good":
          percentage = 0.6 // 60% of original price
          break
        case "acceptable":
          percentage = 0.45 // 45% of original price
          break
        case "poor":
          percentage = 0.3 // 30% of original price
          break
      }

      // Adjust for damage severity
      switch (damageSeverity) {
        case "no damage":
          percentage += 0.05 // +5% for no damage
          break
        case "minor defect":
          percentage -= 0.05 // -5% for minor defects
          break
        case "repairable defect":
          percentage -= 0.1 // -10% for repairable defects
          break
        case "critical failure":
          percentage -= 0.15 // -15% for critical failures
          break
      }

      // Ensure percentage stays within 30-75% range
      return Math.max(0.3, Math.min(0.75, percentage))
    })()

    // Assume a base price of $50 if we don't have other information
    const basePrice = 50

    // Calculate prices with slight variations
    const marketplaceData = {
      facebook: {
        estimatedValue: `$${(basePrice * basePercentage * (1 + Math.random() * 0.05)).toFixed(2)}`,
        timeToSell: "2-3 days",
        fees: "No fees",
      },
      kijiji: {
        estimatedValue: `$${(basePrice * basePercentage * (0.95 - Math.random() * 0.05)).toFixed(2)}`,
        timeToSell: "4-7 days",
        fees: "Optional promotion fees",
      },
      poshmark: {
        estimatedValue: `$${(basePrice * basePercentage * (0.9 - Math.random() * 0.05)).toFixed(2)}`,
        timeToSell: "5-10 days",
        fees: "20% of sale price",
      },
      offerup: {
        estimatedValue: `$${(basePrice * basePercentage * (0.85 - Math.random() * 0.05)).toFixed(2)}`,
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

