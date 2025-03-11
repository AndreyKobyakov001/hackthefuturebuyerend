"use client"

import { useState } from "react"
import { OrderCard } from "./order-card"

// Sample order data
const orders = [
  {
    id: "1045-F1",
    date: "March 4, 2025",
    status: "Fulfilled",
    total: "$129.98",
    items: [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: "$79.99",
        quantity: 1,
        image: "https://m.media-amazon.com/images/I/41lArSiD5hL.jpg",
        description:
          "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Features Bluetooth 5.0 connectivity, built-in microphone for calls, and touch controls for easy operation. Includes carrying case, charging cable, and 3.5mm audio cable.",
      },
      {
        id: 2,
        name: "Classic White Shirt - Medium",
        price: "$49.99",
        quantity: 1,
        image: "https://www.santaeulalia.com/cdn/shop/products/8c57dc62db191f55f2460007092b2cda_48772894-d01d-45f7-b8bc-8d4304e9eb2b.jpg?v=1706776454",
        description:
          "Premium cotton white shirt with button-down collar. Classic fit, machine washable. 100% cotton material, perfect for business or casual wear. Features reinforced stitching and durable buttons.",
      },
    ],
    shippingAddress: "150 Elgin Street, Ottawa, ON K2P 1L4",
  },
  {
    id: "1046-F2",
    date: "February 13, 2025",
    status: "Fulfilled",
    total: "$89.95",
    items: [
      {
        id: 3,
        name: "Portable Bluetooth Speaker",
        price: "$59.99",
        quantity: 1,
        image: "https://multimedia.bbycastatic.ca/multimedia/products/500x500/137/13797/13797305.jpg",
        description:
          "Compact waterproof Bluetooth speaker with 360° sound, 12-hour playtime, and built-in microphone. IPX7 waterproof rating makes it perfect for outdoor use. Includes USB-C charging cable and carabiner clip for easy attachment to bags.",
      },
      {
        id: 4,
        name: "USB-C Charging Cable (2-pack)",
        price: "$29.96",
        quantity: 1,
        image: "https://m.media-amazon.com/images/I/71NWeErdDtL._AC_UF894,1000_QL80_.jpg",
        description:
          "Set of two 6ft USB-C to USB-A charging cables with nylon braided exterior for durability. Supports fast charging up to 3A and data transfer speeds up to 480Mbps. Compatible with all USB-C devices including smartphones, tablets, and laptops.",
      },
    ],
    shippingAddress: "150 Elgin Street, Ottawa, ON K2P 1L4",
  },
  {
    id: "1047-F3",
    date: "January 8, 2025",
    status: "Fulfilled",
    total: "$349.99",
    items: [
      {
        id: 5,
        name: "Tablet - 10.2 inch, 64GB",
        price: "$349.99",
        quantity: 1,
        image: "https://m.media-amazon.com/images/I/71Aylhv6YAL.jpg",
        description:
          "10.2-inch Retina display tablet with A13 Bionic chip, 64GB storage, and all-day battery life. Features 8MP back camera, 12MP Ultra Wide front camera with Center Stage, and support for Apple Pencil (1st generation) and Smart Keyboard. Includes USB-C to Lightning Cable and 20W USB-C Power Adapter.",
      },
    ],
    shippingAddress: "150 Elgin Street, Ottawa, ON K2P 1L4",
  },
]

export function OrdersList() {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isExpanded={expandedOrderId === order.id}
          onToggleExpand={() => toggleOrderExpansion(order.id)}
        />
      ))}
    </div>
  )
}



