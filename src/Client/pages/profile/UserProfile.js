import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.user);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading profile...</p>;
  if (!user) return <p className="text-center text-red-500 mt-8">User not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Your Profile</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded shadow mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
        <p className="mb-2"><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="bg-white border border-gray-100 p-5 rounded shadow-sm">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
                <p><strong>Items:</strong> {order.products.length}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
