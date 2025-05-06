import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Auth/UserLogin'
import Register from './Auth/UserRegister'
import HomePage from './Main/HomePage';
import BookDetail from './Main/BookDetail';
import Cart from './Main/Cart';
import Bookmark from './Main/Bookmark';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/book" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bookmarks" element={<Bookmark />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
