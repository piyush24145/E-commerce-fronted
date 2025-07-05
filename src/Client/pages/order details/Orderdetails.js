import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../environment";

export default function OrderDetails() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setOrderDetails(res.data.order))
      .catch((err) => console.error("❌ Failed to fetch order details", err));
  }, [id]);

  if (!orderDetails) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg font-medium">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 transition-all">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10 tracking-wide">
          🧾 Order Summary
        </h2>

        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-medium text-gray-700 mb-1">📅 Order Date:</p>
            <p className="text-gray-900">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-medium text-gray-700 mb-1">💳 Payment ID:</p>
            <p className="text-gray-900 break-words">{orderDetails.paymentId}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-medium text-gray-700 mb-1">💰 Total Amount:</p>
            <p className="text-green-600 font-semibold">₹{orderDetails.totalAmount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-medium text-gray-700 mb-1">🔐 Payment Status:</p>
            <p className="text-gray-900">{orderDetails.paymentStatus}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border col-span-1 md:col-span-2">
            <p className="font-medium text-gray-700 mb-1">🚚 Order Status:</p>
            <p className="text-blue-700">{orderDetails.orderStatus}</p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">🛒 Items in Your Order</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {orderDetails.products.map((item, index) => {
            const product = item.product;
            const imageUrl =
              product?.images?.length > 0
                ? `${baseUrl}/uploads/${product.images[0]}`
                : "https://placehold.co/300x300?text=No+Image";

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border p-4 flex gap-4 items-start transform transition duration-200 hover:scale-105"
              >
                <img
                  src={imageUrl}
                  alt={product?.title || "Product"}
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
                <div className="flex flex-col justify-between">
                  <h4 className="font-semibold text-lg text-gray-800">{product?.title}</h4>
                  <p className="text-gray-600 text-sm">Price: ₹{product?.price}</p>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <p className="font-semibold text-indigo-600 mt-2">
                    Subtotal: ₹{item.quantity * product?.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
