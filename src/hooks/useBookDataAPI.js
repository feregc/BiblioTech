import { useState, useEffect } from 'react';
import { getEnhancedBooksData } from '../data/booksDataAPI';
import { booksData as staticBooksData } from '../data/booksData'; // Tu datos originales como fallback

export const useBooksData = () => {
  const [booksData, setBooksData] = useState(staticBooksData); // Cargar datos estáticos primero
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useAPI, setUseAPI] = useState(true); // Toggle para usar API o datos estáticos

  const loadBooksFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiBooks = await getEnhancedBooksData();
      setBooksData(apiBooks);
    } catch (err) {
      console.error('Error cargando desde API:', err);
      setError(err.message);
      // En caso de error, mantener los datos estáticos
      setBooksData(staticBooksData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useAPI) {
      loadBooksFromAPI();
    }
  }, [useAPI]);

  const toggleDataSource = () => {
    if (useAPI) {
      setBooksData(staticBooksData);
      setUseAPI(false);
    } else {
      setUseAPI(true);
      loadBooksFromAPI();
    }
  };

  const refreshAPIData = () => {
    if (useAPI) {
      loadBooksFromAPI();
    }
  };

  return { 
    booksData, 
    loading, 
    error, 
    useAPI, 
    toggleDataSource,
    refreshAPIData
  };
};