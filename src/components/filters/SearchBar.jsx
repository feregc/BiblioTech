import React, { useState, useEffect } from 'react';

const SearchBar = ({ 
  onSearch, 
  initialValue = '', 
  loading = false,
  hasResults = null,
  placeholder = "Buscar en cualquier campo del libro..."
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  // Determinar clases CSS dinámicas
  const getSearchBarClasses = () => {
    let classes = 'search-bar';
    
    if (loading) {
      classes += ' search-bar--loading';
    } else if (hasResults === true) {
      classes += ' search-bar--has-results';
    } else if (hasResults === false) {
      classes += ' search-bar--no-results';
    }
    
    return classes;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="Buscar libros">
      <div className={getSearchBarClasses()}>
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label="Campo de búsqueda"
          aria-describedby="search-help"
        />
        <button 
          type="submit"
          className="search-bar__btn"
          disabled={loading}
          aria-label={loading ? "Buscando..." : "Realizar búsqueda"}
        >
          {!loading && (
            <>
              <span>Buscar</span>
              <span aria-hidden="true">🔍</span>
            </>
          )}
        </button>
      </div>
      <div id="search-help" className="sr-only">
        Escribe para buscar por título, autor, género o cualquier campo del libro
      </div>
    </form>
  );
};

export default SearchBar;