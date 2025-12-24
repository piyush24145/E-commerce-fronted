import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../../../environment";
import { useDispatch } from "react-redux";
import { setCartCount, setCartItems } from "../../../state/cartSlice";
import axios from "axios";

export default function PaymentReturn() {
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
   const sessionId = localStorage.getItem("stripe_session_id");

    if (!sessionId) return setStatus("failed");

    const token = localStorage.getItem("token");

    axios
      .get(`${baseUrl}/payment/session-status?session_id=${sessionId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
   .then((res) => { const { status, customer_email } = res.data; setStatus(status); setEmail(customer_email); if (status === "paid") { dispatch(setCartItems([])); dispatch(setCartCount(0)); } })
      .catch((err) => {
        console.error("❌ Error fetching session status:", err);
        setStatus("failed");
      });
  }, [dispatch]);

  if (status === "open") return <Navigate to="/checkout" />;
  if (status === "failed")
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-red-600 text-xl font-semibold">❌ Payment Failed</h2>
        <a href="/cart" className="text-blue-600 underline">Try Again</a>
      </div>
    );

  if (status === "paid")
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-green-600 text-xl font-semibold">✅ Payment Successful</h2>
        <p>Order Placed. Thank you!</p>
        <p>Email sent to <strong>{email}</strong></p>
        <a href="/orders" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">View Orders</a>
      </div>
    );

  return <div className="h-screen flex items-center justify-center text-lg font-medium">Verifying your payment...</div>;
}
