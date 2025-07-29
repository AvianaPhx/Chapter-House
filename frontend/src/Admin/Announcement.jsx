import { useState } from 'react';
import { User, Calendar, Clock, Globe, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Announcement() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    visibility: 'all',
    imageUrl: null,
    image: null
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();
  const activeButton = location.pathname === '/admin' ? 'add-book' : 
                     location.pathname === '/announcement' ? 'announcement' : 
                     'add-book';
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    const requiredFields = ['title', 'content', 'startDate', 'endDate'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      console.log('Submitting announcement data:', formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
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

      <div className="flex-1 overflow-y-auto pl-0 pr-8 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl text-black font-bold">Create Announcement</h1>
            <button 
              onClick={handleSubmit}
              className="bg-emerald-600 text-white py-2 px-6 rounded hover:bg-emerald-700"
            >
              Publish
            </button>
          </div>

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
              <Check size={20} className="mr-2" />
              <span>Announcement published successfully!</span>
            </div>
          )}

          <div className="bg-white border border-black rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block mb-2 text-black font-medium text-left">
                  Announcement Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full border ${errors.title ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  placeholder="Enter the announcement title"
                />
                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
              </div>

              <div>
                <label htmlFor="content" className="block mb-2 text-black font-medium text-left">
                  Announcement Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  className={`w-full border ${errors.content ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  placeholder="Write your announcement content here..."
                />
                {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <Calendar className="mr-2" size={16} />
                      Start Date
                    </div>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full border ${errors.startDate ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.startDate && <div className="text-red-500 text-sm mt-1">{errors.startDate}</div>}
                </div>

                <div>
                  <label htmlFor="endDate" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <Calendar className="mr-2" size={16} />
                      End Date
                    </div>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full border ${errors.endDate ? 'border-red-500' : 'border-black'} rounded p-2 text-black`}
                  />
                  {errors.endDate && <div className="text-red-500 text-sm mt-1">{errors.endDate}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="visibility" className="block mb-2 text-black font-medium text-left">
                    <div className="flex items-center">
                      <Globe className="mr-2" size={16} />
                      Visibility
                    </div>
                  </label>
                  <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className="w-full border border-black rounded p-2 text-black"
                  >
                    <option value="all">All Users</option>
                    <option value="registered">Registered Users Only</option>
                    <option value="premium">Premium Members Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block mb-2 text-black font-medium text-left">
                  Announcement Image (Optional)
                </label>
                <div className="border border-black rounded p-2 h-40 flex items-center justify-center">
                  {formData.imageUrl ? (
                    <div className="text-center">
                      <img 
                        src={formData.imageUrl} 
                        alt="Announcement" 
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
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock size={24} color="black"/>
                      </div>
                      <span className="mt-2 text-black">Upload Image (Optional)</span>
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
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Preview</h3>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg">{formData.title || 'Announcement Title'}</h4>
                    <span className="text-sm text-gray-500">
                      {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Start Date'} - 
                      {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'End Date'}
                    </span>
                  </div>
                  {formData.imageUrl && (
                    <div className="my-2 flex justify-center">
                      <img 
                        src={formData.imageUrl} 
                        alt="Announcement" 
                        className="max-h-32" 
                      />
                    </div>
                  )}
                  <p className="mt-2 text-gray-700">
                    {formData.content || 'Your announcement content will appear here...'}
                  </p>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>
                      Visibility: {formData.visibility === 'all' 
                        ? 'All Users' 
                        : formData.visibility === 'registered' 
                          ? 'Registered Users Only' 
                          : 'Premium Members Only'}
                    </span>
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