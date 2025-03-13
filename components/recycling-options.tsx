"use client"

import { MapPin, Recycle } from "lucide-react"

interface RecyclingOptionsProps {
  itemName: string
  condition: string
}

interface RecyclingCenter {
  name: string
  address: string
  distance: string
  acceptsGlass?: boolean
  acceptsElectronics?: boolean
  acceptsClothing?: boolean
  acceptsPlastic?: boolean
}

export function RecyclingOptions({ itemName, condition }: RecyclingOptionsProps) {
  // Sample recycling centers
  const recyclingCenters: RecyclingCenter[] = [
    {
      name: "EcoCenter Recycling",
      address: "123 Green St, New York, NY 10001",
      distance: "1.2 miles",
      acceptsGlass: true,
      acceptsElectronics: true,
      acceptsClothing: true,
      acceptsPlastic: true,
    },
    {
      name: "GlassWorks Recycling",
      address: "456 Sustainability Ave, New York, NY 10002",
      distance: "2.5 miles",
      acceptsGlass: true,
      acceptsPlastic: true,
    },
    {
      name: "Urban Recycling Center",
      address: "789 Earth Blvd, New York, NY 10003",
      distance: "3.8 miles",
      acceptsGlass: true,
      acceptsElectronics: true,
      acceptsClothing: true,
      acceptsPlastic: true,
    },
  ]

  // Determine what type of item it is to filter recycling centers
  const isGlass = itemName.toLowerCase().includes("glass") || itemName.toLowerCase().includes("crystal")
  const isElectronic =
    itemName.toLowerCase().includes("electronic") ||
    itemName.toLowerCase().includes("headphone") ||
    itemName.toLowerCase().includes("speaker") ||
    itemName.toLowerCase().includes("tablet")
  const isClothing =
    itemName.toLowerCase().includes("shirt") ||
    itemName.toLowerCase().includes("clothing") ||
    itemName.toLowerCase().includes("apparel")

  // Filter centers based on item type
  const filteredCenters = recyclingCenters.filter((center) => {
    if (isGlass && center.acceptsGlass) return true
    if (isElectronic && center.acceptsElectronics) return true
    if (isClothing && center.acceptsClothing) return true
    return center.acceptsPlastic // Default to plastic recycling
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-4">
        <Recycle className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-lg font-medium">Recycling Options</h3>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
        <p className="text-sm text-green-800">
          <span className="font-medium">Sustainability Notice:</span> This item cannot be resold due to its condition,
          but you can help reduce waste by recycling it properly.
        </p>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        We found {filteredCenters.length} recycling centers near you that accept{" "}
        {isGlass ? "glass" : isElectronic ? "electronic" : isClothing ? "clothing" : ""} items:
      </p>

      <div className="space-y-3 mb-4">
        {filteredCenters.map((center, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-3">
            <div className="flex justify-between">
              <h4 className="font-medium">{center.name}</h4>
              <span className="text-sm text-gray-500">{center.distance}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {center.address}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {center.acceptsGlass && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Glass</span>
              )}
              {center.acceptsElectronics && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Electronics</span>
              )}
              {center.acceptsClothing && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Clothing</span>
              )}
              {center.acceptsPlastic && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Plastic</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        <p>By recycling this item, you're helping to reduce landfill waste and conserve natural resources.</p>
        <p className="mt-1">Call the recycling center before visiting to confirm their current acceptance policies.</p>
      </div>
    </div>
  )
}

