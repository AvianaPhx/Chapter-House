import { useState, useEffect } from "react";
import { Search, User, Bookmark, ShoppingCart, Trash2, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MainHeader from "../Components/MainHeader";

export default function Bookmarks() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = () => !!localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("https://localhost:7227/api/whitelist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const books = response.data.map(book => ({
          id: book.id,
          title: book.title,
          authorName: book.authorName,
          price: book.price,
          stock: book.stock,
          onSale: book.onSale,
          discountedPercentage: book.discountedPercentage,
          discountEndDate: book.discountEndDate,
          image: book.image || "/placeholder.svg",
          rating: book.rating || 0,
          isbn: book.isbn || "",
          description: book.description || ""
        }));

        setBookmarkedItems(books);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        setBookmarkedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [navigate]);

  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (!price || !discountPercentage) return price;
    return price - (price * (discountPercentage / 100));
  };

  const handleRemoveItem = async (bookId) => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`https://localhost:7227/api/whitelist/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookmarkedItems(prev => prev.filter(item => item.id !== bookId));
      alert("Bookmark removed successfully!");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      alert("Failed to remove bookmark. Please try again.");
    }
  };

  const handleAddToCart = async (book) => {
    if (!isLoggedIn()) {
      navigate("/signin");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "https://localhost:7227/api/cart",
        {
          bookId: book.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`"${book.title}" added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("Role");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="bg-green-600 text-white text-center py-2">
        Summer Sale! 20% off on selected titles. Limited time offer.
      </div>

      <MainHeader />

      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">

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
              <Bookmark className="h-6 w-6 text-green-600" />
            </Link>

            <Link to="/cart" className="p-1 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

        {bookmarkedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookmarkedItems.map((book) => {
              const isOnSale = book.onSale && book.discountedPercentage > 0;
              const discountedPrice = calculateDiscountedPrice(book.price, book.discountedPercentage);
              const stockStatus = book.stock > 0 ? "In Stock" : "Out of Stock";
              const saleEndDate = book.discountEndDate ? new Date(book.discountEndDate).toLocaleDateString() : "";

              return (
                <div key={book.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/6">
                      <div className="bg-gray-200 aspect-[3/4] rounded-md overflow-hidden">
                        <img 
                          src={book.image} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      {isOnSale && (
                        <div className="mt-2 text-center">
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                            {book.discountedPercentage}% OFF
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-5/6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-bold">{book.title}</h2>
                          <p className="text-gray-600">{book.authorName} | {book.isbn}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(book.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>

                      <div className="mb-2">
                        {isOnSale ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-500 line-through">
                              ${book.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-red-600">
                              (Save {book.discountedPercentage}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">${book.price.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {stockStatus}
                        </span>
                        {book.stock > 0 && (
                          <span className="ml-2 text-sm text-gray-600">
                            {book.stock} available
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <button
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stock <= 0}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>

                      {isOnSale && saleEndDate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Sale ends: {saleEndDate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Your bookmarks list is empty.{" "}
            <Link to="/home" className="text-green-600 hover:underline">
              Browse books
            </Link>
          </div>
        )}
      </main>

      <footer className="bg-gray-200 py-8 w-full">
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
  );
}