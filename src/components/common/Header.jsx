import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext"; // Usar el contexto

const Header = () => {
  const location = useLocation();
  const { getTotalItems, setIsCartOpen } = useCartContext(); // Cambio aquí

  const handleCartClick = () => {
   
    setIsCartOpen(true);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <h1 className="header__title">BiblioTech</h1>
        </Link>

        <nav className="header__nav">
          <Link
            to="/"
            className={`header__link ${
              location.pathname === "/" ? "header__link--active" : ""
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/books"
            className={`header__link ${
              location.pathname === "/books" ? "header__link--active" : ""
            }`}
          >
            Libros
          </Link>
          <Link
            to="/profile"
            className={`header__link ${
              location.pathname === "/profile" ? "header__link--active" : ""
            }`}
          >
            Perfil
          </Link>
        </nav>

        <div className="header__actions">
          <button className="header__cart-btn" onClick={handleCartClick}>
            🛒 Carrito ({getTotalItems()})
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;