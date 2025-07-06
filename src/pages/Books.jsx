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
          className="books-page__filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
        </button>
      </div>

      <div className="books-page__content">
        {showFilters && (
          <aside className="books-page__filters">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={updateFilters}
              onReset={resetFilters}
            />
          </aside>
        )}

        <main className="books-page__main">
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