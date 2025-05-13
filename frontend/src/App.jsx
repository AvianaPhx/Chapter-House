import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Auth/UserLogin'
import Register from './Auth/UserRegister'
import HomePage from './Main/HomePage';
import BookDetail from './Main/BookDetail';
import Cart from './Main/Cart';
import Bookmark from './Main/Bookmark';
import AdminPage from './Admin/AdminPage';
import BookManagementPage from './Admin/ManageDiscount';
import Announcement from './Admin/Announcement';
import OrderHistory from './Main/OrderHistory';
import LandingPage from './LandingPage';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bookmarks" element={<Bookmark />} />
        <Route path="/orderhistory" element={<OrderHistory />} />


        <Route path="/admin" element={<AdminPage />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/discount" element={<BookManagementPage />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
