import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import ProductCardAdmin from './sub-components/ProductCardAdmin';
import ProductForm from './sub-components/ProductForm';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      selectedColors.forEach((c) => params.append('color', c));
      selectedCategories.forEach((cat) => params.append('category', cat));
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await axios.get(`${baseUrl}/products?${params.toString()}`);
      setProducts(res.data.products);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
    }
  };

  const fetchColors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/color`);
      setColors(res.data.Colors || []);
    } catch (err) {
      console.error('❌ Error fetching colors:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
    }
  };

  const handleFilterChange = (type, value) => {
    const toggle = (prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];

    if (type === 'color') setSelectedColors(toggle);
    else if (type === 'category') setSelectedCategories(toggle);
  };

  const handleEditForm = (id) => {
    const prod = products.find((p) => p._id === id);
    if (prod) {
      setEditProduct(prod);
      setFormOpen(true);
    }
  };

  const handleCreate = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  // ✅ Delete product logic added here
  const handleDeleteForm = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseUrl}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
    }
  };

  useEffect(() => {
    fetchColors();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedColors, selectedCategories, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📦 Admin Products</h2>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 block w-full rounded-md border px-4 py-2"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-10 mb-8">
        <div>
          <label className="font-semibold text-sm block mb-1">Filter by Color</label>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <label key={c._id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(c._id)}
                  onChange={() => handleFilterChange('color', c._id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold text-sm block mb-1">Filter by Category</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => handleFilterChange('category', cat._id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCardAdmin
              key={product._id}
              product={product}
              handleEditForm={handleEditForm}
              handleDeleteForm={handleDeleteForm} // ✅ use correct handler
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-red-500"
              onClick={() => setFormOpen(false)}
            >
              &times;
            </button>
            <ProductForm
              editProduct={editProduct}
              setFormOpen={setFormOpen}
              fetchProducts={fetchProducts}
              categories={categories}
              colors={colors}
            />
          </div>
        </div>
      )}
    </div>
  );
}
