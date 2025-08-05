import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">TalentSync</Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/gigs" className="text-gray-700 hover:text-blue-600">Gigs</Link>
            {currentUser?.role === "freelancer" && (
              <Link to="/create-gig" className="text-gray-700 hover:text-blue-600">Create Gig</Link>
            )}
            {currentUser && (
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            )}
            {!currentUser ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden space-y-2 pb-4 border-t pt-4">
            <Link to="/gigs" className="block text-gray-700 hover:text-blue-600">Gigs</Link>
            {currentUser?.role === "freelancer" && (
              <Link to="/create-gig" className="block text-gray-700 hover:text-blue-600">Create Gig</Link>
            )}
            {currentUser && (
              <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
            )}
            {!currentUser ? (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="block text-gray-700 hover:text-blue-600">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="block text-red-500 hover:underline">Logout</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
