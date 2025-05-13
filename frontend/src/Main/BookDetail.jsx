import { useState, useEffect } from "react";
import { Search, User, Bookmark, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [book, setBook] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7227/api/book/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
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
        quantity: quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(`Added ${quantity} copy(ies) of "${book.title}" to your cart.`);
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add to cart. Please try again.");
  }
};


  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      navigate("/signin");
      return;
    }

    alert(`Proceeding to checkout with ${quantity} copy(ies) of ${book.title}`);
  };

  const handleBookmark = () => {
    if (!isLoggedIn()) {
      navigate("/signin");
      return;
    }

    setBookmarked(!bookmarked);
    alert(`${book.title} ${!bookmarked ? 'added to' : 'removed from'} bookmarks.`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("Role");
    navigate("/signin");
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="bg-green-600 text-white text-center py-2">
        Summer Sale! 20% off on selected titles. Limited time offer.
      </div>

      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/home" className="text-xl font-medium">ChapterHouse</Link>

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

            <Link to="/bookmarks" className="p-1 hover:bg-gray-100 rounded-md">
              <Bookmark className="h-6 w-6" />
            </Link>

            <Link to="/cart" className="p-1 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-4 py-6 flex-grow">
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-200 aspect-[3/4] rounded-md overflow-hidden">
                <img src={book.image || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
              <p className="text-gray-600 mb-2">{book.author} | {book.isbn}</p>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-xl font-bold mb-4">${book.price.toFixed(2)}</p>
              <p className="text-gray-700 mb-6">{book.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-2 py-1 text-green-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center py-1 border-x border-gray-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-2 py-1 text-green-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-green-50 text-green-600 border border-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                    bookmarked
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
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
