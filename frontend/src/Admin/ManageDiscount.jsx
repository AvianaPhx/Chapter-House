import { useState } from 'react';
import { User, Calendar, Percent, Tag, Check, Edit, Trash2, BookOpen, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookManagementPage() {
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    price: '',
    discountType: 'percentage',
    discountValue: '',
    publicationDate: '',
    status: 'available'
  });

  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      price: '15.99',
      discountType: 'percentage',
      discountValue: '10',
      publicationDate: '2023-06-15',
      status: 'available'
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      price: '12.99',
      discountType: 'fixed',
      discountValue: '2',
      publicationDate: '2024-01-10',
      status: 'available'
    }
  ]);

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const location = useLocation();
  const activeButton = location.pathname === '/admin' ? 'add-book' : 
                     location.pathname === '/announcement' ? 'announcement' : 
                     location.pathname === '/discount' ? 'discount' : 'add-book';
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'author', 'price', 'publicationDate'];
    
    requiredFields.forEach(field => {
      if (!bookForm[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (bookForm.price && isNaN(bookForm.price)) {
      newErrors.price = 'Price must be a number';
    }
    
    if (bookForm.discountValue && isNaN(bookForm.discountValue)) {
      newErrors.discountValue = 'Discount value must be a number';
    }
    
    if (bookForm.discountType === 'percentage' && bookForm.discountValue > 100) {
      newErrors.discountValue = 'Percentage cannot exceed 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      if (editingId !== null) {
        // Update existing book
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === editingId ? 
            {...bookForm, id: editingId} : 
            book
          )
        );
        setEditingId(null);
      } else {
        // Add new book
        const newBook = {
          ...bookForm,
          id: Date.now()
        };
        setBooks([...books, newBook]);
      }
      
      // Reset form
      setBookForm({
        title: '',
        author: '',
        price: '',
        discountType: 'percentage',
        discountValue: '',
        publicationDate: '',
        status: 'available'
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const handleEdit = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      price: book.price,
      discountType: book.discountType,
      discountValue: book.discountValue,
      publicationDate: book.publicationDate,
      status: book.status
    });
    setEditingId(book.id);
  };

  const handleDelete = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleStatusToggle = (id) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === id ? 
        {...book, status: book.status === 'available' ? 'unavailable' : 'available'} : 
        book
      )
    );
  };

  const getDiscountDisplay = (book) => {
    if (!book.discountValue || book.discountValue === '0') {
      return 'None';
    }
    return book.discountType === 'percentage' ? `${book.discountValue}%` : `$${book.discountValue}`;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar - Fixed width, full height */}
      <div className="w-72 bg-white border-r flex-shrink-0 h-full overflow-y-auto ml-7">
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
            className={`w-full py-3 px-4 text-left rounded font-medium ${
                activeButton === 'add-book'
                ? 'bg-emerald-600 text-black'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => navigate('/admin')}
          >
            Book Management
          </button>

          <button
            className={`w-full py-3 px-4 text-left rounded font-medium ${
                activeButton === 'announcement'
                ? 'bg-emerald-600 text-black'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => navigate('/announcement')}
          >
            Announcement Management
          </button>

          <button
            className={`w-full py-3 px-4 text-left rounded font-medium ${
              activeButton === 'discount'
                ? 'bg-emerald-600 text-black'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => navigate('/discount')}
          >
            Discount Management
          </button>

          <button
            className={`w-full py-3 px-4 text-left rounded font-medium ${
              activeButton === 'logout'
                ? 'bg-emerald-600 text-black'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => navigate('/login')}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content - Flexible width, full height with scrolling */}
      <div className="flex-1 overflow-y-auto pl-0 pr-8 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-bold">Discount Management</h1>
            <button 
              onClick={handleSubmit}
              className="bg-emerald-600 text-white py-2 px-6 rounded hover:bg-emerald-700"
            >
              {editingId !== null ? 'Update Book' : 'Add New Discount'}
            </button>
          </div>

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <Check size={20} className="mr-2" />
              <span>{editingId !== null ? 'Book updated successfully!' : 'Book added successfully!'}</span>
            </div>
          )}

          {/* Book Form */}
          <div className="bg-white border border-black rounded-lg p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <BookOpen className="mr-2" size={16} />
                      Book Title
                    </div>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={bookForm.title}
                    onChange={handleChange}
                    className={`w-full border ${errors.title ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                    placeholder="e.g. The Great Gatsby"
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>

                <div>
                  <label htmlFor="author" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <User className="mr-2" size={16} />
                      Author
                    </div>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={bookForm.author}
                    onChange={handleChange}
                    className={`w-full border ${errors.author ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                    placeholder="e.g. F. Scott Fitzgerald"
                  />
                  {errors.author && <div className="text-red-500 text-sm mt-1">{errors.author}</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <DollarSign className="mr-2" size={16} />
                      Price
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={bookForm.price}
                      onChange={handleChange}
                      className={`w-full border ${errors.price ? 'border-red-500' : 'border-black'} rounded p-2 text-black pl-6`}
                      placeholder="e.g. 15.99"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      $
                    </div>
                  </div>
                  {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                </div>
                <div>
                  <label htmlFor="discountType" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <Percent className="mr-2" size={16} />
                      Discount Type
                    </div>
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={bookForm.discountType}
                    onChange={handleChange}
                    className="w-full border border-black rounded p-2 text-black"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
               

                <div>
                  <label htmlFor="discountValue" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <Percent className="mr-2" size={16} />
                      Discount Value
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="discountValue"
                      name="discountValue"
                      value={bookForm.discountValue}
                      onChange={handleChange}
                      className={`w-full border ${errors.discountValue ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                      placeholder={bookForm.discountType === 'percentage' ? "e.g. 10" : "e.g. 2"}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {bookForm.discountType === 'percentage' ? '%' : '$'}
                    </div>
                  </div>
                  {errors.discountValue && <div className="text-red-500 text-sm mt-1">{errors.discountValue}</div>}
                </div>                <div>
                  <label htmlFor="status" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <Tag className="mr-2" size={16} />
                      Status
                    </div>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={bookForm.status}
                    onChange={handleChange}
                    className="w-full border border-black rounded p-2 text-black"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {editingId !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setBookForm({
                        title: '',
                        author: '',
                        price: '',
                        discountType: 'percentage',
                        discountValue: '',
                        publicationDate: '',
                        status: 'available'
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700 underline mr-4"
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Book List */}
          <div className="bg-white border border-black rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Title</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Author</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Price</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Status</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Discount</th>
                    <th className="py-3 px-4 border-b text-left text-sm font-medium text-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b text-sm text-black">{book.title}</td>
                      <td className="py-3 px-4 border-b text-sm text-black">{book.author}</td>
                      <td className="py-3 px-4 border-b text-sm text-black">${book.price}</td>
                      <td className="py-3 px-4 border-b text-sm text-black">
                        <div className="flex items-center">
                          <span 
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              book.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          ></span>
                          <span>{book.status === 'available' ? 'Available' : 'Unavailable'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b text-sm text-black">{getDiscountDisplay(book)}</td>
                      <td className="py-3 px-4 border-b text-sm text-black">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(book)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(book.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusToggle(book.id)}
                            className={`p-1 ${book.status === 'available' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {book.status === 'available' ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-gray-500">
                        No books found. Add your first book using the form above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}