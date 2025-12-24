import { useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";

export default function Checkout() {
  useEffect(() => {
    const createSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${baseUrl}/payment/session-create`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Redirect to Stripe checkout
        window.location.href = res.data.url;
      } catch (err) {
        console.error("Stripe session error:", err);
      }
    };

    createSession();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-lg font-medium">
      Redirecting to payment...
    </div>
  );
}


