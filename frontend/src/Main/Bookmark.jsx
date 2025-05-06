"use client"

import { useState } from "react"
import { Search, User, Bookmark, ShoppingCart, Trash2, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Bookmarks() {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [bookmarkedItems, setBookmarkedItems] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic Fiction",
      price: 10.99,
      availability: "In Stock",
      image: "/placeholder.svg?height=80&width=60",
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R Tolkien",
      genre: "Fantasy",
      price: 10.99,
      availability: "In Stock",
      image: "/placeholder.svg?height=80&width=60",
    },
    {
      id: 4,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      price: 10.99,
      availability: "Out of Stock",
      image: "/placeholder.svg?height=80&width=60",
    },
  ])

  const handleRemoveItem = (id) => {
    setBookmarkedItems(bookmarkedItems.filter((item) => item.id !== id))
  }

  const handleAddToCart = (item) => {
    // click garesi yeuta book cart ma add hunu paryo and then go to cart page
    alert(`Added ${item.title} to cart`)
    navigate("/cart")
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  return (
    <div className="flex flex-col min-h-screen w-full">

      <header className="border-b border-gray-200 py-4 w-full">
        <div className="w-full max-w-[1400px] mx-auto px-4 flex items-center justify-between">
  
          <Link to="/home" className="text-xl font-medium">
            ChapterHouse
          </Link>

          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search books, authors..."
              className="w-full border border-gray-300 rounded-md py-1 px-3 pr-10"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <User className="h-6 w-6" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link 
              to="/bookmarks" 
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <Bookmark className="h-6 w-6 text-green-600" />
            </Link>

            <Link 
              to="/cart" 
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

        <div className="border border-gray-200 rounded-md overflow-hidden">
          {/* TableHeader */}
          <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
            <div className="col-span-1 font-medium">S.N.</div>
            <div className="col-span-2 font-medium">Book Image</div>
            <div className="col-span-3 font-medium">Name</div>
            <div className="col-span-1 font-medium">Genre</div>
            <div className="col-span-1 font-medium">Availability</div>
            <div className="col-span-1 font-medium">Price</div>
            <div className="col-span-2 font-medium text-center">Add to Cart</div>
            <div className="col-span-1 font-medium text-center">Remove</div>
          </div>

          {/* Bookmarked Items */}
          {bookmarkedItems.length > 0 ? (
            bookmarkedItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                <div className="col-span-1">{index + 1}</div>
                <div className="col-span-2">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-20 object-cover bg-gray-200 rounded"
                  />
                </div>
                <div className="col-span-3">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.author}</p>
                </div>
                <div className="col-span-1 text-sm">{item.genre}</div>
                <div className="col-span-1 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.availability === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.availability}
                  </span>
                </div>
                <div className="col-span-1">${item.price.toFixed(2)}</div>
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    disabled={item.availability !== "In Stock"}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Your bookmarks list is empty.{" "}
              <Link to="/home" className="text-green-600 hover:underline">
                Browse books
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-200 py-8 w-full mt-auto">
        <div className="w-full max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">ChapterHouse</h3>
              <p className="text-gray-600">Your destination for quality books with easy shopping experience</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Contact</h3>
              <p className="text-gray-600">Basundhara, Kathmandu</p>
              <p className="text-gray-600">support@chapterhouse.com</p>
              <p className="text-gray-600">984-1234567</p>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-600 text-sm">2025 ChapterHouse. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
