// src/pages/Wishlist/Wishlist.jsx
import { useContext, useEffect, useState } from 'react';
import { wishlistContext } from '../../context/Wishlist/Wishlist';
import { cartContext } from '../../context/Cart/Cart';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { getWishlist, deleteWishlistItem } = useContext(wishlistContext);
  const { addProduct } = useContext(cartContext);
  const [wishlistProducts, setWishlistProducts] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      const products = await getWishlist();
      setWishlistProducts(products);
    };
    loadWishlist();
  }, []);

  const handleDelete = async (id) => {
    await deleteWishlistItem(id);
    setWishlistProducts((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="container flex flex-wrap">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-16 py-3"><span className="sr-only">Image</span></th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlistProducts ? (
              wishlistProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-xl font-bold">
                    <i className="fas fa-box-open me-3"></i>Wow, such empty!
                  </td>
                </tr>
              ) : (
                wishlistProducts.map((product) => (
                  <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="p-4">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.imageCover}
                          alt={product.title}
                          className="w-16 md:w-32 max-w-full max-h-full rounded-lg"
                        />
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      <Link to={`/product/${product._id}`} className="hover:underline">
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => addProduct(product)}
                          className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                          <i className="fas fa-cart-plus me-2"></i>Add to cart
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  <Spinner />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
