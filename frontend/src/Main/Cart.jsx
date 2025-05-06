"use client"

import { useState, useEffect } from "react"
import { Search, User, Bookmark, ShoppingCart, Trash2, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Cart() {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=60",
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R Tolkien",
      price: 10.99,
      quantity: 2,
      image: "/placeholder.svg?height=80&width=60",
    },
  ])
  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    setSubtotal(newSubtotal)
  }, [cartItems])

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    alert("checkout gar")
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
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
              <Bookmark className="h-6 w-6" />
            </Link>

            <Link 
              to="/cart" 
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="border border-gray-200 rounded-md overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
                <div className="col-span-6 font-medium">Product Details</div>
                <div className="col-span-2 font-medium text-center">Price</div>
                <div className="col-span-2 font-medium text-center">Quantity</div>
                <div className="col-span-2 font-medium text-right">Total</div>
              </div>

              {/* Cart Items */}
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-20 object-cover bg-gray-200 rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.author}</p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 text-sm flex items-center mt-2 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">${item.price.toFixed(2)}</div>
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded-md w-20">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-8 text-center py-1 border-x border-gray-300"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Your cart is empty.{" "}
                  <Link to="/home" className="text-green-600 hover:underline">
                    Continue shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Checkout */}
          <div className="w-full lg:w-1/3">
            <div className="border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between font-bold mb-6">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
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
