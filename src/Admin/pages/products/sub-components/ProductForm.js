import { useFormik } from 'formik';
import { productSchema } from '../../../../yupSchema/productSchema';
import axios from 'axios';
import { baseUrl } from '../../../../environment';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductForm({
  editProduct,
  setFormOpen,
  colors = [],
  categories = [],
  fetchProducts,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const isEditMode = !!editProduct;

  const formik = useFormik({
    initialValues: {
      title: editProduct?.title || '',
      description: editProduct?.description || '',
      short_des: editProduct?.short_des || '',
      price: editProduct?.price || '',
      stock: editProduct?.stock || '',
      category: editProduct?.category || '',
      color: editProduct?.color || '',
    },
    enableReinitialize: true,
    validationSchema: productSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage('');
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        const token = localStorage.getItem("token");
        const url = isEditMode
          ? `${baseUrl}/products/${editProduct._id}`
          : `${baseUrl}/products/create`;
        const method = isEditMode ? 'put' : 'post';

        await axios[method](url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        await fetchProducts();
        setMessage(isEditMode ? '✅ You have edited successfully!' : '✅ Product created successfully!');
        resetForm();
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setImageFiles([]);
        setImagePreviews([]);
        setTimeout(() => setFormOpen(false), 2000);
      } catch (error) {
        console.error('Error submitting product', error);
        setMessage('❌ Failed to submit product.');
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const deleteImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`${baseUrl}/products/${editProduct._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProducts();
      setMessage('🗑️ Product deleted successfully!');
      setTimeout(() => setFormOpen(false), 2000);
    } catch (error) {
      console.error('Error deleting product', error);
      setMessage('❌ Failed to delete product.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };


  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto"
      onSubmit={formik.handleSubmit}
    >
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white border shadow px-4 py-2 rounded-md text-sm font-semibold ${
                message.includes('✅') || message.includes('🗑️') ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['title', 'price', 'stock'].map((field, i) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field} <span className="text-red-500">*</span>
              </label>
              <input
                id={field}
                name={field}
                type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border border-gray-300 px-4 py-2"
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-500 text-sm mt-1">{formik.errors[field]}</p>
              )}
            </motion.div>
          ))}

          {[{ name: 'category', list: categories }, { name: 'color', list: colors }].map(
            ({ name, list }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {name} <span className="text-red-500">*</span>
                </label>
                <select
                  id={name}
                  name={name}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full rounded-md border border-gray-300 px-4 py-2"
                >
                  <option value="">Select {name}</option>
                  {list.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {formik.touched[name] && formik.errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
                )}
              </div>
            )
          )}
        </div>

        {/* Text Areas */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="short_des" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="short_des"
            name="short_des"
            rows={2}
            value={formik.values.short_des}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
          {formik.touched.short_des && formik.errors.short_des && (
            <p className="text-red-500">{formik.errors.short_des}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="multiImageUpload" className="block text-sm font-medium text-gray-700 mb-1">
            Product Images
          </label>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-indigo-500 transition cursor-pointer">
            <label htmlFor="multiImageUpload" className="text-center cursor-pointer w-full">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Upload multiple images or drag and drop<br />
                <span className="text-xs text-gray-400">(PNG, JPG, GIF up to 10MB each)</span>
              </p>
              <input type="file" id="multiImageUpload" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((src, index) => (
              <motion.div key={index} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative">
                <img src={src} alt={`Preview ${index}`} className="h-32 w-full object-cover rounded-md border" />
                <button
                  type="button"
                  onClick={() => deleteImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => setFormOpen(false)}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>

          <div className="flex gap-4">
            {isEditMode && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
              >
                Delete
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white ${
                loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
