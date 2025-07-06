import React from 'react';
import { useCartContext } from '../../contexts/CartContext'; // Usar el contexto

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity, updateRentDays } = useCartContext(); // Cambio aquí

  const itemPrice = item.type === 'rent' 
    ? (item.price * 0.1 * item.rentDays) 
    : item.price;

  const totalPrice = itemPrice * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <h3 className="cart-item__title">{item.title}</h3>
        <p className="cart-item__author">{item.author}</p>
        <p className="cart-item__type">
          {item.type === 'buy' ? 'Compra' : `Alquiler (${item.rentDays} días)`}
        </p>
      </div>
      
      <div className="cart-item__controls">
        <div className="cart-item__quantity">
          <button
            className="cart-item__qty-btn"
            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
          >
            -
          </button>
          <span className="cart-item__qty-value">{item.quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
          >
            +
          </button>
        </div>
        
        {item.type === 'rent' && (
          <div className="cart-item__rent-days">
            <label className="cart-item__label">Días:</label>
            <select
              className="cart-item__select"
              value={item.rentDays}
              onChange={(e) => updateRentDays(item.id, parseInt(e.target.value))}
            >
              <option value={7}>7 días</option>
              <option value={14}>14 días</option>
              <option value={30}>30 días</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="cart-item__price">
        <span className="cart-item__price-unit">€{itemPrice.toFixed(2)}</span>
        <span className="cart-item__price-total">€{totalPrice.toFixed(2)}</span>
      </div>
      
      <button
        className="cart-item__remove"
        onClick={() => removeFromCart(item.id, item.type)}
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;