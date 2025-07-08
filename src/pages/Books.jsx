import React, { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import SearchBar from '../components/filters/SearchBar';
import AdvancedFilters from '../components/filters/AdvancedFilters';
import BookList from '../components/books/BookList';
import Loading from '../components/common/Loading';

const Books = () => {
  const { books, loading, filters, updateFilters, resetFilters, filteredCount, totalBooks } = useBooks();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Verificar si hay filtros activos (además de search)
  const hasActiveFilters = Object.keys(filters).some(key => 
    key !== 'search' && filters[key] && 
    (Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key] !== '')
  );

  return (
    <div className="books-page">
      <div className="books-page__header">
        <h1 className="books-page__title">Catálogo de Libros</h1>
        <p className="books-page__subtitle">
          Mostrando {filteredCount} de {totalBooks} libros
        </p>
      </div>

      <div className="books-page__search">
        <SearchBar onSearch={handleSearch} initialValue={filters.search} />
        <button 
          className={`books-page__filter-toggle ${
            hasActiveFilters ? 'books-page__filter-toggle--active' : ''
          }`}
          onClick={toggleFilters}
          aria-expanded={showFilters}
          aria-label={`${showFilters ? 'Ocultar' : 'Mostrar'} filtros avanzados`}
        >
          <span aria-hidden="true">
            {showFilters ? '🔼' : '🔽'}
          </span>
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          {hasActiveFilters && !showFilters && (
            <span className="books-page__filter-indicator" aria-label="Filtros activos">
              ●
            </span>
          )}
        </button>
      </div>

      <div className={`books-page__content ${loading ? 'books-page__content--loading' : ''}`}>
        {showFilters && (
          <aside 
            className="books-page__filters"
            role="complementary"
            aria-label="Filtros de búsqueda"
          >
            <AdvancedFilters
              filters={filters}
              onFiltersChange={updateFilters}
              onReset={resetFilters}
            />
          </aside>
        )}

        <main className="books-page__main" role="main">
          {loading ? (
            <Loading message="Cargando catálogo..." />
          ) : (
            <BookList books={books} loading={loading} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Books;