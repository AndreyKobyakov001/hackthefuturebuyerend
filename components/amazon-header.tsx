import { Search } from "lucide-react"

export function AmazonHeader() {
  return (
    <header className="bg-[#131921] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center p-2">
          <div className="flex-shrink-0 mr-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AR4p2kDH1AiuNf4OIM5usUGoqI0Omx.png"
              alt="Amazon"
              className="h-8 w-auto"
              style={{ filter: "brightness(0) invert(1)" }} // Make the logo white
            />
          </div>

          <div className="flex items-center text-sm mr-4">
            <span className="text-gray-400 text-xs">Deliver to Grace</span>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" />
              </svg>
              <span className="font-bold">New York 10035</span>
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <select className="h-full py-0 pl-2 pr-7 border-transparent bg-gray-100 text-gray-700 rounded-l-md">
                  <option>All</option>
                </select>
              </div>
              <input
                type="text"
                className="block w-full pl-20 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white text-gray-900"
                placeholder="Search Amazon"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button className="p-2 bg-[#febd69] hover:bg-[#f3a847] rounded-r-md">
                  <Search className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            </div>
          </div>

          <div className="ml-4 flex items-center">
            <div className="mr-4 text-xs">
              <div>Hello, grace</div>
              <div className="font-bold">Account & Lists</div>
            </div>
            <div className="mr-4 text-xs">
              <div>Returns</div>
              <div className="font-bold">& Orders</div>
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-bold">Cart</span>
            </div>
          </div>
        </div>

        <nav className="flex space-x-6 px-4 py-1 text-sm bg-[#232f3e] overflow-x-auto">
          <a href="#" className="hover:text-[#febd69]">
            All
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Customer Service
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Prime Video
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Best Sellers
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Browsing History
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Prime
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Shopper Toolkit
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Pet Supplies
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Outdoor Recreation
          </a>
          <a href="#" className="hover:text-[#febd69]">
            Fresh
          </a>
          <a href="#" className="hover:text-[#febd69]">
            No annual fee
          </a>
        </nav>
      </div>
    </header>
  )
}

