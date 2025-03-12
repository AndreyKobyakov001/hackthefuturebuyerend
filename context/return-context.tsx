"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
}

const ReturnContext = createContext<ReturnContextType | undefined>(undefined)

// Use localStorage to persist selected items
const STORAGE_KEY = "returnItems"

export function ReturnProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [selectedItems, setSelectedItems] = useState<ReturnItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedItems = localStorage.getItem(STORAGE_KEY)
      return savedItems ? JSON.parse(savedItems) : []
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

