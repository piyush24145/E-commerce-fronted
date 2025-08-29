import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { categorySchema } from "../../../yupSchema/categorySchema";
import axios from "axios";
import Alert from "../../../basicUtilityComponenets/alert/Alert";
import { baseUrl } from "../../../environment";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const[editId,setEditId]=useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleMessageClear = () => {
    setMessage("");
    setMessageType("success");
  };
 const handleEdit=(id)=>{
   setFormOpen(true);
   setEditId(id);
const selectedCategory =categories.filter(x=>x._id===id);
Formik.setFieldValue("name",selectedCategory[0].name);
Formik.setFieldValue("description",selectedCategory[0].description)
  }

  const handleDeleteSubmit=(id)=>{
    if(window.confirm("Are you sure you want to delete this category")){
      axios.delete(`${baseUrl}/category/${id}`).then(resp=>{
        console.log("Delete category",resp)
      }).catch(e=>{
        console.log("Error in category delete",e)
      })

    }
  }
  const Formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema: categorySchema,
    onSubmit: (values, { resetForm }) => {
 if(editId){
        axios.put(`${baseUrl}/category/${editId}`,{...values}).then(resp=>{
  setMessage("Category updated successfully");
          setMessageType("success");
          resetForm(); 
          setFormOpen(false);
          fetchCategories();
        }).catch((e)=>{
            setMessage("Error creating color");
          setMessageType("error");
        })
      }
      else{

  axios
        .post(`${baseUrl}/category/create`, { ...values })
        .then((resp) => {
          setMessage("Category created successfully");
          setMessageType("success");
          resetForm();
          setFormOpen(false);
          fetchCategories();
        })
        .catch((e) => {
          setMessage("Error creating category");
          setMessageType("error");
        });
      }
    
    },
  });

  const fetchCategories = () => {
    axios
      .get(`${baseUrl}/category`)
      .then((resp) => {
        setCategories(resp.data.categories);
      })
      .catch((e) => {
        setMessage("Error fetching categories");
        setMessageType("error");
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {message && (
        <Alert
          message={message}
          type={messageType}
          handleMessageClear={handleMessageClear}
        />
      )}

      {formOpen && (
        <form
          className="p-6 bg-white rounded-xl shadow-lg mx-auto my-6 max-w-xl"
          onSubmit={Formik.handleSubmit}
        >
          <h1 className="text-xl font-semibold mb-4 text-indigo-700">➕ Add New Category</h1>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                value={Formik.values.name}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {Formik.touched.name && Formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{Formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                name="description"
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                value={Formik.values.description}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {Formik.touched.description && Formik.errors.description && (
                <p className="text-red-500 text-sm mt-1">{Formik.errors.description}</p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {!formOpen && (
        <button
          onClick={() => setFormOpen(true)}
          className="mx-auto flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Category
        </button>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {categories &&
          categories.map((category, i) => (
            <div
              key={i}
              className="bg-white p-4 w-64 rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <h2 className="text-lg font-semibold text-indigo-700">{category.name}</h2>
              <p className="text-gray-600 text-sm">{category.description}</p>
              <div className="flex justify-between mt-4">
                <button onClick={()=>{handleEdit(category._id)}}>
                  <PencilSquareIcon className="h-6 w-6 text-blue-500" />
                </button>
                <button  onClick={()=>{handleDeleteSubmit(category._id)}}>
                  <TrashIcon className="h-6 w-6 text-red-500" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
