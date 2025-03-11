"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { useReturn } from "@/context/return-context"
import { ReturnImageUpload } from "./return-image-upload"
import { ReturnComments } from "./return-comments"
import { MarketplaceOptions } from "./marketplace-options"
import type { JudgmentResult } from "./ai-judgment"
import { useRouter } from "next/navigation"

interface ReturnItemsProps {
  orderNumber?: string
  shippingAddress?: string
  analysisResult: JudgmentResult | null
}

// Updated order dates in descending order (most recent first)
const orderDates: Record<string, string> = {
  "1045-F1": "March 4, 2025", // Most recent - White shirt
  "1046-F2": "February 13, 2025",
  "1047-F3": "January 8, 2025", // Oldest
}

export function ReturnItems({ orderNumber, shippingAddress, analysisResult }: ReturnItemsProps) {
  const { selectedItems, updateItemQuantity, reason, setReason, uploadedImages } = useReturn()
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null)
  const router = useRouter()

  // Group items by order ID
  const itemsByOrder = selectedItems.reduce(
    (acc, item) => {
      if (!acc[item.orderId]) {
        acc[item.orderId] = []
      }
      acc[item.orderId].push(item)
      return acc
    },
    {} as Record<string, typeof selectedItems>,
  )

  const handleQuantityChange = (itemId: number, quantity: number) => {
    updateItemQuantity(itemId, quantity)
  }

  const toggleItemDescription = (itemId: number) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null)
    } else {
      setExpandedItemId(itemId)
    }
  }

  // Redirect back to orders page if no items are selected
  useEffect(() => {
    if (selectedItems.length === 0) {
      // Add a small delay to avoid immediate redirect
      const timer = setTimeout(() => {
        router.push("/")
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [selectedItems, router])

  if (selectedItems.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No items selected for return</h3>
        <p className="text-gray-500">Redirecting to orders page...</p>
      </div>
    )
  }

  const item = selectedItems.length > 0 ? selectedItems[0] : null

  return (
    <div className="space-y-6">
      {Object.entries(itemsByOrder).map(([orderId, items]) => (
        <div key={orderId} className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-[#f3f3f3]">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle2 className="h-5 w-5 text-[#f90] mr-2" />
              <div>
                <span className="font-medium">Order #{orderId}</span>
                <div className="text-xs text-gray-500 mt-0.5">Ordered on {orderDates[orderId] || "Unknown date"}</div>
              </div>
              {shippingAddress && (
                <div className="ml-auto text-right">
                  <span className="text-xs text-gray-500">Shipped to:</span>
                  <div className="text-sm">{shippingAddress}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-md p-3 mb-3 last:mb-0">
                <div className="flex items-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-[#0066c0] hover:text-[#c45500] hover:underline cursor-pointer">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => toggleItemDescription(item.id)}
                        className="text-xs text-[#0066c0] hover:text-[#c45500] hover:underline flex items-center"
                      >
                        Item details
                        {expandedItemId === item.id ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{item.weight}</p>
                    <p className="text-sm font-medium">{item.price}</p>
                  </div>
                  <div className="flex items-center ml-4">
                    <select
                      className="border border-gray-300 rounded-md text-sm py-1 pl-2 pr-8"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                    >
                      {Array.from({ length: item.maxQuantity + 1 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-600">{item.maxQuantity}</span>
                  </div>
                </div>

                {expandedItemId === item.id && item.description && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-xs text-gray-700 mb-1">Item Description:</p>
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <ReturnImageUpload />

      <ReturnComments />

      {!analysisResult && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select a return reason</label>
          <select
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="Wrong item received">Wrong item received</option>
            <option value="Customer changed their mind">Customer changed their mind</option>
            <option value="Item damaged">Item damaged</option>
            <option value="Item defective">Item defective</option>
            <option value="Item not as described">Item not as described</option>
          </select>
        </div>
      )}

      {/* Only show marketplace options after analysis is complete and if the decision is "reject" */}
      {analysisResult && analysisResult.final_decision === "reject" && item && (
        <MarketplaceOptions
          itemName={item.name}
          condition={analysisResult.condition_grade}
          originalPrice={item.price}
          analysisResult={analysisResult}
          uploadedImages={uploadedImages}
        />
      )}
    </div>
  )
}


