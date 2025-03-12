"use client"

import { useEffect, useRef, useState } from "react"
import { Info } from "lucide-react"

interface SocialCreditGaugeProps {
  score: number // 0 to 100
}

export function SocialCreditGauge({ score = 75 }: SocialCreditGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate dimensions
    const centerX = rect.width / 2
    const centerY = rect.height * 0.8 // Move center point down
    const radius = Math.min(centerX, centerY) * 0.8

    // Create a linear gradient for the gauge - red to blue
    const gradientX1 = centerX - radius
    const gradientX2 = centerX + radius
    const gradientY = centerY - radius * 0.1 // Slightly above center

    const gradient = ctx.createLinearGradient(gradientX1, gradientY, gradientX2, gradientY)
    gradient.addColorStop(0, "#DC2626") // Red
    gradient.addColorStop(0.5, "#93C5FD") // Light blue
    gradient.addColorStop(1, "#1E40AF") // Dark blue

    // Draw the gauge background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = gradient
    ctx.stroke()

    // Fixed needle position at 1:30 (75 on a 0-100 scale, which is 45 degrees from top)
    // Convert 45 degrees to radians and adjust for the semicircle starting position
    const needleAngle = Math.PI / -4 // 45 degrees = PI/4 radians
    const needleLength = radius - 10
    const needleX = centerX + needleLength * Math.cos(needleAngle)
    const needleY = centerY + needleLength * Math.sin(needleAngle)

    // Draw needle shadow
    ctx.beginPath()
    ctx.moveTo(centerX + 2, centerY + 2)
    ctx.lineTo(needleX + 2, needleY + 2)
    ctx.lineWidth = 3
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)"
    ctx.stroke()

    // Draw needle
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(needleX, needleY)
    ctx.lineWidth = 3
    ctx.strokeStyle = "#1F2937"
    ctx.stroke()

    // Draw the center circle with shadow
    ctx.beginPath()
    ctx.arc(centerX + 1, centerY + 1, 8, 0, 2 * Math.PI, false)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI, false)
    ctx.fillStyle = "#1F2937"
    ctx.fill()

    // Add score labels
    const labels = ["0", "25", "50", "75", "100"]
    labels.forEach((label, index) => {
      const angle = Math.PI - (index / (labels.length - 1)) * Math.PI
      const labelX = centerX + (radius + 25) * Math.cos(angle)
      const labelY = centerY + (radius + 25) * Math.sin(angle)

      ctx.font = "12px Arial"
      ctx.fillStyle = "#6B7280"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, labelX, labelY)
    })
  }, [score])

  // Determine color based on score (fixed at 75)
  const getScoreColor = () => {
    return "text-blue-500" // Blue color for score 75
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="text-center mb-2 relative">
        <div className="flex items-center justify-center">
          <h3 className="text-lg font-medium">Buyer Score</h3>
          <div
            className="ml-2 relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="h-4 w-4 text-gray-400 cursor-help" />

            {showTooltip && (
              <div className="absolute z-10 w-72 p-3 bg-gray-800 text-white text-xs rounded shadow-lg -right-2 top-6">
                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                <p className="font-medium mb-1">What is the Buyer Score?</p>
                <p className="mb-2">
                  Your Buyer Score reflects your return history and purchasing behavior. A higher score means:
                </p>
                <ul className="list-disc list-inside space-y-1 mb-2">
                  <li>Faster approval of returns</li>
                  <li>Higher likelihood of full refunds</li>
                  <li>Access to premium return options</li>
                  <li>Fewer verification steps</li>
                </ul>
                <p>
                  Your score is calculated based on return frequency, condition of returned items, and compliance with
                  return policies.
                </p>
              </div>
            )}
          </div>
        </div>
        <p className={`text-3xl font-bold mt-1 ${getScoreColor()}`}>75</p>
      </div>
      <div className="relative w-full h-32">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">A higher score means faster, easier returns!</div>
    </div>
  )
}


