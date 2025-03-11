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
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      // Check if the response contains an error
      if (data.error) {
        throw new Error(data.error)
      }

      // Ensure the final_decision is one of the expected values
      if (!["refund", "credit", "reject"].includes(data.final_decision)) {
        data.final_decision = "reject" // Default to reject if invalid
      }

      setResult(data)
      onAnalysisComplete(data)
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      console.error("Error analyzing return:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)

      // If we've already retried, don't retry again
      if (retryCount > 0 || useMock) {
        console.log("Already retried or using mock, not retrying again")
        return
      }

      // Increment retry count
      setRetryCount(retryCount + 1)

      // If there's an API error, try again with the mock endpoint
      setUseMock(true)
      setError(`${error} - Retrying with mock data...`)

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

      {!result && !loading && !error && (
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
            <div className="gemini-star"></div> {/* Center star */}
            <div className="gemini-star"></div> {/* Bottom star */}
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


