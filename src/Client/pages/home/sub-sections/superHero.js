import React from "react";
import { useNavigate } from "react-router-dom"; 

const products = [
  {
    id: 1,
    image: "/shoess.avif",
    title: "Woodland Nubuck tracking shoes",
    price: "$79.99",
    category: "shoes", 
  },
  {
    id: 2,
    image: "/Tshirt.jpg",
    title: "Weekly White Cotton T-shirt",
    price: "$21.99",
    category: "t-shirt",
  },
  {
    id: 3,
    image: "/Headfone.webp",
    title: "Muffs M3",
    price: "$59.99",
    category: "headphones",
  },
  {
    id: 4,
    image: "/500618969Living-Room-Furniture-Essentials_Main.jpg",
    title: "Furniture Essentials",
    price: "$35.50",
    category: "furniture",
  },
  {
    id: 5,
    image: "/compress_0923-fhdnmcrg-39-black__1.jpg",
    title: "Freehand Womens Nykaa jeans",
    price: "$60.99",
    category: "jeans",
  },
  {
    id: 6,
    image: "/feature_medicubepink.webp",
    title: "Medicube Skin care",
    price: "$45.99",
    category: "skincare",
  },
];

export default function SuperHero() {
  const navigate = useNavigate(); 

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10">
        SuperHero <span className="text-indigo-600">Collection</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className={`relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer ${
              idx === 0 ? "sm:row-span-2 lg:col-span-2" : ""
            }`}
          >
            {/* Image */}
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition"></div>

            {/* Text Content */}
            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white font-bold text-xl sm:text-2xl drop-shadow-lg">
                {product.title}
              </h3>
              <p className="text-gray-200 text-sm sm:text-base mt-1">
                {product.price}
              </p>
              <button
                onClick={() => navigate(`/products?category=${product.category}`)} 
                className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs sm:text-sm rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
