"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, X } from "lucide-react"

export function ReturnForm() {
  const [reason, setReason] = useState("No longer needed")
  const [comments, setComments] = useState("")
  const [commentsError, setCommentsError] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [imageError, setImageError] = useState(false)

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Limit to 200 characters
    if (e.target.value.length <= 200) {
      setComments(e.target.value)
      if (e.target.value.trim().length > 0) {
        setCommentsError(false)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setUploadedImages([...uploadedImages, event.target.result])
          setImageError(false)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
    if (newImages.length === 0) {
      setImageError(true)
    }
  }

  const validateForm = () => {
    let isValid = true

    if (comments.trim().length === 0) {
      setCommentsError(true)
      isValid = false
    }

    if (uploadedImages.length === 0) {
      setImageError(true)
      isValid = false
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log("Form submitted")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-4 border-2 border-pink-500">
      <div className="mb-4">
        <label htmlFor="return-reason" className="block text-sm font-medium mb-1">
          Why are you returning this?
        </label>
        <select
          id="return-reason"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="No longer needed">No longer needed</option>
          <option value="Inaccurate website description">Inaccurate website description</option>
          <option value="Item defective">Item defective</option>
          <option value="Better price available">Better price available</option>
          <option value="Product damaged">Product damaged</option>
          <option value="Wrong item was sent">Wrong item was sent</option>
          <option value="Missing parts or accessories">Missing parts or accessories</option>
          <option value="Arrived too late">Arrived too late</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="comments" className="block text-sm font-medium mb-1">
          Comments <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comments"
          className={`w-full border ${commentsError ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-sm`}
          rows={4}
          value={comments}
          onChange={handleCommentsChange}
          placeholder="Please provide details about your return reason"
          required
        />
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${commentsError ? "text-red-500" : "text-gray-500"}`}>
            {commentsError ? "Comments are required" : `${200 - comments.length} characters remaining`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Upload Images <span className="text-red-500">*</span>
        </label>
        <div
          className={`border-2 border-dashed ${imageError ? "border-red-500" : "border-gray-300"} rounded-md p-4 text-center`}
        >
          <div className="space-y-2">
            {uploadedImages.length === 0 ? (
              <>
                <Camera className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">Upload photos of your item</p>
                <p className="text-xs text-gray-400">Please provide clear images showing the condition</p>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md">
                <Upload className="mr-2 h-4 w-4" />
                {uploadedImages.length > 0 ? "Add More Photos" : "Upload Photos"}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            {imageError && <p className="text-xs text-red-500 mt-1">At least one image is required</p>}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-700 mt-4">
        <p className="font-bold mb-1">NOTE:</p>
        <p>
          We aren't able to offer policy exceptions in response to comments. Do not include personal information as
          these comments may be shared with external service providers to identify product defects.
        </p>
      </div>
    </form>
  )
}

