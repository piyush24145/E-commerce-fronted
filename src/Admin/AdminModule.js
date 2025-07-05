import React,{ useState} from "react";
import {NavLink,Outlet} from "react-router-dom";
import {
    HomeIcon,
    ShoppingCartIcon,
    UserIcon,
    TagIcon,
    ChartBarIcon,
    CogIcon,
} from "@heroicons/react/24/outline";
import { WalletIcon } from "@heroicons/react/20/solid";


const sidebarItems = [
    { name: "Home", icon: HomeIcon, path: "/" },
  { name: "Dashboard", icon: ChartBarIcon, path: "/admin" },
  { name: "Products", icon: ShoppingCartIcon, path: "/admin/products" },
  { name: "Users", icon: UserIcon, path: "/admin/users" },
  { name: "Orders", icon: WalletIcon, path: "/admin/orders" },
   { name: "category", icon: TagIcon, path: "/admin/category" },
     { name: "Colors", icon: CogIcon, path: "/admin/color" },
];
const AdminModule= () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen ">
<div
       className={`${
        isSidebarOpen ?"w-64" :" w-20"
       }  bg-white border-r border-gray-200 transition-all duration-300`}
       >
<div className="flex items-center justify-between px-4 py-4 border-b">
  {/* <span
    className={`text-lg font-semibold text-gray-700 transition-opacity duration-300 ${
      isSidebarOpen ? "" : "hidden"
    }`}
  >
    Admin Panel
  </span> */}
  <button
    className="p-2 rounded-md focus:outline-none hover:bg-gray-100"
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6 text-gray-500"
    >
      <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12h18M3 6h18M3 18h18"
      />
    </svg>
  </button>
</div>

<nav className="mt-4">
  {sidebarItems.map((item) => (
    <NavLink
      key={item.name}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 mx-2 rounded-md text-gray-600 hover:bg-gray-100 ${
          isActive ? "bg-gray-200 text-gray-900" : ""
        }`
      }
    >
      <item.icon className="h-6 w-6" />
      <span
  className={`text-sm font-medium transition-opacity duration-300 ${
    isSidebarOpen ? "" : "hidden"
  }`}
>
  {item.name}
</span>
</NavLink>
))}
</nav>
</div>

<div className="flex-1 overflow-y-auto"> 
  <header className="bg-white shadow">
    <div className="flex items-center justify-between px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
      <div className="flex items-center space-x-4">
        {/* Add user avatar or logout button here */}
        <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Logout
        </button>
      </div>
    </div>
  </header>
<main className="p-6">
<Outlet/>
</main>
</div>
</div>
);
};
export default AdminModule;