// src/Admin/pages/products/sub-components/ProductCardAdmin.jsx
import { Pencil, Trash } from "lucide-react";

export default function ProductCardAdmin({ product, handleEditForm, handleDeleteForm }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}   // cloudinary full URL
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}

      <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.short_des || product.description}</p>
      <p className="text-gray-900 font-bold">₹{product.price}</p>

      <div className="flex justify-between mt-4">
        <button onClick={() => handleEditForm(product._id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
          <Pencil size={16} /> Edit
        </button>
        <button onClick={() => handleDeleteForm(product._id)} className="flex items-center gap-1 text-red-600 hover:text-red-800">
          <Trash size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
