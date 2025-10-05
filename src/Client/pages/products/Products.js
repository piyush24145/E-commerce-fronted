import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import ProductCard from './sub-components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      selectedColors.forEach((color) => params.append('color', color));
      selectedCategories.forEach((cat) => params.append('category', cat));
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await axios.get(`${baseUrl}/products?${params.toString()}`);

      // ✅ Cloudinary URLs handle
      const updatedProducts = res.data.products.map((p) => ({
        ...p,
        images: p.images?.map((img) =>
          img.startsWith('http') ? img : `${baseUrl}/${img}`
        ) || [],
      }));

      setProducts(updatedProducts);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
    }
  };

  const fetchFilters = async () => {
    try {
      const [colorRes, categoryRes] = await Promise.all([
        axios.get(`${baseUrl}/color`),
        axios.get(`${baseUrl}/category`)
      ]);
      setColors(colorRes.data.Colors || []);
      setCategories(categoryRes.data.categories || []);
    } catch (err) {
      console.error('❌ Error fetching filters:', err);
    }
  };

  const handleFilterChange = (type, value) => {
    const toggleValue = (prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];

    if (type === 'color') setSelectedColors(toggleValue);
    else if (type === 'category') setSelectedCategories(toggleValue);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedColors, selectedCategories, searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const search = searchQuery.toLowerCase();
    const matchedTitles = products.filter(p => p.title?.toLowerCase().includes(search)).map(p => ({ label: p.title, type: 'title' }));
    const matchedColors = colors.filter(c => c.name?.toLowerCase().includes(search)).map(c => ({ label: c.name, type: 'color' }));
    const matchedCategories = categories.filter(cat => cat.name?.toLowerCase().includes(search)).map(cat => ({ label: cat.name, type: 'category' }));
    setSuggestions([...matchedTitles, ...matchedColors, ...matchedCategories]);
  }, [searchQuery, products, colors, categories]);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category?.name === activeCategory);

  const handleSuggestionClick = (label) => {
    setSearchQuery(label);
    setSuggestions([]);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto relative scroll-smooth">
      <motion.h2
        className="text-3xl sm:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🛍️ Explore Our Stunning Products
      </motion.h2>

      <div className="relative mb-6">
        <motion.input
          type="text"
          placeholder="🔍 Search for amazing deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-5 py-3 shadow-md focus:ring-2 focus:ring-indigo-500 transition"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white shadow-lg w-full mt-1 max-h-60 overflow-auto border border-gray-200 rounded-md">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(s.label)}
                className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-sm"
              >
                {s.label} <span className="text-gray-400 text-xs">({s.type})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:hidden flex justify-end mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-64 border-r pr-4 hidden md:block">
          <SidebarContent
            colors={colors}
            categories={categories}
            selectedColors={selectedColors}
            selectedCategories={selectedCategories}
            handleFilterChange={handleFilterChange}
            productCount={products.length}
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>

        <div className="flex-1">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 p-5 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-indigo-600">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <SidebarContent
                colors={colors}
                categories={categories}
                selectedColors={selectedColors}
                selectedCategories={selectedCategories}
                handleFilterChange={handleFilterChange}
                productCount={products.length}
                setActiveCategory={setActiveCategory}
                activeCategory={activeCategory}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({
  colors,
  categories,
  selectedColors,
  selectedCategories,
  handleFilterChange,
  productCount,
  setActiveCategory,
  activeCategory
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div
          className={`cursor-pointer font-semibold ${activeCategory === 'all' ? 'text-indigo-600' : 'text-gray-700'} hover:underline`}
          onClick={() => setActiveCategory('all')}
        >
          All ({productCount})
        </div>
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`cursor-pointer text-sm ${activeCategory === cat.name ? 'text-indigo-600 font-semibold' : 'text-gray-700'} hover:underline`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      <hr />

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Color</h4>
        <div className="space-y-1">
          {colors.map((color) => (
            <label key={color._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedColors.includes(color._id)}
                onChange={() => handleFilterChange('color', color._id)}
                className="accent-indigo-500"
              />
              {color.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2 mt-4">Category</h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => handleFilterChange('category', cat._id)}
                className="accent-indigo-500"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2 mt-4">Size</h4>
        <p className="text-sm text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
}
