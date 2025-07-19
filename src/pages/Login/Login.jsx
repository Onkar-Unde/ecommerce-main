import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../../context/Auth/Auth';
import { Helmet } from 'react-helmet';

export default function Login() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserToken } = useContext(authContext);
  const navigate = useNavigate();

  const loginData = { email: 'demo1@demo.com', password: '123456@demo' };

  function handleLogin(data) {
    setIsLoading(true);
    axios
      .post('http://localhost:3000/api/v1/auth/login', data)
      .then((res) => {
        setUserToken(res.data.token);
        localStorage.setItem('authToken', res.data.token);
        setErr(null);
        setIsLoading(false);
        if (res.data.message === 'success') {
          navigate('/');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErr(err.response?.data?.message || 'Login failed');
      });
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  const inputClasses = `
    block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
    border-0 border-b-2 border-gray-300 appearance-none 
    dark:text-white dark:border-gray-600 dark:focus:border-green-500 
    focus:outline-none focus:ring-0 focus:border-green-600 peer
  `;

  const labelClasses = `
    absolute text-sm text-gray-500 dark:text-gray-400 duration-300 
    transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
    peer-focus:scale-75 peer-focus:-translate-y-6 
    peer-focus:text-green-600 peer-focus:dark:text-green-500
  `;

  const buttonClasses = `
    w-full sm:w-36 text-white bg-green-700 hover:bg-green-800 
    focus:ring-4 focus:outline-none focus:ring-green-300 
    font-medium rounded-lg text-sm px-5 py-2.5 text-center 
    dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800
    transition-all duration-200
  `;

  return (
    <>
      <Helmet>
        <title>Login | Indian E-Shop</title>
      </Helmet>

      <div className="min-h-screen bg-green-50 flex items-center justify-center py-12">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
            Welcome Back 
          </h1>

          {err && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {err}
            </div>
          )}

          {/* Email Input */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              name="email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={inputClasses}
              placeholder=" "
            />
            <label htmlFor="email" className={labelClasses}>
              Email Address
            </label>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={inputClasses}
              placeholder=" "
            />
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <Link
            to="/register"
            className="text-sm text-green-700 underline block mb-4"
          >
            Forgot password?
          </Link>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={isLoading} className={buttonClasses}>
              {isLoading ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                'Login'
              )}
            </button>

            <button
              type="button"
              onClick={() => handleLogin(loginData)}
              className={buttonClasses}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                'Demo Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
