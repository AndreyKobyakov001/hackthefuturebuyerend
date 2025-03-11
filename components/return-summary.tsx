"use client"

import { useState } from "react"
import { useReturn } from "@/context/return-context"
import { SocialCreditGauge } from "./social-credit-gauge"
import { AIJudgment, type JudgmentResult } from "./ai-judgment"
import { ReturnOptions } from "./return-options"

interface ReturnSummaryProps {
  trackingNumber?: string
}

export function ReturnSummary({ trackingNumber = "FedEx #1234 5678 9012" }: ReturnSummaryProps) {
  const { selectedItems, reason, comments } = useReturn()
  const [analysisResult, setAnalysisResult] = useState<JudgmentResult | null>(null)
  const [returnCompleted, setReturnCompleted] = useState(false)

  const totalItems = selectedItems.reduce((total, item) => total + item.quantity, 0)
  const item = selectedItems.length > 0 ? selectedItems[0] : null

  // Truncate comments if they're too long for the summary
  const truncatedComments = comments && comments.length > 100 ? `${comments.substring(0, 100)}...` : comments

  const handleAnalysisComplete = (result: JudgmentResult) => {
    console.log("Summary received analysis result:", result)
    setAnalysisResult(result)

    // Pass the result to the parent component
    if (window && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("analysisComplete", { detail: result }))
    }
  }

  const handleReturnComplete = () => {
    setReturnCompleted(true)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-4">Summary</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">
              Returning {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
            {<p className="text-sm text-gray-600">Reason: {reason}</p>}
          </div>

          {comments && (
            <div className="border-t border-gray-100 pt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Your comments:</p>
              <p className="text-xs text-gray-600 italic">{truncatedComments}</p>
            </div>
          )}

          {analysisResult && (
            <div>
              <p className="text-sm text-gray-600">{trackingNumber}</p>
            </div>
          )}
        </div>
      </div>

      <SocialCreditGauge score={75} />

      <AIJudgment userScore={75} onAnalysisComplete={handleAnalysisComplete} />

      {analysisResult && !returnCompleted && (
        <ReturnOptions
          decision={analysisResult.final_decision}
          itemName={item?.name || ""}
          itemPrice={item?.price || "$0.00"}
          onComplete={handleReturnComplete}
        />
      )}
    </div>
  )
}


