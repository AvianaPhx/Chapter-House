import React from 'react';
import { Home, BookOpen, Info, ShoppingCart, ClipboardList, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - now wrapped with Link */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold text-indigo-600">ChapterHouse</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <NavItem icon={<Home className="w-5 h-5" />} label="Home" to="/" />
            <NavItem icon={<BookOpen className="w-5 h-5" />} label="Books" to="/allproduct" />
            <NavItem icon={<Bookmark className="w-5 h-5" />} label="Bookmark" to="/signin" />
            <NavItem icon={<ShoppingCart className="w-5 h-5" />} label="Cart" to="/signin" />
            <NavItem icon={<ClipboardList className="w-5 h-5" />} label="Orders" to="/signin" />
          </div>

          {/* Mobile Nav (Optional: hamburger menu) */}
          <div className="md:hidden">
            {/* You can add a mobile menu toggle here if needed */}
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}