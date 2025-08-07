import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gigs");
      setGigs(res.data);
    } catch (err) {
      console.error("Failed to fetch gigs", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/gigs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Gig deleted!");
      setGigs((prev) => prev.filter((gig) => gig._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete gig");
    }
  };

  const filteredGigs = gigs.filter((gig) => {
    return (
      gig.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (category === "" || gig.category === category)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Explore Freelance Gigs</h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search gigs by title..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All Categories</option>
            <option value="web">Web</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
          </select>
        </div>

        {filteredGigs.length === 0 ? (
          <p className="text-center text-gray-600">No gigs found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <li key={gig._id}>
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-5 h-full flex flex-col justify-between">
                  <div>
                    <Link to={`/gigs/${gig._id}`}>
                      <h3 className="text-xl font-semibold text-blue-700 mb-2 hover:underline">
                        {gig.title}
                      </h3>
                      <p className="text-gray-700 mb-2 line-clamp-3">{gig.desc}</p>
                      <p className="text-sm text-purple-500 font-medium mb-1 capitalize">
                        {gig.category}
                      </p>
                      <p className="text-lg font-bold text-green-600">₹{gig.price}</p>
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="text-sm text-red-600 hover:text-red-800 mt-4 font-medium underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GigList;
