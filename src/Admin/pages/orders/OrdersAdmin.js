import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/orders/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("❌ Failed to fetch admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="text-center py-6 text-indigo-500 animate-pulse">
        Loading orders...
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-gradient-to-br from-white via-gray-100 to-indigo-100 min-h-screen"
    >
      <h2 className="text-4xl font-bold text-center text-indigo-800 mb-10">
        📦 Admin Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white text-sm">
              <tr>
                <th className="px-4 py-3 text-left">📅 Order Date</th>
                <th className="px-4 py-3 text-left">💳 Payment ID</th>
                <th className="px-4 py-3 text-left">💰 Total</th>
                <th className="px-4 py-3 text-left">💵 Payment</th>
                <th className="px-4 py-3 text-left">📦 Status</th>
                <th className="px-4 py-3 text-left">🔍 Action</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm divide-y divide-gray-200">
              {orders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="hover:bg-indigo-50"
                >
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 truncate max-w-[200px]">
                    {order.paymentId}
                  </td>
                  <td className="px-4 py-3">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">{order.paymentStatus}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/order-details/${order._id}`}>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-full transition">
                        View Details
                      </button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
