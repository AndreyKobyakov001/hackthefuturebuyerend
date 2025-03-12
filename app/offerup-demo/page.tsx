"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Home,
  User,
  ShoppingBag,
  MapPin,
  MoreHorizontal,
  Flag,
} from "lucide-react"
import Link from "next/link"

export default function OfferUpDemoPage() {
  const [loading, setLoading] = useState(true)
  const [listingData, setListingData] = useState({
    title: "Item for Sale",
    price: "$22.00",
    condition: "Good",
    description: "No description provided.",
    timeToSell: "3-5 days",
    fees: "7.9% of sale price",
    image: null,
  })

  // Load listing data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("offerupListingData")
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          console.log("Loaded OfferUp listing data:", parsedData)

          // Ensure we have all required fields
          const validatedData = {
            title: parsedData.title || "Item for Sale",
            price: parsedData.price || "$22.00",
            condition: parsedData.condition || "Good",
            description: parsedData.description || "No description provided.",
            timeToSell: parsedData.timeToSell || "3-5 days",
            fees: parsedData.fees || "7.9% of sale price",
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
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#00AB80] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 6H17C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6H5C3.9 6 3 6.9 3 8V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V8C21 6.9 20.1 6 19 6ZM12 3C13.66 3 15 4.34 15 6H9C9 4.34 10.34 3 12 3ZM19 20H5V8H19V20Z"
                fill="white"
              />
              <path
                d="M12 12C10.9 12 10 11.1 10 10H8C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10H14C14 11.1 13.1 12 12 12Z"
                fill="white"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700">Posting your listing to OfferUp...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* OfferUp Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-[#00AB80] font-bold text-2xl mr-6">OfferUp</div>

              <div className="relative hidden md:block">
                <div className="bg-gray-100 rounded-full flex items-center px-3 py-2">
                  <Search className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search OfferUp"
                    className="bg-transparent border-none focus:outline-none ml-2 w-56"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="p-2 text-gray-600">
                <Home className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600">
                <MessageCircle className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600">
                <ShoppingBag className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600">
                <User className="h-6 w-6" />
              </button>
              <button className="px-4 py-2 bg-[#00AB80] text-white rounded-md hidden md:block">Sell</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center mb-4">
          <Link href="/returns" className="flex items-center text-[#00AB80]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Returns
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <p className="font-medium">Your Name</p>
                <p className="text-xs text-gray-500 flex items-center">
                  {postDate} · <MapPin className="h-3 w-3 mx-1" /> New York, NY
                </p>
              </div>
              <button className="ml-auto p-2">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-3">
              <h2 className="text-xl font-bold mb-1">{listingData.title}</h2>
              <p className="text-2xl font-bold text-[#00AB80] mb-2">{listingData.price}</p>
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md mr-2">
                  Condition: {listingData.condition}
                </span>
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">Category: Home Goods</span>
              </div>
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

            <div className="flex justify-between text-gray-500 border-t border-b border-gray-200 py-3 mb-3">
              <button className="flex items-center text-sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </button>
              <button className="flex items-center text-sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
              <button className="flex items-center text-sm">
                <Flag className="h-4 w-4 mr-1" />
                Report
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium mb-2">Listing Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="font-medium">{listingData.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">Home Goods</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Est. Time to Sell</p>
                <p className="font-medium">{listingData.timeToSell}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fees</p>
                <p className="font-medium">{listingData.fees}</p>
              </div>
            </div>

            <div className="flex space-x-3 mb-4">
              <button className="flex-1 py-3 bg-[#00AB80] text-white rounded-md font-medium">Make Offer</button>
              <button className="flex-1 py-3 border border-[#00AB80] text-[#00AB80] rounded-md font-medium">
                Message Seller
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center text-green-700">
              <p className="font-medium">Your listing has been posted successfully!</p>
              <p className="text-sm mt-1">Your listing is now live and visible to potential buyers.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

