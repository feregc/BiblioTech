import React from 'react';
import { useCartContext } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext'; // Nuevo import
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Modal from '../common/Modal';
import CartItem from './CartItem';

const Cart = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    getTotalPrice, 
    clearCart, 
    getTotalItems 
  } = useCartContext();

  const { addNotification } = useNotification(); // Nuevo hook
  
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage('purchaseHistory', []);
  const [rentalHistory, setRentalHistory] = useLocalStorage('rentalHistory', []);

  const handleCheckout = () => {
    const purchases = cartItems.filter(item => item.type === 'buy');
    const rentals = cartItems.filter(item => item.type === 'rent');
    
    // Procesar compras
    const newPurchases = purchases.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      id: Date.now() + Math.random()
    }));
    
    // Procesar alquileres
    const newRentals = rentals.map(item => ({
      ...item,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + (item.rentDays * 24 * 60 * 60 * 1000)).toISOString(),
      id: Date.now() + Math.random()
    }));
    
    setPurchaseHistory([...purchaseHistory, ...newPurchases]);
    setRentalHistory([...rentalHistory, ...newRentals]);
    
    clearCart();
    
    // Mostrar notificación personalizada en lugar de alert
    addNotification({
      type: 'success',
      title: '¡Compra realizada!',
      message: `Se procesaron ${purchases.length} compras y ${rentals.length} alquileres exitosamente.`,
      duration: 6000
    });
    
    setIsCartOpen(false);
  };

  return (
    <Modal
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title={`Carrito (${getTotalItems()} items)`}
    >
      <div className="cart">
        {cartItems.length === 0 ? (
          <div className="cart__empty">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {cartItems.map(item => (
                <CartItem 
                  key={`${item.id}-${item.type}`} 
                  item={item} 
                />
              ))}
            </div>
            
            <div className="cart__summary">
              <div className="cart__total">
                <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
              </div>
              
              <div className="cart__actions">
                <button 
                  className="cart__btn cart__btn--clear"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </button>
                <button 
                  className="cart__btn cart__btn--checkout"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default Cart;