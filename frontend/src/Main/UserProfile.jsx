import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit, LogOut, User } from "lucide-react";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  const [userInfo, setUserInfo] = useState({
    name: "", 
    email: "",
    dateJoined: "",
    profileImage: "/api/placeholder/150/150",
  });

  const [editFormData, setEditFormData] = useState({ ...userInfo });

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {

      const userId = JSON.parse(atob(token.split('.')[1])).id; 

      const response = await fetch(`https://localhost:7227/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      setUserInfo({
        name: data.userName,
        email: data.email,
        dateJoined: new Date().toLocaleDateString(), 
        profileImage: data.profileImage || "/api/placeholder/150/150", 
      });

      setEditFormData({
        name: data.userName, 
        email: data.email,
      });
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); 
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserInfo(editFormData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("Role");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link to="/home" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Store</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <img
                  src={userInfo.profileImage}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-4 border-gray-200"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{userInfo.name}</h1>
                <p className="text-gray-600">Member since {userInfo.dateJoined}</p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 md:ml-auto flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-64 border-r border-gray-200">
              <nav className="p-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center w-full text-left px-4 py-3 rounded-md mb-1 ${
                    activeTab === "profile" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>Profile Information</span>
                </button>

                <hr className="my-4 border-gray-200" />

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* Profile Content */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex space-x-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Save Changes
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditFormData({ ...userInfo });
                            setIsEditing(false);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium">{userInfo.name}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium">{userInfo.email}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-medium">{userInfo.dateJoined}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
