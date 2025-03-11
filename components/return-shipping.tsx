"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

export function ReturnShipping() {
  const [shippingCarrier, setShippingCarrier] = useState("FedEx")
  const [trackingNumber, setTrackingNumber] = useState("1234 5678 9012")
  const [uploadMethod, setUploadMethod] = useState<"upload" | "none">("upload")

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-medium mb-4">Return shipping options</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="upload-label"
            name="shipping-method"
            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
            checked={uploadMethod === "upload"}
            onChange={() => setUploadMethod("upload")}
          />
          <label htmlFor="upload-label" className="ml-2 text-sm font-medium text-gray-700">
            Upload a return label
          </label>
        </div>

        {uploadMethod === "upload" && (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <button className="text-sm font-medium text-green-600 hover:text-green-500">Add file</button>
                  <p className="text-xs text-gray-500 mt-1">or drop file to upload</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              or <button className="text-green-600 hover:text-green-500">add a return label URL</button>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking number
                </label>
                <input
                  type="text"
                  id="tracking"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="carrier" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping carrier
                </label>
                <select
                  id="carrier"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                >
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="USPS">USPS</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center">
          <input
            type="radio"
            id="no-shipping"
            name="shipping-method"
            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
            checked={uploadMethod === "none"}
            onChange={() => setUploadMethod("none")}
          />
          <label htmlFor="no-shipping" className="ml-2 text-sm font-medium text-gray-700">
            No shipping required
          </label>
        </div>
      </div>
    </div>
  )
}

