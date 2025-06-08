import { useState, useEffect } from 'react';

export default function Filter({ categories, onFilterChange, maxPriceValue = 20 }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(maxPriceValue);

  // Update price range when maxPriceValue changes
  useEffect(() => {
    setPriceRange(maxPriceValue);
  }, [maxPriceValue]);

  function handleCategoryChange(categoryId) {
    setActiveCategory(categoryId);
    onFilterChange({ category: categoryId, maxPrice: priceRange });
  }

  function handlePriceChange(event) {
    const newPrice = parseInt(event.target.value);
    setPriceRange(newPrice);
    onFilterChange({ category: activeCategory, maxPrice: newPrice });
  }

  return (
    <div className="filter-container">
      <div className="category-filter">
        <h3>Categories</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="price-filter">
        <h3>Max Price: ${priceRange}</h3>
        <input
          type="range"
          min="5"
          max={maxPriceValue}
          step="1"
          value={priceRange}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-range-labels">
          <span>$5</span>
          <span>${maxPriceValue}</span>
        </div>
      </div>
    </div>
  );
} 