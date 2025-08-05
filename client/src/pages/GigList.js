import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gigs");
        setGigs(res.data);
      } catch (err) {
        console.error("Failed to fetch gigs", err);
      }
    };

    fetchGigs();
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    return (
      gig.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (category === "" || gig.category === category)
    );
  });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">All Gigs</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search gigs..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 p-2 rounded-md"
        />
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          className="w-full sm:w-1/2 border border-gray-300 p-2 rounded-md"
        >
          <option value="">All Categories</option>
          <option value="web">Web</option>
          <option value="design">Design</option>
          <option value="writing">Writing</option>
        </select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredGigs.map((gig) => (
          <li key={gig._id}>
            <Link
              to={`/gigs/${gig._id}`}
              className="block border rounded-lg shadow-md p-4 hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
              <p className="text-gray-700 mb-2">{gig.desc}</p>
              <p className="text-sm text-gray-500">{gig.category}</p>
              <p className="mt-2 font-bold text-green-600">₹{gig.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GigList;
