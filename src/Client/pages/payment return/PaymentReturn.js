import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const PaymentReturn = () => {
  const [status, setStatus] = useState("loading");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setStatus("failed");
    }
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment/verify?session_id=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (err) {
      setStatus("failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && <h1>⏳ Processing payment...</h1>}
      {status === "success" && <h1>✅ Order placed successfully</h1>}
      {status === "failed" && <h1>❌ Payment failed</h1>}
    </div>
  );
};

export default PaymentReturn;

