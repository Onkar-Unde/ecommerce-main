import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/Auth/Auth';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';

// ... (Imports same as your code)

export default function Register() {
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserToken } = useContext(authContext);
  const navigate = useNavigate();

  function handleRegister(data) {
    setIsLoading(true);
    axios
      .post('http://localhost:5000/api/v1/auth/signup', data)
      .then((res) => {
        setErr(null);
        toast.success('Registration Succesfully');
        setUserToken(res.data.token);
        localStorage.setItem('authToken', res.data.token);
        setIsLoading(false);
        if (res.data.message === 'success') {
          navigate('/login');
        }
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
      .min(8, 'Minimum 8 characters')
      .matches(/[A-Za-z]/, 'Include a letter')
      .matches(/\d/, 'Include a number')
      .matches(/[!@#$%^&*(),.?":{}|<>+\-_]/, 'Include a special character')
      .required('Password is required'),
    rePassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
    phone: Yup.string()
      .required('Mobile number is required')
      .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  const inputClasses = 'block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer transition-all duration-200';
  const labelClasses = 'peer-focus:font-medium absolute text-sm duration-300 transform scale-75 top-3 -z-10 origin-[0] peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6';

  return (
    <div className="min-h-screen bg-[#f7fafc] text-gray-900">
      <Helmet>
        <title>Register | Indian E-Shop</title>
      </Helmet>

      <div className="container mx-auto max-w-md py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-green-700">Create Your Account 🇮🇳</h1>
          {err && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4">{err}</div>}
        </div>

        <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow">
          {['name', 'email', 'phone'].map((field) => (
            <div className="relative z-0 w-full mb-5 group" key={field}>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                id={field}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field]}
                placeholder={field === 'phone' ? '9876543210' : ' '}
                className={`${inputClasses} border-gray-300`}
              />
              <label htmlFor={field} className={labelClasses}>
                {field === 'phone' ? 'Mobile Number (India)' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {formik.errors[field] && formik.touched[field] && (
                <div className="text-red-500 text-sm mt-1">{formik.errors[field]}</div>
              )}
            </div>
          ))}

          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder=" "
              className={`${inputClasses} border-gray-300`}
            />
            <label htmlFor="password" className={labelClasses}>Password</label>
            <button
              type="button"
              className="absolute right-2 top-3 text-xs text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="rePassword"
              id="rePassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rePassword}
              placeholder=" "
              className={`${inputClasses} border-gray-300`}
            />
            <label htmlFor="rePassword" className={labelClasses}>Confirm Password</label>
            {formik.errors.rePassword && formik.touched.rePassword && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.rePassword}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-green-700 hover:bg-green-800 font-semibold rounded-lg text-sm px-5 py-2.5"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              'Register & Start Shopping'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
