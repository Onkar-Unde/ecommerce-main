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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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
      key: 'rzp_test_55dbdW22BS4hIU', // Replace with your Razorpay key
      amount: booking.totalPrice * 100,
      currency: 'INR',
      name: 'FreshCart',
      description: `Order for ${booking.productName}`,
      prefill: {
        email: user?.email || '',
        contact: values.phone,
      },
      handler: () => {
        setIsLoading(false);
        setConfettiOn(true);
        setPaymentSuccess(true);
        emptyCart();

        setTimeout(() => {
          setConfettiOn(false);
        }, 5000);
      },
      theme: { color: '#10b981' }, // Tailwind green-500
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
      <div className="max-w-xl mx-auto py-12 px-6 bg-white shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Checkout</h1>

        {paymentSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center font-medium">
            🎉 Payment Successful! Thank you for your order.
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Details */}
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
            <input
              type="text"
              name="details"
              id="details"
              {...formik.getFieldProps('details')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., Leave at the door"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Address *</label>
            <input
              type="text"
              name="city"
              id="city"
              {...formik.getFieldProps('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Enter your city or address"
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.city}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              {...formik.getFieldProps('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="e.g., 9876543210"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Proceed to Pay'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
