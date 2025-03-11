"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bell,
  Search,
  Menu,
  Home,
  Users,
  ShoppingBag,
  Video,
  Flag,
  Bookmark,
  MoreHorizontal,
  MapPin,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

export default function FacebookMarketplacePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Get listing data from URL parameters
  const title = searchParams.get("title") || "Item for Sale"
  const price = searchParams.get("price") || "$25.00"
  const condition = searchParams.get("condition") || "Used - Good"
  const description = searchParams.get("description") || "No description provided."
  const image = searchParams.get("image") || "/placeholder.svg"
  const timeToSell = searchParams.get("timeToSell") || "2-3 days"
  const fees = searchParams.get("fees") || "No fees"
  const returnPath = searchParams.get("returnPath") || "/returns"

  // Simulate loading
  useEffect(() => {
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
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z"
              fill="#4267B2"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700">Posting your listing to Facebook Marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Facebook Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-10 w-10 text-[#4267B2]"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z"
                  fill="currentColor"
                />
              </svg>

              <div className="ml-2 relative">
                <div className="bg-gray-100 rounded-full flex items-center px-3 py-2">
                  <Search className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Facebook"
                    className="bg-transparent border-none focus:outline-none ml-2 w-56"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="p-2 bg-gray-200 rounded-full">
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <button className="p-2 bg-gray-200 rounded-full">
                <Bell className="h-6 w-6 text-gray-700" />
              </button>
              <button className="p-2 bg-gray-200 rounded-full">
                <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <button className="flex-1 py-2 text-[#4267B2] border-b-4 border-[#4267B2]">
              <Home className="h-6 w-6 mx-auto" />
            </button>
            <button className="flex-1 py-2 text-gray-500">
              <Users className="h-6 w-6 mx-auto" />
            </button>
            <button className="flex-1 py-2 text-gray-500">
              <Video className="h-6 w-6 mx-auto" />
            </button>
            <button className="flex-1 py-2 text-gray-500">
              <ShoppingBag className="h-6 w-6 mx-auto" />
            </button>
            <button className="flex-1 py-2 text-gray-500">
              <Flag className="h-6 w-6 mx-auto" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center mb-4">
          <Link href={returnPath} className="flex items-center text-[#4267B2]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Returns
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-xl font-bold">Marketplace</h1>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-100 rounded-full">
                <Search className="h-5 w-5 text-gray-700" />
              </button>
              <button className="p-2 bg-gray-100 rounded-full">
                <Bookmark className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Your Name</p>
                <p className="text-xs text-gray-500 flex items-center">
                  {postDate} · <MapPin className="h-3 w-3 mx-1" /> New York, NY ·{" "}
                  <span className="text-[#4267B2]">Public</span> <ChevronDown className="h-3 w-3 ml-1" />
                </p>
              </div>
              <button className="ml-auto p-2">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-3">
              <h2 className="text-xl font-bold mb-1">{title}</h2>
              <p className="text-2xl font-bold text-[#4267B2] mb-2">{price}</p>
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md mr-2">
                  Condition: {condition}
                </span>
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">Category: Home Goods</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{description}</p>
            </div>

            <div className="mb-4">
              <img
                src={image || "/placeholder.svg"}
                alt={title}
                className="w-full max-h-96 object-contain bg-gray-100 rounded-md"
              />
            </div>

            <div className="flex justify-between text-gray-500 border-t border-b border-gray-200 py-2 mb-3">
              <button className="flex items-center text-sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Like
              </button>
              <button className="flex items-center text-sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Comment
              </button>
              <button className="flex items-center text-sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium mb-2">Listing Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="font-medium">{condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">Home Goods</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Est. Time to Sell</p>
                <p className="font-medium">{timeToSell}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fees</p>
                <p className="font-medium">{fees}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center text-green-700">
              <p className="font-medium">Your listing has been posted successfully!</p>
              <p className="text-sm mt-1">Potential buyers will be able to see your listing and contact you.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

