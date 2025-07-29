import { useState, useEffect } from "react";
import { User, Bookmark, ShoppingCart, Filter, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MainHeader from "../Components/MainHeader";
import { useAuth } from "../Auth/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [sortBy, setSortBy] = useState("Popularity");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [availability, setAvailability] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, logout } = useAuth();

  const categories = [
    "All Books",
    "Best Sellers",
    "Award Winners",
    "New Releases",
    "New Arrivals",
    "Coming Soon",
    "Deals",
  ];

  const formats = ["Hardcover", "Paperback", "eBook", "Audiobook", "Deluxe"];
  const genres = ["Fiction", "Non-Fiction", "Mystery", "Horror", "Fantasy", "Romance", "Science Fiction", "Biography"];

  const fetchBooks = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7227/api/book", {
        params: {
          page: page,
          pageSize: 10,
          search: search,
          category: selectedCategory !== "All Books" ? selectedCategory : "",
          priceMin: priceRange.min,
          priceMax: priceRange.max,
          formats: selectedFormats.join(","),
          availability: availability,
          genres: selectedGenres.join(","),
          sortBy: sortBy
        },
      });

      if (response.data) {
        setBooks(response.data.books || response.data.Books || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
      } else {
        setBooks([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, searchTerm);
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    priceRange,
    selectedFormats,
    availability,
    selectedGenres,
    sortBy
  ]);

  const handleFormatToggle = (format) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
    setCurrentPage(1);
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            «
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 ${currentPage === 1 ? 'bg-green-600 text-white' : 'border rounded-md hover:bg-gray-100'}`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
            const pageNum = startPage + index;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 min-w-[36px] ${
                  currentPage === pageNum
                    ? 'bg-green-600 text-white'
                    : 'border rounded-md hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 ${
                  currentPage === totalPages
                    ? 'bg-green-600 text-white'
                    : 'border rounded-md hover:bg-gray-100'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
          
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            »
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-green-600 text-white text-center py-2">
        Summer Sale! 20% off on selected titles. Limited time offer.
      </div>
      <MainHeader />

      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search books, authors..."
              className="w-full border border-gray-300 rounded-md py-1 px-3 pr-10"
              value={searchTerm}
              onChange={handleSearch}
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

            <Link to="/bookmarks" className="p-1 hover:bg-gray-100 rounded-md">
              <Bookmark className="h-6 w-6" />
            </Link>

            <Link to="/cart" className="p-1 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Category tabs */}
        <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`whitespace-nowrap px-4 py-2 mr-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="ml-4 text-sm text-gray-500">
              Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)} of {totalCount} results
            </span>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1 pr-8 appearance-none"
            >
              <option value="Popularity">Popularity</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Newest">Newest</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, 'min')}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, 'max')}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-medium mb-2">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === 'all'}
                      onChange={() => handleAvailabilityChange('all')}
                      className="mr-2"
                    />
                    All
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === 'in-stock'}
                      onChange={() => handleAvailabilityChange('in-stock')}
                      className="mr-2"
                    />
                    In Stock
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === 'out-of-stock'}
                      onChange={() => handleAvailabilityChange('out-of-stock')}
                      className="mr-2"
                    />
                    Out of Stock
                  </label>
                </div>
              </div>

              {/* Formats */}
              <div>
                <h4 className="font-medium mb-2">Formats</h4>
                <div className="space-y-2">
                  {formats.map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format)}
                        onChange={() => handleFormatToggle(format)}
                        className="mr-2"
                      />
                      {format}
                    </label>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="md:col-span-3">
                <h4 className="font-medium mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedGenres.includes(genre)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.length > 0 ? (
                books.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book.id)}
                    className="border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      <img 
                        src={book.image || "/placeholder.svg"} 
                        alt={book.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                      <div className="flex justify-between mt-1">
                        <div>
                          {book.onSale && book.discountedPercentage > 0 ? (
                            <>
                              <span className="text-green-600 font-medium">
                                ${(book.price * (1 - book.discountedPercentage / 100)).toFixed(2)}
                              </span>
                              <span className="text-gray-500 text-sm line-through ml-2">
                                ${book.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium">${book.price.toFixed(2)}</span>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      {book.onSale && book.discountedPercentage > 0 && (
                        <div className="mt-1">
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                            {book.discountedPercentage}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center text-gray-500 py-12">
                  No books found. Try adjusting your filters or search term.
                </div>
                
              )}
            </div>

            {totalPages > 1 && renderPagination()}
          </>
        )}
        
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
  );
}