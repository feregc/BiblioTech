import { useState } from 'react';
import { useCartContext } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext'; // Nuevo import
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from '../components/common/Modal';

const Profile = () => {
  const { cartItems, clearCart } = useCartContext();
  const { addNotification } = useNotification(); // Nuevo hook
  const [purchaseHistory, setPurchaseHistory] = useLocalStorage('purchaseHistory', []);
  const [rentalHistory, setRentalHistory] = useLocalStorage('rentalHistory', []);
  const [activeTab, setActiveTab] = useState('current');
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [extensionDays, setExtensionDays] = useState(7);

  const currentRentals = rentalHistory.filter(rental => {
    const endDate = new Date(rental.endDate);
    return endDate > new Date();
  });

  const expiredRentals = rentalHistory.filter(rental => {
    const endDate = new Date(rental.endDate);
    return endDate <= new Date();
  });

  const handleExtendRental = (rental) => {
    setSelectedRental(rental);
    setShowExtendModal(true);
  };

  const confirmExtension = () => {
    if (!selectedRental) return;

    // Calcular nueva fecha de vencimiento
    const currentEndDate = new Date(selectedRental.endDate);
    const newEndDate = new Date(currentEndDate.getTime() + (extensionDays * 24 * 60 * 60 * 1000));
    const extensionCost = (selectedRental.price * 0.1 * extensionDays).toFixed(2);

    // Actualizar el alquiler en el historial
    const updatedRentals = rentalHistory.map(rental => 
      rental.id === selectedRental.id 
        ? { 
            ...rental, 
            endDate: newEndDate.toISOString(),
            rentDays: rental.rentDays + extensionDays,
            extensionCost: extensionCost
          }
        : rental
    );

    setRentalHistory(updatedRentals);
    setShowExtendModal(false);
    setSelectedRental(null);
    
    // Notificación de éxito para extensión
    addNotification({
      type: 'success',
      title: '¡Alquiler extendido!',
      message: `"${selectedRental.title}" extendido por ${extensionDays} días. Nuevo vencimiento: ${newEndDate.toLocaleDateString()}`,
      duration: 6000
    });
  };

  const handleRentAgain = (book) => {
    // Notificación informativa para alquilar de nuevo
    addNotification({
      type: 'info',
      title: 'Redirigiendo...',
      message: `Preparando alquiler de "${book.title}". Serás redirigido al catálogo.`,
      duration: 4000
    });
    
    // Aquí normalmente harías la redirección
    // navigate(`/book/${book.id}`) o similar
  };

  const handleReadBook = (book, type) => {
    // Notificación cuando se inicia la lectura
    addNotification({
      type: 'info',
      title: 'Abriendo libro',
      message: `Iniciando lectura de "${book.title}"`,
      duration: 3000
    });
    
    // Aquí abririass el lector o redirigirías
  };

  const handleDownloadBook = (book) => {
    // Notificación para descarga
    addNotification({
      type: 'success',
      title: 'Descarga iniciada',
      message: `Descargando "${book.title}" en formato PDF/EPUB`,
      duration: 4000
    });
    
    // Aquí iniciarías la descarga real
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Notificaciones informativas opcionales para cambios de tab
    const tabMessages = {
      'current': currentRentals.length > 0 ? `Tienes ${currentRentals.length} alquileres activos` : 'No tienes alquileres activos',
      'purchases': purchaseHistory.length > 0 ? `Tienes ${purchaseHistory.length} libros comprados` : 'No tienes compras registradas',
      'history': expiredRentals.length > 0 ? `${expiredRentals.length} alquileres en el historial` : 'No hay historial de alquileres'
    };

    if (tab !== 'current') { // Solo mostrar para tabs que no sean el actual
      addNotification({
        type: 'info',
        title: `Sección: ${tab === 'purchases' ? 'Compras' : 'Historial'}`,
        message: tabMessages[tab],
        duration: 2000
      });
    }
  };

  const getExpirationWarning = (rental) => {
    const endDate = new Date(rental.endDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3 && daysLeft > 0) {
      return {
        type: 'warning',
        message: `¡Expira en ${daysLeft} día${daysLeft > 1 ? 's' : ''}!`
      };
    } else if (daysLeft <= 0) {
      return {
        type: 'error',
        message: '¡Expirado!'
      };
    }
    return null;
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <h1 className="profile__title">Mi Perfil</h1>
        <p className="profile__subtitle">Gestiona tus libros y configuración</p>
      </div>

      <div className="profile__tabs">
        <button
          className={`profile__tab ${activeTab === 'current' ? 'profile__tab--active' : ''}`}
          onClick={() => handleTabChange('current')}
        >
          Alquileres Activos
          {currentRentals.length > 0 && (
            <span className="profile__tab-badge">{currentRentals.length}</span>
          )}
        </button>
        <button
          className={`profile__tab ${activeTab === 'purchases' ? 'profile__tab--active' : ''}`}
          onClick={() => handleTabChange('purchases')}
        >
          Compras
          {purchaseHistory.length > 0 && (
            <span className="profile__tab-badge">{purchaseHistory.length}</span>
          )}
        </button>
        <button
          className={`profile__tab ${activeTab === 'history' ? 'profile__tab--active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          Historial
          {expiredRentals.length > 0 && (
            <span className="profile__tab-badge">{expiredRentals.length}</span>
          )}
        </button>
      </div>

      <div className="profile__content">
        {activeTab === 'current' && (
          <div className="profile__section">
            <h2 className="profile__section-title">Alquileres Activos ({currentRentals.length})</h2>
            
            {currentRentals.length === 0 ? (
              <p className="profile__empty">No tienes alquileres activos</p>
            ) : (
              <div className="profile__list">
                {currentRentals.map(rental => {
                  const warning = getExpirationWarning(rental);
                  return (
                    <div key={rental.id} className="profile__item">
                      <div className="profile__item-info">
                        <h3 className="profile__item-title">{rental.title}</h3>
                        <p className="profile__item-author">{rental.author}</p>
                        <p className="profile__item-date">
                          Vence: {new Date(rental.endDate).toLocaleDateString()}
                          {warning && (
                            <span className={`profile__item-warning profile__item-warning--${warning.type}`}>
                              {warning.message}
                            </span>
                          )}
                        </p>
                        {rental.extensionCost && (
                          <p className="profile__item-extension">
                            Extensión aplicada (+€{rental.extensionCost})
                          </p>
                        )}
                      </div>
                      <div className="profile__item-actions">
                        <button 
                          className="profile__item-btn"
                          onClick={() => handleReadBook(rental, 'rental')}
                        >
                          Leer
                        </button>
                        <button 
                          className="profile__item-btn profile__item-btn--secondary"
                          onClick={() => handleExtendRental(rental)}
                        >
                          Extender
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="profile__section">
            <h2 className="profile__section-title">Mis Compras ({purchaseHistory.length})</h2>
            
            {purchaseHistory.length === 0 ? (
              <p className="profile__empty">No tienes compras registradas</p>
            ) : (
              <div className="profile__list">
                {purchaseHistory.map(purchase => (
                  <div key={purchase.id} className="profile__item">
                    <div className="profile__item-info">
                      <h3 className="profile__item-title">{purchase.title}</h3>
                      <p className="profile__item-author">{purchase.author}</p>
                      <p className="profile__item-date">
                        Comprado: {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </p>
                      <p className="profile__item-price">€{purchase.price}</p>
                    </div>
                    <div className="profile__item-actions">
                      <button 
                        className="profile__item-btn"
                        onClick={() => handleReadBook(purchase, 'purchase')}
                      >
                        Leer
                      </button>
                      <button 
                        className="profile__item-btn profile__item-btn--secondary"
                        onClick={() => handleDownloadBook(purchase)}
                      >
                        Descargar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="profile__section">
            <h2 className="profile__section-title">Historial de Alquileres</h2>
            
            {expiredRentals.length === 0 ? (
              <p className="profile__empty">No hay historial de alquileres</p>
            ) : (
              <div className="profile__list">
                {expiredRentals.map(rental => (
                  <div key={rental.id} className="profile__item profile__item--expired">
                    <div className="profile__item-info">
                      <h3 className="profile__item-title">{rental.title}</h3>
                      <p className="profile__item-author">{rental.author}</p>
                      <p className="profile__item-date">
                        Expiró: {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="profile__item-actions">
                      <button 
                        className="profile__item-btn"
                        onClick={() => handleRentAgain(rental)}
                      >
                        Alquilar de nuevo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Extensión */}
      <Modal
        isOpen={showExtendModal}
        onClose={() => {
          setShowExtendModal(false);
          setSelectedRental(null);
        }}
        title="Extender Alquiler"
      >
        {selectedRental && (
          <div className="extend-modal">
            <div className="extend-modal__book-info">
              <h3>{selectedRental.title}</h3>
              <p>por {selectedRental.author}</p>
              <p className="extend-modal__current-date">
                Vence actualmente: {new Date(selectedRental.endDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="extend-modal__config">
              <label className="extend-modal__label">
                Días adicionales:
                <select
                  className="extend-modal__select"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(parseInt(e.target.value))}
                >
                  <option value={7}>7 días</option>
                  <option value={14}>14 días</option>
                  <option value={30}>30 días</option>
                </select>
              </label>
            </div>

            <div className="extend-modal__new-date">
              <p>Nueva fecha de vencimiento: {
                new Date(new Date(selectedRental.endDate).getTime() + (extensionDays * 24 * 60 * 60 * 1000))
                  .toLocaleDateString()
              }</p>
            </div>
            
            <div className="extend-modal__cost">
              <strong>Costo de extensión: €{(selectedRental.price * 0.1 * extensionDays).toFixed(2)}</strong>
            </div>
            
            <div className="extend-modal__actions">
              <button 
                className="extend-modal__btn extend-modal__btn--cancel"
                onClick={() => {
                  setShowExtendModal(false);
                  setSelectedRental(null);
                  
                  // Notificación de cancelación
                  addNotification({
                    type: 'info',
                    title: 'Extensión cancelada',
                    message: 'No se realizaron cambios al alquiler',
                    duration: 2000
                  });
                }}
              >
                Cancelar
              </button>
              <button 
                className="extend-modal__btn extend-modal__btn--confirm"
                onClick={confirmExtension}
              >
                Confirmar Extensión
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Profile;