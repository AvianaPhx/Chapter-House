import { useState, useEffect } from "react";
import { Search, User, Bookmark, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainHeader from "../Components/MainHeader";

export default function BookDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [book, setBook] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [canReview, setCanReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch book details
        const bookResponse = await axios.get(`https://localhost:7227/api/book/${id}`, { signal });
        setBook(bookResponse.data);

        // Check bookmark status if logged in
        if (isLoggedIn()) {
          await checkBookmarkStatus(signal);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error:", err);
          setError("Failed to load book details");
          if (err.response?.status === 404) {
            navigate("/not-found", { replace: true });
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    const checkBookmarkStatus = async (signal) => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://localhost:7227/api/whitelist/check/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal
          }
        );
        setBookmarked(response.data.isBookmarked);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Bookmark check error:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("accessToken");
            navigate("/signin", { state: { from: `/book/${id}` } });
          }
        }
      }
    };


    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`https://localhost:7227/api/review/${id}`);
        setReviews(res.data);
      } catch (err) {
        setReviews([]);
      }
    };

    // Check if user can review
    const checkCanReview = async () => {
      if (!isLoggedIn()) {
        setCanReview(false);
        return;
      }
      try {
        const token = localStorage.getItem("accessToken");
        // Try posting a dummy review to see if allowed (or create a dedicated endpoint in backend for this check)
        // For now, assume user can review if they haven't already and have purchased (handled by backend on submit)
        setCanReview(true);
      } catch {
        setCanReview(false);
      }
    };

    fetchData();
    fetchReviews();
    checkCanReview();

    return () => controller.abort();
  }, [id, navigate]);

  const calculateDiscountedPrice = () => {
    if (book?.onSale && book?.discountedPercentage > 0) {
      return book.price * (1 - book.discountedPercentage / 100);
    }
    return book?.price || 0;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      navigate("/signin", { state: { from: `/book/${id}` } });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "https://localhost:7227/api/cart",
        { bookId: book.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} of "${book.title}" to your cart`);
    } catch (err) {
      console.error("Cart error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin", { state: { from: `/book/${id}` } });
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn()) {
      navigate("/signin", { state: { from: `/book/${id}` } });
      return;
    }

    try {
      const orderItems = [{
        BookId: book.id,
        Quantity: quantity
      }];

      const response = await fetch('https://localhost:7227/api/Order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(orderItems)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderResult = await response.json();
      navigate('/orders');
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Failed to process purchase. Please try again.");
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn()) {
      navigate("/signin", { state: { from: `/book/${id}` } });
      return;
    }

    try {
      setBookmarkLoading(true);
      const token = localStorage.getItem("accessToken");
      const newState = !bookmarked;
      
      // Optimistic update
      setBookmarked(newState);

      if (newState) {
        try {
          await axios.post(
            "https://localhost:7227/api/whitelist",
            { bookId: book.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          if (err.response?.status !== 409) throw err;
          // 409 means already bookmarked - state is correct
        }
      } else {
        await axios.delete(
          `https://localhost:7227/api/whitelist/${book.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      // Revert on error
      setBookmarked(!bookmarked);
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin", { state: { from: `/book/${id}` } });
      } else {
        alert("Failed to update bookmark. Please try again.");
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("Role");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const discountedPrice = calculateDiscountedPrice();
  const isOnSale = book.onSale && book.discountedPercentage > 0;

  // Review submit handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "https://localhost:7227/api/review",
        {
          rating: reviewRating,
          comment: reviewText,
          bookId: book.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviewText("");
      setReviewRating(5);
      // Refresh reviews
      const res = await axios.get(`https://localhost:7227/api/review/${id}`);
      setReviews(res.data);
      setCanReview(false); // Only one review per user per book
      alert("Review submitted!");
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You can only review books you have purchased.");
      } else if (err.response?.status === 409) {
        alert("You have already reviewed this book.");
      } else {
        alert("Failed to submit review.");
      }
    } finally {
      setReviewLoading(false);
    }
  };

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
                <img 
                  src={book.image || "/placeholder.svg"} 
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

            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
              <p className="text-gray-600 mb-2">{book.authorName} | {book.isbn}</p>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="mb-4">
                {isOnSale ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
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
                  <span className="text-xl font-bold">${book.price.toFixed(2)}</span>
                )}
              </div>

              <div className="mb-4">
                <span className={`text-xs px-2 py-1 rounded ${
                  book.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {book.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {book.stock > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {book.stock} available
                  </span>
                )}
              </div>

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
                    disabled={quantity >= (book.stock || 10)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={book.stock <= 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={book.stock <= 0}
                  className="bg-green-50 text-green-600 border border-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                    bookmarked
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark 
                    className={`w-5 h-5 ${bookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} 
                  />
                  {bookmarkLoading ? 'Processing...' : bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              {isOnSale && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Sale ends: {new Date(book.discountEndDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Reviews Section --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 && <p className="text-gray-500 mb-4">No reviews yet.</p>}
          <ul className="mb-6">
            {reviews.map((r) => (
              <li key={r.reviewId} className="mb-4 border-b pb-3">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">by {r.userName} on {new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-800">{r.comment}</div>
              </li>
            ))}
          </ul>

          {canReview && (
            <form onSubmit={handleReviewSubmit} className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <label className="font-medium">Your Rating:</label>
                <select
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                  disabled={reviewLoading}
                >
                  {[5,4,3,2,1].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
              <textarea
                className="w-full border rounded p-2 mb-2"
                rows={3}
                placeholder="Write your review..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                required
                disabled={reviewLoading}
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={reviewLoading || !reviewText.trim()}
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
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