import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateGig from "./pages/CreateGig"; // adjust path if needed
import GigList from "./pages/GigList"; 
import GigDetail from "./pages/GigDetail"; // adjust path if needed
import Home from "./pages/Home"; // adjust path if needed
import Login from "./pages/Login";
import Register from "./pages/Register"; // adjust path if needed
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Chat from "./pages/Chat"; // adjust path if needed
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Dashboard from "./pages/Dashboard"; // adjust path if needed
import Navbar from "./components/Navbar";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
     const { currentUser } = useContext(AuthContext);
     const user = JSON.parse(localStorage.getItem("user"));
  return (
     <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gigs" element={<GigList />} />
              <Route
                path="/gigs/:id"
                element={<GigDetail currentUser={currentUser} />}
              />
              <Route path="/orders" element={currentUser ? <Orders /> : <Navigate to="/login" />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/chat"
                element={
                  currentUser ? <Chat currentUser={currentUser} /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/create-gig"
                element={
                  currentUser?.role === "freelancer"
                    ? <CreateGig />
                    : <Navigate to="/" />
                }
              />
              <Route
                path="/login"
                element={!currentUser ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/register"
                element={!currentUser ? <Register /> : <Navigate to="/dashboard" />}
              />
              <Route path="/admin" element={currentUser?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-gray-100 text-center py-4 text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} GigMarketplace. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;