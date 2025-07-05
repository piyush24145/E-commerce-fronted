export default function ProductCardAdmin({ product, handleEditForm ,handleDeleteForm }) {
  return (
    <div className="group relative rounded-xl shadow-md bg-white p-4 hover:shadow-xl transition-all duration-300 ease-in-out">
      {product.images?.length > 0 ? (
        <img
          src={`http://localhost:5000/uploads/${product.images[0]}`}
          alt={product.title}
          className="w-full h-60 object-cover rounded-md mb-4"
        />
      ) : (
        <img
          src="https://placehold.co/300x300?text=No+Image"
          alt="placeholder"
          className="w-full h-60 object-cover rounded-md mb-4"
        />
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="text-sm text-gray-500 capitalize">
          {product.color?.name || ""}
        </p>
        <p className="text-md font-bold text-green-600">₹ {product.price}</p>

        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
            onClick={() => handleEditForm(product._id)}
          >
            Edit
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
            onClick={() => handleDeleteForm(product._id)} // ✅ fixed here
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
