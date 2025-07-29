import { useState, useEffect } from "react";
import { User, Bookmark, ShoppingCart, ChevronRight, Search, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Auth/AuthContext";
import Header from "../Components/Header";

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();


  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7227/api/book", {
        params: {
          pageSize: 4,
          category: selectedCategory === "Home" ? "Featured" : selectedCategory,
          search: searchTerm
        }
      });
      setBooks(response.data?.books || response.data?.Books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("https://localhost:7227/api/notifications");
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchBooks();
    if (selectedCategory === "Home") {
      fetchNotifications();
    }
  }, [selectedCategory, searchTerm]);

  const handleLogout = async () => {
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
  };

  const handleViewAllBooks = () => {
    setSelectedCategory("All Books");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Summer Sale Banner */}
      <div className="bg-green-600 text-white text-center py-2">
        Summer Sale! 20% off on selected titles. Limited time offer.
      </div>

      <Header />

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
            <Link to="/signin" className="px-4 py-2 text-sm bg-green-600 text-white rounded-md">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 text-sm border-2 border-green-600 rounded-md">
              Register
            </Link>
          </div>
        </div>
      </header>



      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Summer Reading Sale Banner */}
        <div className="relative rounded-lg overflow-hidden mb-8 h-48 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-3xl font-bold mb-2">Summer Reading Sale</h2>
              <p className="text-xl">Get 30% off on bestsellers</p>
            </div>
          </div>
        </div>

        {/* Featured Books Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Books</h2>
            <button
              onClick={handleViewAllBooks}
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-md overflow-hidden animate-pulse">
                  <div className="bg-gray-300 h-48"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                  className="border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    {book.image && (
                      <img 
                        src={book.image} 
                        alt={book.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x400?text=Book+Cover";
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{book.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-lg">${book.price?.toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Updates Section */}
        <section>
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-2xl font-bold">Latest Updates</h2>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        {notification.timestamp && (
                          <p className="text-sm text-gray-400 mt-2">{notification.timestamp}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2 text-green-600">ChapterHouse</h3>
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