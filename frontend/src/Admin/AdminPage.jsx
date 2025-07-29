import { useState, useEffect } from 'react';
import { User, Check, Pencil, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../Auth/AuthContext";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publicationDate: '',
    genres: [],
    description: '',
    isbn: '',
    stock: '',
    price: '',
    format: '',
    onSale: false,
    discount: '10%',
    discountStartDate: '',
    discountEndDate: ''
  });
  const { logout } = useAuth();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookId, setBookId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const location = useLocation();
  const activeButton = location.pathname === '/admin' ? 'add-book' :
                       location.pathname === '/announcement' ? 'announcement' :
                       'add-book';
  const navigate = useNavigate();

  const genreOptions = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'science-fiction', label: 'Science Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'biography', label: 'Biography' },
    { value: 'history', label: 'History' },
    { value: 'poetry', label: 'Poetry' }
  ];

  // Fetch book database with pagination
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://localhost:7227/api/book?page=${currentPage}&pageSize=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      
      if (data.books) {
        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } else if (Array.isArray(data)) {
        setBooks(data);
        setTotalPages(1);
        setTotalCount(data.length);
      } else {
        setBooks([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'isbn') {
      const digitsOnly = value.replace(/\D/g, '');
      
      setFormData(prevState => ({
        ...prevState,
        [name]: digitsOnly
      }));
 
      if (digitsOnly.length > 0 && digitsOnly.length !== 13) {
        setErrors(prev => ({
          ...prev,
          [name]: `ISBN must be exactly 13 digits. Current length: ${digitsOnly.length}`
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const handleGenreToggle = (genreValue) => {
    setFormData(prevState => {
      const currentGenres = [...prevState.genres];
      return {
        ...prevState,
        genres: currentGenres.includes(genreValue)
          ? currentGenres.filter(g => g !== genreValue)
          : [...currentGenres, genreValue]
      };
    });
    if (errors.genres) {
      setErrors(prev => ({ ...prev, genres: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'author', 'publisher', 'publicationDate', 'description', 'isbn', 'price', 'stock'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.isbn && formData.isbn.length !== 13) {
      newErrors.isbn = `ISBN must be exactly 13 digits. Current length: ${formData.isbn.length}`;
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'Please select at least one genre';
    }
    
    if (!formData.format) {
      newErrors.format = 'Please select a format';
    }

    if (formData.onSale) {
      if (!formData.discountStartDate) {
        newErrors.discountStartDate = 'Discount start date is required';
      }
      if (!formData.discountEndDate) {
        newErrors.discountEndDate = 'Discount end date is required';
      }
      if (formData.discountStartDate && formData.discountEndDate) {
        const startDate = new Date(formData.discountStartDate);
        const endDate = new Date(formData.discountEndDate);
        const today = new Date();
        
        if (startDate > endDate) {
          newErrors.discountEndDate = 'End date must be after start date';
        }
        if (endDate < today) {
          newErrors.discountEndDate = 'End date must be in the future';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      try {
        const payload = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          isbn: formData.isbn,
          stock: parseInt(formData.stock),
          onSale: formData.onSale,
          published: new Date(formData.publicationDate).toISOString(),
          discountedPercentage: formData.onSale ? parseFloat(formData.discount.replace('%', '')) : 0,
          discountStartDate: formData.onSale 
            ? new Date(formData.discountStartDate).toISOString() 
            : new Date(0).toISOString(),
          discountEndDate: formData.onSale
            ? new Date(formData.discountEndDate).toISOString()
            : new Date(0).toISOString(),
          language: "English",
          genreName: formData.genres.join(', '),
          formatName: formData.format,
          authorName: formData.author,
          publisherName: formData.publisher,
        };

        const url = bookId 
          ? `https://localhost:7227/api/book/${bookId}` 
          : `https://localhost:7227/api/book`; 

        const method = bookId ? "PUT" : "POST"; 

        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update or add book");
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setFormData({
          title: '',
          author: '',
          publisher: '',
          publicationDate: '',
          genres: [],
          description: '',
          isbn: '',
          stock: '',
          price: '',
          format: '',
          onSale: false,
          discount: '10%',
          discountStartDate: '',
          discountEndDate: ''
        });

        setBookId(null);
        fetchBooks();
      } catch (error) {
        alert(error.message);
        console.error("Failed to upload book", error);
      }
    } else {
      if (errors.isbn) {
        alert(errors.isbn);
      }
      console.log("Form has errors");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const handleEditBook = async (book) => {
    setFormData({
      title: book.title,
      author: book.authorName,
      publisher: book.publisherName,
      publicationDate: book.published.split('T')[0],
      genres: book.genreName.split(", "),
      description: book.description,
      isbn: book.isbn,
      stock: book.stock,
      price: book.price,
      format: book.formatName,
      onSale: book.onSale,
      discount: book.discountedPercentage ? `${book.discountedPercentage}%` : '10%',
      discountStartDate: book.discountStartDate ? book.discountStartDate.split('T')[0] : '',
      discountEndDate: book.discountEndDate ? book.discountEndDate.split('T')[0] : ''
    });

    setBookId(book.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBook = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const res = await fetch(`https://localhost:7227/api/book/${bookId}`, {
          method: 'DELETE'
        });
        
        if (!res.ok) throw new Error('Failed to delete book');

        if (books.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchBooks();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
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
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 ${currentPage === 1 ? 'bg-emerald-600 text-white' : 'border rounded-md hover:bg-gray-100'}`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
            const page = startPage + index;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 min-w-[36px] ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white'
                    : 'border rounded-md hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 ${
                  currentPage === totalPages
                    ? 'bg-emerald-600 text-white'
                    : 'border rounded-md hover:bg-gray-100'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
          
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r flex-shrink-0 h-screen fixed ml-7">
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="text-gray-500" size={24} />
          </div>
          <div className="mt-2 text-center">
            <div className="font-medium uppercase text-gray-500">ADMIN</div>
            <div className="text-sm text-gray-500">admin@chapterhouse.com</div>
          </div>
        </div>

        <div className="mt-4 px-4 space-y-2">
          <button
            className={`w-full py-3 px-4 text-left rounded font-medium ${activeButton === 'add-book' ? 'bg-emerald-600 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => navigate('/admin')}
          >
            Book Management
          </button>
          <button
            className={`w-full py-3 px-4 text-left rounded font-medium ${activeButton === 'announcement' ? 'bg-emerald-600 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => navigate('/announcement')}
          >
            Announcement Management
          </button>

          <button
            className={`w-full py-3 px-4 text-left rounded font-medium ${activeButton === 'logout' ? 'bg-emerald-600 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pl-80 pr-8 py-8 h-screen">
        <div className="mx-auto max-w-4xl pb-8">
          {/* Form Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-bold">{bookId ? 'Edit Book' : 'Add New Book'}</h1>
            <button
              onClick={handleSubmit}
              className="bg-emerald-600 text-white py-2 px-6 rounded hover:bg-emerald-700"
            >
              {bookId ? 'Update' : 'Save'}
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <Check size={20} className="mr-2" />
              <span>Saved successfully!</span>
            </div>
          )}

          {/* Book Form */}
          <div className="bg-white border border-black rounded-lg p-6 shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6 col-span-1">
                <div>
                  <label htmlFor="title" className="block mb-2 text-black font-medium text-left">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full border ${errors.title ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>

                <div>
                  <label htmlFor="author" className="block mb-2 text-black font-medium text-left">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`w-full border ${errors.author ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.author && <div className="text-red-500 text-sm mt-1">{errors.author}</div>}
                </div>

                <div>
                  <label htmlFor="publisher" className="block mb-2 text-black font-medium text-left">Publisher</label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    className={`w-full border ${errors.publisher ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.publisher && <div className="text-red-500 text-sm mt-1">{errors.publisher}</div>}
                </div>

                <div>
                  <label htmlFor="publicationDate" className="block mb-2 text-black font-medium text-left">Publication Date</label>
                  <input
                    type="date"
                    id="publicationDate"
                    name="publicationDate"
                    value={formData.publicationDate}
                    onChange={handleChange}
                    className={`w-full border ${errors.publicationDate ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.publicationDate && <div className="text-red-500 text-sm mt-1">{errors.publicationDate}</div>}
                </div>

                <div>
                  <label className="block mb-2 text-black font-medium text-left">Genres</label>
                  <div className={`p-2 border ${errors.genres ? 'border-red-500' : 'border-black'} rounded flex flex-wrap gap-2`}>
                    {genreOptions.map(genre => (
                      <button
                        key={genre.value}
                        type="button"
                        onClick={() => handleGenreToggle(genre.value)}
                        className={`px-3 py-1 text-sm rounded ${formData.genres.includes(genre.value) ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {genre.label}
                      </button>
                    ))}
                  </div>
                  {errors.genres && <div className="text-red-500 text-sm mt-1">{errors.genres}</div>}
                </div>

                <div>
                  <label htmlFor="description" className="block mb-2 text-black font-medium text-left">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full border ${errors.description ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 col-span-1">
                <div>
                  <label htmlFor="isbn" className="block mb-2 text-black font-medium text-left">
                    ISBN <span className="text-sm text-gray-500">(13 digits required)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      maxLength={13}
                      className={`w-full border ${errors.isbn ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                      placeholder="Enter 13 digit ISBN"
                    />
                    {formData.isbn && formData.isbn.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm">
                        {formData.isbn.length}/13
                      </div>
                    )}
                  </div>
                  {errors.isbn && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.isbn}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="format" className="block mb-2 text-black font-medium text-left">Format</label>
                  <select
                    id="format"
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className={`w-full border ${errors.format ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  >
                    <option value="">Select Format</option>
                    <option value="hardcover">Hardcover</option>
                    <option value="paperback">Paperback</option>
                    <option value="ebook">eBook</option>
                    <option value="audiobook">Audiobook</option>
                  </select>
                  {errors.format && <div className="text-red-500 text-sm mt-1">{errors.format}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stock" className="block mb-2 text-black font-medium text-left">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className={`w-full border ${errors.stock ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                    />
                    {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
                  </div>

                  <div>
                    <label htmlFor="price" className="block mb-2 text-black font-medium text-left">Price</label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full border ${errors.price ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                    />
                    {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                  </div>
                </div>

                {/* Discount Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="onSale" className="block mb-2 text-black font-medium text-left">On Sale</label>
                    <select
                      id="onSale"
                      name="onSale"
                      value={formData.onSale ? "true" : "false"}
                      onChange={(e) =>
                        setFormData(prevState => ({
                          ...prevState,
                          onSale: e.target.value === "true"
                        }))
                      }
                      className="w-full border border-black rounded p-2 text-black"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>

                  {formData.onSale && (
                    <div>
                      <label htmlFor="discount" className="block mb-2 text-black font-medium text-left">Discount</label>
                      <select
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className="w-full border border-black rounded p-2 text-black"
                      >
                        <option value="10%">10%</option>
                        <option value="20%">20%</option>
                        <option value="30%">30%</option>
                        <option value="40%">40%</option>
                        <option value="50%">50%</option>
                      </select>
                    </div>
                  )}
                </div>

                {formData.onSale && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="discountStartDate" className="block mb-2 text-black font-medium text-left">Start Date</label>
                      <input
                        type="date"
                        id="discountStartDate"
                        name="discountStartDate"
                        value={formData.discountStartDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full border ${errors.discountStartDate ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                      />
                      {errors.discountStartDate && <div className="text-red-500 text-sm mt-1">{errors.discountStartDate}</div>}
                    </div>

                    <div>
                      <label htmlFor="discountEndDate" className="block mb-2 text-black font-medium text-left">End Date</label>
                      <input
                        type="date"
                        id="discountEndDate"
                        name="discountEndDate"
                        value={formData.discountEndDate}
                        onChange={handleChange}
                        min={formData.discountStartDate || new Date().toISOString().split('T')[0]}
                        className={`w-full border ${errors.discountEndDate ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                      />
                      {errors.discountEndDate && <div className="text-red-500 text-sm mt-1">{errors.discountEndDate}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-black font-bold">Available Books</h2>
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalCount)} of {totalCount} books
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                <p className="mt-2">Loading books...</p>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-black rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left border-b">Title</th>
                        <th className="py-3 px-4 text-left border-b">Author</th>
                        <th className="py-3 px-4 text-left border-b">ISBN</th>
                        <th className="py-3 px-4 text-left border-b">Format</th>
                        <th className="py-3 px-4 text-left border-b">Price</th>
                        <th className="py-3 px-4 text-left border-b">Stock</th>
                        <th className="py-3 px-4 text-left border-b">Published</th>
                        <th className="py-3 px-4 text-left border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                            No books available in the database
                          </td>
                        </tr>
                      ) : (
                        books.map((book) => (
                          <tr key={book.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 border-b">{book.title}</td>
                            <td className="py-3 px-4 border-b">{book.authorName}</td>
                            <td className="py-3 px-4 border-b">{book.isbn}</td>
                            <td className="py-3 px-4 border-b">{book.formatName}</td>
                            <td className="py-3 px-4 border-b">
                              {book.onSale ? (
                                <div>
                                  <span className="line-through text-gray-500">${book.price.toFixed(2)}</span>
                                  <span className="ml-2 text-emerald-600">
                                    ${(book.price * (1 - book.discountedPercentage / 100)).toFixed(2)}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Sale ends: {formatDate(book.discountEndDate)}
                                  </div>
                                </div>
                              ) : (
                                <span>${book.price.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 border-b">{book.stock}</td>
                            <td className="py-3 px-4 border-b">{formatDate(book.published)}</td>
                            <td className="py-3 px-4 border-b">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEditBook(book)}
                                  className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                                  title="Edit book"
                                >
                                  <Pencil size={16} />
                                  <span className="sr-only">Edit</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                                  title="Delete book"
                                >
                                  <Trash2 size={16} />
                                  <span className="sr-only">Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}