import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  title: string
  showBackButton?: boolean
}

export function Header({ title, showBackButton = false }: HeaderProps) {
  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="bg-[#131921] text-white border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <Link href="/" className="mr-4 text-gray-300 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <h1 className="text-xl font-medium">{title}</h1>
          </div>
          <div className="text-sm text-gray-300">{currentDate}</div>
        </div>
      </div>
    </header>
  )
}

