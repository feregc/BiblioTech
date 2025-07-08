import React from 'react';
import { categories, languages, publishers } from '../../data/booksData';

const AdvancedFilters = ({ filters, onFiltersChange, onReset }) => {
  const handleFilterChange = (filterName, value) => {
    onFiltersChange({ [filterName]: value });
  };

  const handleRangeChange = (rangeName, bound, value) => {
    // Validar que el valor no esté vacío y sea un número válido
    const numValue = value === '' ? (bound === 'min' ? 0 : Infinity) : parseInt(value);
    
    onFiltersChange({
      [rangeName]: {
        ...filters[rangeName],
        [bound]: numValue
      }
    });
  };

  return (
    <div className="advanced-filters">
      <div className="advanced-filters__header">
        <h3 className="advanced-filters__title">Filtros Avanzados</h3>
        <button 
          className="advanced-filters__reset"
          onClick={onReset}
        >
          Limpiar
        </button>
      </div>

      <div className="advanced-filters__grid">
        <div className="filter-group">
          <label className="filter-group__label">Categoría</label>
          <select
            className="filter-group__select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-group__label">Idioma</label>
          <select
            className="filter-group__select"
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
          >
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-group__label">Editorial</label>
          <select
            className="filter-group__select"
            value={filters.publisher}
            onChange={(e) => handleFilterChange('publisher', e.target.value)}
          >
            {publishers.map(publisher => (
              <option key={publisher} value={publisher}>{publisher}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-group__label">Año de Publicación</label>
          <div className="filter-group__range">
            <input
              type="number"
              className="filter-group__input"
              placeholder="Desde"
              value={filters.yearRange.min}
              min="1500"
              max="2024"
              onChange={(e) => handleRangeChange('yearRange', 'min', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              className="filter-group__input"
              placeholder="Hasta"
              value={filters.yearRange.max}
              min="1500"
              max="2024"
              onChange={(e) => handleRangeChange('yearRange', 'max', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-group__label">Rango de Precio ($)</label>
          <div className="filter-group__range">
            <input
              type="number"
              className="filter-group__input"
              placeholder="Min"
              value={filters.priceRange.min}
              min="0"
              step="0.01"
              onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              className="filter-group__input"
              placeholder="Max"
              value={filters.priceRange.max}
              min="0"
              step="0.01"
              onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-group__label">Calificación Mínima</label>
          <input
            type="range"
            className="filter-group__range-slider"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
          />
          <span className="filter-group__range-value">{filters.minRating} ⭐</span>
        </div>

        <div className="filter-group">
          <label className="filter-group__checkbox">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
            />
            Solo disponibles
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;