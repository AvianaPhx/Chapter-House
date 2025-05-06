import { useState } from 'react';
import { User, Plus, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    image: null,
    imageUrl: null
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const activeButton = location.pathname === '/admin' ? 'add-book' : 
                     location.pathname === '/announcement' ? 'announcement' : 
                     'add-book'; // default
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
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

  const handleGenreToggle = (genreValue) => {
    setFormData(prevState => {
      const currentGenres = [...prevState.genres];
      
      if (currentGenres.includes(genreValue)) {
        // Remove genre if already selected
        return {
          ...prevState,
          genres: currentGenres.filter(g => g !== genreValue)
        };
      } else {
        // Add genre if not already selected
        return {
          ...prevState,
          genres: [...currentGenres, genreValue]
        };
      }
    });
    
    // Clear genre error if it exists
    if (errors.genres) {
      setErrors(prev => ({
        ...prev,
        genres: null
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      
      setFormData(prevState => ({
        ...prevState,
        image: selectedFile,
        imageUrl: imageUrl
      }));
      
      // Clear image error if it exists
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: null
        }));
      }
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
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'Please select at least one genre';
    }
    
    if (!formData.format) {
      newErrors.format = 'Please select a format';
    }
    
    if (!formData.image) {
      newErrors.image = 'Please upload an image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      console.log('Submitting book data:', formData);
      // Here you would typically send the data to an API
      
      // Show success message
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      console.log('Form has errors');
    }
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
            <div className="text-sm text-gray-500">email@email.com</div>
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
            <h1 className="text-2xl text-black font-bold">Add New Book</h1>
            <button 
              onClick={handleSubmit}
              className="bg-emerald-600 text-white py-2 px-6 rounded hover:bg-emerald-700"
            >
              Save
            </button>
          </div>

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <Check size={20} className="mr-2" />
              <span>Saved successfully!</span>
            </div>
          )}

          <div className="bg-white border border-black rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 col-span-1">
                <div>
                  <label htmlFor="title" className="block mb-2 text-black font-medium text-left">
                    Title
                  </label>
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
                  <label htmlFor="author" className="block mb-2 text-black font-medium text-left">
                    Author
                  </label>
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
                  <label htmlFor="publisher" className="block mb-2 text-black font-medium text-left">
                    Publisher
                  </label>
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
                  <label htmlFor="publicationDate" className="block mb-2 text-black font-medium text-left">
                    Publication Date
                  </label>
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
                  <label className="block mb-2 text-black font-medium text-left">
                    Genres
                  </label>
                  <div className={`p-2 border ${errors.genres ? 'border-red-500' : 'border-black'} rounded flex flex-wrap gap-2`}>
                    {genreOptions.map(genre => (
                      <button
                        key={genre.value}
                        type="button"
                        onClick={() => handleGenreToggle(genre.value)}
                        className={`px-3 py-1 text-sm rounded ${
                          formData.genres.includes(genre.value) 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {genre.label}
                      </button>
                    ))}
                  </div>
                  {errors.genres && <div className="text-red-500 text-sm mt-1">{errors.genres}</div>}
                </div>

                <div>
                  <label htmlFor="description" className="block mb-2 text-black font-medium text-left">
                    Description
                  </label>
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

              <div className="space-y-6 col-span-1">
                <div>
                  <label htmlFor="image" className="block mb-2 text-black font-medium text-left">
                    Image
                  </label>
                  <div className={`border ${errors.image ? 'border-red-500' : 'border-black'} rounded p-2 h-40 flex items-center justify-center`}>
                    {formData.imageUrl ? (
                        <div className="text-center">
                          <img 
                            src={formData.imageUrl} 
                            alt="Book cover" 
                            className="max-h-32 max-w-full"
                          />
                          <div className="mt-1">
                            <button 
                              onClick={() => setFormData(prev => ({ ...prev, image: null, imageUrl: null }))}
                              className="text-xs text-black hover:underline"
                              type="button"
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      ) : (
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                        <Plus size={24} color="black"/>
                        <span className="mt-2 text-black">Upload Image</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                </div>
                
                <div>
                  <label htmlFor="isbn" className="block mb-2 text-black font-medium text-left">
                    ISBN
                  </label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className={`w-full border ${errors.isbn ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.isbn && <div className="text-red-500 text-sm mt-1">{errors.isbn}</div>}
                </div>

                <div>
                  <label htmlFor="format" className="block mb-2 text-black font-medium text-left">
                    Format
                  </label>
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
                    <label htmlFor="stock" className="block mb-2 text-black font-medium text-left">
                      Stock
                    </label>
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
                    <label htmlFor="price" className="block mb-2 text-black font-medium text-left">
                      Price
                    </label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="onSale" className="block mb-2 text-black font-medium text-left">
                      On Sale
                    </label>
                    <select
                      id="onSale"
                      name="onSale"
                      value={formData.onSale ? "true" : "false"}
                      onChange={(e) => {
                        setFormData(prevState => ({
                          ...prevState,
                          onSale: e.target.value === "true"
                        }));
                      }}
                      className="w-full border border-black rounded p-2 text-black"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="discount" className="block mb-2 text-black font-medium text-left">
                      Discount
                    </label>
                    <select
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      className="w-full border border-black rounded p-2 text-black"
                      disabled={!formData.onSale}
                    >
                      <option value="10%">10%</option>
                      <option value="20%">20%</option>
                      <option value="30%">30%</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}