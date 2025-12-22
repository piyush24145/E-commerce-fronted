// src/Admin/pages/products/sub-components/ProductForm.jsx
import { useFormik } from 'formik';
import { productSchema } from '../../../../yupSchema/productSchema';
import axios from 'axios';
import { baseUrl } from '../../../../environment';
import { useEffect, useState } from 'react';
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
  const [existingImages, setExistingImages] = useState([]);

  const isEditMode = !!editProduct;

  // Prefill edit data
  useEffect(() => {
    if (isEditMode && editProduct?.images?.length) {
      setImagePreviews(editProduct.images);
      setExistingImages(editProduct.images);
    } else {
      setImagePreviews([]);
      setExistingImages([]);
    }
    setImageFiles([]);
  }, [editProduct, isEditMode]);

  const formik = useFormik({
    initialValues: {
      title: editProduct?.title || '',
      description: editProduct?.description || '',
      short_des: editProduct?.short_des || '',
      price: editProduct?.price || '',
      stock: editProduct?.stock || '',
      category: editProduct?.category?._id || '',
      color: editProduct?.color?._id || '',
    },
    enableReinitialize: true,
    validationSchema: productSchema,

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage('');

      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) =>
          formData.append(key, value)
        );

        if (isEditMode) {
          formData.append(
            'existingImages',
            JSON.stringify(existingImages)
          );
        }

        imageFiles.forEach(file =>
          formData.append('images', file)
        );

        const token = localStorage.getItem('token');
        const url = isEditMode
          ? `${baseUrl}/products/${editProduct._id}`
          : `${baseUrl}/products/create`;

        await axios({
          method: isEditMode ? 'put' : 'post',
          url,
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        await fetchProducts();
        setMessage(
          isEditMode
            ? '✅ Product updated successfully!'
            : '✅ Product created successfully!'
        );

        resetForm();
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setTimeout(() => setFormOpen(false), 1500);
      } catch (err) {
        setMessage(err.response?.data?.message || '❌ Failed');
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }
    },
  });

  // Image handlers
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    const mapped = files.map(f => {
      f.preview = URL.createObjectURL(f);
      return f;
    });
    setImageFiles(prev => [...prev, ...mapped]);
    setImagePreviews(prev => [...prev, ...mapped.map(f => f.preview)]);
  };

  const deleteImage = index => {
    const preview = imagePreviews[index];

    if (!preview.startsWith('blob:')) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const idx = imageFiles.findIndex(f => f.preview === preview);
      if (idx !== -1) {
        URL.revokeObjectURL(imageFiles[idx].preview);
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
      }
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>

      <AnimatePresence>
        {message && (
          <motion.p className="mb-4 font-semibold">{message}</motion.p>
        )}
      </AnimatePresence>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {['title', 'price', 'stock'].map(field => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type={field === 'price' || field === 'stock' ? 'number' : 'text'}
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        {[{ name: 'category', list: categories }, { name: 'color', list: colors }].map(
          ({ name, list }) => (
            <div key={name}>
              <label className="block mb-1 capitalize">{name}</label>
              <select
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select {name}</option>
                {list.map(i => (
                  <option key={i._id} value={i._id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
          )
        )}
      </div>

      {/* Textareas */}
      <textarea
        name="description"
        placeholder="Description"
        value={formik.values.description}
        onChange={formik.handleChange}
        className="w-full border mt-4 p-2 rounded"
      />
      <textarea
        name="short_des"
        placeholder="Short description"
        value={formik.values.short_des}
        onChange={formik.handleChange}
        className="w-full border mt-3 p-2 rounded"
      />

      {/* Images */}
      <input type="file" multiple onChange={handleImageChange} className="mt-4" />

      <div className="grid grid-cols-4 gap-3 mt-4">
        {imagePreviews.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} className="h-24 w-full object-cover rounded" />
            <button
              type="button"
              onClick={() => deleteImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setFormOpen(false)}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </motion.form>
  );
}


