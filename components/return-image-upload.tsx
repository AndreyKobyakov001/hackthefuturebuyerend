"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, X } from "lucide-react"
import { useReturn } from "@/context/return-context"

export function ReturnImageUpload() {
  const { uploadedImages, setUploadedImages } = useReturn()
  const [imageError, setImageError] = useState(false)

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="font-medium mb-3">
        Upload Item Images <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 font-normal ml-2">(Required for AI Analysis)</span>
      </h3>
      <div
        className={`border-2 border-dashed ${imageError ? "border-red-500" : "border-gray-300"} rounded-md p-4 text-center`}
      >
        <div className="space-y-2">
          {uploadedImages.length === 0 ? (
            <>
              <Camera className="mx-auto h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Upload photos of your return items</p>
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
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#f3f3f3] hover:bg-[#e5e5e5] text-gray-800 text-sm font-medium rounded-md">
              <Upload className="mr-2 h-4 w-4" />
              {uploadedImages.length > 0 ? "Add More Photos" : "Upload Photos"}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          {imageError && <p className="text-xs text-red-500 mt-1">At least one image is required</p>}
        </div>
      </div>
    </div>
  )
}

