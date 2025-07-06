import { Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/books/BookCard';

const Home = () => {
  const { books, loading } = useBooks();
  
  // Mostrar libros destacados (mejor calificados)
  const featuredBooks = books
    .filter(book => book.rating >= 4.5)
    .slice(0, 6);

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__hero-title">Bienvenido a BiblioTech</h1>
          <p className="home__hero-subtitle">
            Descubre, compra y alquila miles de libros digitales
          </p>
          <Link to="/books" className="home__hero-btn">
            Explorar Catálogo
          </Link>
        </div>
      </section>

      <section className="home__featured">
        <h2 className="home__section-title">Libros Destacados</h2>
        
        {loading ? (
          <div className="home__loading">Cargando libros destacados...</div>
        ) : (
          <div className="home__featured-grid">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      <section className="home__stats">
        <div className="home__stats-grid">
          <div className="home__stat">
            <h3 className="home__stat-number">10,000+</h3>
            <p className="home__stat-label">Libros Disponibles</p>
          </div>
          <div className="home__stat">
            <h3 className="home__stat-number">500+</h3>
            <p className="home__stat-label">Autores</p>
          </div>
          <div className="home__stat">
            <h3 className="home__stat-number">50+</h3>
            <p className="home__stat-label">Categorías</p>
          </div>
          <div className="home__stat">
            <h3 className="home__stat-number">24/7</h3>
            <p className="home__stat-label">Acceso Digital</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;