import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksData } from '../data/booksData';
import { useCartContext } from '../contexts/CartContext'; 
import Modal from '../components/common/Modal';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [rentDays, setRentDays] = useState(7);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    const foundBook = booksData.find(b => b.id === parseInt(id));
    setBook(foundBook);
    setLoading(false);
  }, [id]);

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
  };

  const handlePurchaseConfirm = () => {
    addToCart(book, 'buy');
    setShowPurchaseModal(false);
  };

  if (loading) {
    return <div className="book-details__loading">Cargando...</div>;
  }

  if (!book) {
    return (
      <div className="book-details__error">
        <h2>Libro no encontrado</h2>
        <button onClick={() => navigate('/books')}>Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div className="book-details">
      <div className="book-details__container">
        <div className="book-details__image-section">
          <img 
            src={book.image || '/images/default-book.jpg'} 
            alt={book.title}
            className="book-details__image"
          />
        </div>

        <div className="book-details__info-section">
          <div className="book-details__header">
            <h1 className="book-details__title">{book.title}</h1>
            <p className="book-details__author">por {book.author}</p>
            
            <div className="book-details__rating">
              <span className="book-details__stars">
                {'⭐'.repeat(Math.floor(book.rating))}
              </span>
              <span className="book-details__rating-number">({book.rating})</span>
            </div>
          </div>

          <div className="book-details__meta">
            <div className="book-details__meta-item">
              <span className="book-details__meta-label">Categoría:</span>
              <span className="book-details__meta-value">{book.category}</span>
            </div>
            <div className="book-details__meta-item">
              <span className="book-details__meta-label">Año:</span>
              <span className="book-details__meta-value">{book.year}</span>
            </div>
            <div className="book-details__meta-item">
              <span className="book-details__meta-label">Páginas:</span>
              <span className="book-details__meta-value">{book.pages}</span>
            </div>
            <div className="book-details__meta-item">
              <span className="book-details__meta-label">Idioma:</span>
              <span className="book-details__meta-value">{book.language}</span>
            </div>
            <div className="book-details__meta-item">
              <span className="book-details__meta-label">Editorial:</span>
              <span className="book-details__meta-value">{book.publisher}</span>
            </div>
            <div className="book-details__meta-item">
              <span className="book-details__meta-label">ISBN:</span>
              <span className="book-details__meta-value">{book.isbn}</span>
            </div>
          </div>

          <div className="book-details__pricing">
            <div className="book-details__price-item">
              <span className="book-details__price-label">Comprar:</span>
              <span className="book-details__price-value">${book.price}</span>
            </div>
            <div className="book-details__price-item">
              <span className="book-details__price-label">Alquilar:</span>
              <span className="book-details__price-value">${(book.price * 0.1).toFixed(2)}/día</span>
            </div>
          </div>

          <div className="book-details__actions">
            {book.available ? (
              <>
                <button 
                  className="book-details__btn book-details__btn--buy"
                  onClick={() => handleAddToCart('buy')}
                >
                  Comprar
                </button>
                <button 
                  className="book-details__btn book-details__btn--rent"
                  onClick={() => handleAddToCart('rent')}
                >
                  Alquilar
                </button>
                <button 
                  className="book-details__btn book-details__btn--cart"
                  onClick={() => addToCart(book, 'buy')}
                >
                  Añadir al Carrito
                </button>
              </>
            ) : (
              <button className="book-details__btn book-details__btn--disabled" disabled>
                No disponible
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="book-details__tabs">
        <div className="book-details__tab-buttons">
          <button
            className={`book-details__tab-btn ${activeTab === 'description' ? 'book-details__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Descripción
          </button>
          <button
            className={`book-details__tab-btn ${activeTab === 'details' ? 'book-details__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Detalles
          </button>
        </div>

        <div className="book-details__tab-content">
          {activeTab === 'description' && (
            <div className="book-details__description">
              <p>{book.description}</p>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="book-details__details">
              <h3>Información Técnica</h3>
              <ul>
                <li>Formato: Digital</li>
                <li>Tamaño: {Math.round(book.pages * 0.5)} MB</li>
                <li>Protección: DRM</li>
                <li>Dispositivos: Ilimitados</li>
              </ul>
            </div>
          )}
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
            <strong>Total: ${(book.price * 0.1 * rentDays).toFixed(2)}</strong>
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
            <strong>Total: ${book.price}</strong>
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
    </div>
  );
};

export default BookDetails;