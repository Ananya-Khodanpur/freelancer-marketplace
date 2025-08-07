import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        if (currentUser.role === "freelancer") {
          const gigsRes = await axios.get(`/api/gigs/seller/${currentUser.id}`);
          const ordersRes = await axios.get(`/api/orders/seller/${currentUser.id}`);
          setGigs(gigsRes.data);
          setOrders(ordersRes.data);
          setEarnings(ordersRes.data.reduce((sum, o) => sum + (o.price || 0), 0));
        } else {
          const ordersRes = await axios.get(`/api/orders/buyer/${currentUser.id}`);
          setOrders(ordersRes.data);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
    fetchData();
  }, [currentUser, location]);

  if (!currentUser)
    return <div className="text-center mt-10 text-lg text-gray-500">Loading user data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, {currentUser.username}</h1>
        <p className="text-gray-600 mt-1">
          Role: <strong>{currentUser.role}</strong> — Email: {currentUser.email}
        </p>
      </div>

      {/* FREELANCER DASHBOARD */}
      {currentUser.role === "freelancer" && (
        <>
          {/* My Gigs */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🛠 My Gigs</h2>
              <Link
                to="/create-gig"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                + Create New Gig
              </Link>
            </div>

            {gigs.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg border p-4 flex flex-col justify-between"
                  >
                    {gig.images?.[0] && (
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-full h-40 object-cover rounded mb-4"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{gig.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{gig.desc}</p>
                      <p className="text-green-600 font-semibold mb-3">
                        ₹{(gig.price / 100).toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/gigs/${gig._id}`}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven’t created any gigs yet.</p>
            )}
          </section>

          {/* Orders */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">📦 Orders Received</h2>
            {orders.length ? (
              <div className="overflow-x-auto rounded border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 border-b text-gray-700">
                    <tr>
                      <th className="p-3 text-left">Order ID</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 border-t">
                        <td className="p-3">{order._id}</td>
                        <td className="p-3">₹{(order.price / 100).toFixed(2)}</td>
                        <td className="p-3">
                          {order.isCompleted ? (
                            <span className="text-green-600 font-medium">✅ Completed</span>
                          ) : (
                            <span className="text-yellow-600 font-medium">⏳ Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No orders yet.</p>
            )}
          </section>

          {/* Earnings */}
          <section className="bg-green-50 p-6 rounded shadow border flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-1">💰 Total Earnings</h3>
              <p className="text-3xl font-bold text-green-800">
                ₹{(earnings / 100).toFixed(2)}
              </p>
            </div>
          </section>
        </>
      )}

      {/* CLIENT DASHBOARD */}
      {currentUser.role === "client" && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">🛍 My Purchases</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((o) => (
                <div
                  key={o._id}
                  className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold mb-1">
                    {o.gigId?.title || "Deleted Gig"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{o.gigId?.desc}</p>
                  <p className="text-green-600 font-semibold">
                    ₹{(o.price / 100).toFixed(2)}
                  </p>
                  <p className="mt-1">
                    Status:{" "}
                    {o.isCompleted ? (
                      <span className="text-green-600 font-medium">✅ Completed</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">⏳ Pending</span>
                    )}
                  </p>
                  <Link
                    to={`/gigs/${o.gigId?._id}`}
                    className="text-blue-600 hover:underline mt-2 inline-block text-sm"
                  >
                    View Gig →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
