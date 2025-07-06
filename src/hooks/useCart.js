import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (book, type = 'rent') => {
    const existingItem = cartItems.find(item => item.id === book.id && item.type === type);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === book.id && item.type === type
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        ...book,
        type,
        quantity: 1,
        rentDays: type === 'rent' ? 7 : 0
      }]);
    }
  };

  const removeFromCart = (bookId, type) => {
    setCartItems(cartItems.filter(item => !(item.id === bookId && item.type === type)));
  };

  const updateQuantity = (bookId, type, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId, type);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === bookId && item.type === type
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const updateRentDays = (bookId, days) => {
    setCartItems(cartItems.map(item =>
      item.id === bookId && item.type === 'rent'
        ? { ...item, rentDays: days }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.type === 'rent' 
        ? (item.price * 0.1 * item.rentDays) 
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateRentDays,
    getTotalPrice,
    clearCart,
    getTotalItems
  };
};