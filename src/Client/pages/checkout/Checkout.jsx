import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";

const stripePromise = loadStripe("pk_test_51RcPdGGd8yfmOEEK0l9c8eBdLAQCkERmaTRWsk3t7lZAp49AcyYmyXmDld9pKp56eNIQGGJdFaeONkWnOxMHOqSy00c9Ji2AfQ"); // Replace with your real key

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const res = await axios.post(`${baseUrl}/payment/session-create`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("❌ Error fetching clientSecret:", err);
      }
    };

    fetchClientSecret();
  }, []);

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      {clientSecret ? (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p className="text-gray-500">Loading checkout...</p>
      )}
    </div>
  );
}
