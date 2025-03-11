"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

interface MarketplaceRecommendation {
  platform: string
  logo: string
  estimatedValue: string
  timeToSell: string
  url: string
  color: string
}

interface MarketplaceRecommendationsProps {
  productName: string
  condition: string
  originalPrice: string
}

export function MarketplaceRecommendations({
  productName,
  condition = "Like New",
  originalPrice,
}: MarketplaceRecommendationsProps) {
  const [recommendations] = useState<MarketplaceRecommendation[]>([
    {
      platform: "Facebook Marketplace",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-13cBLkqhKaC5MWcfkxOSc8Ihr3BoKq.png",
      estimatedValue: "$12.50",
      timeToSell: "~2 days",
      url: "https://www.facebook.com/marketplace/",
      color: "bg-[#4267B2]",
    },
    {
      platform: "Craigslist",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gxUGzLPpQgTBawyDqmNFwzhdtTsH1G.png",
      estimatedValue: "$10.75",
      timeToSell: "~5 days",
      url: "https://www.craigslist.org/",
      color: "bg-[#5C2699]",
    },
    {
      platform: "Kijiji",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IU7EGyiHf0Y7YtEvZXP6Ly7SN4erVh.png",
      estimatedValue: "$11.25",
      timeToSell: "~3 days",
      url: "https://www.kijiji.ca/",
      color: "bg-[#373373]",
    },
    {
      platform: "OfferUp",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tp21eN1SdSRHQziM6k8BkzqV8LdEzn.png",
      estimatedValue: "$13.00",
      timeToSell: "~2 days",
      url: "https://offerup.com/",
      color: "bg-[#00AB80]",
    },
  ])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {recommendations.map((rec) => (
        <div key={rec.platform} className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
          <div className={`${rec.color} h-2`}></div>
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-8 mr-3">
                <img
                  src={rec.logo || "/placeholder.svg"}
                  alt={`${rec.platform} logo`}
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="font-medium">{rec.platform}</h3>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">AI Estimated Value</div>
              <div className="text-xl font-bold">{rec.estimatedValue}</div>
              <div className="text-sm text-gray-500">Est. time to sell: {rec.timeToSell}</div>
            </div>

            <a
              href={rec.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
            >
              Post on {rec.platform} <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      ))}

      <div className="sm:col-span-2 text-sm text-gray-500 mt-2">
        <p>* Estimated values are based on current marketplace trends and may vary.</p>
        <p>* The AI-generated listing in the sidebar will be used when posting to marketplaces.</p>
      </div>
    </div>
  )
}

