// data/booksDataWithAPI.js
import { searchBooksByTitle, searchBooksBySubject } from '../services/bookAPI';

// Datos base que quieres mantener con información real de la API
export const getEnhancedBooksData = async () => {
  const bookSearchTerms = [
    { title: 'Don Quixote', category: 'Clásicos' },
    { title: 'One Hundred Years of Solitude', category: 'Realismo Mágico' },
    { title: 'Pride and Prejudice', category: 'Clásicos' },
    { title: 'Dune', category: 'Ciencia Ficción' },
    { title: 'Foundation', category: 'Ciencia Ficción' },
    { title: 'The Name of the Rose', category: 'Misterio' },
    { title: 'Sherlock Holmes', category: 'Misterio' },
    { title: 'Me Before You', category: 'Romance' },
    { title: 'Outlander', category: 'Romance' },
    { title: 'Sapiens', category: 'Historia' },
    { title: 'The Pillars of the Earth', category: 'Historia' },
    { title: 'Steve Jobs', category: 'Biografías' },
    { title: 'Leonardo da Vinci', category: 'Biografías' },
    { title: 'The Art of War', category: 'Ensayos' },
    { title: 'Letters to a Young Poet', category: 'Ensayos' },
    { title: 'Twenty Love Poems', category: 'Poesía' },
    { title: 'Leaves of Grass', category: 'Poesía' }
  ];

  const enhancedBooks = [];
  let id = 1;

  for (const searchTerm of bookSearchTerms) {
    try {
      const apiBooks = await searchBooksByTitle(searchTerm.title, 1);
      
      if (apiBooks.length > 0) {
        const apiBook = apiBooks[0];
        
        enhancedBooks.push({
          id: id++,
          title: apiBook.title || searchTerm.title,
          author: apiBook.author || 'Autor desconocido',
          category: searchTerm.category,
          year: apiBook.year || 2000,
          isbn: apiBook.isbn || `978-84-376-${String(id).padStart(4, '0')}-${Math.floor(Math.random() * 10)}`,
          pages: apiBook.pages || Math.floor(Math.random() * 500) + 200,
          language: apiBook.language || 'Español',
          publisher: apiBook.publisher || 'Editorial Planeta',
          available: apiBook.available !== false,
          rating: apiBook.rating || (Math.random() * 2 + 3),
          description: generateDescription(searchTerm.title, searchTerm.category),
          image: apiBook.coverImage || `/images/${searchTerm.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          price: apiBook.price || (Math.random() * 20 + 8)
        });
      }
    } catch (error) {
      console.error(`Error buscando ${searchTerm.title}:`, error);
      // Fallback a datos estáticos si la API falla
      enhancedBooks.push(createFallbackBook(searchTerm, id++));
    }
  }

  return enhancedBooks;
};

// Función para generar descripciones basadas en categoría
const generateDescription = (title, category) => {
  const descriptions = {
    'Clásicos': `Una obra maestra de la literatura clásica que ha perdurado a través del tiempo. ${title} es considerado un texto fundamental que ha influenciado generaciones de lectores y escritores.`,
    'Realismo Mágico': `Una extraordinaria mezcla de realidad y fantasía que caracteriza al realismo mágico. ${title} transporta al lector a un mundo donde lo imposible se vuelve cotidiano.`,
    'Ciencia Ficción': `Una fascinante exploración del futuro y la tecnología. ${title} presenta conceptos innovadores que desafían nuestra comprensión del universo y la humanidad.`,
    'Misterio': `Un intrigante enigma que mantendrá al lector en vilo hasta la última página. ${title} presenta un caso complejo lleno de pistas y giros inesperados.`,
    'Romance': `Una emotiva historia de amor que explora las complejidades de las relaciones humanas. ${title} combina pasión, drama y personajes inolvidables.`,
    'Historia': `Una perspectiva fascinante sobre eventos históricos importantes. ${title} ofrece una mirada profunda a momentos cruciales que han formado nuestro mundo.`,
    'Biografías': `La inspiradora historia de una figura notable. ${title} revela los triunfos, desafíos y legado de una personalidad extraordinaria.`,
    'Ensayos': `Una reflexión profunda sobre temas universales. ${title} presenta ideas provocativas que invitan al lector a cuestionar y reflexionar.`,
    'Poesía': `Una colección de versos que capturan la esencia de la experiencia humana. ${title} expresa emociones y pensamientos a través del poder de las palabras.`
  };
  
  return descriptions[category] || `Una obra notable en su género. ${title} ofrece una experiencia de lectura única e inolvidable.`;
};

// Función de respaldo si la API falla
const createFallbackBook = (searchTerm, id) => ({
  id,
  title: searchTerm.title,
  author: 'Autor clásico',
  category: searchTerm.category,
  year: 2000,
  isbn: `978-84-376-${String(id).padStart(4, '0')}-${Math.floor(Math.random() * 10)}`,
  pages: Math.floor(Math.random() * 500) + 200,
  language: 'Español',
  publisher: 'Editorial Clásica',
  available: true,
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  description: generateDescription(searchTerm.title, searchTerm.category),
  image: `/images/${searchTerm.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
  price: Math.round((Math.random() * 20 + 8) * 100) / 100
});

// Hook para cargar datos de libros con API
export const useBooksData = () => {
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const books = await getEnhancedBooksData();
        setBooksData(books);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return { booksData, loading, error };
};

// Función para agregar un libro desde la API a la base de datos local
export const addBookFromAPI = async (searchQuery) => {
  try {
    const apiBooks = await searchBooksByTitle(searchQuery, 1);
    
    if (apiBooks.length > 0) {
      const apiBook = apiBooks[0];
      
      return {
        id: Date.now(), // ID temporal
        title: apiBook.title,
        author: apiBook.author,
        category: 'General', // Categoría por defecto
        year: apiBook.year,
        isbn: apiBook.isbn,
        pages: apiBook.pages,
        language: apiBook.language,
        publisher: apiBook.publisher,
        available: true,
        rating: apiBook.rating,
        description: apiBook.description || 'Descripción no disponible',
        image: apiBook.coverImage,
        price: apiBook.price
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error agregando libro desde API:', error);
    return null;
  }
};

// Función para actualizar un libro existente con datos de la API
export const updateBookWithAPIData = async (book, searchQuery = null) => {
  try {
    const query = searchQuery || book.title;
    const apiBooks = await searchBooksByTitle(query, 1);
    
    if (apiBooks.length > 0) {
      const apiBook = apiBooks[0];
      
      return {
        ...book,
        // Mantener datos originales importantes, actualizar lo que viene de la API
        author: apiBook.author || book.author,
        year: apiBook.year || book.year,
        isbn: apiBook.isbn || book.isbn,
        pages: apiBook.pages || book.pages,
        language: apiBook.language || book.language,
        publisher: apiBook.publisher || book.publisher,
        image: apiBook.coverImage || book.image,
        // Mantener rating y precio originales si existen
        rating: book.rating || apiBook.rating,
        price: book.price || apiBook.price
      };
    }
    
    return book; // Devolver libro original si no hay datos de API
  } catch (error) {
    console.error('Error actualizando libro con API:', error);
    return book;
  }
};