import { useState, useEffect } from "react";
import { Search, Bookmark, ShoppingCart, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [sortBy, setSortBy] = useState("Popularity");
  const [priceRange] = useState({ min: 0, max: 100 });
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [availability] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [books, setBooks] = useState([]);

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
    try {
      const response = await axios.get("https://localhost:7227/api/book", {
        params: {
          page: page,
          pageSize: 10, 
          search: search,
          category: selectedCategory,
          priceMin: priceRange.min,
          priceMax: priceRange.max,
          formats: selectedFormats.join(","),
          availability: availability,
          genres: selectedGenres.join(","),
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setBooks(response.data);
        setTotalPages(5);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
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
  ]);

  const handleFormatToggle = (format) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Landing Header */}
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
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/signin" className="px-4 py-2 text-sm bg-green-600 text-white rounded-md">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 text-sm border-2 border-green-600 rounded-md">
              Register
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="ml-4 text-sm text-gray-500">Showing {Array.isArray(books) ? books.length : 0} Results</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(books) && books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="border border-gray-200 rounded-md overflow-hidden cursor-pointer"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <img src={book.image || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.description}</p>
                  <div className="flex justify-between mt-1">
                    <p className="font-medium">${book.price}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {book.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">No books found.</div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            {currentPage > 1 && (
              <button
                className="px-3 py-1 border border-gray-300 rounded"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            )}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 ${currentPage === index + 1 ? "bg-green-600 text-white" : "border border-gray-300 rounded"}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                className="px-3 py-1 border border-gray-300 rounded"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            )}
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
  );
}
