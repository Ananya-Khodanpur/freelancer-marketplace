import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Orders = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [review, setReview] = useState({ rating: "", comment: "" });

  useEffect(() => {
    if (!currentUser) return;
    const fetchOrders = async () => {
      const endpoint =
        currentUser.role === "client"
          ? `/api/orders/buyer/${currentUser._id}`
          : `/api/orders/seller/${currentUser._id}`;
      const res = await axios.get(endpoint);
      setOrders(res.data);
    };
    fetchOrders();
  }, [currentUser]);

  if (!currentUser) return <p>Loading user info...</p>;

  const filtered = orders.filter(o =>
    filter === "completed" ? o.isCompleted : !o.isCompleted
  );

  const handleReviewSubmit = async (gigId) => {
    try {
      await axios.post("/api/reviews", {
        gigId,
        userId: currentUser._id,
        rating: Number(review.rating),
        comment: review.comment,
      });
      alert("Review submitted!");
      setShowReviewForm(null);
      setReview({ rating: "", comment: "" });
    } catch {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl mb-4">
        {currentUser.role === "client" ? "🛒 Purchases" : "📦 Sales"}
      </h2>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setFilter("pending")} className={filter==="pending" ? "bg-blue-600 text-white px-4 py-2":"bg-gray-200 px-4 py-2"}>Pending</button>
        <button onClick={() => setFilter("completed")} className={filter==="completed" ? "bg-green-600 text-white px-4 py-2":"bg-gray-200 px-4 py-2"}>Completed</button>
      </div>
      {filtered.length === 0 ? (
        <p>No {filter} orders.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map(o => (
            <li key={o._id} className="border p-4 bg-white rounded">
              <p>Gig: {o.gigId?.title}</p>
              <p>Price: ₹{(o.price/100).toFixed(2)}</p>
              <p>Status: {o.isCompleted ? "✅ Completed" : "⏳ Pending"}</p>
              {currentUser.role === "client" && o.isCompleted && (
                <>
                  <button onClick={() => setShowReviewForm(o._id)} className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded">Leave Review</button>
                  {showReviewForm === o._id && (
                    <div className="mt-3 space-y-2">
                      <input type="number" min="1" max="5" value={review.rating}
                        onChange={e => setReview({...review, rating:e.target.value})}
                        placeholder="Rating (1-5)"
                        className="border p-2 w-full"/>
                      <textarea value={review.comment}
                        onChange={e => setReview({...review, comment:e.target.value})}
                        placeholder="Comment"
                        className="border p-2 w-full"/>
                      <button onClick={() => handleReviewSubmit(o.gigId)} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;