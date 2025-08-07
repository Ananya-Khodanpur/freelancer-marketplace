import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gigs");
        setGigs(res.data.slice(0, 6)); // Only show 6 gigs
      } catch (err) {
        console.error("Failed to fetch gigs", err);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Colorful Background */}
      <div
        className="relative bg-cover bg-center bg-no-repeat h-[550px] flex items-center justify-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1650&q=80")`, // colorful background
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-700/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight animate-fade-in-down drop-shadow-lg">
            Find the Perfect Freelancer for Your Project
          </h1>
          <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto drop-shadow">
            Connect with top-notch professionals ready to bring your vision to life.
          </p>
          <Link
            to="/gigs"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-blue-50 transition"
          >
            Browse All Gigs
          </Link>
        </div>
      </div>

      {/* Gigs Preview */}
      <div className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          🔥 Featured Gigs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <Link
              to={`/gigs/${gig._id}`}
              key={gig._id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition duration-300"
            >
              <img
                src={gig.coverImage || "https://via.placeholder.com/400x250"}
                alt={gig.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate">{gig.title}</h3>
                <p className="text-sm text-gray-500">By {gig.sellerUsername || "Seller"}</p>
                <p className="mt-2 text-blue-600 font-semibold text-md">₹{gig.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 mb-24 bg-white p-10 max-w-4xl mx-auto rounded-xl shadow-xl">
        <p className="text-xl text-gray-700 font-medium mb-4">
          Ready to showcase your skills and earn?
        </p>
        <Link
          to="/create-gig"
          className="bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition"
        >
          Create a Gig
        </Link>
      </div>
    </div>
  );
};

export default Home;
