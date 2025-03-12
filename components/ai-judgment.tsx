"use client"

import { useState } from "react"
import { useReturn } from "@/context/return-context"
import { Loader2, UserRound, CheckCircle } from "lucide-react"

interface AIJudgmentProps {
  userScore: number
  onAnalysisComplete: (result: JudgmentResult) => void
}

export interface JudgmentResult {
  condition_grade: string
  damage_severity: string
  final_decision: "refund" | "credit" | "reject"
  user_score_adjustment: string
  new_user_score: number
  decision_reasoning: string
  resale_ad?: string
  suggested_title?: string // Add this field for AI-generated title
  suggested_price?: string // Add this field for AI-generated price
  comment_analysis: {
    sentiment: string
    fraud_risk: string
    red_flags: string[]
  }
  order_consistency: string
  order_discrepancies: string[]
  ai_confidence: string
  human_review_flag: boolean
  marketplace_data?: {
    facebook: {
      estimatedValue: string
      timeToSell: string
      fees: string
    }
    kijiji: {
      estimatedValue: string
      timeToSell: string
      fees: string
    }
    poshmark: {
      estimatedValue: string
      timeToSell: string
      fees: string
    }
    offerup: {
      estimatedValue: string
      timeToSell: string
      fees: string
    }
  }
}

export function AIJudgment({ userScore, onAnalysisComplete }: AIJudgmentProps) {
  const { selectedItems, comments, uploadedImages } = useReturn()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JudgmentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [useMock, setUseMock] = useState(false)
  const [humanReviewRequested, setHumanReviewRequested] = useState(false)
  const [humanReviewLoading, setHumanReviewLoading] = useState(false)
  // Update the state to include a warning state for wrong item detection
  const [wrongItemWarning, setWrongItemWarning] = useState(false)
  const [isFirstWrongItemAttempt, setIsFirstWrongItemAttempt] = useState(true)

  // Get the first selected item for analysis
  const item = selectedItems.length > 0 ? selectedItems[0] : null

  // Calculate days since purchase based on the order ID
  const calculateDaysSincePurchase = () => {
    if (!item) return 30 // Default value

    const currentDate = new Date()
    let orderDate

    // Set the order date based on the order ID with updated dates
    switch (item.orderId) {
      case "1045-F1":
        orderDate = new Date("2025-03-15") // Most recent
        break
      case "1046-F2":
        orderDate = new Date("2025-02-13") // Middle
        break
      case "1047-F3":
        orderDate = new Date("2025-01-08") // Oldest
        break
      default:
        orderDate = new Date()
        orderDate.setDate(orderDate.getDate() - 30) // Default to 30 days ago
    }

    const timeDiff = currentDate.getTime() - orderDate.getTime()
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  }

  const daysSincePurchase = calculateDaysSincePurchase()

  // Modify the analyzeReturn function to handle wrong item detection as a warning
  const analyzeReturn = async () => {
    if (!item) return

    // Check if comments are provided
    if (!comments || comments.trim().length === 0) {
      setError("Please provide comments about your return before analysis")
      return
    }

    // Check if at least one image is uploaded
    if (!uploadedImages || uploadedImages.length === 0) {
      setError("Please upload at least one image of your item before analysis")
      return
    }

    setLoading(true)
    setError(null)
    setWrongItemWarning(false)

    try {
      // Use the first uploaded image instead of the product image
      const imageToUse = uploadedImages[0]

      console.log("Sending analysis request with data:", {
        imageUrl: imageToUse, // Use uploaded image
        userComment: comments,
        userScore,
        daysSincePurchase,
        orderDescription: item.description || item.name,
        useMock,
      })

      const response = await fetch("/api/analyze-return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageToUse, // Use uploaded image
          userComment: comments,
          userScore,
          daysSincePurchase,
          orderDescription: item.description || item.name,
          harshMode: false,
          useMock: useMock,
          generateTitle: true, // Request title generation
          generatePrice: true, // Request price generation
        }),
      })

      const data = await response.json()

      // Check if the response indicates a wrong item
      if (!response.ok && data.error && data.error.includes("doesn't seem to match")) {
        // Show warning instead of error
        setWrongItemWarning(true)
        setIsFirstWrongItemAttempt(data.first_attempt || true)
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status: ${response.status}`)
      }

      console.log("API Response:", data)

      // Ensure the final_decision is one of the expected values
      if (!["refund", "credit", "reject"].includes(data.final_decision)) {
        data.final_decision = "reject" // Default to reject if invalid
      }

      // Ensure we have a good resale ad
      if (!data.resale_ad || data.resale_ad.trim().length < 10) {
        data.resale_ad = generateResaleAd(data, item?.description || item?.name || "Item")
      }

      setResult(data)
      onAnalysisComplete(data)
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      console.error("Error analyzing return:", err)

      // Try to parse the error response
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"

      // If we've already retried, don't retry again
      if (retryCount > 0 || useMock) {
        console.log("Already retried or using mock, not retrying again")
        setError(errorMessage)
        setLoading(false)
        return
      }

      // Increment retry count
      setRetryCount(retryCount + 1)

      // If there's an API error, try again with the mock endpoint
      setUseMock(true)
      setError(`${errorMessage} - Retrying with mock data...`)

      // Wait a moment then retry with mock data
      setTimeout(() => {
        analyzeReturn()
      }, 1000)
    } finally {
      if (retryCount === 0 || !useMock) {
        setLoading(false)
      }
    }
  }

  // Add a function to proceed with analysis despite wrong item warning
  const proceedWithAnalysis = async () => {
    setWrongItemWarning(false)
    setLoading(true)

    try {
      // Use the first uploaded image
      const imageToUse = uploadedImages[0]

      const response = await fetch("/api/analyze-return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageToUse,
          userComment: comments,
          userScore,
          daysSincePurchase,
          orderDescription: item?.description || item?.name,
          harshMode: false,
          useMock: useMock,
          generateTitle: true,
          generatePrice: true,
          forceProceed: true, // Signal to the API to proceed despite wrong item
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response after proceeding:", data)

      setResult(data)
      onAnalysisComplete(data)
    } catch (err) {
      console.error("Error after proceeding with analysis:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Toggle between real API and mock
  const toggleMockMode = () => {
    setUseMock(!useMock)
    setError(null)
  }

  // Get decision color
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "refund":
        return "text-green-600"
      case "credit":
        return "text-[#f90]"
      case "reject":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Get score adjustment color
  const getScoreAdjustmentColor = (adjustment: string) => {
    if (adjustment.startsWith("+")) return "text-green-600"
    if (adjustment.startsWith("-")) return "text-red-600"
    return "text-gray-600"
  }

  // Generate a better resale ad based on analysis results
  const generateResaleAd = (result: JudgmentResult, itemName: string) => {
    if (result.resale_ad && result.resale_ad.trim().length > 10) {
      return result.resale_ad
    }

    // Generate a fallback ad if none provided or too short
    const condition = result.condition_grade
    const damage = result.damage_severity

    // Generate a suggested title if not already provided
    if (!result.suggested_title) {
      let adTitle = ""
      if (condition === "Brand New") {
        adTitle = `Brand New ${itemName}`
      } else if (damage === "no damage") {
        adTitle = `${condition} ${itemName} - Like New!`
      } else if (damage === "minor defect") {
        adTitle = `${condition} ${itemName} - Minor Wear`
      } else {
        adTitle = `${condition} ${itemName}`
      }
      result.suggested_title = adTitle
    }

    // Generate a suggested price if not already provided
    if (!result.suggested_price) {
      // Generate a random price between $25 and $75
      const price = Math.floor(Math.random() * 50 + 25)
      result.suggested_price = `$${price}`
    }

    let adText = `FOR SALE: ${result.suggested_title}\n\n`
    adText += `Condition: ${condition}\n`
    adText += `Price: ${result.suggested_price}\n\n`

    // Rest of the function remains the same...
    // Add detailed condition description
    if (damage === "no damage") {
      adText += "This item shows no signs of damage and is in excellent shape.\n"
    } else if (damage === "minor defect") {
      adText += "This item has some minor cosmetic issues but functions perfectly.\n"
    } else if (damage === "repairable defect") {
      adText += "This item has a fixable issue that could be repaired with minimal effort.\n"
    } else {
      adText += "This item has significant wear and is being sold as-is.\n"
    }

    // Add marketplace data if available
    if (result.marketplace_data && result.marketplace_data.facebook) {
      adText += `\nEstimated Value: ${result.marketplace_data.facebook.estimatedValue}\n`
      adText += `Expected Time to Sell: ${result.marketplace_data.facebook.timeToSell}\n`
    }

    adText += "\nLocal pickup preferred. Cash or electronic payment accepted."
    adText += "\nFrom a smoke-free home."

    return adText
  }

  // Handle human review request
  const requestHumanReview = () => {
    setHumanReviewLoading(true)

    // Simulate API call
    setTimeout(() => {
      setHumanReviewLoading(false)
      setHumanReviewRequested(true)
    }, 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">AI Return Analysis</h3>
        <div className="flex gap-2">
          {!result && (
            <button
              onClick={analyzeReturn}
              disabled={
                loading ||
                !item ||
                !comments ||
                comments.trim().length === 0 ||
                !uploadedImages ||
                uploadedImages.length === 0
              }
              className="px-3 py-1 text-sm bg-[#f90] text-white rounded-md hover:bg-[#f0ad4e] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Analyze Return"
              )}
            </button>
          )}
        </div>
      </div>

      {useMock && !loading && !result && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded-md mb-4 text-xs">
          Using mock data for analysis (Gemini API will not be called)
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}

      {/* Add the wrong item warning UI after the error message display */}
      {wrongItemWarning && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Image Mismatch Warning</h4>
          <p className="text-sm mb-3">
            {isFirstWrongItemAttempt
              ? "The image you uploaded doesn't seem to match the item description. This might affect the accuracy of our analysis."
              : "This is the second time we've detected a mismatch. Proceeding may flag your return as suspicious."}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={proceedWithAnalysis}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Proceed Anyway
            </button>
            <button
              onClick={() => setWrongItemWarning(false)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Retake Photo
            </button>
          </div>
        </div>
      )}

      {!result && !loading && !error && !wrongItemWarning && (
        <div className="text-center py-6 text-gray-500">
          <p>Click "Analyze Return" to get AI judgment on your return request</p>
          <p className="text-xs mt-2">
            {!item && "Please select an item to return"}
            {item && (!comments || comments.trim().length === 0) && "Please add comments about your return"}
            {item &&
              comments &&
              comments.trim().length > 0 &&
              (!uploadedImages || uploadedImages.length === 0) &&
              "Please upload at least one image of your item"}
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="gemini-stars mb-2">
              <div className="gemini-star"></div> {/* Top star */}
              <div className="gemini-star"></div> {/* Bottom star */}
              <div className="gemini-star"></div> {/* Center star */}
            </div>
            <p className="text-gray-600 text-lg">Gemini is thinking</p>
          </div>
          <p className="text-sm text-gray-500">Analyzing your return request...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f3f3f3] p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Condition</p>
              <p className="font-medium">{result.condition_grade}</p>
            </div>
            <div className="bg-[#f3f3f3] p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Damage Severity</p>
              <p className="font-medium">{result.damage_severity}</p>
            </div>
          </div>

          <div className="bg-[#f3f3f3] p-3 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Comment Analysis</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">Sentiment</p>
                <p className="font-medium">{result.comment_analysis.sentiment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fraud Risk</p>
                <p className="font-medium">{result.comment_analysis.fraud_risk}</p>
              </div>
            </div>
            {result.comment_analysis.red_flags && result.comment_analysis.red_flags.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Red Flags</p>
                <ul className="text-xs text-red-600 list-disc list-inside">
                  {result.comment_analysis.red_flags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-[#f3f3f3] p-3 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Decision</p>
            <p className={`font-medium ${getDecisionColor(result.final_decision)}`}>
              {result.final_decision === "refund" && "Full Refund Approved"}
              {result.final_decision === "credit" && "Store Credit Approved"}
              {result.final_decision === "reject" && "Return Rejected"}
            </p>
            <p className="text-sm mt-1">{result.decision_reasoning}</p>
          </div>

          <div className="bg-[#f3f3f3] p-3 rounded-md">
            <p className="text-xs text-gray-500 mb-1">Score Impact</p>
            <div className="flex items-center">
              <p className={`font-medium ${getScoreAdjustmentColor(result.user_score_adjustment)}`}>
                {result.user_score_adjustment}
              </p>
              <span className="mx-2 text-gray-400">→</span>
              <p className="font-medium">New Score: {result.new_user_score}</p>
            </div>
          </div>

          {/* Human Review Request Button - only show if not a full refund and not already requested */}
          {result.final_decision !== "refund" && !humanReviewRequested && (
            <div className="mt-4">
              <button
                onClick={requestHumanReview}
                disabled={humanReviewLoading}
                className="w-full flex items-center justify-center py-2 px-4 bg-[#232f3e] text-white rounded-md hover:bg-[#374151] transition-colors"
              >
                {humanReviewLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting request...
                  </>
                ) : (
                  <>
                    <UserRound className="h-4 w-4 mr-2" />
                    Request Human Review
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                A customer service representative will review your case within 24-48 hours
              </p>
            </div>
          )}

          {/* Show confirmation when human review is requested */}
          {humanReviewRequested && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-green-800">Human Review Requested</h4>
              <p className="text-sm text-green-700 mt-1">
                Your request has been submitted. A customer service representative will contact you within 24-48 hours.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

