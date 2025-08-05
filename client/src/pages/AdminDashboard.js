import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, gigsRes, reviewsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users"),
        axios.get("http://localhost:5000/api/admin/gigs"),
        axios.get("http://localhost:5000/api/admin/reviews"),
      ]);
      setUsers(usersRes.data);
      setGigs(gigsRes.data);
      setReviews(reviewsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">🛠 Admin Panel</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">👤 Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => (
            <div key={user._id} className="border p-4 rounded shadow bg-white">
              <p className="font-bold">{user.username}</p>
              <p>Role: {user.role}</p>
              <p>Email: {user.email}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🎨 Gigs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gigs.map(gig => (
            <div key={gig._id} className="border p-4 rounded shadow bg-white">
              <p className="font-bold">{gig.title}</p>
              <p>Price: ₹{gig.price}</p>
              <p>Category: {gig.category}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">⭐ Reviews</h2>
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review._id} className="border p-4 rounded bg-white">
              <p className="font-semibold">Gig ID: {review.gigId}</p>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
