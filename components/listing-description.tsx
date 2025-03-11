"use client"

import { useState } from "react"
import { Copy } from "lucide-react"

interface ListingDescriptionProps {
  productName: string
  condition: string
  originalPrice: string
}

export function ListingDescription({ productName, condition = "Like New", originalPrice }: ListingDescriptionProps) {
  const [copied, setCopied] = useState(false)

  const generatedDescription = `
Beautiful 6-Pack of Colisa Wing 3.5 Inch Simple Style Plates in Pink

• Condition: ${condition}
• Original Price: ${originalPrice}
• Size: 3.5 inches each
• Color: Soft Pink
• Quantity: Set of 6
• Material: High-quality ceramic
• Style: Modern, minimalist design

Perfect for everyday dining or special occasions. These plates feature a simple, elegant design with a subtle lip around the edge. Barely used and in excellent condition. Selling because they no longer match my dining room theme.

Local pickup preferred. Cash or electronic payment accepted.

No chips, cracks, or damage. From a smoke-free home.
`.trim()

  const copyDescription = async () => {
    await navigator.clipboard.writeText(generatedDescription)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">AI-Generated Listing</h3>
        <button onClick={copyDescription} className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
          <Copy className="h-3 w-3 mr-1" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-2">
        <pre className="whitespace-pre-wrap text-xs text-gray-600 bg-gray-50 p-2 rounded-md max-h-40 overflow-y-auto">
          {generatedDescription}
        </pre>
      </div>

      <p className="text-xs text-gray-500 mt-2">This description will be used when posting to marketplaces</p>
    </div>
  )
}

