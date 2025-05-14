"use client"

import { useState } from "react"
import { Search, User, Bookmark, ShoppingCart, Trash2, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function OrderHistory() {
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [orders, setOrders] = useState([
    {
      id: "ORD-7829",
      date: "May 2, 2025",
      items: [
        { 
          title: "The Great Gatsby", 
          author: "F. Scott Fitzgerald",
          quantity: 1,
          price: 10.99,
          image: "/placeholder.svg?height=80&width=60"
        }
      ],
      total: 10.99,
      status: "Delivered"
    },
    {
      id: "ORD-7645",
      date: "April 23, 2025",
      items: [
        { 
          title: "The Hobbit", 
          author: "J.R.R Tolkien",
          quantity: 1,
          price: 10.99,
          image: "/placeholder.svg?height=80&width=60"
        },
        { 
          title: "Pride and Prejudice", 
          author: "Jane Austen",
          quantity: 1,
          price: 9.99,
          image: "/placeholder.svg?height=80&width=60"
        }
      ],
      total: 20.98,
      status: "Shipped"
    },
    {
      id: "ORD-7532",
      date: "April 15, 2025",
      items: [
        { 
          title: "The Silent Patient", 
          author: "Alex Michaelides",
          quantity: 1,
          price: 10.99,
          image: "/placeholder.svg?height=80&width=60"
        }
      ],
      total: 10.99,
      status: "Processing"
    }
  ])

  const cancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId))
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
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
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>

        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
            <div className="col-span-2 font-medium">Order ID</div>
            <div className="col-span-2 font-medium">Date</div>
            <div className="col-span-4 font-medium">Items</div>
            <div className="col-span-1 font-medium text-right">Total</div>
            <div className="col-span-2 font-medium">Status</div>
            <div className="col-span-1 font-medium text-right">Actions</div>
          </div>

          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="grid grid-cols-12 p-4 border-b border-gray-200 items-center">
                <div className="col-span-2 text-sm font-medium">{order.id}</div>
                <div className="col-span-2 text-sm">{order.date}</div>
                <div className="col-span-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 mb-2 last:mb-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-12 h-16 object-cover bg-gray-200 rounded"
                      />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-600">{item.author}</div>
                        <div className="text-xs text-gray-600">Qty: {item.quantity} · ${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-span-1 text-right font-medium">${order.total.toFixed(2)}</div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <button className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
                    Details
                  </button>
                  {order.status === 'Processing' && (
                    <button 
                      onClick={() => cancelOrder(order.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              You have no order history.{" "}
              <Link to="/home" className="text-green-600 hover:underline">
                Continue shopping
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