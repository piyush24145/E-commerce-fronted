import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import { motion } from "framer-motion";
import { Package, Users, Layers3, Palette } from "lucide-react";

const StatCard = ({ title, count, icon: Icon, gradient }) => (
  <motion.div
    className={`text-white rounded-2xl shadow-lg h-40 w-72 p-6 flex flex-col justify-between ${gradient}`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-8 h-8" />
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <p className="text-4xl font-bold mt-2">{count}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalColor, setTotalColor] = useState(0);

  const fetchTotal = async () => {
    try {
      const [product, user, category, color] = await Promise.all([
        axios.get(`${baseUrl}/products`),
        axios.get(`${baseUrl}/user`),
        axios.get(`${baseUrl}/category`),
        axios.get(`${baseUrl}/color`)
      ]);

      setTotalProduct(product.data.products.length);
      setTotalUser(user.data.users.length);
      setTotalCategory(category.data.categories.length);
      setTotalColor(color.data.Colors.length);
    } catch (error) {
      console.log("❌ Error in fetching Dashboard", error);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Products"
        count={totalProduct}
        icon={Package}
        gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
      />
      <StatCard
        title="Users"
        count={totalUser}
        icon={Users}
        gradient="bg-gradient-to-r from-slate-500 to-gray-700"
      />
      <StatCard
        title="Categories"
        count={totalCategory}
        icon={Layers3}
        gradient="bg-gradient-to-r from-purple-500 to-fuchsia-600"
      />
      <StatCard
        title="Colors"
        count={totalColor}
        icon={Palette}
        gradient="bg-gradient-to-r from-emerald-500 to-green-600"
      />
    </div>
  );
}
