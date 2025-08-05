import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gigs");
        setGigs(res.data.slice(0, 6)); // show only first 6 gigs on homepage
      } catch (err) {
        console.error("Failed to fetch gigs", err);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find the Perfect Freelancer for Your Project
        </h1>
        <p className="text-gray-500 mb-6">
          Connect with talented professionals to bring your ideas to life.
        </p>
        <Link
          to="/gigs"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Browse All Gigs
        </Link>
      </div>

      {/* Gigs Preview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Featured Gigs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <Link
              to={`/gigs/${gig._id}`}
              key={gig._id}
              className="bg-white border rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={gig.coverImage || "https://via.placeholder.com/300x200"}
                alt={gig.title}
                className="w-full h-44 object-cover rounded-t"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {gig.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  By {gig.sellerUsername || "Seller"}
                </p>
                <p className="text-blue-600 font-bold text-md">
                  ₹{(gig.price / 100).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-20">
        <p className="text-gray-600 text-lg mb-4">
          Ready to offer your skills?
        </p>
        <Link
          to="/create-gig"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Create a Gig
        </Link>
      </div>
    </div>
  );
};

export default Home;
