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
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
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
        "http://localhost:5000/payment/create-checkout-session",
        {
          gigId: gig._id,
          sellerId: gig.createdBy,
          price: gig.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = res.data.sessionUrl; // redirect to Stripe checkout
    } catch (err) {
      alert("Payment initiation failed.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/reviews`,
        {
          gigId: gig._id,
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
      setComment("");
      setRating(5);
      alert("Review submitted!");
      const res = await axios.get(`http://localhost:5000/api/reviews/gig/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Review submission failed.");
    }
  };

  if (!gig) return <p>Loading...</p>;


  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <div className="border rounded-lg shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">{gig.title}</h2>
        <p className="mb-2 text-gray-700">{gig.desc}</p>
        <p className="text-sm text-gray-500 mb-4">Category: {gig.category}</p>
        <p className="text-xl text-green-600 font-semibold mb-6">
          Price: ₹{(gig.price / 100).toFixed(2)}
        </p>
        <button
          onClick={handlePurchase}
          disabled={loadingPayment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          {loadingPayment ? "Redirecting..." : "Purchase"}
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-bold mb-4">⭐ Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {reviews.map((rev) => (
              <li key={rev._id} className="bg-gray-100 p-4 rounded">
                <p className="text-yellow-600 font-bold">Rating: {rev.rating} / 5</p>
                <p className="text-gray-800">{rev.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {user && (
          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold">Leave a review</h4>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full"
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
              className="border p-2 w-full rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GigDetail;
