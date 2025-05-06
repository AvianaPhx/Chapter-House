"use client"

import { useState } from "react"
import { Search, User, Bookmark, ShoppingCart, Filter } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function App() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("All Books")
  const [sortBy, setSortBy] = useState("Popularity")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [selectedFormats, setSelectedFormats] = useState([])
  const [availability, setAvailability] = useState("all")
  const [selectedGenres, setSelectedGenres] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Hardcover",
      availability: "In Stock",
      genre: "Fiction",
      category: ["All Books", "Best Sellers"],
      published: "2023-01-15",
      featured: true,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 12.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Paperback",
      availability: "In Stock",
      genre: "Fiction",
      category: ["All Books", "Award Winners"],
      published: "2022-11-20",
      featured: false,
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R Tolkien",
      price: 15.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Deluxe",
      availability: "In Stock",
      genre: "Fantasy",
      category: ["All Books", "Best Sellers", "Coming Soon"],
      published: "2023-05-10",
      featured: true,
    },
    {
      id: 4,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 9.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Paperback",
      availability: "Out of Stock",
      genre: "Mystery",
      category: ["All Books", "New Releases"],
      published: "2023-06-05",
      featured: false,
    },
    {
      id: 5,
      title: "The Haunting of Hill House",
      author: "Shirley Jackson",
      price: 11.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Hardcover",
      availability: "In Stock",
      genre: "Horror",
      category: ["All Books", "Deals"],
      published: "2022-10-15",
      featured: false,
    },
    {
      id: 6,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 8.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Paperback",
      availability: "In Stock",
      genre: "Romance",
      category: ["All Books", "Best Sellers", "Deals"],
      published: "2022-08-20",
      featured: true,
    },
    {
      id: 7,
      title: "Dune",
      author: "Frank Herbert",
      price: 14.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Deluxe",
      availability: "In Stock",
      genre: "Science Fiction",
      category: ["All Books", "Award Winners"],
      published: "2023-03-15",
      featured: false,
    },
    {
      id: 8,
      title: "And Then There Were None",
      author: "Agatha Christie",
      price: 10.99,
      image: "/placeholder.svg?height=200&width=150",
      format: "Hardcover",
      availability: "Out of Stock",
      genre: "Mystery",
      category: ["All Books", "New Arrivals"],
      published: "2023-07-01",
      featured: false,
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

  const formats = ["Hardcover", "Paperback", "eBook", "Audiobook", "Deluxe"]
  const genres = ["Fiction", "Non-Fiction", "Mystery", "Horror", "Fantasy", "Romance", "Science Fiction", "Biography"]

  const filteredBooks = books
    .filter((book) => {
      if (selectedCategory !== "All Books" && !book.category.includes(selectedCategory)) {
        return false
      }

      if (book.price < priceRange.min || book.price > priceRange.max) {
        return false
      }

      if (selectedFormats.length > 0 && !selectedFormats.includes(book.format)) {
        return false
      }

      if (availability === "inStock" && book.availability !== "In Stock") {
        return false
      }

      if (selectedGenres.length > 0 && !selectedGenres.includes(book.genre)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Popularity":
          return a.featured === b.featured ? 0 : a.featured ? -1 : 1
        case "Price: Low to High":
          return a.price - b.price
        case "Price: High to Low":
          return b.price - a.price
        case "Newest":
          return new Date(b.published).getTime() - new Date(a.published).getTime()
        default:
          return 0
      }
    })

  const handleFormatToggle = (format) => {
    setSelectedFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]))
  }

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/signin")
  }

  return (
    <div className="flex flex-col min-h-screen">

      <div className="bg-green-600 text-white text-center py-2">
        Summer Sale! 20% off on selected titles. Limited time offer.
      </div>

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

      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Filter*/}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="ml-4 text-sm text-gray-500">Showing {filteredBooks.length} Results</span>
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

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white border border-gray-200 rounded-md p-4 mb-6 shadow-md">
            <h3 className="font-medium mb-3">Filters</h3>

            {/* Price Range */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="border border-gray-300 rounded w-20 px-2 py-1"
                />
                <span>to</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="border border-gray-300 rounded w-20 px-2 py-1"
                />
              </div>
            </div>

            {/* Format */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Format</h4>
              <div className="grid grid-cols-2 gap-2">
                {formats.map((format) => (
                  <label key={format} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(format)}
                      onChange={() => handleFormatToggle(format)}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Availability</h4>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === "all"}
                    onChange={() => setAvailability("all")}
                    className="text-green-600"
                  />
                  <span className="text-sm">All</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === "inStock"}
                    onChange={() => setAvailability("inStock")}
                    className="text-green-600"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
              </div>
            </div>

            {/* Book Genre */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Book Genre</h4>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre)}
                      onChange={() => handleGenreToggle(genre)}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded text-sm"
                onClick={() => {
                  setPriceRange({ min: 0, max: 100 })
                  setSelectedFormats([])
                  setAvailability("all")
                  setSelectedGenres([])
                }}
              >
                Reset
              </button>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} onClick={() => navigate('/book')} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <img src={book.image || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="flex justify-between mt-1">
                  <p className="font-medium">${book.price.toFixed(2)}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${book.availability === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {book.availability}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {book.format} • {book.genre}
                </p>
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

      <footer className="bg-gray-200 py-8">
        <div className="container mx-auto px-4">
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
