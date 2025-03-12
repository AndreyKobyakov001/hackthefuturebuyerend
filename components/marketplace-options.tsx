"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"
import type { JudgmentResult } from "./ai-judgment"
import { useRouter } from "next/navigation"

interface MarketplaceOption {
  name: string
  logo: string
  estimatedValue: string
  timeToSell: string
  fees: string
  color: string
  url: string
}

interface MarketplaceOptionsProps {
  itemName: string
  condition: string
  originalPrice: string
  analysisResult: JudgmentResult
  uploadedImages: string[] | null
}

export function MarketplaceOptions({
  itemName,
  condition,
  originalPrice,
  analysisResult,
  uploadedImages,
}: MarketplaceOptionsProps) {
  const [options, setOptions] = useState<MarketplaceOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>("Facebook Marketplace")
  const router = useRouter()

  useEffect(() => {
    // Generate marketplace options based on the analysis result
    if (analysisResult) {
      // Parse the original price to a number
      const priceValue = Number.parseFloat(originalPrice.replace(/[^0-9.]/g, ""))

      // Calculate base value based on condition
      let basePercentage = 0
      switch (condition.toLowerCase()) {
        case "brand new":
          basePercentage = 0.75 // 75% of original price
          break
        case "good":
          basePercentage = 0.6 // 60% of original price
          break
        case "acceptable":
          basePercentage = 0.45 // 45% of original price
          break
        case "poor":
          basePercentage = 0.3 // 30% of original price
          break
        default:
          basePercentage = 0.5 // 50% default
      }

      // Adjust percentage based on damage severity if available
      if (analysisResult.damage_severity) {
        switch (analysisResult.damage_severity) {
          case "no damage":
            basePercentage += 0.05 // +5% for no damage
            break
          case "minor defect":
            basePercentage -= 0.05 // -5% for minor defects
            break
          case "repairable defect":
            basePercentage -= 0.1 // -10% for repairable defects
            break
          case "critical failure":
            basePercentage -= 0.15 // -15% for critical failures
            break
        }
      }

      // Ensure percentage stays within 30-75% range
      basePercentage = Math.max(0.3, Math.min(0.75, basePercentage))

      // Calculate base price
      const basePrice = priceValue * basePercentage

      // Use AI-suggested price for Facebook if available, otherwise calculate it
      const facebookPrice =
        analysisResult.suggested_price || `$${Math.floor(basePrice * (1 + Math.random() * 0.05)).toFixed(2)}`

      // Extract the numeric value from the Facebook price
      const facebookNumericPrice = Number.parseFloat(facebookPrice.replace(/[^0-9.]/g, ""))

      // Generate slightly different prices for other marketplaces, but all based on the condition
      // Each marketplace has a slight variation but stays within the condition-appropriate range
      const kijijiPrice = `$${(basePrice * (0.95 - Math.random() * 0.05)).toFixed(2)}`
      const poshmarkPrice = `$${(basePrice * (0.9 - Math.random() * 0.05)).toFixed(2)}`
      const offerupPrice = `$${(basePrice * (0.85 - Math.random() * 0.05)).toFixed(2)}`

      // Generate marketplace options with variations
      const marketplaceOptions: MarketplaceOption[] = [
        {
          name: "Facebook Marketplace",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-13cBLkqhKaC5MWcfkxOSc8Ihr3BoKq.png",
          estimatedValue: facebookPrice, // Use AI-suggested price
          timeToSell: "2-3 days",
          fees: "No fees",
          color: "bg-[#4267B2]",
          url: "https://www.facebook.com/marketplace/",
        },
        {
          name: "Kijiji",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IU7EGyiHf0Y7YtEvZXP6Ly7SN4erVh.png",
          estimatedValue: kijijiPrice,
          timeToSell: "4-7 days",
          fees: "Optional promotion fees",
          color: "bg-[#373373]",
          url: "https://www.kijiji.ca/",
        },
        {
          name: "Poshmark",
          logo: "/placeholder.svg?height=40&width=40",
          estimatedValue: poshmarkPrice,
          timeToSell: "5-10 days",
          fees: "20% of sale price",
          color: "bg-[#CF0F4E]",
          url: "https://poshmark.com/",
        },
        {
          name: "OfferUp",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tp21eN1SdSRHQziM6k8BkzqV8LdEzn.png",
          estimatedValue: offerupPrice,
          timeToSell: "3-5 days",
          fees: "7.9% of sale price",
          color: "bg-[#00AB80]",
          url: "https://offerup.com/",
        },
      ]

      // Sort by estimated value (highest first)
      marketplaceOptions.sort((a, b) => {
        const valueA = Number.parseFloat(a.estimatedValue.replace(/[^0-9.]/g, ""))
        const valueB = Number.parseFloat(b.estimatedValue.replace(/[^0-9.]/g, ""))
        return valueB - valueA
      })

      setOptions(marketplaceOptions)
    }
  }, [analysisResult, condition, originalPrice])

  // Function to create and store listing data
  const createListingData = (platformName: string, price: string) => {
    // Use the AI-generated title and price if available
    const adTitle = analysisResult.suggested_title || `${condition} ${itemName}`
    const adPrice = price

    // Create a detailed description based on the AI analysis
    let detailedDescription = ""

    // If AI provided a resale ad, use it as a base but enhance it
    if (analysisResult.resale_ad && analysisResult.resale_ad.length > 10) {
      // Clean the resale ad of any price references
      detailedDescription = analysisResult.resale_ad
        .replace(/\$\d+(\.\d+)?/g, "") // Remove prices with $ sign
        .replace(/\b\d+\.\d+\b/g, "") // Remove decimal numbers without $ sign
        .replace(/asking price is.*?\.(\s|$)/i, "") // Remove "asking price is..." phrases
        .replace(/price:.*?\.(\s|$)/i, "") // Remove "Price:..." phrases
        .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
        .trim() // Trim extra spaces
    } else {
      // Create a detailed description from scratch based on AI analysis
      detailedDescription = `Selling a ${itemName} in ${analysisResult.condition_grade.toLowerCase()} condition.\n\n`

      // Add condition details
      if (analysisResult.damage_severity === "no damage") {
        detailedDescription += "This item shows no signs of damage and is in excellent shape. "
      } else if (analysisResult.damage_severity === "minor defect") {
        detailedDescription += "This item has some minor cosmetic issues but functions perfectly. "
      } else if (analysisResult.damage_severity === "repairable defect") {
        detailedDescription += "This item has a fixable issue that could be repaired with minimal effort. "
      } else {
        detailedDescription += "This item has significant wear and is being sold as-is. "
      }

      // Add more details based on the decision reasoning
      if (analysisResult.decision_reasoning) {
        const cleanReasoning = analysisResult.decision_reasoning
          .replace(/based on our policy.*$/i, "")
          .replace(/unfortunately.*$/i, "")
          .replace(/we recommend.*$/i, "")
          .trim()

        if (cleanReasoning) {
          detailedDescription += cleanReasoning + "\n\n"
        }
      }

      // Add pickup/delivery info
      detailedDescription += "Local pickup preferred. Cash or electronic payment accepted.\n\n"

      // Add a note about the condition
      detailedDescription += `From a smoke-free home. ${analysisResult.damage_severity === "no damage" ? "No defects or issues to note." : ""}`
    }

    // Get the image from uploaded images
    const imageToUse = uploadedImages && uploadedImages.length > 0 ? uploadedImages[0] : null

    // Find the matching marketplace option
    const option = options.find((opt) => opt.name === platformName)

    // Store the listing data in localStorage with improved formatting
    const listingData = {
      title: adTitle,
      price: adPrice,
      condition: analysisResult.condition_grade,
      description: detailedDescription,
      timeToSell: option?.timeToSell || "3-5 days",
      fees: option?.fees || "No fees",
      image: imageToUse,
    }

    return listingData
  }

  // Handle posting to a marketplace
  const handlePostToMarketplace = (platformName: string) => {
    // Find the matching marketplace option
    const option = options.find((opt) => opt.name === platformName)
    if (!option) return

    // Create listing data
    const listingData = createListingData(platformName, option.estimatedValue)

    try {
      // Store in the appropriate localStorage key based on platform
      const storageKey = platformName.toLowerCase().replace(/\s+/g, "") + "ListingData"
      localStorage.setItem(storageKey, JSON.stringify(listingData))
      console.log(`Successfully stored ${platformName} listing data in localStorage`)

      // Navigate to the appropriate demo page
      switch (platformName) {
        case "Facebook Marketplace":
          router.push("/facebook-demo")
          break
        case "Kijiji":
          router.push("/kijiji-demo")
          break
        case "Poshmark":
          router.push("/poshmark-demo")
          break
        case "OfferUp":
          router.push("/offerup-demo")
          break
        default:
          // Open external URL for any other platform
          window.open(option.url, "_blank")
      }
    } catch (error) {
      console.error(`Error storing ${platformName} listing data in localStorage:`, error)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Marketplace Options</h3>
      <p className="text-sm text-gray-600 mb-4">
        Based on our analysis, we recommend selling your item on these marketplaces:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {options.map((option) => (
          <div
            key={option.name}
            className={`border ${selectedOption === option.name ? "border-blue-500" : "border-gray-200"} rounded-md overflow-hidden cursor-pointer`}
            onClick={() => setSelectedOption(option.name)}
          >
            <div className={`${option.color} h-2`}></div>
            <div className="p-4">
              <div className="flex items-center mb-3">
                <img
                  src={option.logo || "/placeholder.svg"}
                  alt={`${option.name} logo`}
                  className="h-8 w-8 mr-3 object-contain"
                />
                <h4 className="font-medium">{option.name}</h4>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Estimated Value</p>
                  <p className="font-bold text-lg">{option.estimatedValue}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Time to Sell</p>
                    <p>{option.timeToSell}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Fees</p>
                    <p>{option.fees}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePostToMarketplace(option.name)}
                className="flex items-center justify-center w-full py-2 px-4 bg-[#f3f3f3] hover:bg-[#e5e5e5] rounded-md text-sm font-medium transition-colors"
              >
                Post on {option.name} <ExternalLink className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        * Estimated values are based on current market trends for items in {condition.toLowerCase()} condition.
      </p>
    </div>
  )
}

