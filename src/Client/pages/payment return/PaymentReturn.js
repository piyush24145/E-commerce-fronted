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
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

      {status === "loading" && (
        <>
          <div className="animate-spin h-10 w-10 mx-auto mb-4 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <h1 className="text-lg font-semibold text-gray-700">
            Processing your payment
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Please do not refresh the page
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="h-14 w-14 mx-auto flex items-center justify-center rounded-full bg-green-100 mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>

          <h1 className="text-xl font-semibold text-gray-800">
            Order placed successfully
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for your purchase. Your order is being processed.
          </p>

          <a
            href="/orders"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            View Orders
          </a>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="h-14 w-14 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>

          <h1 className="text-xl font-semibold text-gray-800">
            Payment failed
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Something went wrong while processing your payment.
          </p>

          <a
            href="/cart"
            className="inline-block mt-6 text-blue-600 hover:underline text-sm font-medium"
          >
            Go back to cart
          </a>
        </>
      )}
    </div>
  </div>
);


export default PaymentReturn;

