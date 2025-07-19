import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/Auth/Auth';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

export default function Register() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserToken } = useContext(authContext);
  const navigate = useNavigate();

  function handleRegister(data) {
    setIsLoading(true);
    axios
      .post('http://localhost:3000/api/v1/auth/signup', data)
      .then((res) => {
        toast.success('Registration Successful!');
        setUserToken(res.data.token);
        localStorage.setItem('authToken', res.data.token);
        setErr(null);
        setIsLoading(false);
        if (res.data.message === 'success') navigate('/login');
      })
      .catch((err) => {
        toast.error('Try Again!');
        setIsLoading(false);
        setErr(err.response?.data?.message || 'Registration failed');
      });
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required').min(3, 'Min 3 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Min 8 characters')
      .matches(/[A-Za-z]/, 'Include a letter')
      .matches(/\d/, 'Include a number')
      .matches(/[!@#$%^&*(),.?":{}|<>+\-_]/, 'Include a special character')
      .required('Password is required'),
    rePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
    phone: Yup.string()
      .required('Phone is required')
      .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', rePassword: '', phone: '' },
    validationSchema,
    onSubmit: handleRegister,
  });

  const inputClasses = `
    block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent 
    border-0 border-b-2 border-gray-300 appearance-none 
    dark:text-white dark:border-gray-600 dark:focus:border-green-500 
    focus:outline-none focus:ring-0 focus:border-green-600 peer
  `;

  const labelClasses = `
    absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
    -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 
    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 
    peer-focus:text-green-600 peer-focus:dark:text-green-500
  `;

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div className="min-h-screen bg-green-50 flex items-center justify-center py-12">
        <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Create Account 🇮🇳</h1>
          {err && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{err}</div>}

          {['name', 'email', 'phone'].map((field) => (
            <div key={field} className="relative z-0 w-full mb-6 group">
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                id={field}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
                className={inputClasses}
                placeholder={field === 'phone' ? '' : ' '}
              />
              <label htmlFor={field} className={labelClasses}>
                {field === 'phone' ? 'Mobile Number (India)' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}

          {/* Password */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={inputClasses}
              placeholder=" "
            />
            <label htmlFor="password" className={labelClasses}>Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-3 text-xs text-gray-500"
            >
              {showPassword ? 'Hide' : ''}
            </button>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              name="rePassword"
              id="rePassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rePassword}
              className={inputClasses}
              placeholder=" "
            />
            <label htmlFor="rePassword" className={labelClasses}>Confirm Password</label>
            {formik.touched.rePassword && formik.errors.rePassword && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.rePassword}</div>
            )}
          </div>

          <button type="submit" disabled={isLoading} className={`
            w-full text-white bg-green-700 hover:bg-green-800 
            font-semibold rounded-lg text-sm px-5 py-2.5 transition-all duration-200
          `}>
            {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Register & Start Shopping'}
          </button>
        </form>
      </div>
    </>
  );
}
