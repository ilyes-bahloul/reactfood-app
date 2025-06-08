import { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuItem from "./components/MenuItem";
import Cart from "./components/Cart";
import Filter from "./components/Filter";
import Pagination from "./components/Pagination";
import Chatbot from "./components/Chatbot";
import FoodDetail from "./components/FoodDetail";
import { CartContext, CartContextProvider } from './store/CartContext';

function MenuPage() {
  const [meals, setMeals] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Predefined food categories
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All' },
    { id: 'pasta', name: 'Pasta' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'salad', name: 'Salad' },
    { id: 'burger', name: 'Burgers' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'seafood', name: 'Seafood' },
    { id: 'breakfast', name: 'Breakfast' }
  ]);
  
  // Filter state
  const [filter, setFilter] = useState({
    category: 'all',
    maxPrice: 20
  });
  
  // Fetch meals from backend
  useEffect(() => {
    async function fetchMeals() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/meals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }
        
        const data = await response.json();
        
        // Process the data to ensure price is a number and fix image paths
        const processedData = data.map(meal => ({
          ...meal,
          price: parseFloat(meal.price),
          // Use relative path for images
          image: `/${meal.image}`,
          // Assign a category based on the meal name or description
          category: assignCategory(meal.name, meal.description)
        }));
        
        setMeals(processedData);
        setFilteredItems(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching meals:', error);
        setError('Failed to load meals. Please try again later.');
        setIsLoading(false);
      }
    }
    
    fetchMeals();
  }, []);
  
  // Assign a category based on meal name and description
  function assignCategory(name, description) {
    name = name.toLowerCase();
    description = description.toLowerCase();
    
    if (name.includes('pizza') || description.includes('pizza')) {
      return 'pizza';
    } else if (name.includes('pasta') || name.includes('spaghetti') || 
               description.includes('pasta') || name.includes('carbonara') || 
               name.includes('risotto')) {
      return 'pasta';
    } else if (name.includes('salad') || description.includes('salad')) {
      return 'salad';
    } else if (name.includes('burger') || description.includes('burger') || 
               name.includes('sandwich')) {
      return 'burger';
    } else if (name.includes('cake') || name.includes('brownie') || 
               name.includes('pancake') || description.includes('sweet') || 
               description.includes('dessert')) {
      return 'dessert';
    } else if (name.includes('seafood') || name.includes('fish') || 
               name.includes('shrimp') || name.includes('lobster') || 
               name.includes('sushi') || description.includes('seafood')) {
      return 'seafood';
    } else if (name.includes('breakfast') || name.includes('pancake') || 
               description.includes('breakfast')) {
      return 'breakfast';
    } else {
      return 'other';
    }
  }
  
  // Apply filters
  useEffect(() => {
    if (meals.length === 0) return;
    
    let result = [...meals];
    
    // Filter by category
    if (filter.category !== 'all') {
      result = result.filter(item => item.category === filter.category);
    }
    
    // Filter by price
    result = result.filter(item => item.price <= filter.maxPrice);
    
    setFilteredItems(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filter, meals]);
  
  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }
  
  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="menu-section">
      <h2 className="section-title">Our Menu</h2>
      
      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading meals...</p>
        </div>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <>
          <Filter 
            categories={categories} 
            onFilterChange={handleFilterChange} 
            maxPriceValue={Math.ceil(Math.max(...meals.map(meal => meal.price)))}
          />
          
          <main>
            {filteredItems.length === 0 ? (
              <p className="no-meals">No meals found matching your criteria.</p>
            ) : (
              <>
                <ul id="meals">
                  {currentItems.map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </ul>
                
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            )}
          </main>
        </>
      )}
    </section>
  );
}

function App() {
  const [cartIsShown, setCartIsShown] = useState(false);
  const [chatbotIsShown, setChatbotIsShown] = useState(false);

  function showCartHandler() {
    setCartIsShown(true);
  }

  function hideCartHandler() {
    setCartIsShown(false);
  }

  function showChatbotHandler() {
    setChatbotIsShown(true);
  }

  function hideChatbotHandler() {
    setChatbotIsShown(false);
  }

  return (
    <CartContextProvider>
      <Router>
        {cartIsShown && <Cart onClose={hideCartHandler} />}
        {chatbotIsShown && <Chatbot isOpen={chatbotIsShown} onClose={hideChatbotHandler} />}
        
        <header id="main-header">
          <div id="title">
            <img src="/logo.jpg" alt="Restaurant logo" />
            <h1>ReactFood</h1>
          </div>
          <CartButton onClick={showCartHandler} />
        </header>
        
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/food/:id" element={<FoodDetail />} />
        </Routes>

        {/* Chatbot Toggle Button */}
        <button className="chatbot-toggle" onClick={showChatbotHandler}>
          💬
        </button>
      </Router>
    </CartContextProvider>
  );
}

function CartButton({ onClick }) {
  const cartCtx = useContext(CartContext);
  
  const numberOfCartItems = cartCtx.items.reduce((curNumber, item) => {
    return curNumber + item.quantity;
  }, 0);
  
  return (
    <button className="button" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Cart ({numberOfCartItems})
    </button>
  );
}

export default App;
