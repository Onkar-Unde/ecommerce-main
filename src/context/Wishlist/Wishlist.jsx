// src/context/Wishlist/WishlistContextProvider.jsx
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export const wishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (!exists) {
        toast.success('Added to wishlist!');
        return [...prev, product];
      } else {
        toast('Already in wishlist');
        return prev;
      }
    });
  };

  const deleteWishlistItem = (id) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      toast.success('Removed from wishlist!');
      return updated;
    });
  };

  const getWishlist = () => Promise.resolve(wishlist);

  return (
    <wishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        deleteWishlistItem,
        getWishlist
      }}
    >
      {children}
    </wishlistContext.Provider>
  );
}
