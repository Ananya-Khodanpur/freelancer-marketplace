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
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold text-blue-600 hover:text-blue-700 transition"
          >
            TalentSync
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/gigs" className="text-gray-700 hover:text-blue-600 font-medium">
              Gigs
            </Link>

            {currentUser?.role === "freelancer" && (
              <Link to="/create-gig" className="text-gray-700 hover:text-blue-600 font-medium">
                Create Gig
              </Link>
            )}

            {currentUser && (
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
            )}

            {!currentUser ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-gray-50 rounded shadow py-4 px-2 space-y-2">
            <Link to="/gigs" className="block text-gray-700 hover:text-blue-600 font-medium">
              Gigs
            </Link>

            {currentUser?.role === "freelancer" && (
              <Link to="/create-gig" className="block text-gray-700 hover:text-blue-600 font-medium">
                Create Gig
              </Link>
            )}

            {currentUser && (
              <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
            )}

            {!currentUser ? (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 text-white px-4 py-2 rounded text-center hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
