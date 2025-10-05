import { Link } from "react-router-dom";
import { baseUrl } from "../../../environment";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCartItems } from "../../../state/cartSlice";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const fetchCart = () => {
    axios
      .get(`${baseUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((resp) => {
        const cartProducts = resp.data.cart?.products || [];
        setProducts(cartProducts);
        dispatch(setCartItems(cartProducts));
      })
      .catch((e) => {
        console.log("cart fetch error", e);
      });
  };

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    axios
      .put(
        `${baseUrl}/cart/${productId}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        toast.success("Quantity updated");
        fetchCart();
      })
      .catch(() => {
        toast.error("Failed to update quantity");
      });
  };

  const handleDeleteItem = (productId) => {
    axios
      .delete(`${baseUrl}/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success("Item removed");
        fetchCart();
      })
      .catch(() => {
        toast.error("Failed to remove item");
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };

  return (
    <>
      <h1 className="m-auto bg-gray-200 text-center text-3xl font-bold">Cart</h1>
      <table className="table-auto w-full">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="p-2">Name</th>
            <th>Image</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((item) => (
              <tr key={item.product._id}>
                <td align="center">{item.product.title}</td>
                <td align="center">
                  <img
  className="h-32 object-contain"
  src={
    item.product.images && item.product.images.length > 0
      ? item.product.images[0]   // ✅ direct Cloudinary URL
      : "https://placehold.co/300x300?text=No+Image"
  }
  alt={item.product.title}
/>
                </td>
                <td align="center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-200 text-lg font-bold shadow"
                    >
                      –
                    </button>

                    <span className="text-md font-semibold px-3 py-1 bg-gray-100 rounded shadow text-gray-800">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-green-500 hover:text-white transition-all duration-200 text-lg font-bold shadow"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td align="center">₹ {item.product.price}</td>
                <td align="center">₹ {item.product.price * item.quantity}</td>
                <td align="center">
                  <button
                    onClick={() => handleDeleteItem(item.product._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                🛒 Your cart is empty
              </td>
            </tr>
          )}

          {products.length > 0 && (
            <>
              <tr className="bg-gray-200">
                <td colSpan={4}></td>
                <td align="center" className="p-2 font-bold">
                  Total: ₹ {calculateTotal()}
                </td>
                <td></td>
              </tr>

              <tr>
                <td colSpan={4}></td>
                <td align="center" colSpan={2}>
                  <Link
                    to="/checkout"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Proceed to checkout
                  </Link>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
}
