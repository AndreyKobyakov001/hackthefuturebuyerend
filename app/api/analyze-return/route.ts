import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
// Add a new import for cookies at the top of the file
import { cookies } from "next/headers"

// Initialize the Google Generative AI client
const apiKey = process.env.GOOGLE_API_KEY

// Add better error handling and logging for the API key
if (!apiKey) {
  console.error("GOOGLE_API_KEY is not set in environment variables")
}

// Mock implementation for analyzing returns (for testing purposes)
function mockAnalyzeReturn(body: any) {
  console.log("Mock analyzeReturn called with body:", body)
  const { userScore } = body

  // Simulate different outcomes based on user score
  let final_decision = "credit"
  let user_score_adjustment = "+0 points"
  let new_user_score = userScore

  if (userScore > 70) {
    final_decision = "refund"
    user_score_adjustment = "+2 points"
    new_user_score = Math.min(userScore + 2, 100)
  } else if (userScore < 30) {
    final_decision = "reject"
    user_score_adjustment = "-5 points"
    new_user_score = Math.max(userScore - 5, 0)
  }

  const mockResponse = {
    condition_grade: "Acceptable",
    condition_reasoning: "Minor scratches on the surface",
    damage_severity: "minor defect",
    order_consistency: "consistent",
    order_discrepancies: [],
    ai_confidence: "high",
    human_review_flag: false,
    comment_analysis: {
      sentiment: "neutral",
      fraud_risk: "low",
      red_flags: [],
    },
    user_score_impact: final_decision,
    return_timing_impact: final_decision,
    final_decision: final_decision,
    item_disposition: "resell",
    user_score_adjustment: user_score_adjustment,
    new_user_score: new_user_score,
    decision_reasoning: "Based on the mock implementation",
    resale_ad: "Mock resale ad",
    marketplace_data: {
      platform: "Mock Marketplace",
      price: "$25",
      estimated_sale_time: "1 week",
    },
    suggested_title: "Mock Marketplace Title",
    suggested_price: "$25.00",
  }

  return NextResponse.json(mockResponse)
}

// Helper function for weighted random selection
function weightedRandom(options: { [key: string]: number }): string {
  let totalWeight = 0
  for (const key in options) {
    totalWeight += options[key]
  }

  const randomNumber = Math.random() * totalWeight
  let currentWeight = 0

  for (const key in options) {
    currentWeight += options[key]
    if (randomNumber < currentWeight) {
      return key
    }
  }

  return Object.keys(options)[0] // Fallback to the first option
}

// Add a function to check if the item is wrong based on order description and image analysis
// Add this function after the weightedRandom function

// Function to check if the returned item matches the order description
function isWrongItem(jsonResponse: any, orderDescription: string): boolean {
  // Check if the order consistency is explicitly marked as inconsistent
  if (jsonResponse.order_consistency === "inconsistent") {
    return true
  }

  // Check if there are order discrepancies
  if (jsonResponse.order_discrepancies && jsonResponse.order_discrepancies.length > 0) {
    return true
  }

  // For testing purposes, randomly detect wrong items about 10% of the time
  // This is just for demonstration - in a real system, you'd use more sophisticated detection
  if (Math.random() < 0.1) {
    return true
  }

  return false
}

// Function to generate a resale ad
function generateResaleAd(jsonResponse: any, orderDescription: string): string {
  const { condition_grade, damage_severity } = jsonResponse

  let conditionDescription = ""
  switch (condition_grade) {
    case "Brand New":
      conditionDescription = "Pristine condition, like new!"
      break
    case "Good":
      conditionDescription = "Gently used with minor signs of wear."
      break
    case "Acceptable":
      conditionDescription = "Shows some wear and tear but is still functional."
      break
    case "Poor":
      conditionDescription = "Heavily used with significant damage."
      break
    default:
      conditionDescription = "Used condition."
  }

  if (damage_severity !== "no damage") {
    conditionDescription += ` Damage: ${damage_severity}.`
  }

  const price = (Math.random() * 50 + 20).toFixed(2) // Random price between $20 and $70

  return `Selling a ${orderDescription}. ${conditionDescription} Asking $${price}.`
}

// Update the generateMarketplaceData function to use percentage-based pricing
function generateMarketplaceData(jsonResponse: any, orderDescription: string): any {
  // Base percentage based on condition
  let basePercentage = 0.5 // Default 50%

  if (jsonResponse.condition_grade) {
    switch (jsonResponse.condition_grade.toLowerCase()) {
      case "brand new":
        basePercentage = 0.75 // 75% of original price
        break
      case "good":
        basePercentage = 0.6 // 60% of original price
        break
      case "acceptable":
        basePercentage = 0.45 // 45% of original price
        break
      case "poor":
        basePercentage = 0.3 // 30% of original price
        break
    }
  }

  // Adjust for damage severity
  if (jsonResponse.damage_severity) {
    switch (jsonResponse.damage_severity) {
      case "no damage":
        basePercentage += 0.05 // +5% for no damage
        break
      case "minor defect":
        basePercentage -= 0.05 // -5% for minor defects
        break
      case "repairable defect":
        basePercentage -= 0.1 // -10% for repairable defects
        break
      case "critical failure":
        basePercentage -= 0.15 // -15% for critical failures
        break
    }
  }

  // Ensure percentage stays within 30-75% range
  basePercentage = Math.max(0.3, Math.min(0.75, basePercentage))

  // Assume a base price of $50 if we don't have other information
  const basePrice = 50

  // Calculate prices with slight variations
  const facebookPrice = (basePrice * basePercentage * (1 + Math.random() * 0.05)).toFixed(2)
  const kijijiPrice = (basePrice * basePercentage * (0.95 - Math.random() * 0.05)).toFixed(2)
  const poshmarkPrice = (basePrice * basePercentage * (0.9 - Math.random() * 0.05)).toFixed(2)
  const offerupPrice = (basePrice * basePercentage * (0.85 - Math.random() * 0.05)).toFixed(2)

  return {
    facebook: {
      estimatedValue: `$${facebookPrice}`,
      timeToSell: "2-3 days",
      fees: "No fees",
    },
    kijiji: {
      estimatedValue: `$${kijijiPrice}`,
      timeToSell: "4-7 days",
      fees: "Optional promotion fees",
    },
    poshmark: {
      estimatedValue: `$${poshmarkPrice}`,
      timeToSell: "5-10 days",
      fees: "20% of sale price",
    },
    offerup: {
      estimatedValue: `$${offerupPrice}`,
      timeToSell: "3-5 days",
      fees: "7.9% of sale price",
    },
  }
}

// Update the POST function to handle forceProceed flag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      imageUrl,
      userComment,
      userScore,
      daysSincePurchase,
      orderDescription,
      harshMode = false,
      useMock = false,
      forceProceed = false, // Add this flag to handle forced proceeding
    } = body

    if (!imageUrl || !userComment || userScore === undefined || daysSincePurchase === undefined || !orderDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If mock is explicitly requested, use the mock implementation
    if (useMock) {
      console.log("Using mock implementation as requested")
      return mockAnalyzeReturn(body)
    }

    // If we have an API key and we're not explicitly using the mock implementation, try the real API
    if (apiKey && apiKey.trim() !== "") {
      console.log("Attempting to use real Gemini API")

      // Fetch the image and convert to base64
      let imageData
      try {
        // If the image URL is already a data URL, use it directly
        if (imageUrl.startsWith("data:")) {
          console.log("Using provided data URL for image")
          imageData = imageUrl
        } else {
          // Otherwise, fetch the image
          console.log("Fetching image from URL:", imageUrl)
          const imageResponse = await fetch(imageUrl)
          const imageBuffer = await imageResponse.arrayBuffer()
          const base64Image = Buffer.from(imageBuffer).toString("base64")
          const mimeType = imageResponse.headers.get("content-type") || "image/jpeg"
          imageData = `data:${mimeType};base64,${base64Image}`
          console.log("Successfully converted image to data URL")
        }
      } catch (error) {
        console.error("Error processing image:", error)
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
      }

      try {
        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        // Build the prompt similar to the Python version
        const prompt = `Analyze this return request considering ALL factors:

1. ITEM CONDITION (from image):
- Grade options: Brand New, Good, Acceptable, Poor
- Describe specific flaws/features justifying the grade
- Specify any damage detected and tag severity: no damage, minor defect, repairable defect, critical failure
- If the item is Brand New and recently returned (within 30 days), strongly consider a full refund unless there are clear signs of misuse or fraud.

2. ORDER DESCRIPTION: "${orderDescription}"
- Verify returned item matches the order:
  * Check for consistency in item type, brand, and features
  * Flag discrepancies (e.g., wrong item, mismatched description)
- If any of: damaged upon arrival, minor but believable description errors (such as shade similarity - pink and magenta), or size errors are mentioned, or otherwise honest mistakes that amount to the customer not wanting the item anymore, use your best judgment on whether or not to flag that as suspicious.  
- However, major discrepancies, such as the item being more than 80% dissimilar, are still suspicious. 

3. AI CONFIDENCE:
- If uncertain about condition (e.g., blurry image, ambiguous damage), confidence <70%
- Flag for human review if confidence below threshold

4. USER COMMENT ANALYSIS: "${userComment}"
- Check for red flags:
  * Repetitive/keyword-stuffed language
  * Inconsistent damage descriptions
  * Fraud patterns ("item never arrived", "not as described" without specifics)
- Assign fraud_risk: low/medium/high

5. USER SCORE: ${userScore}/100
- Consider the user's trust score when making the final decision, but do not let it override clear evidence of the item's condition or fraud risk.

6. RETURN TIMING: ${daysSincePurchase} days since purchase
- If the item is Brand New and returned within 30 days, prioritize a full refund unless there are clear issues.
- For older returns, consider store credit or rejection based on the item's condition and fraud risk.

7. AI LENIENCY MODE: ${harshMode ? "HARSH" : "STANDARD"}
- Harsh: Downgrade condition by one grade
- Lenient: Consider borderline cases favorably

8. USER SCORE ADJUSTMENT:
- If return is valid and not fraudulent: +2 points
- If store credit is issued: +0 points
- If return is rejected: -5 points
- If return is fraudulent: -20 points

9. RESALE AD (if rejected for full refund):
- Generate a resale ad for platforms like Facebook Marketplace or Kijiji
- Include believable pricing, a description of the item, condition description, and expected time to sell
- Also provide a suggested title for the marketplace listing that accurately describes the item and its condition
- Provide a suggested price based on the item's condition and market value

OUTPUT AS JSON. INCLUDE ALL FIELDS EVEN IF EMPTY:
{
    "condition_grade": "...",
    "condition_reasoning": "...",
    "damage_severity": "no damage/minor defect/repairable defect/critical failure",
    "order_consistency": "consistent/inconsistent",
    "order_discrepancies": ["list", "of", "mismatches"],
    "ai_confidence": "high/medium/low",
    "human_review_flag": true/false,
    "comment_analysis": {
        "sentiment": "positive/neutral/negative",
        "fraud_risk": "low/medium/high",
        "red_flags": ["list", "of", "patterns"]
    },
    "user_score_impact": "refund/credit/reject",
    "return_timing_impact": "refund/credit/reject",
    "final_decision": "refund/credit/reject",
    "item_disposition": "resell/refurbish/salvage/landfill",
    "user_score_adjustment": "+X/-X points",
    "new_user_score": "updated score",
    "decision_reasoning": "...",
    "resale_ad": "Generated ad text (if applicable)",
    "suggested_title": "A marketplace title for the item",
    "suggested_price": "$XX.XX"
}`

        // Call the Gemini API
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: imageData.split(",")[1] } }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        })

        const response = result.response
        const text = response.text()

        // Extract JSON from the response
        let jsonResponse
        try {
          // Try to parse the response as JSON directly
          jsonResponse = JSON.parse(text)
        } catch (e) {
          // If direct parsing fails, try to extract JSON from markdown code blocks
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
          if (jsonMatch && jsonMatch[1]) {
            try {
              jsonResponse = JSON.parse(jsonMatch[1])
            } catch (e2) {
              console.error("Failed to parse JSON from code block:", e2)
              return NextResponse.json({ error: "Failed to parse AI response as JSON" }, { status: 500 })
            }
          } else {
            console.error("Failed to extract JSON from response")
            return NextResponse.json({ error: "Failed to extract JSON from AI response" }, { status: 500 })
          }
        }

        // Check if the item is wrong based on the analysis
        const wrongItem = isWrongItem(jsonResponse, orderDescription)

        // If it's a wrong item and not forcing to proceed, check if this is the first or second attempt
        if (wrongItem && !forceProceed) {
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
                error:
                  "This is the second time we've detected a mismatch. Proceeding may flag your return as suspicious.",
                first_attempt: false,
              },
              { status: 400 },
            )

            return response
          }
        }

        // If we're forcing to proceed with a wrong item, or if it's not a wrong item
        // Check if this is a second wrong item attempt that we're forcing through
        if (forceProceed && wrongItem) {
          const cookieStore = cookies()
          const wrongItemAttempt = cookieStore.get("wrong_item_attempt")

          if (wrongItemAttempt) {
            // This is a second attempt being forced through - flag as suspicious
            jsonResponse.comment_analysis.fraud_risk = "high"
            if (!jsonResponse.comment_analysis.red_flags) {
              jsonResponse.comment_analysis.red_flags = []
            }
            jsonResponse.comment_analysis.red_flags.push("Item in image doesn't match order description")
            jsonResponse.human_review_flag = true

            // Update the decision reasoning
            jsonResponse.decision_reasoning =
              "Our analysis detected suspicious patterns. The item in the image doesn't appear to match what was originally purchased. This return has been flagged for human review."

            // Set the final decision to reject if it wasn't already
            if (jsonResponse.final_decision !== "reject") {
              jsonResponse.final_decision = "reject"
              jsonResponse.user_score_adjustment = "-20 points"
              jsonResponse.new_user_score = Math.max(userScore - 20, 0)
            }

            // Clear the cookie
            const response = NextResponse.json(jsonResponse)
            response.cookies.set("wrong_item_attempt", "", {
              maxAge: 0,
              path: "/",
            })

            return response
          }
        }

        // Ensure all required fields are present
        if (!jsonResponse.comment_analysis?.fraud_risk) {
          if (!jsonResponse.comment_analysis) {
            jsonResponse.comment_analysis = {}
          }
          jsonResponse.comment_analysis.fraud_risk = "low" // Default to low if missing
        }

        // Calculate user score adjustment if not already done by the model
        if (!jsonResponse.user_score_adjustment || !jsonResponse.new_user_score) {
          const fraudRisk = jsonResponse.comment_analysis.fraud_risk

          if (jsonResponse.final_decision === "refund" && fraudRisk === "low") {
            jsonResponse.user_score_adjustment = "+2 points"
            jsonResponse.new_user_score = Math.min(userScore + 2, 100) // Cap at 100
          } else if (jsonResponse.final_decision === "credit") {
            jsonResponse.user_score_adjustment = "+0 points"
            jsonResponse.new_user_score = userScore
          } else if (jsonResponse.final_decision === "reject") {
            if (fraudRisk === "high") {
              jsonResponse.user_score_adjustment = "-20 points"
              jsonResponse.new_user_score = Math.max(userScore - 20, 0) // Floor at 0
            } else {
              jsonResponse.user_score_adjustment = "-5 points"
              jsonResponse.new_user_score = Math.max(userScore - 5, 0)
            }
          }
        }

        // Generate resale ad if item is rejected for full refund and not already provided
        if (
          (jsonResponse.final_decision === "credit" || jsonResponse.final_decision === "reject") &&
          !jsonResponse.resale_ad
        ) {
          jsonResponse.resale_ad = generateResaleAd(jsonResponse, orderDescription)
        }

        // Generate suggested title and price if not already provided
        if (!jsonResponse.suggested_title) {
          const condition = jsonResponse.condition_grade
          const damage = jsonResponse.damage_severity

          let title = ""
          if (condition === "Brand New") {
            title = `Brand New ${orderDescription}`
          } else if (damage === "no damage") {
            title = `${condition} ${orderDescription} - Like New!`
          } else if (damage === "minor defect") {
            title = `${condition} ${orderDescription} - Minor Wear`
          } else if (damage === "repairable defect") {
            title = `${condition} ${orderDescription} - Needs Repair`
          } else {
            title = `${condition} ${orderDescription} - As Is`
          }

          jsonResponse.suggested_title = title
        }

        if (!jsonResponse.suggested_price) {
          // Base price on condition
          let basePrice = 0
          switch (jsonResponse.condition_grade.toLowerCase()) {
            case "brand new":
              basePrice = 75
              break
            case "good":
              basePrice = 50
              break
            case "acceptable":
              basePrice = 35
              break
            case "poor":
              basePrice = 20
              break
            default:
              basePrice = 40
          }

          // Adjust for damage
          if (jsonResponse.damage_severity === "minor defect") {
            basePrice *= 0.8
          } else if (jsonResponse.damage_severity === "repairable defect") {
            basePrice *= 0.6
          } else if (jsonResponse.damage_severity === "critical failure") {
            basePrice *= 0.3
          }

          jsonResponse.suggested_price = `$${Math.round(basePrice).toFixed(2)}`
        }

        // Generate marketplace data if not already provided
        if (!jsonResponse.marketplace_data) {
          jsonResponse.marketplace_data = generateMarketplaceData(jsonResponse, orderDescription)
        }

        return NextResponse.json(jsonResponse)
      } catch (error) {
        console.error("Error with Google Generative AI:", error)

        // If there's an API key error or any other error with the Google API,
        // fall back to the mock implementation
        console.log("Falling back to mock implementation due to API error")
      }
    }

    // If we got here, either we don't have an API key, or the API call failed,
    // or we explicitly requested the mock implementation
    // In any case, use the mock implementation
    console.log("Using mock implementation")
    return mockAnalyzeReturn({ ...body, forceProceed })
  } catch (error) {
    console.error("Error processing return analysis:", error)
    return NextResponse.json({ error: "Failed to process return analysis" }, { status: 500 })
  }
}

