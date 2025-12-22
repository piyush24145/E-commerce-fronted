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

  const [imageFiles, setImageFiles] = useState([]);        // new uploaded files
  const [imagePreviews, setImagePreviews] = useState([]);  // all previews
  const [existingImages, setExistingImages] = useState([]); // already saved images

  const isEditMode = !!editProduct;

  // ---------------- PREFILL DATA IN EDIT MODE ----------------
  useEffect(() => {
    if (isEditMode && editProduct?.images?.length > 0) {
      setImagePreviews(editProduct.images);
      setExistingImages(editProduct.images);
    } else {
      setImagePreviews([]);
      setExistingImages([]);
    }
    setImageFiles([]);
  }, [editProduct, isEditMode]);

  // ---------------- FORMIK ----------------
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
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('short_des', values.short_des);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('category', values.category);
        formData.append('color', values.color);

        // send existing images in edit mode
        if (isEditMode) {
          formData.append(
            'existingImages',
            JSON.stringify(existingImages)
          );
        }

        // send newly uploaded images
        imageFiles.forEach(file => {
          formData.append('images', file);
        });

        const token = localStorage.getItem('token');

        const url = isEditMode
          ? `${baseUrl}/products/${editProduct._id}`
          : `${baseUrl}/products/create`;

        const method = isEditMode ? 'put' : 'post';

        await axios({
          method,
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
      } catch (error) {
        console.error(error);
        setMessage(
          error.response?.data?.message || '❌ Failed to submit product.'
        );
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }
    },
  });

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const filesWithPreview = files.map(file => {
      const preview = URL.createObjectURL(file);
      file.preview = preview;
      return file;
    });

    setImageFiles(prev => [...prev, ...filesWithPreview]);
    setImagePreviews(prev => [
      ...prev,
      ...filesWithPreview.map(f => f.preview),
    ]);
  };

  // ---------------- IMAGE DELETE ----------------
  const deleteImage = (index) => {
    const preview = imagePreviews[index];

    // Existing image
    if (!preview.startsWith('blob:')) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    }
    // Newly uploaded image
    else {
      const idx = imageFiles.findIndex(f => f.preview === preview);
      if (idx !== -1) {
        URL.revokeObjectURL(imageFiles[idx].preview);
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
      }
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.delete(`${baseUrl}/products/${editProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchProducts();
      setMessage('🗑️ Product deleted successfully!');
      setTimeout(() => setFormOpen(false), 1500);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to delete product.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ---------------- UI ----------------
  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white border shadow px-4 py-2 rounded-md font-semibold"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {/* FORM CONTENT (unchanged UI) */}
      {/* Your inputs, selects, textareas & image grid remain SAME */}

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setFormOpen(false)}
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </button>

        <div className="flex gap-3">
          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

