import { useFormik } from 'formik';
import { registerSchema } from '../../../yupSchema/registerSchema';
import axios from "axios";
import { useEffect, useState } from 'react';
import Alert from '../../../basicUtilityComponenets/alert/Alert';
import { baseUrl } from "../../../environment.js";

export default function Register() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState("success");
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

  const initialValues = { name: '', email: '', password: '', confirmpassword: '' };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log("register formik submit", values);
      axios.post(`${baseUrl}/user/register`, { ...values })
        .then(response => {
          console.log("Response register", response);
          setMessage(response.data.message);
          setMessageType("success");
        })
        .catch(e => {
          let errMsg = "Something went wrong!";
          if (e.response && e.response.data && e.response.data.message) {
            errMsg = e.response.data.message;
          } else if (e.message) {
            errMsg = e.message;
          }
          console.log('Error in registration:', errMsg);
          setMessage(errMsg);
          setMessageType("error");
        });
    }
  });

  return (
    <>
      {message && <Alert message={message} type={messageType} handleMessageClear={handleMessageClear} />}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <form className="max-w-3xl w-full" onSubmit={Formik.handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Register</h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="Name" className="block text-sm/6 font-medium text-gray-900">Name</label>
                  <div className="mt-2">
                    <input
                      name="name"
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  {Formik.touched.name && Formik.errors.name && <p className='text-red-400'> {Formik.errors.name} </p>}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      name="email"
                      type="email"
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  {Formik.touched.email && Formik.errors.email && <p className='text-red-400'> {Formik.errors.email} </p>}
                </div>

                <div className="col-span-full">
                  <label htmlFor="Password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                  <div className="mt-2">
                    <input
                      name="password"
                      type="password"
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      autoComplete="new-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  {Formik.touched.password && Formik.errors.password && <p className='text-red-400'> {Formik.errors.password} </p>}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="Confirmpassword" className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                  <div className="mt-2">
                    <input
                      name="confirmpassword"
                      type="password"
                      onChange={Formik.handleChange}
                      onBlur={Formik.handleBlur}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  {Formik.touched.confirmpassword && Formik.errors.confirmpassword && <p className='text-red-400 '> {Formik.errors.confirmpassword} </p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

