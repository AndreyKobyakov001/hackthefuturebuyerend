"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Update the ReturnItem interface to include a processed flag
export interface ReturnItem {
  id: number
  name: string
  price: string
  quantity: number
  maxQuantity: number
  weight: string
  image: string
  orderId: string
  description?: string
}

// Add a new interface to track processed items
interface ProcessedItem {
  id: number
  orderId: string
  processedDate: string
  processType: "returned" | "resold"
}

// Add a new function to the ReturnContextType interface
interface ReturnContextType {
  selectedItems: ReturnItem[]
  addItemToReturn: (item: ReturnItem) => void
  removeItemFromReturn: (itemId: number) => void
  clearSelectedItems: () => void
  updateItemQuantity: (itemId: number, quantity: number) => void
  getSelectedItemsCount: () => number
  reason: string
  setReason: (reason: string) => void
  comments: string
  setComments: (comments: string) => void
  uploadedImages: string[]
  setUploadedImages: (images: string[]) => void
  processedItems: ProcessedItem[]
  markItemAsProcessed: (itemId: number, orderId: string, processType: "returned" | "resold") => void
  isItemProcessed: (itemId: number) => boolean
  getProcessTypeForItem: (itemId: number) => "returned" | "resold" | null
  clearProcessedItems: () => void
  clearReturnForm: () => void // Add this new function
}

const ReturnContext = createContext<ReturnContextType | undefined>(undefined)

// Use localStorage to persist selected items
const STORAGE_KEY = "returnItems"
const PROCESSED_ITEMS_KEY = "temp_processedItems"

export function ReturnProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [selectedItems, setSelectedItems] = useState<ReturnItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedItems = localStorage.getItem(STORAGE_KEY)
      return savedItems ? JSON.parse(savedItems) : []
    }
    return []
  })

  // Initialize processed items from sessionStorage (will be cleared on page reload)
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedProcessedItems = sessionStorage.getItem(PROCESSED_ITEMS_KEY)
      return savedProcessedItems ? JSON.parse(savedProcessedItems) : []
    }
    return []
  })

  const [reason, setReasonValue] = useState<string>("Wrong item received")
  const [comments, setCommentsValue] = useState<string>("")

  // Add state for uploaded images
  const [uploadedImages, setUploadedImagesState] = useState<string[]>([])

  // Update localStorage when selectedItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems))
    }
  }, [selectedItems])

  // Update sessionStorage when processedItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(PROCESSED_ITEMS_KEY, JSON.stringify(processedItems))
    }
  }, [processedItems])

  const addItemToReturn = (item: ReturnItem) => {
    setSelectedItems((prev) => {
      // Check if item already exists
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeItemFromReturn = (itemId: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const clearSelectedItems = () => {
    setSelectedItems([])
  }

  const updateItemQuantity = (itemId: number, quantity: number) => {
    setSelectedItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const getSelectedItemsCount = () => {
    return selectedItems.length
  }

  const setReason = (reason: string) => {
    setReasonValue(reason)
  }

  const setComments = (comments: string) => {
    setCommentsValue(comments)
  }

  // Add setter function for uploaded images
  const setUploadedImages = (images: string[]) => {
    setUploadedImagesState(images)
  }

  // Function to mark an item as processed
  const markItemAsProcessed = (itemId: number, orderId: string, processType: "returned" | "resold") => {
    // Add to processed items
    setProcessedItems((prev) => [
      ...prev,
      {
        id: itemId,
        orderId,
        processedDate: new Date().toISOString(),
        processType,
      },
    ])

    // Remove from selected items if it's there
    removeItemFromReturn(itemId)
  }

  // Function to check if an item is processed
  const isItemProcessed = (itemId: number) => {
    return processedItems.some((item) => item.id === itemId)
  }

  // Function to get the process type for an item
  const getProcessTypeForItem = (itemId: number): "returned" | "resold" | null => {
    const processedItem = processedItems.find((item) => item.id === itemId)
    return processedItem ? processedItem.processType : null
  }

  // Add this function to clear processed items
  const clearProcessedItems = () => {
    setProcessedItems([])
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(PROCESSED_ITEMS_KEY)
    }
  }

  // Add this effect to clear processed items on page load/reload
  useEffect(() => {
    // Add event listener for page reload
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(PROCESSED_ITEMS_KEY)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Update the clearReturnForm function to also reset the reason to "Wrong item received"
  const clearReturnForm = () => {
    setCommentsValue("")
    setUploadedImagesState([])
    setReasonValue("Wrong item received") // Reset reason to default
  }

  // Add the function to the context provider value
  return (
    <ReturnContext.Provider
      value={{
        selectedItems,
        addItemToReturn,
        removeItemFromReturn,
        clearSelectedItems,
        updateItemQuantity,
        getSelectedItemsCount,
        reason,
        setReason,
        comments,
        setComments,
        uploadedImages,
        setUploadedImages,
        processedItems,
        markItemAsProcessed,
        isItemProcessed,
        getProcessTypeForItem,
        clearProcessedItems,
        clearReturnForm, // Add this new function
      }}
    >
      {children}
    </ReturnContext.Provider>
  )
}

export function useReturn() {
  const context = useContext(ReturnContext)
  if (context === undefined) {
    throw new Error("useReturn must be used within a ReturnProvider")
  }
  return context
}

