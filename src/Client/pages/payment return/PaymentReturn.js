import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";

const PaymentReturn = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (!sessionId) {
      setStatus("failed");
      return;
    }

    verifyPayment(sessionId);
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/payment/verify?session_id=${sessionId}`
      );

      if (res.data?.success) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (err) {
      console.error("Payment verify error:", err);
      setStatus("failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      {status === "loading" && <h1>⏳ Processing payment...</h1>}

      {status === "success" && (
        <div className="text-center space-y-4">
          <h1 className="text-green-600 font-semibold">
            ✅ Order placed successfully
          </h1>
          <a href="/orders" className="bg-blue-600 text-white px-6 py-2 rounded">
            View Orders
          </a>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center space-y-4">
          <h1 className="text-red-600 font-semibold">
            ❌ Payment failed
          </h1>
          <a href="/cart" className="text-blue-600 underline">
            Go back to cart
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentReturn;

