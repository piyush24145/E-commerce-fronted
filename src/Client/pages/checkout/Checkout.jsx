import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { baseUrl } from "../../../environment";

// ✅ Stripe publishable key from Vercel env
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        // ✅ safety: old session remove
        localStorage.removeItem("stripe_session_id");

        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${baseUrl}/payment/session-create`,
          {},
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        setClientSecret(res.data.clientSecret);
        localStorage.setItem("stripe_session_id", res.data.sessionId);

      } catch (err) {
        console.error("❌ Error creating Stripe session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, []);

  // ✅ Stripe recommended (avoid re-mount issues)
  const options = useMemo(() => {
    return clientSecret ? { clientSecret } : null;
  }, [clientSecret]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      {clientSecret && options ? (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p className="text-red-600">Unable to load checkout</p>
      )}
    </div>
  );
}


