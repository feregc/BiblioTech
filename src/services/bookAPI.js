// services/booksAPI.js

import { useState } from "react";

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b';

// Función para buscar libros por título
export const searchBooksByTitle = async (title, limit = 10) => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/search.json?title=${encodeURIComponent(title)}&limit=${limit}`
    );
    const data = await response.json();
    
    return data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Autor desconocido',
      isbn: book.isbn?.[0],
      year: book.first_publish_year,
      pages: book.number_of_pages_median,
      language: getLanguageName(book.language?.[0]),
      publisher: book.publisher?.[0],
      subjects: book.subject?.slice(0, 3) || [],
      coverImage: book.cover_i ? `${COVERS_BASE}/id/${book.cover_i}-L.jpg` : null,
      rating: generateRandomRating(),
      price: generateRandomPrice()
    }));
  } catch (error) {
    console.error('Error buscando libros:', error);
    return [];
  }
};

// Función para obtener detalles de un libro específico
export const getBookDetails = async (bookKey) => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}${bookKey}.json`);
    const book = await response.json();
    
    // Obtener información adicional del autor si está disponible
    let authorInfo = null;
    if (book.authors?.[0]?.author?.key) {
      authorInfo = await getAuthorInfo(book.authors[0].author.key);
    }
    
    return {
      id: book.key,
      title: book.title,
      author: authorInfo?.name || 'Autor desconocido',
      description: book.description?.value || book.description || 'Descripción no disponible',
      isbn: book.isbn_13?.[0] || book.isbn_10?.[0],
      year: book.publish_date,
      pages: book.number_of_pages,
      language: getLanguageName(book.languages?.[0]?.key),
      publisher: book.publishers?.[0],
      subjects: book.subjects?.slice(0, 5) || [],
      coverImage: book.covers?.[0] ? `${COVERS_BASE}/id/${book.covers[0]}-L.jpg` : null,
      rating: generateRandomRating(),
      price: generateRandomPrice(),
      available: Math.random() > 0.1 // 90% disponible
    };
  } catch (error) {
    console.error('Error obteniendo detalles del libro:', error);
    return null;
  }
};

// Función para obtener información del autor
export const getAuthorInfo = async (authorKey) => {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE}${authorKey}.json`);
    const author = await response.json();
    
    return {
      name: author.name,
      birthDate: author.birth_date,
      bio: author.bio?.value || author.bio
    };
  } catch (error) {
    console.error('Error obteniendo información del autor:', error);
    return null;
  }
};

// Función para buscar por ISBN
export const searchBookByISBN = async (isbn) => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;
    
    if (data[bookKey]) {
      const book = data[bookKey];
      return {
        id: bookKey,
        title: book.title,
        author: book.authors?.[0]?.name || 'Autor desconocido',
        isbn: isbn,
        year: book.publish_date,
        pages: book.number_of_pages,
        publisher: book.publishers?.[0]?.name,
        coverImage: book.cover?.large || book.cover?.medium || book.cover?.small,
        description: 'Descripción no disponible desde ISBN',
        rating: generateRandomRating(),
        price: generateRandomPrice(),
        available: true
      };
    }
    return null;
  } catch (error) {
    console.error('Error buscando por ISBN:', error);
    return null;
  }
};

// Función para obtener libros por categoría/tema
export const searchBooksBySubject = async (subject, limit = 20) => {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/subjects/${subject.toLowerCase()}.json?limit=${limit}`
    );
    const data = await response.json();
    
    return data.works?.map(book => ({
      id: book.key,
      title: book.title,
      author: book.authors?.[0]?.name || 'Autor desconocido',
      coverImage: book.cover_id ? `${COVERS_BASE}/id/${book.cover_id}-L.jpg` : null,
      year: book.first_publish_year,
      subjects: book.subject?.slice(0, 3) || [subject],
      rating: generateRandomRating(),
      price: generateRandomPrice(),
      available: Math.random() > 0.15 // 85% disponible
    })) || [];
  } catch (error) {
    console.error('Error buscando por tema:', error);
    return [];
  }
};

// Funciones auxiliares
const getLanguageName = (langCode) => {
  const languages = {
    'eng': 'Inglés',
    'spa': 'Español',
    'fre': 'Francés',
    'ger': 'Alemán',
    'ita': 'Italiano',
    'por': 'Portugués',
    '/languages/eng': 'Inglés',
    '/languages/spa': 'Español',
    '/languages/fre': 'Francés',
    '/languages/ger': 'Alemán'
  };
  return languages[langCode] || 'Idioma desconocido';
};

const generateRandomRating = () => {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // Entre 3.0 y 5.0
};

const generateRandomPrice = () => {
  return Math.round((Math.random() * 20 + 8) * 100) / 100; // Entre €8.00 y €28.00
};

// Hook personalizado para usar la API
export const useBooksAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchBooks = async (query, type = 'title') => {
    setLoading(true);
    setError(null);
    
    try {
      let results = [];
      
      switch (type) {
        case 'title':
          results = await searchBooksByTitle(query);
          break;
        case 'isbn':
          const book = await searchBookByISBN(query);
          results = book ? [book] : [];
          break;
        case 'subject':
          results = await searchBooksBySubject(query);
          break;
        default:
          results = await searchBooksByTitle(query);
      }
      
      return results;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getBook = async (bookKey) => {
    setLoading(true);
    setError(null);
    
    try {
      const book = await getBookDetails(bookKey);
      return book;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    searchBooks,
    getBook,
    loading,
    error
  };
};