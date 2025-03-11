"use client"

import { useEffect, useRef } from "react"

interface ReturnScoreCardProps {
  score: number
}

export function ReturnScoreCard({ score }: ReturnScoreCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "#22c55e" // green-600
    if (score >= 60) return "#eab308" // yellow-500
    return "#ef4444" // red-500
  }

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

    // Draw speedometer background
    const centerX = rect.width / 2
    // Move the center point down to ensure the full semicircle is visible
    const centerY = rect.height * 0.8
    const radius = Math.min(centerX, centerY * 0.8)

    // Draw the gauge background (gray arc)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#e5e7eb" // gray-200
    ctx.stroke()

    // Draw colored progress arc
    const angle = Math.PI - (score / 100) * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, angle, true)
    ctx.lineWidth = 20
    ctx.strokeStyle = getScoreColor()
    ctx.stroke()

    // Draw the needle
    const needleLength = radius - 15
    const needleAngle = Math.PI - (score / 100) * Math.PI
    const needleX = centerX + needleLength * Math.cos(needleAngle)
    const needleY = centerY + needleLength * Math.sin(needleAngle)

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(needleX, needleY)
    ctx.lineWidth = 3
    ctx.strokeStyle = "#1f2937" // gray-800
    ctx.stroke()

    // Draw the center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI, false)
    ctx.fillStyle = "#1f2937" // gray-800
    ctx.fill()

    // Draw tick marks and labels
    const tickCount = 5
    for (let i = 0; i <= tickCount; i++) {
      const tickAngle = Math.PI - (i / tickCount) * Math.PI
      const tickLength = 10
      const tickStartX = centerX + (radius + 5) * Math.cos(tickAngle)
      const tickStartY = centerY + (radius + 5) * Math.sin(tickAngle)
      const tickEndX = centerX + (radius + 5 + tickLength) * Math.cos(tickAngle)
      const tickEndY = centerY + (radius + 5 + tickLength) * Math.sin(tickAngle)

      ctx.beginPath()
      ctx.moveTo(tickStartX, tickStartY)
      ctx.lineTo(tickEndX, tickEndY)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#9ca3af" // gray-400
      ctx.stroke()

      // Add labels
      const labelValue = Math.round((tickCount - i) * (100 / tickCount))
      const labelX = centerX + (radius + 25) * Math.cos(tickAngle)
      const labelY = centerY + (radius + 25) * Math.sin(tickAngle)

      ctx.font = "10px Arial"
      ctx.fillStyle = "#6b7280" // gray-500
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(labelValue.toString(), labelX, labelY)
    }

    // Add labels for Poor, Fair, Good, Excellent
    const labels = ["Poor", "Fair", "Good", "Excellent"]
    for (let i = 0; i < 4; i++) {
      const labelAngle = Math.PI - (i / 3) * Math.PI
      const labelX = centerX + (radius + 40) * Math.cos(labelAngle)
      const labelY = centerY + (radius + 40) * Math.sin(labelAngle)

      ctx.font = "9px Arial"
      ctx.fillStyle = "#6b7280" // gray-500
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(labels[i], labelX, labelY)
    }
  }, [score])

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Your Buyer Score</h2>
        <span
          className={`text-2xl font-bold ${
            score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
          }`}
        >
          {score}
        </span>
      </div>

      <div className="relative w-full h-44 mb-4">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>

      <div className="text-sm text-gray-700 mt-2">
        <p className="mb-2">
          <span className="font-medium">Score factors:</span>
        </p>
        <ul className="list-disc list-inside ml-2 text-xs space-y-1">
          <li>Return frequency (last 6 months)</li>
          <li>Item condition upon return</li>
          <li>Return reason consistency</li>
          <li>Return window compliance</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-xs italic mt-3">
          Your buyer score influences how likely you're to get a better return value and access to premium return
          options.
        </div>
      </div>
    </div>
  )
}

