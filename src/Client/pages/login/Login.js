import { useFormik } from 'formik';
import { loginSchema } from '../../../yupSchema/loginSchema';
import axios from "axios";
import { useEffect, useState } from 'react';
import Alert from '../../../basicUtilityComponenets/alert/Alert';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../state/authSlice';

export default function Login() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState("success");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMessageClear = () => {
    setMessage("");
    setMessageType("success");
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        handleMessageClear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const initialValues = { email: '', password: '' };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:5000/user/login", values);

        // ✅ Store userData and token
        localStorage.setItem("userData", JSON.stringify(response.data.userData));
        localStorage.setItem("token", response.data.token); // ✅ Store token here

        setMessage(response.data.message || "Login Successful");
        setMessageType("success");

        const isAdmin = response.data.userData.role === "admin";
        dispatch(login({ auth: true, admin: isAdmin }));

        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/products");
        }
      } catch (error) {
        const errMsg = error.response?.data?.message || error.message || "Something went wrong!";
        console.error('Login error:', errMsg);
        setMessage(errMsg);
        setMessageType("error");
      }
    }
  });

  return (
    <>
      {message && (
        <Alert message={message} type={messageType} handleMessageClear={handleMessageClear} />
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <form className="max-w-3xl w-full" onSubmit={formik.handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-lg font-semibold text-gray-900">Login</h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className='text-red-400'>{formik.errors.email}</p>
                  )}
                </div>

                <div className="col-span-full">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                  <div className="mt-2">
                    <input
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                    />
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className='text-red-400'>{formik.errors.password}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
