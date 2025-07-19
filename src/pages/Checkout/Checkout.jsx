import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Confetti from 'react-confetti';
import { cartContext } from '../../context/Cart/Cart';
import { authContext } from '../../context/Auth/Auth';

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [confettiOn, setConfettiOn] = useState(false);
  const { emptyCart, cart } = useContext(cartContext);
  const { user } = useContext(authContext);

  useEffect(() => {

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const formik = useFormik({
    initialValues: { city: '', details: '', phone: '' },
    validationSchema: Yup.object({
      city: Yup.string().required('Address is required').min(3, 'Min 3 characters'),
      details: Yup.string(),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[6-9]\d{9}$/, 'Invalid phone number'),
    }),
    onSubmit: (values) => handlePayment(values),
  });

  const handlePayment = (values) => {
    setIsLoading(true);

    const booking = {
      productName: cart.products.map(p => p.product.title).join(', '),
      totalPrice: cart.totalCartPrice,
    };

    const options = {
      key: 'rzp_test_55dbdW22BS4hIU', 
      amount: booking.totalPrice * 100,
      currency: 'INR',
      name: 'FreshCart',
      description: `Order for ${booking.productName}`,
      prefill: {
        email: user?.email || '',
        contact: values.phone,
      },
      handler: (response) => {
        setIsLoading(false);
        setConfettiOn(true);
        emptyCart();
        setTimeout(() => {
          setConfettiOn(false);
          window.location.href = '/orders';
        }, 4000);
      },
      theme: { color: '#0d6efd' },
    };

    if (!window.Razorpay) {
      alert('Payment SDK failed to load. Are you online?');
      setIsLoading(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Helmet><title>Checkout</title></Helmet>
      {confettiOn && <Confetti />}
      <div className="container py-10">
        <h1 className="text-2xl mb-5 font-bold">Checkout</h1>
        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto space-y-5">
          <div>
            <input
              type="text"
              name="details"
              placeholder="Details (optional)"
              {...formik.getFieldProps('details')}
              className="input-field"
            />
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="Address *"
              {...formik.getFieldProps('city')}
              className="input-field"
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-red-600">{formik.errors.city}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              {...formik.getFieldProps('phone')}
              className="input-field"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-600">{formik.errors.phone}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 font-medium text-white rounded ${
              isLoading ? 'bg-gray-500' : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Checkout'}
          </button>
        </form>
      </div>
    </>
  );
}
