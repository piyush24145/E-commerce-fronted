import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';

import { baseUrl } from './environment';
import { login } from './state/authSlice';
import { setCartCount, setCartItems } from './state/cartSlice';

// Client Pages
import ClientModule from './Client/ClientModule';
import Home from './Client/pages/home/Home';
import Hero from './Client/pages/home/sub-sections/Hero';
import Products from './Client/pages/products/Products';
import Cart from './Client/pages/cart/Cart';
import Register from './Client/pages/register/Register';
import Login from './Client/pages/login/Login';
import Orders from './Client/pages/orders/Orders';
import Orderdetails from './Client/pages/order details/Orderdetails';
import Checkout from './Client/pages/checkout/Checkout';
import PaymentReturn from './Client/pages/payment return/PaymentReturn';
import SignOut from './Client/pages/sign out/SignOut';
import UserProfile from "./Client/pages/profile/UserProfile";
import ProductDetails from './Client/pages/productDetails';

// Admin Pages
import AdminModule from './Admin/AdminModule';
import AdminDashboard from './Admin/pages/dashboard/AdminDashboard';
import UsersAdmin from './Admin/pages/users/UserAdmin';
import OrderAdmin from './Admin/pages/orders/OrdersAdmin';
import ProductsAdmin from './Admin/pages/products/ProductsAdmin';
import ProductCardAdmin from './Admin/pages/products/sub-components/ProductCardAdmin';
import Category from './Admin/pages/category/Category';
import Colors from './Admin/pages/color/Colors';

// Guards
import PrivateRoute from './guards/PrivateRoute';
import PrivateAdminRoute from './guards/PrivateAdminRoute';

function App() {
  const dispatch = useDispatch();

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        const cartProducts = resp.data.cart?.products || [];
        const totalItems = resp.data.totalItems || 0;
        dispatch(setCartItems(cartProducts));
        dispatch(setCartCount(totalItems));
      })
      .catch((e) => {
        console.log("❌ Cart fetch error:", e);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* 🔐 Admin Panel Routes */}
          <Route path="/admin" element={<PrivateAdminRoute><AdminModule /></PrivateAdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="orders" element={<OrderAdmin />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/card" element={<ProductCardAdmin />} />
            <Route path="category" element={<Category />} />
            <Route path="color" element={<Colors />} />
          </Route>

          {/* 🛒 Client Routes */}
          <Route path="/" element={<ClientModule />}>
            <Route index element={<><Hero /><Home /></>} />
            <Route path="products" element={<Products />} />
            <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="orders" element={<Orders />} />
            <Route path="order-details/:id" element={<PrivateRoute><Orderdetails /></PrivateRoute>} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-out" element={<SignOut />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-return" element={<PaymentReturn />} />
            <Route path="product/:id" element={<ProductDetails />} />

            {/* ✅ Profile route fixed */}
            <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          </Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
