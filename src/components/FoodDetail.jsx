import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../store/CartContext';
import ReviewSystem from './ReviewSystem';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [showNutrition, setShowNutrition] = useState(false);
  const [mealRating, setMealRating] = useState({ rating: 0, reviews: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMealDetail() {
      try {
        const response = await fetch('/api/meals');
        if (!response.ok) {
          throw new Error('Failed to fetch meal details');
        }
        const data = await response.json();
        const foundMeal = data.find(m => m.id === id);
        
        if (!foundMeal) {
          throw new Error('Meal not found');
        }
        
        // Enhanced meal data with additional details
        const enhancedMeal = {
          ...foundMeal,
          price: parseFloat(foundMeal.price),
          image: `/${foundMeal.image}`,
          // Add mock additional data for demonstration
          ingredients: generateIngredients(foundMeal.name, foundMeal.description),
          nutrition: generateNutrition(foundMeal.name),
          allergens: generateAllergens(foundMeal.name),
          preparationTime: generatePrepTime(foundMeal.name),
          difficulty: generateDifficulty(foundMeal.name),
          sizes: generateSizes(foundMeal.name, foundMeal.price)
        };
        setMeal(enhancedMeal);
        
        // Get dynamic rating from localStorage
        const savedReviews = localStorage.getItem(`reviews_${id}`);
        if (savedReviews) {
          const reviews = JSON.parse(savedReviews);
          const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0;
          setMealRating({ rating: avgRating, reviews: reviews.length });
        }
      } catch (error) {
        console.error('Error fetching meal details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMealDetail();
  }, [id]);

  // Listen for review updates to update the rating display
  useEffect(() => {
    const handleStorageChange = () => {
      const savedReviews = localStorage.getItem(`reviews_${id}`);
      if (savedReviews) {
        const reviews = JSON.parse(savedReviews);
        const avgRating = reviews.length > 0 
          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
          : 0;
        setMealRating({ rating: avgRating, reviews: reviews.length });
      }
    };

    // Listen for storage changes (when reviews are added)
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when reviews are updated in the same tab
    window.addEventListener('reviewsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reviewsUpdated', handleStorageChange);
    };
  }, [id]);

  // Helper functions to generate additional data
  function generateIngredients(name, description) {
    const ingredientMap = {
      'pizza': ['Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil', 'Pizza dough'],
      'pasta': ['Pasta', 'Parmesan cheese', 'Garlic', 'Olive oil', 'Fresh herbs'],
      'salad': ['Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Red onion', 'Dressing'],
      'burger': ['Beef patty', 'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Bun'],
      'chicken': ['Chicken breast', 'Herbs', 'Spices', 'Vegetables'],
      'seafood': ['Fresh seafood', 'Lemon', 'Herbs', 'Garlic', 'Olive oil']
    };

    for (let key in ingredientMap) {
      if (name.toLowerCase().includes(key)) {
        return ingredientMap[key];
      }
    }
    return ['Fresh ingredients', 'Herbs', 'Spices', 'Premium quality items'];
  }

  function generateNutrition(name) {
    const baseCalories = Math.floor(Math.random() * 400 + 300);
    return {
      calories: baseCalories,
      protein: Math.floor(baseCalories * 0.15 / 4) + 'g',
      carbs: Math.floor(baseCalories * 0.45 / 4) + 'g',
      fat: Math.floor(baseCalories * 0.30 / 9) + 'g',
      fiber: Math.floor(Math.random() * 8 + 2) + 'g'
    };
  }

  function generateAllergens(name) {
    const commonAllergens = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy'];
    const numAllergens = Math.floor(Math.random() * 3);
    return commonAllergens.slice(0, numAllergens);
  }

  function generatePrepTime(name) {
    if (name.toLowerCase().includes('salad')) return '10-15 min';
    if (name.toLowerCase().includes('pizza')) return '20-25 min';
    if (name.toLowerCase().includes('pasta')) return '15-20 min';
    return '15-25 min';
  }

  function generateDifficulty(name) {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  function generateSizes(name, basePrice) {
    const price = parseFloat(basePrice);
    return [
      { name: 'Small', price: price * 0.8, description: 'Perfect for light appetite' },
      { name: 'Regular', price: price, description: 'Our standard portion' },
      { name: 'Large', price: price * 1.3, description: 'Great for sharing or big appetite' }
    ];
  }

  function handleAddToCart() {
    const selectedSizeData = meal.sizes.find(size => size.name.toLowerCase() === selectedSize);
    const itemToAdd = {
      ...meal,
      price: selectedSizeData.price,
      size: selectedSize,
      quantity: quantity
    };

    for (let i = 0; i < quantity; i++) {
      cartCtx.addItem(itemToAdd);
    }

    // Show success message or animation
    alert(`Added ${quantity} ${selectedSize} ${meal.name} to cart!`);
  }

  if (loading) {
    return (
      <div className="food-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading meal details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="food-detail-error">
        <h2>{error}</h2>
        <button className="button" onClick={() => navigate('/')}>
          Back to Menu
        </button>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="food-detail-error">
        <h2>Meal not found</h2>
        <button className="button" onClick={() => navigate('/')}>
          Back to Menu
        </button>
      </div>
    );
  }

  const selectedSizeData = meal.sizes.find(size => size.name.toLowerCase() === selectedSize);

  return (
    <div className="food-detail">
      <button className="back-button" onClick={() => navigate('/')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Menu
      </button>

      <div className="food-detail-container">
        <div className="food-detail-image">
          <img src={meal.image} alt={meal.name} />
          <div className="food-detail-badge">
            <span className="rating">⭐ {mealRating.rating || '0.0'}</span>
            <span className="reviews">({mealRating.reviews} reviews)</span>
          </div>
        </div>

        <div className="food-detail-content">
          <div className="food-detail-header">
            <h1>{meal.name}</h1>
            <div className="food-detail-meta">
              <span className="prep-time">🕒 {meal.preparationTime}</span>
              <span className="difficulty">👨‍🍳 {meal.difficulty}</span>
            </div>
          </div>

          <p className="food-detail-description">{meal.description}</p>

          <div className="food-detail-ingredients">
            <h3>Ingredients</h3>
            <div className="ingredients-list">
              {meal.ingredients.map((ingredient, index) => (
                <span key={index} className="ingredient-tag">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {meal.allergens.length > 0 && (
            <div className="food-detail-allergens">
              <h3>⚠️ Contains</h3>
              <div className="allergens-list">
                {meal.allergens.map((allergen, index) => (
                  <span key={index} className="allergen-tag">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="food-detail-nutrition">
            <button 
              className="nutrition-toggle"
              onClick={() => setShowNutrition(!showNutrition)}
            >
              📊 Nutrition Facts {showNutrition ? '▼' : '▶'}
            </button>
            {showNutrition && (
              <div className="nutrition-info">
                <div className="nutrition-item">
                  <span>Calories</span>
                  <span>{meal.nutrition.calories}</span>
                </div>
                <div className="nutrition-item">
                  <span>Protein</span>
                  <span>{meal.nutrition.protein}</span>
                </div>
                <div className="nutrition-item">
                  <span>Carbs</span>
                  <span>{meal.nutrition.carbs}</span>
                </div>
                <div className="nutrition-item">
                  <span>Fat</span>
                  <span>{meal.nutrition.fat}</span>
                </div>
                <div className="nutrition-item">
                  <span>Fiber</span>
                  <span>{meal.nutrition.fiber}</span>
                </div>
              </div>
            )}
          </div>

          <div className="food-detail-order">
            <div className="size-selection">
              <h3>Choose Size</h3>
              <div className="size-options">
                {meal.sizes.map((size) => (
                  <label key={size.name} className={`size-option ${selectedSize === size.name.toLowerCase() ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="size"
                      value={size.name.toLowerCase()}
                      checked={selectedSize === size.name.toLowerCase()}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    />
                    <div className="size-info">
                      <span className="size-name">{size.name}</span>
                      <span className="size-price">${size.price.toFixed(2)}</span>
                      <span className="size-description">{size.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="order-summary">
              <div className="total-price">
                Total: ${(selectedSizeData.price * quantity).toFixed(2)}
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review System */}
      <div className="review-section-container">
        <ReviewSystem mealId={id} mealName={meal.name} />
      </div>
    </div>
  );
} 