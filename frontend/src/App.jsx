import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute'; 
import PublicRoute from './Auth/PublicRoute'; 
import './App.css';
import Login from './Auth/UserLogin';
import Register from './Auth/UserRegister';
import ProductPage from './Main/ProductPage';
import BookDetail from './Main/BookDetail';
import Cart from './Main/Cart';
import Bookmark from './Main/Bookmark';
import AdminPage from './Admin/AdminPage';
import Announcement from './Admin/Announcement';
import OrderHistory from './Main/OrderHistory';
import LandingPage from './User/LandingAllProduct';
import UserProfile from './Main/UserProfile';
import OrderManagement from './Admin/OrderManagement';
import UserBook from "./UserBookDetail";
import LandingPageHome from "./User/LandingPageHome";
import HomePage from './Main/HomePage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/allproduct" element={<LandingPage />} />
          <Route path="/" element={<LandingPageHome />} />
          <Route path="/userbook/:id" element={<UserBook />} />
        </Route>

        <Route element={<PublicRoute restricted />}>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Route>

        {/* Protected user routes */}
        <Route element={<ProtectedRoute allowedRoles={['Member']} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bookmarks" element={<Bookmark />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/announcement" element={<Announcement />} />

        </Route>

        {/* Protected staff routes */}
        <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
          <Route path="/staff" element={<OrderManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
