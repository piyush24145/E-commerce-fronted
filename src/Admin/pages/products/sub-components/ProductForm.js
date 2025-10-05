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
  const [imageFiles, setImageFiles] = useState([]); // new File objects
  const [imagePreviews, setImagePreviews] = useState([]); // previews (both existing URLs and object URLs)

  const isEditMode = !!editProduct;

  // if editing, prefill previews with existing product images (URLs)
  useEffect(() => {
    if (isEditMode && editProduct?.images && editProduct.images.length > 0) {
      setImagePreviews(editProduct.images.slice()); // copy array of URLs
    } else {
      setImagePreviews([]);
    }
    setImageFiles([]); // clear selected files on open
  }, [editProduct, isEditMode]);

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
        // Build FormData and append fields
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('short_des', values.short_des);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('category', values.category);
        formData.append('color', values.color);

        // Append image files (if any). Backend's multer will handle them.
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        const token = localStorage.getItem('token');
        const url = isEditMode ? `${baseUrl}/products/${editProduct._id}` : `${baseUrl}/products/create`;
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
        setMessage(isEditMode ? '✅ You have edited successfully!' : '✅ Product created successfully!');
        resetForm();
        // revoke object URLs
        imageFiles.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
        setImageFiles([]);
        setImagePreviews([]);
        setTimeout(() => setFormOpen(false), 1500);
      } catch (error) {
        console.error('Error submitting product', error);
        setMessage('❌ Failed to submit product.');
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }
    },
  });

  // handle selection of new image files
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // create preview for each file
    const withPreview = files.map((file) => {
      const preview = URL.createObjectURL(file);
      // attach preview to file object for easy revoking later
      file.preview = preview;
      return file;
    });

    // append new files to state
    setImageFiles((prev) => [...prev, ...withPreview]);

    // append preview urls to imagePreviews so UX shows both existing URLs and new previews
    setImagePreviews((prev) => [...prev, ...withPreview.map((f) => f.preview)]);
  };

  // delete preview at index. If it's a newly added file, remove from imageFiles and revoke objectURL.
  // If it's an existing URL (string not containing "blob:"), we simply remove its preview — backend will keep existing images unless new files uploaded.
  const deleteImage = (index) => {
    const preview = imagePreviews[index];
    // if preview is an object URL, find and remove file from imageFiles
    if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
      // remove from imageFiles by matching preview
      const idx = imageFiles.findIndex((f) => f.preview === preview);
      if (idx !== -1) {
        URL.revokeObjectURL(imageFiles[idx].preview);
        const updatedFiles = [...imageFiles];
        updatedFiles.splice(idx, 1);
        setImageFiles(updatedFiles);
      }
    } else {
      // it's likely an existing URL from editProduct.images — removing preview just hides it;
      // note: backend will keep old images unless new files appended on submit (this behavior matches update controller)
    }

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/products/${editProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProducts();
      setMessage('🗑️ Product deleted successfully!');
      setTimeout(() => setFormOpen(false), 1500);
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
      onSubmit={formik.handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto"
    >
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['title', 'price', 'stock'].map((field) => (
            <div key={field}>
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
              {formik.touched[field] && formik.errors[field] && <p className="text-red-500 text-sm mt-1">{formik.errors[field]}</p>}
            </div>
          ))}

          {[{ name: 'category', list: categories }, { name: 'color', list: colors }].map(({ name, list }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {name} <span className="text-red-500">*</span>
              </label>
              <select id={name} name={name} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full rounded-md border border-gray-300 px-4 py-2">
                <option value="">Select {name}</option>
                {list.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
              </select>
              {formik.touched[name] && formik.errors[name] && <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>}
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea id="description" name="description" rows={4} value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full rounded-md border border-gray-300 px-4 py-2" />
          {formik.touched.description && formik.errors.description && <p className="text-red-500">{formik.errors.description}</p>}
        </div>

        <div>
          <label htmlFor="short_des" className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
          <textarea id="short_des" name="short_des" rows={2} value={formik.values.short_des} onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full rounded-md border border-gray-300 px-4 py-2" />
          {formik.touched.short_des && formik.errors.short_des && <p className="text-red-500">{formik.errors.short_des}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-indigo-500 transition cursor-pointer">
            <label htmlFor="multiImageUpload" className="text-center cursor-pointer w-full">
              <p className="mt-2 text-sm text-gray-600">Upload multiple images or drag and drop<br /><span className="text-xs text-gray-400">(PNG, JPG up to 5MB each)</span></p>
              <input type="file" id="multiImageUpload" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt={`Preview ${index}`} className="h-32 w-full object-cover rounded-md border" />
                <button type="button" onClick={() => deleteImage(index)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" disabled={loading}>Cancel</button>

          <div className="flex gap-4">
            {isEditMode && <button type="button" onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600">Delete</button>}
            <button type="submit" disabled={loading} className={`px-5 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'}`}>{loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}</button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
