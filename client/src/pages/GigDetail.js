import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const GigDetail = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs/${id}`);
        setGig(res.data);
      } catch (err) {
        console.error("Failed to load gig", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/gig/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };

    fetchGig();
    fetchReviews();
  }, [id]);

  const handlePurchase = async () => {
    if (!token || !user) return navigate("/login");
    setLoadingPayment(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          gigId: gig._id,
          sellerId: gig.createdBy,
          buyerId: user._id,
          price: gig.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      window.location.href = res.data.sessionUrl;
    } catch (err) {
      alert("Payment initiation failed.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!token || !user) {
      alert("You need to be logged in to leave a review.");
      return navigate("/login");
    }

    try {
      await axios.post(
        `http://localhost:5000/api/reviews`,
        {
          gigId: id,
          userId: user._id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted!");
      setComment("");
      setRating(5);

      const res = await axios.get(`http://localhost:5000/api/reviews/gig/${id}`);
      setReviews(res.data);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes("duplicate")) {
        alert("You've already submitted a review for this gig.");
      } else {
        alert("Failed to submit review.");
      }
      console.error("Review error:", err.response?.data || err.message);
    }
  };

  if (!gig) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-10">
      {/* Gig Info */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-2">{gig.title}</h2>
        <p className="text-md mb-4">{gig.desc}</p>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <span className="bg-white text-gray-800 px-4 py-1 rounded-full text-sm shadow">
            Category: {gig.category}
          </span>
          <span className="text-2xl font-semibold">
            ₹{(gig.price).toFixed(2)}
          </span>
        </div>
        <button
          onClick={handlePurchase}
          disabled={loadingPayment}
          className="mt-6 bg-white text-indigo-700 font-semibold px-6 py-2 rounded-md shadow hover:bg-gray-100 transition"
        >
          {loadingPayment ? "Redirecting..." : "Purchase Now"}
        </button>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4">⭐ Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {reviews.map((rev) => (
              <li key={rev._id} className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="font-medium text-yellow-600">Rating: {rev.rating} / 5</p>
                <p className="text-gray-800">{rev.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Submit Review */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-6">
            <h4 className="text-lg font-semibold">Leave a Review</h4>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded w-full"
            >
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>
                  {val} Star{val > 1 && "s"}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className={`w-full px-4 py-2 rounded text-white font-semibold ${
                comment.trim()
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-red-600 mt-4">Login to submit a review.</p>
        )}
      </div>
    </div>
  );
};

export default GigDetail;
