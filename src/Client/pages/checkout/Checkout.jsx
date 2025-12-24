import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";

// ✅ CRA env usage
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_KEY
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        // safety cleanup
        localStorage.removeItem("stripe_session_id");

        const res = await axios.post(
          `${baseUrl}/payment/session-create`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setClientSecret(res.data.clientSecret);
        localStorage.setItem("stripe_session_id", res.data.sessionId);

      } catch (err) {
        console.error("Stripe error:", err);
      }
    };

    fetchClientSecret();
  }, []);

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      {clientSecret ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p className="text-gray-500">Loading checkout...</p>
      )}
    </div>
  );
}

