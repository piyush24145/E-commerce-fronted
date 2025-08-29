import axios from "axios";
import { baseUrl } from "../../../../environment";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCartCount, setCartItems } from "../../../../state/cartSlice";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (id) => {
    try {
      const resp = await axios.post(
        `${baseUrl}/cart/add`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(setCartCount(resp.data.data.products.length));

      const updatedCart = await axios.get(`${baseUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch(setCartItems(updatedCart.data.cart.products));

      toast.success("🛒 You have added product to cart!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (e) {
      console.error("❌ Error in add to cart:", e.response?.data || e);
      toast.error(e.response?.data?.message || "Failed to add to cart", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl shadow-lg bg-white p-5 hover:shadow-2xl transition-all duration-300 ease-in-out border border-gray-100"
    >
      <img
        src={
          product.images?.length > 0
            ? `${baseUrl}/uploads/${product.images[0]}`
            : "https://placehold.co/300x300?text=No+Image"
        }
        alt={product.title}
        className="w-full h-60 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-300"
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-500 capitalize">{product.color?.name || ""}</p>
        <p className="text-md font-bold text-indigo-600">₹ {product.price}</p>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => addToCart(product._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm h-10 w-24 shadow-md"
          >
            + cart
          </button>
          <button
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm h-10 w-24 shadow-md"
          >
            view
          </button>
        </div>
      </div>
    </motion.div>
  );
}
