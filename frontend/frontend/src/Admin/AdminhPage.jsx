import { useState } from 'react';
import { User } from 'lucide-react';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    console.log('Submitting book data:', formData);
    // Here you would typically send the data to an API
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
          <button className="w-full bg-emerald-600 text-black py-3 px-4 text-left rounded font-medium">
            Add New Book
          </button>
          
          <button className="w-full text-gray-700 py-3 px-4 text-left hover:bg-gray-100 rounded">
            Create Announcement
          </button>
          
          <button className="w-full text-gray-700 py-3 px-4 text-left hover:bg-gray-100 rounded">
            Manage Discount
          </button>
          
          <button className="w-full text-gray-700 py-3 px-4 text-left hover:bg-gray-100 rounded">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content - Flexible width, full height with scrolling */}
      <div className="flex-1 overflow-y-auto pl-0 pr-30 py-8">
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

          <div className="bg-white  border border-black rounded-lg p-6 shadow-sm">
            <div className="space-y-6">
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
                  className="w-full border border-black rounded p-2 focus:ring-2"
                />
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
                  className="w-full border border-black rounded p-2 focus:ring-2"
                />
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
                  className="w-full border border-black rounded p-2 focus:ring-2"
                />
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
                  className="w-full border border-black rounded p-2 focus:ring-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}