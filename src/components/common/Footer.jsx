import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h3 className="footer__title">BiblioTech</h3>
          <p className="footer__description">
            Tu biblioteca digital favorita. Miles de libros al alcance de un clic.
          </p>
        </div>
        
        <div className="footer__section">
          <h4 className="footer__subtitle">Enlaces</h4>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Sobre nosotros</a></li>
            <li><a href="#" className="footer__link">Contacto</a></li>
            <li><a href="#" className="footer__link">Términos</a></li>
            <li><a href="#" className="footer__link">Privacidad</a></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h4 className="footer__subtitle">Soporte</h4>
          <ul className="footer__links">
            <li><a href="#" className="footer__link">Ayuda</a></li>
            <li><a href="#" className="footer__link">FAQ</a></li>
            <li><a href="#" className="footer__link">Devoluciones</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p className="footer__copyright">
          © 2024 BiblioTech. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;