// src/context/Cart/Cart.jsx
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export const cartContext = createContext(null);

export default function CartContextProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart
      ? JSON.parse(storedCart)
      : { products: [], totalCartPrice: 0 };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = (products) =>
    products.reduce((total, item) => total + item.count * item.price, 0);

  const getProducts = () => Promise.resolve(cart);

  const addProduct = (product) => {
    if (!product || !product._id || typeof product.price !== 'number') {
      toast.error('Invalid product data');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.products.find(
        (p) => p.product._id === product._id
      );

      let updatedProducts;
      if (existing) {
        updatedProducts = prevCart.products.map((p) =>
          p.product._id === product._id ? { ...p, count: p.count + 1 } : p
        );
      } else {
        updatedProducts = [
          ...prevCart.products,
          {
            product: {
              _id: product._id,
              title: product.title ?? 'Untitled Product',
              imageCover: product.imageCover ?? '',
            },
            price: product.price,
            count: 1,
          },
        ];
      }

      const updatedCart = {
        products: updatedProducts,
        totalCartPrice: calculateTotal(updatedProducts),
      };

      toast.success(`${product.title} added to cart!`);
      return updatedCart;
    });
  };

  const deleteProduct = (productId) => {
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.filter(
        (p) => p.product._id !== productId
      );
      const updatedCart = {
        products: updatedProducts,
        totalCartPrice: calculateTotal(updatedProducts),
      };
      toast.success('Product removed!');
      return updatedCart;
    });
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity <= 0) return deleteProduct(productId);

    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((p) =>
        p.product._id === productId ? { ...p, count: quantity } : p
      );

      const updatedCart = {
        products: updatedProducts,
        totalCartPrice: calculateTotal(updatedProducts),
      };

      toast.success('Quantity updated!');
      return updatedCart;
    });
  };

  const emptyCart = () => {
    setCart({ products: [], totalCartPrice: 0 });
    toast.success('Cart cleared!');
  };

  return (
    <cartContext.Provider
      value={{
        getProducts,
        addProduct,
        deleteProduct,
        updateProductQuantity,
        emptyCart,
        cart,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}
