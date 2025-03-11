"use client"

import type React from "react"

import { useState } from "react"
import { useReturn } from "@/context/return-context"

export function ReturnComments() {
  const { comments, setComments } = useReturn()
  const [error, setError] = useState(false)
  const maxLength = 500

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxLength) {
      setComments(value)
      if (value.trim().length > 0) {
        setError(false)
      } else if (value.trim().length === 0) {
        setError(true)
      }
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="mb-4">
        <label htmlFor="return-comments" className="block text-sm font-medium text-gray-700 mb-1">
          Comments <span className="text-red-500">*</span>
        </label>
        <textarea
          id="return-comments"
          className={`w-full border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md py-2 px-3 text-sm min-h-[120px]`}
          placeholder="Please explain why you're returning this item and provide any additional details that might be helpful..."
          value={comments}
          onChange={handleCommentsChange}
          required
        />
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
            {error ? "Comments are required" : `${maxLength - comments.length} characters remaining`}
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-700 bg-[#f3f3f3] p-3 rounded-md">
        <p className="font-medium mb-1">Why we need your comments:</p>
        <p>
          Your detailed explanation helps us process your return more efficiently and improve our products and services.
          Please be specific about what was wrong with the item and why it didn't meet your expectations.
        </p>
      </div>
    </div>
  )
}

