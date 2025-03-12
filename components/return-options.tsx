"use client"

import { useState } from "react"
import { Check, CreditCard, DollarSign, Loader2 } from "lucide-react"
import type { JudgmentResult } from "./ai-judgment"

interface ReturnOptionsProps {
  decision: "refund" | "credit" | "reject"
  itemName: string
  itemPrice: string
  onComplete: () => void
  analysisResult?: JudgmentResult // Add the analysis result to access the reasoning
}

export function ReturnOptions({ decision, itemName, itemPrice, onComplete, analysisResult }: ReturnOptionsProps) {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<"refund" | "credit" | null>(null)

  // Extract a brief reason for rejection from the AI's decision reasoning
  const getRejectReason = (): string => {
    if (!analysisResult) return "This item is not eligible for return."

    // Try to extract a concise reason from the decision reasoning
    const reasoning = analysisResult.decision_reasoning || ""

    // Check for common rejection patterns in the reasoning
    if (reasoning.match(/damage[d]?|defect|broken|not functional|wear and tear/i)) {
      return "Item is too damaged or shows excessive wear."
    }

    if (reasoning.match(/outside (of )?return window|past the (return )?deadline|too late|time limit/i)) {
      return "Return window has expired."
    }

    if (reasoning.match(/policy|not covered|not eligible|against (our )?terms/i)) {
      return "Return doesn't meet our policy requirements."
    }

    if (reasoning.match(/misuse|improper use|customer damage|user error/i)) {
      return "Item shows signs of misuse or customer-caused damage."
    }

    if (reasoning.match(/fraud|suspicious|inconsistent|red flag/i)) {
      return "Return request contains inconsistencies or suspicious patterns."
    }

    if (reasoning.match(/wrong item|not match|different|incorrect/i)) {
      return "Item doesn't match what was originally purchased."
    }

    // If no specific pattern is found, extract the first sentence if it's short enough
    const firstSentence = reasoning.split(/\.|!|\?/)[0]
    if (firstSentence && firstSentence.length < 100) {
      return firstSentence + "."
    }

    // Default fallback
    return "Based on our analysis, this return doesn't qualify for a refund."
  }

  const handleSubmit = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLoading(false)
    setCompleted(true)
    onComplete()
  }

  if (completed) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="text-center py-6">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Return Processed Successfully</h3>
          <p className="text-gray-600">
            {selectedOption === "refund"
              ? "Your refund has been initiated and will be processed within 3-5 business days."
              : "Your store credit has been added to your account and is available for immediate use."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Return Options</h3>

      {decision === "reject" ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          <p className="font-medium">Return Not Eligible</p>
          <p className="text-sm mt-1">{getRejectReason()} Please see the marketplace options below for alternatives.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {decision === "refund" && (
              <div
                className={`border rounded-md p-4 cursor-pointer ${
                  selectedOption === "refund" ? "border-[#f90] bg-[#fff8e6]" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedOption("refund")}
              >
                <div className="flex items-center">
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedOption === "refund" ? "border-[#f90] bg-[#f90]" : "border-gray-300"
                    }`}
                  >
                    {selectedOption === "refund" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium">Full Refund</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive {itemPrice} back to your original payment method
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`border rounded-md p-4 cursor-pointer ${
                selectedOption === "credit" ? "border-[#f90] bg-[#fff8e6]" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedOption("credit")}
            >
              <div className="flex items-center">
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                    selectedOption === "credit" ? "border-[#f90] bg-[#f90]" : "border-gray-300"
                  }`}
                >
                  {selectedOption === "credit" && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-[#0066c0] mr-2" />
                    <h4 className="font-medium">Store Credit</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Receive {itemPrice} as store credit for future purchases</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedOption}
            className="w-full bg-[#f90] text-white py-2 px-4 rounded-md hover:bg-[#f0ad4e] focus:outline-none focus:ring-2 focus:ring-[#f90] focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              "Process Return"
            )}
          </button>
        </>
      )}
    </div>
  )
}

