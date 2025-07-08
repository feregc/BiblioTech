import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";

const Header = () => {
  const location = useLocation();
  const { getTotalItems, setIsCartOpen } = useCartContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Cerrar menú cuando cambie la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.header__container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <h1 className="header__title">BiblioTech</h1>
        </Link>

        {/* Botón hamburguesa - solo visible en móvil */}
        <button 
          className={`header__hamburger ${isMenuOpen ? 'header__hamburger--active' : ''}`}
          onClick={toggleMenu}
          aria-label="Abrir menú de navegación"
          aria-expanded={isMenuOpen}
        >
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
        </button>

        {/* Menú desplegable */}
        <div className={`header__menu ${isMenuOpen ? 'header__menu--open' : ''}`}>
          <nav className="header__nav" role="navigation">
            <Link
              to="/"
              className={`header__link ${
                location.pathname === "/" ? "header__link--active" : ""
              }`}
              onClick={closeMenu}
              aria-current={location.pathname === "/" ? "page" : undefined}
            >
              Inicio
            </Link>
            <Link
              to="/books"
              className={`header__link ${
                location.pathname === "/books" ? "header__link--active" : ""
              }`}
              onClick={closeMenu}
              aria-current={location.pathname === "/books" ? "page" : undefined}
            >
              Libros
            </Link>
            <Link
              to="/profile"
              className={`header__link ${
                location.pathname === "/profile" ? "header__link--active" : ""
              }`}
              onClick={closeMenu}
              aria-current={location.pathname === "/profile" ? "page" : undefined}
            >
              Perfil
            </Link>
          </nav>

          <div className="header__actions">
            <button 
              className="header__cart-btn" 
              onClick={handleCartClick}
              aria-label={`Abrir carrito con ${getTotalItems()} elementos`}
            >
              <span className="header__cart-icon" aria-hidden="true">🛒</span>
              <span className="header__cart-text">
                Carrito ({getTotalItems()})
              </span>
            </button>
          </div>
        </div>

        {/* Overlay para cerrar el menú */}
        {isMenuOpen && <div className="header__overlay" onClick={closeMenu}></div>}
      </div>
    </header>
  );
};

export default Header;