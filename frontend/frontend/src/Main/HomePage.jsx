import { useState } from "react"
import { Search, User, Bookmark, ShoppingCart, Filter } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All Books")
  const [sortBy, setSortBy] = useState("Popularity")

  // Sample book data
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R Tolkien",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 4,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 5,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 6,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 7,
      title: "The Hobbit",
      author: "J.R.R Tolkien",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 8,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
    },
  ]

  const categories = [
    "All Books",
    "Best Sellers",
    "Award Winners",
    "New Releases",
    "New Arrivals",
    "Coming Soon",
    "Deals",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promotional Banner */}
      <div className="bg-green-600 text-white text-center py-2">
        Summer Sale! 20% off on selected titles. Limited time offer.
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-medium">
            ChapterHouse
          </Link>

          {/* Search Bar */}
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

          {/* Categories Dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-1">
              <span>Categories</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* User Icons */}
          <div className="flex items-center space-x-4">
            <button>
              <User className="h-6 w-6" />
            </button>
            <button>
              <Bookmark className="h-6 w-6" />
            </button>
            <button>
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto space-x-6 py-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`whitespace-nowrap px-1 py-1 border-b-2 ${
                  selectedCategory === category ? "border-green-600 text-green-600" : "border-transparent"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Filter and Sort */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="ml-4 text-sm text-gray-500">Showing 10 Results</span>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 pr-8 appearance-none"
            >
              <option value="Popularity">Popularity</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Newest">Newest</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <img src={book.image || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="font-medium mt-1">${book.price.toFixed(2)}</p>
                <div className="flex justify-between items-center mt-3">
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Add to Cart</button>
                  <button>
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded">Previous</button>
            <button className="px-3 py-1 bg-green-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded">Next</button>
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">ChapterHouse</h3>
              <p className="text-gray-600">Your destination for quality books with easy shopping experience</p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Contact</h3>
              <p className="text-gray-600">Baneshwar, Kathmandu</p>
              <p className="text-gray-600">chapterhouse@gmail.com</p>
              <p className="text-gray-600">9812131232</p>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-600 text-sm">2025 ChapterHouse. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
