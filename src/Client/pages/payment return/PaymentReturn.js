import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import { useDispatch } from "react-redux";
import { setCartItems, setCartCount } from "../../../state/cartSlice";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function PaymentReturn() {
  const [status, setStatus] = useState("loading");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    const token = localStorage.getItem("token");

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/payment/session-status?session_id=${sessionId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const { status, customer_email } = res.data;
        setStatus(status);
        setEmail(customer_email || "");

        if (status === "paid") {
          dispatch(setCartItems([]));
          dispatch(setCartCount(0));
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [dispatch, location.search]);

  if (status === "loading") return <div className="h-screen flex items-center justify-center">Verifying payment...</div>;

  if (status === "failed") return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-red-600 text-xl font-semibold">❌ Payment Failed</h2>
      <a href="/cart" className="text-blue-600 underline">Try Again</a>
    </div>
  );

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-green-600 text-xl font-semibold">✅ Payment Successful</h2>
      <p>Order placed successfully. Thank you!</p>
      {email && <p>Confirmation sent to <strong>{email}</strong></p>}
      <a href="/orders" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">View Orders</a>
    </div>
  );
}
