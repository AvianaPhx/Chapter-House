import { useState } from 'react';
import { Mail, Lock, Github } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Replace with your actual authentication logic
      console.log('Login attempt with:', { email, password });
      
      // Simulate API call
      const response = await axios.post("https://localhost:7227/api/Auth/signin", {email, password} )
      
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      if (response.data && response.data.isSuccess) {
        navigate("/"); 

      } else {
        setError("Credentials Milena");
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 shadow-sm">
        <div className="container px-4">
          <h1 className="text-center text-xl font-medium">ChapterHouse</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Sign In</h2>
            <p className="text-gray-600">Welcome back to ChapterHouse!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex justify-end mb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-green-600">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-gray-600 hover:text-green-600">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}