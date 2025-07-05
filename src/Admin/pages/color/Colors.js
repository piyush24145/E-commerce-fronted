import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import { colorSchema } from "../../../yupSchema/colorSchema";
import Alert from "../../../basicUtilityComponenets/alert/Alert";

export default function Colors() {
  const [colors, setColors] = useState([]);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchColors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/color`);
      setColors(res.data.Colors || []);
    } catch (err) {
      console.error("❌ Error fetching colors:", err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: colorSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editId) {
          await axios.put(`${baseUrl}/color/${editId}`, values);
          setMessage("✅ Color updated successfully!");
        } else {
          await axios.post(`${baseUrl}/color/create`, values);
          setMessage("✅ Color created successfully!");
        }
        resetForm();
        setEditId(null);
        fetchColors();
      } catch (error) {
        console.error("❌ Error saving color:", error);
        setMessage("❌ Failed to save color.");
      }
    },
  });

  const handleEdit = (color) => {
    formik.setValues({ name: color.name, description: color.description || "" });
    setEditId(color._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await axios.delete(`${baseUrl}/color/${id}`);
        setMessage("✅ Color deleted successfully!");
        fetchColors();
      } catch (err) {
        console.error("❌ Delete failed:", err);
        setMessage("❌ Failed to delete color.");
      }
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🎨 Manage Colors</h2>

      {message && <Alert type={message.includes("✅") ? "success" : "error"} message={message} />}

      <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Color Name</label>
          <input
            type="text"
            name="name"
            className="w-full border px-3 py-2 rounded"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Description (optional)</label>
          <textarea
            name="description"
            rows={2}
            className="w-full border px-3 py-2 rounded"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update" : "Add"} Color
        </button>
      </form>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Existing Colors</h3>
        <div className="space-y-3">
          {colors.length > 0 ? (
            colors.map((color) => (
              <div
                key={color._id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <div>
                  <p className="font-semibold capitalize">{color.name}</p>
                  <p className="text-sm text-gray-500">{color.description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(color)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(color._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No colors available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
