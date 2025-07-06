import React, { useState, useMemo } from 'react';
import BookCard from './BookCard';
import Pagination from '../common/Pagination';

const BookList = ({ books, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const booksPerPage = 12;

  const sortedBooks = useMemo(() => {
    const sorted = [...books].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [books, sortBy, sortOrder]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * booksPerPage;
    return sortedBooks.slice(startIndex, startIndex + booksPerPage);
  }, [sortedBooks, currentPage, booksPerPage]);

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="book-list__loading">Cargando libros...</div>;
  }

  if (books.length === 0) {
    return (
      <div className="book-list__empty">
        <h3>No se encontraron libros</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      <div className="book-list__header">
        <div className="book-list__info">
          <span className="book-list__count">{books.length} libros encontrados</span>
        </div>
        
        <div className="book-list__sort">
          <label className="book-list__sort-label">Ordenar por:</label>
          <select
            className="book-list__sort-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
              setCurrentPage(1);
            }}
          >
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="author-asc">Autor (A-Z)</option>
            <option value="author-desc">Autor (Z-A)</option>
            <option value="year-desc">Año (Reciente)</option>
            <option value="year-asc">Año (Antiguo)</option>
            <option value="rating-desc">Calificación (Alta)</option>
            <option value="rating-asc">Calificación (Baja)</option>
            <option value="price-asc">Precio (Menor)</option>
            <option value="price-desc">Precio (Mayor)</option>
          </select>
        </div>
      </div>

      <div className="book-list__grid">
        {paginatedBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BookList;