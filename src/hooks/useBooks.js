import { useState, useEffect, useMemo } from "react";
import { booksData } from "../data/booksData";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "Todos",
    language: "Todos",
    publisher: "Todos",
    yearRange: { min: 1500, max: 2024 },
    priceRange: { min: 0, max: 100 },
    availableOnly: false,
    minRating: 0,
  });

  // Simular carga de datos
  useEffect(() => {
    const loadBooks = () => {
      setLoading(true);
      setTimeout(() => {
        setBooks(booksData);
        setLoading(false);
      }, 1000);
    };
    loadBooks();
  }, []);

  // Filtrar libros basado en los filtros aplicados
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Búsqueda completa por todos los atributos del libro
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower) ||
        book.language.toLowerCase().includes(searchLower) ||
        book.publisher.toLowerCase().includes(searchLower) ||
        book.year.toString().includes(searchLower) ||
        book.pages.toString().includes(searchLower) ||
        book.rating.toString().includes(searchLower) ||
        book.price.toString().includes(searchLower) ||
        (book.description && book.description.toLowerCase().includes(searchLower)) ||
        (book.available ? 'disponible' : 'no disponible').includes(searchLower);
      
      const matchesCategory =
        filters.category === "Todos" || book.category === filters.category;
      const matchesLanguage =
        filters.language === "Todos" || book.language === filters.language;
      const matchesPublisher =
        filters.publisher === "Todos" || book.publisher === filters.publisher;
      const matchesYear =
        book.year >= filters.yearRange.min &&
        book.year <= filters.yearRange.max;
      const matchesPrice =
        book.price >= filters.priceRange.min &&
        book.price <= filters.priceRange.max;
      const matchesAvailability = !filters.availableOnly || book.available;
      const matchesRating = book.rating >= filters.minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLanguage &&
        matchesPublisher &&
        matchesYear &&
        matchesPrice &&
        matchesAvailability &&
        matchesRating
      );
    });
  }, [books, filters]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "Todos",
      language: "Todos",
      publisher: "Todos",
      yearRange: { min: 1500, max: 2024 },
      priceRange: { min: 0, max: 100 },
      availableOnly: false,
      minRating: 0,
    });
  };

  return {
    books: filteredBooks,
    loading,
    filters,
    updateFilters,
    resetFilters,
    totalBooks: books.length,
    filteredCount: filteredBooks.length,
  };
};