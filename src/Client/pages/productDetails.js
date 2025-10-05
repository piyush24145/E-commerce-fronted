// ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../environment";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    axios.get(`${baseUrl}/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setSelectedImage(res.data.product.images?.[0] || null);
    });
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setHoverPosition({ x, y });
  };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6 items-start">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4">
        {product.images?.map((img, idx) => (
          <img
  key={idx}
  src={img} // ✅ direct Cloudinary URL
  onClick={() => setSelectedImage(img)}
  className={`w-16 h-16 object-cover border rounded cursor-pointer ${
    selectedImage === img ? "ring-2 ring-indigo-500" : ""
  }`}
  alt="thumbnail"
/>

        ))}
      </div>

      {/* Main Image with zoom hover */}
      <div
        className="relative overflow-hidden border rounded-md"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
<img
  src={selectedImage || "https://placehold.co/400x400?text=No+Image"}
  alt="Selected"
  className="w-full h-[400px] object-contain"
/>

      </div>

      {/* Zoom View */}
     {isHovering && (
  <div className="hidden md:block w-100 h-[600px] relative">
    <div className="rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
    <img
  src={selectedImage || "https://placehold.co/400x400?text=No+Image"}
  alt="Zoomed View"
  className="absolute transition-all duration-100 ease-out"
  style={{
    top: `${-hoverPosition.y * 2}%`,
    left: `${-hoverPosition.x * 2}%`,
    position: "absolute",
    width: "400%",
    height: "auto",
  }}
/>

      <div className="w-full h-[600px]"></div>
    </div>
  </div>
)}


      {/* Product Info */}
      <div className="md:col-span-3 mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{product.title}</h2>
        <p className="text-gray-600 mb-2">{product.short_des || product.description}</p>
        <p className="text-xl font-semibold text-red-600 mb-4">₹{product.price}</p>
        <p>
          <span className="font-semibold">Stock:</span> {product.stock}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {product.category?.name}
        </p>
        <p>
          <span className="font-semibold">Color:</span> {product.color?.name}
        </p>
      </div>
    </div>
  );
}
