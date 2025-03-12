"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share2, Search, MapPin, Heart, Flag, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function KijijiDemoPage() {
  const [loading, setLoading] = useState(true)
  const [listingData, setListingData] = useState({
    title: "Item for Sale",
    price: "$30.00",
    condition: "Good",
    description: "No description provided.",
    timeToSell: "4-7 days",
    fees: "Optional promotion fees",
    image: null,
  })

  // Load listing data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("kijijiListingData")
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          console.log("Loaded Kijiji listing data:", parsedData)

          // Ensure we have all required fields
          const validatedData = {
            title: parsedData.title || "Item for Sale",
            price: parsedData.price || "$30.00",
            condition: parsedData.condition || "Good",
            description: parsedData.description || "No description provided.",
            timeToSell: parsedData.timeToSell || "4-7 days",
            fees: parsedData.fees || "Optional promotion fees",
            image: parsedData.image || null,
          }

          // Ensure the description is properly formatted
          if (validatedData.description) {
            // Clean up any price references that might have slipped through
            validatedData.description = validatedData.description
              .replace(/\b\d+\.\d+\b/g, "") // Removes standalone numbers like "8.00"
              .replace(/\$\d+(\.\d+)?/g, "") // Removes dollar amounts like "$8.00"
              .replace(/price:.*?\.(\s|$)/i, "") // Removes "Price:..." phrases
              .replace(/asking price is.*?\.(\s|$)/i, "") // Removes "asking price is..." phrases
              .replace(/\s{2,}/g, " ")
              .trim() // Clean up extra spaces

            // Format the description for better readability
            validatedData.description = validatedData.description
              .split("\n")
              .filter((line) => line.trim() !== "")
              .join("\n\n")
          }

          setListingData(validatedData)
        } catch (e) {
          console.error("Error parsing listing data:", e)
        }
      }
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Format current date for the post
  const postDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#373373] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" fill="white" />
              <path d="M2 12L12 17L22 12" fill="white" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700">Posting your listing to Kijiji...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Kijiji Header */}
      <header className="bg-[#373373] text-white sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L4 12L20 20L36 12L20 4Z" fill="white" transform="translate(40, 0) scale(0.8)" />
                <path d="M4 28L20 36L36 28" fill="white" transform="translate(40, 0) scale(0.8)" />
                <path d="M4 20L20 28L36 20" fill="white" transform="translate(40, 0) scale(0.8)" />
                <text x="10" y="22" fill="white" fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">
                  Kijiji
                </text>
              </svg>

              <div className="ml-4 relative">
                <div className="bg-white rounded-md flex items-center px-3 py-2">
                  <Search className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Kijiji"
                    className="bg-transparent border-none focus:outline-none ml-2 w-56 text-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="text-white hover:text-gray-200">Post Ad</button>
              <button className="text-white hover:text-gray-200">Sign In</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center mb-4">
          <Link href="/returns" className="flex items-center text-[#373373]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Returns
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-xl font-bold">Your Ad</h1>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-[#373373] text-white rounded-md">Edit Ad</button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 pr-0 md:pr-6 mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">{listingData.title}</h2>
                <div className="flex items-center mb-4">
                  <p className="text-2xl font-bold text-[#373373] mr-4">{listingData.price}</p>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">Condition: {listingData.condition}</span>
                </div>

                <div className="mb-4">
                  {listingData.image ? (
                    <img
                      src={listingData.image || "/placeholder.svg"}
                      alt={listingData.title}
                      className="w-full max-h-96 object-contain bg-gray-100 rounded-md"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt={listingData.title}
                      className="w-full max-h-96 object-contain bg-gray-100 rounded-md"
                    />
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{listingData.description}</p>
                </div>

                <div className="flex space-x-4 mb-4">
                  <button className="flex items-center text-[#373373]">
                    <Heart className="h-5 w-5 mr-1" />
                    Favorite
                  </button>
                  <button className="flex items-center text-[#373373]">
                    <Share2 className="h-5 w-5 mr-1" />
                    Share
                  </button>
                  <button className="flex items-center text-red-500">
                    <Flag className="h-5 w-5 mr-1" />
                    Report
                  </button>
                </div>
              </div>

              <div className="md:w-1/3 bg-gray-50 p-4 rounded-md">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Seller Information</h3>
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="font-medium">Your Name</p>
                      <p className="text-xs text-gray-500">Member since January 2025</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <button className="flex items-center justify-center w-full py-2 px-4 bg-[#373373] text-white rounded-md">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Seller
                    </button>
                    <button className="flex items-center justify-center w-full py-2 px-4 border border-[#373373] text-[#373373] rounded-md">
                      <Phone className="h-4 w-4 mr-2" />
                      Show Phone Number
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">Ad Details</h3>
                  <div className="text-sm">
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-600">Date Listed:</span>
                      <span>{postDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-600">Condition:</span>
                      <span>{listingData.condition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-600">Est. Time to Sell:</span>
                      <span>{listingData.timeToSell}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-600">Fees:</span>
                      <span>{listingData.fees}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border-t border-green-200 text-center text-green-700">
            <p className="font-medium">Your ad has been posted successfully!</p>
            <p className="text-sm mt-1">Your ad is now live and visible to potential buyers.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

