import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("❌ Failed to fetch user orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 animate-pulse text-indigo-500">
        Loading your orders...
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
          🧾 Your Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 shadow-sm rounded-lg">
              <thead className="bg-indigo-100 text-indigo-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 text-left">📅 Date</th>
                  <th className="text-left">💳 Payment ID</th>
                  <th className="text-left">💰 Amount</th>
                  <th className="text-left">🔐 Payment</th>
                  <th className="text-left">🚚 Status</th>
                  <th className="text-center">🔎 Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    className="border-t hover:bg-indigo-50 transition"
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="truncate max-w-[200px]">{order.paymentId}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.paymentStatus}</td>
                    <td className="font-semibold">{order.orderStatus}</td>
                    <td className="text-center">
                      <Link to={`/order-details/${order._id}`}>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg shadow">
                          View
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
