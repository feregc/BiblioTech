import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { useNotification } from '../../contexts/NotificationContext'; // Nuevo import
import Modal from '../common/Modal';

const BookCard = ({ book }) => {
  const { addToCart } = useCartContext();
  const { addNotification } = useNotification(); // Nuevo hook
  const [showRentModal, setShowRentModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [rentDays, setRentDays] = useState(7);

  const handleAddToCart = (type) => {
    if (type === 'rent') {
      setShowRentModal(true);
    } else if (type === 'buy') {
      setShowPurchaseModal(true);
    }
  };

  const handleRentConfirm = () => {
    const bookWithRentDays = { ...book, rentDays };
    addToCart(bookWithRentDays, 'rent');
    setShowRentModal(false);
    
    // Notificación para alquiler directo
    addNotification({
      type: 'success',
      title: '¡Alquiler confirmado!',
      message: `"${book.title}" alquilado por ${rentDays} días. Total: €${(book.price * 0.1 * rentDays).toFixed(2)}`,
      duration: 5000
    });
  };

  const handlePurchaseConfirm = () => {
    addToCart(book, 'buy');
    setShowPurchaseModal(false);
    
    // Notificación para compra directa
    addNotification({
      type: 'success',
      title: '¡Compra confirmada!',
      message: `"${book.title}" comprado por €${book.price}`,
      duration: 5000
    });
  };

  // Función para añadir al carrito con notificación
  const handleAddToCartWithNotification = (type) => {
    if (type === 'rent') {
      const bookWithRentDays = { ...book, rentDays: 7 }; // Días por defecto
      addToCart(bookWithRentDays, 'rent');
      
      addNotification({
        type: 'info',
        title: 'Libro añadido al carrito',
        message: `"${book.title}" añadido para alquiler (7 días por defecto)`,
        duration: 4000
      });
    } else {
      addToCart(book, 'buy');
      
      addNotification({
        type: 'info',
        title: 'Libro añadido al carrito',
        message: `"${book.title}" añadido para compra`,
        duration: 4000
      });
    }
  };

  // Función para manejar libros no disponibles
  const handleUnavailableBook = () => {
    addNotification({
      type: 'warning',
      title: 'Libro no disponible',
      message: `"${book.title}" no está disponible en este momento`,
      duration: 3000
    });
  };

  return (
    <>
      <div className="book-card">
        <div className="book-card__image-container">
          <img 
            src={book.image || '/images/default-book.jpg'} 
            alt={book.title}
            className="book-card__image"
          />
          {!book.available && (
            <div className="book-card__overlay">No disponible</div>
          )}
        </div>
        
        <div className="book-card__content">
          <h3 className="book-card__title">{book.title}</h3>
          <p className="book-card__author">{book.author}</p>
          <p className="book-card__category">{book.category}</p>
          
          <div className="book-card__rating">
            <span className="book-card__stars">
              {'⭐'.repeat(Math.floor(book.rating))}
            </span>
            <span className="book-card__rating-number">({book.rating})</span>
          </div>
          
          <div className="book-card__price">
            <span className="book-card__price-buy">Comprar: €{book.price}</span>
            <span className="book-card__price-rent">Alquilar: €{(book.price * 0.1).toFixed(2)}/día</span>
          </div>
          
          <div className="book-card__actions">
            <Link 
              to={`/book/${book.id}`}
              className="book-card__btn book-card__btn--detail"
            >
              Ver Detalles
            </Link>
            
            {book.available ? (
              <>
                <button 
                  className="book-card__btn book-card__btn--buy"
                  onClick={() => handleAddToCart('buy')}
                >
                  Comprar
                </button>
                <button 
                  className="book-card__btn book-card__btn--rent"
                  onClick={() => handleAddToCart('rent')}
                >
                  Alquilar
                </button>
                <button 
                  className="book-card__btn book-card__btn--cart"
                  onClick={() => handleAddToCartWithNotification('buy')}
                >
                  Añadir al Carrito
                </button>
              </>
            ) : (
              <button 
                className="book-card__btn book-card__btn--unavailable"
                onClick={handleUnavailableBook}
              >
                No Disponible
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Alquiler */}
      <Modal
        isOpen={showRentModal}
        onClose={() => setShowRentModal(false)}
        title="Configurar Alquiler"
      >
        <div className="rent-modal">
          <div className="rent-modal__book-info">
            <h3>{book.title}</h3>
            <p>por {book.author}</p>
          </div>
          
          <div className="rent-modal__config">
            <label className="rent-modal__label">
              Días de alquiler:
              <select
                className="rent-modal__select"
                value={rentDays}
                onChange={(e) => setRentDays(parseInt(e.target.value))}
              >
                <option value={7}>7 días</option>
                <option value={14}>14 días</option>
                <option value={30}>30 días</option>
              </select>
            </label>
          </div>
          
          <div className="rent-modal__total">
            <strong>Total: €{(book.price * 0.1 * rentDays).toFixed(2)}</strong>
          </div>
          
          <div className="rent-modal__actions">
            <button 
              className="rent-modal__btn rent-modal__btn--cancel"
              onClick={() => setShowRentModal(false)}
            >
              Cancelar
            </button>
            <button 
              className="rent-modal__btn rent-modal__btn--cart"
              onClick={() => {
                const bookWithRentDays = { ...book, rentDays };
                addToCart(bookWithRentDays, 'rent');
                setShowRentModal(false);
                
                // Notificación para añadir al carrito desde modal
                addNotification({
                  type: 'info',
                  title: 'Añadido al carrito',
                  message: `"${book.title}" añadido para alquiler (${rentDays} días)`,
                  duration: 4000
                });
              }}
            >
              Añadir al Carrito
            </button>
            <button 
              className="rent-modal__btn rent-modal__btn--confirm"
              onClick={handleRentConfirm}
            >
              Confirmar Alquiler
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Compra */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Confirmar Compra"
      >
        <div className="purchase-modal">
          <div className="purchase-modal__book-info">
            <h3>{book.title}</h3>
            <p>por {book.author}</p>
          </div>
          
          <div className="purchase-modal__details">
            <div className="purchase-modal__detail-item">
              <span className="purchase-modal__detail-label">Formato:</span>
              <span className="purchase-modal__detail-value">Digital (PDF/EPUB)</span>
            </div>
            <div className="purchase-modal__detail-item">
              <span className="purchase-modal__detail-label">Licencia:</span>
              <span className="purchase-modal__detail-value">Permanente</span>
            </div>
            <div className="purchase-modal__detail-item">
              <span className="purchase-modal__detail-label">Dispositivos:</span>
              <span className="purchase-modal__detail-value">Hasta 5 dispositivos</span>
            </div>
          </div>
          
          <div className="purchase-modal__total">
            <strong>Total: €{book.price}</strong>
          </div>
          
          <div className="purchase-modal__actions">
            <button 
              className="purchase-modal__btn purchase-modal__btn--cancel"
              onClick={() => setShowPurchaseModal(false)}
            >
              Cancelar
            </button>
            <button 
              className="purchase-modal__btn purchase-modal__btn--cart"
              onClick={() => {
                addToCart(book, 'buy');
                setShowPurchaseModal(false);
                
                // Notificación para añadir al carrito desde modal
                addNotification({
                  type: 'info',
                  title: 'Añadido al carrito',
                  message: `"${book.title}" añadido para compra`,
                  duration: 4000
                });
              }}
            >
              Añadir al Carrito
            </button>
            <button 
              className="purchase-modal__btn purchase-modal__btn--confirm"
              onClick={handlePurchaseConfirm}
            >
              Confirmar Compra
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookCard;