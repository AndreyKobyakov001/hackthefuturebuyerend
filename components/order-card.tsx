"use client"
import { ChevronDown, ChevronUp, Package } from "lucide-react"
import { useState } from "react"
import { useReturn, type ReturnItem } from "@/context/return-context"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: number
  name: string
  price: string
  quantity: number
  image: string
  weight?: string
  description?: string
}

interface Order {
  id: string
  date: string
  status: string
  total: string
  items: OrderItem[]
  shippingAddress: string
}

interface OrderCardProps {
  order: Order
  isExpanded: boolean
  onToggleExpand: () => void
}

export function OrderCard({ order, isExpanded, onToggleExpand }: OrderCardProps) {
  const { selectedItems, addItemToReturn, removeItemFromReturn } = useReturn()
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null)
  const router = useRouter()

  const isItemSelected = (itemId: number) => {
    return selectedItems.some((item) => item.id === itemId)
  }

  const toggleItemSelection = (item: OrderItem) => {
    if (isItemSelected(item.id)) {
      removeItemFromReturn(item.id)
    } else {
      const returnItem: ReturnItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        maxQuantity: item.quantity,
        weight: item.weight || "0.5 kg", // Default weight if not provided
        image: item.image,
        orderId: order.id,
        description: item.description || "",
      }
      addItemToReturn(returnItem)
    }
  }

  const toggleItemDescription = (itemId: number) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null)
    } else {
      setExpandedItemId(itemId)
    }
  }

  const handleReturnClick = () => {
    // Navigate to the returns page
    router.push("/returns")
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Order header */}
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={onToggleExpand}>
        <div className="flex items-center">
          <Package className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="font-medium">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-4">{order.total}</span>
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full mr-4">{order.status}</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Order details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-medium mb-2">Items</h4>

          <div className="space-y-4 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-md p-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={isItemSelected(item.id)}
                    onChange={() => toggleItemSelection(item)}
                    className="h-4 w-4 text-[#f90] border-gray-300 rounded focus:ring-[#f90] mr-3"
                  />
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium mr-3">{item.price}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleItemDescription(item.id)
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedItemId === item.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedItemId === item.id && item.description && (
                  <div className="mt-3 pl-8 pr-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-xs text-gray-700 mb-1">Item Description:</p>
                    <p>{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              <p>Shipped to: {order.shippingAddress}</p>
            </div>
            <div>
              {selectedItems.length > 0 ? (
                <button
                  onClick={handleReturnClick}
                  className="inline-flex items-center px-4 py-2 bg-[#f90] text-white text-sm font-medium rounded-md hover:bg-[#f0ad4e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f90]"
                >
                  Return {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"}
                </button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
                >
                  Select items to return
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

