import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error("JWT parsing failed", e);
      return null;
    }
  };

  const updateUserFromToken = (token) => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const email = decoded.email || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/email"];
        setCurrentUser({ token, role, email });
      } else {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };

useEffect(() => {
  const token = localStorage.getItem('accessToken');
  console.log("AuthProvider initial load. Token:", token);
  
  updateUserFromToken(token);

  const handleStorageChange = (e) => {
    if (e.key === 'accessToken') {
      console.log("Storage change detected:", e.newValue);
      updateUserFromToken(e.newValue);
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);

const login = async (email, password) => {
  try {
    const response = await axios.post("https://localhost:7227/api/Auth/signin", {
      email,
      password
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });

    const { accessToken, isSuccess } = response.data;

    if (isSuccess && accessToken) {
      localStorage.setItem('accessToken', accessToken);
      const decoded = parseJwt(accessToken);
      
      // More robust role extraction
      const role = decoded.role || 
                  decoded.Role || 
                  decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                  "Member";
      
      console.log("Extracted role:", role); // Debug logging
      
      setCurrentUser({ 
        token: accessToken, 
        role: role,
        email: decoded.email || email 
      });
      
      return { success: true, role };
    }

    return { success: false, message: "Invalid credentials" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Login failed"
    };
  }
};


const logout = () => {
  localStorage.removeItem('accessToken');
  setCurrentUser(null);
  window.location.href = '/signin'; // Full page reload
};

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
