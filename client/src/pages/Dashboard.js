import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        if (currentUser.role === "freelancer") {
          const gigsRes = await axios.get(
            `/api/gigs/seller/${currentUser.id}`
          );
          const ordersRes = await axios.get(
            `/api/orders/seller/${currentUser.id}`
          );
          setGigs(gigsRes.data);
          setOrders(ordersRes.data);
          setEarnings(ordersRes.data.reduce((sum, o) => sum + (o.price || 0), 0));
        } else {
          const ordersRes = await axios.get(
            `/api/orders/buyer/${currentUser.id}`
          );
          setOrders(ordersRes.data);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchData();
  }, [currentUser]);

  if (!currentUser) 
    return <div className="text-center mt-10">Loading user data...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold">Welcome, {currentUser.username}</h1>
        <p className="text-gray-600 mt-1">
          Role: <strong>{currentUser.role}</strong> — Email: {currentUser.email}
        </p>
      </header>

      {currentUser.role === "freelancer" && (
        <>
          <section>
            <h2 className="text-2xl font-semibold mb-4">🛠 My Gigs</h2>
            {gigs.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="border rounded shadow p-4 hover:shadow-lg transition"
                  >
                    {gig.images?.[0] && (
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    )}
                    <h3 className="text-lg font-bold">{gig.title}</h3>
                    <p className="text-gray-600 text-sm truncate">{gig.desc}</p>
                    <p className="text-green-600 font-semibold mb-2">
                      ₹{(gig.price / 100).toFixed(2)}
                    </p>
                    <Link
                      to={`/gigs/${gig._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven’t created any gigs yet.</p>
            )}
          </section>


          {currentUser.role === "client" && (
  <>
    <section>
      <h2 className="text-2xl font-semibold mb-4">🛍 My Purchases</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <div key={o._id} className="border rounded p-4 shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold">{o.gigId?.title || "Deleted Gig"}</h3>
              <p className="text-gray-600 mb-1 text-sm truncate">{o.gigId?.desc}</p>
              <p className="text-green-600 font-semibold mb-2">
                ₹{(o.price / 100).toFixed(2)}
              </p>
              <p>
                Status:{" "}
                {o.isCompleted ? (
                  <span className="text-green-600">✅ Completed</span>
                ) : (
                  <span className="text-yellow-600">⏳ Pending</span>
                )}
              </p>
              <Link
                to={`/gigs/${o.gigId?._id}`}
                className="text-blue-600 hover:underline mt-2 block"
              >
                View Gig
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  </>
)}

          <section>
            <h2 className="text-2xl font-semibold mb-4">📦 Orders Received</h2>
            {orders.length ? (
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-2">Order ID</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 border-t"
                      >
                        <td className="p-2">{order._id}</td>
                        <td className="p-2">
                          ₹{(order.price / 100).toFixed(2)}
                        </td>
                        <td className="p-2">
                          {order.isCompleted ? (
                            <span className="text-green-600">✅ Completed</span>
                          ) : (
                            <span className="text-yellow-600">⏳ Pending</span>
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

          <section className="bg-blue-50 p-6 rounded shadow flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">💰 Total Earnings</h3>
              <p className="text-3xl font-bold text-green-600">
                ₹{(earnings / 100).toFixed(2)}
              </p>
            </div>
            <Link
              to="/create-gig"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create New Gig
            </Link>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
