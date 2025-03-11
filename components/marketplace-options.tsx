"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from 'lucide-react'
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
      let baseValue = 0
      switch (condition.toLowerCase()) {
        case "brand new":
          baseValue = priceValue * 0.8
          break
        case "good":
          baseValue = priceValue * 0.65
          break
        case "acceptable":
          baseValue = priceValue * 0.5
          break
        case "poor":
          baseValue = priceValue * 0.35
          break
        default:
          baseValue = priceValue * 0.6
      }

      // Generate marketplace options with variations
      const marketplaceOptions: MarketplaceOption[] = [
        {
          name: "Facebook Marketplace",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-13cBLkqhKaC5MWcfkxOSc8Ihr3BoKq.png",
          estimatedValue: `$${Math.floor(baseValue * (1 + Math.random() * 0.1)).toFixed(2)}`,
          timeToSell: "2-3 days",
          fees: "No fees",
          color: "bg-[#4267B2]",
          url: "https://www.facebook.com/marketplace/",
        },
        {
          name: "Kijiji",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IU7EGyiHf0Y7YtEvZXP6Ly7SN4erVh.png",
          estimatedValue: `$${Math.floor(baseValue * (0.95 + Math.random() * 0.1)).toFixed(2)}`,
          timeToSell: "4-7 days",
          fees: "Optional promotion fees",
          color: "bg-[#373373]",
          url: "https://www.kijiji.ca/",
        },
        {
          name: "Poshmark",
          logo: "/placeholder.svg?height=40&width=40",
          estimatedValue: `$${Math.floor(baseValue * (0.9 + Math.random() * 0.1)).toFixed(2)}`,
          timeToSell: "5-10 days",
          fees: "20% of sale price",
          color: "bg-[#CF0F4E]",
          url: "https://poshmark.com/",
        },
        {
          name: "OfferUp",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tp21eN1SdSRHQziM6k8BkzqV8LdEzn.png",
          estimatedValue: `$${Math.floor(baseValue * (0.85 + Math.random() * 0.1)).toFixed(2)}`,
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

              {option.name === "Facebook Marketplace" ? (
                <button
                  onClick={() => {
                    // Create a clean description without price mentions
                    let cleanDescription = ""

                    if (analysisResult.resale_ad) {
                      // Clean the resale ad of any price references
                      cleanDescription = analysisResult.resale_ad
                        .replace(/\$\d+(\.\d+)?/g, "") // Remove prices with $ sign
                        .replace(/\b\d+\.\d+\b/g, "") // Remove decimal numbers without $ sign
                        .replace(/asking price is.*?\.(\s|$)/i, "") // Remove "asking price is..." phrases
                        .replace(/price:.*?\.(\s|$)/i, "") // Remove "Price:..." phrases
                        .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
                        .trim() // Trim extra spaces
                    } else {
                      // Create a description without price mentions
                      cleanDescription = `Selling a ${itemName} in ${analysisResult.condition_grade.toLowerCase()} condition. ${
                        analysisResult.damage_severity !== "no damage"
                          ? `Has ${analysisResult.damage_severity}.`
                          : "No damage."
                      } Pick up only.`
                    }

                    // Get the image from uploaded images
                    const imageToUse = uploadedImages && uploadedImages.length > 0 ? uploadedImages[0] : null
                    console.log("Using user-uploaded image for Facebook listing:", imageToUse ? "Image found" : "No image")

                    // Store the listing data in localStorage
                    const listingData = {
                      title: `${analysisResult.condition_grade} ${itemName} for Sale`,
                      price: option.estimatedValue,
                      condition: analysisResult.condition_grade,
                      description: cleanDescription,
                      timeToSell: option.timeToSell,
                      fees: option.fees,
                      image: imageToUse,
                    }
                    
                    try {
                      localStorage.setItem("facebookListingData", JSON.stringify(listingData))
                      console.log("Successfully stored listing data in localStorage")
                    } catch (error) {
                      console.error("Error storing listing data in localStorage:", error)
                    }
                    
                    router.push("/facebook-demo")
                  }}
                  className="flex items-center justify-center w-full py-2 px-4 bg-[#f3f3f3] hover:bg-[#e5e5e5] rounded-md text-sm font-medium transition-colors"
                >
                  Post on {option.name} <ExternalLink className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <a
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-2 px-4 bg-[#f3f3f3] hover:bg-[#e5e5e5] rounded-md text-sm font-medium transition-colors"
                >
                  Post on {option.name} <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              )}
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

